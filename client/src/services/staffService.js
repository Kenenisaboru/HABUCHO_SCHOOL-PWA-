import api from "./api";

/**
 * Fetch all staff profiles (admin only).
 * @returns {Promise} Axios response promise
 */
export const getStaffProfiles = () => api.get("/staff");

/**
 * Fetch a single staff profile by id (admin only).
 * @param {number|string} id - The staff profile id
 * @returns {Promise} Axios response promise
 */
export const getStaffProfileById = (id) => api.get(`/staff/${id}`);

/**
 * Create a new staff profile with multipart form data (admin only).
 * @param {FormData} formData - Form data including staff fields and uploaded photo
 * @returns {Promise} Axios response promise
 */
export const createStaffProfile = (formData) =>
  api.post("/staff", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Update an existing staff profile with multipart form data (admin only).
 * @param {number|string} id - The staff profile id
 * @param {FormData} formData - Form data including staff fields and uploaded photo
 * @returns {Promise} Axios response promise
 */
export const updateStaffProfile = (id, formData) =>
  api.put(`/staff/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Delete a staff profile by id (admin only).
 * @param {number|string} id - The staff profile id
 * @returns {Promise} Axios response promise
 */
export const deleteStaffProfile = (id) => api.delete(`/staff/${id}`);
