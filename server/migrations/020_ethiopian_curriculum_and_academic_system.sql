-- Migration 020: Ethiopian Secondary School Curriculum, Advanced Subject Management, and Academic Ranking System
-- Habucho Preparatory School Management System

-- 1. Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
  id SERIAL PRIMARY KEY,
  year_name VARCHAR(20) UNIQUE NOT NULL,
  start_date DATE,
  end_date DATE,
  pass_mark NUMERIC(5,2) DEFAULT 50.0,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO academic_years (year_name, pass_mark, is_current)
VALUES 
  ('2023/2024', 50.0, false),
  ('2024/2025', 50.0, true),
  ('2025/2026', 50.0, false)
ON CONFLICT (year_name) DO NOTHING;

-- 2. Ethiopian Curriculum Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT 'Core',
  grade_levels VARCHAR(20)[] NOT NULL,
  stream VARCHAR(50) DEFAULT 'All',
  max_marks NUMERIC(5,2) DEFAULT 100.0,
  pass_mark NUMERIC(5,2) DEFAULT 50.0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Official Ethiopian Secondary Curriculum Subjects (Grades 9 to 12)
INSERT INTO subjects (code, name, category, grade_levels, stream, max_marks, pass_mark)
VALUES
  -- Common Secondary Subjects (Grades 9 & 10)
  ('ENG-G0910', 'English', 'Core', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('AMH-G0910', 'Amharic', 'Language', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('AFO-G0910', 'Afaan Oromoo', 'Language', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('MATH-G0910', 'Mathematics', 'Core', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('PHYS-G0910', 'Physics', 'Science', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('CHEM-G0910', 'Chemistry', 'Science', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('BIO-G0910', 'Biology', 'Science', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('GEOG-G0910', 'Geography', 'Social', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('HIST-G0910', 'History', 'Social', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('CIT-G0910', 'Citizenship Education', 'Social', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('IT-G0910', 'Information Technology', 'Technology', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('HPE-G0910', 'Health & Physical Education', 'Physical', ARRAY['9','10'], 'General', 100.0, 50.0),
  ('ECON-G10', 'Economics', 'Social', ARRAY['10'], 'General', 100.0, 50.0),

  -- Grade 11 & 12: Natural Science Stream
  ('ENG-G1112-NAT', 'English', 'Core', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('MATH-G1112-NAT', 'Mathematics (Natural Science)', 'Core', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('PHYS-G1112-NAT', 'Physics', 'Science', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('CHEM-G1112-NAT', 'Chemistry', 'Science', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('BIO-G1112-NAT', 'Biology', 'Science', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('IT-G1112-NAT', 'Information Technology', 'Technology', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('TD-G1112-NAT', 'Technical Drawing', 'Applied', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('CIT-G1112-NAT', 'Citizenship Education', 'Social', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),
  ('HPE-G1112-NAT', 'Health & Physical Education', 'Physical', ARRAY['11','12'], 'Natural Science', 100.0, 50.0),

  -- Grade 11 & 12: Social Science Stream
  ('ENG-G1112-SOC', 'English', 'Core', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('MATH-G1112-SOC', 'Mathematics (Social Science)', 'Core', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('HIST-G1112-SOC', 'History', 'Social', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('GEOG-G1112-SOC', 'Geography', 'Social', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('ECON-G1112-SOC', 'Economics', 'Social', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('GBUS-G1112-SOC', 'General Business', 'Social', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('IT-G1112-SOC', 'Information Technology', 'Technology', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('CIT-G1112-SOC', 'Citizenship Education', 'Social', ARRAY['11','12'], 'Social Science', 100.0, 50.0),
  ('HPE-G1112-SOC', 'Health & Physical Education', 'Physical', ARRAY['11','12'], 'Social Science', 100.0, 50.0)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    category = EXCLUDED.category,
    grade_levels = EXCLUDED.grade_levels,
    stream = EXCLUDED.stream,
    max_marks = EXCLUDED.max_marks,
    pass_mark = EXCLUDED.pass_mark;

-- 3. Subject-Teacher Assignments
CREATE TABLE IF NOT EXISTS subject_teacher_assignments (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  grade_level VARCHAR(20) NOT NULL,
  section VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, teacher_id, academic_year, grade_level, section)
);

-- 4. Examination Periods & Assessment Configurations
CREATE TABLE IF NOT EXISTS examinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  semester VARCHAR(20) NOT NULL DEFAULT 'Semester 1',
  weight_percentage NUMERIC(5,2) DEFAULT 100.0,
  max_marks NUMERIC(5,2) DEFAULT 100.0,
  is_active BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'active', 'completed', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO examinations (name, academic_year, semester, weight_percentage, max_marks, status)
VALUES
  ('Mid Exam', '2024/2025', 'Semester 1', 30.0, 30.0, 'published'),
  ('Final Exam', '2024/2025', 'Semester 1', 70.0, 70.0, 'published'),
  ('Assignment', '2024/2025', 'Semester 1', 10.0, 10.0, 'published'),
  ('Quiz', '2024/2025', 'Semester 1', 10.0, 10.0, 'published')
ON CONFLICT DO NOTHING;

-- 5. Extend Grades Table with Workflow, Auditing, and Relationship
ALTER TABLE grades ADD COLUMN IF NOT EXISTS subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS submission_status VARCHAR(20) DEFAULT 'approved';
ALTER TABLE grades ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_grades_submission_status ON grades(submission_status);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);

-- 6. Student Academic Summaries & Rankings
CREATE TABLE IF NOT EXISTS student_academic_summaries (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  assessment_type VARCHAR(50) NOT NULL DEFAULT 'All',
  grade_level VARCHAR(20) NOT NULL,
  section VARCHAR(20) NOT NULL,
  stream VARCHAR(50) DEFAULT 'General',
  total_marks_obtained NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_possible_marks NUMERIC(8,2) NOT NULL DEFAULT 0,
  average_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  subjects_registered INTEGER NOT NULL DEFAULT 0,
  subjects_passed INTEGER NOT NULL DEFAULT 0,
  subjects_failed INTEGER NOT NULL DEFAULT 0,
  class_rank INTEGER,
  grade_rank INTEGER,
  school_rank INTEGER,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'finalized', 'published')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, academic_year, semester, assessment_type)
);

CREATE INDEX IF NOT EXISTS idx_summaries_student ON student_academic_summaries(student_id);
CREATE INDEX IF NOT EXISTS idx_summaries_filter ON student_academic_summaries(academic_year, semester, grade_level, section);
CREATE INDEX IF NOT EXISTS idx_summaries_ranks ON student_academic_summaries(class_rank, grade_rank, school_rank);
CREATE INDEX IF NOT EXISTS idx_summaries_avg ON student_academic_summaries(average_percentage DESC);

