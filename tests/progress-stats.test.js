import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { ProgressController } from '../src/components/Progress.js';

test('zor_gune_ragmen does NOT unlock after 5 easy days without struggle or postpone', () => {
  installBrowserMock();
  storage.resetAll();
  for (let d = 0; d < 5; d++) {
    const date = new Date(2026, 10, 1 + d, 10, 0, 0);
    storage.syncDailyRollover(date);
    storage.completeTask({ feedback: 'tam_kivaminda' }, date);
  }
  const badge = storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen');
  assert.equal(badge.isUnlocked, false);
});

test('zor_gune_ragmen does NOT unlock on the struggled day itself before a subsequent day is completed', () => {
  installBrowserMock();
  storage.resetAll();
  storage.completeTask({ feedback: 'zorlandim' }, new Date(2026, 10, 1, 10, 0, 0));
  assert.equal(storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen').isUnlocked, false);

  const d2 = new Date(2026, 10, 2, 10, 0, 0);
  storage.syncDailyRollover(d2);
  storage.completeTask({ feedback: 'tam_kivaminda' }, d2);
  assert.equal(storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen').isUnlocked, true);
});

test('zor_gune_ragmen unlocks when a postponed day is completed the next calendar day', () => {
  installBrowserMock();
  storage.resetAll();
  const d1 = new Date(2026, 10, 1, 20, 0, 0);
  storage.postponeTask(d1);

  const d2 = new Date(2026, 10, 2, 10, 0, 0);
  storage.syncDailyRollover(d2);
  assert.equal(storage.getState().journey.currentDay, 1);
  storage.completeTask({ feedback: 'tam_kivaminda' }, d2);

  const badge = storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen');
  assert.equal(badge.isUnlocked, true);
});

test('weeklySummary reflects zorlandim feedback compassionately when present in current week', () => {
  installBrowserMock();
  storage.resetAll();
  const d1 = new Date(2026, 10, 1, 10, 0, 0);
  storage.completeTask({ feedback: 'zorlandim' }, d1);
  const summary = storage.getProgressStats().weeklySummary;
  assert.equal(summary.weekCompletedCount, 1);
  assert.match(summary.message, /zorlan/i);
});

test('ProgressController renders extended stage bounds (Gün 1–10) and archived journeys section', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateState(s => ({
    ...s,
    profile: { ...s.profile, readinessScore: 2, onboardingCompleted: true },
  }));
  storage.completeTask({ feedback: 'tam_kivaminda' }, new Date(2026, 10, 1, 10, 0, 0));
  storage.changeArea({ newAreaId: 'uyku', action: 'archive' });

  const container = createContainer();
  new ProgressController(container).render();

  assert.match(container.innerHTML, /Gün 1–10/);
  assert.match(container.innerHTML, /Geçmiş yolculuklar/);
  assert.match(container.innerHTML, /Para ve Finans Yönetimi/);
});
