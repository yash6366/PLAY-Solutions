import { findAdminByEmail, resetAdminMfa, logAudit } from "../src/server/repositories/admin.repository";

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.error("Usage: node --experimental-strip-types scripts/reset-admin-mfa.ts <email>");
    process.exit(1);
  }

  const admin = await findAdminByEmail(email);
  if (!admin) {
    console.error(`Error: Administrator with email '${email}' was not found.`);
    process.exit(1);
  }

  console.log(`Resetting MFA and revoking all active sessions for administrator: ${email}...`);
  const result = await resetAdminMfa(admin.id);

  if (!result.success) {
    console.error(`Failed to reset MFA: ${result.error}`);
    process.exit(1);
  }

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "CLI_ADMIN_MFA_RESET",
    resource: "admin_user",
    targetId: admin.id,
    metadata: { operator: "CLI" },
  });

  console.log(`✓ MFA successfully reset for ${email}!`);
  console.log(`  All active sessions have been revoked.`);
  console.log(`  The administrator must log in with their password and re-enroll MFA.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
