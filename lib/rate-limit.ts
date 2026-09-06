import { env } from "cloudflare:workers";

type Entry = { count: number; resetAt: number };
type RateLimitDatabase = { prepare(query: string): { bind(...values: unknown[]): { first(): Promise<unknown> } } };
const buckets = new Map<string, Entry>();

export function requestFingerprint(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  return forwarded.split(",")[0]!.trim();
}

function allowInMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function allowRequest(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const nextReset = now + windowMs;
  try {
    const database = (env as unknown as { DB?: RateLimitDatabase }).DB;
    if (!database) return allowInMemory(key, limit, windowMs);
    const row = await database.prepare(`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET
        count = CASE WHEN reset_at <= ? THEN 1 ELSE count + 1 END,
        reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END
      RETURNING count, reset_at
    `).bind(key, nextReset, now, now).first() as { count: number; reset_at: number } | null;
    const count = Number(row?.count || 1);
    const resetAt = Number(row?.reset_at || nextReset);
    return {
      allowed: count <= limit,
      retryAfter: count <= limit ? 0 : Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  } catch {
    return allowInMemory(key, limit, windowMs);
  }
}
