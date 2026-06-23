/**
 * Contact Routes
 * --------------
 * POST / — Anyone can submit (authenticated students)
 * GET  / — Admin views messages
 */
import { Router } from "express";
import {
  submitMessage,
  getMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimiter.js";
import { validateContact } from "../middleware/validate.js";

const router = Router();

router.post("/", authenticateUser, contactLimiter, validateContact, submitMessage);
router.get("/", authenticateUser, authorizeRoles("admin"), getMessages);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteMessage);

export default router;
