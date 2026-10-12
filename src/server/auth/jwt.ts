import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "REVIEWER";

export interface AdminSessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  tokenVersion?: number;
  mfaVerified?: boolean;
}

export interface MfaChallengePayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  purpose: "mfa_challenge";
}

const JWT_ISSUER = "playqsolutions.com";
const JWT_AUDIENCE = "playq-admin-portal";
const SESSION_EXPIRATION = "8h";
const MFA_CHALLENGE_EXPIRATION = "5m";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET || process.env.ADMIN_JWT_SECRET;

  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error(
      "CRITICAL_AUTH_ERROR: AUTH_SECRET must be set to a secure string of at least 32 characters in production."
    );
  }

  // Deterministic fallback for local test/dev environments
  const fallback = secret || "dev_playq_solutions_fallback_auth_secret_key_32chars!";
  return new TextEncoder().encode(fallback);
}

/**
 * Sign an admin session token (8-hour expiry).
 */
export async function signAdminSession(
  payload: Omit<AdminSessionPayload, "iss" | "aud" | "exp" | "iat">
): Promise<string> {
  const secretKey = getSecretKey();

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(secretKey);
}

/**
 * Verify and decode an admin session token.
 */
export async function verifyAdminSession(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sign a short-lived intermediate MFA challenge token (5-minute expiry).
 * Cannot be used as an authenticated admin session token.
 */
export async function signMfaChallengeToken(
  payload: Omit<MfaChallengePayload, "iss" | "aud" | "exp" | "iat" | "purpose">
): Promise<string> {
  const secretKey = getSecretKey();

  return new SignJWT({ ...payload, purpose: "mfa_challenge" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience("playq-mfa-challenge")
    .setExpirationTime(MFA_CHALLENGE_EXPIRATION)
    .sign(secretKey);
}

/**
 * Verify and decode an intermediate MFA challenge token.
 */
export async function verifyMfaChallengeToken(
  token: string
): Promise<MfaChallengePayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: JWT_ISSUER,
      audience: "playq-mfa-challenge",
    });

    if (payload.purpose !== "mfa_challenge") {
      return null;
    }

    return payload as MfaChallengePayload;
  } catch {
    return null;
  }
}
