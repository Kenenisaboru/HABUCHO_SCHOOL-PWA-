-- Migration 008: Extended student profile fields and attachments

ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS remarks TEXT;

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
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
