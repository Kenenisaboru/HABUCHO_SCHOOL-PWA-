import { describe, it, expect, vi } from "vitest";
import { buildPasswordResetEmail, buildScoreReportEmail } from "./emailService.js";

describe("Email Service Templates", () => {
  it("builds a password reset email containing the user name and reset URL", () => {
    const html = buildPasswordResetEmail({
      userName: "Kenenisa",
      resetUrl: "https://school.habucho.edu/login?token=xyz123&mode=reset",
    });

    expect(html).toContain("Kenenisa");
    expect(html).toContain("https://school.habucho.edu/login?token=xyz123&mode=reset");
    expect(html).toContain("Reset My Password");
    expect(html).toContain("Habucho Preparatory School");
  });

  it("builds a score report email with student marks", () => {
    const html = buildScoreReportEmail({
      studentName: "Abebe Bikila",
      teacherName: "Sarah Johnson",
      subject: "Mathematics",
      academicYear: "2024/2025",
      semester: "Semester 1",
      grades: [
        { assessment_type: "Mid Exam", score: 85, total_marks: 100 },
        { assessment_type: "Final Exam", score: 90, total_marks: 100 },
      ],
      averageScore: 87.5,
    });

    expect(html).toContain("Abebe Bikila");
    expect(html).toContain("Mathematics");
    expect(html).toContain("87.5");
    expect(html).toContain("Mid Exam");
  });
});

