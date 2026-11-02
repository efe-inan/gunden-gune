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

export async function registerServiceWorker(
  nav = typeof navigator !== 'undefined' ? navigator : null,
  swUrl = '/sw.js'
) {
  if (!nav || !nav.serviceWorker || typeof nav.serviceWorker.register !== 'function') {
    return { registered: false };
  }

  try {
    await nav.serviceWorker.register(swUrl);
    return { registered: true };
  } catch {
    return { registered: false };
  }
}
