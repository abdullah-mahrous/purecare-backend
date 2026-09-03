import request from "supertest";
import { describe, expect, it } from "vitest";
import handler from "../api/index";

describe("Vercel serverless handler", () => {
  it("serves the health endpoint without starting a listener", async () => {
    const response = await request(handler).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: "Server is running" });
  });

  it("preserves middleware and route handling", async () => {
    const response = await request(handler).get("/api/reservations");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ success: false });
  });
});