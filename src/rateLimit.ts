import type { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

const hits = new Map<string, { count: number; resetAt: number }>();

// Fixed-window rate limiter keyed by client IP. Allows up to
// MAX_REQUESTS per WINDOW_MS; over the limit responds 429 with a
// Retry-After header indicating seconds until the window resets.
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'rate limit exceeded' });
  }

  entry.count += 1;
  next();
}
