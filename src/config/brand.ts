import { BrandConfig } from "@/types/brand";

/**
 * Centralized Brand Configuration
 * All site components, footers, headers, meta tags, and structured data derive from this single module.
 */
export const brandConfig: BrandConfig = {
  companyName: "PLAYQ Solutions",
  shortName: "PLAYQ",
  tagline: "Software Engineering & Digital Solutions",
  description:
    "PLAYQ Solutions designs and develops custom software, web applications, mobile experiences, and intelligent automation to help businesses solve practical problems and build dependable digital products.",
  primaryEmail: "contact@playqsolutions.com",
  contactPhone: undefined,
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://playqsolutions.com",
  location: "Global Remote / Distributed Engineering Studio",
  primaryColor: "#3B82F6", // Professional Sapphire
  secondaryColor: "#06B6D4", // Technical Cyan
  socialLinks: {
    linkedin: "https://linkedin.com/company/playq-solutions",
    github: "https://github.com/yash6366/PLAY-Solutions",
  },
  isPlaceholder: false,
};

export const defaultMetadata = {
  title: `${brandConfig.shortName} | ${brandConfig.tagline}`,
  description: brandConfig.description,
  siteName: brandConfig.companyName,
  url: brandConfig.websiteUrl,
};
