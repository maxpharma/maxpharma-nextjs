import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("server env", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    // env.ts reads process.env at import time; without this, the second
    // `await import("../env")` in this file returns the first test's
    // cached module instead of re-evaluating against the new process.env.
    vi.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("falls back to documented defaults when env vars are unset", async () => {
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASS;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DIGITAL_BUCKET_NAME;
    const { default: env } = await import("../env");
    expect(env.DB_NAME).toBe("maxpharma");
    expect(env.DB_USER).toBe("root");
    expect(env.DB_HOST).toBe("127.0.0.1");
    expect(env.DB_PORT).toBe(3307);
    expect(env.DIGITAL_BUCKET_NAME).toBe("iservers");
  });

  it("reads real values when env vars are set", async () => {
    process.env.DB_NAME = "custom_db";
    process.env.DB_PORT = "3306";
    const { default: env } = await import("../env");
    expect(env.DB_NAME).toBe("custom_db");
    expect(env.DB_PORT).toBe(3306);
  });
});
