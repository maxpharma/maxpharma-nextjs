import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/galleries/service", () => ({
  default: {
    list: vi.fn().mockResolvedValue({ items: [], page: 1, limit: 10, totalItems: 0, totalPages: 0 }),
  },
}));

import { GET } from "../route";

describe("GET /api/gallery", () => {
  it("returns 200 with no query params", async () => {
    const req = new Request("http://localhost/api/gallery");
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
  });
});
