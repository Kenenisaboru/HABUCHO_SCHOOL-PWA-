/**
 * Email Service
 * -------------
 * SMTP-based email sending via nodemailer.
 * Configure SMTP_* env vars for your provider (Gmail, Outlook, etc).
 */
import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    console.warn("[EMAIL] SMTP not configured — emails will be logged to console");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Send an email with optional attachments
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {Array}  options.attachments - [{ filename, content, contentType }]
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const transport = getTransporter();

  if (!transport) {
    console.log(`[EMAIL MOCK] To: ${to}\nSubject: ${subject}\nAttachments: ${attachments.map(a => a.filename).join(", ") || "none"}`);
    return { success: true, mocked: true };
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments,
    });
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Build the HTML email body for a score report
 */
export const buildScoreReportEmail = ({ studentName, teacherName, subject, academicYear, semester, grades, averageScore }) => {
  const gradeRows = grades
    .map(
      (g) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${g.assessment_type}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${g.score ?? "-"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${g.total_marks || 100}</td>
      </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;margin:0;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#059669,#047857);padding:24px 32px;">
          <h1 style="color:#fff;font-size:20px;margin:0;">Habucho Preparatory School</h1>
          <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">Academic Score Report</p>
        </div>
        <div style="padding:24px 32px;">
          <p style="color:#334155;font-size:14px;margin:0 0 16px;">Dear <strong>${studentName}</strong>,</p>
          <p style="color:#334155;font-size:14px;margin:0 0 16px;">Your score report for <strong>${subject}</strong> has been published.</p>

          <div style="background:#f1f5f9;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
            <p style="margin:0;font-size:13px;color:#64748b;">
              Academic Year: <strong>${academicYear}</strong> &nbsp;|&nbsp; Semester: <strong>${semester}</strong> &nbsp;|&nbsp; Teacher: <strong>${teacherName}</strong>
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#059669;color:#fff;">
                <th style="padding:10px 12px;text-align:left;">Assessment</th>
                <th style="padding:10px 12px;text-align:center;">Score</th>
                <th style="padding:10px 12px;text-align:center;">Out Of</th>
              </tr>
            </thead>
            <tbody>${gradeRows}</tbody>
            <tfoot>
              <tr style="background:#ecfdf5;">
                <td style="padding:10px 12px;font-weight:bold;">Average</td>
                <td colspan="2" style="padding:10px 12px;text-align:center;font-weight:bold;color:#059669;font-size:16px;">${averageScore}</td>
              </tr>
            </tfoot>
          </table>

          <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This is an automated message from Habucho School Portal. Please contact your teacher if you have questions.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
