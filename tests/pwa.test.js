import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import {
  initPwaInstallListener,
  canInstallPwa,
  promptPwaInstall,
  registerServiceWorker,
  resetPwaStateForTests,
} from '../src/utils/pwa.js';
import { SettingsController } from '../src/components/Settings.js';

test('registerServiceWorker safely returns { registered: false } when serviceWorker is unsupported or throws', async () => {
  assert.deepEqual(await registerServiceWorker({}), { registered: false });
  const failingNav = {
    serviceWorker: {
      register: async () => {
        throw new Error('SW blocked');
      },
    },
  };
  assert.deepEqual(await registerServiceWorker(failingNav, '/sw.js'), { registered: false });

  let registeredUrl = null;
  const okNav = {
    serviceWorker: {
      register: async (url) => {
        registeredUrl = url;
        return { scope: '/' };
      },
    },
  };
  assert.deepEqual(await registerServiceWorker(okNav, '/sw.js'), { registered: true });
  assert.equal(registeredUrl, '/sw.js');
});

test('beforeinstallprompt enables #btn-install-pwa in SettingsController and clears after accepted prompt', async () => {
  const { window: win } = installBrowserMock();
  storage.resetAll();
  resetPwaStateForTests();
  const cleanup = initPwaInstallListener(win);

  assert.equal(canInstallPwa(), false);

  let promptCalled = false;
  const fakeEvent = new CustomEvent('beforeinstallprompt');
  fakeEvent.preventDefault = () => {};
  fakeEvent.prompt = async () => {
    promptCalled = true;
  };
  fakeEvent.userChoice = Promise.resolve({ outcome: 'accepted' });
  win.dispatchEvent(fakeEvent);

  assert.equal(canInstallPwa(), true);

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();
  assert.ok(container.querySelector('#btn-install-pwa'), 'Expected #btn-install-pwa when installable');

  const res = await promptPwaInstall();
  assert.equal(promptCalled, true);
  assert.equal(res.outcome, 'accepted');
  assert.equal(canInstallPwa(), false);

  ctrl.destroy();
  cleanup();
});

test('manifest.webmanifest and sw.js exist with valid offline navigation fallback rules', () => {
  const root = process.cwd();
  const manifestRaw = fs.readFileSync(path.join(root, 'public', 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(manifestRaw);

  assert.equal(manifest.name, 'Günden Güne');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/#today');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);

  const swCode = fs.readFileSync(path.join(root, 'public', 'sw.js'), 'utf8');
  assert.match(swCode, /gunden-gune-shell-v1/);
  assert.match(swCode, /request\.mode === 'navigate'/);
  assert.match(swCode, /caches\.keys\(\)/);
});
