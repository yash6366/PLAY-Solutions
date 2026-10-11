import { BrandConfig } from "@/types/brand";

/**
 * Centralized Brand Configuration
 * All site components, footers, headers, meta tags, and structured data derive from this single module.
 */
export const brandConfig: BrandConfig = {
  companyName: "PLAYQ Solutions",
  shortName: "PLAYQ",
  tagline: "Build Better Digital Products. Engineer for What Comes Next.",
  description:
    "PLAYQ Solutions helps businesses turn complex challenges into dependable digital products through custom software engineering, web and mobile development, AI integration, and cloud solutions. We combine practical engineering with thoughtful design to build technology that can evolve with your business.",
  primaryEmail: "contact@playqsolutions.com",
  contactPhone: undefined,
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://playqsolutions.com",
  location: "Global Remote / Distributed Engineering Studio",
  primaryColor: "#4F8CFF", // Electric Blue
  secondaryColor: "#8B5CF6", // Violet
  socialLinks: {
    linkedin: "https://linkedin.com/company/playq-solutions",
    github: "https://github.com/playq-solutions",
  },
  isPlaceholder: false,
};

export const defaultMetadata = {
  title: `${brandConfig.shortName} | ${brandConfig.tagline}`,
  description: brandConfig.description,
  siteName: brandConfig.companyName,
  url: brandConfig.websiteUrl,
};
