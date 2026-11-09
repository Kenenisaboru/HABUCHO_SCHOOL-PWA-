/**
 * Audit Logging Service
 * ---------------------
 * Records immutable system activity for compliance, grading history,
 * and security event tracking.
 */
import pool from "../config/db.js";
import logger from "../utils/logger.js";

/**
 * Log an audit entry
 * @param {Object} options
 * @param {Object} [options.user] - req.user object ({ id, email, role })
 * @param {string} options.action - Action name (e.g., 'GRADE_UPSERT', 'ADMISSION_STATUS_UPDATE')
 * @param {string} options.entityType - Target entity type (e.g., 'grade', 'admission', 'user')
 * @param {string|number} [options.entityId] - Target entity identifier
 * @param {Object} [options.details] - Arbitrary JSON metadata (old value, new value, etc.)
 * @param {string} [options.ip] - IP address of the client
 */
export const logAuditEvent = async ({
  user = null,
  action,
  entityType,
  entityId = null,
  details = {},
  ip = null,
}) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_email, user_role, action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user?.id || null,
        user?.email || null,
        user?.role || null,
        action,
        entityType,
        entityId ? String(entityId) : null,
        JSON.stringify(details),
        ip || null,
      ]
    );
  } catch (error) {
    // Audit log failures should never crash the main transaction, but must be logged
    logger.error(`[AUDIT LOG ERROR] Failed to record audit log: ${error.message}`);
  }
};

