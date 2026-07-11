// Bump this whenever the caching strategy or precache list changes, so the
// activate handler below purges whatever is stuck in the old cache.
const CACHE = 'task-poker-v2';
const PRECACHE = ['/', '/pt', '/en', '/es', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests for same-origin non-session pages
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.includes('/session/')
  ) {
    return;
  }

  // Network-first: always prefer the freshest response so a deploy (or, in
  // dev, a rebuild) is never masked by a stale cached asset. Cache is only
  // used as an offline fallback.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
