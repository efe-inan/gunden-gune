import test from 'node:test';
import assert from 'node:assert/strict';
import { isSupabaseConfigured, signInWithEmail, signOut, decideSyncDirection } from '../src/utils/supabase.js';

test('isSupabaseConfigured evaluates boolean flag safely', () => {
  assert.equal(typeof isSupabaseConfigured, 'boolean');
});

test('signInWithEmail and signOut safely handle unconfigured or client calls without throwing', async () => {
  const signResult = await signInWithEmail('test@example.com');
  assert.ok(signResult, 'Expected result object');

  const outResult = await signOut();
  assert.ok(outResult, 'Expected signOut result object');
});

function makeState({ onboarded = true, completed = [], lastActionDate = null } = {}) {
  return {
    profile: { onboardingCompleted: onboarded, selectedAreaId: 'finans' },
    journey: { currentDay: Math.max(1, completed.length || 1), completedDays: completed, lastActionDate },
  };
}

test('decideSyncDirection pushes local progress when cloud has no row or no onboarded journey', () => {
  const local = makeState({ completed: [1, 2] });
  assert.equal(decideSyncDirection(local, null), 'push');
  assert.equal(decideSyncDirection(local, { state: {} }), 'push');
  assert.equal(decideSyncDirection(local, { state: makeState({ onboarded: false }) }), 'push');
});

test('decideSyncDirection does nothing when neither side has an onboarded journey', () => {
  const freshLocal = makeState({ onboarded: false });
  assert.equal(decideSyncDirection(freshLocal, null), 'none');
  assert.equal(decideSyncDirection(freshLocal, { state: makeState({ onboarded: false }) }), 'none');
});

test('decideSyncDirection pulls cloud journey onto a fresh device', () => {
  const freshLocal = makeState({ onboarded: false });
  const cloud = { state: makeState({ completed: [1, 2, 3] }) };
  assert.equal(decideSyncDirection(freshLocal, cloud), 'pull');
});

test('decideSyncDirection keeps the side with more completed days, then the more recent action', () => {
  const localAhead = makeState({ completed: [1, 2, 3, 4], lastActionDate: '2026-11-01T10:00:00.000Z' });
  const cloudBehind = { state: makeState({ completed: [1, 2], lastActionDate: '2026-11-02T10:00:00.000Z' }) };
  assert.equal(decideSyncDirection(localAhead, cloudBehind), 'push');

  const localBehind = makeState({ completed: [1], lastActionDate: '2026-11-02T10:00:00.000Z' });
  const cloudAhead = { state: makeState({ completed: [1, 2, 3], lastActionDate: '2026-11-01T10:00:00.000Z' }) };
  assert.equal(decideSyncDirection(localBehind, cloudAhead), 'pull');

  const localOlder = makeState({ completed: [1, 2], lastActionDate: '2026-11-01T10:00:00.000Z' });
  const cloudNewer = { state: makeState({ completed: [1, 2], lastActionDate: '2026-11-02T10:00:00.000Z' }) };
  assert.equal(decideSyncDirection(localOlder, cloudNewer), 'pull');
  assert.equal(decideSyncDirection(cloudNewer.state, { state: localOlder }), 'push');
});
