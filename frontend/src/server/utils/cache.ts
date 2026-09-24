/**
 * Ultra-lightweight in-memory TTL cache
 * Zero dependencies, minimal memory footprint.
 * Eliminates redundant database roundtrips for static/infrequently updated tables.
 */
class MemoryCache {
  private store = new Map<string, { data: any; expiry: number }>();

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.data as T;
  }

  set(key: string, data: any, ttlSeconds: number = 60): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }
}

const cache = new MemoryCache();

// Evict expired cache items every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of (cache as any).store.entries()) {
    if (now > item.expiry) {
      (cache as any).store.delete(key);
    }
  }
}, 120 * 1000).unref();

export default cache;
