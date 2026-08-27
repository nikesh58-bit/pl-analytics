import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    enableReadyCheck: true,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export async function connectRedis() {
  if (redis.status === 'wait') {
    await redis.connect();
  }
}

export function cacheKey(...parts: (string | number)[]): string {
  return `pl-analytics:${parts.join(':')}`;
}

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCached<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}