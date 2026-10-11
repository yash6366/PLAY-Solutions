import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { POST as loginHandler } from "@/app/api/admin/auth/login/route";
import { POST as mfaVerifyHandler } from "@/app/api/admin/auth/mfa/verify/route";
import { POST as mfaSetupHandler } from "@/app/api/admin/auth/mfa/setup/route";
import { POST as mfaConfirmHandler } from "@/app/api/admin/auth/mfa/confirm/route";
import { POST as mfaResetHandler } from "@/app/api/admin/auth/mfa/reset/route";
import { GET as overviewHandler } from "@/app/api/admin/overview/route";
import { createAdminUser, findAdminByEmail } from "@/server/repositories/admin.repository";
import { generateTotpSecret, generateTotpToken, generateRecoveryCodes } from "@/server/auth/totp";
import { signAdminSession, AdminRole } from "@/server/auth/jwt";
import { hashPassword } from "@/server/auth/passwords";
import { ADMIN_COOKIE_NAME } from "@/server/auth/session";
import { clearRateLimitStore } from "@/lib/rate-limit/limiter";

describe("Admin Multi-Factor Authentication (MFA) Integration Tests", () => {
  let mfaAdminEmail: string;
  let mfaSecret: string;
  let recoveryCodes: { plaintextCodes: string[]; hashedCodes: string[] };
  let verifiedSuperAdminToken: string;
  let unenrolledSuperAdminToken: string;
  let unenrolledSuperAdminId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = "memory";
    process.env.AUTH_SECRET = "production-grade-secret-key-at-least-32-chars-long";

    const passwordHash = await hashPassword("MfaPassword123!");
    const secretObj = generateTotpSecret();
    mfaSecret = secretObj.secret;
    recoveryCodes = generateRecoveryCodes(4);

    mfaAdminEmail = "mfa-admin@playqsolutions.com";
    let admin = await findAdminByEmail(mfaAdminEmail);
    if (!admin) {
      const res = await createAdminUser({
        email: mfaAdminEmail,
        name: "MFA Administrator",
        passwordHash,
        role: "SUPER_ADMIN" as AdminRole,
        mfaEnabled: true,
        mfaSecret,
        mfaRecoveryCodes: recoveryCodes.hashedCodes,
      });
      admin = res.user!;
    }

    verifiedSuperAdminToken = await signAdminSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mfaVerified: true,
    });

    // Create an unenrolled SUPER_ADMIN to verify mandatory enrollment enforcement
    const unenrolledEmail = "unenrolled-superadmin@playqsolutions.com";
    let unenrolled = await findAdminByEmail(unenrolledEmail);
    if (!unenrolled) {
      const res = await createAdminUser({
        email: unenrolledEmail,
        name: "Unenrolled SuperAdmin",
        passwordHash,
        role: "SUPER_ADMIN" as AdminRole,
      });
      unenrolled = res.user!;
    }
    unenrolledSuperAdminId = unenrolled.id;

    unenrolledSuperAdminToken = await signAdminSession({
      userId: unenrolled.id,
      email: unenrolled.email,
      name: unenrolled.name,
      role: unenrolled.role,
      mfaVerified: false,
    });
  });

  beforeEach(async () => {
    clearRateLimitStore();
    const admin = await findAdminByEmail(mfaAdminEmail);
    if (admin) {
      admin.lastMfaStep = null;
    }
  });

  describe("1. Login with MFA Challenge", () => {
    it("should require MFA challenge and NOT issue session cookie on password verification", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.mfaRequired).toBe(true);
      expect(json.challengeToken).toBeDefined();

      // Ensure NO authenticated session cookie is issued yet
      const setCookie = res.headers.get("set-cookie");
      expect(setCookie).toBeNull();
    });

    it("should prevent an incomplete MFA challenge token from accessing protected APIs", async () => {
      const loginReq = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });

      const loginRes = await loginHandler(loginReq);
      const { challengeToken } = await loginRes.json();

      const overviewReq = new Request("http://localhost:3000/api/admin/overview", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${challengeToken}`,
        },
      });

      const overviewRes = await overviewHandler(overviewReq);
      expect(overviewRes.status).toBe(401);
    });

    it("should strictly block an un-enrolled SUPER_ADMIN from protected APIs before MFA verification", async () => {
      const overviewReq = new Request("http://localhost:3000/api/admin/overview", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${unenrolledSuperAdminToken}`,
        },
      });

      const overviewRes = await overviewHandler(overviewReq);
      expect(overviewRes.status).toBe(403);
      const json = await overviewRes.json();
      expect(json.error).toContain("MFA_REQUIRED");
    });
  });

  describe("2. MFA Code Verification & Session Completion", () => {
    it("should reject an invalid 6-digit TOTP code (401)", async () => {
      const loginReq = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const loginRes = await loginHandler(loginReq);
      const { challengeToken } = await loginRes.json();

      const verifyReq = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken,
          code: "000000",
        }),
      });

      const verifyRes = await mfaVerifyHandler(verifyReq);
      expect(verifyRes.status).toBe(401);
    });

    it("should accept a valid 6-digit TOTP code and issue authenticated session cookie", async () => {
      const loginReq = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const loginRes = await loginHandler(loginReq);
      const { challengeToken } = await loginRes.json();

      const validTotpCode = generateTotpToken(mfaSecret);

      const verifyReq = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken,
          code: validTotpCode,
        }),
      });

      const verifyRes = await mfaVerifyHandler(verifyReq);
      const json = await verifyRes.json();

      expect(verifyRes.status).toBe(200);
      expect(json.success).toBe(true);

      const setCookie = verifyRes.headers.get("set-cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain(ADMIN_COOKIE_NAME);
    });

    it("should reject replayed TOTP codes within the same time step", async () => {
      const loginReq1 = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const loginRes1 = await loginHandler(loginReq1);
      const { challengeToken: token1 } = await loginRes1.json();

      const validTotpCode = generateTotpToken(mfaSecret);

      // First verification succeeds
      const verifyReq1 = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: token1,
          code: validTotpCode,
        }),
      });
      const verifyRes1 = await mfaVerifyHandler(verifyReq1);
      expect(verifyRes1.status).toBe(200);

      // Second verification with new challenge but SAME TOTP code is rejected as replay
      const loginReq2 = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const loginRes2 = await loginHandler(loginReq2);
      const { challengeToken: token2 } = await loginRes2.json();

      const verifyReq2 = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: token2,
          code: validTotpCode,
        }),
      });
      const verifyRes2 = await mfaVerifyHandler(verifyReq2);
      expect(verifyRes2.status).toBe(401);
      const replayJson = await verifyRes2.json();
      expect(replayJson.error).toContain("already been used");
    });

    it("should accept a valid emergency recovery code and consume it", async () => {
      const recoveryCode = recoveryCodes.plaintextCodes[0];

      const loginReq = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const loginRes = await loginHandler(loginReq);
      const { challengeToken } = await loginRes.json();

      const verifyReq = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken,
          code: recoveryCode,
        }),
      });

      const verifyRes = await mfaVerifyHandler(verifyReq);
      const json = await verifyRes.json();

      expect(verifyRes.status).toBe(200);
      expect(json.success).toBe(true);

      // Verify second attempt with the SAME recovery code fails (one-time use)
      const secondLoginReq = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mfaAdminEmail,
          password: "MfaPassword123!",
        }),
      });
      const secondLoginRes = await loginHandler(secondLoginReq);
      const { challengeToken: token2 } = await secondLoginRes.json();

      const replayReq = new Request("http://localhost:3000/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: token2,
          code: recoveryCode,
        }),
      });

      const replayRes = await mfaVerifyHandler(replayReq);
      expect(replayRes.status).toBe(401);
    });
  });

  describe("3. MFA Enrollment Workflow & Reset", () => {
    it("should allow an unenrolled administrator to initiate setup", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/mfa/setup", {
        method: "POST",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${unenrolledSuperAdminToken}`,
        },
      });

      const res = await mfaSetupHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.setup.secret).toBeDefined();
      expect(json.setup.otpauthUrl).toContain("otpauth://totp/");
      expect(json.setup.recoveryCodes.length).toBe(8);
      expect(json.setup.hashedRecoveryCodes.length).toBe(8);
    });

    it("should confirm MFA setup with valid code and issue authenticated cookie", async () => {
      const setupReq = new Request("http://localhost:3000/api/admin/auth/mfa/setup", {
        method: "POST",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${unenrolledSuperAdminToken}`,
        },
      });
      const setupRes = await mfaSetupHandler(setupReq);
      const { setup } = await setupRes.json();

      const validCode = generateTotpToken(setup.secret);

      const confirmReq = new Request("http://localhost:3000/api/admin/auth/mfa/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${unenrolledSuperAdminToken}`,
        },
        body: JSON.stringify({
          secret: setup.secret,
          code: validCode,
          hashedRecoveryCodes: setup.hashedRecoveryCodes,
        }),
      });

      const confirmRes = await mfaConfirmHandler(confirmReq);
      const confirmJson = await confirmRes.json();

      expect(confirmRes.status).toBe(200);
      expect(confirmJson.success).toBe(true);
      expect(confirmRes.headers.get("set-cookie")).toContain(ADMIN_COOKIE_NAME);
    });

    it("should reject MFA setup when MFA is already active on the account", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/mfa/setup", {
        method: "POST",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${verifiedSuperAdminToken}`,
        },
      });

      const res = await mfaSetupHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("already enabled");
    });

    it("should allow SUPER_ADMIN to reset MFA for an administrator", async () => {
      const resetReq = new Request("http://localhost:3000/api/admin/auth/mfa/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${verifiedSuperAdminToken}`,
        },
        body: JSON.stringify({
          targetUserId: unenrolledSuperAdminId,
          reason: "Emergency device loss and MFA re-enrollment request",
        }),
      });

      const resetRes = await mfaResetHandler(resetReq);
      const json = await resetRes.json();

      expect(resetRes.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain("successfully reset");
    });
  });
});
