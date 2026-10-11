/**
 * CSRF Protection Guard for state-changing HTTP operations (POST, PATCH, DELETE, PUT).
 * Verifies that request Origin and Referer match the application host.
 */
export function verifyCsrfOrigin(req: Request): boolean {
  const method = req.method.toUpperCase();
  // Safe HTTP read-only methods do not modify server state
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return true;
  }

  // Sec-Fetch-Site metadata from modern browsers
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite === "cross-site") {
    return false;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const host = rawHost?.split(",")[0].trim();
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim().toLowerCase();

  // If neither Origin nor Referer is present (e.g., non-browser CLI client, unit/integration test)
  if (!origin && !referer) {
    return true;
  }

  try {
    const sourceUrl = origin ? new URL(origin) : new URL(referer!);

    // Reject HTTP/HTTPS protocol mismatch (e.g., HTTP origin on HTTPS request)
    if (proto && sourceUrl.protocol !== `${proto}:`) {
      return false;
    }
    
    // Match against request Host header
    if (host && sourceUrl.host === host) {
      return true;
    }

    // Allow localhost/127.0.0.1 during local testing and development
    if (process.env.NODE_ENV !== "production" && (sourceUrl.hostname === "localhost" || sourceUrl.hostname === "127.0.0.1")) {
      return true;
    }

    // Match against production configured site URL or Vercel deployment URLs
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : undefined);
    if (siteUrl) {
      const allowedOrigin = new URL(siteUrl).origin;
      if (sourceUrl.origin === allowedOrigin) {
        return true;
      }
    }

    // Allow Vercel preview deployments if running in Vercel environment
    if (process.env.VERCEL === "1" && sourceUrl.hostname.endsWith(".vercel.app")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
