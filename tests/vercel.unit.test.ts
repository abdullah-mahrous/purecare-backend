import { describe, expect, it } from "vitest";
import handler from "../api/index";

describe("Vercel entrypoint", () => {
  it("exports the Express app as the serverless handler", () => {
    expect(typeof handler).toBe("function");
    expect(handler).toHaveProperty("listen");
  });
});