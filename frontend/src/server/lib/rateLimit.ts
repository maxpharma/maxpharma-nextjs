// Ported from backend/src/config/server.ts's hand-rolled sliding-window
// limiter. ponytail: per-instance Map, not shared across Vercel Function
// instances — each warm instance enforces its own 500req/60s window, so
// the effective limit is higher under multi-instance scaling. Upgrade
// path: Upstash Redis (@upstash/ratelimit) via Vercel Marketplace if a
// precise cross-instance limit is ever required.
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const windowMs = 60 * 1000;
const maxRequests = 500;

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requestCounts.entries()) {
      if (now - record.timestamp > windowMs) {
        requestCounts.delete(key);
      }
    }
  }, 60 * 1000).unref?.();
}

const checkRateLimit = (key: string): boolean => {
  const currentTime = Date.now();
  const record = requestCounts.get(key);
  if (!record) {
    requestCounts.set(key, { count: 1, timestamp: currentTime });
    return true;
  }
  const timeElapsed = currentTime - record.timestamp;
  if (timeElapsed > windowMs) {
    requestCounts.set(key, { count: 1, timestamp: currentTime });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
};

export { checkRateLimit };
