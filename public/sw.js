const CACHE_NAME = 'gunden-gune-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon-32.png',
  '/favicon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    let navCacheWrite = Promise.resolve();
    const navFetch = fetch(request).then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        navCacheWrite = caches
          .open(CACHE_NAME)
          .then((cache) => cache.put('/index.html', copy))
          .catch(() => {});
      }
      return response;
    });

    event.waitUntil(navFetch.then(() => navCacheWrite).catch(() => {}));

    event.respondWith(
      navFetch.catch(() => caches.match('/index.html').then((cached) => cached || Response.error()))
    );
    return;
  }

  let cacheWritePromise = Promise.resolve();
  const networkFetch = fetch(request).then((response) => {
    if (response && response.ok && response.type === 'basic') {
      const copy = response.clone();
      cacheWritePromise = caches
        .open(CACHE_NAME)
        .then((cache) => cache.put(request, copy))
        .catch(() => {});
    }
    return response;
  });

  event.waitUntil(
    networkFetch
      .then(() => cacheWritePromise)
      .catch(() => {})
  );

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return networkFetch.catch(() => Response.error());
    })
  );
});
