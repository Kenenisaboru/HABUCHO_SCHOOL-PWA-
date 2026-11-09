-- Migration 017: Expand role-based access control
-- Adds director, vice_principal, and department_head roles
-- Adds department column for department heads

-- 1. Drop the old role constraint and add expanded one
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'director', 'vice_principal', 'department_head', 'teacher', 'student'));

-- 2. Add department column for department heads and teachers
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
