/**
 * Safe Environment Validation Script — PLAYQ Solutions
 *
 * Verifies presence, format, and readiness of environment variables
 * WITHOUT exposing secrets, passwords, or token values.
 *
 * Usage:
 *   npx tsx scripts/validate-env.ts [--mode=staging|production|development]
 */

interface EnvCheck {
  name: string;
  category: "DATABASE" | "SECURITY" | "EMAIL" | "RATE_LIMIT" | "APP";
  requiredInProduction: boolean;
  requiredInStaging: boolean;
  requiredInDevelopment: boolean;
  status: "OK" | "MISSING" | "PLACEHOLDER" | "INSUFFICIENT" | "FORMAT_WARNING";
  note: string;
}

function checkVariable(
  name: string,
  value: string | undefined,
  options: {
    category: EnvCheck["category"];
    requiredInProduction: boolean;
    requiredInStaging: boolean;
    requiredInDevelopment?: boolean;
    validator?: (val: string) => { valid: boolean; note?: string };
  }
): EnvCheck {
  const reqDev = options.requiredInDevelopment ?? false;
  if (!value || value.trim() === "") {
    return {
      name,
      category: options.category,
      requiredInProduction: options.requiredInProduction,
      requiredInStaging: options.requiredInStaging,
      requiredInDevelopment: reqDev,
      status: "MISSING",
      note: "Variable is not set or empty",
    };
  }

  const trimmed = value.trim();

  // Check for obvious placeholders
  if (
    trimmed.includes("<") ||
    trimmed.includes(">") ||
    trimmed.toLowerCase().includes("placeholder") ||
    trimmed.toLowerCase().includes("your_")
  ) {
    return {
      name,
      category: options.category,
      requiredInProduction: options.requiredInProduction,
      requiredInStaging: options.requiredInStaging,
      requiredInDevelopment: reqDev,
      status: "PLACEHOLDER",
      note: "Contains unreplaced placeholder syntax",
    };
  }

  if (options.validator) {
    const result = options.validator(trimmed);
    if (!result.valid) {
      return {
        name,
        category: options.category,
        requiredInProduction: options.requiredInProduction,
        requiredInStaging: options.requiredInStaging,
        requiredInDevelopment: reqDev,
        status: "FORMAT_WARNING",
        note: result.note || "Value failed format validation",
      };
    }
  }

  return {
    name,
    category: options.category,
    requiredInProduction: options.requiredInProduction,
    requiredInStaging: options.requiredInStaging,
    requiredInDevelopment: reqDev,
    status: "OK",
    note: "Configured with valid format",
  };
}

export function validateEnvironment(targetMode: "development" | "staging" | "production") {
  const checks: EnvCheck[] = [];

  // 1. Database
  checks.push(
    checkVariable("DATABASE_URL", process.env.DATABASE_URL, {
      category: "DATABASE",
      requiredInProduction: true,
      requiredInStaging: true,
      validator: (val) => {
        if (targetMode !== "development" && val === "memory") {
          return { valid: false, note: "Memory mode is only permitted in development/test" };
        }
        if (!val.startsWith("postgresql://") && !val.startsWith("postgres://")) {
          return { valid: false, note: "Must start with postgresql:// or postgres://" };
        }
        return { valid: true };
      },
    })
  );

  checks.push(
    checkVariable("DIRECT_URL", process.env.DIRECT_URL, {
      category: "DATABASE",
      requiredInProduction: false,
      requiredInStaging: false,
      validator: (val) => ({
        valid: val.startsWith("postgresql://") || val.startsWith("postgres://"),
        note: "Must start with postgresql:// or postgres://",
      }),
    })
  );

  // 2. Security & Auth
  const authSecretVal =
    process.env.AUTH_SECRET || process.env.SESSION_SECRET || process.env.ADMIN_JWT_SECRET;
  checks.push(
    checkVariable("AUTH_SECRET", authSecretVal, {
      category: "SECURITY",
      requiredInProduction: true,
      requiredInStaging: true,
      validator: (val) => {
        if (val.length < 32) {
          return { valid: false, note: `Length is ${val.length} chars (minimum 32 required)` };
        }
        return { valid: true };
      },
    })
  );

  // 3. Application URL
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  checks.push(
    checkVariable("NEXT_PUBLIC_SITE_URL", siteUrl, {
      category: "APP",
      requiredInProduction: true,
      requiredInStaging: true,
      validator: (val) => {
        try {
          new URL(val);
          return { valid: true };
        } catch {
          return { valid: false, note: "Must be a valid URL (e.g. https://playqsolutions.com)" };
        }
      },
    })
  );

  // 4. Rate Limiting
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.RATE_LIMIT_REDIS_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.RATE_LIMIT_REDIS_TOKEN;

  checks.push(
    checkVariable("UPSTASH_REDIS_REST_URL", redisUrl, {
      category: "RATE_LIMIT",
      requiredInProduction: false, // Fallback to memory is functional but recommended in prod
      requiredInStaging: false,
      validator: (val) => ({
        valid: val.startsWith("https://"),
        note: "Must be a valid HTTPS URL (Upstash REST endpoint)",
      }),
    })
  );

  checks.push(
    checkVariable("UPSTASH_REDIS_REST_TOKEN", redisToken, {
      category: "RATE_LIMIT",
      requiredInProduction: false,
      requiredInStaging: false,
    })
  );

  // 5. Transactional Email
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
  checks.push(
    checkVariable("RESEND_API_KEY", resendApiKey, {
      category: "EMAIL",
      requiredInProduction: false, // App falls back safely, but emails won't send
      requiredInStaging: false,
      validator: (val) => ({
        valid: val.startsWith("re_"),
        note: "Resend API keys typically start with 're_'",
      }),
    })
  );

  checks.push(
    checkVariable("NOTIFICATION_FROM_EMAIL", process.env.NOTIFICATION_FROM_EMAIL, {
      category: "EMAIL",
      requiredInProduction: false,
      requiredInStaging: false,
      validator: (val) => ({
        valid: val.includes("@"),
        note: "Must be a valid email address",
      }),
    })
  );

  checks.push(
    checkVariable("CONTACT_NOTIFICATION_EMAIL", process.env.CONTACT_NOTIFICATION_EMAIL, {
      category: "EMAIL",
      requiredInProduction: false,
      requiredInStaging: false,
      validator: (val) => ({
        valid: val.includes("@"),
        note: "Must be a valid email address",
      }),
    })
  );

  return checks;
}

function main() {
  const args = process.argv.slice(2);
  const modeArg = args.find((a) => a.startsWith("--mode="))?.split("=")[1];
  const targetMode =
    (modeArg as "development" | "staging" | "production") ||
    (process.env.NODE_ENV === "production" ? "production" : "staging");

  console.log(`\n================================================================`);
  console.log(` PLAYQ Solutions — Safe Environment Configuration Audit`);
  console.log(` Target Mode: [${targetMode.toUpperCase()}]`);
  console.log(` Time: ${new Date().toISOString()}`);
  console.log(`================================================================\n`);

  const results = validateEnvironment(targetMode);

  let hasCriticalError = false;

  console.log(
    `${"Variable".padEnd(28)} | ${"Category".padEnd(11)} | ${"Status".padEnd(14)} | Diagnostic Note`
  );
  console.log("-".repeat(85));

  for (const item of results) {
    const isRequired =
      targetMode === "production"
        ? item.requiredInProduction
        : targetMode === "staging"
        ? item.requiredInStaging
        : item.requiredInDevelopment;
    let isBlocker = false;

    if (isRequired && item.status !== "OK") {
      isBlocker = true;
      hasCriticalError = true;
    }

    const colorIndicator = item.status === "OK" ? "✓ OK" : isBlocker ? "✗ BLOCKER" : "! OPTIONAL";

    console.log(
      `${item.name.padEnd(28)} | ${item.category.padEnd(11)} | ${colorIndicator.padEnd(14)} | ${item.note}`
    );
  }

  console.log("\n----------------------------------------------------------------");
  if (hasCriticalError) {
    console.log(`❌ Result: MISSING REQUIRED CONFIGURATION FOR ${targetMode.toUpperCase()}`);
    console.log(`Please supply the missing required variables before deploying.\n`);
    process.exit(1);
  } else {
    console.log(`✅ Result: ALL REQUIRED VARIABLES PRESENT FOR ${targetMode.toUpperCase()}`);
    console.log(`Note: Optional integrations (Upstash Redis, Resend) will operate in fallback/mock mode if unconfigured.\n`);
    process.exit(0);
  }
}

if (process.argv[1]?.includes("validate-env")) {
  main();
}
