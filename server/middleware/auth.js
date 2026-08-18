/**
 * Authentication Middleware
 * -------------------------
 * Verifies JWT from Authorization header or httpOnly cookie.
 */
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

/**
 * authenticateUser — Validates Bearer token (header or cookie) and sets req.user
 */
export const authenticateUser = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, "Access denied. No token provided.", 401);
    }

    const decoded = verifyToken(token);

    if (decoded.type === "refresh") {
      return sendError(res, "Access denied. Refresh tokens cannot be used for API access.", 401);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
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
