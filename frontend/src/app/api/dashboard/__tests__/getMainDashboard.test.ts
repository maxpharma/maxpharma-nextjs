import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/dashboard/service", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      totalApply: 3,
      totalGallery: 10,
      totalContact: 5,
      totalServices: 2,
      totalSetting: 1,
      totalNotices: 4,
      totalProduct: 20,
      totalInquiry: 7,
      inquiryData: { items: [] },
      applyData: { items: [] },
    }),
  },
}));

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { GET } from "../route";

describe("GET /api/dashboard?type=dashboard", () => {
  it("returns the aggregated dashboard counters", async () => {
    const req = new Request("http://localhost/api/dashboard?type=dashboard", {
      headers: { authorization: "Bearer x" },
    });
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.totalProduct).toBe(20);
  });
});
