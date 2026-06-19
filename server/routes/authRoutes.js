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

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateUser, getProfile);

export default router;
