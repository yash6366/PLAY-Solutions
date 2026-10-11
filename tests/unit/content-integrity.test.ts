import { describe, it, expect } from "vitest";
import { brandConfig } from "@/config/brand";
import { servicesData } from "@/content/services";
import { projectsData } from "@/content/projects";
import { internshipOpportunities } from "@/content/internships";
import { mainNav } from "@/config/navigation";

describe("Content Integrity & Centralized Brand Configuration", () => {
  it("should have a non-empty company brand configuration", () => {
    expect(brandConfig.companyName).toBeTruthy();
    expect(brandConfig.shortName).toBeTruthy();
    expect(brandConfig.tagline).toBeTruthy();
    expect(brandConfig.primaryEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should have all 14 service offerings with valid slugs and deliverables", () => {
    expect(servicesData.length).toBe(14);
    const slugs = servicesData.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);

    servicesData.forEach((service) => {
      expect(service.title).toBeTruthy();
      expect(service.overview).toBeTruthy();
      expect(service.deliverables.length).toBeGreaterThan(0);
      expect(service.technologies.length).toBeGreaterThan(0);
    });
  });

  it("should classify all projects with verified status tags", () => {
    const validStatuses = ["Completed", "Demonstration", "Prototype", "Work in Progress"];
    projectsData.forEach((project) => {
      expect(validStatuses).toContain(project.status);
      expect(project.problemStatement).toBeTruthy();
      expect(project.solution).toBeTruthy();
    });
  });

  it("should explicitly state duration and compensation for all internship opportunities", () => {
    internshipOpportunities.forEach((opp) => {
      expect(opp.duration).toBeTruthy();
      expect(opp.compensationStatus).toBeTruthy();
      expect(opp.eligibility).toBeTruthy();
      expect(opp.requiredSkills.length).toBeGreaterThan(0);
    });
  });

  it("should verify all main navigation routes start with /", () => {
    mainNav.forEach((item) => {
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.title).toBeTruthy();
    });
  });
});
