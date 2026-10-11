import { z } from "zod";

/**
 * Validation schema for general & business contact inquiries
 */
export const contactFormSchema = z.object({
  inquiryType: z.enum(["business", "student", "collaboration", "general"], {
    error: "Please select a valid inquiry type",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters")
    .trim()
    .toLowerCase(),
  organization: z.string().max(120, "Organization name cannot exceed 120 characters").optional(),
  projectCategory: z.string().max(80).optional(),
  budgetRange: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
  message: z
    .string()
    .min(10, "Please provide at least 10 characters describing your inquiry")
    .max(3000, "Message cannot exceed 3000 characters")
    .trim(),
  // Honeypot field: must be empty, bots tend to populate hidden fields
  companyWebsiteCheck: z.string().max(0, "Bot submission detected").optional(),
  consentGiven: z.literal(true, {
    error: "You must acknowledge and consent to the privacy notice",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Validation schema for student internship applications
 */
export const internshipApplicationSchema = z.object({
  opportunityId: z.string().min(1, "Please select an internship opportunity"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters")
    .trim()
    .toLowerCase(),
  phone: z.string().max(30, "Phone number cannot exceed 30 characters").optional(),
  education: z
    .string()
    .min(3, "Please specify your educational institution and major")
    .max(200, "Education info cannot exceed 200 characters")
    .trim(),
  relevantSkills: z
    .string()
    .min(3, "Please list your relevant programming languages, tools or frameworks")
    .max(500, "Skills summary cannot exceed 500 characters")
    .trim(),
  motivationStatement: z
    .string()
    .min(20, "Please provide a short statement (at least 20 characters) describing your goals")
    .max(2500, "Statement cannot exceed 2500 characters")
    .trim(),
  portfolioUrl: z
    .string()
    .url("Please enter a valid URL (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
  linkedInUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  // Bot honeypot
  applicantMiddleName: z.string().max(0, "Bot submission detected").optional(),
  consentGiven: z.literal(true, {
    error: "You must consent to the processing of your application data",
  }),
});

export type InternshipApplicationData = z.infer<typeof internshipApplicationSchema>;

/**
 * Validation schema for industry expert and mentor inquiries
 */
export const mentorInquirySchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid work or personal email")
    .max(150, "Email cannot exceed 150 characters")
    .trim()
    .toLowerCase(),
  areaOfExpertise: z
    .string()
    .min(3, "Please state your technical or architectural expertise")
    .max(150, "Expertise cannot exceed 150 characters")
    .trim(),
  collaborationPreference: z.enum([
    "mentor_students",
    "conduct_workshop",
    "architecture_review",
    "project_collaboration",
    "consulting_partnership",
  ]),
  linkedInOrWebsiteUrl: z
    .string()
    .url("Please provide a valid profile link (e.g. LinkedIn or personal site)")
    .optional()
    .or(z.literal("")),
  introduction: z
    .string()
    .min(15, "Please provide a brief introduction (at least 15 characters)")
    .max(2000, "Introduction cannot exceed 2000 characters")
    .trim(),
  // Bot honeypot
  companyOfficeCode: z.string().max(0, "Bot submission detected").optional(),
  consentGiven: z.literal(true, {
    error: "You must agree to the privacy policy regarding professional inquiries",
  }),
});

export type MentorInquiryData = z.infer<typeof mentorInquirySchema>;
