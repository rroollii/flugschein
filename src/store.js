import { useSyncExternalStore } from 'react';
import content from './generated/content.json';

export const KEY = 'flugschein-fortschritt-v1';
export const SCHEMA = 'flugschein-fortschritt';

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const addDays = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
};
export const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);

const mondayOf = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  const wd = (d.getDay() + 6) % 7;
  return addDays(iso, -wd);
};

export const emptyState = () => ({
  schema: SCHEMA,
  version: 1,
  settings: { name: '', startDatum: mondayOf(today()), neueKartenProTag: 15, theme: 'auto' },
  checks: {},
  gelesen: {},
  logbuch: [],
  fristen: {},
  fragen: {},
  gemerkt: {},
  pruefungen: [],
  aktivitaet: {},
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return normalize(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function normalize(s) {
  const e = emptyState();
  const out = { ...e, ...s, settings: { ...e.settings, ...(s.settings || {}) } };
  for (const k of ['checks', 'gelesen', 'fristen', 'fragen', 'gemerkt', 'aktivitaet']) if (typeof out[k] !== 'object' || Array.isArray(out[k]) || !out[k]) out[k] = {};
  for (const k of ['logbuch', 'pruefungen']) if (!Array.isArray(out[k])) out[k] = [];
  return out;
}

let state = load();
const listeners = new Set();
let storageOk = true;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

export const isStorageOk = () => storageOk;
export const getState = () => state;
export function setState(next) {
  state = normalize(next);
  persist();
  listeners.forEach((l) => l());
}
export function update(fn) {
  const next = structuredClone(state);
  fn(next);
  state = next;
  persist();
  listeners.forEach((l) => l());
}
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useAppState = () => useSyncExternalStore(subscribe, () => state);

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    state = load();
    listeners.forEach((l) => l());
  }
});

// ---------- Aktionen ----------
export const toggleCheck = (id) =>
  update((s) => {
    if (s.checks[id]) delete s.checks[id];
    else s.checks[id] = today();
    bump(s);
  });
export const toggleGelesen = (id) =>
  update((s) => {
    if (s.gelesen[id]) delete s.gelesen[id];
    else s.gelesen[id] = today();
    bump(s);
  });
export const toggleGemerkt = (qid) =>
  update((s) => {
    if (s.gemerkt[qid]) delete s.gemerkt[qid];
    else s.gemerkt[qid] = today();
  });

function bump(s, n = 1) {
  const t = today();
  s.aktivitaet[t] = (s.aktivitaet[t] || 0) + n;
}

// Karteikasten nach Leitner: 5 Fächer, Intervalle in Tagen
export const LEITNER = [0, 1, 2, 4, 8, 16];
export function recordAnswer(qid, ok) {
  update((s) => applyAnswer(s, qid, ok));
}
export function applyAnswer(s, qid, ok) {
  const t = today();
  const q = s.fragen[qid] || { n: 0, ok: 0, box: 0 };
  q.n += 1;
  if (ok) q.ok += 1;
  q.last = t;
  q.lastOk = !!ok;
  q.box = ok ? Math.min(5, (q.box || 0) + 1) : 1;
  q.due = addDays(t, LEITNER[q.box]);
  s.fragen[qid] = q;
  bump(s);
}
export function recordExam(result) {
  update((s) => {
    for (const a of result.antworten) if (a.gewaehlt != null) applyAnswer(s, a.id, a.ok);
    s.pruefungen.push({
      datum: new Date().toISOString(), fachId: result.fachId, titel: result.titel, anzahl: result.anzahl,
      richtig: result.richtig, prozent: result.prozent, dauerSek: result.dauerSek, bestanden: result.bestanden,
    });
  });
}

// ---------- Abgeleitete Werte ----------
export const C = content;
export const fachById = Object.fromEntries(content.faecher.map((f) => [f.id, f]));
export const frageById = Object.fromEntries(content.fragen.map((q) => [q.id, q]));
export const skriptById = Object.fromEntries(content.skripte.map((s) => [s.id, s]));
export const kapitelKey = (skriptId, kapId) => `${skriptId}/${kapId}`;

export function skriptProgress(s, skript) {
  const ks = skript.kapitel.filter((k) => k.zaehlt);
  const done = ks.filter((k) => s.gelesen[kapitelKey(skript.id, k.id)]).length;
  return { done, total: ks.length, pct: ks.length ? done / ks.length : 0 };
}
export function allSkriptProgress(s) {
  let done = 0, total = 0;
  for (const sk of content.skripte.filter((x) => x.bereich !== 'zusatz')) {
    const p = skriptProgress(s, sk);
    done += p.done;
    total += p.total;
  }
  return { done, total, pct: total ? done / total : 0 };
}
export function fachStats(s, fachId) {
  const qs = content.fragen.filter((q) => (fachId ? q.fachId === fachId : !fachById[q.fachId]?.zusatz));
  let beantwortet = 0, richtigZuletzt = 0, sicher = 0, versuche = 0, richtig = 0, falsch = 0, faellig = 0;
  const t = today();
  const boxes = [0, 0, 0, 0, 0, 0];
  for (const q of qs) {
    const r = s.fragen[q.id];
    if (!r) { boxes[0]++; continue; }
    beantwortet++;
    versuche += r.n;
    richtig += r.ok;
    if (r.lastOk) richtigZuletzt++;
    else falsch++;
    if (r.box >= 3) sicher++;
    if (r.due && r.due <= t) faellig++;
    boxes[r.box || 0]++;
  }
  return {
    total: qs.length, beantwortet, richtigZuletzt, sicher, falsch, faellig, boxes,
    quote: versuche ? richtig / versuche : 0,
    quoteZuletzt: beantwortet ? richtigZuletzt / beantwortet : 0,
    abdeckung: qs.length ? beantwortet / qs.length : 0,
    beherrscht: qs.length ? sicher / qs.length : 0,
  };
}
export function checklistProgress(s, items) {
  const done = items.filter((i) => s.checks[i.id]).length;
  return { done, total: items.length, pct: items.length ? done / items.length : 0 };
}
export const phaseItems = (p) => [...p.items, ...(p.meilenstein ? [p.meilenstein] : [])];
export const allPhaseItems = () => content.ausbildung.phasen.filter((p) => p.phaseNr != null).flatMap(phaseItems);

export function logTotals(s) {
  const t = { gesamt: 0, dual: 0, solo: 0, ueberlandSolo: 0, ueberlandDual: 0, landungen: 0, fluege: s.logbuch.length, langerUeberland: false };
  for (const f of s.logbuch) {
    const h = (Number(f.minuten) || 0) / 60;
    t.gesamt += h;
    if (f.art === 'solo') {
      t.solo += h;
      if (f.ueberland) t.ueberlandSolo += h;
      if (f.langerUeberland) t.langerUeberland = true;
    } else {
      t.dual += h;
      if (f.ueberland) t.ueberlandDual += h;
    }
    t.landungen += Number(f.landungen) || 0;
  }
  return t;
}
export function flightProgress(s) {
  const m = content.ausbildung.minima;
  const t = logTotals(s);
  const parts = [
    Math.min(1, t.gesamt / m.gesamt), Math.min(1, t.dual / m.dual), Math.min(1, t.solo / m.solo),
    Math.min(1, t.ueberlandSolo / m.ueberlandSolo), t.langerUeberland ? 1 : 0,
  ];
  return { ...t, pct: parts.reduce((a, b) => a + b, 0) / parts.length };
}

export function currentWeek(s) {
  const start = s.settings.startDatum || today();
  const d = daysBetween(start, today());
  return d < 0 ? 0 : Math.floor(d / 7) + 1;
}
export const weekDates = (s, nr) => {
  const start = s.settings.startDatum || today();
  return [addDays(start, (nr - 1) * 7), addDays(start, (nr - 1) * 7 + 6)];
};
export const weekOf = (w, nr) => w.nr === nr || (w.bis && nr >= w.nr && nr <= w.bis);

export function streak(s) {
  let n = 0;
  let d = today();
  if (!s.aktivitaet[d]) d = addDays(d, -1);
  while (s.aktivitaet[d]) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function dueCards(s, fachIds = null, newLimit = null) {
  const t = today();
  const pool = content.fragen.filter((q) => (fachIds && fachIds.length ? fachIds.includes(q.fachId) : !fachById[q.fachId]?.zusatz));
  const due = pool.filter((q) => s.fragen[q.id] && s.fragen[q.id].due <= t);
  const neu = pool.filter((q) => !s.fragen[q.id]);
  const lim = newLimit ?? s.settings.neueKartenProTag ?? 15;
  const newToday = Object.values(s.fragen).filter((r) => r.n === 1 && r.last === t).length;
  return { due, neu, neuHeute: neu.slice(0, Math.max(0, lim - newToday)) };
}
