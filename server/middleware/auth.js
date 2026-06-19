/**
 * Authentication Middleware
 * -------------------------
 * Verifies JWT from Authorization header and attaches user to request.
 */
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

/**
 * authenticateUser — Validates Bearer token and sets req.user
 */
export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return sendError(res, "Access denied. Invalid or expired token.", 401);
  }
};

/**
 * authorizeRoles — Restricts access to specific user roles
 * Usage: authorizeRoles("admin") or authorizeRoles("admin", "teacher")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, "Access denied", 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "Access denied", 403);
    }

    next();
  };
};
