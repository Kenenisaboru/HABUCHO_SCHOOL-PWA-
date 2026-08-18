/**
 * Global Error Handler Middleware
 * --------------------------------
 * Catches all unhandled errors and returns a consistent JSON response.
 */
import { sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl}: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
