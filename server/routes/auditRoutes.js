/**
 * Audit Log Routes
 * ----------------
 * Secured administrative route for compliance & grade-change audits.
 */
import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles("admin"));

router.get("/", getAuditLogs);

export default router;

