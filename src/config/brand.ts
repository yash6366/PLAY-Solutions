import { BrandConfig } from "@/types/brand";

/**
 * Centralized Brand Configuration
 *
 * NOTE: The company name and branding identity are currently in provisional configuration.
 * All site components, footers, headers, meta tags, and structured data derive from this single module.
 * Update these properties once legal entity registration is finalized.
 */
export const brandConfig: BrandConfig = {
  companyName: "PLAYQ Solutions",
  shortName: "PLAYQ",
  tagline: "Engineering Technology. Empowering People. Building Tomorrow.",
  description:
    "We transform complex challenges into intelligent digital solutions. From custom software and mobile applications to AI-driven innovation, we help businesses move forward while empowering emerging technology professionals through practical experience and industry collaboration.",
  primaryEmail: "contact@playqsolutions.com",
  contactPhone: "+1 (800) 555-0199",
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
