/**
 * Database Configuration
 * ----------------------
 * Creates and exports a PostgreSQL connection pool using the `pg` package.
 * The pool reuses connections for better performance under load.
 */
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Connection pool — reads DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
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
