import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  internshipApplicationSchema,
  mentorInquirySchema,
} from "@/lib/validation/schemas";

describe("Input Validation & Security Schemas", () => {
  describe("Contact Form Validation", () => {
    it("should accept valid business inquiries", () => {
      const validData = {
        inquiryType: "business" as const,
        name: "Samantha Reed",
        email: "samantha@enterprise.com",
        organization: "Reed Global",
        projectCategory: "custom_software",
        budgetRange: "25k_50k",
        timeline: "3_months",
        message: "We need an architecture review and custom telemetry service.",
        companyWebsiteCheck: "",
        consentGiven: true as const,
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email formats", () => {
      const invalidData = {
        inquiryType: "general" as const,
        name: "John Doe",
        email: "not-an-email",
        message: "Hello world this is a test message.",
        companyWebsiteCheck: "",
        consentGiven: true as const,
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it("should reject submission without mandatory consent", () => {
      const missingConsent = {
        inquiryType: "general" as const,
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world this is a test message.",
        companyWebsiteCheck: "",
        consentGiven: false,
      };

      const result = contactFormSchema.safeParse(missingConsent);
      expect(result.success).toBe(false);
    });

    it("should catch honeypot bot submissions", () => {
      const botData = {
        inquiryType: "business" as const,
        name: "Bot Spammer",
        email: "spammer@bot.org",
        message: "Click here to buy things now please.",
        companyWebsiteCheck: "http://spam-link.com", // filled honeypot
        consentGiven: true as const,
      };

      const result = contactFormSchema.safeParse(botData);
      expect(result.success).toBe(false);
    });
  });

  describe("Internship Application Validation", () => {
    it("should validate a complete internship application", () => {
      const validApp = {
        opportunityId: "fullstack-internship-2026",
        fullName: "Marcus Vance",
        email: "marcus@university.edu",
        phone: "+1-555-0144",
        education: "State University, B.S. CS 3rd Year",
        relevantSkills: "TypeScript, React, PostgreSQL, Git",
        motivationStatement:
          "I want to gain hands-on experience building tested backend services and learning team git workflows under mentor code review.",
        portfolioUrl: "https://github.com/marcusvance",
        linkedInUrl: "https://linkedin.com/in/marcusvance",
        applicantMiddleName: "",
        consentGiven: true as const,
      };

      const result = internshipApplicationSchema.safeParse(validApp);
      expect(result.success).toBe(true);
    });

    it("should reject motivation statements that are too short", () => {
      const shortMotivation = {
        opportunityId: "fullstack-internship-2026",
        fullName: "Marcus Vance",
        email: "marcus@university.edu",
        education: "State University",
        relevantSkills: "TypeScript",
        motivationStatement: "hire me", // less than 20 chars
        applicantMiddleName: "",
        consentGiven: true as const,
      };

      const result = internshipApplicationSchema.safeParse(shortMotivation);
      expect(result.success).toBe(false);
    });
  });

  describe("Mentor Inquiry Validation", () => {
    it("should accept valid mentor inquiry", () => {
      const validMentor = {
        fullName: "Dr. Rachel Chen",
        email: "rachel@labs.io",
        areaOfExpertise: "Distributed consensus & Raft protocols",
        collaborationPreference: "conduct_workshop" as const,
        linkedInOrWebsiteUrl: "https://linkedin.com/in/rachelchen",
        introduction: "I have 12 years of experience in distributed systems and want to lead a student workshop.",
        companyOfficeCode: "",
        consentGiven: true as const,
      };

      const result = mentorInquirySchema.safeParse(validMentor);
      expect(result.success).toBe(true);
    });
  });
});
