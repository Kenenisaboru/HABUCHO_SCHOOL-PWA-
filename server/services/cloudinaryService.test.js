import { describe, it, expect, vi } from "vitest";
import { isCloudinaryConfigured, deleteFromCloudinary, processCloudinaryUpload } from "./cloudinaryService.js";

describe("Cloudinary Service", () => {
  it("reports configuration status based on environment", () => {
    // When environment variables are unset, isCloudinaryConfigured returns a boolean
    expect(typeof isCloudinaryConfigured()).toBe("boolean");
  });

  it("handles deleteFromCloudinary gracefully when not configured or URL empty", async () => {
    const result = await deleteFromCloudinary(null);
    expect(result).toBeNull();
  });

  it("middleware passes through immediately if no file is uploaded", async () => {
    const middleware = processCloudinaryUpload("test");
    const req = {};
    const res = {};
    let calledNext = false;
    const next = () => {
      calledNext = true;
    };

    await middleware(req, res, next);
    expect(calledNext).toBe(true);
  });
});
