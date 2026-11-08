import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD || process.argv[3];
const fullName = process.env.ADMIN_NAME || process.argv[4] || "System Administrator";

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.js <email> <password> [fullName]");
  console.error("Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
  process.exit(1);
}

const run = async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE
     SET full_name = EXCLUDED.full_name,
         password = EXCLUDED.password,
         role = 'admin'
     RETURNING id, full_name, email, role`,
    [fullName, email.trim().toLowerCase(), hashedPassword]
  );

  console.log("Admin account created/updated successfully:");
  console.log(`  ID:    ${result.rows[0].id}`);
  console.log(`  Name:  ${result.rows[0].full_name}`);
  console.log(`  Email: ${result.rows[0].email}`);
  console.log(`  Role:  ${result.rows[0].role}`);
};

run()
  .catch((err) => {
    console.error("Failed to create admin:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
