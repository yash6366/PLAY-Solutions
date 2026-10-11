import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth, ADMIN_COOKIE_NAME, COOKIE_MAX_AGE } from "@/server/auth/session";
import { updateAdminMfa, logAudit, findAdminById } from "@/server/repositories/admin.repository";
import { verifyTotpToken } from "@/server/auth/totp";
import { signAdminSession } from "@/server/auth/jwt";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

const confirmSchema = z.object({
  secret: z.string().min(16, "A valid base32 secret is required"),
  code: z.string().length(6, "Verification code must be 6 digits"),
  hashedRecoveryCodes: z.array(z.string()).min(1, "Recovery codes required"),
});

export async function POST(req: Request) {
  try {
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Cross-site request forgery detected. Request rejected." },
        { status: 403 }
      );
    }

    const session = await requireAdminAuth(undefined, req, { allowUnverifiedMfa: true });

    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`mfa_confirm_${session.userId}`, { limit: 5, windowMs: 300000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed confirmation attempts. Please wait 5 minutes.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = confirmSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid confirmation payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { secret, code, hashedRecoveryCodes } = validation.data;
    const verification = verifyTotpToken(secret, code);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code. Please confirm the time on your authenticator app." },
        { status: 400 }
      );
    }

    const updateRes = await updateAdminMfa(session.userId, {
      mfaEnabled: true,
      mfaSecret: secret,
      mfaRecoveryCodes: hashedRecoveryCodes,
      lastMfaStep: verification.verifiedStep,
    });

    if (!updateRes.success) {
      return NextResponse.json(
        { success: false, error: updateRes.error || "Failed to persist MFA settings." },
        { status: 500 }
      );
    }

    const admin = await findAdminById(session.userId);

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "AUTH_MFA_ENROLLED",
      resource: "admin_portal",
      ipAddress: ip,
    });

    // Refresh active session token with mfaVerified=true
    const newToken = await signAdminSession({
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      tokenVersion: admin?.tokenVersion || 1,
      mfaVerified: true,
    });

    const response = NextResponse.json({
      success: true,
      message: "Multi-factor authentication successfully enabled.",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (err: unknown) {
    console.error("[MFA Confirm Error]", err);
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Internal server error during MFA confirmation" },
      { status: 500 }
    );
  }
}
