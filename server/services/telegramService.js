/**
 * Telegram Notification Service
 * -----------------------------
 * 100% Free, instant messaging service for Habucho Preparatory School.
 * Sends grade alerts, admission updates, and broadcast announcements
 * directly to students, parents, and the school Telegram channel.
 */
import logger from "../utils/logger.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const DEFAULT_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "";

export const isTelegramConfigured = () => Boolean(BOT_TOKEN);

/**
 * Send a message via Telegram Bot API
 * @param {string|number} chatId - Telegram user ID, group ID, or @channel_username
 * @param {string} text - Message text (supports HTML formatting)
 * @param {object} options - Optional parameters (e.g. parse_mode, disable_web_page_preview)
 */
export const sendTelegramMessage = async (chatId, text, options = {}) => {
  if (!isTelegramConfigured()) {
    logger.debug(`[Telegram Simulation] Target: ${chatId} | Message:\n${text}`);
    return { ok: true, simulated: true };
  }

  const targetChatId = chatId || DEFAULT_CHANNEL_ID;
  if (!targetChatId) {
    logger.warn("Telegram send skipped: No target chat_id or channel_id configured.");
    return { ok: false, error: "No target chat ID" };
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: options.parse_mode || "HTML",
        disable_web_page_preview: options.disable_web_page_preview ?? true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      logger.error("Telegram API Error:", data.description);
      return { ok: false, error: data.description };
    }

    return { ok: true, result: data.result };
  } catch (error) {
    logger.error("Failed to send Telegram message:", error.message);
    return { ok: false, error: error.message };
  }
};

/**
 * Broadcast an announcement or alert to the school's Telegram channel/group
 */
export const broadcastToSchoolChannel = async (title, body, category = "General") => {
  const message = `
📢 <b>HABUCHO PREPARATORY SCHOOL</b>
<b>[${category.toUpperCase()}] ${title}</b>
────────────────────
${body}

<i>Habucho School Portal • Academic Excellence</i>
`.trim();

  return sendTelegramMessage(DEFAULT_CHANNEL_ID, message);
};

/**
 * Send student exam score / report card alert
 */
export const sendScoreAlert = async ({
  chatId,
  studentName,
  subject,
  assessmentType,
  score,
  maxScore = 100,
  semester = 1,
  academicYear = "2017 E.C.",
}) => {
  const message = `
📊 <b>HABUCHO SCHOOL • GRADE REPORT</b>
────────────────────
👤 <b>Student:</b> ${studentName}
📖 <b>Subject:</b> ${subject}
📝 <b>Assessment:</b> ${assessmentType}
🏆 <b>Score:</b> <b>${score}</b> / ${maxScore}
📅 <b>Academic Period:</b> Semester ${semester} (${academicYear})
────────────────────
<i>Scores have been verified and approved by School Administration.</i>
`.trim();

  return sendTelegramMessage(chatId, message);
};

/**
 * Send admission application status notification
 */
export const sendAdmissionAlert = async ({
  chatId,
  applicantName,
  referenceNumber,
  status,
  remarks = "",
}) => {
  const isApproved = status.toLowerCase() === "approved";
  const icon = isApproved ? "🎉" : status.toLowerCase() === "rejected" ? "📋" : "⏳";
  const statusText = status.toUpperCase();

  const message = `
${icon} <b>HABUCHO SCHOOL • ADMISSION UPDATE</b>
────────────────────
👤 <b>Applicant:</b> ${applicantName}
🔖 <b>Reference No:</b> <code>${referenceNumber}</code>
📌 <b>Status:</b> <b>${statusText}</b>
${remarks ? `💬 <b>Note:</b> ${remarks}\n` : ""}────────────────────
${
  isApproved
    ? "Please report to the Registrar Office with your original documents to finalize enrollment."
    : "Track your admission status anytime on our school portal."
}
`.trim();

  return sendTelegramMessage(chatId, message);
};

/**
 * Send an alert to Admin when a teacher submits a batch of scores for approval
 */
export const sendAdminPendingApprovalAlert = async ({
  teacherName,
  gradeLevel,
  section,
  subject,
  studentCount,
}) => {
  const message = `
🔔 <b>GRADE APPROVAL REQUIRED</b>
────────────────────
👨‍🏫 <b>Teacher:</b> ${teacherName}
📚 <b>Subject:</b> ${subject}
🏫 <b>Class:</b> Grade ${gradeLevel} - Section ${section}
👥 <b>Students:</b> ${studentCount} scores submitted
────────────────────
<i>Log in to Admin Portal to review, approve, and auto-calculate class rankings.</i>
`.trim();

  return sendTelegramMessage(DEFAULT_CHANNEL_ID, message);
};

export default {
  isTelegramConfigured,
  sendTelegramMessage,
  broadcastToSchoolChannel,
  sendScoreAlert,
  sendAdmissionAlert,
  sendAdminPendingApprovalAlert,
};
