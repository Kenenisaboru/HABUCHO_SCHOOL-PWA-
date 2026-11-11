import api from "./api";

export const getEvents = (page = 1, limit = 10) => api.get("/events", { params: { page, limit } });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (formData) =>
  api.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/${id}`);
