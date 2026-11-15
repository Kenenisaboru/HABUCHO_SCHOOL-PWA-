/**
 * Backup Controller — Database Snapshot & Disaster Recovery
 * ---------------------------------------------------------
 * Allows administrators to monitor database health, export full data snapshots,
 * and download timestamped JSON backups to prevent data loss.
 */
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

const TABLES_TO_BACKUP = [
  "academic_years",
  "subjects",
  "subject_teacher_assignments",
  "examinations",
  "users",
  "grades",
  "student_academic_summaries",
  "schedules",
  "announcements",
  "admissions",
  "admission_documents",
  "events",
  "gallery",
  "messages",
  "audit_logs",
];

/**
 * GET /api/backup/stats
 * Get table row counts and database size
 */
export const getDatabaseStats = async (req, res, next) => {
  try {
    const stats = [];
    for (const table of TABLES_TO_BACKUP) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        stats.push({
          table,
          count: parseInt(countRes.rows[0].count, 10),
        });
      } catch {
        // Table might not exist yet
      }
    }

    // Database size query
    let dbSize = "Unknown";
    try {
      const sizeRes = await pool.query("SELECT pg_size_pretty(pg_database_size(current_database())) as size");
      dbSize = sizeRes.rows[0]?.size || "Unknown";
    } catch {
      // Fallback
    }

    return sendSuccess(res, {
      database_name: process.env.PGDATABASE || "habucho_school",
      database_size: dbSize,
      tables: stats,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/backup/download
 * Download a full structured database backup snapshot file (.json)
 */
export const downloadDatabaseBackup = async (req, res, next) => {
  try {
    const backupData = {
      system: "Habucho Preparatory School Management System",
      version: "2.0.0",
      academic_year_active: "2017 E.C.",
      exported_at: new Date().toISOString(),
      exported_by: req.user?.email || "admin",
      data: {},
    };

    for (const table of TABLES_TO_BACKUP) {
      try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        backupData.data[table] = result.rows;
      } catch (err) {
        logger.warn(`Could not export table ${table}: ${err.message}`);
        backupData.data[table] = [];
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `habucho_school_backup_${timestamp}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    next(error);
  }
};
