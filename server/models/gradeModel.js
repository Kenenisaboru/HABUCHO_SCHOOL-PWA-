/**
 * Grade Model
 * -----------
 * Database queries for student grades.
 */
import pool from "../config/db.js";

export const getAllGrades = async ({ student_id, teacher_id, academic_year, grade_level, section, subject, assessment_type, semester, limit, offset }) => {
  let baseQuery = `
    FROM grades g
    LEFT JOIN users s ON g.student_id = s.id
    LEFT JOIN users t ON g.teacher_id = t.id
    WHERE 1=1`;
  const params = [];
  let paramIndex = 1;

  if (student_id) {
    baseQuery += ` AND g.student_id = $${paramIndex++}`;
    params.push(student_id);
  }
  if (teacher_id) {
    baseQuery += ` AND g.teacher_id = $${paramIndex++}`;
    params.push(teacher_id);
  }
  if (academic_year) {
    baseQuery += ` AND g.academic_year = $${paramIndex++}`;
    params.push(academic_year);
  }
  if (grade_level) {
    baseQuery += ` AND g.grade_level = $${paramIndex++}`;
    params.push(grade_level);
  }
  if (section) {
    baseQuery += ` AND g.section = $${paramIndex++}`;
    params.push(section);
  }
  if (subject) {
    baseQuery += ` AND g.subject = $${paramIndex++}`;
    params.push(subject);
  }
  if (assessment_type) {
    baseQuery += ` AND g.assessment_type = $${paramIndex++}`;
    params.push(assessment_type);
  }
  if (semester) {
    baseQuery += ` AND g.semester = $${paramIndex++}`;
    params.push(semester);
  }

  const countResult = await pool.query("SELECT COUNT(*)" + baseQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  const query = `
    SELECT g.*, 
           s.full_name AS student_name, 
           t.full_name AS teacher_name
    ` + baseQuery + ` ORDER BY g.semester, g.subject LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return { grades: result.rows, total };
};

export const getGradeById = async (id) => {
  const result = await pool.query(
    `SELECT g.*, s.full_name AS student_name, t.full_name AS teacher_name
     FROM grades g
     LEFT JOIN users s ON g.student_id = s.id
     LEFT JOIN users t ON g.teacher_id = t.id
     WHERE g.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createGrade = async ({ student_id, teacher_id, subject, score, semester }) => {
  const result = await pool.query(
    "INSERT INTO grades (student_id, teacher_id, subject, score, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [student_id, teacher_id, subject, score, semester]
  );
  return result.rows[0];
};

export const updateGrade = async (id, { subject, score, semester }) => {
  const result = await pool.query(
    "UPDATE grades SET subject = COALESCE($1, subject), score = COALESCE($2, score), semester = COALESCE($3, semester) WHERE id = $4 RETURNING *",
    [subject, score, semester, id]
  );
  return result.rows[0];
};

export const deleteGrade = async (id) => {
  const result = await pool.query("DELETE FROM grades WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const bulkUpsertGrades = async (gradesData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Process each grade update/insert sequentially to avoid complex multi-row upserts with dynamic constraints
    for (const data of gradesData) {
      const { student_id, teacher_id, subject, score, semester, academic_year, grade_level, section, assessment_type, total_marks, comments } = data;
      
      // Check if this specific grade record already exists
      const checkRes = await client.query(
        "SELECT id FROM grades WHERE student_id = $1 AND academic_year = $2 AND semester = $3 AND subject = $4 AND assessment_type = $5",
        [student_id, academic_year, semester, subject, assessment_type]
      );
      
      if (checkRes.rows.length > 0) {
        // Update
        await client.query(
          "UPDATE grades SET score = $1, total_marks = $2, comments = $3, teacher_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
          [score, total_marks, comments, teacher_id, checkRes.rows[0].id]
        );
      } else {
        // Insert
        await client.query(
          "INSERT INTO grades (student_id, teacher_id, subject, score, semester, academic_year, grade_level, section, assessment_type, total_marks, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [student_id, teacher_id, subject, score, semester, academic_year, grade_level, section, assessment_type, total_marks, comments]
        );
      }
    }
    
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
