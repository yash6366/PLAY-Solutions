import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { POST as contactHandler } from "@/app/api/contact/route";
import { POST as internshipHandler } from "@/app/api/internships/apply/route";
import { POST as mentorHandler } from "@/app/api/experts/inquire/route";
import { GET as healthHandler } from "@/app/api/health/route";
import { clearRateLimitStore } from "@/lib/rate-limit/limiter";

describe("API Route Integration Tests", () => {
  beforeAll(() => {
    // Set test memory mode
    process.env.DATABASE_URL = "memory";
  });

  beforeEach(() => {
    clearRateLimitStore();
  });

  describe("POST /api/contact", () => {
    it("should process a valid contact submission with reference ID", async () => {
      const payload = {
        inquiryType: "business",
        name: "Devon Miles",
        email: "devon@mileslabs.com",
        organization: "Miles Labs",
        message: "Need a complete web application with Next.js and Prisma.",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await contactHandler(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.referenceId).toBeTruthy();
    });

    it("should reject bot spam with status 400", async () => {
      const spamPayload = {
        inquiryType: "general",
        name: "Bot",
        email: "bot@bot.com",
        message: "Spam message payload",
        companyWebsiteCheck: "bot_filled_val",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spamPayload),
      });

      const res = await contactHandler(req);
      expect(res.status).toBe(400);
    });

    it("should reject invalid email with status 400", async () => {
      const invalidPayload = {
        inquiryType: "business",
        name: "Devon Miles",
        email: "invalid-email",
        message: "Valid length message here for testing.",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPayload),
      });

      const res = await contactHandler(req);
      expect(res.status).toBe(400);
    });

    it("should reject submissions with missing required fields", async () => {
      const missingPayload = {
        inquiryType: "business",
        name: "Devon Miles",
        // missing email and message
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(missingPayload),
      });

      const res = await contactHandler(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error).toBe("Validation failed");
      expect(json.details.email).toBeDefined();
      expect(json.details.message).toBeDefined();
    });

    it("should reject excessively long input payloads", async () => {
      const excessivelyLongPayload = {
        inquiryType: "general",
        name: "A".repeat(150), // exceeds max length
        email: "devon@mileslabs.com",
        message: "Valid message content",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excessivelyLongPayload),
      });

      const res = await contactHandler(req);
      expect(res.status).toBe(400);
    });

    it("should safely reject malformed JSON request bodies", async () => {
      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{malformed_json: true,",
      });

      const res = await contactHandler(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error).toBe("Invalid request payload.");
    });

    it("should return HTTP 503 when database is unconfigured", async () => {
      const origEnv = process.env.DATABASE_URL;
      try {
        process.env.DATABASE_URL = "";

        const payload = {
          inquiryType: "general",
          name: "Unconfigured Test",
          email: "unconfigured@test.com",
          message: "Testing unconfigured database behavior.",
          consentGiven: true,
        };

        const req = new Request("http://localhost:3000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const res = await contactHandler(req);
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.success).toBe(false);
        expect(json.setupGuide).toContain("DATABASE_URL");
      } finally {
        process.env.DATABASE_URL = origEnv;
      }
    });

    it("should return HTTP 429 when rate limit is exceeded", async () => {
      const payload = {
        inquiryType: "general",
        name: "Rate Limit Tester",
        email: "ratelimit@example.com",
        message: "Message for rate limit testing.",
        consentGiven: true,
      };

      // Contact endpoint allows 5 requests per window per IP
      for (let i = 0; i < 5; i++) {
        const req = new Request("http://localhost:3000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const res = await contactHandler(req);
        expect(res.status).toBe(201);
      }

      // 6th request must be rejected with 429
      const req6 = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const res6 = await contactHandler(req6);
      expect(res6.status).toBe(429);
      expect(res6.headers.get("Retry-After")).toBeTruthy();
    });
  });

  describe("POST /api/internships/apply", () => {
    it("should process a valid student internship application", async () => {
      const appPayload = {
        opportunityId: "fullstack-internship-2026",
        fullName: "Aria Thorne",
        email: "aria@university.edu",
        education: "State University, 3rd Year CS",
        relevantSkills: "TypeScript, React, Node.js",
        motivationStatement:
          "I want to participate in real code reviews and contribute to high-performance applications.",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appPayload),
      });

      const res = await internshipHandler(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.applicationId).toBeTruthy();
    });

    it("should reject bot submissions for internships", async () => {
      const spamApp = {
        opportunityId: "fullstack-internship-2026",
        fullName: "Bot Applicant",
        email: "bot@domain.com",
        education: "School",
        relevantSkills: "Python",
        motivationStatement: "Valid length statement to bypass zod check here.",
        applicantMiddleName: "TrapValue",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spamApp),
      });

      const res = await internshipHandler(req);
      expect(res.status).toBe(400);
    });

    it("should return HTTP 503 when database is unconfigured for internships", async () => {
      const origEnv = process.env.DATABASE_URL;
      try {
        process.env.DATABASE_URL = "";

        const payload = {
          opportunityId: "fullstack-internship-2026",
          fullName: "Aria Thorne",
          email: "aria@university.edu",
          education: "State University, 3rd Year CS",
          relevantSkills: "TypeScript, React",
          motivationStatement: "I want to participate in real code reviews and contribute.",
          consentGiven: true,
        };

        const req = new Request("http://localhost:3000/api/internships/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const res = await internshipHandler(req);
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.success).toBe(false);
        expect(json.setupGuide).toContain("DATABASE_URL");
      } finally {
        process.env.DATABASE_URL = origEnv;
      }
    });
  });

  describe("POST /api/experts/inquire", () => {
    it("should process a mentor inquiry", async () => {
      const mentorPayload = {
        fullName: "Marcus Holloway",
        email: "marcus@systems.org",
        areaOfExpertise: "Cloud Architecture & High Availability",
        collaborationPreference: "architecture_review",
        introduction: "Senior architect with 15 years experience available for monthly audits.",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/experts/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mentorPayload),
      });

      const res = await mentorHandler(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.inquiryId).toBeTruthy();
    });

    it("should reject bot submissions for mentor inquiries", async () => {
      const spamMentor = {
        fullName: "Bot",
        email: "bot@expert.com",
        areaOfExpertise: "Spam",
        collaborationPreference: "mentor_students",
        introduction: "Valid length intro statement for mentor test.",
        companyOfficeCode: "FilledCode",
        consentGiven: true,
      };

      const req = new Request("http://localhost:3000/api/experts/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spamMentor),
      });

      const res = await mentorHandler(req);
      expect(res.status).toBe(400);
    });

    it("should return HTTP 503 when database is unconfigured for mentor inquiries", async () => {
      const origEnv = process.env.DATABASE_URL;
      try {
        process.env.DATABASE_URL = "";

        const payload = {
          fullName: "Marcus Holloway",
          email: "marcus@systems.org",
          areaOfExpertise: "Cloud Architecture",
          collaborationPreference: "architecture_review",
          introduction: "Senior architect with 15 years experience available for mentorship.",
          consentGiven: true,
        };

        const req = new Request("http://localhost:3000/api/experts/inquire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const res = await mentorHandler(req);
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.success).toBe(false);
        expect(json.setupGuide).toContain("DATABASE_URL");
      } finally {
        process.env.DATABASE_URL = origEnv;
      }
    });
  });

  describe("GET /api/health", () => {
    it("should report system health, database, rate limit, and notification telemetry", async () => {
      const res = await healthHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.status).toBe("healthy");
      expect(json.liveness).toBe("ok");
      expect(json.readiness).toBeDefined();
      expect(json.database).toBeDefined();
      expect(json.rateLimiting).toBeDefined();
      expect(json.rateLimiting.backend).toBeTruthy();
      expect(typeof json.rateLimiting.isDistributed).toBe("boolean");
      expect(json.notifications).toBeDefined();
      expect(typeof json.notifications.configured).toBe("boolean");
    });

    it("should handle readiness probe queries appropriately", async () => {
      const req = new Request("http://localhost:3000/api/health?probe=readiness");
      const res = await healthHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.liveness).toBe("ok");
    });
  });
});
