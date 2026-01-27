// Utility for JSON parsing with proper type handling
export function parseJSON<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Safe image array parsing
export function parseImages(images: unknown): string[] {
  if (typeof images === 'string') {
    return parseJSON(images, []);
  }
  if (Array.isArray(images)) {
    return images.filter((img) => typeof img === 'string');
  }
  return [];
}

// Safe JSON field parsing for Prisma
export function parseJSONField(field: unknown): unknown {
  if (typeof field === 'string') {
    return parseJSON(field, null);
  }
  return field;
}

// Debounce utility for search
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Rate limiting helper using simple in-memory store
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { allowed: true, remaining: limit - 1, resetTime: rateLimitStore[key].resetTime };
  }

  rateLimitStore[key].count++;
  const allowed = rateLimitStore[key].count <= limit;
  const remaining = Math.max(0, limit - rateLimitStore[key].count);

  return {
    allowed,
    remaining,
    resetTime: rateLimitStore[key].resetTime,
  };
}

// Cleanup old rate limit entries periodically
export function cleanupRateLimitStore() {
  const now = Date.now();
  Object.entries(rateLimitStore).forEach(([key, value]) => {
    if (value.resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

// Run cleanup every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
