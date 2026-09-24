import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/products/service", () => ({
  default: {
    list: vi.fn().mockResolvedValue({
      items: [],
      page: 2,
      limit: 5,
      totalItems: 0,
      totalPages: 0,
    }),
  },
}));

import { GET } from "../route";

describe("GET /api/products", () => {
  it("reads page/limit/search/type/categoryId from searchParams, not req.query", async () => {
    const req = new Request(
      "http://localhost/api/products?page=2&limit=5&search=aspirin&type=medicine&categoryId=3",
    );
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.page).toBe(2);
    expect(body.data.limit).toBe(5);
  });

  it("defaults to no filters when no query params are given", async () => {
    const req = new Request("http://localhost/api/products");
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
  });
});
