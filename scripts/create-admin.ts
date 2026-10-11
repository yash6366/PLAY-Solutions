import { hashPassword } from "../src/server/auth/passwords";
import { createAdminUser, findAdminByEmail, logAudit } from "../src/server/repositories/admin.repository";
import { AdminRole } from "../src/server/auth/jwt";

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.INITIAL_ADMIN_EMAIL;
  const name = args[1] || process.env.INITIAL_ADMIN_NAME || "System Administrator";
  const password = args[2] || process.env.INITIAL_ADMIN_PASSWORD;
  const role = (args[3] as AdminRole) || "SUPER_ADMIN";

  if (!email || !password) {
    console.error("Usage: node --experimental-strip-types scripts/create-admin.ts <email> <name> <password> [role]");
    console.error("Or set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in environment.");
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("Error: Password must be at least 10 characters long.");
    process.exit(1);
  }

  const existing = await findAdminByEmail(email);
  if (existing) {
    console.error(`Error: Administrator with email '${email}' already exists.`);
    process.exit(1);
  }

  console.log(`Hashing password and provisioning administrator account for: ${email}...`);
  const passwordHash = await hashPassword(password);

  const result = await createAdminUser({
    email,
    name,
    passwordHash,
    role,
  });

  if (!result.success || !result.user) {
    console.error(`Provisioning failed: ${result.error}`);
    process.exit(1);
  }

  await logAudit({
    adminId: result.user.id,
    adminEmail: result.user.email,
    action: "CLI_ADMIN_PROVISIONED",
    resource: "admin_user",
    targetId: result.user.id,
    metadata: { role: result.user.role },
  });

  console.log(`✓ Administrator created successfully!`);
  console.log(`  ID:    ${result.user.id}`);
  console.log(`  Email: ${result.user.email}`);
  console.log(`  Name:  ${result.user.name}`);
  console.log(`  Role:  ${result.user.role}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
