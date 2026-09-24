import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/aboutUs/service", () => ({
  default: {
    list: vi.fn().mockResolvedValue({
      items: [],
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    }),
  },
}));

import { GET } from "../route";
import AboutUsService from "../../../../server/modules/aboutUs/service";

describe("GET /api/about-us", () => {
  it("forwards the type query param to the service call", async () => {
    const req = new Request(
      "http://localhost/api/about-us?type=chairperson-message",
    );
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    expect(AboutUsService.list).toHaveBeenCalledWith(
      expect.objectContaining({ type: "chairperson-message" }),
    );
  });

  it("forwards search and defaults page/limit when omitted", async () => {
    const req = new Request("http://localhost/api/about-us?search=vision");
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    expect(AboutUsService.list).toHaveBeenCalledWith(
      expect.objectContaining({ search: "vision", page: 1, limit: 10 }),
    );
  });
});
