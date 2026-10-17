// Geräte-Sync ohne eigenen Server: privates GitHub Gist (Token nur lokal) oder Übertragung per Link/QR-Code.
import { getState, setState, normalize, onChange, TRACKED, SCHEMA } from './store.js';

const KEY = 'flugschein-sync-v1';
const FILE = 'flugschein-fortschritt.json';
const API = 'https://api.github.com';

// ---------- Zusammenführen ----------
// Je Eintrag gewinnt die jüngere Änderung (auch Löschungen, über state.ts); Lernstatistik je Frage/Karte
// nach Anzahl der Antworten, Aktivität als Maximum, Prüfungen und Flüge als Vereinigung.
const newer = (a, b) => ((b.n || 0) > (a.n || 0) || ((b.n || 0) === (a.n || 0) && (b.last || '') > (a.last || '')) ? b : a);
export function merge(aIn, bIn) {
  const a = normalize(aIn), b = normalize(bIn);
  const out = structuredClone(a);
  out.ts = { ...a.ts };
  for (const [k, v] of Object.entries(b.ts)) if (!out.ts[k] || v > out.ts[k]) out.ts[k] = v;
  for (const bereich of TRACKED) {
    out[bereich] = {};
    for (const k of new Set([...Object.keys(a[bereich]), ...Object.keys(b[bereich]), ...Object.keys(out.ts).filter((x) => x.startsWith(bereich + '|')).map((x) => x.slice(bereich.length + 1))])) {
      const ta = a.ts[`${bereich}|${k}`] || 0, tb = b.ts[`${bereich}|${k}`] || 0;
      const src = tb > ta ? b : ta > tb ? a : (k in a[bereich] ? a : b);
      if (k in src[bereich]) out[bereich][k] = src[bereich][k];
    }
  }
  for (const key of ['fragen', 'karten']) {
    out[key] = { ...a[key] };
    for (const [id, r] of Object.entries(b[key])) out[key][id] = out[key][id] ? newer(out[key][id], r) : r;
  }
  for (const [d, n] of Object.entries(b.aktivitaet)) out.aktivitaet[d] = Math.max(a.aktivitaet[d] || 0, n);
  const flights = new Map();
  for (const f of [...a.logbuch, ...b.logbuch]) {
    const t = (a.logbuch.includes(f) ? a : b).ts[`logbuch|${f.id}`] || 0;
    const cur = flights.get(f.id);
    if (!cur || t > cur.t) flights.set(f.id, { f, t });
  }
  const deleted = (id) => {
    const t = out.ts[`logbuch|${id}`] || 0;
    const inA = a.logbuch.some((f) => f.id === id), inB = b.logbuch.some((f) => f.id === id);
    if (inA && inB) return false;
    const holder = inA ? a : b, other = inA ? b : a;
    return t > 0 && (other.ts[`logbuch|${id}`] || 0) > (holder.ts[`logbuch|${id}`] || 0);
  };
  out.logbuch = [...flights.values()].map((x) => x.f).filter((f) => !deleted(f.id));
  const ex = new Set(a.pruefungen.map((p) => p.datum));
  out.pruefungen = [...a.pruefungen, ...b.pruefungen.filter((p) => !ex.has(p.datum))].sort((x, y) => x.datum.localeCompare(y.datum));
  if ((b.ts.settings || 0) > (a.ts.settings || 0)) out.settings = { ...b.settings };
  return out;
}

// ---------- Einstellungen ----------
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
let cfg = { token: '', gistId: '', auto: true, last: null, lastError: '', ...load() };
const listeners = new Set();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch { /* gesperrt */ } listeners.forEach((l) => l()); };
export const getSync = () => cfg;
export const subscribeSync = (l) => (listeners.add(l), () => listeners.delete(l));
export function setSync(patch) { cfg = { ...cfg, ...patch }; save(); }
export function disconnect() { cfg = { token: '', gistId: '', auto: true, last: null, lastError: '' }; save(); }

// ---------- GitHub Gist ----------
async function gh(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${cfg.token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (res.status === 401) throw new Error('Token ungültig oder abgelaufen.');
  if (res.status === 403 || res.status === 404) {
    const scopes = res.headers.get('x-oauth-scopes');
    throw new Error(scopes != null && !/gist/.test(scopes) ? 'Dem Token fehlt die Berechtigung „gist“.' : `GitHub meldet ${res.status}.`);
  }
  if (!res.ok) throw new Error(`GitHub meldet ${res.status}.`);
  return res.json();
}
async function findGist() {
  if (cfg.gistId) return cfg.gistId;
  for (let page = 1; page <= 5; page++) {
    const list = await gh(`/gists?per_page=100&page=${page}`);
    const hit = list.find((g) => g.files && g.files[FILE]);
    if (hit) return hit.id;
    if (list.length < 100) break;
  }
  return null;
}
async function readGist(id) {
  const g = await gh(`/gists/${id}`);
  const f = g.files?.[FILE];
  if (!f) return null;
  const text = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
  return JSON.parse(text);
}
let running = null;
export function syncNow() {
  if (!cfg.token) return Promise.reject(new Error('Kein Token hinterlegt.'));
  if (running) return running;
  running = (async () => {
    try {
      let id = await findGist();
      let remote = null;
      if (id) remote = await readGist(id).catch((e) => { if (/404/.test(e.message)) { id = null; return null; } throw e; });
      const merged = remote && (remote.schema === SCHEMA || remote.fragen) ? merge(getState(), remote) : getState();
      const body = JSON.stringify({ ...merged, schema: SCHEMA, synchronisiert: new Date().toISOString() });
      if (id) await gh(`/gists/${id}`, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: body } } }) });
      else {
        const g = await gh('/gists', { method: 'POST', body: JSON.stringify({ description: 'Flugschein – Lernfortschritt (automatisch synchronisiert)', public: false, files: { [FILE]: { content: body } } }) });
        id = g.id;
      }
      if (JSON.stringify(merged) !== JSON.stringify(getState())) applying(() => setState(merged));
      setSync({ gistId: id, last: new Date().toISOString(), lastError: '' });
      return { ok: true, remote: !!remote };
    } catch (e) {
      setSync({ lastError: e.message });
      throw e;
    } finally {
      running = null;
    }
  })();
  return running;
}

// Automatischer Sync: beim Start, 20 s nach der letzten Änderung und beim Verlassen der Seite.
let silent = false;
const applying = (fn) => { silent = true; try { fn(); } finally { silent = false; } };
let timer = null;
export function startAutoSync() {
  const run = () => { if (cfg.token && cfg.auto && navigator.onLine !== false) syncNow().catch(() => {}); };
  setTimeout(run, 1500);
  onChange(() => {
    if (silent || !cfg.token || !cfg.auto) return;
    clearTimeout(timer);
    timer = setTimeout(run, 20000);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && timer) { clearTimeout(timer); timer = null; run(); }
    if (document.visibilityState === 'visible') run();
  });
  window.addEventListener('online', run);
}

// ---------- Übertragung per Link / QR-Code ----------
const b64url = (bytes) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}
export async function encodeState(state = getState()) {
  const json = new TextEncoder().encode(JSON.stringify(state));
  if (typeof CompressionStream === 'undefined') return 'j' + b64url(json);
  return 'z' + b64url(await pipe(json, new CompressionStream('deflate-raw')));
}
export async function decodeState(code) {
  const kind = code[0];
  const bytes = fromB64url(code.slice(1));
  const raw = kind === 'z' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes;
  const data = JSON.parse(new TextDecoder().decode(raw));
  if (data.schema !== SCHEMA && !data.fragen) throw new Error('Kein Flugschein-Fortschritt.');
  return normalize(data);
}
export const transferLink = (code) => `${location.origin}${location.pathname}#/sync?d=${code}`;
