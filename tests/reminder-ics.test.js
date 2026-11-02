import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { buildReminderICS, escapeIcsText } from '../src/utils/reminder.js';
import { SettingsController } from '../src/components/Settings.js';

test('buildReminderICS returns null for fark_etmez and valid CRLF RFC 5545 calendar for sabah/ogle/aksam', () => {
  assert.equal(buildReminderICS({ areaTitle: 'Finans', timeOfDayPreference: 'fark_etmez' }), null);

  const start = new Date(2026, 10, 3, 7, 0, 0); // 3 Kas 2026 07:00
  const ics = buildReminderICS(
    { areaTitle: 'Para, Finans; Not\nSatır', timeOfDayPreference: 'aksam', remainingDays: 24 },
    start
  );

  assert.ok(ics.includes('\r\n'), 'Must use CRLF line endings');
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART:20261103T203000/);
  assert.match(ics, /DTEND:20261103T204000/);
  assert.match(ics, /RRULE:FREQ=DAILY;COUNT=24/);
  assert.match(ics, /TRIGGER:-PT10M/);
  assert.equal(escapeIcsText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
});

test('SettingsController disables #btn-download-ics when fark_etmez is selected and enables it otherwise', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ timeOfDayPreference: 'fark_etmez' });

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();

  const btnDisabled = container.querySelector('#btn-download-ics');
  assert.ok(btnDisabled, 'Expected #btn-download-ics in Settings');
  assert.equal(btnDisabled.hasAttribute('disabled'), true);

  storage.updateProfileSettings({ timeOfDayPreference: 'sabah' });
  ctrl.render();
  const btnEnabled = container.querySelector('#btn-download-ics');
  assert.equal(btnEnabled.hasAttribute('disabled'), false);
  ctrl.destroy();
});

test('SettingsController preserves unsaved name and daily time edits when downloading .ics reminder', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({
    name: 'Eski İsim',
    dailyTimePreference: 10,
    timeOfDayPreference: 'sabah',
  });

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();

  const nameInput = container.querySelector('#settings-name-input');
  nameInput.value = 'Efe Yeni';

  const mins15Btn = container.querySelector('[data-mins="15"]');
  mins15Btn.click();
  assert.equal(mins15Btn.classList.contains('is-selected'), true);

  const downloadBtn = container.querySelector('#btn-download-ics');
  downloadBtn.click();

  const nameInputAfter = container.querySelector('#settings-name-input');
  const mins15After = container.querySelector('[data-mins="15"]');
  const noticeEl = container.querySelector('#settings-calm-notice');

  assert.equal(nameInputAfter.value, 'Efe Yeni', 'Unsaved name edit must not be wiped by .ics download');
  assert.equal(mins15After.classList.contains('is-selected'), true, 'Unsaved daily time edit must remain selected');
  assert.ok(noticeEl && noticeEl.textContent.includes('Takvim hatırlatıcısı indirildi'));

  const saveBtn = container.querySelector('#btn-save-profile');
  saveBtn.click();

  const updated = storage.getState().profile;
  assert.equal(updated.name, 'Efe Yeni');
  assert.equal(updated.dailyTimePreference, 15);
  ctrl.destroy();
});


