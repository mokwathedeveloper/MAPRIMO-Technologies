const cache = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(identifier: string, limit = 3, window = 60000) {
  const now = Date.now();
  const record = cache.get(identifier);

  if (!record || now > record.resetAt) {
    cache.set(identifier, { count: 1, resetAt: now + window });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
