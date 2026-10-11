import { cookies } from "next/headers";
import { verifyAdminSession, AdminSessionPayload, AdminRole } from "./jwt";
import { findAdminById } from "../repositories/admin.repository";
import { verifyCsrfOrigin } from "./csrf";

export const ADMIN_COOKIE_NAME = "playq_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds

export class AuthError extends Error {
  statusCode: number;
  code: "UNAUTHENTICATED" | "FORBIDDEN" | "ACCOUNT_DISABLED";

  constructor(code: "UNAUTHENTICATED" | "FORBIDDEN" | "ACCOUNT_DISABLED", message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.statusCode = code === "UNAUTHENTICATED" ? 401 : 403;
  }
}

/**
 * Retrieve and verify the active admin session from cookies or request headers.
 */
export async function getAdminSession(req?: Request): Promise<AdminSessionPayload | null> {
  try {
    let token: string | undefined;

    // 1. Check direct request headers (useful for APIs and test contexts)
    if (req) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
        if (match) token = match[1];
      }
      if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }
    }

    // 2. Fall back to Next.js cookies() store
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      } catch {
        // Outside of Next.js server cookie scope
      }
    }

    if (!token) return null;

    const payload = await verifyAdminSession(token);
    if (!payload) return null;

    // Check account status in repository
    const user = await findAdminById(payload.userId);
    if (!user || !user.isActive) {
      return null;
    }

    // Invalidate session if tokenVersion does not match current user record
    if (user.tokenVersion !== undefined && payload.tokenVersion !== undefined) {
      if (user.tokenVersion !== payload.tokenVersion) {
        return null;
      }
    }

    return payload;
  } catch {
    return null;
  }
}

export interface AuthOptions {
  allowUnverifiedMfa?: boolean;
}

/**
 * Server guard: enforces authentication, MFA verification, and optional role restrictions.
 * Throws AuthError if unauthenticated or unauthorized.
 */
export async function requireAdminAuth(
  allowedRoles?: AdminRole[],
  req?: Request,
  options?: AuthOptions
): Promise<AdminSessionPayload> {
  // CSRF protection for state-changing requests
  if (req && !verifyCsrfOrigin(req)) {
    throw new AuthError(
      "FORBIDDEN",
      "Cross-site request forgery detected. Request origin rejected."
    );
  }

  const session = await getAdminSession(req);

  if (!session) {
    throw new AuthError(
      "UNAUTHENTICATED",
      "Authentication required. Please log in to access the PLAYQ Solutions management portal."
    );
  }

  // MFA Enforcement:
  // 1. SUPER_ADMIN accounts are strictly required to have completed MFA verification
  // 2. Any account with mfaEnabled in database must have mfaVerified === true in their session
  if (!options?.allowUnverifiedMfa) {
    if (session.role === "SUPER_ADMIN" && !session.mfaVerified) {
      throw new AuthError(
        "FORBIDDEN",
        "MFA_REQUIRED: Multi-Factor Authentication enrollment is mandatory for SUPER_ADMIN before performing administrative operations."
      );
    }

    if (session.mfaVerified === false) {
      const user = await findAdminById(session.userId);
      if (user?.mfaEnabled) {
        throw new AuthError(
          "FORBIDDEN",
          "MFA_VERIFICATION_REQUIRED: Multi-Factor Authentication verification is required."
        );
      }
    }
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new AuthError(
      "FORBIDDEN",
      `Access denied. Role '${session.role}' is not authorized to perform this operation.`
    );
  }

  return session;
}

/**
 * Set HTTP-only secure session cookie.
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  } catch {
    // If running in contexts where cookies() is not mutable
  }
}

/**
 * Clear session cookie on logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {
    // If running in contexts where cookies() is not mutable
  }
}
