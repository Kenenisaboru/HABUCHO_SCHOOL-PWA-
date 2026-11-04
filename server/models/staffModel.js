import pool from "../config/db.js";

export const getAllStaffProfiles = async () => {
  const result = await pool.query("SELECT * FROM staff_profiles ORDER BY display_order, id");
  return result.rows;
};

export const getStaffProfileById = async (id) => {
  const result = await pool.query("SELECT * FROM staff_profiles WHERE id = $1", [id]);
  return result.rows[0];
};

export const createStaffProfile = async ({ name, title, department, bio, photo_path, display_order, created_by }) => {
  const result = await pool.query(
    `INSERT INTO staff_profiles (name, title, department, bio, photo_path, display_order, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, title, department, bio, photo_path, display_order || 0, created_by]
  );
  return result.rows[0];
};

export const updateStaffProfile = async (id, fields) => {
  const { name, title, department, bio, photo_path, display_order, is_active } = fields;
  const result = await pool.query(
    `UPDATE staff_profiles SET
       name = COALESCE($1, name),
       title = COALESCE($2, title),
       department = COALESCE($3, department),
       bio = COALESCE($4, bio),
       photo_path = COALESCE($5, photo_path),
       display_order = COALESCE($6, display_order),
       is_active = COALESCE($7, is_active)
     WHERE id = $8 RETURNING *`,
    [name, title, department, bio, photo_path, display_order, is_active, id]
  );
  return result.rows[0];
};

export const deleteStaffProfile = async (id) => {
  const result = await pool.query("SELECT photo_path FROM staff_profiles WHERE id = $1", [id]);
  if (result.rows[0]) {
    const { photo_path } = result.rows[0];
    await pool.query("DELETE FROM staff_profiles WHERE id = $1 RETURNING id", [id]);
    return { id, photo_path };
  }
  return null;
};

export const countStaffProfiles = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM staff_profiles");
  return parseInt(result.rows[0].count, 10);
};
