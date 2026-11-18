-- Migration 022: Add avatar_url column to users and synchronize with profile_picture
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Synchronize existing pictures so both columns match
UPDATE users SET avatar_url = profile_picture WHERE avatar_url IS NULL AND profile_picture IS NOT NULL;
UPDATE users SET profile_picture = avatar_url WHERE profile_picture IS NULL AND avatar_url IS NOT NULL;
