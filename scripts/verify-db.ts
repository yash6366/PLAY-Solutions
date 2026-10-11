/**
 * Non-Destructive Database Verification Script — PLAYQ Solutions
 *
 * Verifies connectivity and schema table presence against PostgreSQL
 * WITHOUT altering, dropping, or modifying any existing data.
 *
 * Usage:
 *   npx tsx scripts/verify-db.ts
 */

import { PrismaClient } from "@prisma/client";

async function verifyDatabase() {
  const dbUrl = process.env.DATABASE_URL?.trim();

  console.log(`\n================================================================`);
  console.log(` PLAYQ Solutions — Non-Destructive Database Readiness Verification`);
  console.log(` Time: ${new Date().toISOString()}`);
  console.log(`================================================================\n`);

  if (!dbUrl || dbUrl === "" || dbUrl === "memory" || dbUrl.includes("<") || dbUrl.includes("placeholder")) {
    console.log("ℹ️  Database Status: UNCONFIGURED / MOCK MODE");
    console.log("   DATABASE_URL is not set to a live PostgreSQL endpoint.");
    console.log("   To verify against a live staging database, set DATABASE_URL and re-run.\n");
    console.log("----------------------------------------------------------------");
    console.log("Result: [OFFLINE] Live database verification cannot be performed without credentials.\n");
    return;
  }

  // Parse connection metadata safely WITHOUT printing user/password
  try {
    const urlObj = new URL(dbUrl);
    console.log(`Target Host:     ${urlObj.hostname}:${urlObj.port || "5432"}`);
    console.log(`Target Database: ${urlObj.pathname.replace(/^\//, "")}`);
    console.log(`SSL Mode:        ${urlObj.searchParams.get("sslmode") || "default"}\n`);
  } catch {
    console.log("Target Host:     [Unparseable URL format]\n");
  }

  const prisma = new PrismaClient({
    log: ["error"],
  });

  try {
    console.log("1. Testing network connectivity and PostgreSQL handshake...");
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;
    console.log(`   ✓ Connected successfully (Roundtrip latency: ${latency}ms).\n`);

    console.log("2. Inspecting required production tables...");
    const requiredTables = [
      "Inquiry",
      "InternshipOpportunity",
      "InternshipApplication",
      "MentorInquiry",
      "Project",
      "AdminUser",
      "AuditLog",
    ];

    const existingTables: Array<{ table_name: string }> = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    const tableNames = new Set(existingTables.map((t) => t.table_name));

    let allTablesPresent = true;
    for (const table of requiredTables) {
      if (tableNames.has(table)) {
        console.log(`   ✓ Table public."${table}" exists.`);
      } else {
        console.log(`   ✗ Table public."${table}" is MISSING.`);
        allTablesPresent = false;
      }
    }

    console.log("\n3. Verifying administrator provisioning state...");
    const adminCount = await prisma.adminUser.count();
    console.log(`   Total administrator accounts provisioned: ${adminCount}`);

    if (adminCount === 0) {
      console.log("   ⚠️  Notice: No administrator accounts exist yet.");
      console.log("      Run `npx tsx scripts/create-admin.ts` to provision initial SUPER_ADMIN.");
    }

    console.log("\n----------------------------------------------------------------");
    if (allTablesPresent) {
      console.log("✅ Result: DATABASE SCHEMA FULLY VERIFIED AND READY FOR STAGING.\n");
    } else {
      console.log("⚠️  Result: DATABASE CONNECTED BUT SCHEMA MIGRATIONS ARE MISSING.");
      console.log("   Run `npx prisma migrate deploy` to apply pending migrations.\n");
      process.exit(1);
    }
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.log("\n----------------------------------------------------------------");
    console.log("❌ Result: DATABASE CONNECTION FAILED");
    console.log(`   Error Code: ${error.code || "UNKNOWN"}`);
    console.log(`   Diagnostics: ${(error.message || "").split("\n")[0]}`);
    console.log("   Verify network firewall, host reachability, and PostgreSQL credentials.\n");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase().catch((err) => {
  console.error("Verification execution error:", err);
  process.exit(1);
});
