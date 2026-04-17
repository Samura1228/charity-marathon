-- Run this SQL in Supabase SQL Editor (left sidebar → SQL Editor → New query)
-- This creates the registrations table and security policies

CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  distance TEXT,
  tshirt_size TEXT,
  emergency_name TEXT,
  emergency_phone TEXT,
  registration_date TEXT,
  language TEXT DEFAULT 'EN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (for the registration form)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (for the admin dashboard)
CREATE POLICY "Allow public reads" ON registrations
  FOR SELECT TO anon
  USING (true);