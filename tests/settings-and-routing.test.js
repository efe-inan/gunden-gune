import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { SettingsController } from '../src/components/Settings.js';

test('importDataJSON rejects malformed or out-of-range payloads without corrupting existing state', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ name: 'Efe', dailyTimePreference: 10 });

  assert.equal(typeof storage.importDataJSON, 'function');
  const badJson = storage.importDataJSON('{bozuk');
  assert.equal(badJson.ok, false);
  assert.equal(storage.getState().profile.name, 'Efe');

  const badArea = storage.importDataJSON(JSON.stringify({
    profile: { selectedAreaId: 'kripto-kumar', onboardingCompleted: true },
    journey: { currentDay: 999 },
  }));
  assert.equal(badArea.ok, false);
  assert.equal(storage.getState().profile.name, 'Efe');
});

test('importDataJSON accepts valid exported backup, clamps strings safely, and restores journey', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ name: 'Deniz', dailyTimePreference: 15, timeOfDayPreference: 'aksam' });
  storage.completeTask({ feedback: 'tam_kivaminda', reflectionNote: 'İlk gün notu' });
  const backup = storage.exportDataJSON();

  storage.resetAll();
  const res = storage.importDataJSON(backup);
  assert.equal(res.ok, true);
  assert.equal(storage.getState().profile.name, 'Deniz');
  assert.equal(storage.getState().profile.timeOfDayPreference, 'aksam');
  assert.equal(storage.getState().journey.completedDays.includes(1), true);
});

test('resolveRoute guards uninitialized users from #today/#progress and sends returning users on empty hash to #today', async () => {
  installBrowserMock();
  const { resolveRoute } = await import('../src/main.js');

  const freshState = { profile: { onboardingCompleted: false }, journey: { currentDay: 1, completedDays: [], todayActionTaken: false } };
  assert.equal(resolveRoute('#today', freshState), '#onboarding');
  assert.equal(resolveRoute('#progress', freshState), '#onboarding');
  assert.equal(resolveRoute('', freshState), '#landing');

  const activeState = { profile: { onboardingCompleted: true }, journey: { currentDay: 4, completedDays: [1, 2, 3], todayActionTaken: false } };
  assert.equal(resolveRoute('', activeState), '#today');
  assert.equal(resolveRoute('#landing', activeState), '#landing');
  assert.equal(resolveRoute('#completed', activeState), '#today');

  // Day 30 completed today -> #today stays open for final reflection note, #completed is also allowed
  const day30TodayState = { profile: { onboardingCompleted: true }, journey: { currentDay: 30, completedDays: [30], todayActionTaken: true } };
  assert.equal(resolveRoute('#today', day30TodayState), '#today');
  assert.equal(resolveRoute('#completed', day30TodayState), '#completed');

  // Day 30 completed on an earlier day (rolled over) -> #today redirects to #completed
  const day30GraduatedState = { profile: { onboardingCompleted: true }, journey: { currentDay: 30, completedDays: [30], todayActionTaken: false } };
  assert.equal(resolveRoute('#today', day30GraduatedState), '#completed');
});

test('SettingsController renders #btn-import-json and destroy() cleans up window themechange listener', () => {
  const { window: win } = installBrowserMock();
  storage.resetAll();
  const baselineCount = win.__listenerCount('themechange');

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();
  ctrl.render(); // Multiple renders must not accumulate duplicate listeners

  assert.ok(container.querySelector('#btn-import-json'), 'Expected #btn-import-json in Settings');
  assert.equal(win.__listenerCount('themechange'), baselineCount + 1);

  ctrl.destroy();
  assert.equal(win.__listenerCount('themechange'), baselineCount);
});

test('importDataJSON sanitizes malformed archivedJourneys and dayStatusMap entries without crashing views', async () => {
  installBrowserMock();
  storage.resetAll();
  const { ProgressController } = await import('../src/components/Progress.js');
  const { TodayController } = await import('../src/components/Today.js');

  const dirtyBackup = JSON.stringify({
    profile: { name: 'Aylin', selectedAreaId: 'finans', onboardingCompleted: true },
    journey: {
      currentDay: 2,
      completedDays: [1],
      dayStatusMap: {
        '1': null,
        '2': { status: 'completed', note: 12345, feedback: 'gecersiz_deger' },
        '999': { status: 'completed' },
      },
    },
    archivedJourneys: [null, 123, { areaId: 'bilinmeyen' }, { areaId: 'uyku', completedDaysCount: 12, isCompleted30: false }],
  });

  const res = storage.importDataJSON(dirtyBackup);
  assert.equal(res.ok, true);
  assert.equal(res.state.archivedJourneys.length, 1);
  assert.equal(res.state.archivedJourneys[0].areaId, 'uyku');
  assert.equal(res.state.journey.dayStatusMap['1'], undefined);
  assert.equal(res.state.journey.dayStatusMap['999'], undefined);
  assert.equal(res.state.journey.dayStatusMap['2'].note, null);
  assert.equal(res.state.journey.dayStatusMap['2'].feedback, null);

  const progContainer = createContainer();
  assert.doesNotThrow(() => new ProgressController(progContainer).render());
  assert.match(progContainer.innerHTML, /Sağlıklı Uyku/);

  const todayContainer = createContainer();
  assert.doesNotThrow(() => new TodayController(todayContainer).render());
});

test('escapeHtml across all controllers safely handles non-string values without throwing', async () => {
  installBrowserMock();
  const { TodayController } = await import('../src/components/Today.js');
  const { ProgressController } = await import('../src/components/Progress.js');
  const { OnboardingController } = await import('../src/components/Onboarding.js');
  const { CompletionController } = await import('../src/components/Completion.js');

  const controllers = [
    new TodayController(createContainer()),
    new ProgressController(createContainer()),
    new SettingsController(createContainer()),
    new OnboardingController(createContainer()),
    new CompletionController(createContainer()),
  ];

  for (const ctrl of controllers) {
    assert.equal(ctrl.escapeHtml(null), '');
    assert.equal(ctrl.escapeHtml(undefined), '');
    assert.equal(ctrl.escapeHtml(12345), '');
    assert.equal(ctrl.escapeHtml({ bad: true }), '');
    assert.equal(ctrl.escapeHtml('<b>ok</b>'), '&lt;b&gt;ok&lt;/b&gt;');
  }
});

