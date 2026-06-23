/**
 * Auth Routes
 * -----------
 * POST /api/auth/register — Register new user
 * POST /api/auth/login    — Login and receive JWT
 * GET  /api/auth/profile  — Get current user profile (protected)
 */
import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRegister, validateLogin } from "../middleware/validate.js";

const router = Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/profile", authenticateUser, getProfile);

export default router;
