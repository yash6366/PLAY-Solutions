import { describe, it, expect } from "vitest";
import { brandConfig } from "@/config/brand";
import { servicesData, ServiceCategory } from "@/content/services";
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

  it("should organize all services into the 5 principal categories", () => {
    const validCategories: ServiceCategory[] = [
      "Custom Software Engineering",
      "Web and Mobile Development",
      "AI and Intelligent Automation",
      "Cloud, DevOps and Quality Engineering",
      "Technology Consulting",
    ];
    servicesData.forEach((service) => {
      expect(validCategories).toContain(service.category);
    });
  });

  it("should classify all projects with verified status tags and case study structure", () => {
    const validStatuses = [
      "Completed",
      "Demonstration",
      "Prototype",
      "In Development",
      "Internal R&D",
      "Work in Progress",
    ];
    projectsData.forEach((project) => {
      expect(validStatuses).toContain(project.status);
      expect(project.problemStatement).toBeTruthy();
      expect(project.solution).toBeTruthy();
      expect(project.objectives.length).toBeGreaterThan(0);
      expect(project.securityAndReliability.length).toBeGreaterThan(0);
      expect(project.testingMethodology.length).toBeGreaterThan(0);
      expect(project.knownLimitations.length).toBeGreaterThan(0);
      expect(project.relatedServices.length).toBeGreaterThan(0);
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
