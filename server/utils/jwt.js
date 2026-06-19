/**
 * JWT Utility Functions
 * ---------------------
 * Handles token generation and verification for authentication.
 */
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = "7d";

/**
 * Generate a JWT token containing user id, email, and role
 */
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
