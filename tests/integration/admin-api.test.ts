import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { POST as loginHandler } from "@/app/api/admin/auth/login/route";
import { POST as logoutHandler } from "@/app/api/admin/auth/logout/route";
import { GET as meHandler } from "@/app/api/admin/auth/me/route";
import { GET as overviewHandler } from "@/app/api/admin/overview/route";
import { GET as inquiriesHandler } from "@/app/api/admin/inquiries/route";
import { GET as exportInquiriesHandler } from "@/app/api/admin/inquiries/export/route";
import {
  GET as inquiryDetailHandler,
  PATCH as inquiryPatchHandler,
  DELETE as inquiryDeleteHandler,
} from "@/app/api/admin/inquiries/[id]/route";
import { GET as internshipsHandler } from "@/app/api/admin/internships/route";
import {
  GET as internshipDetailHandler,
  PATCH as internshipPatchHandler,
} from "@/app/api/admin/internships/[id]/route";
import { GET as expertsHandler } from "@/app/api/admin/experts/route";
import {
  GET as expertDetailHandler,
  PATCH as expertPatchHandler,
} from "@/app/api/admin/experts/[id]/route";
import { createAdminUser, findAdminByEmail } from "@/server/repositories/admin.repository";
import { createInquiry } from "@/server/repositories/inquiry.repository";
import { createInternshipApplication } from "@/server/repositories/internship.repository";
import { createMentorInquiry } from "@/server/repositories/mentor.repository";
import { signAdminSession, AdminRole } from "@/server/auth/jwt";
import { SignJWT } from "jose";
import { hashPassword } from "@/server/auth/passwords";
import { ADMIN_COOKIE_NAME } from "@/server/auth/session";
import { clearRateLimitStore } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

describe("Admin API & Security Integration Tests", () => {
  let adminToken: string;
  let reviewerToken: string;
  let sampleInquiryId: string;
  let sampleInternshipId: string;
  let sampleExpertId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = "memory";
    process.env.AUTH_SECRET = "production-grade-secret-key-at-least-32-chars-long";

    // Seed test admin users in repository
    const adminPasswordHash = await hashPassword("AdminPass123!");
    const reviewerPasswordHash = await hashPassword("ReviewerPass123!");

    let existingAdmin = await findAdminByEmail("testadmin@playqsolutions.com");
    if (!existingAdmin) {
      const res = await createAdminUser({
        email: "testadmin@playqsolutions.com",
        passwordHash: adminPasswordHash,
        name: "Test Administrator",
        role: "ADMIN" as AdminRole,
      });
      existingAdmin = res.user!;
    }

    let existingReviewer = await findAdminByEmail("reviewer@playqsolutions.com");
    if (!existingReviewer) {
      const res = await createAdminUser({
        email: "reviewer@playqsolutions.com",
        passwordHash: reviewerPasswordHash,
        name: "Test Reviewer",
        role: "REVIEWER" as AdminRole,
      });
      existingReviewer = res.user!;
    }

    // Generate tokens for test requests
    adminToken = await signAdminSession({
      userId: existingAdmin.id,
      email: existingAdmin.email,
      name: existingAdmin.name,
      role: existingAdmin.role,
    });

    reviewerToken = await signAdminSession({
      userId: existingReviewer.id,
      email: existingReviewer.email,
      name: existingReviewer.name,
      role: existingReviewer.role,
    });

    // Seed sample inquiry
    const inq = await createInquiry({
      name: "Acme Corp Contact",
      email: "contact@acme.com",
      message: "Looking for cloud architecture modernizing services.",
      inquiryType: "business",
      organization: "Acme Corp",
      consentGiven: true,
    });
    sampleInquiryId = inq.id!;

    // Seed sample internship application
    const intern = await createInternshipApplication({
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1234567890",
      opportunityId: "software-engineering-intern",
      education: "BS Computer Science",
      relevantSkills: "TypeScript, React, Node.js",
      motivationStatement: "Interested in full-stack cloud systems.",
      consentGiven: true,
    });
    sampleInternshipId = intern.id!;

    // Seed sample mentor inquiry
    const mnt = await createMentorInquiry({
      fullName: "Dr. Alex Turing",
      email: "alex@example.org",
      areaOfExpertise: "Artificial Intelligence",
      collaborationPreference: "mentor_students",
      introduction: "Experienced AI/ML researcher willing to mentor.",
      consentGiven: true,
    });
    sampleExpertId = mnt.id!;
  });

  beforeEach(() => {
    clearRateLimitStore();
  });

  describe("1. Unauthenticated Access Denial", () => {
    it("should reject unauthenticated request to /api/admin/overview with 401", async () => {
      const req = new Request("http://localhost:3000/api/admin/overview");
      const res = await overviewHandler(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.error).toContain("Authentication required");
    });

    it("should reject unauthenticated request to /api/admin/inquiries with 401", async () => {
      const req = new Request("http://localhost:3000/api/admin/inquiries");
      const res = await inquiriesHandler(req);
      expect(res.status).toBe(401);
    });

    it("should reject unauthenticated request to /api/admin/internships with 401", async () => {
      const req = new Request("http://localhost:3000/api/admin/internships");
      const res = await internshipsHandler(req);
      expect(res.status).toBe(401);
    });

    it("should reject unauthenticated request to /api/admin/experts with 401", async () => {
      const req = new Request("http://localhost:3000/api/admin/experts");
      const res = await expertsHandler(req);
      expect(res.status).toBe(401);
    });

    it("should reject unauthenticated request to /api/admin/auth/me with 401", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/me");
      const res = await meHandler(req);
      expect(res.status).toBe(401);
    });

    it("should reject request with expired session token with 401", async () => {
      const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET);
      const expiredToken = await new SignJWT({
        userId: "test-user-id",
        email: "testadmin@playqsolutions.com",
        name: "Test Administrator",
        role: "ADMIN" as AdminRole,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(Date.now() / 1000) - 100)
        .setIssuer("playqsolutions.com")
        .setAudience("playq-admin-portal")
        .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
        .sign(secretKey);

      const req = new Request("http://localhost:3000/api/admin/overview", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${expiredToken}`,
        },
      });
      const res = await overviewHandler(req);
      expect(res.status).toBe(401);
    });
  });

  describe("2. Authentication & Session Flow", () => {
    it("should reject login with wrong password (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "testadmin@playqsolutions.com",
          password: "WrongPassword999!",
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.error).toBe("Invalid email or password.");
    });

    it("should reject login with non-existent user email (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "unregistered@domain.com",
          password: "AnyPassword123!",
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(401);
    });

    it("should successfully log in with valid credentials, set session cookie, and never expose password hash", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "testadmin@playqsolutions.com",
          password: "AdminPass123!",
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.user.email).toBe("testadmin@playqsolutions.com");
      expect(json.user.role).toBe("ADMIN");
      expect(json.user.passwordHash).toBeUndefined(); // sensitive data protection

      // Verify Set-Cookie header is issued
      const setCookie = res.headers.get("set-cookie");
      expect(setCookie).toContain(ADMIN_COOKIE_NAME);
    });

    it("should inspect session via /api/admin/auth/me when authenticated", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/me", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await meHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.authenticated).toBe(true);
      expect(json.user.email).toBe("testadmin@playqsolutions.com");
      expect(json.user.role).toBe("ADMIN");
    });

    it("should log out and clear the session cookie", async () => {
      const req = new Request("http://localhost:3000/api/admin/auth/logout", {
        method: "POST",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await logoutHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      const setCookie = res.headers.get("set-cookie");
      expect(setCookie).toContain("Max-Age=0");
    });
  });

  describe("3. Authorized Data Operations & Pagination", () => {
    it("should return operational metrics via /api/admin/overview with normalized stats contracts", async () => {
      const req = new Request("http://localhost:3000/api/admin/overview", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await overviewHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.stats.inquiries).toBeDefined();
      expect(json.stats.inquiries.total).toBeGreaterThanOrEqual(1);
      expect(json.stats.inquiries.new).toBeDefined();
      expect(json.stats.inquiries.inProgress).toBeDefined();

      expect(json.stats.internships).toBeDefined();
      expect(json.stats.internships.total).toBeGreaterThanOrEqual(1);
      expect(json.stats.internships.submittedCount).toBeDefined();
      expect(json.stats.internships.pending).toBeDefined();

      expect(json.stats.experts).toBeDefined();
      expect(json.stats.experts.total).toBeGreaterThanOrEqual(1);
      expect(json.stats.experts.newCount).toBeDefined();
      expect(json.stats.experts.new).toBeDefined();
    });

    it("should list inquiries with pagination and filtering", async () => {
      const req = new Request("http://localhost:3000/api/admin/inquiries?page=1&limit=5", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await inquiriesHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it("should get single inquiry details", async () => {
      const req = new Request(`http://localhost:3000/api/admin/inquiries/${sampleInquiryId}`, {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await inquiryDetailHandler(req, {
        params: Promise.resolve({ id: sampleInquiryId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.inquiry.id).toBe(sampleInquiryId);
    });

    it("should get single internship application details", async () => {
      const req = new Request(`http://localhost:3000/api/admin/internships/${sampleInternshipId}`, {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await internshipDetailHandler(req, {
        params: Promise.resolve({ id: sampleInternshipId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.application.id).toBe(sampleInternshipId);
    });

    it("should get single expert inquiry details", async () => {
      const req = new Request(`http://localhost:3000/api/admin/experts/${sampleExpertId}`, {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await expertDetailHandler(req, {
        params: Promise.resolve({ id: sampleExpertId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.inquiry.id).toBe(sampleExpertId);
    });
  });

  describe("4. Status Updates & Internal Notes", () => {
    it("should update inquiry status and internal notes and return data payload", async () => {
      const req = new Request(`http://localhost:3000/api/admin/inquiries/${sampleInquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          internalNotes: "Discussed with client. Architecture review booked for Thursday.",
        }),
      });

      const res = await inquiryPatchHandler(req, {
        params: Promise.resolve({ id: sampleInquiryId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.status).toBe("IN_REVIEW");
      expect(json.data.internalNotes).toBe("Discussed with client. Architecture review booked for Thursday.");
    });

    it("should update internship application status, normalize status, and return data payload", async () => {
      const req = new Request(`http://localhost:3000/api/admin/internships/${sampleInternshipId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
        body: JSON.stringify({
          status: "UNDER_REVIEW",
          internalNotes: "Reviewing candidate portfolio.",
        }),
      });

      const res = await internshipPatchHandler(req, {
        params: Promise.resolve({ id: sampleInternshipId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.status).toBe("UNDER_REVIEW");
    });

    it("should update expert inquiry status, normalize status, and return data payload", async () => {
      const req = new Request(`http://localhost:3000/api/admin/experts/${sampleExpertId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
        body: JSON.stringify({
          status: "UNDER_REVIEW",
          internalNotes: "Reviewing mentor credentials.",
        }),
      });

      const res = await expertPatchHandler(req, {
        params: Promise.resolve({ id: sampleExpertId }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.status).toBe("IN_REVIEW");
    });

    it("should reject invalid status with 400 Bad Request", async () => {
      const req = new Request(`http://localhost:3000/api/admin/inquiries/${sampleInquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
        body: JSON.stringify({
          status: "NON_EXISTENT_STATUS",
        }),
      });

      const res = await inquiryPatchHandler(req, {
        params: Promise.resolve({ id: sampleInquiryId }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("5. Role-Based Access Control (RBAC) Enforcement", () => {
    it("should DENY modification (PATCH) to REVIEWER role with 403 Forbidden", async () => {
      const req = new Request(`http://localhost:3000/api/admin/inquiries/${sampleInquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${ADMIN_COOKIE_NAME}=${reviewerToken}`,
        },
        body: JSON.stringify({
          status: "CLOSED",
        }),
      });

      const res = await inquiryPatchHandler(req, {
        params: Promise.resolve({ id: sampleInquiryId }),
      });
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.success).toBe(false);
      expect(json.error).toContain("Access denied");
    });

    it("should DENY deletion to REVIEWER role with 403 Forbidden", async () => {
      const req = new Request(`http://localhost:3000/api/admin/inquiries/${sampleInquiryId}`, {
        method: "DELETE",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${reviewerToken}`,
        },
      });

      const res = await inquiryDeleteHandler(req, {
        params: Promise.resolve({ id: sampleInquiryId }),
      });
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.success).toBe(false);
      expect(json.error).toContain("Access denied");
    });

    it("should ALLOW deletion to ADMIN role", async () => {
      // Create a temporary inquiry to delete
      const tempInq = await createInquiry({
        name: "To Be Deleted",
        email: "delete@example.com",
        message: "Disposable inquiry",
        inquiryType: "general",
        consentGiven: true,
      });

      const req = new Request(`http://localhost:3000/api/admin/inquiries/${tempInq.id!}`, {
        method: "DELETE",
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await inquiryDeleteHandler(req, {
        params: Promise.resolve({ id: tempInq.id! }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe("5. CSV Export and Formula Injection Defense", () => {
    it("should reject unauthenticated CSV export requests (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/inquiries/export");
      const res = await exportInquiriesHandler(req);
      expect(res.status).toBe(401);
    });

    it("should reject REVIEWER role from exporting CSV (403)", async () => {
      const req = new Request("http://localhost:3000/api/admin/inquiries/export", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${reviewerToken}`,
        },
      });
      const res = await exportInquiriesHandler(req);
      expect(res.status).toBe(403);
    });

    it("should allow ADMIN to export CSV and neutralize spreadsheet formula injection", async () => {
      // Seed an inquiry containing potential formula injection triggers (=, @, +, -)
      await createInquiry({
        name: "=cmd|' /C calc'!A0",
        email: "formula-test@example.com",
        message: "@SUM(1,2)",
        organization: "+DangerousOrg",
        inquiryType: "business",
        consentGiven: true,
      });

      const req = new Request("http://localhost:3000/api/admin/inquiries/export", {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}`,
        },
      });

      const res = await exportInquiriesHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/csv");

      const csvText = await res.text();
      // Verify headers exist
      expect(csvText).toContain("Inquiry ID,Created At,Name,Email");

      // Verify formula injection characters are neutralized with leading single quote
      expect(csvText).toContain("\"'=cmd|' /C calc'!A0\"");
      expect(csvText).toContain("\"'@SUM(1,2)\"");
      expect(csvText).toContain("\"'+DangerousOrg\"");
    });
  });

  describe("6. CSRF Origin Verification Security Guard", () => {
    it("should allow safe read-only methods (GET, HEAD, OPTIONS)", () => {
      const req = new Request("https://playqsolutions.com/api/admin/overview", { method: "GET" });
      expect(verifyCsrfOrigin(req)).toBe(true);
    });

    it("should reject Sec-Fetch-Site cross-site requests on state-changing methods", () => {
      const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
        method: "POST",
        headers: {
          "Sec-Fetch-Site": "cross-site",
          Origin: "https://evil-attacker.com",
        },
      });
      expect(verifyCsrfOrigin(req)).toBe(false);
    });

    it("should reject unauthorized foreign origin in production mode", () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSite = process.env.SITE_URL;
      const env = process.env as Record<string, string | undefined>;
      try {
        env.NODE_ENV = "production";
        env.SITE_URL = "https://playqsolutions.com";

        const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
          method: "POST",
          headers: {
            Host: "playqsolutions.com",
            Origin: "https://malicious-site.com",
          },
        });
        expect(verifyCsrfOrigin(req)).toBe(false);

        // localhost should also be rejected in production
        const localReq = new Request("https://playqsolutions.com/api/admin/inquiries", {
          method: "POST",
          headers: {
            Host: "playqsolutions.com",
            Origin: "http://localhost:3000",
          },
        });
        expect(verifyCsrfOrigin(localReq)).toBe(false);
      } finally {
        env.NODE_ENV = prevEnv;
        env.SITE_URL = prevSite;
      }
    });

    it("should allow matching origin in production mode", () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSite = process.env.SITE_URL;
      const env = process.env as Record<string, string | undefined>;
      try {
        env.NODE_ENV = "production";
        env.SITE_URL = "https://playqsolutions.com";

        const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
          method: "POST",
          headers: {
            Host: "playqsolutions.com",
            Origin: "https://playqsolutions.com",
          },
        });
        expect(verifyCsrfOrigin(req)).toBe(true);
      } finally {
        env.NODE_ENV = prevEnv;
        env.SITE_URL = prevSite;
      }
    });

    it("should reject HTTP/HTTPS protocol downgrade mismatch via x-forwarded-proto", () => {
      const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
        method: "POST",
        headers: {
          Host: "playqsolutions.com",
          Origin: "http://playqsolutions.com",
          "x-forwarded-proto": "https",
        },
      });
      expect(verifyCsrfOrigin(req)).toBe(false);
    });

    it("should reject unexpected port mismatch between Origin and Host header", () => {
      const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
        method: "POST",
        headers: {
          Host: "playqsolutions.com",
          Origin: "https://playqsolutions.com:8443",
        },
      });
      expect(verifyCsrfOrigin(req)).toBe(false);
    });

    it("should reject lookalike domain origin", () => {
      const req = new Request("https://playqsolutions.com/api/admin/inquiries", {
        method: "POST",
        headers: {
          Host: "playqsolutions.com",
          Origin: "https://playqsolutions.com.attacker.com",
        },
      });
      expect(verifyCsrfOrigin(req)).toBe(false);
    });
  });
});
