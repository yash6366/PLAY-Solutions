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

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL &&
    process.env.DATABASE_URL.trim() !== "" &&
    !process.env.DATABASE_URL.includes("placeholder") &&
    process.env.DATABASE_URL !== "memory" &&
    process.env.DATABASE_URL !== "test"
);

function createPrismaClient(): PrismaClient | null {
  if (!getIsDatabaseConfigured()) {
    return null;
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalThis.prismaGlobal ?? (createPrismaClient() as PrismaClient);

if (process.env.NODE_ENV !== "production" && prisma) {
  globalThis.prismaGlobal = prisma;
}

/**
 * Safely test whether the configured database is reachable without exposing connection details.
 */
export async function testDatabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
}> {
  if (!getIsDatabaseConfigured() || !prisma) {
    return {
      configured: false,
      connected: false,
      message:
        "Database is unconfigured. Set DATABASE_URL in environment to connect to PostgreSQL.",
    };
  }

  try {
    // Run lightweight query to check connectivity
    await prisma.$queryRaw`SELECT 1`;
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
