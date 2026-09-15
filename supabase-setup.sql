-- Run this SQL in Supabase SQL Editor (left sidebar → SQL Editor → New query)

-- ============================================================
-- A. ALREADY HAVE THE TABLE?  Run just this block.
--    The sign-up form now asks "Where you heard about us" and
--    stores it in heard_from. Until this column exists the form
--    still saves the sign-up but drops that one answer.
-- ============================================================
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS heard_from TEXT;


-- ============================================================
-- B. FRESH INSTALL?  Run this block instead.
--    Creates the registrations table and security policies.
-- ============================================================
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,               -- optional
  distance TEXT,            -- '5km' or '1km-family'
  heard_from TEXT,          -- "Where you heard about us"
  registration_date TEXT,
  language TEXT DEFAULT 'EN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (for the sign-up form)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (for the admin dashboard)
CREATE POLICY "Allow public reads" ON registrations
  FOR SELECT TO anon
  USING (true);
