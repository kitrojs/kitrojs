import type { MiddlewareHandler, Context } from "hono"

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number
  resetAt: number
}

/**
 * Rate limit store (in-memory by default, can be replaced with Redis)
 */
interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined
  set(key: string, value: RateLimitEntry): void
  delete(key: string): void
  clear(): void
}

/**
 * Simple in-memory store
 */
class MemoryStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>()

  get(key: string): RateLimitEntry | undefined {
    return this.store.get(key)
  }

  set(key: string, value: RateLimitEntry): void {
    this.store.set(key, value)
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

/**
 * Rate limit options
 */
export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds (e.g., 60_000 for 1 minute)
  max: number // Maximum number of requests per window
  keyGenerator?: (c: Context) => string // Custom key generator (default: IP address)
  store?: RateLimitStore // Custom store (default: in-memory)
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions): MiddlewareHandler {
  const {
    windowMs,
    max,
    keyGenerator = (c) => {
      // Default: use IP address
      const forwarded = c.req.header("x-forwarded-for")
      const ip = forwarded ? forwarded.split(",")[0].trim() : c.req.header("cf-connecting-ip") || "unknown"
      return ip
    },
    store = new MemoryStore(),
    message = "Too many requests",
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options

  // Cleanup expired entries periodically (only for MemoryStore)
  let cleanupInterval: NodeJS.Timeout | null = null
  if (store instanceof MemoryStore) {
    cleanupInterval = setInterval(() => {
      const now = Date.now()
      const memoryStore = store as MemoryStore
      for (const [key, entry] of (memoryStore as any).store.entries()) {
        if (entry.resetAt < now) {
          store.delete(key)
        }
      }
    }, windowMs)
  }

  // Stop cleanup on process exit
  if (cleanupInterval && typeof process !== "undefined") {
    process.on("SIGTERM", () => clearInterval(cleanupInterval!))
    process.on("SIGINT", () => clearInterval(cleanupInterval!))
  }

  return async (c, next) => {
    const key = keyGenerator(c)
    const now = Date.now()
    const entry = store.get(key)

    // Check if entry exists and is still valid
    if (entry && entry.resetAt > now) {
      // Entry exists and is within window
      if (entry.count >= max) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        c.header("Retry-After", retryAfter.toString())
        c.header("X-RateLimit-Limit", max.toString())
        c.header("X-RateLimit-Remaining", "0")
        c.header("X-RateLimit-Reset", new Date(entry.resetAt).toISOString())
        return c.json({ error: message }, 429)
      }

      // Increment count
      entry.count++
      store.set(key, entry)
    } else {
      // Create new entry
      store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
    }

    // Set rate limit headers
    const currentEntry = store.get(key)
    if (currentEntry) {
      const remaining = Math.max(0, max - currentEntry.count)
      c.header("X-RateLimit-Limit", max.toString())
      c.header("X-RateLimit-Remaining", remaining.toString())
      c.header("X-RateLimit-Reset", new Date(currentEntry.resetAt).toISOString())
    }

    await next()

    // Optionally skip counting based on response status
    if (skipSuccessfulRequests && c.res.status >= 200 && c.res.status < 300) {
      const currentEntry = store.get(key)
      if (currentEntry && currentEntry.count > 0) {
        currentEntry.count--
        store.set(key, currentEntry)
      }
    }

    if (skipFailedRequests && c.res.status >= 400) {
      const currentEntry = store.get(key)
      if (currentEntry && currentEntry.count > 0) {
        currentEntry.count--
        store.set(key, currentEntry)
      }
    }
  }
}

