import { describe, it, expect, beforeAll } from "vitest";
import {
  getPublicOpportunities,
  getAllAdminOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "@/server/repositories/opportunity.repository";

describe("Opportunity & Career Management Integration Tests", () => {
  beforeAll(() => {
    process.env.DATABASE_URL = "memory";
  });

  it("should fetch public opportunities with Job ID starting from 00011", async () => {
    const opps = await getPublicOpportunities();
    expect(opps.length).toBeGreaterThan(0);
    expect(opps[0]).toHaveProperty("title");
    expect(opps[0]).toHaveProperty("jobId");
    expect(opps[0].jobId).toMatch(/^\d{5}$/);
    expect(parseInt(opps[0].jobId, 10)).toBeGreaterThanOrEqual(11);
  });

  it("should create a new career opening with custom typeable Program Type and Job ID", async () => {
    const created = await createOpportunity({
      jobId: "00015",
      title: "Senior Autonomous Agent Engineer",
      department: "AI & Machine Learning",
      type: "Staff Research Fellow & Full-Time Architect", // Custom typeable role!
      description: "Build cutting-edge autonomous agents and neural evaluation pipelines.",
      eligibility: "Experienced software engineers or researchers.",
      skills: ["Python", "PyTorch", "Next.js"],
      duration: "16 Weeks",
      locationMode: "Remote (Global)",
      compensationStatus: "Educational / Project Stipend Evaluated per Cohort",
      deadline: "December 2026",
      availablePositions: 2,
      published: true,
    });

    expect(created.success).toBe(true);
    expect(created.opportunity).toBeDefined();
    expect(created.opportunity?.jobId).toBe("00015");
    expect(created.opportunity?.type).toBe("Staff Research Fellow & Full-Time Architect");

    const allAdmin = await getAllAdminOpportunities();
    const found = allAdmin.find((o) => o.id === created.opportunity?.id);
    expect(found).toBeDefined();
    expect(found?.jobId).toBe("00015");
    expect(found?.type).toBe("Staff Research Fellow & Full-Time Architect");

    // Also check it appears in public list because it's published
    const publicList = await getPublicOpportunities();
    const publicFound = publicList.find((o) => o.id === created.opportunity?.id);
    expect(publicFound).toBeDefined();
    expect(publicFound?.jobId).toBe("00015");
    expect(publicFound?.type).toBe("Staff Research Fellow & Full-Time Architect");
  });

  it("should update a career opening and toggle publish state", async () => {
    const created = await createOpportunity({
      title: "DevOps Engineer Intern",
      department: "Cloud & DevOps",
      type: "Site Reliability Apprentice",
      description: "Manage CI/CD and multi-region infrastructure.",
      eligibility: "Engineering students with Linux and Docker knowledge.",
      skills: ["Docker", "Kubernetes", "GitHub Actions"],
      duration: "12 Weeks",
      deadline: "January 2027",
      published: true,
    });

    const id = created.opportunity!.id;

    // Unpublish
    const updated = await updateOpportunity(id, {
      title: "Lead DevOps Specialist Intern",
      type: "Lead SRE Apprentice",
      published: false,
    });

    expect(updated.success).toBe(true);
    expect(updated.opportunity?.title).toBe("Lead DevOps Specialist Intern");
    expect(updated.opportunity?.type).toBe("Lead SRE Apprentice");
    expect(updated.opportunity?.published).toBe(false);

    // Should NOT appear in public list when published: false
    const publicList = await getPublicOpportunities();
    const publicFound = publicList.find((o) => o.id === id);
    expect(publicFound).toBeUndefined();

    // Re-publish
    const republished = await updateOpportunity(id, { published: true });
    expect(republished.opportunity?.published).toBe(true);

    const publicListAfter = await getPublicOpportunities();
    const publicFoundAfter = publicListAfter.find((o) => o.id === id);
    expect(publicFoundAfter).toBeDefined();
  });

  it("should delete a career opening", async () => {
    const created = await createOpportunity({
      title: "Temporary Opening",
      department: "Backend Engineering",
      description: "Short term role.",
      eligibility: "Anyone.",
      skills: ["Git"],
      duration: "4 Weeks",
      deadline: "Soon",
      published: true,
    });

    const id = created.opportunity!.id;
    const deleted = await deleteOpportunity(id);
    expect(deleted.success).toBe(true);

    const publicList = await getPublicOpportunities();
    expect(publicList.find((o) => o.id === id)).toBeUndefined();
  });
});
