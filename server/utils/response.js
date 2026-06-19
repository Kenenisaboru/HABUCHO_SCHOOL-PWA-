/**
 * Response Helper Utilities
 * -------------------------
 * Standardized JSON response format across all API endpoints.
 */

/** Send a successful response */
export const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

/** Send an error response */
export const sendError = (res, message = "Error", statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

/** Pagination helper — calculates offset from page and limit */
export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const offset = (parsedPage - 1) * parsedLimit;
  return { page: parsedPage, limit: parsedLimit, offset };
};
