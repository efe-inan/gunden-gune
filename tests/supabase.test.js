import test from 'node:test';
import assert from 'node:assert/strict';
import { isSupabaseConfigured, signInWithEmail, signOut } from '../src/utils/supabase.js';

test('isSupabaseConfigured evaluates boolean flag safely', () => {
  assert.equal(typeof isSupabaseConfigured, 'boolean');
});

test('signInWithEmail and signOut safely handle unconfigured or client calls without throwing', async () => {
  const signResult = await signInWithEmail('test@example.com');
  assert.ok(signResult, 'Expected result object');

  const outResult = await signOut();
  assert.ok(outResult, 'Expected signOut result object');
});
