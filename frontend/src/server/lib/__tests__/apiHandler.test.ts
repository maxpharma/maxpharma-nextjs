import { describe, it, expect } from "vitest";
import { apiHandler } from "../apiHandler";

describe("apiHandler", () => {
  it("wraps a successful handler result in {data, message}", async () => {
    const handler = apiHandler(async () => ({ id: 1 }));
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ data: { id: 1 }, message: "Success" });
  });

  it("maps 'Unauthorized' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Unauthorized");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      message: "Unauthorized",
      success: false,
      statusCode: 401,
    });
  });

  it("maps 'jwt expired' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("jwt expired");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
  });

  it("maps 'Invalid API Key' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Invalid API Key");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
  });

  it("maps any other error to 500 and strips 'Error: ' prefix", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Error: Data not found");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Data not found");
    expect(body.success).toBe(false);
  });
});
