import { isDatabaseConfigured, prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import { ContactFormData } from "@/lib/validation/schemas";

export interface StoredInquiry {
  id: string;
  type: string;
  inquiryType?: string;
  name: string;
  email: string;
  organization?: string | null;
  projectCategory?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
  status: string;
  internalNotes?: string | null;
  consentGiven: boolean;
  createdAt: Date;
}

// In-memory test store used when DATABASE_URL="memory" during non-production test runs
export const inMemoryInquiries: StoredInquiry[] = [];

// In-memory mock storage is strictly disallowed in production environments
export const isMemoryMode = () =>
  process.env.NODE_ENV !== "production" && process.env.DATABASE_URL === "memory";

export interface RepositoryResult {
  success: boolean;
  id?: string;
  error?: string;
  configured: boolean;
  isConnectionError?: boolean;
}

export async function createInquiry(data: ContactFormData): Promise<RepositoryResult> {
  // If explicitly testing memory mode (non-production only)
  if (isMemoryMode()) {
    const record: StoredInquiry = {
      id: "inq_" + Math.random().toString(36).substring(2, 10),
      type: data.inquiryType.toUpperCase(),
      inquiryType: data.inquiryType.toUpperCase(),
      name: data.name,
      email: data.email,
      organization: data.organization || null,
      projectCategory: data.projectCategory || null,
      budgetRange: data.budgetRange || null,
      timeline: data.timeline || null,
      message: data.message,
      status: "NEW",
      internalNotes: null,
      consentGiven: data.consentGiven,
      createdAt: new Date(),
    };
    inMemoryInquiries.push(record);
    return { success: true, id: record.id, configured: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return {
      success: false,
      configured: false,
      error:
        "DATABASE_NOT_CONFIGURED: PostgreSQL database has not been connected. Set DATABASE_URL in your .env file to enable live persistence.",
    };
  }

  try {
    const created = await prisma.inquiry.create({
      data: {
        type: data.inquiryType.toUpperCase() as "BUSINESS" | "STUDENT" | "COLLABORATION" | "GENERAL",
        name: data.name,
        email: data.email,
        organization: data.organization,
        projectCategory: data.projectCategory,
        budgetRange: data.budgetRange,
        timeline: data.timeline,
        message: data.message,
        consentGiven: data.consentGiven,
      },
    });
    return { success: true, id: created.id, configured: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    const isConnErr = code?.startsWith("P10") || (err as Error)?.name === "PrismaClientInitializationError";

    // Sanitize log to never output connection secrets
    console.error(`[InquiryRepository Error] Code: ${code || "UNKNOWN"}`);

    return {
      success: false,
      configured: true,
      isConnectionError: isConnErr,
      error: isConnErr
        ? "DATABASE_UNAVAILABLE: Database storage is temporarily unreachable. Please retry shortly."
        : "DATABASE_ERROR: Unable to persist inquiry at this time. Please try again shortly.",
    };
  }
}

/**
 * Paginated query for administrative dashboard.
 */
export async function getInquiries(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
}): Promise<{
  items: StoredInquiry[];
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
  const type = params.type?.toUpperCase().trim() || "";

  if (isMemoryMode()) {
    let filtered = [...inMemoryInquiries];

    const normalizedStatus = status === "IN_PROGRESS" ? "IN_REVIEW" : status;
    if (status && status !== "ALL") {
      filtered = filtered.filter((i) => i.status === normalizedStatus || (status === "IN_PROGRESS" && i.status === "IN_PROGRESS"));
    }
    if (type && type !== "ALL") {
      filtered = filtered.filter((i) => i.type === type);
    }
    if (search) {
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.email.toLowerCase().includes(search) ||
          i.message.toLowerCase().includes(search) ||
          (i.organization && i.organization.toLowerCase().includes(search))
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
    const where: Prisma.InquiryWhereInput = {};
    const normalizedStatus = status === "IN_PROGRESS" ? "IN_REVIEW" : status;
    if (status && status !== "ALL") {
      where.status = normalizedStatus as Prisma.EnumInquiryStatusFilter["equals"];
    }
    if (type && type !== "ALL") {
      where.type = type as Prisma.EnumInquiryTypeFilter["equals"];
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items: records.map((r) => ({
        id: r.id,
        type: r.type,
        inquiryType: r.type,
        name: r.name,
        email: r.email,
        organization: r.organization,
        projectCategory: r.projectCategory,
        budgetRange: r.budgetRange,
        timeline: r.timeline,
        message: r.message,
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
    console.error("[InquiryRepository Error] getInquiries failed:", (err as Error)?.name);
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

/**
 * Get inquiry by ID.
 */
export async function getInquiryById(id: string): Promise<StoredInquiry | null> {
  if (isMemoryMode()) {
    return inMemoryInquiries.find((i) => i.id === id) || null;
  }

  if (!isDatabaseConfigured || !prisma) return null;

  try {
    const r = await prisma.inquiry.findUnique({ where: { id } });
    if (!r) return null;

    return {
      id: r.id,
      type: r.type,
      inquiryType: r.type,
      name: r.name,
      email: r.email,
      organization: r.organization,
      projectCategory: r.projectCategory,
      budgetRange: r.budgetRange,
      timeline: r.timeline,
      message: r.message,
      status: r.status,
      internalNotes: r.internalNotes,
      consentGiven: r.consentGiven,
      createdAt: r.createdAt,
    };
  } catch (err) {
    console.error("[InquiryRepository Error] getInquiryById failed:", (err as Error)?.name);
    return null;
  }
}

/**
 * Update inquiry status and internal notes.
 */
export async function updateInquiryStatus(
  id: string,
  status: string,
  internalNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedStatus = status === "IN_PROGRESS" ? "IN_REVIEW" : status;
  if (isMemoryMode()) {
    const item = inMemoryInquiries.find((i) => i.id === id);
    if (!item) return { success: false, error: "Inquiry not found" };
    item.status = normalizedStatus;
    if (internalNotes !== undefined) item.internalNotes = internalNotes;
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    const updateData: Prisma.InquiryUpdateInput = {
      status: normalizedStatus as Prisma.InquiryUpdateInput["status"],
    };
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    await prisma.inquiry.update({
      where: { id },
      data: updateData,
    });
    return { success: true };
  } catch (err) {
    console.error("[InquiryRepository Error] updateInquiryStatus failed:", (err as Error)?.name);
    return { success: false, error: "Failed to update inquiry status" };
  }
}

/**
 * Delete inquiry.
 */
export async function deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const index = inMemoryInquiries.findIndex((i) => i.id === id);
    if (index === -1) return { success: false, error: "Inquiry not found" };
    inMemoryInquiries.splice(index, 1);
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    await prisma.inquiry.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[InquiryRepository Error] deleteInquiry failed:", (err as Error)?.name);
    return { success: false, error: "Failed to delete inquiry" };
  }
}

/**
 * Aggregate inquiry metrics for dashboard overview.
 */
export async function getInquiryStats(): Promise<{
  total: number;
  newCount: number;
  inReviewCount: number;
  contactedCount: number;
  closedCount: number;
}> {
  if (isMemoryMode()) {
    return {
      total: inMemoryInquiries.length,
      newCount: inMemoryInquiries.filter((i) => i.status === "NEW").length,
      inReviewCount: inMemoryInquiries.filter((i) => i.status === "IN_REVIEW").length,
      contactedCount: inMemoryInquiries.filter((i) => i.status === "CONTACTED").length,
      closedCount: inMemoryInquiries.filter((i) => i.status === "CLOSED").length,
    };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { total: 0, newCount: 0, inReviewCount: 0, contactedCount: 0, closedCount: 0 };
  }

  try {
    const [total, newCount, inReviewCount, contactedCount, closedCount] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.count({ where: { status: "IN_REVIEW" } }),
      prisma.inquiry.count({ where: { status: "CONTACTED" } }),
      prisma.inquiry.count({ where: { status: "CLOSED" } }),
    ]);

    return { total, newCount, inReviewCount, contactedCount, closedCount };
  } catch (err) {
    console.error("[InquiryRepository Error] getInquiryStats failed:", (err as Error)?.name);
    return { total: 0, newCount: 0, inReviewCount: 0, contactedCount: 0, closedCount: 0 };
  }
}
