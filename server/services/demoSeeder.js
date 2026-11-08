import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const DEMO_PASSWORD = "Password123!";

export const seedDemoData = async (pool) => {
  try {
    // Check if demo teacher already exists to prevent duplicate seeding
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", ["teacher@habucho.edu"]);
    if (existing.rows.length > 0) {
      return;
    }

    logger.info("Seeding demo data (teachers, students, schedules, announcements, grades)...");
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    // 1. Demo Admin
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ('Demo Administrator', 'admin@habucho.edu', $1, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [hashedPassword]
    );

    // 2. Demo Teachers
    const t1 = await pool.query(
      `INSERT INTO users (full_name, email, password, role, phone)
       VALUES ('Sarah Johnson', 'teacher@habucho.edu', $1, 'teacher', '+251 91 123 4567')
       ON CONFLICT (email) DO UPDATE SET role = 'teacher'
       RETURNING id`,
      [hashedPassword]
    );

    const t2 = await pool.query(
      `INSERT INTO users (full_name, email, password, role, phone)
       VALUES ('Michael Chen', 'teacher2@habucho.edu', $1, 'teacher', '+251 92 234 5678')
       ON CONFLICT (email) DO UPDATE SET role = 'teacher'
       RETURNING id`,
      [hashedPassword]
    );

    const teacher1Id = t1.rows[0]?.id;
    const teacher2Id = t2.rows[0]?.id;

    // 3. Demo Students
    const s1 = await pool.query(
      `INSERT INTO users (
        full_name, email, password, role, student_id, gender, grade_level, section, stream,
        date_of_birth, parent_name, parent_phone, address, academic_year, blood_group
      ) VALUES (
        'Emily Davis', 'student@habucho.edu', $1, 'student', 'HPS-2024-001', 'Female', '11', 'A', 'Natural Science',
        '2008-05-14', 'Robert Davis', '+251 93 345 6789', 'Addis Ababa, Bole', '2024/2025', 'O+'
      ) ON CONFLICT (email) DO UPDATE SET role = 'student'
      RETURNING id`,
      [hashedPassword]
    );

    const s2 = await pool.query(
      `INSERT INTO users (
        full_name, email, password, role, student_id, gender, grade_level, section, stream,
        date_of_birth, parent_name, parent_phone, address, academic_year, blood_group
      ) VALUES (
        'James Wilson', 'student2@habucho.edu', $1, 'student', 'HPS-2024-002', 'Male', '11', 'A', 'Natural Science',
        '2008-08-22', 'Thomas Wilson', '+251 94 456 7890', 'Addis Ababa, Kirkos', '2024/2025', 'A+'
      ) ON CONFLICT (email) DO UPDATE SET role = 'student'
      RETURNING id`,
      [hashedPassword]
    );

    const s3 = await pool.query(
      `INSERT INTO users (
        full_name, email, password, role, student_id, gender, grade_level, section, stream,
        date_of_birth, parent_name, parent_phone, address, academic_year, blood_group
      ) VALUES (
        'Aisha Mohammed', 'student3@habucho.edu', $1, 'student', 'HPS-2024-003', 'Female', '12', 'B', 'Social Science',
        '2007-11-03', 'Mohammed Ali', '+251 95 567 8901', 'Addis Ababa, Yeka', '2024/2025', 'B+'
      ) ON CONFLICT (email) DO UPDATE SET role = 'student'
      RETURNING id`,
      [hashedPassword]
    );

    const student1Id = s1.rows[0]?.id;
    const student2Id = s2.rows[0]?.id;
    const student3Id = s3.rows[0]?.id;

    // 4. Demo Announcements
    await pool.query(
      `INSERT INTO announcements (title, content, created_by) VALUES
       ('Welcome to New Academic Year 2025/2026', 'Habucho Preparatory School warmly welcomes all students, parents, and teachers to an exciting new academic year filled with discovery and achievement.', $1),
       ('Parent-Teacher Conference Scheduled', 'The first semester parent-teacher meeting will take place this Saturday from 9:00 AM to 1:00 PM.', $1),
       ('Annual Science Fair Registration', 'All Grade 11 and 12 Natural Science students are invited to register for the science fair. Submit project proposals to Mr. Chen by end of this month.', $2),
       ('Extended Library Study Hours', 'The school library and computer lab will remain open until 6:00 PM Monday through Friday for study sessions.', $1)`,
      [teacher1Id, teacher2Id]
    );

    // 5. Demo Schedules
    await pool.query(
      `INSERT INTO schedules (grade_level, subject, teacher_id, day, start_time, end_time) VALUES
       ('11', 'Mathematics', $1, 'Monday', '08:30:00', '10:00:00'),
       ('11', 'Physics', $2, 'Monday', '10:15:00', '11:45:00'),
       ('11', 'Chemistry', $2, 'Tuesday', '08:30:00', '10:00:00'),
       ('11', 'English', $1, 'Wednesday', '08:30:00', '10:00:00'),
       ('12', 'Mathematics', $1, 'Thursday', '08:30:00', '10:00:00'),
       ('12', 'Physics', $2, 'Friday', '08:30:00', '10:00:00')`,
      [teacher1Id, teacher2Id]
    );

    // 6. Demo Grades
    await pool.query(
      `INSERT INTO grades (student_id, teacher_id, subject, score, semester, academic_year, grade_level, section, assessment_type, total_marks, comments) VALUES
       ($1, $4, 'Mathematics', 92.50, 'Semester 1', '2024/2025', '11', 'A', 'Final Exam', 100, 'Excellent analytical skills and participation.'),
       ($1, $5, 'Physics', 88.00, 'Semester 1', '2024/2025', '11', 'A', 'Final Exam', 100, 'Great lab performance and problem solving.'),
       ($1, $4, 'English', 94.00, 'Semester 1', '2024/2025', '11', 'A', 'Midterm', 100, 'Outstanding essay and comprehension.'),
       ($2, $4, 'Mathematics', 78.00, 'Semester 1', '2024/2025', '11', 'A', 'Final Exam', 100, 'Good progress; needs practice on calculus.'),
       ($2, $5, 'Physics', 82.50, 'Semester 1', '2024/2025', '11', 'A', 'Final Exam', 100, 'Solid understanding of fundamental mechanics.'),
       ($3, $4, 'Mathematics', 91.00, 'Semester 1', '2024/2025', '12', 'B', 'Final Exam', 100, 'Strong performance across all topics.')`,
      [student1Id, student2Id, student3Id, teacher1Id, teacher2Id]
    );

    logger.info("Demo data seeded successfully (Admin, Teachers, Students, Announcements, Schedules, Grades).");
  } catch (error) {
    logger.error(`Error seeding demo data: ${error.message}`);
  }
};
