-- Run this SQL in Supabase SQL Editor (left sidebar → SQL Editor → New query)

-- ============================================================
-- A. ALREADY HAVE THE TABLE?  Run just this block.
--    The form records consent (Terms accepted, photo opt-out,
--    news opt-in) and the moment it was given. consent_at is the
--    GDPR proof of consent. Until these columns exist every
--    sign-up fails with 400 — run this before deploying.
-- ============================================================
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS heard_from TEXT;

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS terms_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS photo_opt_out  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz;


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
  distance TEXT,            -- '5km' or '1km'
  heard_from TEXT,          -- "Where you heard about us"
  emergency_name TEXT,      -- optional until the date is set
  emergency_phone TEXT,     -- optional until the date is set
  terms_accepted boolean NOT NULL DEFAULT false,
  photo_opt_out boolean NOT NULL DEFAULT false,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  consent_at timestamptz,   -- when the Terms were accepted (GDPR proof of consent)
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

-- Deliberately NO select policy for anon: the table holds personal data and
-- nothing in client code may read it. Manage sign-ups in the Supabase dashboard.
