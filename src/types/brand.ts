export interface BrandConfig {
  companyName: string;
  shortName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  location?: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  /**
   * Indicates whether the company identity is in provisional/placeholder state.
   * If true, non-intrusive developer warning banner is shown before production release.
   */
  isPlaceholder: boolean;
}
