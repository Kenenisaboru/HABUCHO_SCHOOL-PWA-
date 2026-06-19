/**
 * Server Entry Point
 * --------------------
 * Starts the Express server and tests the database connection.
 */
import app from "./app.js";
import { testConnection } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`\n🚀 Habucho School API running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });
};

startServer();
