import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/admins/service", () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      id: 1,
      name: "Test Admin",
      email: "admin@test.com",
      username: "admin",
      role: "admin",
      token: "signed.jwt.token",
    }),
  },
}));

import { POST } from "../login/route";

describe("POST /api/admins/login", () => {
  it("returns the data/message envelope with a token", async () => {
    const req = new Request("http://localhost/api/admins/login", {
      method: "POST",
      body: JSON.stringify({ username: "admin", password: "password123" }),
    });
    const res = await POST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Success");
    expect(body.data.token).toBe("signed.jwt.token");
  });
});
