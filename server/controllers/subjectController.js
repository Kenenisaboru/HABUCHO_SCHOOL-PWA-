/**
 * Subject & Ethiopian Curriculum Controller
 * -----------------------------------------
 * Manages Ethiopian secondary school subjects (Grades 9-12),
 * stream assignments, and teacher-subject-class relationships.
 */
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { logAuditEvent } from "../services/auditService.js";

/**
 * Get all subjects with optional filtering by grade level and stream
 */
export const getSubjects = async (req, res, next) => {
  try {
    const { grade_level, stream, is_active } = req.query;
    let query = "SELECT * FROM subjects WHERE 1=1";
    const params = [];
    let paramIdx = 1;

    if (grade_level) {
      query += ` AND $${paramIdx++} = ANY(grade_levels)`;
      params.push(String(grade_level));
    }

    if (stream && stream !== "All") {
      query += ` AND (stream = $${paramIdx++} OR stream = 'General' OR stream = 'All')`;
      params.push(stream);
    }

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramIdx++}`;
      params.push(is_active === "true");
    }

    query += " ORDER BY name ASC";
    const { rows } = await pool.query(query, params);
    return sendSuccess(res, rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Ethiopian Curriculum structure for all grades
 */
export const getCurriculumStructure = async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM subjects WHERE is_active = true ORDER BY name ASC");

    const curriculum = {
      grade9: rows.filter((s) => s.grade_levels.includes("9")),
      grade10: rows.filter((s) => s.grade_levels.includes("10")),
      grade11Natural: rows.filter((s) => s.grade_levels.includes("11") && (s.stream === "Natural Science" || s.stream === "All")),
      grade11Social: rows.filter((s) => s.grade_levels.includes("11") && (s.stream === "Social Science" || s.stream === "All")),
      grade12Natural: rows.filter((s) => s.grade_levels.includes("12") && (s.stream === "Natural Science" || s.stream === "All")),
      grade12Social: rows.filter((s) => s.grade_levels.includes("12") && (s.stream === "Social Science" || s.stream === "All")),
    };

    return sendSuccess(res, curriculum);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new subject (Admin only)
 */
export const createSubject = async (req, res, next) => {
  try {
    const { code, name, category, grade_levels, stream, max_marks, pass_mark, description } = req.body;

    if (!code || !name || !grade_levels || grade_levels.length === 0) {
      return sendError(res, "Subject code, name, and at least one grade level are required", 400);
    }

    const { rows } = await pool.query(
      `INSERT INTO subjects (code, name, category, grade_levels, stream, max_marks, pass_mark, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        code.trim().toUpperCase(),
        name.trim(),
        category || "Core",
        grade_levels,
        stream || "General",
        parseFloat(max_marks) || 100.0,
        parseFloat(pass_mark) || 50.0,
        description || null,
      ]
    );

    await logAuditEvent({
      user: req.user,
      action: "SUBJECT_CREATE",
      entityType: "subject",
      entityId: rows[0].id,
      details: { code: rows[0].code, name: rows[0].name },
      ip: req.ip,
    });

    return sendSuccess(res, rows[0], "Subject created successfully", 201);
  } catch (error) {
    if (error.code === "23505") {
      return sendError(res, "A subject with this code already exists", 409);
    }
    next(error);
  }
};

/**
 * Update an existing subject (Admin only)
 */
export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, grade_levels, stream, max_marks, pass_mark, description, is_active } = req.body;

    const { rows } = await pool.query(
      `UPDATE subjects 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           grade_levels = COALESCE($3, grade_levels),
           stream = COALESCE($4, stream),
           max_marks = COALESCE($5, max_marks),
           pass_mark = COALESCE($6, pass_mark),
           description = COALESCE($7, description),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, category, grade_levels, stream, max_marks, pass_mark, description, is_active, id]
    );

    if (rows.length === 0) {
      return sendError(res, "Subject not found", 404);
    }

    await logAuditEvent({
      user: req.user,
      action: "SUBJECT_UPDATE",
      entityType: "subject",
      entityId: id,
      details: { name: rows[0].name, is_active: rows[0].is_active },
      ip: req.ip,
    });

    return sendSuccess(res, rows[0], "Subject updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get teacher subject assignments
 */
export const getTeacherAssignments = async (req, res, next) => {
  try {
    const { academic_year, grade_level, section, teacher_id } = req.query;
    let query = `
      SELECT a.*, 
             s.name AS subject_name, 
             s.code AS subject_code,
             s.stream AS subject_stream,
             u.full_name AS teacher_name, 
             u.email AS teacher_email
      FROM subject_teacher_assignments a
      JOIN subjects s ON a.subject_id = s.id
      JOIN users u ON a.teacher_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (academic_year) {
      query += ` AND a.academic_year = $${paramIdx++}`;
      params.push(academic_year);
    }
    if (grade_level) {
      query += ` AND a.grade_level = $${paramIdx++}`;
      params.push(grade_level);
    }
    if (section) {
      query += ` AND a.section = $${paramIdx++}`;
      params.push(section);
    }
    if (teacher_id) {
      query += ` AND a.teacher_id = $${paramIdx++}`;
      params.push(teacher_id);
    }

    query += " ORDER BY a.grade_level, a.section, s.name ASC";
    const { rows } = await pool.query(query, params);
    return sendSuccess(res, rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Assign a teacher to a subject for a class/section (Admin only)
 */
export const assignTeacherToSubject = async (req, res, next) => {
  try {
    const { subject_id, teacher_id, academic_year, grade_level, section } = req.body;

    if (!subject_id || !teacher_id || !grade_level || !section) {
      return sendError(res, "Subject, teacher, grade level, and section are required", 400);
    }

    const year = academic_year || "2024/2025";

    const { rows } = await pool.query(
      `INSERT INTO subject_teacher_assignments (subject_id, teacher_id, academic_year, grade_level, section)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (subject_id, teacher_id, academic_year, grade_level, section) DO NOTHING
       RETURNING *`,
      [subject_id, teacher_id, year, grade_level, section]
    );

    return sendSuccess(res, rows[0] || null, "Teacher assigned successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a teacher subject assignment (Admin only)
 */
export const removeTeacherAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM subject_teacher_assignments WHERE id = $1", [id]);
    return sendSuccess(res, null, "Assignment removed");
  } catch (error) {
    next(error);
  }
};

