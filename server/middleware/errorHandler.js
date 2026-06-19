/**
 * Global Error Handler Middleware
 * --------------------------------
 * Catches all unhandled errors and returns a consistent JSON response.
 */
import { sendError } from "../utils/response.js";

export const errorHandler = (err, req, res, _next) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
