import { MetadataRoute } from "next";
import { brandConfig } from "@/config/brand";
import { servicesData } from "@/content/services";
import { projectsData } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = brandConfig.websiteUrl || "https://playqsolutions.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/industries",
    "/projects",
    "/internships",
    "/experts",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-10-11T00:00:00Z"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date("2026-10-11T00:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectsData
    .filter((p) => p.published)
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date("2026-10-11T00:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
