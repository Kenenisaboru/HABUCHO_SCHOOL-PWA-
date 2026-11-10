-- Migration 019: Add performance indexes for scalable querying
CREATE INDEX IF NOT EXISTS idx_grades_student_year ON grades(student_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_grades_teacher_subject ON grades(teacher_id, subject);
CREATE INDEX IF NOT EXISTS idx_users_role_grade_sec ON users(role, grade_level, section);
CREATE INDEX IF NOT EXISTS idx_admissions_status_created ON admission_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_day ON schedules(teacher_id, day);
CREATE INDEX IF NOT EXISTS idx_schedules_class_day ON schedules(grade_level, day);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_by, created_at DESC);
