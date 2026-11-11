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
export const updateProfile = (data) => api.put("/auth/profile", data);
export const uploadAvatar = (formData) =>
  api.post("/auth/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const changePassword = (data) => api.post("/auth/change-password", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

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
export const sendScoresToStudents = (data) => api.post("/grades/send-to-students", data);

// --- Contact ---
export const submitContact = (data) => api.post("/contact", data);
export const getContactMessages = (params) => api.get("/contact", { params });
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);

// --- Audit Logs (Admin) ---
export const getAuditLogs = (params) => api.get("/audit-logs", { params });

// --- Grade Submission & Approval Workflow ---
export const submitGradesForApproval = (data) => api.post("/grades/submit", data);
export const getPendingGradeSubmissions = () => api.get("/grades/pending-submissions");
export const approveGradesBatch = (data) => api.post("/grades/approve-batch", data);
export const rejectGradesBatch = (data) => api.post("/grades/reject-batch", data);

// --- Ethiopian Curriculum & Subject Management ---
export const getSubjects = (params) => api.get("/subjects", { params });
export const getCurriculumStructure = (params) => api.get("/subjects/curriculum", { params });
export const createSubject = (data) => api.post("/subjects", data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const getTeacherAssignments = (params) => api.get("/subjects/assignments", { params });
export const assignTeacherToSubject = (data) => api.post("/subjects/assignments", data);
export const removeTeacherAssignment = (id) => api.delete(`/subjects/assignments/${id}`);

// --- Academic Analytics & Numerical Ranking Engine ---
export const recalculateRankings = (data) => api.post("/academic/recalculate-rankings", data);
export const getTopScorersByClass = (params) => api.get("/academic/top-scorers/class", { params });
export const getTopScorersByGrade = (params) => api.get("/academic/top-scorers/grade", { params });
export const getTopScorersSchoolWide = (params) =>
  api.get("/academic/top-scorers/school", { params });
export const getTopScorersBySubject = (params) =>
  api.get("/academic/top-scorers/subject", { params });
export const getSchoolAnalytics = (params) => api.get("/academic/analytics", { params });
export const getStudentAcademicSummary = (studentId, params) =>
  api.get(`/academic/student/${studentId}/summary`, { params });
export const getStudentAcademicHistory = (studentId) =>
  api.get(`/academic/student/${studentId}/history`);
