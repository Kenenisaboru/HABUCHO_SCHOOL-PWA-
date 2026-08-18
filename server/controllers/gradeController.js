/**
 * Grade Controller
 * ----------------
 * Teachers manage grades; students view only their own.
 */
import * as GradeModel from "../models/gradeModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";
import { sendEmail, buildScoreReportEmail } from "../services/emailService.js";
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
