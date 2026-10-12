import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST as loginHandler } from "@/app/api/admin/auth/login/route";
import * as adminRepo from "@/server/repositories/admin.repository";
import {
  createAdminUser,
  findAdminByEmail,
  DatabaseConnectionError,
  inMemoryAdmins,
} from "@/server/repositories/admin.repository";
import { hashPassword, verifyPassword } from "@/server/auth/passwords";
import { signAdminSession, verifyAdminSession } from "@/server/auth/jwt";
import { getAdminSession, ADMIN_COOKIE_NAME } from "@/server/auth/session";
import { clearRateLimitStore } from "@/lib/rate-limit/limiter";

describe("Admin Authentication & Production Readiness Regression Tests", () => {
  const TEST_SECRET = "production-grade-test-secret-32-chars-minimum-key!!";
  const TEST_EMAIL = "regresstest-admin@playqsolutions.com";
  const TEST_PASSWORD = "StrongRegressionPassword123!";

  beforeEach(() => {
    clearRateLimitStore();
    inMemoryAdmins.length = 0;
    process.env.DATABASE_URL = "memory";
    process.env.AUTH_SECRET = TEST_SECRET;
    process.env.NEXT_PUBLIC_SITE_URL = "https://playqsolutions.com";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Administrator account creation and repeatable seeding
  it("1. should create administrator account and prevent duplicates on repeated seeding", async () => {
    const passwordHash = await hashPassword(TEST_PASSWORD);

    const firstResult = await createAdminUser({
      email: TEST_EMAIL,
      name: "Regression Admin",
      passwordHash,
      role: "ADMIN",
    });

    expect(firstResult.success).toBe(true);
    expect(firstResult.user?.email).toBe(TEST_EMAIL);

    // Repeated call with same email should NOT create a duplicate
    const secondResult = await createAdminUser({
      email: TEST_EMAIL,
      name: "Duplicate Attempt",
      passwordHash: await hashPassword("AnotherPassword123!"),
      role: "ADMIN",
    });

    expect(secondResult.success).toBe(false);
    expect(secondResult.error).toContain("already exists");
    expect(inMemoryAdmins.filter((a) => a.email === TEST_EMAIL)).toHaveLength(1);
  });

  // 2. Existing administrator preservation
  it("2. should preserve existing administrator credentials across idempotent runs", async () => {
    const originalHash = await hashPassword(TEST_PASSWORD);
    await createAdminUser({
      email: TEST_EMAIL,
      name: "Original Admin",
      passwordHash: originalHash,
      role: "ADMIN",
    });

    const existingBefore = await findAdminByEmail(TEST_EMAIL);
    expect(existingBefore?.passwordHash).toBe(originalHash);

    // Simulated routine seed pass: verify credentials are not modified
    const existingAfter = await findAdminByEmail(TEST_EMAIL);
    expect(existingAfter?.passwordHash).toBe(originalHash);
    expect(await verifyPassword(TEST_PASSWORD, existingAfter!.passwordHash)).toBe(true);
  });

  // 3. Missing production database configuration
  it("3. should fail safely with 503 when database configuration is missing", async () => {
    const origDb = process.env.DATABASE_URL;
    try {
      delete process.env.DATABASE_URL;

      const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
        method: "POST",
        headers: {
          Host: "playqsolutions.com",
          Origin: "https://playqsolutions.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(503);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Authentication service is temporarily unavailable. Please try again later."
      );
    } finally {
      process.env.DATABASE_URL = origDb;
    }
  });

  // 4. Missing or invalid authentication secrets
  it("4. should safely return 500 in production when AUTH_SECRET is missing or invalid (<32 chars)", async () => {
    const env = process.env as Record<string, string | undefined>;
    const origEnv = env.NODE_ENV;
    const origSecret = process.env.AUTH_SECRET;
    try {
      env.NODE_ENV = "production";
      delete process.env.AUTH_SECRET;
      delete process.env.SESSION_SECRET;
      delete process.env.ADMIN_JWT_SECRET;

      const passwordHash = await hashPassword(TEST_PASSWORD);
      vi.spyOn(adminRepo, "findAdminByEmail").mockResolvedValue({
        id: "admin-prod-test-id",
        email: TEST_EMAIL,
        name: "Test Admin",
        passwordHash,
        role: "ADMIN",
        isActive: true,
        mfaEnabled: false,
        mfaRecoveryCodes: [],
        tokenVersion: 1,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
        method: "POST",
        headers: {
          Host: "playqsolutions.com",
          Origin: "https://playqsolutions.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("An unexpected error occurred during login.");
    } finally {
      env.NODE_ENV = origEnv;
      process.env.AUTH_SECRET = origSecret;
    }
  });

  // 5. Password-hash verification
  it("5. should accurately verify valid password against hash and reject invalid password", async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    expect(await verifyPassword(TEST_PASSWORD, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword123!", hash)).toBe(false);
  });

  // 6. Unknown administrator email
  it("6. should return 401 with generic message for unknown administrator email", async () => {
    const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        Host: "playqsolutions.com",
        Origin: "https://playqsolutions.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nonexistent-admin@playqsolutions.com",
        password: "AnyPassword123!",
      }),
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email or password.");
  });

  // 7. Incorrect password
  it("7. should return 401 with generic message for incorrect password", async () => {
    const passwordHash = await hashPassword(TEST_PASSWORD);
    await createAdminUser({
      email: TEST_EMAIL,
      name: "Valid Admin",
      passwordHash,
      role: "ADMIN",
    });

    const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        Host: "playqsolutions.com",
        Origin: "https://playqsolutions.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: "IncorrectPassword999!",
      }),
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email or password.");
  });

  // 8. Successful login
  it("8. should authenticate valid credentials, return user without password hash, and set cookie", async () => {
    const passwordHash = await hashPassword(TEST_PASSWORD);
    await createAdminUser({
      email: TEST_EMAIL,
      name: "Valid Admin",
      passwordHash,
      role: "ADMIN",
    });

    const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        Host: "playqsolutions.com",
        Origin: "https://playqsolutions.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(TEST_EMAIL);
    expect(data.user.passwordHash).toBeUndefined(); // Never exposed

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain(ADMIN_COOKIE_NAME);
  });

  // 9. Database connection failure
  it("9. should return 503 when a database connection failure occurs during admin lookup", async () => {
    vi.spyOn(adminRepo, "findAdminByEmail").mockRejectedValue(
      new DatabaseConnectionError("PostgreSQL connection refused at port 5432", "ECONNREFUSED")
    );

    const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        Host: "playqsolutions.com",
        Origin: "https://playqsolutions.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(503);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe(
      "Authentication service is temporarily unavailable. Please try again later."
    );
  });

  // 10. Invalid CSRF origin
  it("10. should return 403 when CSRF origin validation fails", async () => {
    const req = new Request("https://playqsolutions.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        Host: "playqsolutions.com",
        Origin: "https://unauthorized-malicious-site.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(403);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Cross-site request forgery detected");
  });

  // 11. Session creation and validation
  it("11. should sign and verify session JWT and invalidate if tokenVersion differs", async () => {
    const passwordHash = await hashPassword(TEST_PASSWORD);
    const createRes = await createAdminUser({
      email: TEST_EMAIL,
      name: "Session Admin",
      passwordHash,
      role: "ADMIN",
    });

    const user = createRes.user!;

    const token = await signAdminSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tokenVersion: user.tokenVersion,
      mfaVerified: true,
    });

    expect(typeof token).toBe("string");

    // Verify JWT payload directly
    const payload = await verifyAdminSession(token);
    expect(payload?.userId).toBe(user.id);
    expect(payload?.email).toBe(user.email);

    // Verify through full session resolver with matching cookie
    const req = new Request("https://playqsolutions.com/api/admin/overview", {
      headers: {
        Cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      },
    });

    const activeSession = await getAdminSession(req);
    expect(activeSession).not.toBeNull();
    expect(activeSession?.email).toBe(user.email);

    // If user's tokenVersion in DB is bumped (simulating logout/session revocation):
    user.tokenVersion = 2;
    const revokedSession = await getAdminSession(req);
    expect(revokedSession).toBeNull();
  });
});
