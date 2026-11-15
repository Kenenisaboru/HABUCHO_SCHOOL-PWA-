import { Router } from "express";
import { getDatabaseStats, downloadDatabaseBackup } from "../controllers/backupController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles("admin"));

router.get("/stats", getDatabaseStats);
router.get("/download", downloadDatabaseBackup);

export default router;
