const CACHE_NAME = 'guadalajara-map-cache-v1';

// List of resources to cache for offline use. Add here additional assets if
// you later incorporate more external files (like images or CSS). The map
// file itself, the manifest and this service worker are included.
const RESOURCES_TO_CACHE = [
  './guadalajara_clickable_svg_map.html',
  './manifest.webmanifest',
  './service-worker.js'
];

// Install event: cache the application shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: respond with cached resources when available, falling back to
// the network. This allows the app to work offline once it has been loaded
// at least once.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});