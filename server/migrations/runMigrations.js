/**
 * Migration Runner
 * ----------------
 * Executes SQL migration files with tracking and transaction safety.
 * Run with: npm run migrate
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool, { testConnection } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getAppliedMigrations = async (client) => {
  const { rows } = await client.query("SELECT filename FROM schema_migrations ORDER BY id");
  return new Set(rows.map((r) => r.filename));
};

export const runMigrations = async (closePoolAfter = true) => {
  await testConnection();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await ensureMigrationsTable(client);

    const applied = await getAppliedMigrations(client);

    const migrationsDir = __dirname;
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const pending = files.filter((f) => !applied.has(f));

    if (pending.length === 0) {
      console.log("✅ All migrations already applied.");
      await client.query("COMMIT");
      return;
    }

    console.log(`📦 Running ${pending.length} pending migration(s)...`);

    for (const file of pending) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
      console.log(`  ✅ ${file}`);
    }

    await client.query("COMMIT");
    console.log("✅ All migrations completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed, rolled back:", error.message);
    if (closePoolAfter) {
      process.exit(1);
    }
    throw error;
  } finally {
    client.release();
    if (closePoolAfter) {
      await pool.end();
    }
  }
};

const isMainModule =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  runMigrations(true)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
