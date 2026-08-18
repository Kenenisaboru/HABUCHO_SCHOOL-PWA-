/**
 * Database Configuration
 * ----------------------
 * Creates and exports a PostgreSQL connection pool using the `pg` package.
 * The pool reuses connections for better performance under load.
 */
import pg from "pg";

const { Pool } = pg;

const sslConfig =
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true, ca: process.env.DATABASE_SSL_CA || undefined }
    : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
});

/**
 * Test database connection on startup
 */
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export default pool;
