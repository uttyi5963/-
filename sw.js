// Minimal service worker for offline cache.
const CACHE = 'aiou-nihongo-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/js/app.js',
  './assets/js/storage.js',
  './assets/js/srs.js',
  './assets/js/audio.js',
  './assets/js/phonetics.js',
  './assets/js/ui.js',
  './assets/js/data/kana.js',
  './assets/js/data/vocab.js',
  './assets/js/data/grammar.js',
  './assets/js/data/tests.js',
  './assets/js/data/tasks.js',
  './assets/js/data/jobs.js',
  './assets/js/data/pitch.js',
  './assets/js/views/student.js',
  './assets/js/views/foundation.js',
  './assets/js/views/language.js',
  './assets/js/views/teacher.js',
  './assets/js/views/tests.js',
  './assets/js/views/community.js',
  './assets/js/views/jobs.js',
  './assets/js/views/admin.js',
  './assets/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resp) => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return resp;
      }).catch(() => cached);
    })
  );
});
