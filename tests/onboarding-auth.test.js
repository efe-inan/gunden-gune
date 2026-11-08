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

test('importDataJSON preserves authenticated session state so cloud pull does not log user out', () => {
  installBrowserMock();
  storage.resetAll();

  storage.updateState({
    auth: { isAuthenticated: true, user: { id: 'u1', email: 'efe@example.com' } },
  });

  const cloudBackup = JSON.stringify({
    auth: { isAuthenticated: false, user: null },
    profile: {
      name: 'Efe',
      selectedAreaId: 'finans',
      dailyTimePreference: 15,
      timeOfDayPreference: 'sabah',
      readinessScore: 4,
      answers: { finans_4: 'harcama' },
      onboardingCompleted: true,
    },
    journey: {
      currentDay: 1,
      completedDays: [],
    },
  });

  const result = storage.importDataJSON(cloudBackup);
  assert.equal(result.ok, true);
  assert.equal(storage.getState().auth.isAuthenticated, true);
  assert.equal(storage.getState().auth.user?.email, 'efe@example.com');
  assert.equal(storage.getState().profile.onboardingCompleted, true);
});

test('OnboardingController opens directly on plan-ready view when onboardingCompleted is true', () => {
  installBrowserMock();
  storage.resetAll();

  storage.updateState({
    auth: { isAuthenticated: false, user: null },
    profile: {
      ...storage.getState().profile,
      name: 'Efe',
      selectedAreaId: 'finans',
      onboardingCompleted: true,
    },
  });

  const container = createContainer();
  const ctrl = new OnboardingController(container);
  ctrl.render();

  assert.equal(ctrl.isPlanReady, true);
  assert.ok(container.querySelector('#onboarding-email-input'), 'Should show email input, not question 1');
});


