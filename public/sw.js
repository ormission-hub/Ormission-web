// Ormission High-Performance Service Worker for Web & Android WebView
const CACHE_NAME = 'ormission-cache-v2026';

const PRECACHE_ASSETS = [
  '/',
  '/courses',
  '/books',
  '/categories',
  '/free-resources',
  '/about',
  '/images/brand-logo-v2.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-warm the cache with core routes without blocking installation if one fails
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests from the same origin or Supabase/CDN assets
  if (request.method !== 'GET') return;

  // Ignore auth/api/admin routes from aggressive caching
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.includes('/auth/')
  ) {
    return;
  }

  // 1. Static Assets (Next.js chunks, CSS, JS, fonts, images) -> CACHE FIRST (Instant 0ms)
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg');

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. Navigation & HTML Pages -> STALE-WHILE-REVALIDATE / NETWORK WITH FAST TIMEOUT
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        // If cached page is available, return immediately or fallback to network
        return cached || fetchPromise;
      })
    );
  }
});
