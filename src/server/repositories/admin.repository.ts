import { getIsDatabaseConfigured, isDatabaseConfigured, prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import { AdminRole } from "../auth/jwt";

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string | null;
  mfaRecoveryCodes: string[];
  tokenVersion: number;
  lastMfaStep?: number | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: Date;
}

export const inMemoryAdmins: AdminUserRecord[] = [];
export const inMemoryAuditLogs: AuditLogRecord[] = [];

export const isMemoryMode = () =>
  process.env.NODE_ENV !== "production" && process.env.DATABASE_URL === "memory";

/**
 * Find an admin user by email address.
 */
export async function findAdminByEmail(
  email: string
): Promise<AdminUserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isMemoryMode()) {
    return inMemoryAdmins.find((u) => u.email === normalizedEmail) || null;
  }

  if (!getIsDatabaseConfigured() || !prisma) {
    return null;
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role as AdminRole,
      isActive: user.isActive,
      mfaEnabled: user.mfaEnabled,
      mfaSecret: user.mfaSecret,
      mfaRecoveryCodes: user.mfaRecoveryCodes,
      tokenVersion: user.tokenVersion,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (err) {
    console.error("[AdminRepository Error] findAdminByEmail failed:", (err as Error)?.name);
    return null;
  }
}

/**
 * Find an admin user by ID.
 */
export async function findAdminById(
  id: string
): Promise<AdminUserRecord | null> {
  if (isMemoryMode()) {
    return inMemoryAdmins.find((u) => u.id === id) || null;
  }

  if (!isDatabaseConfigured || !prisma) {
    return null;
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role as AdminRole,
      isActive: user.isActive,
      mfaEnabled: user.mfaEnabled,
      mfaSecret: user.mfaSecret,
      mfaRecoveryCodes: user.mfaRecoveryCodes,
      tokenVersion: user.tokenVersion,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (err) {
    console.error("[AdminRepository Error] findAdminById failed:", (err as Error)?.name);
    return null;
  }
}

/**
 * Create a new admin user record.
 */
export async function createAdminUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role?: AdminRole;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaRecoveryCodes?: string[];
}): Promise<{ success: boolean; user?: AdminUserRecord; error?: string }> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const role = data.role || "ADMIN";

  if (isMemoryMode()) {
    const existing = inMemoryAdmins.find((u) => u.email === normalizedEmail);
    if (existing) {
      return { success: false, error: "An administrator with this email already exists." };
    }

    const record: AdminUserRecord = {
      id: "admin_" + Math.random().toString(36).substring(2, 10),
      email: normalizedEmail,
      name: data.name,
      passwordHash: data.passwordHash,
      role,
      isActive: true,
      mfaEnabled: data.mfaEnabled ?? false,
      mfaSecret: data.mfaSecret ?? null,
      mfaRecoveryCodes: data.mfaRecoveryCodes ?? [],
      tokenVersion: 1,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryAdmins.push(record);
    return { success: true, user: record };
  }

  if (!isDatabaseConfigured || !prisma) {
    return {
      success: false,
      error: "DATABASE_NOT_CONFIGURED: Connect PostgreSQL via DATABASE_URL to create admin users.",
    };
  }

  try {
    const created = await prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        name: data.name,
        passwordHash: data.passwordHash,
        role: role as AdminRole,
        mfaEnabled: data.mfaEnabled ?? false,
        mfaSecret: data.mfaSecret ?? null,
        mfaRecoveryCodes: data.mfaRecoveryCodes ?? [],
        tokenVersion: 1,
      },
    });

    return {
      success: true,
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
        passwordHash: created.passwordHash,
        role: created.role as AdminRole,
        isActive: created.isActive,
        mfaEnabled: created.mfaEnabled,
        mfaSecret: created.mfaSecret,
        mfaRecoveryCodes: created.mfaRecoveryCodes,
        tokenVersion: created.tokenVersion,
        lastLoginAt: created.lastLoginAt,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      return { success: false, error: "An administrator with this email already exists." };
    }
    console.error("[AdminRepository Error] createAdminUser failed:", code || "UNKNOWN");
    return { success: false, error: "Failed to persist administrator." };
  }
}

/**
 * Update MFA configuration for an admin user.
 */
export async function updateAdminMfa(
  id: string,
  data: {
    mfaEnabled: boolean;
    mfaSecret?: string | null;
    mfaRecoveryCodes?: string[];
    lastMfaStep?: number | null;
  }
): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (!user) return { success: false, error: "User not found" };
    user.mfaEnabled = data.mfaEnabled;
    if (data.mfaSecret !== undefined) user.mfaSecret = data.mfaSecret;
    if (data.mfaRecoveryCodes !== undefined) user.mfaRecoveryCodes = data.mfaRecoveryCodes;
    if (data.lastMfaStep !== undefined) user.lastMfaStep = data.lastMfaStep;
    user.updatedAt = new Date();
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: {
        mfaEnabled: data.mfaEnabled,
        ...(data.mfaSecret !== undefined ? { mfaSecret: data.mfaSecret } : {}),
        ...(data.mfaRecoveryCodes !== undefined ? { mfaRecoveryCodes: data.mfaRecoveryCodes } : {}),
        ...(data.lastMfaStep !== undefined ? { lastMfaStep: data.lastMfaStep } : {}),
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[AdminRepository Error] updateAdminMfa failed:", (err as Error)?.name);
    return { success: false, error: "Failed to update MFA settings" };
  }
}

/**
 * Update the last verified TOTP time step to prevent replay attacks.
 */
export async function updateAdminLastMfaStep(id: string, step: number): Promise<void> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (user) {
      user.lastMfaStep = step;
      user.updatedAt = new Date();
    }
    return;
  }

  if (!isDatabaseConfigured || !prisma) return;

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { lastMfaStep: step },
    });
  } catch (err) {
    console.warn("[AdminRepository Warning] Failed to update lastMfaStep:", (err as Error)?.name);
  }
}

/**
 * Reset MFA for an admin account and revoke all existing active sessions.
 */
export async function resetAdminMfa(id: string): Promise<{ success: boolean; error?: string }> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (!user) return { success: false, error: "User not found" };
    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.mfaRecoveryCodes = [];
    user.lastMfaStep = null;
    user.tokenVersion = (user.tokenVersion || 1) + 1;
    user.updatedAt = new Date();
    return { success: true };
  }

  if (!isDatabaseConfigured || !prisma) {
    return { success: false, error: "Database not configured" };
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaRecoveryCodes: [],
        lastMfaStep: null,
        tokenVersion: { increment: 1 },
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[AdminRepository Error] resetAdminMfa failed:", (err as Error)?.name);
    return { success: false, error: "Failed to reset MFA" };
  }
}

/**
 * Invalidate all active sessions for an admin by incrementing tokenVersion.
 */
export async function revokeAdminSessions(id: string): Promise<void> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (user) {
      user.tokenVersion = (user.tokenVersion || 1) + 1;
      user.updatedAt = new Date();
    }
    return;
  }

  if (!isDatabaseConfigured || !prisma) return;

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  } catch (err) {
    console.warn("[AdminRepository Warning] Failed to increment tokenVersion:", (err as Error)?.name);
  }
}

/**
 * Consume a one-time emergency recovery code by index.
 */
export async function consumeRecoveryCode(id: string, codeIndex: number): Promise<boolean> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (!user || codeIndex < 0 || codeIndex >= user.mfaRecoveryCodes.length) return false;
    user.mfaRecoveryCodes.splice(codeIndex, 1);
    user.updatedAt = new Date();
    return true;
  }

  if (!isDatabaseConfigured || !prisma) return false;

  try {
    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user || codeIndex < 0 || codeIndex >= user.mfaRecoveryCodes.length) return false;
    const updatedCodes = [...user.mfaRecoveryCodes];
    updatedCodes.splice(codeIndex, 1);
    await prisma.adminUser.update({
      where: { id },
      data: { mfaRecoveryCodes: updatedCodes },
    });
    return true;
  } catch (err) {
    console.error("[AdminRepository Error] consumeRecoveryCode failed:", (err as Error)?.name);
    return false;
  }
}

/**
 * Record successful admin login timestamp.
 */
export async function updateAdminLastLogin(id: string): Promise<void> {
  if (isMemoryMode()) {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (user) user.lastLoginAt = new Date();
    return;
  }

  if (!isDatabaseConfigured || !prisma) return;

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  } catch (err) {
    console.warn("[AdminRepository Warning] Failed to update last login timestamp:", (err as Error)?.name);
  }
}

/**
 * Append audit log entry for sensitive administrative operations.
 */
export async function logAudit(data: {
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
}): Promise<void> {
  const entry: AuditLogRecord = {
    id: "audit_" + Math.random().toString(36).substring(2, 10),
    adminId: data.adminId,
    adminEmail: data.adminEmail,
    action: data.action,
    resource: data.resource,
    targetId: data.targetId || null,
    metadata: data.metadata || null,
    ipAddress: data.ipAddress || null,
    createdAt: new Date(),
  };

  if (isMemoryMode()) {
    inMemoryAuditLogs.push(entry);
    return;
  }

  if (!isDatabaseConfigured || !prisma) return;

  try {
    await prisma.auditLog.create({
      data: {
        adminId: data.adminId,
        adminEmail: data.adminEmail,
        action: data.action,
        resource: data.resource,
        targetId: data.targetId,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
        ipAddress: data.ipAddress,
      },
    });
  } catch (err) {
    console.warn("[AdminRepository Warning] Failed to save audit log:", (err as Error)?.name);
  }
}
