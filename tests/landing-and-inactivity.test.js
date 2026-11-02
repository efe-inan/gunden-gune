import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage, getCalendarDayDiff } from '../src/utils/storage.js';
import { renderLanding } from '../src/components/Landing.js';

test('checkInactivity counts local calendar days so Monday 23:50 to Thursday 08:10 triggers 3-day welcome', () => {
  installBrowserMock();
  storage.resetAll();

  const monLate = new Date(2026, 10, 2, 23, 50, 0); // Pazartesi 23:50
  const thuMorning = new Date(2026, 10, 5, 8, 10, 0); // Perşembe 08:10 (56s 20dk, ama 3 takvim günü)

  assert.equal(getCalendarDayDiff(monLate, thuMorning), 3);
  storage.completeTask({ feedback: 'tam_kivaminda' }, monLate);

  const res = storage.checkInactivity(thuMorning);
  assert.equal(res.daysInactive, 3);
  assert.equal(res.hasInactivity, true);
});

test('renderLanding adapts primary CTA for fresh, active, and graduated users', () => {
  installBrowserMock();
  storage.resetAll();

  const freshHtml = renderLanding();
  assert.match(freshHtml, /href="#onboarding"/);
  assert.match(freshHtml, /Yolculuğa başla/);

  const activeHtml = renderLanding({
    profile: { onboardingCompleted: true },
    journey: { currentDay: 4, completedDays: [1, 2, 3] },
  });
  assert.match(activeHtml, /id="btn-continue-journey"/);
  assert.match(activeHtml, /href="#today"/);
  assert.match(activeHtml, /Kaldığın yerden devam et · Gün 4 \/ 30/);
  assert.match(activeHtml, /Yeni yolculuk başlat/);

  const graduatedHtml = renderLanding({
    profile: { onboardingCompleted: true },
    journey: { currentDay: 30, completedDays: [30] },
  });
  assert.match(graduatedHtml, /href="#completed"/);
  assert.match(graduatedHtml, /Mezuniyet özetini gör/);
});
