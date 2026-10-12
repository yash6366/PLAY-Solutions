import { getIsDatabaseConfigured, isDatabaseConfigured, prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import { MentorInquiryData } from "@/lib/validation/schemas";

export interface StoredMentorInquiry {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  areaOfExpertise: string;
  expertiseAreas?: string[];
  collaborationPreference: string;
  engagementTypes?: string[];
  linkedInOrWebsiteUrl?: string | null;
  linkedInUrl?: string | null;
  introduction: string;
  message?: string;
  status: string;
  internalNotes?: string | null;
  consentGiven: boolean;
  createdAt: Date;
}

export const inMemoryMentorInquiries: StoredMentorInquiry[] = [];

export const isMemoryMode = () =>
  process.env.NODE_ENV !== "production" && process.env.DATABASE_URL === "memory";

export async function createMentorInquiry(data: MentorInquiryData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
  configured: boolean;
  isConnectionError?: boolean;
}> {
  if (isMemoryMode()) {
    const record: StoredMentorInquiry = {
      id: "mnt_" + Math.random().toString(36).substring(2, 10),
      fullName: data.fullName,
      name: data.fullName,
      email: data.email,
      areaOfExpertise: data.areaOfExpertise,
      expertiseAreas: [data.areaOfExpertise],
      collaborationPreference: data.collaborationPreference,
      engagementTypes: [data.collaborationPreference],
      linkedInOrWebsiteUrl: data.linkedInOrWebsiteUrl || null,
      linkedInUrl: data.linkedInOrWebsiteUrl || null,
      introduction: data.introduction,
      message: data.introduction,
      status: "NEW",
      internalNotes: null,
      consentGiven: data.consentGiven,
      createdAt: new Date(),
    };
    inMemoryMentorInquiries.push(record);
    return { success: true, id: record.id, configured: true };
  }

  if (!getIsDatabaseConfigured() || !prisma) {
    return {
      success: false,
      configured: false,
      error:
        "DATABASE_NOT_CONFIGURED: PostgreSQL database has not been connected. Set DATABASE_URL in your .env file to enable mentor collaboration inquiries.",
    };
  }

  try {
    const prefMap: Record<string, "MENTOR_STUDENTS" | "CONDUCT_WORKSHOP" | "ARCHITECTURE_REVIEW" | "PROJECT_COLLABORATION" | "CONSULTING_PARTNERSHIP"> = {
      mentor_students: "MENTOR_STUDENTS",
      conduct_workshop: "CONDUCT_WORKSHOP",
      architecture_review: "ARCHITECTURE_REVIEW",
      project_collaboration: "PROJECT_COLLABORATION",
      consulting_partnership: "CONSULTING_PARTNERSHIP",
    };

    const created = await prisma.mentorInquiry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        areaOfExpertise: data.areaOfExpertise,
        collaborationPreference: prefMap[data.collaborationPreference] || "MENTOR_STUDENTS",
        linkedInOrWebsiteUrl: data.linkedInOrWebsiteUrl,
        introduction: data.introduction,
        consentGiven: data.consentGiven,
      },
    });
    return { success: true, id: created.id, configured: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    const isConnErr = code?.startsWith("P10") || (err as Error)?.name === "PrismaClientInitializationError";

    console.error(`[MentorRepository Error] Code: ${code || "UNKNOWN"}`);

    return {
      success: false,
      configured: true,
      isConnectionError: isConnErr,
      error: isConnErr
        ? "DATABASE_UNAVAILABLE: Database storage is temporarily unreachable. Please retry shortly."
        : "DATABASE_ERROR: Unable to save mentor inquiry. Please retry.",
    };
  }
}

/**
 * Paginated query for mentor proposals.
 */
export async function getMentorInquiries(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<{
  items: StoredMentorInquiry[];
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

  if (isMemoryMode()) {
    let filtered = [...inMemoryMentorInquiries];

    if (status && status !== "ALL") {
      filtered = filtered.filter((m) => m.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.fullName.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search) ||
          m.areaOfExpertise.toLowerCase().includes(search) ||
          m.introduction.toLowerCase().includes(search)
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
    const where: Prisma.MentorInquiryWhereInput = {};
    if (status && status !== "ALL") {
      where.status = status as Prisma.MentorInquiryWhereInput["status"];
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { areaOfExpertise: { contains: search, mode: "insensitive" } },
        { introduction: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.mentorInquiry.count({ where }),
      prisma.mentorInquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items: records.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        name: r.fullName,
        email: r.email,
        areaOfExpertise: r.areaOfExpertise,
        expertiseAreas: [r.areaOfExpertise],
        collaborationPreference: r.collaborationPreference,
        engagementTypes: [r.collaborationPreference],
        linkedInOrWebsiteUrl: r.linkedInOrWebsiteUrl,
        linkedInUrl: r.linkedInOrWebsiteUrl,
        introduction: r.introduction,
        message: r.introduction,
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
    console.error("[MentorRepository Error] getMentorInquiries failed:", (err as Error)?.name);
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

/**
 * Get single mentor inquiry by ID.
 */
export async function getMentorInquiryById(id: string): Promise<StoredMentorInquiry | null> {
  if (isMemoryMode()) {
    return inMemoryMentorInquiries.find((m) => m.id === id) || null;
  }

  if (!isDatabaseConfigured || !prisma) return null;

  try {
    const r = await prisma.mentorInquiry.findUnique({ where: { id } });
    if (!r) return null;

    return {
      id: r.id,
      fullName: r.fullName,
      name: r.fullName,
      email: r.email,
      areaOfExpertise: r.areaOfExpertise,
      expertiseAreas: [r.areaOfExpertise],
      collaborationPreference: r.collaborationPreference,
      engagementTypes: [r.collaborationPreference],
      linkedInOrWebsiteUrl: r.linkedInOrWebsiteUrl,
      linkedInUrl: r.linkedInOrWebsiteUrl,
      introduction: r.introduction,
      message: r.introduction,
      status: r.status,
      internalNotes: r.internalNotes,
      consentGiven: r.consentGiven,
      createdAt: r.createdAt,
    };
  } catch (err) {
    console.error("[MentorRepository Error] getMentorInquiryById failed:", (err as Error)?.name);
    return null;
  }
}

/**
 * Update mentor inquiry status and notes.
 */
export async function updateMentorInquiryStatus(
  id: string,
  status: string,
  internalNotes?: string
): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const item = inMemoryMentorInquiries.find((m) => m.id === id);
    if (!item) return { success: false, error: "Inquiry not found" };
    item.status = status;
    if (internalNotes !== undefined) item.internalNotes = internalNotes;
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    const updateData: Prisma.MentorInquiryUpdateInput = {
      status: status as Prisma.MentorInquiryUpdateInput["status"],
    };
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    await prisma.mentorInquiry.update({ where: { id }, data: updateData });
    return { success: true };
  } catch (err) {
    console.error("[MentorRepository Error] updateMentorInquiryStatus failed:", (err as Error)?.name);
    return { success: false, error: "Failed to update mentor inquiry" };
  }
}

/**
 * Delete mentor inquiry.
 */
export async function deleteMentorInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const index = inMemoryMentorInquiries.findIndex((m) => m.id === id);
    if (index === -1) return { success: false, error: "Inquiry not found" };
    inMemoryMentorInquiries.splice(index, 1);
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    await prisma.mentorInquiry.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[MentorRepository Error] deleteMentorInquiry failed:", (err as Error)?.name);
    return { success: false, error: "Failed to delete mentor inquiry" };
  }
}

/**
 * Mentor inquiry stats for dashboard overview.
 */
export async function getMentorStats(): Promise<{
  total: number;
  newCount: number;
  inReviewCount: number;
  contactedCount: number;
  closedCount: number;
}> {
  if (isMemoryMode()) {
    return {
      total: inMemoryMentorInquiries.length,
      newCount: inMemoryMentorInquiries.filter((m) => m.status === "NEW").length,
      inReviewCount: inMemoryMentorInquiries.filter((m) => m.status === "IN_REVIEW").length,
      contactedCount: inMemoryMentorInquiries.filter((m) => m.status === "CONTACTED").length,
      closedCount: inMemoryMentorInquiries.filter((m) => m.status === "CLOSED").length,
    };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { total: 0, newCount: 0, inReviewCount: 0, contactedCount: 0, closedCount: 0 };
  }

  try {
    const [total, newCount, inReviewCount, contactedCount, closedCount] = await Promise.all([
      prisma.mentorInquiry.count(),
      prisma.mentorInquiry.count({ where: { status: "NEW" } }),
      prisma.mentorInquiry.count({ where: { status: "IN_REVIEW" } }),
      prisma.mentorInquiry.count({ where: { status: "CONTACTED" } }),
      prisma.mentorInquiry.count({ where: { status: "CLOSED" } }),
    ]);

    return { total, newCount, inReviewCount, contactedCount, closedCount };
  } catch (err) {
    console.error("[MentorRepository Error] getMentorStats failed:", (err as Error)?.name);
    return { total: 0, newCount: 0, inReviewCount: 0, contactedCount: 0, closedCount: 0 };
  }
}
