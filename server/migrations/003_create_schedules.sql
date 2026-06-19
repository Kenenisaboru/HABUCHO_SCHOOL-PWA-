-- Migration 003: Create schedules table
-- Class timetables linked to teachers and grade levels

CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  grade_level VARCHAR(10) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  day VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schedules_grade ON schedules(grade_level);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON schedules(teacher_id);
