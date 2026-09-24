import { describe, it, expect, vi } from "vitest";

// ponytail: vi.mock factories are hoisted above imports, so a plain
// top-level const referenced inside one throws "Cannot access before
// initialization" — vi.hoisted() is vitest's documented escape hatch.
const { mockUpdate } = vi.hoisted(() => ({
  mockUpdate: vi.fn().mockRejectedValue(
    new Error("only one data should be active"),
  ),
}));

vi.mock("../../../../server/modules/popup/service", () => ({
  default: { update: mockUpdate },
}));

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { PATCH } from "../[id]/route";

describe("PATCH /api/popup/:id — status exclusivity", () => {
  it("propagates the 'only one data should be active' business rule as a 500 envelope", async () => {
    const req = new Request("http://localhost/api/popup/2", {
      method: "PATCH",
      headers: { authorization: "Bearer x" },
      body: JSON.stringify({ status: true }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "2" }) });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("only one data should be active");
  });
});
