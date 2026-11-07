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


-- ============================================================
-- D. COMMUNITY FORM.  Run once, after C, before the community
--    site goes live.
--    Distance is now optional (people pick on the day), and the
--    emergency contact is required: there are real weekly runs
--    now, not a waiting list. Replaces the policy from block C;
--    the column GRANT from block C stays as it is. index.html
--    and app.js mirror these rules.
-- ============================================================
DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;
CREATE POLICY "Allow public inserts" ON public.registrations
  FOR INSERT TO anon
  WITH CHECK (
    terms_accepted = true
    AND consent_at BETWEEN now() - interval '1 day' AND now() + interval '1 day'
    AND (distance IS NULL OR distance IN ('5km', '1km'))
    AND language IN ('EN', 'RU')
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
    AND length(email) <= 254
    AND length(first_name) BETWEEN 1 AND 100
    AND length(last_name)  BETWEEN 1 AND 100
    AND length(emergency_name)  BETWEEN 1 AND 100
    AND length(emergency_phone) BETWEEN 1 AND 40
    AND coalesce(length(phone), 0)             <= 40
    AND coalesce(length(heard_from), 0)        <= 60
    AND coalesce(length(registration_date), 0) <= 10
  );


-- ============================================================
-- E. CHILDREN.  Run once, after D, before the new form goes live.
--    A parent or guardian registers children (Terms 4): name,
--    date of birth (4 to 17 today), whether a child aged 11-17
--    may run without an adult, and consent to photos of them.
--    Children sit in one jsonb column: client code cannot read
--    the table, so it could not link rows in a second table.
--    registrant_type NULL is accepted as "adult" so the form that
--    is live while you run this keeps working until the deploy.
--    Replaces the policy from block D; index.html and app.js
--    mirror these rules.
-- ============================================================
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS registrant_type text,
  ADD COLUMN IF NOT EXISTS children jsonb,
  ADD COLUMN IF NOT EXISTS child_photo_consent boolean NOT NULL DEFAULT false;

GRANT INSERT (registrant_type, children, child_photo_consent)
  ON public.registrations TO anon;

DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;
CREATE POLICY "Allow public inserts" ON public.registrations
  FOR INSERT TO anon
  WITH CHECK (
    terms_accepted = true
    AND consent_at BETWEEN now() - interval '1 day' AND now() + interval '1 day'
    AND (distance IS NULL OR distance IN ('5km', '1km'))
    AND language IN ('EN', 'RU')
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
    AND length(email) <= 254
    AND length(first_name) BETWEEN 1 AND 100
    AND length(last_name)  BETWEEN 1 AND 100
    AND length(emergency_name)  BETWEEN 1 AND 100
    AND length(emergency_phone) BETWEEN 1 AND 40
    AND coalesce(length(phone), 0)             <= 40
    AND coalesce(length(heard_from), 0)        <= 60
    AND coalesce(length(registration_date), 0) <= 10
    AND (
      (coalesce(registrant_type, 'adult') = 'adult'
        AND children IS NULL
        AND child_photo_consent = false)
      OR (
        registrant_type = 'parent'
        AND jsonb_typeof(children) = 'array'
        AND jsonb_array_length(children) BETWEEN 1 AND 6
        AND octet_length(children::text) <= 2000
        AND NOT EXISTS (
          SELECT 1 FROM jsonb_array_elements(children) AS c
          WHERE NOT coalesce(
            jsonb_typeof(c) = 'object'
            AND length(c->>'name') BETWEEN 1 AND 100
            AND (c->>'dob') ~ '^\d{4}-\d{2}-\d{2}$'
            AND (c->>'dob')::date >  (current_date - interval '18 years')::date
            AND (c->>'dob')::date <= (current_date - interval '4 years')::date
            AND jsonb_typeof(c->'unaccompanied') = 'boolean'
            AND (NOT (c->>'unaccompanied')::boolean
                 OR (c->>'dob')::date <= (current_date - interval '11 years')::date),
            false)
        )
      )
    )
  );
