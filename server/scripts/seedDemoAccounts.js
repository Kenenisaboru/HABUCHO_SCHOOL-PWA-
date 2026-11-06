import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const demoAccounts = [
  { fullName: "Admin User", email: "admin@habucho.edu", role: "admin" },
  { fullName: "Sarah Johnson", email: "teacher@habucho.edu", role: "teacher" },
  { fullName: "Emily Davis", email: "student@habucho.edu", role: "student" },
];
const demoPassword = "Password123!";

const seedDemoAccounts = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo accounts cannot be seeded in production.");
  }

  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  for (const account of demoAccounts) {
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET full_name = EXCLUDED.full_name,
           password = EXCLUDED.password,
           role = EXCLUDED.role`,
      [account.fullName, account.email, hashedPassword, account.role]
    );
  }

  console.log("Demo accounts are ready (password: Password123!).");
  for (const account of demoAccounts) {
    console.log(`  ${account.role}: ${account.email}`);
  }
};

seedDemoAccounts()
  .catch((error) => {
    console.error("Could not seed demo accounts:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
