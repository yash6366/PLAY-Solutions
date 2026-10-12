import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Determines dynamically whether DATABASE_URL is configured with a plausible connection string
 * (not a placeholder or test token).
 */
export function getIsDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.DATABASE_URL.trim() !== "" &&
      !process.env.DATABASE_URL.includes("placeholder") &&
      process.env.DATABASE_URL !== "memory" &&
      process.env.DATABASE_URL !== "test"
  );
}

export function getPrismaClient(): PrismaClient | null {
  if (!getIsDatabaseConfigured()) {
    return null;
  }
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalThis.prismaGlobal;
}

export const prisma = globalThis.prismaGlobal ?? getPrismaClient();

export const isDatabaseConfigured = getIsDatabaseConfigured();

/**
 * Safely test whether the configured database is reachable without exposing connection details.
 */
export async function testDatabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
}> {
  if (!getIsDatabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      message:
        "Database is unconfigured. Set DATABASE_URL in environment to connect to PostgreSQL.",
    };
  }

  const client = getPrismaClient();
  if (!client) {
    return {
      configured: false,
      connected: false,
      message:
        "Database client could not be initialized. Verify DATABASE_URL format.",
    };
  }

  try {
    // Run lightweight query to check connectivity
    await client.$queryRaw`SELECT 1`;
    return {
      configured: true,
      connected: true,
      message: "PostgreSQL database connection verified and operational.",
    };
  } catch (err: unknown) {
    const errorCode = (err as { code?: string })?.code || "UNREACHABLE";
    return {
      configured: true,
      connected: false,
      message: `Database server is unreachable (${errorCode}). Verify network access and credentials.`,
    };
  }
}
