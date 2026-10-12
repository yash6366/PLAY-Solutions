import { getIsDatabaseConfigured, isDatabaseConfigured, prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import { InternshipApplicationData } from "@/lib/validation/schemas";
import { RepositoryResult } from "./inquiry.repository";

export interface StoredInternshipApplication {
  id: string;
  opportunityId: string;
  positionId?: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string | null;
  education: string;
  university?: string;
  skills: string;
  motivationStatement: string;
  statementOfInterest?: string;
  portfolioUrl?: string | null;
  linkedInUrl?: string | null;
  status: string;
  internalNotes?: string | null;
  consentGiven: boolean;
  createdAt: Date;
}

export const inMemoryApplications: StoredInternshipApplication[] = [];

export const isMemoryMode = () =>
  process.env.NODE_ENV !== "production" && process.env.DATABASE_URL === "memory";

export async function createInternshipApplication(
  data: InternshipApplicationData
): Promise<RepositoryResult> {
  if (isMemoryMode()) {
    const record: StoredInternshipApplication = {
      id: "app_" + Math.random().toString(36).substring(2, 10),
      opportunityId: data.opportunityId,
      positionId: data.opportunityId,
      fullName: data.fullName,
      name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      education: data.education,
      university: data.education,
      skills: data.relevantSkills,
      motivationStatement: data.motivationStatement,
      statementOfInterest: data.motivationStatement,
      portfolioUrl: data.portfolioUrl || null,
      linkedInUrl: data.linkedInUrl || null,
      status: "SUBMITTED",
      internalNotes: null,
      consentGiven: data.consentGiven,
      createdAt: new Date(),
    };
    inMemoryApplications.push(record);
    return { success: true, id: record.id, configured: true };
  }

  if (!getIsDatabaseConfigured() || !prisma) {
    return {
      success: false,
      configured: false,
      error:
        "DATABASE_NOT_CONFIGURED: PostgreSQL database has not been connected. Set DATABASE_URL in your .env file to enable internship application persistence.",
    };
  }

  try {
    const created = await prisma.internshipApplication.create({
      data: {
        opportunityId: data.opportunityId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        education: data.education,
        skills: data.relevantSkills,
        motivationStatement: data.motivationStatement,
        portfolioUrl: data.portfolioUrl,
        linkedInUrl: data.linkedInUrl,
        consentGiven: data.consentGiven,
      },
    });
    return { success: true, id: created.id, configured: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    const isConnErr = code?.startsWith("P10") || (err as Error)?.name === "PrismaClientInitializationError";

    console.error(`[InternshipRepository Error] Code: ${code || "UNKNOWN"}`);

    return {
      success: false,
      configured: true,
      isConnectionError: isConnErr,
      error: isConnErr
        ? "DATABASE_UNAVAILABLE: Application storage is temporarily unreachable. Please retry shortly."
        : "DATABASE_ERROR: Unable to store internship application. Please retry.",
    };
  }
}

/**
 * Paginated admin query for student applications.
 */
export async function getInternshipApplications(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  opportunityId?: string;
}): Promise<{
  items: StoredInternshipApplication[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 10));
  const skip = (page - 1) * pageSize;
  const search = params.search?.toLowerCase().trim() || "";
  const status = params.status?.trim() || "";
  const opportunityId = params.opportunityId?.trim() || "";

  if (isMemoryMode()) {
    let filtered = [...inMemoryApplications];

    if (status && status !== "ALL") {
      filtered = filtered.filter((a) => a.status === status);
    }
    if (opportunityId && opportunityId !== "ALL") {
      filtered = filtered.filter((a) => a.opportunityId === opportunityId);
    }
    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.fullName.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          a.skills.toLowerCase().includes(search) ||
          a.education.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const total = filtered.length;
    const items = filtered.slice(skip, skip + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }

  try {
    const where: Prisma.InternshipApplicationWhereInput = {};
    if (status && status !== "ALL") {
      where.status = status as Prisma.EnumApplicationStatusFilter["equals"];
    }
    if (opportunityId && opportunityId !== "ALL") where.opportunityId = opportunityId;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { skills: { contains: search, mode: "insensitive" } },
        { education: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.internshipApplication.count({ where }),
      prisma.internshipApplication.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items: records.map((r) => ({
        id: r.id,
        opportunityId: r.opportunityId,
        positionId: r.opportunityId,
        fullName: r.fullName,
        name: r.fullName,
        email: r.email,
        phone: r.phone,
        education: r.education,
        university: r.education,
        skills: r.skills,
        motivationStatement: r.motivationStatement,
        statementOfInterest: r.motivationStatement,
        portfolioUrl: r.portfolioUrl,
        linkedInUrl: r.linkedInUrl,
        status: r.status,
        internalNotes: r.internalNotes,
        consentGiven: r.consentGiven,
        createdAt: r.createdAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (err) {
    console.error("[InternshipRepository Error] getInternshipApplications failed:", (err as Error)?.name);
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

/**
 * Get single application by ID.
 */
export async function getInternshipApplicationById(id: string): Promise<StoredInternshipApplication | null> {
  if (isMemoryMode()) {
    return inMemoryApplications.find((a) => a.id === id) || null;
  }

  if (!isDatabaseConfigured || !prisma) return null;

  try {
    const r = await prisma.internshipApplication.findUnique({ where: { id } });
    if (!r) return null;

    return {
      id: r.id,
      opportunityId: r.opportunityId,
      positionId: r.opportunityId,
      fullName: r.fullName,
      name: r.fullName,
      email: r.email,
      phone: r.phone,
      education: r.education,
      university: r.education,
      skills: r.skills,
      motivationStatement: r.motivationStatement,
      statementOfInterest: r.motivationStatement,
      portfolioUrl: r.portfolioUrl,
      linkedInUrl: r.linkedInUrl,
      status: r.status,
      internalNotes: r.internalNotes,
      consentGiven: r.consentGiven,
      createdAt: r.createdAt,
    };
  } catch (err) {
    console.error("[InternshipRepository Error] getInternshipApplicationById failed:", (err as Error)?.name);
    return null;
  }
}

/**
 * Update application status and notes.
 */
export async function updateApplicationStatus(
  id: string,
  status: string,
  internalNotes?: string
): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const item = inMemoryApplications.find((a) => a.id === id);
    if (!item) return { success: false, error: "Application not found" };
    item.status = status;
    if (internalNotes !== undefined) item.internalNotes = internalNotes;
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    const updateData: Prisma.InternshipApplicationUpdateInput = {
      status: status as Prisma.InternshipApplicationUpdateInput["status"],
    };
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    await prisma.internshipApplication.update({ where: { id }, data: updateData });
    return { success: true };
  } catch (err) {
    console.error("[InternshipRepository Error] updateApplicationStatus failed:", (err as Error)?.name);
    return { success: false, error: "Failed to update application" };
  }
}

/**
 * Delete application.
 */
export async function deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const index = inMemoryApplications.findIndex((a) => a.id === id);
    if (index === -1) return { success: false, error: "Application not found" };
    inMemoryApplications.splice(index, 1);
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    await prisma.internshipApplication.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[InternshipRepository Error] deleteApplication failed:", (err as Error)?.name);
    return { success: false, error: "Failed to delete application" };
  }
}

/**
 * Application statistics for overview dashboard.
 */
export async function getApplicationStats(): Promise<{
  total: number;
  submittedCount: number;
  underReviewCount: number;
  shortlistedCount: number;
  acceptedCount: number;
  declinedCount: number;
}> {
  if (isMemoryMode()) {
    return {
      total: inMemoryApplications.length,
      submittedCount: inMemoryApplications.filter((a) => a.status === "SUBMITTED").length,
      underReviewCount: inMemoryApplications.filter((a) => a.status === "UNDER_REVIEW").length,
      shortlistedCount: inMemoryApplications.filter((a) => a.status === "SHORTLISTED").length,
      acceptedCount: inMemoryApplications.filter((a) => a.status === "ACCEPTED").length,
      declinedCount: inMemoryApplications.filter((a) => a.status === "DECLINED").length,
    };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { total: 0, submittedCount: 0, underReviewCount: 0, shortlistedCount: 0, acceptedCount: 0, declinedCount: 0 };
  }

  try {
    const [total, submittedCount, underReviewCount, shortlistedCount, acceptedCount, declinedCount] = await Promise.all([
      prisma.internshipApplication.count(),
      prisma.internshipApplication.count({ where: { status: "SUBMITTED" } }),
      prisma.internshipApplication.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.internshipApplication.count({ where: { status: "SHORTLISTED" } }),
      prisma.internshipApplication.count({ where: { status: "ACCEPTED" } }),
      prisma.internshipApplication.count({ where: { status: "DECLINED" } }),
    ]);

    return { total, submittedCount, underReviewCount, shortlistedCount, acceptedCount, declinedCount };
  } catch (err) {
    console.error("[InternshipRepository Error] getApplicationStats failed:", (err as Error)?.name);
    return { total: 0, submittedCount: 0, underReviewCount: 0, shortlistedCount: 0, acceptedCount: 0, declinedCount: 0 };
  }
}
