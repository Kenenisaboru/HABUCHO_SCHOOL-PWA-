/**
 * Admission Application Model
 * ----------------------------
 * Database queries for online admission applications.
 */
import pool from "../config/db.js";

export const getAllApplications = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM admission_applications");
  const total = parseInt(countResult.rows[0].count, 10);
  const result = await pool.query(
    "SELECT * FROM admission_applications ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return { applications: result.rows, total };
};

export const getApplicationById = async (id) => {
  const result = await pool.query("SELECT * FROM admission_applications WHERE id = $1", [id]);
  return result.rows[0];
};

export const getByReferenceNumber = async (referenceNumber) => {
  const result = await pool.query(
    "SELECT * FROM admission_applications WHERE reference_number = $1",
    [referenceNumber]
  );
  return result.rows[0];
};

export const createApplication = async (data) => {
  const result = await pool.query(
    `INSERT INTO admission_applications
     (reference_number, applicant_name, email, phone, date_of_birth, gender,
      grade_level, parent_name, parent_phone, address, previous_school, message,
      document_paths, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending')
     RETURNING *`,
    [
      data.reference_number, data.applicant_name, data.email, data.phone,
      data.date_of_birth, data.gender, data.grade_level, data.parent_name,
      data.parent_phone, data.address, data.previous_school, data.message,
      data.document_paths || [],
    ]
  );
  return result.rows[0];
};

export const updateStatus = async (id, { status, reviewed_by, reviewed_at }) => {
  const result = await pool.query(
    `UPDATE admission_applications SET
       status = $1, reviewed_by = $2, reviewed_at = $3
     WHERE id = $4 RETURNING *`,
    [status, reviewed_by, reviewed_at, id]
  );
  return result.rows[0];
};
