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
