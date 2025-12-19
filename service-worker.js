const CACHE_NAME = 'm3d-cache-v3';
const PRECACHE = [
  './', './index.html', './style.css', './main.js', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-512-maskable.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
