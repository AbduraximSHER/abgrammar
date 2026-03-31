const CACHE_NAME = 'abgrammar-v1';
const SHELL = [
  './',
  './index.html',
  './dashboard.html',
  './placement-test.html',
  './features.js',
  './create-user-document.js',
  './assets/redesign.css',
  './darkmode.css',
  './manifest.json',
  './favicon.ico',
  './data/roadmap.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
