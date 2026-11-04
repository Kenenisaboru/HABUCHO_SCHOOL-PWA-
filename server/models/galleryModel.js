/**
 * Gallery Image Model
 * --------------------
 * Database queries for school photo gallery images.
 */
import pool from "../config/db.js";

export const getAllGalleryImages = async () => {
  const result = await pool.query("SELECT * FROM gallery_images ORDER BY display_order, id");
  return result.rows;
};

export const createGalleryImage = async ({ title, caption, image_path, display_order, created_by }) => {
  const result = await pool.query(
    `INSERT INTO gallery_images (title, caption, image_path, display_order, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, caption, image_path, display_order || 0, created_by]
  );
  return result.rows[0];
};

export const deleteGalleryImage = async (id) => {
  const result = await pool.query("SELECT image_path FROM gallery_images WHERE id = $1", [id]);
  if (result.rows[0]) {
    const { image_path } = result.rows[0];
    await pool.query("DELETE FROM gallery_images WHERE id = $1 RETURNING id", [id]);
    return { id, image_path };
  }
  return null;
};

export const countGalleryImages = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM gallery_images");
  return parseInt(result.rows[0].count, 10);
};
