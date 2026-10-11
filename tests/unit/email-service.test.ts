import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  sendInquiryNotification,
  sendInternshipNotification,
  sendMentorNotification,
} from "@/server/notifications/email.service";

describe("Transactional Email Service", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("should gracefully skip dispatch when provider API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_PROVIDER_API_KEY;

    const result = await sendInquiryNotification({
      id: "inq_test_123",
      type: "BUSINESS",
      name: "Alex Vance",
      email: "alex@vance.io",
      organization: "Vance Enterprises",
      message: "Testing email skip when unconfigured.",
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.reason).toContain("PROVIDER_UNCONFIGURED");
  });

  it("should format and simulate successful dispatch in test mode when key is present", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";

    const result = await sendInquiryNotification({
      id: "inq_test_456",
      type: "STUDENT",
      name: "Jamie Lin",
      email: "jamie@university.edu",
      message: "Student inquiry message.",
    });

    expect(result.success).toBe(true);
    expect(result.skipped).toBe(false);
    expect(result.messageId).toBeTruthy();
  });

  it("should dispatch internship notification when key is present", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";

    const result = await sendInternshipNotification({
      id: "app_test_789",
      opportunityId: "fullstack-software-engineering-intern",
      fullName: "Taylor Swift",
      email: "taylor@swift.edu",
      education: "University of Tech, CS Senior",
      skills: "TypeScript, React, Node.js",
      motivationStatement: "Passionate about full-stack software development.",
      portfolioUrl: "https://github.com/taylorswift",
    });

    expect(result.success).toBe(true);
    expect(result.skipped).toBe(false);
    expect(result.messageId).toBeTruthy();
  });

  it("should dispatch mentor inquiry notification when key is present", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";

    const result = await sendMentorNotification({
      id: "mnt_test_101",
      fullName: "Dr. Gregory House",
      email: "house@diagnostics.org",
      areaOfExpertise: "Diagnostic Systems Architecture",
      collaborationPreference: "architecture_review",
      introduction: "Senior diagnostics architect interested in technical review.",
    });

    expect(result.success).toBe(true);
    expect(result.skipped).toBe(false);
    expect(result.messageId).toBeTruthy();
  });

  it("should safely handle provider network errors without throwing exceptions", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";
    process.env.TEST_LIVE_EMAIL = "true"; // trigger live dispatch branch

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Timeout"));

    try {
      const result = await sendInquiryNotification({
        id: "inq_network_err",
        type: "BUSINESS",
        name: "Test Failure",
        email: "failure@test.com",
        message: "Testing network fault handling.",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("NETWORK_ERROR");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("should safely handle provider HTTP rejections without throwing exceptions", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";
    process.env.TEST_LIVE_EMAIL = "true";

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    } as Response);

    try {
      const result = await sendInquiryNotification({
        id: "inq_http_err",
        type: "BUSINESS",
        name: "Test Failure",
        email: "failure@test.com",
        message: "Testing HTTP fault handling.",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("PROVIDER_ERROR");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
