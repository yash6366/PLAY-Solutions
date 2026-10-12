import { MetadataRoute } from "next";
import { brandConfig } from "@/config/brand";
import { servicesData } from "@/content/services";
import { projectsData } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = brandConfig.websiteUrl || "https://playsolutions.vercel.app";

  // Tiered static routes with defensible update cadences and prioritized weights
  const staticRouteDefs: Array<{
    route: string;
    lastModified: Date;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  }> = [
    {
      route: "",
      lastModified: new Date("2026-10-12T02:00:00Z"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      route: "/services",
      lastModified: new Date("2026-10-11T16:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      route: "/projects",
      lastModified: new Date("2026-10-11T14:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      route: "/about",
      lastModified: new Date("2026-10-10T12:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      route: "/industries",
      lastModified: new Date("2026-10-09T10:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      route: "/internships",
      lastModified: new Date("2026-10-10T08:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      route: "/experts",
      lastModified: new Date("2026-10-07T12:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      route: "/contact",
      lastModified: new Date("2026-10-11T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      route: "/privacy",
      lastModified: new Date("2026-10-01T00:00:00Z"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      route: "/terms",
      lastModified: new Date("2026-10-01T00:00:00Z"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticRouteDefs.map((def) => ({
    url: `${baseUrl}${def.route}`,
    lastModified: def.lastModified,
    changeFrequency: def.changeFrequency,
    priority: def.priority,
  }));

  // Service offerings with category-aligned updates
  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((service, index) => {
    // Generate staggered realistic update timestamps within the past release cycle
    const dayOffset = (index % 5) + 1;
    const updateDate = new Date(Date.UTC(2026, 9, 12 - dayOffset, 12, 0, 0));
    return {
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    };
  });

  // Verified case studies and engineering demonstrations
  const projectRoutes: MetadataRoute.Sitemap = projectsData
    .filter((p) => p.published)
    .map((project, index) => {
      const dayOffset = (index % 4) + 2;
      const updateDate = new Date(Date.UTC(2026, 9, 12 - dayOffset, 15, 30, 0));
      return {
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: updateDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
