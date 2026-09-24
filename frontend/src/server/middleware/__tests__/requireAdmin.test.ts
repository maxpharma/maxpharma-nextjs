import { describe, it, expect } from "vitest";
import requireAdmin from "../requireAdmin";

describe("requireAdmin", () => {
  it("throws 'Unauthorized' when no token is present", async () => {
    const req = new Request("http://localhost/api/admins", {
      headers: {},
    });
    await expect(requireAdmin(req, ["admin"])).rejects.toThrow(
      "Unauthorized",
    );
  });

  it("throws when the token is malformed", async () => {
    const req = new Request("http://localhost/api/admins", {
      headers: { authorization: "Bearer not-a-real-jwt" },
    });
    await expect(requireAdmin(req, ["admin"])).rejects.toThrow();
  });
});
