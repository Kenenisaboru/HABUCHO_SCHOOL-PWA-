import { describe, it, expect } from "vitest";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

describe("Response utilities", () => {
  it("sendSuccess returns correct format", () => {
    const res = {
      status: (code) => ({ json: (body) => ({ statusCode: code, body }) }),
    };
    const result = sendSuccess(res, { name: "test" }, "OK", 200);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("OK");
    expect(result.body.data.name).toBe("test");
  });

  it("sendError returns correct format", () => {
    const res = {
      status: (code) => ({ json: (body) => ({ statusCode: code, body }) }),
    };
    const result = sendError(res, "Bad request", 400);
    expect(result.statusCode).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Bad request");
  });

  it("getPagination returns correct values", () => {
    const result = getPagination(1, 10);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
  });
});
