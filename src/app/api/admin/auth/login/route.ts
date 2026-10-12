import { NextResponse } from "next/server";
import { z } from "zod";
import {
  findAdminByEmail,
  updateAdminLastLogin,
  logAudit,
  DatabaseConnectionError,
  AdminUserRecord,
} from "@/server/repositories/admin.repository";
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
  const ip = getClientIp(req);

  try {
    // 1. CSRF Protection
    if (!verifyCsrfOrigin(req)) {
      console.warn("[AdminAuth Diagnostic] [CSRF_VALIDATION_FAILURE] Request origin rejected:", {
        origin: req.headers.get("origin") || undefined,
        host: req.headers.get("host") || undefined,
        forwardedHost: req.headers.get("x-forwarded-host") || undefined,
        ip,
      });
      return NextResponse.json(
        { success: false, error: "Cross-site request forgery detected. Request rejected." },
        { status: 403 }
      );
    }

    // 2. Strict rate limit on admin authentication attempts to prevent brute force (5 attempts / 5 mins)
    const rateLimit = await checkRateLimit(`admin_login_${ip}`, { limit: 5, windowMs: 300000 });

    if (!rateLimit.allowed) {
      console.warn(`[AdminAuth Diagnostic] [RATE_LIMIT_EXCEEDED] Rate limit exceeded for IP: ${ip}`);
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
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Database lookup with safe diagnostic separation
    let admin: AdminUserRecord | null = null;
    try {
      admin = await findAdminByEmail(normalizedEmail);
    } catch (dbErr: unknown) {
      if (dbErr instanceof DatabaseConnectionError) {
        console.error(
          `[AdminAuth Diagnostic] [DATABASE_CONNECTION_FAILURE] ${dbErr.message} (Code: ${dbErr.code})`
        );
        return NextResponse.json(
          {
            success: false,
            error: "Authentication service is temporarily unavailable. Please try again later.",
          },
          { status: 503 }
        );
      }
      throw dbErr;
    }

    // 4. Constant-time defense against user enumeration: run bcrypt comparison even if account is missing
    const targetHash = admin && admin.isActive ? admin.passwordHash : DUMMY_HASH;
    const passwordMatch = await verifyPassword(password, targetHash);

    if (!admin) {
      console.warn(`[AdminAuth Diagnostic] [ACCOUNT_NOT_FOUND] Login attempt for non-existent admin: ${normalizedEmail}`);
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      console.warn(`[AdminAuth Diagnostic] [ACCOUNT_DISABLED] Inactive administrator account attempted login: ${normalizedEmail}`);
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!passwordMatch) {
      console.warn(`[AdminAuth Diagnostic] [INVALID_CREDENTIALS] Password mismatch for administrator: ${normalizedEmail}`);
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 5. Multi-Factor Authentication Challenge
    if (admin.mfaEnabled) {
      try {
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
      } catch (authConfigErr: unknown) {
        if ((authConfigErr as Error)?.message?.includes("CRITICAL_AUTH_ERROR")) {
          console.error(
            "[AdminAuth Diagnostic] [INVALID_AUTH_CONFIG] Required secret 'AUTH_SECRET' is missing or insufficient (<32 chars) in production."
          );
          return NextResponse.json(
            { success: false, error: "An unexpected error occurred during login." },
            { status: 500 }
          );
        }
        throw authConfigErr;
      }
    }

    // 6. Direct login when MFA is not yet configured
    let token: string;
    try {
      token = await signAdminSession({
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        tokenVersion: admin.tokenVersion,
        mfaVerified: false,
      });
    } catch (authConfigErr: unknown) {
      if ((authConfigErr as Error)?.message?.includes("CRITICAL_AUTH_ERROR")) {
        console.error(
          "[AdminAuth Diagnostic] [INVALID_AUTH_CONFIG] Required secret 'AUTH_SECRET' is missing or insufficient (<32 chars) in production."
        );
        return NextResponse.json(
          { success: false, error: "An unexpected error occurred during login." },
          { status: 500 }
        );
      }
      throw authConfigErr;
    }

    await updateAdminLastLogin(admin.id);

    await logAudit({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_LOGIN",
      resource: "admin_portal",
      ipAddress: ip,
    });

    console.log(`[AdminAuth Diagnostic] [LOGIN_SUCCESS] Administrator authenticated: ${admin.email} (Role: ${admin.role})`);

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
  } catch (err: unknown) {
    console.error("[AdminAuth Diagnostic] [UNEXPECTED_EXCEPTION]", (err as Error)?.message || "Internal server error");
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
