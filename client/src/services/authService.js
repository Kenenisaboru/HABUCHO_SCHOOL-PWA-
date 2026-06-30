/**
 * API Service Functions
 * ---------------------
 * Organized API calls grouped by resource type.
 */
import api from "./api.js";

// --- Auth ---
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/auth/profile");

// --- Users (Admin) ---
export const getUsers = (params) => api.get("/users", { params });
export const getStudents = (params) => api.get("/users/students", { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getStats = () => api.get("/users/stats");

// --- Announcements ---
export const getAnnouncements = (params) => api.get("/announcements", { params });
export const createAnnouncement = (data) => api.post("/announcements", data);
export const updateAnnouncement = (id, data) => api.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`);

// --- Schedules ---
export const getSchedules = (params) => api.get("/schedules", { params });
export const createSchedule = (data) => api.post("/schedules", data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// --- Grades ---
export const getGrades = (params) => api.get("/grades", { params });
export const createGrade = (data) => api.post("/grades", data);
export const updateGrade = (id, data) => api.put(`/grades/${id}`, data);
export const deleteGrade = (id) => api.delete(`/grades/${id}`);
export const bulkUpsertGrades = (data) => api.post("/grades/bulk", data);

// --- Contact ---
export const submitContact = (data) => api.post("/contact", data);
export const getContactMessages = (params) => api.get("/contact", { params });
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);
