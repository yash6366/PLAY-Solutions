import { MetadataRoute } from "next";
import { brandConfig } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = brandConfig.websiteUrl || "https://playqsolutions.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
