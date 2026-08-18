import { describe, it, expect } from "vitest";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";

const mockUser = { id: 1, email: "test@habucho.edu", role: "student" };

describe("JWT utilities", () => {
  it("generates a valid access token", () => {
    const token = generateAccessToken(mockUser);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(mockUser.id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded.type).toBe("access");
  });

  it("generates a valid refresh token", () => {
    const token = generateRefreshToken(mockUser);
    expect(token).toBeTruthy();

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(mockUser.id);
    expect(decoded.type).toBe("refresh");
  });

  it("throws on invalid token", () => {
    expect(() => verifyToken("invalid.token.here")).toThrow();
  });
});
