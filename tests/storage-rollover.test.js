import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage, getLocalDateKey } from '../src/utils/storage.js';

test('getLocalDateKey uses local calendar date instead of UTC (00:30 local time edge case)', () => {
  const localMidnightPlus30 = new Date(2026, 10, 2, 0, 30, 0); // 2 Kas 2026 00:30 yerel
  assert.equal(getLocalDateKey(localMidnightPlus30), '2026-11-02');
});

test('syncDailyRollover advances currentDay on next calendar day when today was completed', () => {
  installBrowserMock();
  storage.resetAll();
  const day1 = new Date(2026, 10, 2, 9, 0, 0);
  storage.completeTask({ feedback: 'tam_kivaminda' }, day1);
  assert.equal(storage.getState().journey.currentDay, 1);
  assert.equal(storage.isTodayActionCompleted(day1), true);

  const day2 = new Date(2026, 10, 3, 9, 0, 0);
  const rolled = storage.syncDailyRollover(day2);
  assert.equal(rolled.journey.currentDay, 2);
  assert.equal(rolled.journey.todayActionTaken, false);
  assert.equal(storage.isTodayActionCompleted(day2), false);
});

test('syncDailyRollover keeps currentDay unchanged on next calendar day when today was postponed', () => {
  installBrowserMock();
  storage.resetAll();
  const day1 = new Date(2026, 10, 2, 21, 0, 0);
  storage.postponeTask(day1);

  const day2 = new Date(2026, 10, 3, 8, 30, 0);
  const rolled = storage.syncDailyRollover(day2);
  assert.equal(rolled.journey.currentDay, 1);
  assert.equal(rolled.journey.todayActionTaken, false);
});

test('checkInactivity reports hasInactivity=true after 3+ calendar days and handles invalid dates safely', () => {
  installBrowserMock();
  storage.resetAll();
  storage.completeTask({}, new Date(2026, 10, 1, 10, 0, 0));
  const res = storage.checkInactivity(new Date(2026, 10, 4, 10, 0, 0));
  assert.equal(res.hasInactivity, true);
  assert.equal(res.daysInactive, 3);

  storage.updateState(s => ({ ...s, journey: { ...s.journey, lastActionDate: 'bozuk-tarih' } }));
  assert.deepEqual(storage.checkInactivity(new Date(2026, 10, 4, 10, 0, 0)), { hasInactivity: false, daysInactive: 0 });
});

test('syncDailyRollover does NOT advance currentDay when a repeated previous day is postponed', () => {
  installBrowserMock();
  storage.resetAll();

  const d1 = new Date(2026, 10, 1, 10, 0, 0);
  storage.completeTask({ feedback: 'tam_kivaminda' }, d1);

  const d2 = new Date(2026, 10, 2, 10, 0, 0);
  storage.syncDailyRollover(d2);
  storage.completeTask({ feedback: 'tam_kivaminda' }, d2);

  const d3 = new Date(2026, 10, 3, 10, 0, 0);
  storage.syncDailyRollover(d3);
  assert.equal(storage.getState().journey.currentDay, 3);

  // User returns 4 days later, chooses to repeat Day 2, then postpones Day 2
  const d6 = new Date(2026, 10, 6, 18, 0, 0);
  storage.repeatPreviousDay(d6);
  assert.equal(storage.getState().journey.currentDay, 2);
  storage.postponeTask(d6);

  // Next morning: postponed Day 2 must stay on Day 2
  const d7 = new Date(2026, 10, 7, 9, 0, 0);
  const rolled = storage.syncDailyRollover(d7);
  assert.equal(rolled.journey.currentDay, 2);
});

