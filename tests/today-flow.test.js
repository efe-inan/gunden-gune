import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { TodayController } from '../src/components/Today.js';
import { OnboardingController } from '../src/components/Onboarding.js';

test('OnboardingController.completeAndSavePlan persists personalized 30-day taskOrder', () => {
  installBrowserMock();
  storage.resetAll();
  const container = createContainer();
  const ctrl = new OnboardingController(container);
  ctrl.formData.name = 'Efe';
  ctrl.formData.selectedAreaId = 'odak';
  ctrl.formData.areaAnswers = { odak_1: 'bildirim', odak_5: 'ekran_azaltma' };
  ctrl.formData.dailyTime = 10;
  ctrl.formData.readiness = 2;

  ctrl.completeAndSavePlan();
  const saved = storage.getState();
  assert.equal(Array.isArray(saved.journey.taskOrder), true);
  assert.equal(saved.journey.taskOrder.length, 30);
  assert.ok(saved.journey.taskOrder.every(id => id.startsWith('odak-')));
});

test('TodayController promotes light alternative and caps time when task exceeds dailyTimePreference=5', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateState(s => ({
    ...s,
    profile: { ...s.profile, selectedAreaId: 'finans', dailyTimePreference: 5, onboardingCompleted: true },
    journey: { ...s.journey, currentDay: 10 }, // finans-g10 has sure_dk > 5
  }));

  const container = createContainer();
  const ctrl = new TodayController(container);
  ctrl.render();

  assert.ok(container.querySelector('#btn-toggle-full-steps'), 'Expected #btn-toggle-full-steps button');
  assert.match(container.innerHTML, /~5 dk/);

  // Toggling full steps reveals numbered steps list
  container.querySelector('#btn-toggle-full-steps').click();
  assert.match(container.innerHTML, /task-steps-list/);
});

test('TodayController renders 3+ day inactivity recovery actions (#btn-repeat-prev-day and #btn-ease-plan)', () => {
  installBrowserMock();
  storage.resetAll();
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
  storage.updateState(s => ({
    ...s,
    profile: { ...s.profile, onboardingCompleted: true },
    journey: { ...s.journey, currentDay: 4, completedDays: [1, 2, 3], lastActionDate: fourDaysAgo },
  }));

  const container = createContainer();
  const ctrl = new TodayController(container);
  ctrl.render();

  const repeatBtn = container.querySelector('#btn-repeat-prev-day');
  const easeBtn = container.querySelector('#btn-ease-plan');
  assert.ok(repeatBtn, 'Expected #btn-repeat-prev-day');
  assert.ok(easeBtn, 'Expected #btn-ease-plan');

  repeatBtn.click();
  assert.equal(storage.getState().journey.currentDay, 3);
  assert.equal(container.querySelector('#btn-repeat-prev-day'), null);
});

test('TodayController shows supportive copy on zorlandim feedback, hides sim button by default, and keeps note + graduation CTA on day 30', () => {
  installBrowserMock({ url: 'http://localhost:5173/#today' });
  storage.resetAll();
  storage.updateState(s => ({
    ...s,
    profile: { ...s.profile, onboardingCompleted: true },
    journey: {
      ...s.journey,
      currentDay: 30,
      completedDays: Array.from({ length: 29 }, (_, i) => i + 1),
      consecutiveFeedback: { type: 'zorlandim', count: 1 },
    },
  }));

  const container = createContainer();
  const ctrl = new TodayController(container);
  ctrl.render();

  // Simulation button hidden in normal URL
  assert.equal(container.querySelector('#btn-advance-day'), null);

  // Complete Day 30
  container.querySelector('#btn-complete-task').click();
  assert.ok(container.querySelector('#reflection-input'), 'Day 30 reflection input must stay accessible');
  const gradLink = container.querySelector('#btn-go-graduation');
  assert.ok(gradLink, 'Expected #btn-go-graduation on Day 30 completed view');
  assert.equal(gradLink.getAttribute('href'), '#completed');

  // Click zorlandim feedback (2nd consecutive -> supportive message)
  const zorlandimBtn = container.querySelectorAll('.feedback-pill-btn').find(b => b.getAttribute('data-feedback') === 'zorlandim');
  zorlandimBtn.click();
  assert.match(container.innerHTML, /Zor olması normal/i);

  // Simulation button visible when ?sim=1
  installBrowserMock({ url: 'http://localhost:5173/?sim=1#today' });
  storage.resetAll();
  const simContainer = createContainer();
  new TodayController(simContainer).render();
  assert.ok(simContainer.querySelector('#btn-advance-day'), 'Expected #btn-advance-day when ?sim=1');
});

test('TodayController escapes HTML in profile.name greeting (prevents Stored XSS)', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ name: '<img src=x onerror=alert(1)>' });

  const container = createContainer();
  new TodayController(container).render();

  assert.equal(container.innerHTML.includes('<img src=x'), false, 'Raw <img> tag must not be injected');
  assert.match(container.innerHTML, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test('completeTask is idempotent on same-day repeated feedback clicks and reversible on same-day switch', () => {
  installBrowserMock();
  storage.resetAll();
  const day1 = new Date(2026, 10, 2, 10, 0, 0);

  storage.completeTask({}, day1);
  storage.completeTask({ feedback: 'zorlandim' }, day1);
  storage.completeTask({ feedback: 'zorlandim' }, day1); // 2nd click on same day

  const afterDoubleClick = storage.getState().journey;
  assert.equal(afterDoubleClick.adaptiveDifficultyModifier, 0, 'Same-day double click must not drop modifier');
  assert.equal(afterDoubleClick.consecutiveFeedback.count, 1);

  // Switching mind on the same day
  storage.completeTask({ feedback: 'tam_kivaminda' }, day1);
  const afterSwitch = storage.getState().journey;
  assert.equal(afterSwitch.consecutiveFeedback.type, 'tam_kivaminda');
  assert.equal(afterSwitch.consecutiveFeedback.count, 0);
});

