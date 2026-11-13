#!/usr/bin/env node
// Builds the subscribable calendar feeds from calendar/events.json:
//   public/calendar.ics     (English)
//   public/calendar-ru.ics  (Russian)
// People subscribe once (Apple / Google / Outlook) and their calendar app
// re-fetches the feed, so new runs, cancellations and changes reach them
// without them doing anything. No dependencies: plain Node >= 18.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'calendar', 'events.json');
const TZID = 'Europe/Nicosia';
const UID_DOMAIN = 'limassolseafrontrun.com';

// Cyprus follows the EU rule: last Sunday of March / October at 01:00 UTC.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:' + TZID,
  'BEGIN:STANDARD',
  'DTSTART:19701025T040000',
  'TZOFFSETFROM:+0300',
  'TZOFFSETTO:+0200',
  'TZNAME:EET',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'DTSTART:19700329T030000',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0300',
  'TZNAME:EEST',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'END:VTIMEZONE'
];

const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function fail(msg) {
  console.error('build-calendar: ' + msg);
  process.exit(1);
}

// RFC 5545 text escaping
function esc(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold lines at 75 octets without splitting a UTF-8 character (Cyrillic is 2 bytes).
function fold(line) {
  const out = [];
  let cur = '';
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = Buffer.byteLength(ch, 'utf8');
    if (bytes + b > limit) {
      out.push(cur);
      cur = ' ';
      bytes = 1;
      limit = 75;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n');
}

function checkDate(s, where) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(Date.parse(s + 'T00:00:00Z'))) {
    fail(where + ': bad date "' + s + '" (use YYYY-MM-DD)');
  }
}

function checkTime(s, where) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) fail(where + ': bad time "' + s + '" (use HH:MM)');
}

function local(date, time) {
  return date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
}

// Local end time; runs never cross midnight, but handle it anyway.
function localEnd(date, time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(Date.UTC(...date.split('-').map((n, i) => (i === 1 ? n - 1 : +n)), h, m + minutes));
  const iso = d.toISOString(); // treated as a wall-clock value, not UTC
  return iso.slice(0, 10).replace(/-/g, '') + 'T' + iso.slice(11, 16).replace(':', '') + '00';
}

function utcStamp(d) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function pick(obj, lang, field, where) {
  const v = obj && (obj[lang] || obj.en);
  if (!v) fail(where + ': missing ' + field);
  return v;
}

function description(ev, lang, site) {
  const parts = [ev.notes ? pick(ev.notes, lang, 'notes', ev.id) : ''];
  if (ev.map) parts.push((lang === 'ru' ? 'Карта: ' : 'Map: ') + ev.map);
  parts.push(site);
  return parts.filter(Boolean).join('\n\n');
}

function eventLines(ev, lang, data, stamp, recurring) {
  const where = (recurring ? 'weekly' : 'events') + '[' + ev.id + ']';
  if (!ev.id || !/^[a-z0-9-]+$/.test(ev.id)) fail(where + ': id must be lowercase letters, digits and dashes');
  checkTime(ev.start, where);
  if (!(ev.minutes > 0 && ev.minutes < 24 * 60)) fail(where + ': minutes must be 1..1439');

  const date = recurring ? ev.from : ev.date;
  checkDate(date, where);

  const L = [
    'BEGIN:VEVENT',
    'UID:' + ev.id + '@' + UID_DOMAIN,
    'DTSTAMP:' + stamp,
    'DTSTART;TZID=' + TZID + ':' + local(date, ev.start),
    'DTEND;TZID=' + TZID + ':' + localEnd(date, ev.start, ev.minutes),
    'SUMMARY:' + esc(pick(ev.title, lang, 'title', where)),
    'LOCATION:' + esc(pick(ev.location, lang, 'location', where)),
    'DESCRIPTION:' + esc(description(ev, lang, data.site))
  ];
  if (ev.map) L.push('URL:' + ev.map);

  if (recurring) {
    if (DAYS.indexOf(ev.day) === -1) fail(where + ': day must be one of ' + DAYS.join(', '));
    const first = new Date(ev.from + 'T00:00:00Z').getUTCDay();
    if (DAYS[first] !== ev.day) fail(where + ': "from" (' + ev.from + ') is not a ' + ev.day);
    let rule = 'RRULE:FREQ=WEEKLY;BYDAY=' + ev.day;
    if (ev.until) {
      checkDate(ev.until, where + '.until');
      // UNTIL must be UTC when DTSTART has a TZID; end of that day in Cyprus is safe.
      rule += ';UNTIL=' + ev.until.replace(/-/g, '') + 'T215959Z';
    }
    L.push(rule);
    (ev.cancelled || []).forEach((d) => {
      checkDate(d, where + '.cancelled');
      L.push('EXDATE;TZID=' + TZID + ':' + local(d, ev.start));
    });
  }

  L.push('STATUS:' + (!recurring && ev.cancelled ? 'CANCELLED' : 'CONFIRMED'));
  L.push('TRANSP:OPAQUE');
  L.push(
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-PT1H',
    'DESCRIPTION:' + esc(pick(ev.title, lang, 'title', where)),
    'END:VALARM'
  );
  L.push('END:VEVENT');
  return L;
}

function build(data, lang) {
  const stamp = utcStamp(new Date());
  const name = pick(data.name, lang, 'name', 'calendar');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Limassol Seafront Run//Calendar//' + lang.toUpperCase(),
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:' + esc(name),
    'X-WR-CALDESC:' + esc(pick(data.description, lang, 'description', 'calendar')),
    'X-WR-TIMEZONE:' + TZID,
    'NAME:' + esc(name),
    // Ask clients to re-check every 6 hours (Apple and Outlook honour this; Google polls on its own schedule).
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
    ...VTIMEZONE
  ];
  (data.events || []).forEach((ev) => lines.push(...eventLines(ev, lang, data, stamp, false)));
  (data.weekly || []).forEach((ev) => lines.push(...eventLines(ev, lang, data, stamp, true)));
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

let data;
try {
  data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
} catch (e) {
  fail('cannot read ' + path.relative(ROOT, SOURCE) + ': ' + e.message);
}

const ids = [...(data.events || []), ...(data.weekly || [])].map((e) => e.id);
const dup = ids.find((id, i) => ids.indexOf(id) !== i);
if (dup) fail('duplicate id "' + dup + '"');

[['en', 'calendar.ics'], ['ru', 'calendar-ru.ics']].forEach(([lang, file]) => {
  fs.writeFileSync(path.join(ROOT, 'public', file), build(data, lang));
  console.log('build-calendar: wrote public/' + file);
});
