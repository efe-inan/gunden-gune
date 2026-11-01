import test from 'node:test';
import assert from 'node:assert/strict';
import tasksData from '../src/data/tasks.json' with { type: 'json' };
import { installBrowserMock } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import {
  computeStageBounds,
  extractPreferredTags,
  buildTaskSequence,
  resolveTodayTask,
} from '../src/utils/planEngine.js';

test('computeStageBounds extends Tohum to day 10 when readinessScore <= 2, beginner answer, or modifier < 0', () => {
  assert.deepEqual(computeStageBounds({ readinessScore: 2, answers: {} }, { adaptiveDifficultyModifier: 0 }), {
    tohumEnd: 10,
    filizEnd: 17,
    govdeEnd: 24,
  });
  assert.deepEqual(computeStageBounds({ readinessScore: 4, answers: { finans_1: 'hic' } }, { adaptiveDifficultyModifier: 0 }), {
    tohumEnd: 10,
    filizEnd: 17,
    govdeEnd: 24,
  });
  assert.deepEqual(computeStageBounds({ readinessScore: 4, answers: {} }, { adaptiveDifficultyModifier: 0 }), {
    tohumEnd: 7,
    filizEnd: 15,
    govdeEnd: 23,
  });
});

test('buildTaskSequence keeps light days (7,14,21) and day 30 anchored while prioritizing answer tags', () => {
  const seq = buildTaskSequence(tasksData.gorevler, {
    areaId: 'finans',
    answers: { finans_4: 'harcama', finans_5: 'harcama_kontrolu' },
    readinessScore: 3,
  });
  assert.equal(seq.length, 30);
  assert.equal(new Set(seq).size, 30);
  assert.equal(seq[6], 'finans-g07');
  assert.equal(seq[13], 'finans-g14');
  assert.equal(seq[20], 'finans-g21');
  assert.equal(seq[29], 'finans-g30');
  assert.ok(extractPreferredTags('finans', { finans_4: 'harcama' }).includes('durtu-yonetimi'));

  // Tag-matched task in Tohum (1..6) should rank near top
  const firstTask = tasksData.gorevler.find(t => t.id === seq[0]);
  assert.ok(
    firstTask.etiketler.includes('durtu-yonetimi') || firstTask.etiketler.includes('harcama-kontrolu'),
    `Expected top Tohum task to match harcama tags, got ${firstTask.id} (${firstTask.etiketler.join(',')})`
  );
});

test('resolveTodayTask promotes alternative and caps minutes when task exceeds dailyTimePreference', () => {
  const longFinansTask = tasksData.gorevler.find(t => t.alan === 'finans' && t.sure_dk > 5);
  const state = {
    profile: { selectedAreaId: 'finans', dailyTimePreference: 5, readinessScore: 3, answers: {} },
    journey: { currentDay: longFinansTask.gun, adaptiveDifficultyModifier: 0, taskOrder: null },
  };
  const resolved = resolveTodayTask(tasksData.gorevler, state);
  assert.equal(resolved.task.id, longFinansTask.id);
  assert.equal(resolved.isAlternativePrimary, true);
  assert.ok(resolved.effectiveMinutes <= 5);
});

test('changeArea and restartJourney regenerate taskOrder for the target area (no stale area task IDs)', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateState(s => ({
    ...s,
    journey: { ...s.journey, taskOrder: buildTaskSequence(tasksData.gorevler, { areaId: 'finans' }) },
  }));
  const updated = storage.changeArea({ newAreaId: 'uyku', action: 'archive' });
  assert.equal(updated.journey.taskOrder.length, 30);
  assert.ok(updated.journey.taskOrder.every(id => id.startsWith('uyku-')));

  const restarted = storage.restartJourney({ isAdvanced: true, newAreaId: 'odak' });
  assert.equal(restarted.journey.taskOrder.length, 30);
  assert.ok(restarted.journey.taskOrder.every(id => id.startsWith('odak-')));
});

test('repeatPreviousDay and easeDifficulty recover from 3+ day inactivity and dismiss banner for today', () => {
  installBrowserMock();
  storage.resetAll();
  const d1 = new Date(2026, 10, 1, 9, 0, 0);
  storage.completeTask({}, d1);
  const d2 = new Date(2026, 10, 2, 9, 0, 0);
  storage.syncDailyRollover(d2);
  storage.completeTask({}, d2);

  const d6 = new Date(2026, 10, 6, 9, 0, 0);
  storage.syncDailyRollover(d6); // currentDay becomes 3
  assert.equal(storage.getState().journey.currentDay, 3);
  assert.equal(storage.checkInactivity(d6).hasInactivity, true);

  storage.repeatPreviousDay(d6);
  assert.equal(storage.getState().journey.currentDay, 2);
  assert.equal(storage.checkInactivity(d6).hasInactivity, false);

  storage.easeDifficulty(d6);
  assert.equal(storage.getState().journey.adaptiveDifficultyModifier, -1);
});
