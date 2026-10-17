// Hörbuch: liest Skripte, Dokumente, Fragenkataloge und das Glossar mit der Sprachausgabe des Geräts vor
// (Web Speech API, keine Audiodateien). Gesprochen wird Satz für Satz, damit Pausieren, Springen und
// Hervorheben zuverlässig funktionieren – lange Äußerungen bricht Chrome sonst nach ca. 15 s ab.
import { useSyncExternalStore } from 'react';
import { C, skriptById, fachById, kapitelKey, getState, toggleGelesen } from './store.js';

export const BLOCK = 'h1,h2,h3,h4,h5,h6,p,li,tr,dt,dd';
const KEY = 'flugschein-hoerbuch-v1';
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
export const ttsSupported = !!synth && typeof SpeechSynthesisUtterance !== 'undefined';
export const RATES = [0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const CHARS_PER_SEC = 14;

// ---------- Quellen ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function fragenHtml(fachId) {
  return C.fragen.filter((q) => q.fachId === fachId).map((q, i) => (
    `<h3 id="frage-${i + 1}">Frage ${i + 1}</h3><p class="q-frage">${esc(q.frage)}</p>` +
    `<ul class="q-optionen">${q.antworten.map((a, k) => `<li${k === q.richtig ? ' class="richtig"' : ''}><strong>${LETTERS[k]})</strong> ${esc(a)}</li>`).join('')}</ul>` +
    `<p class="loesung"><strong>Lösung ${LETTERS[q.richtig]}:</strong> ${esc(q.antworten[q.richtig])}</p>` +
    (q.erklaerung ? `<p class="erklaerung">${esc(q.erklaerung)}</p>` : '')
  )).join('');
}
const glossarHtml = () => `<dl>${C.glossar.map((g) => `<dt>${esc(g.begriff)}</dt><dd>${g.html}</dd>`).join('')}</dl>`;

const cache = new Map();
export function getSource(type, id) {
  const key = `${type}:${id}`;
  if (cache.has(key)) return cache.get(key);
  let src = null;
  if (type === 'skript' && skriptById[id]) {
    const sk = skriptById[id];
    const f = fachById[sk.fachId];
    const base = sk.bereich === 'zusatz' ? 'zusatz' : 'skripte';
    src = {
      titel: sk.titel, icon: f?.icon || '📘', farbe: f?.farbe,
      parts: sk.kapitel.map((k) => ({ id: k.id, titel: k.titel, html: k.html, route: `/${base}/${sk.id}/${k.id}` })),
    };
  } else if (type === 'doc') {
    const d = C.dokumente.find((x) => x.id === id);
    if (d) src = { titel: d.titel, icon: '📄', parts: [{ id: 'doc', titel: d.titel, html: d.html, route: `/dokumente/${d.id}`, intro: d.titel }] };
  } else if (type === 'fragen' && fachById[id]) {
    const f = fachById[id];
    src = {
      titel: `Fragenkatalog ${f.name}`, icon: f.icon, farbe: f.farbe,
      parts: [{ id: 'alle', titel: `${f.name} – Fragen mit Lösungen`, html: fragenHtml(id), route: `/bibliothek/fragen/${id}`, intro: `Fragenkatalog ${f.name}` }],
    };
  } else if (type === 'glossar') {
    src = { titel: 'Glossar', icon: '📖', parts: [{ id: 'alle', titel: 'Glossar', html: glossarHtml(), route: '/bibliothek/glossar', intro: 'Glossar' }] };
  }
  if (src) {
    src = { ...src, type, id, key };
    for (const p of src.parts) p.zeichen = textOf(p.html).length;
    src.zeichen = src.parts.reduce((n, p) => n + p.zeichen, 0);
  }
  cache.set(key, src);
  return src;
}
export const minutenFuer = (zeichen, rate = 1) => Math.max(1, Math.round(zeichen / CHARS_PER_SEC / rate / 60));

// ---------- Text → Sätze ----------
const ABK = [
  [/\bz\.\s?B\./g, 'zum Beispiel'], [/\bd\.\s?h\./g, 'das heißt'], [/\bu\.\s?a\./g, 'unter anderem'], [/\bv\.\s?a\./g, 'vor allem'],
  [/\bo\.\s?Ä\./g, 'oder Ähnliches'], [/\bu\.\s?U\./g, 'unter Umständen'], [/\bi\.\s?d\.\s?R\./g, 'in der Regel'], [/\bs\.\s?o\./g, 'siehe oben'],
  [/\bs\.\s?u\./g, 'siehe unten'], [/\bbzw\./g, 'beziehungsweise'], [/\bca\./g, 'circa'], [/\bggf\./g, 'gegebenenfalls'], [/\binkl\./g, 'inklusive'],
  [/\bevtl\./g, 'eventuell'], [/\busw\./g, 'und so weiter'], [/\bvgl\./g, 'vergleiche'], [/\bmax\./g, 'maximal'], [/\bmind\./g, 'mindestens'],
  [/\bmin\.(?=\s+\d)/g, 'mindestens'], [/\bNr\./g, 'Nummer'], [/\bAbs\./g, 'Absatz'], [/\bArt\.(?=\s*\d)/g, 'Artikel'], [/\blt\./g, 'laut'],
  [/\bsog\./g, 'sogenannte'], [/\bgem\./g, 'gemäß'], [/\bbzgl\./g, 'bezüglich'], [/\bzzgl\./g, 'zuzüglich'], [/\btägl\./g, 'täglich'],
  [/\bStd\./g, 'Stunden'], [/\bAnm\./g, 'Anmerkung'],
  [/§§/g, 'Paragraphen '], [/§/g, 'Paragraph '], [/€/g, ' Euro'], [/(\d)\s?°C/g, '$1 Grad Celsius'], [/(\d)\s?°/g, '$1 Grad'],
  [/(\d)\s?km\/h\b/g, '$1 Kilometer pro Stunde'], [/(\d)\s?ft\/min\b/g, '$1 Fuß pro Minute'], [/(\d)\s?ft\b/g, '$1 Fuß'],
  [/(\d)\s?kt\b/g, '$1 Knoten'], [/(\d)\s?NM\b/g, '$1 nautische Meilen'], [/(\d)\s?hPa\b/g, '$1 Hektopascal'], [/(\d)\s?km\b/g, '$1 Kilometer'],
  [/(\d)\s?MHz\b/g, '$1 Megahertz'], [/(\d)\s?kHz\b/g, '$1 Kilohertz'], [/(\d)\s?kg\b/g, '$1 Kilogramm'], [/(\d)\s?min\b/g, '$1 Minuten'],
  [/(\d)\s?h\b/g, '$1 Stunden'], [/(\d)\s?m\b/g, '$1 Meter'], [/(\d)\s?l\b/g, '$1 Liter'],
  [/PPL\(A\)/g, 'PPL A'], [/LAPL\(A\)/g, 'LAPL A'], [/MEP\(land\)/g, 'MEP Land'], [/SEP\(land\)/g, 'SEP Land'],
  [/≥/g, ' mindestens '], [/≤/g, ' höchstens '], [/≈/g, ' etwa '], [/±/g, ' plus minus '], [/×/g, ' mal '], [/[→⇒➜]/g, ', '], [/[←↔]/g, ', '],
  [/\[prüfen[^\]]*\]/gi, ''], [/[*_#|`]/g, ' '], [/\s&\s/g, ' und '],
];
export function speakable(text) {
  let t = ' ' + text + ' ';
  t = t.replace(/\p{Extended_Pictographic}\uFE0F?/gu, ' ');
  for (const [re, r] of ABK) t = t.replace(re, r);
  return t.replace(/\s+([,.;:!?])/g, '$1').replace(/\s+/g, ' ').trim();
}
const MAX = 220;
function splitSentences(text) {
  const out = [];
  for (const s of text.split(/(?<=[.!?;:])\s+(?=[A-ZÄÖÜ0-9„"(])/)) {
    if (s.length <= MAX) { out.push(s); continue; }
    let rest = s;
    while (rest.length > MAX) {
      let cut = rest.lastIndexOf(', ', MAX);
      if (cut < 60) cut = rest.lastIndexOf(' ', MAX);
      if (cut < 30) cut = MAX;
      out.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) out.push(rest);
  }
  return out.filter((x) => /[\p{L}\p{N}]/u.test(x));
}
export function blockText(el) {
  if (el.tagName === 'TR') return [...el.children].map((c) => c.textContent.trim()).filter(Boolean).join('; ');
  const clone = el.cloneNode(true);
  clone.querySelectorAll(`${BLOCK},ul,ol,table,pre`).forEach((n) => n.remove());
  return clone.textContent;
}
function textOf(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return speakable(div.textContent || '');
}
const segCache = new Map();
function segmentsOf(part) {
  const key = part.route + '#' + part.id;
  if (segCache.has(key)) return segCache.get(key);
  const root = new DOMParser().parseFromString(`<div>${part.html}</div>`, 'text/html').body.firstElementChild;
  const segs = [];
  if (part.intro) segs.push({ b: -1, text: speakable(part.intro), h: 1 });
  root.querySelectorAll(BLOCK).forEach((el, b) => {
    const h = /^H(\d)$/.exec(el.tagName);
    const isLoesung = el.classList.contains('loesung');
    const text = speakable(blockText(el));
    if (!text) return;
    if (isLoesung) segs.push({ b, text: '', pause: 1800 });
    for (const t of splitSentences(text)) segs.push({ b, text: t, h: h ? Number(h[1]) : 0 });
  });
  segCache.set(key, segs);
  return segs;
}

// ---------- Zustand ----------
const loadStore = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};
const saved = loadStore();
const settings = { rate: 1, voiceURI: '', follow: true, markRead: false, weiter: true, wake: true, ...(saved.settings || {}) };
const positions = saved.positions || {};
let snap = {
  srcKey: null, src: null, part: 0, seg: 0, segs: [], playing: false, voices: [], settings: { ...settings },
  sleep: null, sleepUntil: 0, fehler: '', positions: { ...positions },
};
const listeners = new Set();
const emit = (patch = {}) => {
  snap = { ...snap, ...patch, settings: { ...settings }, positions: { ...positions } };
  listeners.forEach((l) => l());
};
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify({ settings, positions, last: snap.srcKey })); } catch { /* voll/gesperrt */ }
};
export const useTts = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => snap);
export const getTts = () => snap;

// ---------- Stimmen ----------
const voiceScore = (v) =>
  (v.lang === 'de-AT' ? 4 : v.lang?.startsWith('de') ? 3 : 0) +
  (/natural|neural|online|premium|enhanced|google/i.test(v.name) ? 2 : 0) + (v.localService ? 0.5 : 0);
export const germanVoices = () => snap.voices.filter((v) => v.lang?.toLowerCase().startsWith('de'));
function pickVoice() {
  const all = snap.voices;
  return all.find((v) => v.voiceURI === settings.voiceURI) || [...germanVoices()].sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
}
export function voiceFor(lang = 'de') {
  if (lang === 'de') return pickVoice();
  const score = (v) => (/natural|neural|online|premium|enhanced|google/i.test(v.name) ? 2 : 0) + (v.lang === 'en-GB' ? 1 : 0);
  return snap.voices.filter((v) => v.lang?.toLowerCase().startsWith(lang)).sort((a, b) => score(b) - score(a))[0] || null;
}
// Einzelner Satz außerhalb des Hörbuchs (Lernkarten, Funktraining); unterbricht ein laufendes Hörbuch.
export function sprich(text, lang = 'de', rate = settings.rate) {
  return new Promise((resolve) => {
    if (!ttsSupported || !text) return resolve(false);
    if (snap.playing) pause();
    synth.cancel();
    const clean = lang === 'de' ? speakable(text) : String(text).replace(/\p{Extended_Pictographic}\uFE0F?/gu, ' ').replace(/[*_#|`]/g, ' ');
    const u = new SpeechSynthesisUtterance(clean);
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.lang = v?.lang || (lang === 'en' ? 'en-GB' : 'de-DE');
    u.rate = rate;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    synth.speak(u);
  });
}
export const stille = () => synth?.cancel();

if (ttsSupported) {
  const load = () => emit({ voices: synth.getVoices() });
  load();
  synth.addEventListener?.('voiceschanged', load);
  setTimeout(load, 800);
}

// ---------- Bildschirm wach halten / Sperrbildschirm ----------
let wakeLock = null;
async function lockScreen(on) {
  try {
    if (on && settings.wake && 'wakeLock' in navigator && !wakeLock && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch { wakeLock = null; }
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (snap.playing) lockScreen(true); });

function mediaSession() {
  if (!('mediaSession' in navigator) || !snap.src) return;
  try {
    const p = snap.src.parts[snap.part];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: p?.titel || snap.src.titel, artist: snap.src.titel, album: 'Flugschein – Hörbuch',
      artwork: [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
    navigator.mediaSession.playbackState = snap.playing ? 'playing' : 'paused';
  } catch { /* nicht unterstützt */ }
}
if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
  const h = { play: () => resume(), pause: () => pause(), stop: () => pause(), nexttrack: () => skipSection(1), previoustrack: () => skipSection(-1), seekforward: () => skipSentence(1), seekbackward: () => skipSentence(-1) };
  for (const [k, f] of Object.entries(h)) { try { navigator.mediaSession.setActionHandler(k, f); } catch { /* Aktion unbekannt */ } }
}

// ---------- Wiedergabe ----------
let token = 0;
let timer = null;
let fehlerInFolge = 0;
const savePos = () => {
  if (!snap.srcKey) return;
  positions[snap.srcKey] = { part: snap.part, seg: snap.seg, t: Date.now() };
  persist();
};

function speakNext() {
  clearTimeout(timer);
  const my = ++token;
  if (!snap.playing) return;
  if (snap.sleepUntil && Date.now() >= snap.sleepUntil) { pause(); emit({ sleep: null, sleepUntil: 0 }); return; }
  const s = snap.segs[snap.seg];
  if (!s) { partEnded(); return; }
  if (s.pause) {
    timer = setTimeout(() => { if (my === token && snap.playing) { emit({ seg: snap.seg + 1 }); speakNext(); } }, s.pause / settings.rate);
    return;
  }
  const u = new SpeechSynthesisUtterance(s.text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang || 'de-DE';
  u.rate = settings.rate;
  u.onend = () => {
    if (my !== token || !snap.playing) return;
    fehlerInFolge = 0;
    emit({ seg: snap.seg + 1 });
    savePos();
    timer = setTimeout(speakNext, s.h ? 450 / settings.rate : 40);
  };
  u.onerror = (e) => {
    if (my !== token || e.error === 'interrupted' || e.error === 'canceled') return;
    if (e.error === 'not-allowed') { emit({ playing: false, fehler: 'Der Browser hat die Sprachausgabe blockiert – bitte noch einmal auf Abspielen tippen.' }); return; }
    if (++fehlerInFolge >= 3) {
      fehlerInFolge = 0;
      pause();
      emit({ fehler: 'Die Sprachausgabe funktioniert auf diesem Gerät gerade nicht. Bitte prüfen, ob eine deutsche Stimme installiert ist, oder eine andere Stimme wählen.' });
      return;
    }
    emit({ seg: snap.seg + 1 });
    timer = setTimeout(speakNext, 40);
  };
  synth.speak(u);
}

function partEnded() {
  const src = snap.src;
  const done = src.parts[snap.part];
  if (src.type === 'skript' && settings.markRead) {
    const k = kapitelKey(src.id, done.id);
    if (!getState().gelesen[k]) toggleGelesen(k);
  }
  const followFrom = location.hash.replace(/^#/, '').startsWith(done.route);
  let next = null;
  if (snap.sleep === 'kapitel') {
    next = null;
  } else if (snap.part + 1 < src.parts.length) {
    next = { src, part: snap.part + 1 };
  } else if (settings.weiter && src.type === 'skript' && skriptById[src.id]?.bereich !== 'zusatz') {
    const order = C.empfohleneReihenfolge.map((f) => fachById[f]?.skriptId).filter(Boolean);
    const nid = order[order.indexOf(src.id) + 1];
    if (nid) next = { src: getSource('skript', nid), part: 0 };
  }
  if (!next) {
    emit({ playing: false, seg: 0, sleep: null, sleepUntil: 0 });
    savePos();
    lockScreen(false);
    mediaSession();
    return;
  }
  load(next.src, next.part, 0);
  savePos();
  if (settings.follow && followFrom) location.hash = next.src.parts[next.part].route;
  mediaSession();
  timer = setTimeout(speakNext, 600 / settings.rate);
}

function load(src, part, seg) {
  const p = src.parts[Math.min(part, src.parts.length - 1)];
  const segs = segmentsOf(p);
  emit({ srcKey: src.key, src, part: src.parts.indexOf(p), seg: Math.min(seg, Math.max(0, segs.length - 1)), segs, fehler: '' });
}

// ---------- Öffentliche Steuerung ----------
export function play(type, id, part = null, seg = null) {
  if (!ttsSupported) return;
  const src = getSource(type, id);
  if (!src) return;
  const pos = positions[src.key];
  const usePos = part == null && pos;
  token++;
  synth.cancel();
  load(src, usePos ? pos.part : part ?? 0, usePos ? pos.seg : seg ?? 0);
  emit({ playing: true });
  savePos();
  lockScreen(true);
  mediaSession();
  speakNext();
}
export function pause() {
  token++;
  clearTimeout(timer);
  synth?.cancel();
  emit({ playing: false });
  savePos();
  lockScreen(false);
  mediaSession();
}
export function resume() {
  if (!snap.src) return;
  if (snap.seg >= snap.segs.length) emit({ seg: 0 });
  token++;
  synth.cancel();
  emit({ playing: true, fehler: '' });
  lockScreen(true);
  mediaSession();
  speakNext();
}
export const toggle = () => (snap.playing ? pause() : resume());
export function stop() {
  pause();
  emit({ srcKey: null, src: null, segs: [], part: 0, seg: 0, sleep: null, sleepUntil: 0 });
  persist();
}
function jump(seg) {
  const was = snap.playing;
  token++;
  clearTimeout(timer);
  synth.cancel();
  emit({ seg: Math.max(0, Math.min(seg, snap.segs.length - 1)) });
  savePos();
  if (was) timer = setTimeout(speakNext, 80);
}
export const skipSentence = (d) => snap.src && jump(snap.seg + d);
export function skipSection(d) {
  if (!snap.src) return;
  const heads = snap.segs.map((s, i) => (s.h && (i === 0 || snap.segs[i - 1].b !== s.b) ? i : -1)).filter((i) => i >= 0);
  if (d > 0) {
    const n = heads.find((i) => i > snap.seg);
    if (n != null) return jump(n);
    if (snap.part + 1 < snap.src.parts.length) return goPart(snap.part + 1);
  } else {
    const prev = heads.filter((i) => i < snap.seg - 2);
    if (prev.length) return jump(prev[prev.length - 1]);
    if (snap.seg > 2 || snap.part === 0) return jump(0);
    return goPart(snap.part - 1);
  }
}
export function goPart(part, block = null) {
  if (!snap.src) return;
  const was = snap.playing;
  token++;
  clearTimeout(timer);
  synth.cancel();
  load(snap.src, part, 0);
  if (block != null) {
    const i = snap.segs.findIndex((s) => s.b === block);
    if (i >= 0) emit({ seg: i });
  }
  savePos();
  mediaSession();
  if (was) timer = setTimeout(speakNext, 80);
}
export function playFrom(type, id, part, block) {
  const src = getSource(type, id);
  if (!src) return;
  if (snap.srcKey !== src.key) play(type, id, part, 0);
  goPart(part, block);
  if (!snap.playing) resume();
}
export function setSetting(k, v) {
  settings[k] = v;
  persist();
  emit();
  if (k === 'rate' || k === 'voiceURI') { if (snap.playing) jump(snap.seg); }
  if (k === 'wake') lockScreen(snap.playing && v);
}
export function setSleep(mode) {
  emit({ sleep: mode, sleepUntil: typeof mode === 'number' ? Date.now() + mode * 60000 : 0 });
}
export function restaurieren() {
  const key = saved.last;
  if (!key || snap.src) return;
  const [type, ...rest] = key.split(':');
  const src = getSource(type, rest.join(':'));
  const pos = positions[key];
  if (src && pos) load(src, pos.part, pos.seg);
}
export function lastListened() {
  const e = Object.entries(positions).sort((a, b) => b[1].t - a[1].t)[0];
  if (!e) return null;
  const [type, ...rest] = e[0].split(':');
  const src = getSource(type, rest.join(':'));
  return src ? { src, type, id: rest.join(':'), pos: e[1] } : null;
}
export function restMinuten(t = snap) {
  if (!t.src) return 0;
  const imTeil = t.segs.slice(t.seg).reduce((n, s) => n + s.text.length, 0);
  return minutenFuer(imTeil, settings.rate);
}
if (typeof window !== 'undefined') window.addEventListener('pagehide', () => { if (snap.playing) savePos(); });
