const store = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  max: number;
  windowMs: number;
  message?: string;
}

export function rateLimit(config: RateLimitConfig) {
  const { max, windowMs } = config;

  return {
    check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
      }

      entry.count++;
      if (entry.count > max) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
    },
  };
}

export function rateLimitMiddleware(config: RateLimitConfig, keyPrefix = "api") {
  const limiter = rateLimit(config);

  return async (request: Request): Promise<Response | null> => {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const url = new URL(request.url);
    const key = `${keyPrefix}:${ip}:${url.pathname}`;
    const result = limiter.check(key);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({ success: false, error: config.message ?? "طلبات كثيرة جداً. حاول مرة أخرى لاحقاً." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    return null;
  };
}
