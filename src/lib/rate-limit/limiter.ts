/**
 * Rate limiting architecture supporting both local sliding-window in-memory tracking
 * and distributed Upstash Redis REST execution with automatic fail-safe fallback.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale in-memory records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  backend: "local-memory" | "upstash-redis";
}

/**
 * Returns current rate limiter configuration state and backend mode.
 */
export function getRateLimiterBackend(): {
  backend: "local-memory" | "upstash-redis";
  isDistributed: boolean;
  configured: boolean;
  url?: string;
  token?: string;
} {
  const url = (process.env.RATE_LIMIT_REDIS_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.RATE_LIMIT_REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  const isDistributed = Boolean(
    url &&
      token &&
      !url.includes("placeholder") &&
      !token.includes("placeholder")
  );

  return {
    backend: isDistributed ? "upstash-redis" : "local-memory",
    isDistributed,
    configured: isDistributed,
    url: isDistributed ? url : undefined,
    token: isDistributed ? token : undefined,
  };
}

/**
 * Local in-memory sliding-window token implementation.
 */
function checkLocalMemoryRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = memoryStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(identifier, record);
  }

  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldest = record.timestamps[0] || now;
    const resetSeconds = Math.max(
      1,
      Math.ceil((oldest + options.windowMs - now) / 1000)
    );
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetSeconds,
      backend: "local-memory",
    };
  }

  record.timestamps.push(now);
  const remaining = options.limit - record.timestamps.length;
  const resetSeconds = Math.ceil(options.windowMs / 1000);

  return {
    allowed: true,
    limit: options.limit,
    remaining,
    resetSeconds,
    backend: "local-memory",
  };
}

/**
 * Distributed Upstash Redis REST implementation with pipeline increment & expiry.
 */
async function checkUpstashRedisRateLimit(
  identifier: string,
  options: RateLimitOptions,
  url: string,
  token: string
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowSeconds = Math.ceil(options.windowMs / 1000);
  const currentBucket = Math.floor(now / options.windowMs);
  const bucketEnd = (currentBucket + 1) * options.windowMs;
  const resetSeconds = Math.max(1, Math.ceil((bucketEnd - now) / 1000));
  const redisKey = `ratelimit:${identifier}:${currentBucket}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

  try {
    const endpoint = url.replace(/\/$/, "");
    const res = await fetch(`${endpoint}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSeconds * 2],
      ]),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstash returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const currentCount = Number(data[0]?.result || 1);
    const allowed = currentCount <= options.limit;
    const remaining = Math.max(0, options.limit - currentCount);

    return {
      allowed,
      limit: options.limit,
      remaining,
      resetSeconds,
      backend: "upstash-redis",
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn(
      `[RateLimit Fallback] Upstash Redis unavailable (${
        (err as Error)?.message || "Network Error"
      }). Falling back to local in-memory limiter.`
    );
    return checkLocalMemoryRateLimit(identifier, options);
  }
}

/**
 * Main rate limit entry point.
 * Selects Upstash Redis if configured; otherwise uses local memory.
 * Gracefully falls back to local memory if Upstash is unreachable.
 */
let hasLoggedProductionNotice = false;

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60000 }
): Promise<RateLimitResult> {
  const backendInfo = getRateLimiterBackend();

  if (backendInfo.isDistributed && backendInfo.url && backendInfo.token) {
    return checkUpstashRedisRateLimit(identifier, options, backendInfo.url, backendInfo.token);
  }

  if (process.env.NODE_ENV === "production" && !hasLoggedProductionNotice) {
    hasLoggedProductionNotice = true;
    console.warn(
      "[RateLimit Notice] Operating on per-instance local memory limiter in production. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for distributed cluster enforcement."
    );
  }

  return checkLocalMemoryRateLimit(identifier, options);
}

/**
 * Extract caller IP from standard proxy headers
 */
export function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "127.0.0.1";
}

/**
 * Resets the in-memory rate limiting store (useful for automated testing)
 */
export function clearRateLimitStore(): void {
  memoryStore.clear();
}
