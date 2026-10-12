/**
 * Axios API Client
 * ----------------
 * Centralized HTTP client with JWT cookie-based auth and auto-refresh.
 */
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const isPublicRoute = () => {
  const publicPaths = ["/", "/about", "/announcements", "/schedule", "/contact", "/login"];
  return publicPaths.includes(window.location.pathname);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const hasStoredUser = !!localStorage.getItem("user");

      // If already a refresh failure or guest user never had a session, do not attempt refresh
      if (originalRequest.url?.includes("/auth/refresh") || !hasStoredUser) {
        localStorage.removeItem("user");
        if (!isPublicRoute()) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("user");
        if (!isPublicRoute()) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
