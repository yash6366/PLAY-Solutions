import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRateLimit,
  getRateLimiterBackend,
  clearRateLimitStore,
  getClientIp,
} from "@/lib/rate-limit/limiter";

describe("Rate Limiter Architecture", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    clearRateLimitStore();
  });

  describe("Backend Detection & Telemetry", () => {
    it("should report local-memory backend by default", () => {
      delete process.env.RATE_LIMIT_REDIS_URL;
      delete process.env.RATE_LIMIT_REDIS_TOKEN;
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const backend = getRateLimiterBackend();
      expect(backend.backend).toBe("local-memory");
      expect(backend.isDistributed).toBe(false);
      expect(backend.configured).toBe(false);
    });

    it("should report upstash-redis when canonical UPSTASH_REDIS credentials are set", () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://canonical-cluster.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "upstash_secret_token";

      const backend = getRateLimiterBackend();
      expect(backend.backend).toBe("upstash-redis");
      expect(backend.isDistributed).toBe(true);
      expect(backend.configured).toBe(true);
    });

    it("should report upstash-redis when RATE_LIMIT_REDIS legacy credentials are set", () => {
      process.env.RATE_LIMIT_REDIS_URL = "https://legacy-cluster.upstash.io";
      process.env.RATE_LIMIT_REDIS_TOKEN = "legacy_token";

      const backend = getRateLimiterBackend();
      expect(backend.backend).toBe("upstash-redis");
      expect(backend.isDistributed).toBe(true);
      expect(backend.configured).toBe(true);
    });
  });

  describe("In-Memory Sliding Window", () => {
    it("should permit requests within configured bounds", async () => {
      const testId = "test_ip_allow_" + Math.random().toString();
      const result = await checkRateLimit(testId, { limit: 3, windowMs: 1000 });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.backend).toBe("local-memory");
    });

    it("should throttle requests that exceed limit", async () => {
      const testId = "test_ip_throttle_" + Math.random().toString();
      const options = { limit: 2, windowMs: 5000 };

      const first = await checkRateLimit(testId, options);
      expect(first.allowed).toBe(true);

      const second = await checkRateLimit(testId, options);
      expect(second.allowed).toBe(true);

      const third = await checkRateLimit(testId, options);
      expect(third.allowed).toBe(false);
      expect(third.remaining).toBe(0);
      expect(third.resetSeconds).toBeGreaterThan(0);
    });
  });

  describe("Distributed Fail-Safe Fallback", () => {
    it("should gracefully fall back to local-memory limiter when Upstash Redis is unreachable", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://unreachable-redis-host.invalid";
      process.env.UPSTASH_REDIS_REST_TOKEN = "dummy_token";

      // Mock fetch to simulate network error or timeout
      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

      try {
        const testId = "test_failover_" + Math.random().toString();
        const result = await checkRateLimit(testId, { limit: 2, windowMs: 5000 });

        // Should NOT crash or silently disable; should fall back to local-memory limiter
        expect(result.allowed).toBe(true);
        expect(result.backend).toBe("local-memory");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("should fall back to local-memory when Upstash returns HTTP error response", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://error-redis-host.invalid";
      process.env.UPSTASH_REDIS_REST_TOKEN = "dummy_token";

      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Internal Server Error", { status: 500 }));

      try {
        const testId = "test_http_err_failover_" + Math.random().toString();
        const result = await checkRateLimit(testId, { limit: 2, windowMs: 5000 });

        expect(result.allowed).toBe(true);
        expect(result.backend).toBe("local-memory");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe("Client IP Resolution & Proxy Priority", () => {
    it("should prioritize CF-Connecting-IP over other headers", () => {
      const req = new Request("http://localhost:3000", {
        headers: {
          "cf-connecting-ip": "203.0.113.195",
          "x-real-ip": "198.51.100.1",
          "x-forwarded-for": "192.0.2.1, 192.0.2.2",
        },
      });

      expect(getClientIp(req)).toBe("203.0.113.195");
    });

    it("should prioritize X-Real-IP when CF-Connecting-IP is absent", () => {
      const req = new Request("http://localhost:3000", {
        headers: {
          "x-real-ip": "198.51.100.1",
          "x-forwarded-for": "192.0.2.1, 192.0.2.2",
        },
      });

      expect(getClientIp(req)).toBe("198.51.100.1");
    });

    it("should extract client IP from X-Forwarded-For chain when real IP headers are absent", () => {
      const req = new Request("http://localhost:3000", {
        headers: {
          "x-forwarded-for": "192.0.2.42, 10.0.0.1",
        },
      });

      expect(getClientIp(req)).toBe("192.0.2.42");
    });

    it("should fall back to 127.0.0.1 when no proxy headers exist", () => {
      const req = new Request("http://localhost:3000");
      expect(getClientIp(req)).toBe("127.0.0.1");
    });
  });
});
