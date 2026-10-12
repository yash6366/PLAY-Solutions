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
  // Determine authoritative host. Always prefer direct 'host' header to prevent forwarded-host injection
  const directHost = req.headers.get("host")?.split(",")[0].trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const host = directHost || forwardedHost;

  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim().toLowerCase();
  const hasSessionCookie = Boolean(
    req.headers.get("cookie")?.includes("playq_admin_session")
  );

  // If a browser session cookie is attached to a state-changing mutation, Origin or Referer MUST be present
  if (hasSessionCookie && !origin && !referer) {
    if (process.env.NODE_ENV !== "production" && (!host || host.startsWith("localhost") || host.startsWith("127.0.0.1"))) {
      return true;
    }
    return false;
  }

  // If neither Origin nor Referer is present (e.g., non-browser CLI client, unit/integration test)
  if (!origin && !referer) {
    return true;
  }

  try {
    const sourceUrl = origin ? new URL(origin) : new URL(referer!);

    // In production, reject insecure plain HTTP origins
    if (process.env.NODE_ENV === "production" && sourceUrl.protocol !== "https:") {
      return false;
    }

    // Reject HTTP/HTTPS protocol mismatch (e.g., HTTP origin on HTTPS request)
    if (proto && sourceUrl.protocol !== `${proto}:`) {
      return false;
    }

    // If an x-forwarded-host header was injected and differs from direct host, reject if sourceUrl does not match direct host
    if (directHost && forwardedHost && directHost !== forwardedHost && sourceUrl.host !== directHost) {
      return false;
    }
    
    // Match against request Host header
    if (host && sourceUrl.host === host) {
      // In production, localhost is never a valid host
      if (process.env.NODE_ENV === "production" && (sourceUrl.hostname === "localhost" || sourceUrl.hostname === "127.0.0.1")) {
        return false;
      }
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
      const isAllowedLocalhost = new URL(siteUrl).hostname === "localhost" || new URL(siteUrl).hostname === "127.0.0.1";
      if (!(process.env.NODE_ENV === "production" && isAllowedLocalhost) && sourceUrl.origin === allowedOrigin) {
        return true;
      }
    }

    // Validate Vercel preview deployments strictly against verified deployment domains (preview only)
    if (process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview") {
      const currentDeploymentHost = process.env.VERCEL_URL;
      const branchDeploymentHost = process.env.VERCEL_BRANCH_URL;
      if (
        (currentDeploymentHost && sourceUrl.host === currentDeploymentHost) ||
        (branchDeploymentHost && sourceUrl.host === branchDeploymentHost)
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}
