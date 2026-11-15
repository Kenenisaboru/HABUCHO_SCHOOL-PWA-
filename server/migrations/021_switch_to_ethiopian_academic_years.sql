-- Migration 021: Switch Academic Years to Ethiopian Calendar (E.C.)
-- Updates all existing records from Gregorian years (e.g. 2024/2025) to Ethiopian years (e.g. 2017)

-- 1. Update academic_years table
DELETE FROM academic_years;
INSERT INTO academic_years (year_name, pass_mark, is_current) VALUES
  ('2016', 50.0, false),
  ('2017', 50.0, true),
  ('2018', 50.0, false),
  ('2019', 50.0, false)
ON CONFLICT (year_name) DO UPDATE SET is_current = EXCLUDED.is_current;

-- 2. Update grades table
UPDATE grades 
SET academic_year = '2017' 
WHERE academic_year = '2024/2025' OR academic_year IS NULL;

UPDATE grades 
SET academic_year = '2016' 
WHERE academic_year = '2023/2024';

-- 3. Update student_academic_summaries table
UPDATE student_academic_summaries 
SET academic_year = '2017' 
WHERE academic_year = '2024/2025' OR academic_year IS NULL;

UPDATE student_academic_summaries 
SET academic_year = '2016' 
WHERE academic_year = '2023/2024';

-- 4. Update users table (default academic_year for students)
UPDATE users 
SET academic_year = '2017' 
WHERE academic_year = '2024/2025' OR academic_year IS NULL;

UPDATE users 
SET academic_year = '2016' 
WHERE academic_year = '2023/2024';

-- 5. Update examinations table
UPDATE examinations 
SET academic_year = '2017' 
WHERE academic_year = '2024/2025' OR academic_year IS NULL;

UPDATE examinations 
SET academic_year = '2016' 
WHERE academic_year = '2023/2024';

-- 6. Update subject_teacher_assignments table if any exist
UPDATE subject_teacher_assignments 
SET academic_year = '2017' 
WHERE academic_year = '2024/2025' OR academic_year IS NULL;

UPDATE subject_teacher_assignments 
SET academic_year = '2016' 
WHERE academic_year = '2023/2024';
