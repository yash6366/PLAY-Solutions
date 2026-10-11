import { describe, it, expect } from "vitest";
import { servicesData } from "@/content/services";
import { projectsData } from "@/content/projects";
import { internshipOpportunities } from "@/content/internships";

describe("Slug Resolution & Not-Found Guardrails", () => {
  describe("Services Slugs", () => {
    it("should resolve each defined service slug uniquely", () => {
      servicesData.forEach((service) => {
        const found = servicesData.find((s) => s.slug === service.slug);
        expect(found).toBeDefined();
        expect(found?.title).toBe(service.title);
      });
    });

    it("should return undefined for non-existent service slugs", () => {
      const nonexistentSlugs = [
        "quantum-teleportation-service",
        "invalid-service-xyz",
        "../../etc/passwd",
        "<script>alert(1)</script>",
      ];

      nonexistentSlugs.forEach((slug) => {
        const found = servicesData.find((s) => s.slug === slug);
        expect(found).toBeUndefined();
      });
    });
  });

  describe("Projects Slugs", () => {
    it("should resolve each defined project slug uniquely", () => {
      projectsData.forEach((project) => {
        const found = projectsData.find((p) => p.slug === project.slug);
        expect(found).toBeDefined();
        expect(found?.title).toBe(project.title);
      });
    });

    it("should return undefined for non-existent project slugs", () => {
      const nonexistentSlugs = [
        "fake-blockchain-project",
        "unknown-slug-404",
      ];

      nonexistentSlugs.forEach((slug) => {
        const found = projectsData.find((p) => p.slug === slug);
        expect(found).toBeUndefined();
      });
    });
  });

  describe("Internships Slugs", () => {
    it("should resolve each defined internship opportunity uniquely", () => {
      internshipOpportunities.forEach((opp) => {
        const found = internshipOpportunities.find((o) => o.slug === opp.slug);
        expect(found).toBeDefined();
        expect(found?.title).toBe(opp.title);
      });
    });

    it("should return undefined for invalid internship slugs", () => {
      const found = internshipOpportunities.find((o) => o.slug === "nonexistent-internship");
      expect(found).toBeUndefined();
    });
  });
});
