/**
 * Server Entry Point
 * --------------------
 * Starts the Express server and tests the database connection.
 */
import "dotenv/config";
import app from "./app.js";
import { testConnection, default as pool } from "./config/db.js";
import logger from "./utils/logger.js";
import { runMigrations } from "./migrations/runMigrations.js";
import { migrateLegacyAdmissionDocuments } from "./services/admissionDocumentStorage.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await testConnection();
  await runMigrations(false);
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
