import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth } from "@/server/auth/session";
import { resetAdminMfa, logAudit, findAdminById } from "@/server/repositories/admin.repository";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

const resetSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
  reason: z.string().min(5, "A reason for resetting MFA is required"),
});

export async function POST(req: Request) {
  try {
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Cross-site request forgery detected. Request rejected." },
        { status: 403 }
      );
    }

    // Only fully verified SUPER_ADMIN can reset MFA for other accounts
    const session = await requireAdminAuth(["SUPER_ADMIN"], req);

    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`mfa_reset_${session.userId}`, { limit: 5, windowMs: 900000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many reset attempts. Please wait 15 minutes.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = resetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid reset payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { targetUserId, reason } = validation.data;
    const targetUser = await findAdminById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Target administrator not found" }, { status: 404 });
    }

    const result = await resetAdminMfa(targetUserId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Failed to reset MFA" }, { status: 500 });
    }

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "AUTH_MFA_RESET",
      resource: "admin_user",
      targetId: targetUserId,
      metadata: { targetEmail: targetUser.email, reason },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `MFA has been successfully reset for ${targetUser.email}. All existing active sessions were revoked.`,
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
      { success: false, error: "Internal server error during MFA reset" },
      { status: 500 }
    );
  }
}
