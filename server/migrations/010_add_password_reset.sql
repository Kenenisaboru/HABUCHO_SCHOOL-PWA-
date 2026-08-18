-- Migration 010: Add password reset columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(password_reset_token);
