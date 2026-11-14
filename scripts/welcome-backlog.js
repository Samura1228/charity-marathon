#!/usr/bin/env node
// One-off: the welcome email and the Resend segments for people who registered
// before the send-welcome webhook existed. Also retries anyone whose steps
// failed (see email_log). Run it from your machine, not on Railway.
//
//   node scripts/welcome-backlog.js            dry run: shows how many, sends nothing
//   node scripts/welcome-backlog.js --send N   sends; N must equal the number of
//                                              welcome emails the dry run showed
//
// Needs the project's secret key (sb_secret_...) in SUPABASE_SECRET_KEY; it is
// never printed. Keep it in the macOS Keychain rather than in a file:
//   security add-generic-password -a "$USER" -s lsr-supabase-secret -w   (asks for it)
//   SUPABASE_SECRET_KEY="$(security find-generic-password -s lsr-supabase-secret -w)" node scripts/welcome-backlog.js
//
// The deployed send-welcome function does the work, one person at a time, so
// the backlog gets exactly the same email, checks and logging as the webhook.
// Who is owed what comes from public.email_backlog() (supabase-email.sql).
// No dependencies: plain Node >= 18.
'use strict';

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://rugxsvceksogunhqxwxd.supabase.co').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SECRET_KEY || '';
const STEPS = ['welcome', 'participants', 'news'];
const PAUSE_MS = 400; // up to 4 Resend calls per person; Resend allows 10 per second

async function backlog() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/email_backlog`, {
    method: 'POST',
    headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!res.ok) throw new Error(`email_backlog: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

async function processOne(id) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome`, {
    method: 'POST',
    headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'INSERT', table: 'registrations', schema: 'public', record: { id }, old_record: null }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function main() {
  const args = process.argv.slice(2);
  const sendAt = args.indexOf('--send');

  if (!KEY.startsWith('sb_secret_')) {
    console.error('Set SUPABASE_SECRET_KEY to the project secret key (sb_secret_...). See the comment at the top of this file.');
    process.exit(1);
  }

  const rows = await backlog();
  const welcome = rows.filter((r) => r.needs_welcome).length;
  console.log(`${rows.length} address(es) still owed something:`);
  console.log(`  ${welcome} will get the welcome email`);
  console.log(`  ${rows.length - welcome} already had it and only need adding to Resend segments`);

  if (sendAt === -1) {
    console.log(`Dry run: nothing sent. To send, run again with --send ${welcome}`);
    return;
  }
  if (Number(args[sendAt + 1]) !== welcome || args[sendAt + 1] === undefined) {
    console.error(`--send ${args[sendAt + 1] ?? ''} does not match the ${welcome} welcome email(s) above. Nothing sent.`);
    process.exit(1);
  }

  const totals = {};
  for (const [i, row] of rows.entries()) {
    const { status, body } = await processOne(row.registration_id);
    const steps = STEPS.filter((k) => body[k]).map((k) => `${k}=${body[k]}`).join(' ');
    console.log(`[${i + 1}/${rows.length}] registration ${row.registration_id}: HTTP ${status} ${steps || body.error || ''}`);
    for (const k of STEPS) if (body[k]) totals[`${k} ${body[k]}`] = (totals[`${k} ${body[k]}`] || 0) + 1;
    await new Promise((r) => setTimeout(r, PAUSE_MS));
  }
  console.log('Done:', totals);
  console.log('Failed steps are in email_log (status = failed). Run the dry run again to see what is left.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
