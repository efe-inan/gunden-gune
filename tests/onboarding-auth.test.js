import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { OnboardingController } from '../src/components/Onboarding.js';

test('Onboarding plan-ready view requires authentication before showing #today navigation', () => {
  installBrowserMock();
  storage.resetAll();

  const container = createContainer();
  const ctrl = new OnboardingController(container);
  ctrl.isPlanReady = true;

  // 1. Unauthenticated state: must render email input, not #btn-go-to-first-task
  storage.updateState({ auth: { isAuthenticated: false } });
  ctrl.renderPlanReadyView();

  const goToTaskBefore = container.querySelector('#btn-go-to-first-task');
  const emailInput = container.querySelector('#onboarding-email-input');
  const sendBtn = container.querySelector('#btn-onboarding-send-magic');

  assert.equal(goToTaskBefore, null, 'Unauthenticated user must not see direct link to #today');
  assert.ok(emailInput, 'Expected email input for mandatory account creation');
  assert.ok(sendBtn, 'Expected send magic link button');

  // 2. Authenticated state: renders #btn-go-to-first-task directly
  storage.updateState({ auth: { isAuthenticated: true, user: { email: 'deneme@test.com' } } });
  ctrl.renderPlanReadyView();

  const goToTaskAfter = container.querySelector('#btn-go-to-first-task');
  assert.ok(goToTaskAfter, 'Authenticated user must see direct #today navigation button');
});

