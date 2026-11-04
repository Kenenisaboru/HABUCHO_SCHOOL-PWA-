import api from "./api";

/**
 * Fetch public landing page statistics.
 * This endpoint is accessible without authentication.
 * @returns {Promise} Axios response promise
 */
export const getPublicStats = () => api.get("/public/stats");

/**
 * Fetch active academic programs for the public Academics page.
 * @returns {Promise} Axios response promise
 */
export const getAcademicPrograms = () => api.get("/public/programs");

/**
 * Fetch gallery images for the public Gallery page.
 * @returns {Promise} Axios response promise
 */
export const getGalleryImages = () => api.get("/public/gallery");

/**
 * Fetch published events for the public Announcements/News page.
 * @returns {Promise} Axios response promise
 */
export const getPublicEvents = () => api.get("/public/events");

/**
 * Submit an admission application with multipart form data.
 * @param {FormData} formData - Form data including applicant fields and uploaded documents
 * @returns {Promise} Axios response promise
 */
export const submitAdmission = (formData) =>
  api.post("/public/admissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Look up the status of an admission application by reference number.
 * @param {string} referenceNumber - The application reference number
 * @returns {Promise} Axios response promise
 */
export const checkAdmissionStatus = (referenceNumber) =>
  api.get(`/public/admissions/status/${referenceNumber}`);
