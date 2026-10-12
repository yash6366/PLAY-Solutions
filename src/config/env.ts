import { brandConfig } from "./brand";

/**
 * Server-side validated environment configuration.
 * Keeps production secrets securely isolated to the server runtime.
 */

export interface ServerEnvironmentConfig {
  database: {
    url: string | null;
    directUrl: string | null;
    isConfigured: boolean;
  };
  auth: {
    isConfigured: boolean;
    isSecureCookie: boolean;
  };
  rateLimit: {
    redisUrl: string | null;
    redisToken: string | null;
    isDistributed: boolean;
  };
  email: {
    apiKey: string | null;
    fromEmail: string;
    notificationRecipient: string;
    isConfigured: boolean;
  };
  site: {
    url: string;
  };
}

export function getServerEnvironmentConfig(): ServerEnvironmentConfig {
  const dbUrl = process.env.DATABASE_URL?.trim() || null;
  const isDbConfigured = Boolean(
    dbUrl &&
      dbUrl !== "" &&
      !dbUrl.includes("placeholder") &&
      dbUrl !== "memory" &&
      dbUrl !== "test"
  );

  const authSecret =
    process.env.AUTH_SECRET?.trim() ||
    process.env.SESSION_SECRET?.trim() ||
    process.env.ADMIN_JWT_SECRET?.trim() ||
    null;
  const isAuthConfigured = Boolean(
    authSecret && authSecret.length >= 32 && !authSecret.includes("placeholder")
  );

  const redisUrl = (process.env.UPSTASH_REDIS_REST_URL || process.env.RATE_LIMIT_REDIS_URL)?.trim() || null;
  const redisToken = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.RATE_LIMIT_REDIS_TOKEN)?.trim() || null;
  const isDistributedRateLimit = Boolean(
    redisUrl &&
      redisToken &&
      !redisUrl.includes("placeholder") &&
      !redisToken.includes("placeholder")
  );

  const emailApiKey =
    process.env.RESEND_API_KEY?.trim() ||
    process.env.EMAIL_PROVIDER_API_KEY?.trim() ||
    null;
  const isEmailConfigured = Boolean(
    emailApiKey && !emailApiKey.includes("placeholder")
  );

  return {
    database: {
      url: dbUrl,
      directUrl: process.env.DIRECT_URL?.trim() || null,
      isConfigured: isDbConfigured,
    },
    auth: {
      isConfigured: isAuthConfigured,
      isSecureCookie: process.env.ADMIN_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
    },
    rateLimit: {
      redisUrl,
      redisToken,
      isDistributed: isDistributedRateLimit,
    },
    email: {
      apiKey: emailApiKey,
      fromEmail:
        process.env.NOTIFICATION_FROM_EMAIL?.trim() ||
        process.env.CONTACT_FROM_EMAIL?.trim() ||
        (process.env.NODE_ENV === "production"
          ? "notifications@playqsolutions.com"
          : "onboarding@resend.dev"),
      notificationRecipient:
        process.env.CONTACT_NOTIFICATION_EMAIL?.trim() ||
        process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
        brandConfig.primaryEmail,
      isConfigured: isEmailConfigured,
    },
    site: {
      url:
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        brandConfig.websiteUrl ||
        "https://playqsolutions.com",
    },
  };
}
