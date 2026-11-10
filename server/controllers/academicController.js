/**
 * Academic Analytics Controller
 * ----------------------------
 * Top scorer analytics, ranking endpoints, and performance analytics
 * for the admin dashboard.
 */
import {
  recalculateRankings,
  getTopScorersByClass,
  getTopScorersByGrade,
  getTopScorersSchoolWide,
  getTopScorersBySubject,
  getSchoolPerformanceAnalytics,
} from "../services/academicCalculationEngine.js";
import { sendSuccess, sendError } from "../utils/response.js";
import pool from "../config/db.js";

/**
 * POST /api/academic/recalculate-rankings
 * Trigger full recalculation of rankings
 */
export const triggerRankingRecalculation = async (req, res, next) => {
  try {
    const { academic_year = "2024/2025", semester = "Semester 1", assessment_type = "All" } = req.body;
    await recalculateRankings(academic_year, semester, assessment_type);
    return sendSuccess(res, null, "Rankings recalculated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/top-scorers/class
 */
export const topScorersByClass = async (req, res, next) => {
  try {
    const { academic_year, semester, assessment_type, grade_level, section, limit } = req.query;
    if (!grade_level || !section) {
      return sendError(res, "grade_level and section are required", 400);
    }
    const data = await getTopScorersByClass({
      academic_year: academic_year || "2024/2025",
      semester: semester || "Semester 1",
      assessment_type: assessment_type || "All",
      grade_level,
      section,
      limit: parseInt(limit) || 10,
    });
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/top-scorers/grade
 */
export const topScorersByGrade = async (req, res, next) => {
  try {
    const { academic_year, semester, assessment_type, grade_level, limit } = req.query;
    if (!grade_level) {
      return sendError(res, "grade_level is required", 400);
    }
    const data = await getTopScorersByGrade({
      academic_year: academic_year || "2024/2025",
      semester: semester || "Semester 1",
      assessment_type: assessment_type || "All",
      grade_level,
      limit: parseInt(limit) || 15,
    });
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/top-scorers/school
 */
export const topScorersSchoolWide = async (req, res, next) => {
  try {
    const { academic_year, semester, assessment_type, limit } = req.query;
    const data = await getTopScorersSchoolWide({
      academic_year: academic_year || "2024/2025",
      semester: semester || "Semester 1",
      assessment_type: assessment_type || "All",
      limit: parseInt(limit) || 10,
    });
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/top-scorers/subject
 */
export const topScorersBySubjectHandler = async (req, res, next) => {
  try {
    const { academic_year, semester, subject, grade_level, limit } = req.query;
    if (!subject) {
      return sendError(res, "subject is required", 400);
    }
    const data = await getTopScorersBySubject({
      academic_year: academic_year || "2024/2025",
      semester: semester || "Semester 1",
      subject,
      grade_level: grade_level || null,
      limit: parseInt(limit) || 15,
    });
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/analytics
 */
export const schoolPerformanceAnalytics = async (req, res, next) => {
  try {
    const { academic_year, semester, assessment_type } = req.query;
    const data = await getSchoolPerformanceAnalytics({
      academic_year: academic_year || "2024/2025",
      semester: semester || "Semester 1",
      assessment_type: assessment_type || "All",
    });
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/student/:studentId/summary
 * Individual student academic summary and history
 */
export const getStudentAcademicSummary = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { academic_year } = req.query;

    // Security: Students can only access their own records
    if (req.user.role === "student" && req.user.id !== parseInt(studentId, 10)) {
      return sendError(res, "Access denied", 403);
    }

    let query = `
      SELECT s.*, u.full_name AS student_name, u.student_id AS student_code
      FROM student_academic_summaries s
      JOIN users u ON s.student_id = u.id
      WHERE s.student_id = $1
    `;
    const params = [studentId];

    if (academic_year) {
      params.push(academic_year);
      query += ` AND s.academic_year = $2`;
    }

    query += ` ORDER BY s.academic_year DESC, s.semester ASC`;

    const { rows } = await pool.query(query, params);
    return sendSuccess(res, rows);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/academic/student/:studentId/history
 * Full multi-year academic history
 */
export const getStudentAcademicHistory = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Security
    if (req.user.role === "student" && req.user.id !== parseInt(studentId, 10)) {
      return sendError(res, "Access denied", 403);
    }

    // Summaries across all years
    const summaries = await pool.query(
      `SELECT s.*, u.full_name AS student_name, u.student_id AS student_code
       FROM student_academic_summaries s
       JOIN users u ON s.student_id = u.id
       WHERE s.student_id = $1
       ORDER BY s.academic_year ASC, s.semester ASC`,
      [studentId]
    );

    // Detailed marks across all years
    const grades = await pool.query(
      `SELECT g.*, t.full_name AS teacher_name
       FROM grades g
       LEFT JOIN users t ON g.teacher_id = t.id
       WHERE g.student_id = $1 AND g.submission_status IN ('approved', 'published')
       ORDER BY g.academic_year ASC, g.semester ASC, g.subject ASC`,
      [studentId]
    );

    return sendSuccess(res, {
      summaries: summaries.rows,
      grades: grades.rows,
    });
  } catch (error) {
    next(error);
  }
};

