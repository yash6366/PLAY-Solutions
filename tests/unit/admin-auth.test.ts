import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword } from "@/server/auth/passwords";
import { signAdminSession, verifyAdminSession, AdminRole } from "@/server/auth/jwt";
import { AuthError } from "@/server/auth/session";

describe("Admin Authentication Unit Tests", () => {
  beforeAll(() => {
    process.env.AUTH_SECRET = "test-secret-must-be-at-least-32-characters-long-for-hs256";
  });

  describe("Password Hashing & Verification", () => {
    it("should securely hash a plaintext password with bcrypt", async () => {
      const password = "SecureAdminPassword!2026";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2")).toBe(true); // standard bcrypt prefix
    });

    it("should successfully verify a correct password against hash", async () => {
      const password = "CorrectHorseBatteryStaple!";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password against hash", async () => {
      const password = "CorrectPassword123";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword("WrongPassword456", hash);
      expect(isValid).toBe(false);
    });

    it("should generate distinct hashes for identical passwords due to salt", async () => {
      const password = "IdenticalPassword!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe("JWT Token Issuance & Verification", () => {
    const mockSession = {
      userId: "usr_admin_123",
      email: "security@playqsolutions.com",
      name: "Security Lead",
      role: "ADMIN" as AdminRole,
    };

    it("should sign and verify a valid admin session JWT", async () => {
      const token = await signAdminSession(mockSession);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const payload = await verifyAdminSession(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(mockSession.userId);
      expect(payload?.email).toBe(mockSession.email);
      expect(payload?.name).toBe(mockSession.name);
      expect(payload?.role).toBe("ADMIN");
    });

    it("should reject a tampered token", async () => {
      const token = await signAdminSession(mockSession);
      const tamperedToken = token.slice(0, -6) + "xxxxxx";

      const payload = await verifyAdminSession(tamperedToken);
      expect(payload).toBeNull();
    });

    it("should reject an arbitrary invalid string token", async () => {
      const payload = await verifyAdminSession("invalid.token.payload");
      expect(payload).toBeNull();
    });
  });

  describe("AuthError Status Code & Classification", () => {
    it("should produce 401 for UNAUTHENTICATED error", () => {
      const err = new AuthError("UNAUTHENTICATED", "No session found");
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe("UNAUTHENTICATED");
    });

    it("should produce 403 for FORBIDDEN error", () => {
      const err = new AuthError("FORBIDDEN", "Insufficient role");
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe("FORBIDDEN");
    });
  });
});
