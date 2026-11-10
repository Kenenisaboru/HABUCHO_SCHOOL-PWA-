import { describe, it, expect } from "vitest";
import { capitalize, getPassStatus, formatScorePercentage, getDashboardPath } from "./helpers";

describe("Utility functions", () => {
  it("capitalize capitalizes first letter", () => {
    expect(capitalize("habucho")).toBe("Habucho");
  });

  it("getPassStatus correctly evaluates passing threshold (numerical only)", () => {
    expect(getPassStatus(95)).toBe("Pass");
    expect(getPassStatus(50)).toBe("Pass");
    expect(getPassStatus(49.9)).toBe("Fail");
    expect(getPassStatus(0)).toBe("Fail");
  });

  it("formatScorePercentage formats numerical percentage", () => {
    expect(formatScorePercentage(90, 100)).toBe("90.0%");
    expect(formatScorePercentage(45, 50)).toBe("90.0%");
  });

  it("getDashboardPath returns corresponding route for role", () => {
    expect(getDashboardPath("admin")).toBe("/admin");
    expect(getDashboardPath("teacher")).toBe("/teacher");
    expect(getDashboardPath("student")).toBe("/student");
    expect(getDashboardPath("unknown")).toBe("/");
  });
});
