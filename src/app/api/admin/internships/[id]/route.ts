import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth } from "@/server/auth/session";
import {
  getInternshipApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "@/server/repositories/internship.repository";
import { logAudit } from "@/server/repositories/admin.repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  status: z.enum(["PENDING", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "DECLINED"]),
  internalNotes: z.string().max(3000).optional(),
});

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await requireAdminAuth(undefined, req);
    const { id } = await params;
    const application = await getInternshipApplicationById(id);

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
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

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminAuth(["SUPER_ADMIN", "ADMIN"], req);
    const { id } = await params;
    const body = await req.json();

    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status update payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const rawStatus = validation.data.status;
    const normalizedStatus =
      rawStatus === "PENDING"
        ? "SUBMITTED"
        : rawStatus === "REJECTED"
        ? "DECLINED"
        : rawStatus;

    const result = await updateApplicationStatus(id, normalizedStatus, validation.data.internalNotes);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "UPDATE_INTERNSHIP_APPLICATION_STATUS",
      resource: "internship_application",
      targetId: id,
      metadata: { newStatus: normalizedStatus },
    });

    const updatedApp = await getInternshipApplicationById(id);

    return NextResponse.json({
      success: true,
      message: "Application updated successfully.",
      data: updatedApp,
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

    const result = await deleteApplication(id);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "DELETE_INTERNSHIP_APPLICATION",
      resource: "internship_application",
      targetId: id,
    });

    return NextResponse.json({ success: true, message: "Application deleted successfully." });
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
