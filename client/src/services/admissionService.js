import api from "./api";

export const getAdmissions = (page = 1, limit = 10) =>
  api.get("/admissions", { params: { page, limit } });
export const getAdmissionById = (id) => api.get(`/admissions/${id}`);
export const updateAdmissionStatus = (id, status) =>
  api.put(`/admissions/${id}/status`, { status });
