-- Migration 013: Create admission_applications table for online admissions

CREATE TABLE IF NOT EXISTS admission_applications (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  applicant_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  grade_level VARCHAR(20),
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  address TEXT,
  previous_school VARCHAR(150),
  message TEXT,
  document_paths TEXT[],
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admissions_reference_number ON admission_applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admission_applications(status);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admission_applications(created_at DESC);

DROP TRIGGER IF EXISTS update_admission_applications_updated_at ON admission_applications;
CREATE TRIGGER update_admission_applications_updated_at
  BEFORE UPDATE ON admission_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
