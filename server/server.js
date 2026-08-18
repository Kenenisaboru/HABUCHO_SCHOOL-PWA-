/**
 * Server Entry Point
 * --------------------
 * Starts the Express server and tests the database connection.
 */
import app from "./app.js";
import { testConnection, default as pool } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Habucho School API running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      console.log("Database pool closed.");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
