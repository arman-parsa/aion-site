/**
 * In-memory sliding-window rate limiter, keyed by IP.
 *
 * Good enough for one server instance. On Vercel each function instance has
 * its own memory, so limits are per instance and reset on cold starts.
 * UPGRADE: for a hard limit across instances, swap this for Upstash Redis
 * (@upstash/ratelimit + @upstash/redis, Vercel Marketplace integration),
 * keeping the same `rateLimit(key)` signature.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  { now = Date.now(), max = MAX_REQUESTS, windowMs = WINDOW_MS } = {},
): { ok: boolean; remaining: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return { ok: false, remaining: 0 };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    // Keep memory bounded: drop the oldest key.
    const first = hits.keys().next().value;
    if (first !== undefined) hits.delete(first);
  }
  return { ok: true, remaining: max - recent.length };
}

export function resetRateLimit() {
  hits.clear();
}
