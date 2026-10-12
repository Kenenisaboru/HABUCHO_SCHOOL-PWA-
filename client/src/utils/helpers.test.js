import { describe, it, expect } from "vitest";
import { capitalize, getGradeLetter, getDashboardPath } from "./helpers";

describe("Utility functions", () => {
  it("capitalize capitalizes first letter", () => {
    expect(capitalize("habucho")).toBe("Habucho");
  });

  it("getGradeLetter assigns correct letter grade based on numeric score", () => {
    expect(getGradeLetter(95)).toBe("A");
    expect(getGradeLetter(85)).toBe("B");
    expect(getGradeLetter(75)).toBe("C");
    expect(getGradeLetter(65)).toBe("D");
    expect(getGradeLetter(50)).toBe("F");
  });

  it("getDashboardPath returns corresponding route for role", () => {
    expect(getDashboardPath("admin")).toBe("/admin");
    expect(getDashboardPath("teacher")).toBe("/teacher");
    expect(getDashboardPath("student")).toBe("/student");
    expect(getDashboardPath("unknown")).toBe("/");
  });
});
