import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/server/auth/session";
import { findAdminById } from "@/server/repositories/admin.repository";
import { generateTotpSecret, generateRecoveryCodes } from "@/server/auth/totp";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

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
    const rateLimit = await checkRateLimit(`mfa_setup_${session.userId}_${ip}`, { limit: 5, windowMs: 600000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many MFA setup requests. Please wait 10 minutes.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        { status: 429 }
      );
    }

    // Do not disclose or re-issue MFA secrets if MFA is already enabled
    const admin = await findAdminById(session.userId);
    if (admin?.mfaEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: "MFA is already enabled on this account. Re-enrollment requires an authorized reset.",
        },
        { status: 400 }
      );
    }

    const { secret, otpauthUrl } = generateTotpSecret();
    const { plaintextCodes, hashedCodes } = generateRecoveryCodes(8);

    return NextResponse.json({
      success: true,
      setup: {
        userId: session.userId,
        secret,
        otpauthUrl,
        recoveryCodes: plaintextCodes,
        hashedRecoveryCodes: hashedCodes,
      },
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
      { success: false, error: "Failed to initiate MFA setup" },
      { status: 500 }
    );
  }
}
