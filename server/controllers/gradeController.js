/**
 * Grade Controller
 * ----------------
 * Teachers manage grades; students view only their own.
 */
import * as GradeModel from "../models/gradeModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";
import { sendEmail, buildScoreReportEmail } from "../services/emailService.js";
import { logAuditEvent } from "../services/auditService.js";
import { recalculateRankings } from "../services/academicCalculationEngine.js";
import pool from "../config/db.js";

export const getGrades = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const filters = { ...pagination };

    // Students can only see their own grades
    if (req.user.role === "student") {
      filters.student_id = req.user.id;
    } else if (req.user.role === "teacher") {
      filters.teacher_id = req.user.id;
    }

    if (req.query.student_id && req.user.role !== "student") {
      filters.student_id = req.query.student_id;
    }
    
    // Add new filters
    if (req.query.academic_year) filters.academic_year = req.query.academic_year;
    if (req.query.grade_level) filters.grade_level = req.query.grade_level;
    if (req.query.section) filters.section = req.query.section;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.assessment_type) filters.assessment_type = req.query.assessment_type;
    if (req.query.semester) filters.semester = req.query.semester;

    const { grades, total } = await GradeModel.getAllGrades(filters);

    return sendSuccess(res, {
      grades,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const { student_id, subject, score, semester } = req.body;

    if (!student_id || !subject || score === undefined || !semester) {
      return sendError(res, "All grade fields are required");
    }

    if (score < 0 || score > 100) {
      return sendError(res, "Score must be between 0 and 100");
    }

    const grade = await GradeModel.createGrade({
      student_id,
      teacher_id: req.user.id,
      subject,
      score,
      semester,
    });

    return sendSuccess(res, grade, "Grade created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const grade = await GradeModel.updateGrade(req.params.id, req.body);
    if (!grade) return sendError(res, "Grade not found", 404);
    return sendSuccess(res, grade, "Grade updated");
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const grade = await GradeModel.deleteGrade(req.params.id);
    if (!grade) return sendError(res, "Grade not found", 404);
    return sendSuccess(res, null, "Grade deleted");
  } catch (error) {
    next(error);
  }
};

export const bulkUpsert = async (req, res, next) => {
  try {
    const { grades } = req.body;
    
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return sendError(res, "Invalid grades data provided");
    }

    // Force the teacher_id to be the currently logged-in teacher
    const gradesWithTeacherId = grades.map(g => ({
      ...g,
      teacher_id: req.user.id
    }));

    await GradeModel.bulkUpsertGrades(gradesWithTeacherId);

    await logAuditEvent({
      user: req.user,
      action: "GRADE_BULK_UPSERT",
      entityType: "grade",
      details: {
        count: grades.length,
        subject: grades[0]?.subject,
        academic_year: grades[0]?.academic_year,
      },
      ip: req.ip,
    });
    
    return sendSuccess(res, null, "Scores saved successfully");
  } catch (error) {
    next(error);
  }
};

export const sendScoresToStudents = async (req, res, next) => {
  try {
    const { grade_level, section, subject, academic_year, semester, format } = req.body;

    if (!grade_level || !section || !subject || !academic_year || !semester) {
      return sendError(res, "grade_level, section, subject, academic_year, and semester are required");
    }

    if (!["pdf", "csv", "both"].includes(format)) {
      return sendError(res, "Format must be pdf, csv, or both");
    }

    // Get students in the class with their email
    const studentsRes = await pool.query(
      `SELECT id, full_name, email FROM users
       WHERE role = 'student' AND grade_level = $1 AND section = $2
       ORDER BY full_name`,
      [grade_level, section]
    );
    const students = studentsRes.rows;

    if (students.length === 0) {
      return sendError(res, "No students found in this class", 404);
    }

    // Get teacher info
    const teacherRes = await pool.query("SELECT full_name FROM users WHERE id = $1", [req.user.id]);
    const teacherName = teacherRes.rows[0]?.full_name || "Teacher";

    // Get all grades for this class+subject+semester
    const gradesRes = await pool.query(
      `SELECT g.*, s.full_name AS student_name, s.email AS student_email
       FROM grades g
       LEFT JOIN users s ON g.student_id = s.id
       WHERE g.grade_level = $1 AND g.section = $2 AND g.subject = $3
         AND g.academic_year = $4 AND g.semester = $5
       ORDER BY s.full_name, g.assessment_type`,
      [grade_level, section, subject, academic_year, semester]
    );
    const allGrades = gradesRes.rows;

    let sentCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const student of students) {
      const studentGrades = allGrades.filter((g) => g.student_id === student.id);
      if (studentGrades.length === 0) continue;
      if (!student.email) {
        failedCount++;
        errors.push(`${student.full_name}: no email address`);
        continue;
      }

      const validScores = studentGrades.map((g) => parseFloat(g.score)).filter((n) => !isNaN(n));
      const averageScore =
        validScores.length > 0
          ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
          : "-";

      const attachments = [];

      if (format === "csv" || format === "both") {
        const csvHeader = "Assessment,Score,Total Marks\n";
        const csvRows = studentGrades
          .map((g) => `${g.assessment_type},${g.score ?? ""},${g.total_marks || 100}`)
          .join("\n");
        const csvContent = csvHeader + csvRows + `\n\nAverage,,,${averageScore}`;
        attachments.push({
          filename: `scores_${subject.replace(/\s+/g, "_")}_${semester.replace(/\s+/g, "_")}.csv`,
          content: Buffer.from(csvContent, "utf-8"),
          contentType: "text/csv",
        });
      }

      if (format === "pdf" || format === "both") {
        const htmlReport = buildScoreReportEmail({
          studentName: student.full_name,
          teacherName,
          subject,
          academicYear: academic_year,
          semester,
          grades: studentGrades,
          averageScore,
        });
        attachments.push({
          filename: `report_${subject.replace(/\s+/g, "_")}_${semester.replace(/\s+/g, "_")}.html`,
          content: Buffer.from(htmlReport, "utf-8"),
          contentType: "text/html",
        });
      }

      const htmlBody = buildScoreReportEmail({
        studentName: student.full_name,
        teacherName,
        subject,
        academicYear: academic_year,
        semester,
        grades: studentGrades,
        averageScore,
      });

      const result = await sendEmail({
        to: student.email,
        subject: `Score Report — ${subject} (${semester}) — Habucho School`,
        html: htmlBody,
        attachments,
      });

      if (result.success) sentCount++;
      else {
        failedCount++;
        errors.push(`${student.full_name}: ${result.error}`);
      }
    }

    return sendSuccess(res, {
      total: students.length,
      sent: sentCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined,
    }, `Score reports sent to ${sentCount} student(s)`);
  } catch (error) {
    next(error);
  }
};

/**
 * Teacher submits a batch of scores for Admin approval
 */
export const submitGradesForApproval = async (req, res, next) => {
  try {
    const { academic_year, semester, subject, grade_level, section } = req.body;
    if (!academic_year || !semester || !subject || !grade_level || !section) {
      return sendError(res, "academic_year, semester, subject, grade_level, and section are required", 400);
    }

    const result = await pool.query(
      `UPDATE grades
       SET submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP
       WHERE teacher_id = $1 AND academic_year = $2 AND semester = $3 AND subject = $4
         AND grade_level = $5 AND section = $6
       RETURNING id`,
      [req.user.id, academic_year, semester, subject, grade_level, section]
    );

    await logAuditEvent({
      user: req.user,
      action: "GRADE_SUBMIT_FOR_APPROVAL",
      entityType: "grade_batch",
      details: { academic_year, semester, subject, grade_level, section, count: result.rowCount },
      ip: req.ip,
    });

    return sendSuccess(res, { count: result.rowCount }, "Scores submitted for administrative approval");
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get pending score submission batches
 */
export const getPendingSubmissions = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT g.academic_year, g.semester, g.subject, g.grade_level, g.section,
              g.teacher_id, t.full_name AS teacher_name,
              COUNT(DISTINCT g.student_id) AS student_count,
              COUNT(g.id) AS total_scores,
              MIN(g.submitted_at) AS submitted_at,
              g.submission_status
       FROM grades g
       LEFT JOIN users t ON g.teacher_id = t.id
       WHERE g.submission_status = 'submitted'
       GROUP BY g.academic_year, g.semester, g.subject, g.grade_level, g.section, g.teacher_id, t.full_name, g.submission_status
       ORDER BY MIN(g.submitted_at) ASC`
    );

    return sendSuccess(res, rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Approve a batch of grades and recalculate rankings
 */
export const approveGradesBatch = async (req, res, next) => {
  try {
    const { academic_year, semester, subject, grade_level, section } = req.body;
    if (!academic_year || !semester || !subject || !grade_level || !section) {
      return sendError(res, "academic_year, semester, subject, grade_level, and section are required", 400);
    }

    const result = await pool.query(
      `UPDATE grades
       SET submission_status = 'approved',
           approved_by = $1,
           approved_at = CURRENT_TIMESTAMP,
           rejection_reason = NULL
       WHERE academic_year = $2 AND semester = $3 AND subject = $4
         AND grade_level = $5 AND section = $6
       RETURNING id`,
      [req.user.id, academic_year, semester, subject, grade_level, section]
    );

    // Recalculate rankings automatically after approval
    try {
      await recalculateRankings(academic_year, semester);
    } catch (calcErr) {
      // Log calculation error without blocking response
      console.error("Recalculate rankings warning:", calcErr.message);
    }

    await logAuditEvent({
      user: req.user,
      action: "GRADE_BATCH_APPROVED",
      entityType: "grade_batch",
      details: { academic_year, semester, subject, grade_level, section, count: result.rowCount },
      ip: req.ip,
    });

    return sendSuccess(res, { count: result.rowCount }, "Scores approved and rankings updated");
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Reject a batch of grades with reason
 */
export const rejectGradesBatch = async (req, res, next) => {
  try {
    const { academic_year, semester, subject, grade_level, section, reason } = req.body;
    if (!academic_year || !semester || !subject || !grade_level || !section || !reason) {
      return sendError(res, "academic_year, semester, subject, grade_level, section, and reason are required", 400);
    }

    const result = await pool.query(
      `UPDATE grades
       SET submission_status = 'rejected',
           rejection_reason = $1
       WHERE academic_year = $2 AND semester = $3 AND subject = $4
         AND grade_level = $5 AND section = $6
       RETURNING id`,
      [reason, academic_year, semester, subject, grade_level, section]
    );

    await logAuditEvent({
      user: req.user,
      action: "GRADE_BATCH_REJECTED",
      entityType: "grade_batch",
      details: { academic_year, semester, subject, grade_level, section, reason, count: result.rowCount },
      ip: req.ip,
    });

    return sendSuccess(res, { count: result.rowCount }, "Scores rejected and returned to teacher");
  } catch (error) {
    next(error);
  }
};
