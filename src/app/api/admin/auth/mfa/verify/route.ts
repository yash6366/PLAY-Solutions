import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyMfaChallengeToken, signAdminSession } from "@/server/auth/jwt";
import { findAdminById, updateAdminLastLogin, logAudit, consumeRecoveryCode, updateAdminLastMfaStep } from "@/server/repositories/admin.repository";
import { verifyTotpToken, verifyRecoveryCode } from "@/server/auth/totp";
import { ADMIN_COOKIE_NAME, COOKIE_MAX_AGE } from "@/server/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

const verifySchema = z.object({
  challengeToken: z.string().min(1, "Challenge token is required"),
  code: z.string().min(1, "Verification code is required"),
});

export async function POST(req: Request) {
  try {
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Cross-site request forgery detected." },
        { status: 403 }
      );
    }

    const ip = getClientIp(req);
    // Rate limit MFA verification attempts: 5 per 3 minutes
    const rateLimit = await checkRateLimit(`mfa_verify_${ip}`, { limit: 5, windowMs: 180000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed MFA verification attempts. Please wait 3 minutes.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        { status: 429, headers: { "Retry-After": rateLimit.resetSeconds.toString() } }
      );
    }

    const body = await req.json();
    const validation = verifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid verification payload." },
        { status: 400 }
      );
    }

    const { challengeToken, code } = validation.data;
    const challengePayload = await verifyMfaChallengeToken(challengeToken);

    if (!challengePayload) {
      return NextResponse.json(
        { success: false, error: "MFA challenge expired or invalid. Please sign in again." },
        { status: 401 }
      );
    }

    const admin = await findAdminById(challengePayload.userId);
    if (!admin || !admin.isActive || !admin.mfaSecret) {
      return NextResponse.json(
        { success: false, error: "Authentication state invalid." },
        { status: 401 }
      );
    }

    let isVerified = false;
    let usedRecoveryCode = false;

    // 1. Try TOTP token (6 digits) with replay protection
    if (/^\d{6}$/.test(code.trim())) {
      const totpResult = verifyTotpToken(admin.mfaSecret, code);
      if (totpResult.valid) {
        if (
          admin.lastMfaStep !== undefined &&
          admin.lastMfaStep !== null &&
          totpResult.verifiedStep !== undefined &&
          totpResult.verifiedStep <= admin.lastMfaStep
        ) {
          return NextResponse.json(
            { success: false, error: "This verification code has already been used. Please wait for the next 30-second code." },
            { status: 401 }
          );
        }
        isVerified = true;
        if (totpResult.verifiedStep !== undefined) {
          await updateAdminLastMfaStep(admin.id, totpResult.verifiedStep);
        }
      }
    }

    // 2. Try Emergency Recovery Code (e.g. XXXX-XXXX)
    if (!isVerified && admin.mfaRecoveryCodes && admin.mfaRecoveryCodes.length > 0) {
      const recoveryIndex = verifyRecoveryCode(code, admin.mfaRecoveryCodes);
      if (recoveryIndex !== -1) {
        isVerified = true;
        usedRecoveryCode = true;
        await consumeRecoveryCode(admin.id, recoveryIndex);
      }
    }

    if (!isVerified) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code. Please check your authenticator app." },
        { status: 401 }
      );
    }

    // Issue fully authenticated session token
    const token = await signAdminSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      tokenVersion: admin.tokenVersion,
      mfaVerified: true,
    });

    await updateAdminLastLogin(admin.id);

    await logAudit({
      adminId: admin.id,
      adminEmail: admin.email,
      action: usedRecoveryCode ? "AUTH_MFA_RECOVERY_LOGIN" : "AUTH_MFA_LOGIN",
      resource: "admin_portal",
      ipAddress: ip,
      metadata: { usedRecoveryCode },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        mfaEnabled: true,
        remainingRecoveryCodes: usedRecoveryCode
          ? admin.mfaRecoveryCodes.length - 1
          : admin.mfaRecoveryCodes.length,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error("[MFA Verify Error]", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during MFA verification." },
      { status: 500 }
    );
  }
}
