import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("server env", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("falls back to documented defaults when env vars are unset", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.DIGITAL_BUCKET_NAME;
    const { default: env } = await import("../env");
    expect(env.DATABASE_URL).toBe(
      "postgres://postgres:postgres@127.0.0.1:5432/maxpharma",
    );
    expect(env.DIGITAL_BUCKET_NAME).toBe("iservers");
  });

  it("reads real values when env vars are set", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@example.com:5432/db";
    const { default: env } = await import("../env");
    expect(env.DATABASE_URL).toBe(
      "postgres://user:pass@example.com:5432/db",
    );
  });
});
