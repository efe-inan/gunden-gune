/**
 * pwa.js
 * Kurulabilir çevrimdışı PWA yardımcıları (Service Worker kaydı ve kurulum istemi yönetimi)
 */

let deferredPrompt = null;
let activeCleanup = null;

export function resetPwaStateForTests() {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
  deferredPrompt = null;
}

export function initPwaInstallListener(win = typeof window !== 'undefined' ? window : null) {
  if (!win || typeof win.addEventListener !== 'function') {
    return () => {};
  }

  if (activeCleanup) {
    activeCleanup();
  }

  const onBeforeInstallPrompt = (event) => {
    if (typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    deferredPrompt = event;
    if (typeof CustomEvent !== 'undefined' && typeof win.dispatchEvent === 'function') {
      win.dispatchEvent(new CustomEvent('pwainstallable', { detail: { installable: true } }));
    }
  };

  const onAppInstalled = () => {
    deferredPrompt = null;
    if (typeof CustomEvent !== 'undefined' && typeof win.dispatchEvent === 'function') {
      win.dispatchEvent(new CustomEvent('pwainstallable', { detail: { installable: false } }));
    }
  };

  win.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  win.addEventListener('appinstalled', onAppInstalled);

  activeCleanup = () => {
    win.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    win.removeEventListener('appinstalled', onAppInstalled);
  };

  return activeCleanup;
}

export function canInstallPwa() {
  return Boolean(deferredPrompt && typeof deferredPrompt.prompt === 'function');
}

export async function promptPwaInstall() {
  if (!deferredPrompt || typeof deferredPrompt.prompt !== 'function') {
    return { outcome: 'unavailable' };
  }

  const currentPrompt = deferredPrompt;
  deferredPrompt = null;

  try {
    await currentPrompt.prompt();
    const choice = await (currentPrompt.userChoice || Promise.resolve({ outcome: 'dismissed' }));
    const outcome = choice?.outcome === 'accepted' ? 'accepted' : 'dismissed';
    return { outcome };
  } catch {
    return { outcome: 'unavailable' };
  }
}

export const SHELL_CACHE_NAME = 'gunden-gune-shell-v1';

async function warmShellCache(env) {
  const cachesApi = env?.caches;
  const loc = env?.location;
  const doc = env?.document;

  if (
    !cachesApi ||
    typeof cachesApi.open !== 'function' ||
    !loc?.origin ||
    !doc ||
    typeof doc.querySelectorAll !== 'function'
  ) {
    return;
  }

  try {
    const baseHref = loc.href || loc.origin;
    const nodes = Array.from(doc.querySelectorAll('script[src], link[rel="stylesheet"][href]'));
    const urls = new Set();

    for (const node of nodes) {
      const raw = node.getAttribute?.('src') || node.getAttribute?.('href');
      if (!raw) continue;
      try {
        const parsed = new URL(raw, baseHref);
        if (parsed.origin === loc.origin) {
          urls.add(parsed.href);
        }
      } catch {
        // Ignore malformed asset URLs
      }
    }

    if (urls.size === 0) return;

    const cache = await cachesApi.open(SHELL_CACHE_NAME);
    for (const assetUrl of urls) {
      try {
        const existing = await cache.match(assetUrl);
        if (!existing) {
          await cache.add(assetUrl);
        }
      } catch {
        // Ignore individual asset cache failure
      }
    }
  } catch {
    // Ignore CacheStorage errors (e.g. private browsing restrictions)
  }
}

export async function registerServiceWorker(
  nav = typeof navigator !== 'undefined' ? navigator : null,
  swUrl = '/sw.js',
  env = {
    caches: typeof caches !== 'undefined' ? caches : null,
    location: typeof window !== 'undefined' ? window.location : null,
    document: typeof document !== 'undefined' ? document : null,
  }
) {
  if (!nav || !nav.serviceWorker || typeof nav.serviceWorker.register !== 'function') {
    return { registered: false };
  }

  try {
    await nav.serviceWorker.register(swUrl);
    await warmShellCache(env);
    return { registered: true };
  } catch {
    return { registered: false };
  }
}

