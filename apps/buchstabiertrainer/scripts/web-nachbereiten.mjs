// Ergänzt den Web-Export (dist/) um PWA-Manifest und Service Worker (offline nutzbar).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
const BASE = (app.experiments?.baseUrl ?? '') + '/';

const dateien = [];
const lauf = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) lauf(p);
    else dateien.push(path.relative(dist, p).split(path.sep).join('/'));
  }
};
lauf(dist);

const manifest = {
  name: 'PilotABC – Buchstabieren wie ein Pilot',
  short_name: 'PilotABC',
  description: app.description,
  lang: 'de',
  id: BASE,
  start_url: BASE,
  scope: BASE,
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#070b10',
  theme_color: '#070b10',
  categories: ['education'],
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
};
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

const precache = ['./', ...dateien.filter((f) => !f.endsWith('.map') && f !== 'sw.js').map((f) => './' + f)];
const hash = crypto.createHash('sha1');
for (const f of dateien) hash.update(f + fs.statSync(path.join(dist, f)).size);
const version = hash.digest('hex').slice(0, 10);

fs.writeFileSync(path.join(dist, 'sw.js'), `// Service Worker PilotABC – Version ${version}
const CACHE = 'buchstabiertrainer-${version}';
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x.startsWith('buchstabiertrainer-') && x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
`);
console.log(`✔ PWA ergänzt (${precache.length} Dateien im Offline-Cache, Version ${version}, Basis ${BASE})`);
