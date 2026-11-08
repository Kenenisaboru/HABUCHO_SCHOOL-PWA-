/**
 * Axios API Client
 * ----------------
 * Centralized HTTP client with JWT cookie-based auth and auto-refresh.
 */
import axios from "axios";

const resolveApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== "/api") {
    envUrl = envUrl.trim().replace(/\/+$/, "");
    if (!envUrl.endsWith("/api")) {
      envUrl += "/api";
    }
    return envUrl;
  }
  if (typeof window !== "undefined" && window.location.hostname.endsWith("onrender.com")) {
    return "https://habucho-school-pwa-zc34.onrender.com/api";
  }
  return "/api";
};

const API_URL = resolveApiUrl();

export const getAssetUrl = (assetPath) => {
  if (typeof assetPath !== "string" || !assetPath.startsWith("/uploads/")) return assetPath;
  const apiOrigin = API_URL.replace(/\/api\/?$/, "");
  return `${apiOrigin}${assetPath}`;
};

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
  const publicPaths = ["/", "/about", "/admissions", "/gallery", "/contact", "/login"];
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
