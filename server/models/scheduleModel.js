/**
 * Schedule Model
 * --------------
 * Database queries for class timetables.
 */
import pool from "../config/db.js";

export const getAllSchedules = async ({ grade_level, teacher_id, limit, offset }) => {
  let query = `
    SELECT s.*, u.full_name AS teacher_name
    FROM schedules s
    LEFT JOIN users u ON s.teacher_id = u.id
    WHERE 1=1`;
  const params = [];
  let paramIndex = 1;

  if (grade_level) {
    query += ` AND s.grade_level = $${paramIndex++}`;
    params.push(grade_level);
  }
  if (teacher_id) {
    query += ` AND s.teacher_id = $${paramIndex++}`;
    params.push(teacher_id);
  }

  const countQuery = query.replace("SELECT s.*, u.full_name AS teacher_name", "SELECT COUNT(*)");
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  query += ` ORDER BY s.day, s.start_time LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return { schedules: result.rows, total };
};

export const getScheduleById = async (id) => {
  const result = await pool.query(
    `SELECT s.*, u.full_name AS teacher_name
     FROM schedules s
     LEFT JOIN users u ON s.teacher_id = u.id
     WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createSchedule = async ({ grade_level, subject, teacher_id, day, start_time, end_time }) => {
  const result = await pool.query(
    "INSERT INTO schedules (grade_level, subject, teacher_id, day, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [grade_level, subject, teacher_id, day, start_time, end_time]
  );
  return result.rows[0];
};

export const updateSchedule = async (id, data) => {
  const result = await pool.query(
    `UPDATE schedules SET
      grade_level = COALESCE($1, grade_level),
      subject = COALESCE($2, subject),
      teacher_id = COALESCE($3, teacher_id),
      day = COALESCE($4, day),
      start_time = COALESCE($5, start_time),
      end_time = COALESCE($6, end_time)
     WHERE id = $7 RETURNING *`,
    [data.grade_level, data.subject, data.teacher_id, data.day, data.start_time, data.end_time, id]
  );
  return result.rows[0];
};

export const deleteSchedule = async (id) => {
  const result = await pool.query("DELETE FROM schedules WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countSchedules = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM schedules");
  return parseInt(result.rows[0].count, 10);
};
