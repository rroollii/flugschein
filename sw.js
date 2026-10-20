// Service Worker – Version a766a0427a (wird bei jedem Build neu erzeugt)
const CACHE = 'flugschein-a766a0427a';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];
// Audio (natürliche Stimmen) wird nie vorab geladen: nur was die App per „Offline verfügbar machen“ in
// diesen Cache legt, ist offline da; er überlebt App-Updates. manifest.json immer frisch aus dem Netz.
const AUDIO = 'flugschein-audio';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('flugschein-') && k !== CACHE && k !== AUDIO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
// Seiten: Netzwerk zuerst (für Updates), bei Offline aus dem Cache. Übrige Dateien: Cache zuerst.
// Gespeicherte MP3s als Teilantwort (206) liefern – Safari spielt Audio nur mit Range-Antworten.
async function ranged(req, res) {
  const range = req.headers.get('range');
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2] || 0));
  let end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  return new Response(buf.slice(start, end + 1), { status: 206, headers: {
    'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
    'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const rawAudio = url.hostname === 'raw.githubusercontent.com' && url.pathname.includes('/audio/');
  if (url.origin !== location.origin && !rawAudio) return;
  if (url.pathname.includes('/audio/') || rawAudio) {
    if (url.pathname.endsWith('/manifest.json')) {
      e.respondWith(fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(AUDIO).then((c) => c.put(req.url, copy)); }
        return res;
      }).catch(() => caches.open(AUDIO).then((c) => c.match(req.url, { ignoreSearch: true }))));
      return;
    }
    e.respondWith(caches.open(AUDIO).then((c) => c.match(req.url, { ignoreSearch: true })).then((hit) => (hit ? ranged(req, hit) : fetch(req))));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html')),
    );
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
