import pool from "../config/db.js";

export const getAllEvents = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM events");
  const total = parseInt(countResult.rows[0].count, 10);
  const result = await pool.query(
    "SELECT * FROM events ORDER BY event_date DESC, created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return { events: result.rows, total };
};

export const getEventById = async (id) => {
  const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
  return result.rows[0];
};

export const createEvent = async ({ title, content, event_date, category, status, image_path, created_by }) => {
  const result = await pool.query(
    `INSERT INTO events (title, content, event_date, category, status, image_path, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, content, event_date, category, status || "published", image_path, created_by]
  );
  return result.rows[0];
};

export const updateEvent = async (id, fields) => {
  const { title, content, event_date, category, status, image_path } = fields;
  const result = await pool.query(
    `UPDATE events SET
       title = COALESCE($1, title),
       content = COALESCE($2, content),
       event_date = COALESCE($3, event_date),
       category = COALESCE($4, category),
       status = COALESCE($5, status),
       image_path = COALESCE($6, image_path)
     WHERE id = $7 RETURNING *`,
    [title, content, event_date, category, status, image_path, id]
  );
  return result.rows[0];
};

export const deleteEvent = async (id) => {
  const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countEvents = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM events");
  return parseInt(result.rows[0].count, 10);
};
