-- Migration 016: Create website_settings table for configurable site settings

CREATE TABLE IF NOT EXISTS website_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description VARCHAR(255),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_website_settings_key ON website_settings(key);
