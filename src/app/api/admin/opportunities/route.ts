import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/server/auth/session";
import {
  getAllAdminOpportunities,
  createOpportunity,
} from "@/server/repositories/opportunity.repository";
import { logAudit } from "@/server/repositories/admin.repository";

const createOpportunitySchema = z.object({
  jobId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  department: z.string().min(2, "Department is required").max(100),
  type: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eligibility: z.string().min(5, "Eligibility is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  duration: z.string().min(2, "Duration is required"),
  locationMode: z.string().optional(),
  compensationStatus: z.string().optional(),
  deadline: z.string().min(2, "Deadline is required"),
  availablePositions: z.number().int().min(1).default(1),
  published: z.boolean().default(true),
});

export async function GET(req: Request) {
  try {
    await requireAdminAuth(undefined, req);
    const opportunities = await getAllAdminOpportunities();
    return NextResponse.json({ success: true, items: opportunities });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch career openings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdminAuth(["SUPER_ADMIN", "ADMIN"], req);
    const body = await req.json();

    const validation = createOpportunitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid opportunity data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await createOpportunity(validation.data);
    if (!result.success || !result.opportunity) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create career opening" },
        { status: 500 }
      );
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "CREATE_CAREER_OPPORTUNITY",
      resource: "internship_opportunity",
      targetId: result.opportunity.id,
      metadata: { title: result.opportunity.title, published: result.opportunity.published },
    });

    // Revalidate public routes so website immediately reflects changes
    try {
      revalidatePath("/internships");
      revalidatePath("/careers");
      revalidatePath("/");
    } catch {
      // ignore in environments where revalidate is not available
    }

    return NextResponse.json({
      success: true,
      message: "Career opening created successfully.",
      opportunity: result.opportunity,
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
