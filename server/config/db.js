/**
 * Database Configuration
 * ----------------------
 * Creates and exports a PostgreSQL connection pool using the `pg` package.
 * The pool reuses connections for better performance under load.
 */
import "dotenv/config";
import pg from "pg";
import logger from "../utils/logger.js";

const { Pool } = pg;

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production.");
}

const isRemoteUrl =
  typeof process.env.DATABASE_URL === "string" &&
  !process.env.DATABASE_URL.includes("localhost") &&
  !process.env.DATABASE_URL.includes("127.0.0.1");

let sslConfig = false;
if (
  process.env.DATABASE_SSL === "true" ||
  (process.env.DATABASE_SSL !== "false" && (process.env.NODE_ENV === "production" || isRemoteUrl))
) {
  sslConfig = {
    rejectUnauthorized:
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true" || !!process.env.DATABASE_SSL_CA,
    ca: process.env.DATABASE_SSL_CA || undefined,
  };
}

const pool = new Pool({
  ...(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "habucho_school",
      }),
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  logger.error(`Unexpected database pool error: ${err.message}`);
});

/**
 * Test database connection on startup
 */
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default pool;
