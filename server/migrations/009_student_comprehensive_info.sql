-- Migration 009: Comprehensive student information fields
-- Stores complete student registration, academic stream, guardian contacts, and demographics

ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS section VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS stream VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS academic_year VARCHAR(30) DEFAULT '2024/2025';
ALTER TABLE users ADD COLUMN IF NOT EXISTS admission_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS previous_school VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS remarks TEXT;

CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_stream ON users(stream);
CREATE INDEX IF NOT EXISTS idx_users_grade_section ON users(grade_level, section);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
