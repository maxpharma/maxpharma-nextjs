import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/generalSettings/service", () => ({
  default: {
    getByKey: vi.fn().mockResolvedValue({ key: "site_title", value: "Max Pharma" }),
  },
}));

import { GET } from "../key/[key]/route";

describe("GET /api/generalSettings/key/:key", () => {
  it("passes the key URL param through to the service", async () => {
    const req = new Request("http://localhost/api/generalSettings/key/site_title");
    const res = await GET(req, { params: Promise.resolve({ key: "site_title" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.value).toBe("Max Pharma");
  });
});
