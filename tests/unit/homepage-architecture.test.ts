import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { brandConfig } from "@/config/brand";
import { servicesData } from "@/content/services";
import { projectsData } from "@/content/projects";
import { industriesData } from "@/content/industries";
import { mainNav, footerNav } from "@/config/navigation";

describe("Phase 9: Homepage Architecture & Regression Prevention", () => {
  it("should assemble exactly the 7 intended primary content sections on the homepage", () => {
    const pagePath = path.resolve(__dirname, "../../src/app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    // Must include the 7 canonical sections
    expect(pageContent).toContain("<HeroSection");
    expect(pageContent).toContain("<ServicesOverview");
    expect(pageContent).toContain("<ProjectShowcase");
    expect(pageContent).toContain("<WhyPlayqSection");
    expect(pageContent).toContain("<IndustriesPreview");
    expect(pageContent).toContain("<HowWeWork");
    expect(pageContent).toContain("<ConversionCta");

    // Must NOT render removed duplicate/redundant sections
    expect(pageContent).not.toContain("<TrustStrip");
    expect(pageContent).not.toContain("<BusinessChallenges");
    expect(pageContent).not.toContain("<CompanyPrinciples");
    expect(pageContent).not.toContain("<TechnicalInsights");
    expect(pageContent).not.toContain("<CareersLearningSection");
    expect(pageContent).not.toContain("<HomepageFaq");
  });

  it("should configure Mesh Gateway as featured along with Sentinel, Aegis, and Pulse", () => {
    const featured = projectsData.filter((p) => p.published && p.isFeatured);
    expect(featured.length).toBe(4);

    const featuredSlugs = featured.map((p) => p.slug);
    expect(featuredSlugs).toContain("sentinel-analytics");
    expect(featuredSlugs).toContain("aegis-rag-engine");
    expect(featuredSlugs).toContain("pulse-health-portal");
    expect(featuredSlugs).toContain("mesh-api-gateway");

    // Verify accurate development status tags (no false customer deployment claims)
    const mesh = projectsData.find((p) => p.slug === "mesh-api-gateway");
    expect(mesh?.status).toBe("In Development");

    const aegis = projectsData.find((p) => p.slug === "aegis-rag-engine");
    expect(aegis?.status).toBe("Prototype");

    const sentinel = projectsData.find((p) => p.slug === "sentinel-analytics");
    expect(sentinel?.status).toBe("Demonstration");

    const pulse = projectsData.find((p) => p.slug === "pulse-health-portal");
    expect(pulse?.status).toBe("Demonstration");
  });

  it("should define all six core service categories with valid detail routes", () => {
    const expectedCoreSlugs = [
      "custom-software",
      "web-applications",
      "ai-integrations",
      "cloud-applications",
      "api-development",
      "software-testing",
    ];

    expectedCoreSlugs.forEach((slug) => {
      const match = servicesData.find((s) => s.slug === slug);
      expect(match).toBeDefined();
      expect(match?.title).toBeTruthy();
      expect(match?.shortDescription).toBeTruthy();
      expect(match?.technologies.length).toBeGreaterThan(0);
    });
  });

  it("should maintain all 6 target industries in compact domain definitions", () => {
    expect(industriesData.length).toBe(6);
    const industryIds = industriesData.map((ind) => ind.id);
    expect(industryIds).toContain("healthcare");
    expect(industryIds).toContain("education");
    expect(industryIds).toContain("retail-commerce");
    expect(industryIds).toContain("professional-services");
    expect(industryIds).toContain("logistics");
    expect(industryIds).toContain("startups-smb");
  });

  it("should enforce contact information integrity and suppress unverified phone placeholders", () => {
    // Official verified primary email
    expect(brandConfig.primaryEmail).toBe("contact@playqsolutions.com");

    // Unverified placeholder phone (+1 800 555-0199) must be undefined in brand config
    expect(brandConfig.contactPhone).toBeUndefined();

    // Truthful distributed studio location
    expect(brandConfig.location).toBe("Global Remote / Distributed Engineering Studio");
  });

  it("should preserve the 3D Hero Visual and its SVG fallback without layout regression", () => {
    const heroVisualPath = path.resolve(__dirname, "../../src/components/3d/HeroVisual.tsx");
    const heroFallbackPath = path.resolve(__dirname, "../../src/components/3d/HeroVisualFallback.tsx");

    expect(fs.existsSync(heroVisualPath)).toBe(true);
    expect(fs.existsSync(heroFallbackPath)).toBe(true);

    const visualCode = fs.readFileSync(heroVisualPath, "utf-8");
    expect(visualCode).toContain("THREE.IcosahedronGeometry");
    expect(visualCode).toContain("THREE.SphereGeometry");
    expect(visualCode).toContain("THREE.TorusGeometry");
    expect(visualCode).toContain("IntersectionObserver");
    expect(visualCode).toContain("prefersReducedMotion");
    expect(visualCode).toContain("hasWebGL");
    expect(visualCode).toContain("dispose()");

    const fallbackCode = fs.readFileSync(heroFallbackPath, "utf-8");
    expect(fallbackCode).toContain("<svg");
    expect(fallbackCode).toContain("ellipse");
  });

  it("should maintain primary navigation and footer navigation routes", () => {
    const navHrefs = mainNav.map((n) => n.href);
    expect(navHrefs).toContain("/");
    expect(navHrefs).toContain("/about");
    expect(navHrefs).toContain("/services");
    expect(navHrefs).toContain("/industries");
    expect(navHrefs).toContain("/projects");
    expect(navHrefs).toContain("/internships");
    expect(navHrefs).toContain("/contact");

    // Footer solutions must point to valid service detail pages
    footerNav.solutions.forEach((link) => {
      expect(link.href.startsWith("/services/")).toBe(true);
    });
  });

  it("should provide concise homepage project descriptions and comprehensive case-study specifications", () => {
    const featured = projectsData.filter((p) => p.published && p.isFeatured);
    expect(featured.length).toBeGreaterThan(0);

    featured.forEach((project) => {
      // Homepage descriptions must be concise for effortless readability (<= 120 characters)
      expect(project.shortSummary).toBeTruthy();
      expect(project.shortSummary.length).toBeLessThanOrEqual(120);

      // Deep technical content must be available for dedicated case-study pages
      expect(project.architectureDiagramSteps).toBeDefined();
      expect(project.architectureDiagramSteps!.length).toBeGreaterThanOrEqual(4);
      expect(project.technicalHighlights).toBeDefined();
      expect(project.technicalHighlights!.length).toBeGreaterThanOrEqual(3);
      expect(project.problemStatement).toBeTruthy();
      expect(project.solution).toBeTruthy();
      expect(project.architectureOverview).toBeTruthy();
    });
  });
});
