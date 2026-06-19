/**
 * Grade Model
 * -----------
 * Database queries for student grades.
 */
import pool from "../config/db.js";

export const getAllGrades = async ({ student_id, teacher_id, limit, offset }) => {
  let query = `
    SELECT g.*, 
           s.full_name AS student_name, 
           t.full_name AS teacher_name
    FROM grades g
    LEFT JOIN users s ON g.student_id = s.id
    LEFT JOIN users t ON g.teacher_id = t.id
    WHERE 1=1`;
  const params = [];
  let paramIndex = 1;

  if (student_id) {
    query += ` AND g.student_id = $${paramIndex++}`;
    params.push(student_id);
  }
  if (teacher_id) {
    query += ` AND g.teacher_id = $${paramIndex++}`;
    params.push(teacher_id);
  }

  const countQuery = query.replace(
    "SELECT g.*, \n           s.full_name AS student_name, \n           t.full_name AS teacher_name",
    "SELECT COUNT(*)"
  );
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  query += ` ORDER BY g.semester, g.subject LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
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
