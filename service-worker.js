// Daten
let cacheName = 'MyPersonalFavorites';
let filesToCache = [
    './',
    './index.html',
    'service-worker.js',
    './script.js',
    './manifest.json'

];
// Dateien in Cache speichern
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installation wird gestartet');
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Dateien werden gecachet');
            return cache.addAll(filesToCache);
        })
    );
});
// Dateien vom Cache laden
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Angeforderte URL: ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('[Service Worker] Ressource aus dem Cache geladen: ', event.request.url);
                return response;
            } else {
                console.log('[Service Worker] Ressource aus dem Netzwerk geladen: ', event.request.url);
                return fetch(event.request);
            }
        })
    );
});
