-- Add password_hash column to users table for Academy Admins
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Note: In a real production environment, you should use pgcrypto and proper hashing.
-- For this implementation, we will store the password directly or assume the client sends a hash.
-- If you want to use pgcrypto extension for DB-side hashing:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
