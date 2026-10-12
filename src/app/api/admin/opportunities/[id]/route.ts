import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/server/auth/session";
import {
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "@/server/repositories/opportunity.repository";
import { logAudit } from "@/server/repositories/admin.repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateOpportunitySchema = z.object({
  jobId: z.string().optional(),
  title: z.string().min(3).max(150).optional(),
  department: z.string().min(2).max(100).optional(),
  type: z.string().optional(),
  description: z.string().min(10).optional(),
  eligibility: z.string().min(5).optional(),
  skills: z.array(z.string()).optional(),
  duration: z.string().min(2).optional(),
  locationMode: z.string().optional(),
  compensationStatus: z.string().optional(),
  deadline: z.string().min(2).optional(),
  availablePositions: z.number().int().min(1).optional(),
  published: z.boolean().optional(),
});

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await requireAdminAuth(undefined, req);
    const { id } = await params;
    const opp = await getOpportunityById(id);

    if (!opp) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, opportunity: opp });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminAuth(["SUPER_ADMIN", "ADMIN"], req);
    const { id } = await params;
    const body = await req.json();

    const validation = updateOpportunitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid update data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await updateOpportunity(id, validation.data);
    if (!result.success || !result.opportunity) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update opportunity" },
        { status: 404 }
      );
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "UPDATE_CAREER_OPPORTUNITY",
      resource: "internship_opportunity",
      targetId: id,
      metadata: { ...validation.data },
    });

    try {
      revalidatePath("/internships");
      revalidatePath("/careers");
      revalidatePath("/");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Career opening updated successfully.",
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminAuth(["SUPER_ADMIN", "ADMIN"], req);
    const { id } = await params;

    const result = await deleteOpportunity(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to delete opportunity" },
        { status: 404 }
      );
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "DELETE_CAREER_OPPORTUNITY",
      resource: "internship_opportunity",
      targetId: id,
    });

    try {
      revalidatePath("/internships");
      revalidatePath("/careers");
      revalidatePath("/");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Career opening deleted successfully.",
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
