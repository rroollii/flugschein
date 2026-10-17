// Natürliche Stimmen: vorab gerenderte MP3s aus dem Branch `audio` (Schema: README.md dort).
// Ausgeliefert über GitHub Pages unter ./audio/ (gleiche Herkunft → Service-Worker-Cache, CDN);
// ist das nicht erreichbar (z. B. Einzeldatei per file://), wird raw.githubusercontent.com verwendet.
import { useSyncExternalStore } from 'react';

const RAW = 'https://raw.githubusercontent.com/rroollii/flugschein/audio/';
export const AUDIO_CACHE = 'flugschein-audio';
export const STIMMEN = { frau: 'Frau', mann: 'Mann' };
export const andereStimme = (s) => (s === 'mann' ? 'frau' : 'mann');

export const fnv1a = (s) => { let h = 0x811c9dc5; for (const b of new TextEncoder().encode(s)) h = Math.imul(h ^ b, 0x01000193) >>> 0; return h.toString(16).padStart(8, '0'); };
export const textHash = (segs) => fnv1a(segs.map((s) => (s.pause ? `#${s.pause}` : s.text)).join('\n'));

let snap = { status: 'laden', manifest: null, base: null, offline: {} };
const listeners = new Set();
const emit = (patch) => { snap = { ...snap, ...patch }; listeners.forEach((l) => l()); };
export const useAudio = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => snap);
export const getAudio = () => snap;

let promise = null;
export function ladeManifest() {
  if (promise) return promise;
  promise = (async () => {
    const versuche = [];
    if (typeof location !== 'undefined' && /^https?:$/.test(location.protocol)) versuche.push([new URL('audio/manifest.json', document.baseURI).href, new URL('./', document.baseURI).href]);
    versuche.push([RAW + 'manifest.json', RAW]);
    for (const [url, base] of versuche) {
      try {
        const r = await fetch(url, { cache: 'no-cache' });
        if (!r.ok) continue;
        const m = await r.json();
        if (m?.hoerbuch) { emit({ status: 'ok', manifest: m, base }); return m; }
      } catch { /* nächste Quelle */ }
    }
    emit({ status: 'fehlt' });
    return null;
  })();
  return promise;
}

const urlFor = (datei) => new URL(datei, snap.base).href;
const altFor = (datei) => (snap.base === RAW ? null : RAW + datei);
const eintrag = (e, stimme) => (e?.[stimme]?.datei ? { ...e[stimme], url: urlFor(e[stimme].datei), alt: altFor(e[stimme].datei) } : null);

// Hörbuch-Teil: nur verwenden, wenn Segmentzahl und Text-Hash zur aktuellen Segmentierung passen.
export function hoerbuchClip(srcKey, partId, segs, stimme) {
  const m = snap.manifest;
  if (!m) return { grund: snap.status === 'laden' ? 'laden' : 'fehlt' };
  const e = m.hoerbuch?.[srcKey]?.[partId];
  if (!e) return { grund: 'fehlt' };
  if (e.n !== segs.length || e.hash !== textHash(segs)) return { grund: 'geaendert' };
  return eintrag(e, stimme) || { grund: 'fehlt' };
}

export function funkClip(szenarioId, index, text, stimme) {
  const e = snap.manifest?.funkuebungen?.[szenarioId]?.[String(index)];
  if (!e || e.hash !== fnv1a(String(text))) return null;
  return eintrag(e, stimme);
}

export function dialogClip(srcKey, partId, pre, stimme) {
  const e = (snap.manifest?.dialoge?.[srcKey]?.[partId] || []).find((d) => d.pre === pre);
  if (!e) return null;
  const c = eintrag(e, stimme);
  return c && { ...c, rollen: e.rollen };
}

// ---------- Einzelne Clips (Funktraining, Dialoge) ----------
let clipEl = null;
let clipDone = null;
export function stopClip() {
  if (clipEl) { clipEl.pause(); clipEl.ontimeupdate = null; }
  if (clipDone) { const d = clipDone; clipDone = null; d(null); }
}
// Ergebnis: true = zu Ende gespielt, false = Fehler (Ersatz verwenden), null = abgebrochen.
export function playClip(c, { rate = 1, onTime } = {}) {
  stopClip();
  if (!c?.url || typeof Audio === 'undefined') return Promise.resolve(false);
  clipEl ||= new Audio();
  const a = clipEl;
  return new Promise((resolve) => {
    let fertig = false;
    const done = (ok) => { if (fertig) return; fertig = true; if (clipDone === done) clipDone = null; a.onended = a.onerror = a.ontimeupdate = null; resolve(ok); };
    clipDone = done;
    const start = (url, alt) => {
      a.src = url;
      a.playbackRate = rate;
      a.onended = () => done(true);
      a.onerror = () => (alt ? start(alt, null) : done(false));
      a.ontimeupdate = onTime ? () => onTime(a.currentTime * 1000) : null;
      a.play().catch((e) => { if (e?.name === 'NotAllowedError' || !alt) done(false); });
    };
    start(c.url, c.alt);
  });
}

// ---------- Offline verfügbar machen (je Fach/Paket) ----------
const KB_PRO_MS = 4 / 1024; // 32 kbit/s

export function audioPakete(C, stimme) {
  const m = snap.manifest;
  if (!m) return [];
  const fachBySkript = Object.fromEntries(C.faecher.filter((f) => f.skriptId).map((f) => [f.skriptId, f]));
  const dateien = (eintraege, stimmen = [stimme]) => eintraege.flatMap((e) => stimmen.map((s) => e?.[s]).filter((x) => x?.datei));
  const hb = (key) => Object.values(m.hoerbuch?.[key] || {});
  const pakete = C.skripte.map((sk) => {
    const f = fachBySkript[sk.id] || C.faecher.find((x) => x.id === sk.fachId);
    const fragen = f ? hb(`fragen:${f.id}`) : [];
    const dlg = Object.values(m.dialoge?.[`skript:${sk.id}`] || {}).flat();
    return { id: `skript:${sk.id}`, titel: sk.titel, icon: f?.icon || '📘', farbe: f?.farbe, zusatz: sk.bereich === 'zusatz',
      info: `Skript${fragen.length ? ' + Fragenkatalog' : ''}${dlg.length ? ' + Funk-Dialoge' : ''}`, files: dateien([...hb(`skript:${sk.id}`), ...fragen, ...dlg]) };
  });
  const rest = [...C.dokumente.map((d) => `doc:${d.id}`), 'glossar:alle'].flatMap(hb);
  pakete.push({ id: 'allgemein', titel: 'Dokumente & Glossar', icon: '📄', info: `${C.dokumente.length} Dokumente + Glossar`, files: dateien(rest) });
  const funk = Object.values(m.funkuebungen || {}).flatMap((sz) => Object.values(sz));
  pakete.push({ id: 'funk', titel: 'Funktraining', icon: '📻', info: `${Object.keys(m.funkuebungen || {}).length} Szenarien (beide Stimmen)`, files: dateien(funk, ['frau', 'mann']) });
  return pakete.filter((p) => p.files.length).map((p) => ({
    ...p, urls: p.files.map((x) => urlFor(x.datei)), kb: Math.round(p.files.reduce((n, x) => n + x.ms * KB_PRO_MS, 0)),
    minuten: Math.round(p.files.reduce((n, x) => n + x.ms, 0) / 60000),
  }));
}

export const offlineMoeglich = () => typeof caches !== 'undefined' && typeof location !== 'undefined' && /^https?:$/.test(location.protocol);

export async function offlineStand(pakete) {
  if (!offlineMoeglich()) return;
  const c = await caches.open(AUDIO_CACHE);
  const da = new Set((await c.keys()).map((r) => r.url));
  const offline = {};
  for (const p of pakete) offline[p.id] = p.urls.filter((u) => da.has(u)).length / p.urls.length;
  emit({ offline });
}

export async function machOffline(paket, onFortschritt) {
  const c = await caches.open(AUDIO_CACHE);
  try { await navigator.storage?.persist?.(); } catch { /* optional */ }
  const da = new Set((await c.keys()).map((r) => r.url));
  const offen = paket.urls.filter((u) => !da.has(u));
  let fertig = paket.urls.length - offen.length;
  let fehler = 0;
  const arbeiter = async () => {
    while (offen.length) {
      const u = offen.shift();
      try {
        const r = await fetch(u, { cache: 'no-store' });
        if (!r.ok) throw new Error(r.status);
        await c.put(u, r);
      } catch { fehler++; }
      fertig++;
      onFortschritt?.(fertig / paket.urls.length);
    }
  };
  await Promise.all([1, 2, 3, 4].map(arbeiter));
  try { const m = new URL('audio/manifest.json', document.baseURI).href; const r = await fetch(m); if (r.ok) await c.put(m, r); } catch { /* offline */ }
  emit({ offline: { ...snap.offline, [paket.id]: (paket.urls.length - fehler) / paket.urls.length } });
  return fehler;
}

export async function entferneOffline(paket) {
  const c = await caches.open(AUDIO_CACHE);
  await Promise.all(paket.urls.map((u) => c.delete(u)));
  emit({ offline: { ...snap.offline, [paket.id]: 0 } });
}
