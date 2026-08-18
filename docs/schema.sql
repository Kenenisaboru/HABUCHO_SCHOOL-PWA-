-- Habucho Preparatory School — Complete Database Schema
-- This file reflects the final state after all migrations (001-010).
-- For fresh installs, run: npm run migrate

-- =============================================
-- USERS TABLE
-- Stores admin, teacher, and student accounts
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  profile_picture VARCHAR(255) DEFAULT NULL,
  student_id VARCHAR(30),
  gender VARCHAR(10),
  date_of_birth DATE,
  grade_level VARCHAR(20),
  section VARCHAR(20),
  stream VARCHAR(50),
  phone VARCHAR(20),
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  address TEXT,
  academic_year VARCHAR(30) DEFAULT '2024/2025',
  admission_date DATE DEFAULT CURRENT_DATE,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  blood_group VARCHAR(10),
  previous_school VARCHAR(150),
  remarks TEXT,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_stream ON users(stream);
CREATE INDEX IF NOT EXISTS idx_users_grade_section ON users(grade_level, section);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(password_reset_token);

-- =============================================
-- ANNOUNCEMENTS TABLE
-- School-wide announcements
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

-- =============================================
-- SCHEDULES TABLE
-- Class timetables
-- =============================================
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  grade_level VARCHAR(10) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  day VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedules_grade ON schedules(grade_level);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON schedules(teacher_id);

-- =============================================
-- GRADES TABLE
-- Student academic grades
-- =============================================
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  subject VARCHAR(100) NOT NULL,
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
  semester VARCHAR(20) NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2023/2024',
  grade_level VARCHAR(20),
  section VARCHAR(20),
  assessment_type VARCHAR(50) DEFAULT 'General',
  total_marks NUMERIC(5,2) DEFAULT 100,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_teacher ON grades(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grades_academic_year ON grades(academic_year);
CREATE INDEX IF NOT EXISTS idx_grades_assessment_type ON grades(assessment_type);

-- =============================================
-- CONTACT_MESSAGES TABLE
-- Contact form submissions
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at DESC);

-- =============================================
-- STUDENT_ATTACHMENTS TABLE
-- Uploaded files for student records
-- =============================================
CREATE TABLE IF NOT EXISTS student_attachments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attachments_student ON student_attachments(student_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- Auto-update timestamp on row changes
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
