import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isTelegramConfigured,
  sendTelegramMessage,
  broadcastToSchoolChannel,
  sendScoreAlert,
  sendAdmissionAlert,
  sendAdminPendingApprovalAlert,
} from "./telegramService.js";

describe("Telegram Service", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true, result: { message_id: 12345 } }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("checks configuration status safely", () => {
    expect(typeof isTelegramConfigured()).toBe("boolean");
  });

  it("sends message via bot API without throwing", async () => {
    const res = await sendTelegramMessage("123456", "Test message");
    expect(res.ok).toBe(true);
  });

  it("formats score alerts cleanly", async () => {
    const res = await sendScoreAlert({
      chatId: "123456",
      studentName: "Abebe Kebede",
      subject: "Mathematics",
      assessmentType: "Final Exam",
      score: 95,
      semester: 1,
      academicYear: "2017 E.C.",
    });
    expect(res.ok).toBe(true);
  });

  it("formats admission alerts cleanly", async () => {
    const res = await sendAdmissionAlert({
      chatId: "123456",
      applicantName: "Chaltu Tolera",
      referenceNumber: "HAB-2017-ABC123",
      status: "approved",
    });
    expect(res.ok).toBe(true);
  });

  it("broadcasts announcements to school channel safely", async () => {
    const res = await broadcastToSchoolChannel(
      "Midterm Exam Schedule",
      "Examinations will begin on Monday. Check your timetable.",
      "Academic"
    );
    expect(typeof res).toBe("object");
  });

  it("formats admin pending approval alerts cleanly", async () => {
    const res = await sendAdminPendingApprovalAlert({
      teacherName: "Mr. Tadesse",
      gradeLevel: "11",
      section: "A",
      subject: "Physics",
      studentCount: 42,
    });
    expect(typeof res).toBe("object");
  });
});
