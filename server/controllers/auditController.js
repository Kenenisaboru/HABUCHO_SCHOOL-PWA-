/**
 * Audit Logs Controller
 * --------------------
 * Read-only access for administrators to review sensitive system activity
 * (grade modifications, admission reviews, role updates, etc.)
 */
import pool from "../config/db.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query.page, req.query.limit || 20);
    const { action, entity_type, user_id } = req.query;

    const conditions = [];
    const values = [];

    if (action) {
      values.push(action);
      conditions.push(`action = $${values.length}`);
    }

    if (entity_type) {
      values.push(entity_type);
      conditions.push(`entity_type = $${values.length}`);
    }

    if (user_id) {
      values.push(parseInt(user_id, 10));
      conditions.push(`user_id = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `SELECT COUNT(*) FROM audit_logs ${whereClause}`;
    const countRes = await pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].count, 10);

    const dataQuery = `
      SELECT id, user_id, user_email, user_role, action, entity_type, entity_id, details, ip_address, created_at
      FROM audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const { rows } = await pool.query(dataQuery, [...values, limit, offset]);

    return sendSuccess(res, {
      logs: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // If audit_logs table has not been migrated yet, handle gracefully
    if (error.code === "42P01") {
      return sendSuccess(res, {
        logs: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });
    }
    next(error);
  }
};

