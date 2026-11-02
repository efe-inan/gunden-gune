/**
 * reminder.js
 * Kullanıcının seçtiği zaman dilimi için sunucusuz RFC 5545 (.ics) takvim hatırlatıcısı üretir.
 */

export const TIME_SLOTS = {
  sabah: { hour: 9, minute: 0, label: '09:00' },
  ogle: { hour: 13, minute: 0, label: '13:00' },
  aksam: { hour: 20, minute: 30, label: '20:30' },
};

export function escapeIcsText(str) {
  if (typeof str !== 'string' || !str) {
    return '';
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatLocalIcsDateTime(d) {
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `T${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
  );
}

function formatUtcIcsStamp(d) {
  return (
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
    `T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`
  );
}

export function buildReminderICS(
  { areaTitle = 'Gelişim yolculuğu', timeOfDayPreference, remainingDays = 30 } = {},
  startDate = new Date()
) {
  const slot = TIME_SLOTS[timeOfDayPreference];
  if (!slot) {
    return null;
  }

  const ref = startDate instanceof Date ? new Date(startDate.getTime()) : new Date(startDate);
  if (Number.isNaN(ref.getTime())) {
    return null;
  }

  const dtStart = new Date(
    ref.getFullYear(),
    ref.getMonth(),
    ref.getDate(),
    slot.hour,
    slot.minute,
    0,
    0
  );

  if (dtStart.getTime() <= ref.getTime()) {
    dtStart.setDate(dtStart.getDate() + 1);
  }

  const dtEnd = new Date(dtStart.getTime() + 10 * 60 * 1000);
  const count = Math.max(1, Math.min(30, Number(remainingDays) || 30));
  const safeArea = escapeIcsText(areaTitle);
  const summary = escapeIcsText('Günden Güne · Günlük küçük adım');
  const description = escapeIcsText(
    `${areaTitle} alanındaki bugünkü küçük adımına sakin bir mola ayır. Seri cezası yok; kendi ritminde ilerle.`
  );
  const uid = `gunden-gune-${formatLocalIcsDateTime(dtStart)}@gunden-gune.vercel.app`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gunden Gune//Gunluk Adim Hatirlaticisi//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUtcIcsStamp(ref)}`,
    `DTSTART:${formatLocalIcsDateTime(dtStart)}`,
    `DTEND:${formatLocalIcsDateTime(dtEnd)}`,
    `RRULE:FREQ=DAILY;COUNT=${count}`,
    `SUMMARY:${summary}`,
    `CATEGORIES:${safeArea}`,
    `DESCRIPTION:${description}`,
    'URL:https://gunden-gune.vercel.app/#today',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${summary}`,
    'TRIGGER:-PT10M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ];

  return lines.join('\r\n');
}
