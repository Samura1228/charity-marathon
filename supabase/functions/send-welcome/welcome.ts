// send-welcome: the welcome email and the Resend contact for one registration.
//
// Called by the Database Webhook on INSERT into public.registrations, and by
// scripts/welcome-backlog.js for people who registered before the webhook
// existed. Both send the webhook payload { type: 'INSERT', table:
// 'registrations', record: { id } } with the project's secret key on the
// `apikey` header. Only record.id is trusted: the row itself is re-read from
// the database, so the function can only ever write to people who registered.
//
// Steps, each logged in public.email_log (see supabase-email.sql):
//   welcome       the welcome email, once per address, EN or RU
//   participants  add to the Resend segment for service mail (everyone)
//   news          add to the Resend segment for news (news box ticked)
// A failed step is logged and the next one still runs. The registration
// itself is never affected: the webhook runs after the row is written.
//
// No dependencies: plain fetch to PostgREST and to the Resend HTTP API.

export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEYS?: string; // JSON object {name: 'sb_secret_...'}, injected by Supabase
  RESEND_API_KEY?: string; // needs Full access: contacts are not allowed with Sending access
  RESEND_SEGMENT_PARTICIPANTS?: string;
  RESEND_SEGMENT_NEWS?: string;
}

type Fetch = typeof fetch;
type Lang = 'en' | 'ru';
type Kind = 'welcome' | 'participants' | 'news';
type Status = 'sent' | 'failed' | 'skipped';

interface Registration {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  language: string | null;
  marketing_opt_in: boolean | null;
}

const SITE = 'https://limassolseafrontrun.com';
const FROM = 'Limassol Seafront Run <hello@mail.limassolseafrontrun.com>';
const REPLY_TO = 'info@limassolseafrontrun.com';
const RESEND_API = 'https://api.resend.com';
const ACCENT = '#B45F10'; // --accent in public/styles.css
const INK = '#10181D';
const MUTED = '#5B6B73';

/* ---------- The email ---------- */

const COPY = {
  en: {
    subject: 'Welcome to Limassol Seafront Run',
    hi: (name: string) => (name ? `Hi ${name},` : 'Hi,'),
    thanks: 'Thank you for registering with Limassol Seafront Run. You are on the list.',
    whereTitle: 'Where we meet',
    where: 'Opposite Dream Tower, at the blue public sports ground on the Limassol seafront.',
    whenTitle: 'When',
    when: 'Upcoming runs are on our website, and you can add them to your calendar there:',
    whenAfter: 'We will email you about the schedule and any changes separately.',
    bringTitle: 'What to bring',
    bring: [
      'Your own water bottle: we refill it at the start and the finish. We do not use single-use plastic.',
      'Comfortable running shoes.',
      'Something light-coloured or reflective: in the darker months we run after sunset.',
    ],
    rulesTitle: 'Good to know',
    rules: [
      'The minimum age is 4. Children under 11 stay beside an adult for the whole distance.',
      'Dogs are not allowed at our runs.',
    ],
    terms: 'Terms of Participation:',
    questions: 'Questions? Reply to this email or write to',
    bye: 'See you on the seafront,',
    footer: 'You are receiving this email because you registered at limassolseafrontrun.com.',
  },
  ru: {
    subject: 'Добро пожаловать в Limassol Seafront Run',
    hi: (name: string) => (name ? `Здравствуйте, ${name}!` : 'Здравствуйте!'),
    thanks: 'Спасибо за регистрацию в Limassol Seafront Run — вы в списке.',
    whereTitle: 'Где встречаемся',
    where: 'Напротив Dream Tower, на синей общественной спортплощадке на набережной Лимассола.',
    whenTitle: 'Когда',
    when: 'Ближайшие тренировки — на нашем сайте, там же их можно добавить в свой календарь:',
    whenAfter: 'О расписании и любых изменениях напишем отдельным письмом.',
    bringTitle: 'Что взять с собой',
    bring: [
      'Свою бутылку для воды: нальём на старте и на финише. Одноразовым пластиком мы не пользуемся.',
      'Удобную обувь для бега.',
      'Что-то светлое или со светоотражателями: в тёмное время года мы бегаем уже после заката.',
    ],
    rulesTitle: 'Важно знать',
    rules: [
      'Участвовать можно с 4 лет. Дети до 11 лет всю дистанцию находятся рядом со взрослым.',
      'Собаки на наших пробежках запрещены.',
    ],
    terms: 'Условия участия:',
    questions: 'Есть вопросы? Ответьте на это письмо или напишите на',
    bye: 'До встречи на набережной!',
    footer: 'Вы получили это письмо, потому что зарегистрировались на limassolseafrontrun.com.',
  },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function buildWelcome(lang: Lang, firstName: string | null) {
  const c = COPY[lang];
  const name = (firstName || '').trim();
  const calendarUrl = `${SITE}/#schedule`;
  const termsUrl = `${SITE}/terms.html`;

  const text = [
    c.hi(name), '', c.thanks, '',
    c.whereTitle.toUpperCase(), c.where, '',
    c.whenTitle.toUpperCase(), c.when, calendarUrl, c.whenAfter, '',
    c.bringTitle.toUpperCase(), ...c.bring.map((b) => `- ${b}`), '',
    c.rulesTitle.toUpperCase(), ...c.rules.map((r) => `- ${r}`), `- ${c.terms} ${termsUrl}`, '',
    `${c.questions} ${REPLY_TO}.`, '',
    c.bye, 'Limassol Seafront Run', '', '--', c.footer, '',
  ].join('\n');

  const h2 = `style="margin:28px 0 8px;font-size:17px;line-height:1.3;color:${ACCENT};"`;
  const p = 'style="margin:0 0 12px;"';
  const ul = 'style="margin:0 0 12px;padding-left:20px;"';
  const li = 'style="margin:0 0 6px;"';
  const a = `style="color:${ACCENT};"`;
  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:${INK};">
<p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ACCENT};">Limassol Seafront Run</p>
<p ${p}>${esc(c.hi(name))}</p>
<p ${p}>${esc(c.thanks)}</p>
<h2 ${h2}>${esc(c.whereTitle)}</h2>
<p ${p}>${esc(c.where)}</p>
<h2 ${h2}>${esc(c.whenTitle)}</h2>
<p ${p}>${esc(c.when)} <a href="${calendarUrl}" ${a}>limassolseafrontrun.com</a></p>
<p ${p}>${esc(c.whenAfter)}</p>
<h2 ${h2}>${esc(c.bringTitle)}</h2>
<ul ${ul}>${c.bring.map((b) => `<li ${li}>${esc(b)}</li>`).join('')}</ul>
<h2 ${h2}>${esc(c.rulesTitle)}</h2>
<ul ${ul}>${c.rules.map((r) => `<li ${li}>${esc(r)}</li>`).join('')}<li ${li}>${esc(c.terms)} <a href="${termsUrl}" ${a}>limassolseafrontrun.com/terms.html</a></li></ul>
<p style="margin:28px 0 12px;">${esc(c.questions)} <a href="mailto:${REPLY_TO}" ${a}>${REPLY_TO}</a>.</p>
<p ${p}>${esc(c.bye)}<br>Limassol Seafront Run</p>
<p style="margin:32px 0 0;padding-top:12px;border-top:1px solid #dfe5e8;font-size:13px;color:${MUTED};">${esc(c.footer)}</p>
</div>
</body>
</html>`;

  return { subject: c.subject, html, text };
}

/* ---------- Helpers ---------- */

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function secretKeys(env: Env): { all: string[]; main: string | undefined } {
  try {
    const keys = JSON.parse(env.SUPABASE_SECRET_KEYS || '{}') as Record<string, string>;
    const all = Object.values(keys).filter((k) => typeof k === 'string' && k.length > 0);
    return { all, main: keys['default'] || all[0] };
  } catch {
    return { all: [], main: undefined };
  }
}

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function callerKey(req: Request): string {
  const apikey = req.headers.get('apikey');
  if (apikey) return apikey.trim();
  const auth = req.headers.get('authorization') || '';
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
}

async function sha256Hex(s: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ResendResult { ok: boolean; status: number; name: string; error: string }

async function resend(fetchFn: Fetch, apiKey: string, path: string, body?: unknown,
  headers: Record<string, string> = {}): Promise<ResendResult> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetchFn(RESEND_API + path, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      return { ok: false, status: 0, name: 'network', error: `network error: ${String(err)}` };
    }
    const data = await res.json().catch(() => null) as { name?: string; message?: string } | null;
    const name = data?.name || '';
    // 10 requests/s per team; wait once if we hit it. Daily or monthly quota is not worth waiting for.
    if (res.status === 429 && attempt === 0 && !/quota/.test(name)) {
      await sleep(Math.min(Number(res.headers.get('retry-after')) || 1, 5) * 1000);
      continue;
    }
    return {
      ok: res.ok, status: res.status, name,
      error: res.ok ? '' : `${res.status} ${name}: ${data?.message || res.statusText}`.trim(),
    };
  }
}

function database(env: Env, key: string, fetchFn: Fetch) {
  const base = `${(env.SUPABASE_URL || '').replace(/\/$/, '')}/rest/v1`;
  const headers = { 'apikey': key, 'Content-Type': 'application/json' };
  return {
    async registration(id: number): Promise<Registration | null> {
      const res = await fetchFn(`${base}/registrations?id=eq.${id}&select=id,first_name,last_name,email,language,marketing_opt_in`, { headers });
      if (!res.ok) throw new Error(`read registration: HTTP ${res.status} ${await res.text()}`);
      const rows = await res.json() as Registration[];
      return rows[0] || null;
    },
    async sentKinds(email: string): Promise<Set<string>> {
      const res = await fetchFn(`${base}/rpc/email_sent_kinds`, {
        method: 'POST', headers, body: JSON.stringify({ p_email: email }),
      });
      if (!res.ok) throw new Error(`read email_log: HTTP ${res.status} ${await res.text()}`);
      return new Set(await res.json() as string[]);
    },
    async log(registrationId: number, kind: Kind, status: Status, error = ''): Promise<void> {
      const res = await fetchFn(`${base}/email_log`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ registration_id: registrationId, kind, status, error: error ? error.slice(0, 2000) : null }),
      });
      if (!res.ok) console.error(`email_log insert failed for registration ${registrationId}: HTTP ${res.status} ${await res.text()}`);
    },
  };
}

/* ---------- Handler ---------- */

export async function handle(req: Request, env: Env, fetchFn: Fetch = fetch): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  const keys = secretKeys(env);
  if (!keys.main || !env.SUPABASE_URL) {
    console.error('send-welcome: SUPABASE_URL or SUPABASE_SECRET_KEYS is missing');
    return json(500, { error: 'not configured' });
  }
  const given = callerKey(req);
  if (!given || !keys.all.some((k) => sameString(k, given))) return json(401, { error: 'unauthorised' });

  let payload: { type?: string; table?: string; record?: { id?: unknown } };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'body must be JSON' });
  }
  const id = Number(payload?.record?.id);
  if (payload?.type !== 'INSERT' || payload?.table !== 'registrations' || !Number.isSafeInteger(id) || id <= 0) {
    return json(400, { error: 'expected an INSERT on registrations with record.id' });
  }

  const db = database(env, keys.main, fetchFn);
  let reg: Registration | null;
  let done: Set<string>;
  try {
    reg = await db.registration(id);
    if (!reg) return json(404, { error: `registration ${id} not found` });
    // Without an address there is nothing to do, and nothing to dedupe against.
    if (!reg.email) {
      await db.log(id, 'welcome', 'skipped', 'no email address');
      return json(200, { registration_id: id, welcome: 'skipped' });
    }
    done = await db.sentKinds(reg.email);
  } catch (err) {
    // If we cannot check what has already gone out, send nothing.
    console.error(`send-welcome: registration ${id}:`, err);
    return json(500, { error: 'database unavailable' });
  }

  const email = reg.email;
  const result: Partial<Record<Kind, Status>> = {};
  const record = async (kind: Kind, status: Status, error = '') => {
    result[kind] = status;
    await db.log(id, kind, status, error);
  };
  const apiKey = env.RESEND_API_KEY || '';

  // 1. Welcome email, once per address.
  if (done.has('welcome')) {
    await record('welcome', 'skipped', 'already sent to this address');
  } else if (!apiKey) {
    await record('welcome', 'failed', 'RESEND_API_KEY is not set');
  } else {
    const lang: Lang = (reg.language || '').toUpperCase() === 'RU' ? 'ru' : 'en';
    const msg = buildWelcome(lang, reg.first_name);
    // Same key for the same address: Resend drops a second send within 24 hours,
    // which covers two registrations racing each other.
    const key = `welcome-${await sha256Hex(email.toLowerCase())}`;
    const sent = await resend(fetchFn, apiKey, '/emails', {
      from: FROM, to: [email], reply_to: REPLY_TO, subject: msg.subject, html: msg.html, text: msg.text,
    }, { 'Idempotency-Key': key });
    if (sent.ok) await record('welcome', 'sent');
    else if (sent.status === 409 && /idempotent/.test(sent.name)) await record('welcome', 'skipped', `already sent to this address in the last 24 hours (${sent.error})`);
    else await record('welcome', 'failed', sent.error);
  }

  // 2. Contact and segments: Participants for everyone, News only with consent.
  const segments: Array<[Kind, string | undefined, string]> = [];
  if (!done.has('participants')) segments.push(['participants', env.RESEND_SEGMENT_PARTICIPANTS, 'RESEND_SEGMENT_PARTICIPANTS']);
  if (reg.marketing_opt_in && !done.has('news')) segments.push(['news', env.RESEND_SEGMENT_NEWS, 'RESEND_SEGMENT_NEWS']);
  if (segments.length) {
    if (!apiKey) {
      for (const [kind] of segments) await record(kind, 'failed', 'RESEND_API_KEY is not set');
    } else {
      // Create the contact; if it already exists this fails and adding it to
      // the segments below still works, so only report it when they fail too.
      const created = await resend(fetchFn, apiKey, '/contacts', {
        email,
        first_name: reg.first_name || undefined,
        last_name: reg.last_name || undefined,
      });
      for (const [kind, segmentId, secretName] of segments) {
        if (!segmentId) {
          await record(kind, 'failed', `${secretName} is not set`);
          continue;
        }
        const added = await resend(fetchFn, apiKey,
          `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`);
        if (added.ok) await record(kind, 'sent');
        else await record(kind, 'failed', `add to segment: ${added.error}${created.ok ? '' : `; create contact: ${created.error}`}`);
      }
    }
  }

  console.log(`send-welcome: registration ${id}: ${JSON.stringify(result)}`);
  return json(200, { registration_id: id, ...result });
}
