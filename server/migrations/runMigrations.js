/**
 * Migration Runner
 * ----------------
 * Executes all SQL migration files in order to set up the database schema.
 * Run with: npm run migrate
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool, { testConnection } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  await testConnection();

  const migrationsDir = __dirname;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`\n📦 Running ${files.length} migration(s)...\n`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");
    try {
      await pool.query(sql);
      console.log(`  ✅ ${file}`);
    } catch (error) {
      console.error(`  ❌ ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log("\n✅ All migrations completed successfully.\n");
  await pool.end();
};

runMigrations();
