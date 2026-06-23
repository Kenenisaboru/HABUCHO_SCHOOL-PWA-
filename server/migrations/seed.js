/**
 * Database Seed Script
 * --------------------
 * Inserts sample admin, teacher, and student accounts plus demo data.
 * Default password for all accounts: Password123!
 * Run with: npm run seed
 */
import bcrypt from "bcryptjs";
import pool, { testConnection } from "../config/db.js";

const DEFAULT_PASSWORD = "Password123!";

const seed = async () => {
  await testConnection();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  console.log("\n🌱 Seeding database...\n");

  // Clear existing data (order matters due to foreign keys)
  await pool.query("DELETE FROM grades");
  await pool.query("DELETE FROM schedules");
  await pool.query("DELETE FROM announcements");
  await pool.query("DELETE FROM contact_messages");
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

  // --- Users ---
  const usersResult = await pool.query(
    `INSERT INTO users (full_name, email, password, role) VALUES
      ('Admin User', 'admin@habucho.edu', $1, 'admin'),
      ('Sarah Johnson', 'teacher@habucho.edu', $1, 'teacher'),
      ('Michael Chen', 'teacher2@habucho.edu', $1, 'teacher'),
      ('Emily Davis', 'student@habucho.edu', $1, 'student'),
      ('James Wilson', 'student2@habucho.edu', $1, 'student'),
      ('Aisha Mohammed', 'student3@habucho.edu', $1, 'student')
    RETURNING id, full_name, role`,
    [hashedPassword]
  );

  const admin = usersResult.rows.find((u) => u.role === "admin");
  const teacher1 = usersResult.rows.find((u) => u.full_name === "Sarah Johnson");
  const teacher2 = usersResult.rows.find((u) => u.full_name === "Michael Chen");
  const students = usersResult.rows.filter((u) => u.role === "student");

  console.log("  ✅ Users seeded (6 accounts)");

  // --- Announcements ---
  await pool.query(
    `INSERT INTO announcements (title, content, created_by) VALUES
      ('Welcome to New Academic Year', 'We warmly welcome all students and staff to the 2025/2026 academic year. Let us strive for excellence together!', $1),
      ('Parent-Teacher Meeting', 'Parent-teacher meetings will be held on July 15, 2025. All parents are encouraged to attend.', $2),
      ('Science Fair Registration', 'Registration for the annual science fair is now open. Submit your projects by August 1.', $2),
      ('Library Hours Extended', 'The school library will now be open until 6 PM on weekdays for student research.', $1)`,
    [admin.id, teacher1.id]
  );
  console.log("  ✅ Announcements seeded");

  // --- Schedules ---
  await pool.query(
    `INSERT INTO schedules (grade_level, subject, teacher_id, day, start_time, end_time) VALUES
      ('11', 'Mathematics', $1, 'Monday', '08:00', '09:30'),
      ('11', 'Physics', $2, 'Monday', '09:45', '11:15'),
      ('11', 'English', $1, 'Tuesday', '08:00', '09:30'),
      ('11', 'Chemistry', $2, 'Wednesday', '08:00', '09:30'),
      ('12', 'Mathematics', $1, 'Thursday', '08:00', '09:30'),
      ('12', 'Biology', $2, 'Friday', '08:00', '09:30'),
      ('12', 'History', $1, 'Friday', '09:45', '11:15')`,
    [teacher1.id, teacher2.id]
  );
  console.log("  ✅ Schedules seeded");

  // --- Grades ---
  await pool.query(
    `INSERT INTO grades (student_id, teacher_id, subject, score, semester) VALUES
      ($1, $4, 'Mathematics', 88.50, 'Semester 1'),
      ($1, $4, 'English', 92.00, 'Semester 1'),
      ($1, $5, 'Physics', 85.75, 'Semester 1'),
      ($2, $4, 'Mathematics', 76.00, 'Semester 1'),
      ($2, $5, 'Chemistry', 81.25, 'Semester 1'),
      ($3, $4, 'Mathematics', 94.50, 'Semester 1'),
      ($3, $5, 'Biology', 89.00, 'Semester 1')`,
    [students[0].id, students[1].id, students[2].id, teacher1.id, teacher2.id]
  );
  console.log("  ✅ Grades seeded");

  // --- Contact Messages ---
  await pool.query(
    `INSERT INTO contact_messages (name, email, message) VALUES
      ('John Parent', 'john.parent@email.com', 'I would like to inquire about admission for Grade 11.'),
      ('Mary Guardian', 'mary.g@email.com', 'Thank you for the excellent education my child receives.')`
  );
  console.log("  ✅ Contact messages seeded");

  console.log("\n📋 Sample Accounts (password: Password123!):");
  console.log("   Admin:   admin@habucho.edu");
  console.log("   Teacher: teacher@habucho.edu");
  console.log("   Student: student@habucho.edu\n");

  await pool.end();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
