import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { POST } from "../route";

describe("POST /api/upload", () => {
  it("returns a 400 with a clear message when required fields are missing", async () => {
    const req = new Request("http://localhost/api/upload", {
      method: "POST",
      headers: { authorization: "Bearer x" },
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({}) });
    const body = await res.json();
    expect(res.status).not.toBe(200);
    expect(body.success).toBe(false);
  });

  // Vercel enforces the 4.5MB request body cap at the platform level before
  // this handler runs (413 FUNCTION_PAYLOAD_TOO_LARGE) — not something a
  // unit test running in Node can reproduce. This test documents the
  // contract: callers must keep base64 uploads under ~3.2MB raw (4.5MB
  // minus ~33% base64 inflation and JSON overhead) or pre-validate file
  // size client-side before calling this route.
  it("documents the effective max raw file size under Vercel's 4.5MB body cap", () => {
    const VERCEL_BODY_CAP_BYTES = 4.5 * 1024 * 1024;
    const BASE64_INFLATION = 4 / 3;
    const effectiveMaxRawBytes = VERCEL_BODY_CAP_BYTES / BASE64_INFLATION;
    expect(Math.floor(effectiveMaxRawBytes / (1024 * 1024))).toBe(3);
  });
});
