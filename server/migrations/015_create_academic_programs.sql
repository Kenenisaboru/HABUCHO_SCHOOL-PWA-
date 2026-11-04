-- Migration 015: Create academic_programs table for public academics page

CREATE TABLE IF NOT EXISTS academic_programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_programs_display_order ON academic_programs(display_order);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON academic_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_category ON academic_programs(category);

DROP TRIGGER IF EXISTS update_academic_programs_updated_at ON academic_programs;
CREATE TRIGGER update_academic_programs_updated_at
  BEFORE UPDATE ON academic_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
