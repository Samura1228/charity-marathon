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


-- ============================================================
-- C. HARDEN THE INSERT.  Run once, after A or B.
--    anon may write only the form's own columns (no id, no
--    created_at), every row must carry a real, current consent,
--    and no field may be oversized. The maxlength attributes in
--    index.html mirror these limits.
-- ============================================================
REVOKE INSERT ON public.registrations FROM anon;
GRANT INSERT (first_name, last_name, email, phone, distance, heard_from,
              emergency_name, emergency_phone, terms_accepted, photo_opt_out,
              marketing_opt_in, consent_at, registration_date, language)
  ON public.registrations TO anon;

DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;
CREATE POLICY "Allow public inserts" ON public.registrations
  FOR INSERT TO anon
  WITH CHECK (
    terms_accepted = true
    AND consent_at BETWEEN now() - interval '1 day' AND now() + interval '1 day'
    AND distance IN ('5km', '1km')
    AND language IN ('EN', 'RU')
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
    AND length(email) <= 254
    AND length(first_name) BETWEEN 1 AND 100
    AND length(last_name)  BETWEEN 1 AND 100
    AND coalesce(length(phone), 0)             <= 40
    AND coalesce(length(heard_from), 0)        <= 60
    AND coalesce(length(emergency_name), 0)    <= 100
    AND coalesce(length(emergency_phone), 0)   <= 40
    AND coalesce(length(registration_date), 0) <= 10
  );
