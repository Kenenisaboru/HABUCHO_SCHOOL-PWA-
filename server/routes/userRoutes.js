/**
 * User Routes (Admin only)
 * ------------------------
 * Full CRUD for user management + dashboard statistics.
 */
import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStats,
  getStudents,
} from "../controllers/userController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { validateCreateUser } from "../middleware/validate.js";

const router = Router();

// Students list — admin and teacher (must be before admin-only middleware)
router.get("/students", authenticateUser, authorizeRoles("admin", "teacher"), getStudents);

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/stats", getStats);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validateCreateUser, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
