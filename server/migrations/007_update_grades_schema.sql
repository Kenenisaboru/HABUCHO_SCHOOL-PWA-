-- 007_update_grades_schema.sql

-- 1. Add fields to `users` for student classification
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS section VARCHAR(20);

-- 2. Add fields to `grades` for detailed score management
ALTER TABLE grades ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2023/2024';
ALTER TABLE grades ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);
ALTER TABLE grades ADD COLUMN IF NOT EXISTS section VARCHAR(20);
ALTER TABLE grades ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50) DEFAULT 'General';
ALTER TABLE grades ADD COLUMN IF NOT EXISTS total_marks NUMERIC(5,2) DEFAULT 100;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS comments TEXT;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Drop existing constraint on grades score (if it limits max to 100 rigidly)
ALTER TABLE grades DROP CONSTRAINT IF EXISTS grades_score_check;

-- Create indexes for the new filters to optimize queries
CREATE INDEX IF NOT EXISTS idx_grades_academic_year ON grades(academic_year);
CREATE INDEX IF NOT EXISTS idx_grades_assessment_type ON grades(assessment_type);
CREATE INDEX IF NOT EXISTS idx_users_grade_section ON users(grade_level, section);
