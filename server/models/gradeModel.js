/**
 * Grade Model
 * -----------
 * Database queries for student grades.
 */
import pool from "../config/db.js";

export const getAllGrades = async ({ student_id, teacher_id, limit, offset }) => {
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
