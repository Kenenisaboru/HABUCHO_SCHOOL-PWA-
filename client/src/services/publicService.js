import api from "./api";

/**
 * Fetch public landing page statistics.
 * This endpoint is accessible without authentication.
 * @returns {Promise} Axios response promise
 */
export const getPublicStats = () => api.get("/public/stats");
