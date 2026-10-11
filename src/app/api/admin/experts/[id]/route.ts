import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth } from "@/server/auth/session";
import {
  getMentorInquiryById,
  updateMentorInquiryStatus,
  deleteMentorInquiry,
} from "@/server/repositories/mentor.repository";
import { logAudit } from "@/server/repositories/admin.repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  status: z.enum(["NEW", "UNDER_REVIEW", "CONTACTED", "ACTIVE", "DECLINED", "IN_REVIEW", "CLOSED", "ARCHIVED"]),
  internalNotes: z.string().max(3000).optional(),
});

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await requireAdminAuth(undefined, req);
    const { id } = await params;
    const inquiry = await getMentorInquiryById(id);

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Mentor inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
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
      rawStatus === "UNDER_REVIEW"
        ? "IN_REVIEW"
        : rawStatus === "ACTIVE"
        ? "CONTACTED"
        : rawStatus === "DECLINED"
        ? "CLOSED"
        : rawStatus;

    const result = await updateMentorInquiryStatus(id, normalizedStatus, validation.data.internalNotes);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "UPDATE_MENTOR_INQUIRY_STATUS",
      resource: "mentor_inquiry",
      targetId: id,
      metadata: { newStatus: normalizedStatus },
    });

    const updatedInquiry = await getMentorInquiryById(id);

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully.",
      data: updatedInquiry,
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

    const result = await deleteMentorInquiry(id);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "DELETE_MENTOR_INQUIRY",
      resource: "mentor_inquiry",
      targetId: id,
    });

    return NextResponse.json({ success: true, message: "Mentor inquiry deleted successfully." });
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
