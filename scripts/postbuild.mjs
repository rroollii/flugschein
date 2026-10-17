// Kopiert den Single-File-Build nach OUT_DIR und ergänzt PWA-Dateien (Manifest, Service Worker, Icons)
// sowie GitHub-Pages-Hilfsdateien (.nojekyll, 404.html).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.env.OUT_DIR || path.join(root, '../../docs/plattform'));
// Pfad, unter dem die Seite gehostet wird (GitHub Pages: https://rroollii.github.io/flugschein/).
// Mit BASE_PATH=./ wird alles relativ (z. B. für Netlify-Root oder beliebige Unterordner).
let BASE = process.env.BASE_PATH ?? '/flugschein/';
if (BASE !== './' && !BASE.endsWith('/')) BASE += '/';

const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const version = crypto.createHash('sha1').update(html).digest('hex').slice(0, 10);

fs.mkdirSync(OUT, { recursive: true });
const GENERATED = ['index.html', 'flugschein-plattform.html', '404.html', 'manifest.webmanifest', 'sw.js', 'icon.svg', 'icon-192.png', 'icon-512.png', '.nojekyll', 'BUILD-INFO.txt'];
for (const f of GENERATED) fs.rmSync(path.join(OUT, f), { force: true });

fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'flugschein-plattform.html'), html);
fs.writeFileSync(path.join(OUT, '404.html'), html);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const icons = [];
for (const f of ['icon.svg', 'icon-192.png', 'icon-512.png']) {
  const src = path.join(root, 'public', f);
  if (!fs.existsSync(src)) continue;
  fs.copyFileSync(src, path.join(OUT, f));
  icons.push(f);
}

const manifest = {
  name: 'Flugschein – PPL(A)-Lernplattform',
  short_name: 'Flugschein',
  description: 'Skripte, Übungsfragen, Karteikasten, Lernplan und Flugbuch für die PPL(A)-Ausbildung – offline nutzbar.',
  lang: 'de',
  id: BASE,
  start_url: BASE,
  scope: BASE,
  display: 'standalone',
  orientation: 'any',
  background_color: '#0b1526',
  theme_color: '#1565c0',
  categories: ['education'],
  icons: [
    ...(icons.includes('icon-192.png') ? [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] : []),
    ...(icons.includes('icon-512.png') ? [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] : []),
    ...(icons.includes('icon.svg') ? [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }] : []),
  ],
};
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

const precache = ['./', './index.html', './manifest.webmanifest', ...icons.map((i) => './' + i)];
const sw = `// Service Worker – Version ${version} (wird bei jedem Build neu erzeugt)
const CACHE = 'flugschein-${version}';
const PRECACHE = ${JSON.stringify(precache)};
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
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const url = new URL(req.url);
  if (url.pathname.includes('/audio/')) {
    if (url.pathname.endsWith('/manifest.json')) {
      e.respondWith(fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(AUDIO).then((c) => c.put(url.pathname, copy)); }
        return res;
      }).catch(() => caches.open(AUDIO).then((c) => c.match(url.pathname))));
      return;
    }
    e.respondWith(caches.open(AUDIO).then((c) => c.match(url.pathname)).then((hit) => hit || fetch(req)));
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
`;
fs.writeFileSync(path.join(OUT, 'sw.js'), sw);

fs.writeFileSync(path.join(OUT, 'BUILD-INFO.txt'),
  `Flugschein-Plattform – Build ${new Date().toISOString()}\nVersion ${version}\nBase-Pfad (Manifest/PWA): ${BASE}\n` +
  `Neu bauen: bash internal/plattform-quellen/build.sh (siehe README.md dort)\n`);

const kb = (fs.statSync(path.join(OUT, 'index.html')).size / 1024).toFixed(0);
console.log(`✔ Plattform gebaut → ${OUT}`);
console.log(`  index.html + flugschein-plattform.html (${kb} KB, Single-File) · manifest · sw.js (v${version}) · Base ${BASE}`);
