/**
 * Auth Routes
 * -----------
 * POST /api/auth/register — Register new user
 * POST /api/auth/login    — Login and receive JWT (httpOnly cookies)
 * POST /api/auth/logout   — Clear auth cookies
 * POST /api/auth/refresh  — Get new access token using refresh token
 * GET  /api/auth/profile  — Get current user profile (protected)
 */
import { Router } from "express";
import { register, login, logout, refreshAccessToken, getProfile, forgotPassword, resetPassword } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRegister, validateLogin } from "../middleware/validate.js";

const router = Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/logout", authenticateUser, logout);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/profile", authenticateUser, getProfile);

export default router;
