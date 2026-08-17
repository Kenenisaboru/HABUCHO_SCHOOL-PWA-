/**
 * User Model
 * ----------
 * Database queries for user CRUD operations with comprehensive student records.
 */
import pool from "../config/db.js";

const USER_FIELDS = `
  id, full_name, email, role, profile_picture,
  student_id, gender, date_of_birth, grade_level, section, stream,
  phone, parent_name, parent_phone, address,
  academic_year, admission_date, emergency_contact_name, emergency_contact_phone,
  blood_group, previous_school, remarks,
  created_at, updated_at
`;

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT ${USER_FIELDS} FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createUser = async ({
  full_name,
  email,
  password,
  role,
  student_id,
  gender,
  date_of_birth,
  grade_level,
  section,
  stream,
  phone,
  parent_name,
  parent_phone,
  address,
  academic_year,
  admission_date,
  emergency_contact_name,
  emergency_contact_phone,
  blood_group,
  previous_school,
  remarks,
}) => {
  const result = await pool.query(
    `INSERT INTO users (
      full_name, email, password, role,
      student_id, gender, date_of_birth, grade_level, section, stream,
      phone, parent_name, parent_phone, address,
      academic_year, admission_date, emergency_contact_name, emergency_contact_phone,
      blood_group, previous_school, remarks
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18,
      $19, $20, $21
    ) RETURNING ${USER_FIELDS}`,
    [
      full_name,
      email,
      password,
      role,
      student_id || null,
      gender || null,
      date_of_birth || null,
      grade_level || null,
      section || null,
      stream || null,
      phone || null,
      parent_name || null,
      parent_phone || null,
      address || null,
      academic_year || "2024/2025",
      admission_date || null,
      emergency_contact_name || null,
      emergency_contact_phone || null,
      blood_group || null,
      previous_school || null,
      remarks || null,
    ]
  );
  return result.rows[0];
};

export const getAllUsers = async ({ search, role, grade_level, section, stream, limit, offset }) => {
  let baseQuery = " FROM users WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (search) {
    baseQuery += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR student_id ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (role) {
    baseQuery += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (grade_level) {
    baseQuery += ` AND grade_level = $${paramIndex}`;
    params.push(grade_level);
    paramIndex++;
  }

  if (section) {
    baseQuery += ` AND section = $${paramIndex}`;
    params.push(section);
    paramIndex++;
  }

  if (stream) {
    baseQuery += ` AND stream = $${paramIndex}`;
    params.push(stream);
    paramIndex++;
  }

  // Count total for pagination
  const countResult = await pool.query("SELECT COUNT(*)" + baseQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  const query = `SELECT ${USER_FIELDS}` + baseQuery + ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return { users: result.rows, total };
};

export const updateUser = async (id, updateData) => {
  const allowedFields = [
    "full_name", "email", "role", "password", "profile_picture",
    "student_id", "gender", "date_of_birth", "grade_level", "section", "stream",
    "phone", "parent_name", "parent_phone", "address",
    "academic_year", "admission_date", "emergency_contact_name", "emergency_contact_phone",
    "blood_group", "previous_school", "remarks",
  ];

  const fields = [];
  const params = [];
  let paramIndex = 1;

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = $${paramIndex++}`);
      params.push(updateData[key]);
    }
  }

  if (fields.length === 0) return null;

  params.push(id);
  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING ${USER_FIELDS}`,
    params
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countUsersByRole = async (role) => {
  const result = await pool.query("SELECT COUNT(*) FROM users WHERE role = $1", [role]);
  return parseInt(result.rows[0].count, 10);
};
