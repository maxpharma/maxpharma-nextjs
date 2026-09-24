import { describe, it, expect, vi, beforeEach } from "vitest";
import cache from "../cache";

describe("MemoryCache", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("returns null for a missing key", () => {
    expect(cache.get("missing")).toBeNull();
  });

  it("stores and retrieves a value before TTL expiry", () => {
    cache.set("k", { a: 1 }, 60);
    expect(cache.get("k")).toEqual({ a: 1 });
  });

  it("expires a value after its TTL", () => {
    vi.useFakeTimers();
    cache.set("k", "v", 1);
    vi.advanceTimersByTime(1001);
    expect(cache.get("k")).toBeNull();
    vi.useRealTimers();
  });

  it("invalidatePrefix clears only matching keys", () => {
    cache.set("settings:a", 1, 60);
    cache.set("settings:b", 2, 60);
    cache.set("other:c", 3, 60);
    cache.invalidatePrefix("settings:");
    expect(cache.get("settings:a")).toBeNull();
    expect(cache.get("settings:b")).toBeNull();
    expect(cache.get("other:c")).toBe(3);
  });
});
