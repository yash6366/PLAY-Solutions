import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/database/prisma";
import { getRateLimiterBackend } from "@/lib/rate-limit/limiter";
import { brandConfig } from "@/config/brand";

export async function GET(
  req: Request = new Request("http://localhost:3000/api/health")
) {
  const dbHealth = await testDatabaseConnection();
  const rateLimitStatus = getRateLimiterBackend();
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      process.env.EMAIL_PROVIDER_API_KEY?.trim()
  );

  const url = new URL(req.url);
  const probe = url.searchParams.get("probe");

  const isProduction = process.env.NODE_ENV === "production";
  const isDatabaseReady = dbHealth.connected;
  // In production, application is only fully healthy if the persistent database is connected
  const isHealthy = isProduction ? dbHealth.connected : (dbHealth.connected || !dbHealth.configured);

  // If explicit readiness probe requested and database is down (or in production not connected), return 503
  if (
    probe === "readiness" &&
    ((isProduction && !dbHealth.connected) || (dbHealth.configured && !dbHealth.connected))
  ) {
    return NextResponse.json(
      {
        liveness: "ok",
        readiness: "unready",
        status: "degraded",
        database: {
          configured: dbHealth.configured,
          connected: false,
          driver: "PostgreSQL (Prisma)",
          message: dbHealth.message,
        },
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: isHealthy ? "healthy" : "degraded",
    liveness: "ok",
    readiness: isDatabaseReady
      ? "ready"
      : dbHealth.configured
      ? "database_unreachable"
      : "database_unconfigured",
    timestamp: new Date().toISOString(),
    service: brandConfig.companyName,
    database: {
      configured: dbHealth.configured,
      connected: dbHealth.connected,
      driver: "PostgreSQL (Prisma)",
      message: dbHealth.message,
    },
    rateLimiting: {
      backend: rateLimitStatus.backend,
      isDistributed: rateLimitStatus.isDistributed,
    },
    notifications: {
      configured: emailConfigured,
      channel: "Transactional Email (Resend REST)",
    },
    version: "1.0.0",
  });
}

