// 離線用：第一次開啟時把 App 檔案存進快取，之後沒有網路也能開。
// 18375cf5fc 由 tools/build_html.py 依檔案內容填入，內容一變就會換新快取。
const CACHE = 'app-18375cf5fc';
const FILES = ["./", "index.html", "app.enc", "manifest.webmanifest", "jszip.min.js", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('app-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
