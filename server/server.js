/**
 * Server Entry Point
 * --------------------
 * Starts the Express server and tests the database connection.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import app from "./app.js";
import { testConnection, default as pool } from "./config/db.js";
import logger from "./utils/logger.js";
import { runMigrations } from "./migrations/runMigrations.js";
import { migrateLegacyAdmissionDocuments } from "./services/admissionDocumentStorage.js";

const PORT = Number(process.env.PORT) || 5000;

const ensureAdminAccount = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "System Administrator";

  if (!adminEmail || !adminPassword) return;

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE
       SET full_name = EXCLUDED.full_name,
           password = EXCLUDED.password,
           role = 'admin'`,
      [adminName, adminEmail.trim().toLowerCase(), hashedPassword]
    );
    logger.info(`Admin account verified/created for ${adminEmail}`);
  } catch (error) {
    logger.error(`Failed to initialize admin account: ${error.message}`);
  }
};

const startServer = async () => {
  await testConnection();
  await runMigrations(false);
  await ensureAdminAccount();
  await migrateLegacyAdmissionDocuments();

  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Habucho School API listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      logger.info("Database pool closed.");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
