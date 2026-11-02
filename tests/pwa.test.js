import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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

function createSwHarness({ cachedEntries = new Map(), fetchImpl }) {
  const listeners = new Map();
  const putCalls = [];

  const cacheObj = {
    async addAll() {},
    async match(req) {
      const key = typeof req === 'string' ? req : req.url;
      return cachedEntries.get(key);
    },
    async put(req, res) {
      const key = typeof req === 'string' ? req : req.url;
      putCalls.push({ key, res });
      cachedEntries.set(key, res);
    },
  };

  const cachesMock = {
    async open() {
      return cacheObj;
    },
    async match(req) {
      const key = typeof req === 'string' ? req : req.url;
      return cachedEntries.get(key);
    },
    async keys() {
      return ['gunden-gune-shell-v1'];
    },
    async delete() {
      return true;
    },
  };

  const selfMock = {
    location: { origin: 'https://gunden-gune.vercel.app' },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
  };

  const swCode = fs.readFileSync(path.join(process.cwd(), 'public', 'sw.js'), 'utf8');
  vm.runInNewContext(swCode, {
    self: selfMock,
    caches: cachesMock,
    fetch: fetchImpl,
    URL,
    Response,
    Promise,
  });

  return { listeners, putCalls };
}

test('sw.js stale-while-revalidate registers background network revalidation with event.waitUntil', async () => {
  const assetUrl = 'https://gunden-gune.vercel.app/assets/index-abc.js';
  const staleRes = new Response('console.log("stale")', { status: 200 });
  const freshRes = new Response('console.log("fresh")', { status: 200 });
  Object.defineProperty(freshRes, 'type', { value: 'basic' });

  const { listeners, putCalls } = createSwHarness({
    cachedEntries: new Map([[assetUrl, staleRes]]),
    fetchImpl: async () => freshRes,
  });

  const waitUntilPromises = [];
  let respondedPromise = null;
  listeners.get('fetch')({
    request: { url: assetUrl, method: 'GET', mode: 'cors' },
    waitUntil(p) {
      waitUntilPromises.push(p);
    },
    respondWith(p) {
      respondedPromise = p;
    },
  });

  const immediate = await respondedPromise;
  assert.equal(immediate, staleRes);
  assert.ok(waitUntilPromises.length >= 1, 'Expected event.waitUntil to keep SW alive during revalidation');

  await Promise.all(waitUntilPromises);
  assert.equal(putCalls.length, 1);
  assert.equal(putCalls[0].key, assetUrl);
});

test('sw.js returns a valid error Response instead of undefined on offline cache miss', async () => {
  const missingUrl = 'https://gunden-gune.vercel.app/assets/missing.js';
  const { listeners } = createSwHarness({
    cachedEntries: new Map(),
    fetchImpl: async () => {
      throw new Error('Network offline');
    },
  });

  let respondedPromise = null;
  listeners.get('fetch')({
    request: { url: missingUrl, method: 'GET', mode: 'cors' },
    waitUntil() {},
    respondWith(p) {
      respondedPromise = p;
    },
  });

  const res = await respondedPromise;
  assert.notEqual(res, undefined, 'event.respondWith must not resolve to undefined');
  assert.equal(res instanceof Response, true);
  assert.equal(res.ok, false);
});

test('registerServiceWorker warms shell cache with loaded same-origin script and stylesheet assets', async () => {
  const addedUrls = [];
  const cachesMock = {
    async open(name) {
      assert.equal(name, 'gunden-gune-shell-v1');
      return {
        async match() {
          return undefined;
        },
        async add(url) {
          addedUrls.push(url);
        },
      };
    },
  };

  const docWithAssets = {
    querySelectorAll() {
      return [
        { getAttribute: (k) => (k === 'src' ? '/assets/index-123.js' : null) },
        { getAttribute: (k) => (k === 'href' ? '/assets/index-456.css' : null) },
        { getAttribute: (k) => (k === 'src' ? 'https://cdn.example.com/other.js' : null) },
      ];
    },
  };

  const okNav = {
    serviceWorker: {
      register: async () => ({ scope: '/' }),
    },
  };

  const result = await registerServiceWorker(okNav, '/sw.js', {
    caches: cachesMock,
    location: { origin: 'https://gunden-gune.vercel.app', href: 'https://gunden-gune.vercel.app/#today' },
    document: docWithAssets,
  });

  assert.deepEqual(result, { registered: true });
  assert.deepEqual(addedUrls, [
    'https://gunden-gune.vercel.app/assets/index-123.js',
    'https://gunden-gune.vercel.app/assets/index-456.css',
  ]);
});


