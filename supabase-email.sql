-- ============================================================
-- G. EMAIL TO PARTICIPANTS.  Run once in the Supabase SQL editor;
--    independent of blocks A-F in supabase-setup.sql.
--
--    How it works:
--    1. A Database Webhook on INSERT into public.registrations calls
--       the Edge Function send-welcome (supabase/functions/send-welcome).
--    2. The function sends the welcome email through Resend, adds the
--       address to the Resend segment "Participants" (service mail to
--       everyone: cancellations, schedule, changes to the Terms) and,
--       if the news box was ticked, to "News". Each step is logged in
--       public.email_log.
--    The webhook goes through pg_net after the row has been written,
--    so a failed email never blocks or undoes a registration.
--
--    The webhook is created in the dashboard, not here: its definition
--    carries the project's secret key, and this repository is public.
--
--    One address = one person. If someone registers twice, the welcome
--    goes out once (checked by address, case-insensitive); the newest
--    registration decides the language and the news choice.
--
--    Nothing here is reachable from the browser: RLS is on, anon and
--    authenticated have no privileges on the table or the functions.
--    Only the secret key (role service_role) can use them.
--
--    Deleting someone on request: deleting their rows in registrations
--    also deletes their email_log rows (ON DELETE CASCADE). Delete the
--    contact in Resend as well (Contacts, search for the address).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.email_log (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registration_id bigint NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  kind            text NOT NULL CHECK (kind IN ('welcome', 'participants', 'news')),
  status          text NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  error           text CHECK (length(error) <= 2000),
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_log_registration_id_idx ON public.email_log (registration_id);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.email_log FROM anon, authenticated;
GRANT SELECT, INSERT ON public.email_log TO service_role;

-- Steps that have already gone out to this address, from any of its
-- registrations: a subset of 'welcome', 'participants', 'news'.
CREATE OR REPLACE FUNCTION public.email_sent_kinds(p_email text)
RETURNS SETOF text
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT DISTINCT l.kind
  FROM public.email_log l
  JOIN public.registrations r ON r.id = l.registration_id
  WHERE l.status = 'sent'
    AND lower(r.email) = lower(p_email)
$$;

-- Everyone still owed something, one row per address (its newest
-- registration). Used by scripts/welcome-backlog.js for people who
-- registered before the webhook existed, and for retries.
CREATE OR REPLACE FUNCTION public.email_backlog()
RETURNS TABLE (registration_id bigint, needs_welcome boolean)
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT n.id, NOT ('welcome' = ANY (s.done))
  FROM (
    SELECT DISTINCT ON (lower(r.email)) r.id, r.email, r.marketing_opt_in
    FROM public.registrations r
    WHERE coalesce(r.email, '') <> ''
    ORDER BY lower(r.email), r.created_at DESC NULLS LAST, r.id DESC
  ) n
  CROSS JOIN LATERAL (
    SELECT ARRAY(SELECT public.email_sent_kinds(n.email)) AS done
  ) s
  WHERE NOT (s.done @> ARRAY['welcome', 'participants']
             AND (NOT n.marketing_opt_in OR 'news' = ANY (s.done)))
  ORDER BY n.id
$$;

REVOKE EXECUTE ON FUNCTION public.email_sent_kinds(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_backlog() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_sent_kinds(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_backlog() TO service_role;

-- How many people the backlog script would email (same as its dry run):
--   SELECT count(*) FILTER (WHERE needs_welcome) AS welcome_emails,
--          count(*) AS addresses
--   FROM public.email_backlog();
-- What went wrong recently:
--   SELECT * FROM public.email_log WHERE status = 'failed' ORDER BY created_at DESC LIMIT 20;
