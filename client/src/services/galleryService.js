import api from "./api";

/**
 * Fetch all gallery images (admin).
 * @returns {Promise} Axios response promise
 */
export const getGalleryImages = () => api.get("/gallery");

/**
 * Create a new gallery image (admin) with multipart form data.
 * @param {FormData} formData - Form data including title, caption, and image file
 * @returns {Promise} Axios response promise
 */
export const createGalleryImage = (formData) =>
  api.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Delete a gallery image by ID (admin).
 * @param {number|string} id - The gallery image ID
 * @returns {Promise} Axios response promise
 */
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);
