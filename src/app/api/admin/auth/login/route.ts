import { NextResponse } from "next/server";
import { z } from "zod";
import { findAdminByEmail, updateAdminLastLogin, logAudit } from "@/server/repositories/admin.repository";
import { verifyPassword } from "@/server/auth/passwords";
import { signAdminSession, signMfaChallengeToken } from "@/server/auth/jwt";
import { ADMIN_COOKIE_NAME, COOKIE_MAX_AGE } from "@/server/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { verifyCsrfOrigin } from "@/server/auth/csrf";

const loginSchema = z.object({
  email: z.string().email("A valid email address is required"),
  password: z.string().min(1, "Password is required"),
});

// Precomputed bcrypt dummy hash for constant-time comparison against nonexistent accounts
const DUMMY_HASH = "$2a$12$e80yqV4j14o0xP0V8XJjheQ3h89/s.9E/wUfLdGzPauM7Lp1N51hG";

export async function POST(req: Request) {
  try {
    // CSRF Protection
    if (!verifyCsrfOrigin(req)) {
      return NextResponse.json(
        { success: false, error: "Cross-site request forgery detected. Request rejected." },
        { status: 403 }
      );
    }

    const ip = getClientIp(req);
    // Strict rate limit on admin authentication attempts to prevent brute force (5 attempts / 5 mins)
    const rateLimit = await checkRateLimit(`admin_login_${ip}`, { limit: 5, windowMs: 300000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Please wait 5 minutes before trying again.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        { status: 429, headers: { "Retry-After": rateLimit.resetSeconds.toString() } }
      );
    }

    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials format." },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const admin = await findAdminByEmail(email);

    // Constant-time defense against user enumeration: run bcrypt comparison even if account is missing
    const targetHash = admin && admin.isActive ? admin.passwordHash : DUMMY_HASH;
    const passwordMatch = await verifyPassword(password, targetHash);

    if (!admin || !admin.isActive || !passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Step 2: Multi-Factor Authentication Challenge
    if (admin.mfaEnabled) {
      const challengeToken = await signMfaChallengeToken({
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });

      return NextResponse.json({
        success: true,
        mfaRequired: true,
        challengeToken,
        message: "Password verified. Please provide TOTP code or emergency recovery code.",
      });
    }

    // Direct login when MFA is not yet configured for non-superadmin
    const token = await signAdminSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      tokenVersion: admin.tokenVersion,
      mfaVerified: false,
    });

    await updateAdminLastLogin(admin.id);

    await logAudit({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_LOGIN",
      resource: "admin_portal",
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        mfaEnabled: false,
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
    console.error("[Admin Login Error]", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
