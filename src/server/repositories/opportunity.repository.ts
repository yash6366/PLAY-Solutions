import { isDatabaseConfigured, prisma } from "@/lib/database/prisma";
import { internshipOpportunities as fallbackOpportunities } from "@/content/internships";
import { OpportunityType } from "@prisma/client";

export interface OpportunityItem {
  id: string;
  jobId: string;
  slug: string;
  title: string;
  department: string;
  type: string;
  description: string;
  eligibility: string;
  skills: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  duration: string;
  locationMode: string;
  compensationStatus: string;
  deadline: string;
  availablePositions: number;
  published: boolean;
  termsAndExpectations?: string[];
  applicantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const inMemoryDynamicOpportunities: OpportunityItem[] = [];

export const BASE_JOB_ID_NUMBER = 11; // Sequential starting from 00011

export function formatJobId(num: number): string {
  return num.toString().padStart(5, "0");
}

export function parseMetadata(description: string): {
  cleanDescription: string;
  jobId?: string;
  customType?: string;
} {
  const metaMatch = (description || "").match(/^<!--meta:(\{.*?\})-->\n?/);
  if (metaMatch) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      return {
        cleanDescription: description.replace(metaMatch[0], "").trim(),
        jobId: parsed.jobId,
        customType: parsed.type,
      };
    } catch {
      // ignore
    }
  }
  return { cleanDescription: (description || "").trim() };
}

export function packMetadata(
  description: string,
  metadata: { jobId?: string; type?: string }
): string {
  const { cleanDescription } = parseMetadata(description);
  const metaStr = `<!--meta:${JSON.stringify(metadata)}-->\n`;
  return `${metaStr}${cleanDescription}`;
}

const isMemoryMode = () =>
  process.env.NODE_ENV !== "production" && process.env.DATABASE_URL === "memory";

function formatTypeForDisplay(type: string): string {
  if (type === "TECHNICAL_INTERNSHIP") return "Technical Internship";
  if (type === "PROJECT_APPRENTICESHIP") return "Project Apprenticeship";
  if (type === "RESEARCH_FELLOWSHIP") return "Research Fellowship";
  return type.replace(/_/g, " ");
}

function normalizePrismaType(typeStr: string): OpportunityType {
  const clean = (typeStr || "").trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (clean.includes("PROJECT") || clean.includes("APPRENTICE")) {
    return OpportunityType.PROJECT_APPRENTICESHIP;
  }
  if (clean.includes("RESEARCH") || clean.includes("FELLOW")) {
    return OpportunityType.RESEARCH_FELLOWSHIP;
  }
  return OpportunityType.TECHNICAL_INTERNSHIP;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetch all published opportunities for public display on the website (/internships, /careers).
 */
export async function getPublicOpportunities(): Promise<OpportunityItem[]> {
  if (isMemoryMode()) {
    if (inMemoryDynamicOpportunities.length > 0) {
      return inMemoryDynamicOpportunities.filter((o) => o.published);
    }
    return fallbackOpportunities.map((fb, idx) => ({
      ...fb,
      jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
      skills: fb.requiredSkills,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as OpportunityItem[];
  }

  if (!isDatabaseConfigured || !prisma) {
    return fallbackOpportunities.map((fb, idx) => ({
      ...fb,
      jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
      skills: fb.requiredSkills,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as OpportunityItem[];
  }

  try {
    // Query chronological to keep stable sequential Job ID numbering
    const rawAsc = await prisma.internshipOpportunity.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (!rawAsc || rawAsc.length === 0) {
      return fallbackOpportunities.map((fb, idx) => ({
        ...fb,
        jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
        skills: fb.requiredSkills,
        applicantCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as unknown as OpportunityItem[];
    }

    // Map each with its stable jobId starting from 00011
    const mapped: OpportunityItem[] = rawAsc.map((r, idx) => {
      const { cleanDescription, jobId: savedJobId, customType } = parseMetadata(r.description);
      const jobId = savedJobId || formatJobId(BASE_JOB_ID_NUMBER + idx);
      const displayType = customType || formatTypeForDisplay(r.type);

      return {
        id: r.id,
        jobId,
        slug: r.slug,
        title: r.title,
        department: r.department,
        type: displayType,
        description: cleanDescription,
        eligibility: r.eligibility,
        skills: r.skills || [],
        requiredSkills: r.skills && r.skills.length > 0 ? r.skills : ["Foundational Engineering"],
        preferredSkills: [],
        duration: r.duration,
        locationMode: r.locationMode,
        compensationStatus: r.compensationStatus,
        deadline: r.deadline,
        availablePositions: r.availablePositions,
        published: r.published,
        termsAndExpectations: [
          "Active participation in weekly code reviews and sprint planning",
          "Completion of collaborative engineering assignments and milestones",
          "Official certificate of completion and performance recommendation upon evaluation",
        ],
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    // Return only published, newest first
    return mapped
      .filter((o) => o.published)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.error("[OpportunityRepository Error] getPublicOpportunities failed:", (err as Error)?.name);
    return fallbackOpportunities.map((fb, idx) => ({
      ...fb,
      jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
      skills: fb.requiredSkills,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as OpportunityItem[];
  }
}

/**
 * Fetch all opportunities (both published and drafts) for Admin Dashboard management.
 */
export async function getAllAdminOpportunities(): Promise<OpportunityItem[]> {
  if (isMemoryMode()) {
    if (inMemoryDynamicOpportunities.length === 0) {
      fallbackOpportunities.forEach((fb, idx) => {
        inMemoryDynamicOpportunities.push({
          ...fb,
          jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
          skills: fb.requiredSkills,
          applicantCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }
    return inMemoryDynamicOpportunities;
  }

  if (!isDatabaseConfigured || !prisma) {
    return fallbackOpportunities.map((fb, idx) => ({
      ...fb,
      jobId: fb.jobId || formatJobId(BASE_JOB_ID_NUMBER + idx),
      skills: fb.requiredSkills,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  try {
    const records = await prisma.internshipOpportunity.findMany({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const mapped = records.map((r, idx) => {
      const { cleanDescription, jobId: savedJobId, customType } = parseMetadata(r.description);
      const jobId = savedJobId || formatJobId(BASE_JOB_ID_NUMBER + idx);
      const displayType = customType || formatTypeForDisplay(r.type);

      return {
        id: r.id,
        jobId,
        slug: r.slug,
        title: r.title,
        department: r.department,
        type: displayType,
        description: cleanDescription,
        eligibility: r.eligibility,
        skills: r.skills || [],
        requiredSkills: r.skills || [],
        preferredSkills: [],
        duration: r.duration,
        locationMode: r.locationMode,
        compensationStatus: r.compensationStatus,
        deadline: r.deadline,
        availablePositions: r.availablePositions,
        published: r.published,
        applicantCount: r._count?.applications || 0,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    // Sort newest first for admin dashboard overview
    return mapped.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.error("[OpportunityRepository Error] getAllAdminOpportunities failed:", (err as Error)?.name);
    return [];
  }
}

/**
 * Get opportunity by ID.
 */
export async function getOpportunityById(id: string): Promise<OpportunityItem | null> {
  const all = await getAllAdminOpportunities();
  return all.find((o) => o.id === id) || null;
}

/**
 * Create a new opportunity / career posting.
 */
export async function createOpportunity(data: {
  jobId?: string;
  title: string;
  department: string;
  type?: string;
  description: string;
  eligibility: string;
  skills: string[];
  duration: string;
  locationMode?: string;
  compensationStatus?: string;
  deadline: string;
  availablePositions?: number;
  published?: boolean;
}): Promise<{ success: boolean; opportunity?: OpportunityItem; error?: string }> {
  // Determine next sequential Job ID starting from 00011
  const existing = await getAllAdminOpportunities();
  let finalJobId = data.jobId?.trim();
  if (!finalJobId) {
    const maxNum = existing.reduce((max, opp) => {
      const num = parseInt(opp.jobId.replace(/\D/g, ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, BASE_JOB_ID_NUMBER - 1);
    finalJobId = formatJobId(maxNum + 1);
  }

  const rawType = data.type || "Technical Internship";
  const prismaType = normalizePrismaType(rawType);
  const baseSlug = slugify(data.title);
  const slug = `${finalJobId}-${baseSlug}-${Date.now().toString(36)}`;

  // Pack custom type and jobId into metadata header
  const packedDescription = packMetadata(data.description, {
    jobId: finalJobId,
    type: rawType,
  });

  if (isMemoryMode()) {
    const item: OpportunityItem = {
      id: "opp_" + Math.random().toString(36).substring(2, 10),
      jobId: finalJobId,
      slug,
      title: data.title,
      department: data.department,
      type: rawType,
      description: data.description.trim(),
      eligibility: data.eligibility,
      skills: data.skills,
      requiredSkills: data.skills,
      preferredSkills: [],
      duration: data.duration,
      locationMode: data.locationMode || "Remote",
      compensationStatus: data.compensationStatus || "Educational / Project Stipend",
      deadline: data.deadline,
      availablePositions: data.availablePositions || 1,
      published: data.published !== false,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryDynamicOpportunities.unshift(item);
    return { success: true, opportunity: item };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured." };
  }

  try {
    const created = await prisma.internshipOpportunity.create({
      data: {
        title: data.title,
        slug,
        department: data.department,
        type: prismaType,
        description: packedDescription,
        eligibility: data.eligibility,
        skills: data.skills,
        duration: data.duration,
        locationMode: data.locationMode || "Remote",
        compensationStatus:
          data.compensationStatus || "Educational / Project Stipend Evaluated per Cohort",
        deadline: data.deadline,
        availablePositions: data.availablePositions || 1,
        published: data.published !== false,
      },
    });

    return {
      success: true,
      opportunity: {
        id: created.id,
        jobId: finalJobId,
        slug: created.slug,
        title: created.title,
        department: created.department,
        type: rawType,
        description: data.description.trim(),
        eligibility: created.eligibility,
        skills: created.skills,
        requiredSkills: created.skills,
        preferredSkills: [],
        duration: created.duration,
        locationMode: created.locationMode,
        compensationStatus: created.compensationStatus,
        deadline: created.deadline,
        availablePositions: created.availablePositions,
        published: created.published,
        applicantCount: 0,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[OpportunityRepository Error] createOpportunity failed:", (err as Error)?.name);
    return { success: false, error: "Failed to persist career opening." };
  }
}

/**
 * Update an existing opportunity / career posting.
 */
export async function updateOpportunity(
  id: string,
  data: Partial<{
    jobId: string;
    title: string;
    department: string;
    type: string;
    description: string;
    eligibility: string;
    skills: string[];
    duration: string;
    locationMode: string;
    compensationStatus: string;
    deadline: string;
    availablePositions: number;
    published: boolean;
  }>
): Promise<{ success: boolean; opportunity?: OpportunityItem; error?: string }> {
  const existing = await getOpportunityById(id);
  if (!existing) {
    return { success: false, error: "Opportunity not found." };
  }

  const updatedJobId = data.jobId || existing.jobId;
  const updatedType = data.type || existing.type;
  const updatedDesc = data.description !== undefined ? data.description : existing.description;

  if (isMemoryMode()) {
    const item = inMemoryDynamicOpportunities.find((o) => o.id === id);
    if (!item) return { success: false, error: "Opportunity not found." };

    if (data.jobId !== undefined) item.jobId = data.jobId;
    if (data.title !== undefined) item.title = data.title;
    if (data.department !== undefined) item.department = data.department;
    if (data.type !== undefined) item.type = data.type;
    if (data.description !== undefined) item.description = data.description;
    if (data.eligibility !== undefined) item.eligibility = data.eligibility;
    if (data.skills !== undefined) {
      item.skills = data.skills;
      item.requiredSkills = data.skills;
    }
    if (data.duration !== undefined) item.duration = data.duration;
    if (data.locationMode !== undefined) item.locationMode = data.locationMode;
    if (data.compensationStatus !== undefined) item.compensationStatus = data.compensationStatus;
    if (data.deadline !== undefined) item.deadline = data.deadline;
    if (data.availablePositions !== undefined) item.availablePositions = data.availablePositions;
    if (data.published !== undefined) item.published = data.published;
    item.updatedAt = new Date().toISOString();

    return { success: true, opportunity: item };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured." };
  }

  try {
    const packedDescription = packMetadata(updatedDesc, {
      jobId: updatedJobId,
      type: updatedType,
    });

    const updateData: {
      title?: string;
      department?: string;
      type?: OpportunityType;
      description?: string;
      eligibility?: string;
      skills?: string[];
      duration?: string;
      locationMode?: string;
      compensationStatus?: string;
      deadline?: string;
      availablePositions?: number;
      published?: boolean;
    } = {
      description: packedDescription,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.type !== undefined) updateData.type = normalizePrismaType(data.type);
    if (data.eligibility !== undefined) updateData.eligibility = data.eligibility;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.locationMode !== undefined) updateData.locationMode = data.locationMode;
    if (data.compensationStatus !== undefined) updateData.compensationStatus = data.compensationStatus;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.availablePositions !== undefined) updateData.availablePositions = data.availablePositions;
    if (data.published !== undefined) updateData.published = data.published;

    const updated = await prisma.internshipOpportunity.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return {
      success: true,
      opportunity: {
        id: updated.id,
        jobId: updatedJobId,
        slug: updated.slug,
        title: updated.title,
        department: updated.department,
        type: updatedType,
        description: updatedDesc,
        eligibility: updated.eligibility,
        skills: updated.skills,
        requiredSkills: updated.skills,
        preferredSkills: [],
        duration: updated.duration,
        locationMode: updated.locationMode,
        compensationStatus: updated.compensationStatus,
        deadline: updated.deadline,
        availablePositions: updated.availablePositions,
        published: updated.published,
        applicantCount: updated._count?.applications || 0,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[OpportunityRepository Error] updateOpportunity failed:", (err as Error)?.name);
    return { success: false, error: "Failed to update career opening." };
  }
}

/**
 * Delete an opportunity.
 */
export async function deleteOpportunity(id: string): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const idx = inMemoryDynamicOpportunities.findIndex((o) => o.id === id);
    if (idx === -1) return { success: false, error: "Opportunity not found." };
    inMemoryDynamicOpportunities.splice(idx, 1);
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured." };
  }

  try {
    await prisma.internshipOpportunity.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[OpportunityRepository Error] deleteOpportunity failed:", (err as Error)?.name);
    return { success: false, error: "Failed to delete career opening." };
  }
}
