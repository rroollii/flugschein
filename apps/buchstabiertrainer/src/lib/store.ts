import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import type { UiSprache } from '../i18n';

export type Eingabe = 'sprache' | 'tippen' | 'selbst';
export type Lauf = {
  id: string;
  ts: number;
  modus: 'sprint' | 'kennzeichen' | 'woerter' | 'nachtraining';
  n: number;
  ziffern: boolean;
  eingabe: Eingabe;
  ms: number;
  fehler: number;
  hinweise: number;
};
export type SymStat = { n: number; ok: number; falsch: number; msSumme: number; msN: number; zuletztFalsch?: number };
export type Karte = { fach: number; faellig: string };

export type Zustand = {
  geladen: boolean;
  einstellungen: {
    /** Sprache der Oberfläche */
    uiSprache: 'auto' | UiSprache;
    /** Sprache der Spracherkennung (Codewörter sind immer englisch) */
    sprache: 'en-US' | 'en-GB';
    onDevice: boolean;
    stimme: 'frau' | 'mann';
    ziffern: boolean;
    laenge: 10 | 25 | 50;
    fehlerModus: 'weiter' | 'wiederholen';
    eingabe: Eingabe;
    tagesziel: number;
    thema: 'auto' | 'dunkel' | 'hell';
    codewortZeigen: boolean;
    haptik: boolean;
  };
  laeufe: Lauf[];
  stats: Record<string, SymStat>;
  karten: Record<string, Karte>;
  tage: Record<string, number>;
};

const KEY = 'buchstabiertrainer-v1';
const START: Zustand = {
  geladen: false,
  einstellungen: {
    uiSprache: 'auto', sprache: 'en-US', onDevice: true, stimme: 'frau', ziffern: false, laenge: 50, fehlerModus: 'weiter',
    eingabe: 'sprache', tagesziel: 150, thema: 'dunkel', codewortZeigen: false, haptik: true,
  },
  laeufe: [],
  stats: {},
  karten: {},
  tage: {},
};

let zustand: Zustand = START;
const hoerer = new Set<() => void>();
let speicherTimer: ReturnType<typeof setTimeout> | null = null;

function speichern() {
  if (speicherTimer) clearTimeout(speicherTimer);
  speicherTimer = setTimeout(() => {
    const { geladen, ...rest } = zustand;
    AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => {});
  }, 300);
}

export function setze(f: (s: Zustand) => Zustand) {
  zustand = f(zustand);
  hoerer.forEach((h) => h());
  if (zustand.geladen) speichern();
}

export function hole() {
  return zustand;
}

export async function laden() {
  if (zustand.geladen) return;
  try {
    const roh = await AsyncStorage.getItem(KEY);
    const d = roh ? JSON.parse(roh) : {};
    zustand = { ...START, ...d, einstellungen: { ...START.einstellungen, ...(d.einstellungen || {}) }, geladen: true };
  } catch {
    zustand = { ...START, geladen: true };
  }
  hoerer.forEach((h) => h());
}

export function useStore<T>(sel: (s: Zustand) => T): T {
  return useSyncExternalStore(
    (cb) => { hoerer.add(cb); return () => hoerer.delete(cb); },
    () => sel(zustand),
    () => sel(START),
  );
}

export function einstellen<K extends keyof Zustand['einstellungen']>(k: K, v: Zustand['einstellungen'][K]) {
  setze((s) => ({ ...s, einstellungen: { ...s.einstellungen, [k]: v } }));
}

export function heute(d = new Date()) {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function plusTage(tag: string, n: number) {
  const d = new Date(tag + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return heute(d);
}

/** Wertet einzelne Antworten aus (Statistik je Buchstabe, Tagesziel). */
export function zaehle(eintraege: { sym: string; ok: boolean; ms?: number }[]) {
  if (!eintraege.length) return;
  setze((s) => {
    const stats = { ...s.stats };
    for (const e of eintraege) {
      const a = stats[e.sym] ?? { n: 0, ok: 0, falsch: 0, msSumme: 0, msN: 0 };
      const ms = e.ms != null && e.ms > 0 && e.ms < 10000 ? e.ms : null;
      stats[e.sym] = {
        n: a.n + 1, ok: a.ok + (e.ok ? 1 : 0), falsch: a.falsch + (e.ok ? 0 : 1),
        msSumme: a.msSumme + (ms ?? 0), msN: a.msN + (ms != null ? 1 : 0), zuletztFalsch: e.ok ? a.zuletztFalsch : Date.now(),
      };
    }
    const t = heute();
    return { ...s, stats, tage: { ...s.tage, [t]: (s.tage[t] || 0) + eintraege.length } };
  });
}

export function speichereLauf(l: Omit<Lauf, 'id' | 'ts'>) {
  const lauf: Lauf = { ...l, id: Math.random().toString(36).slice(2), ts: Date.now() };
  setze((s) => ({ ...s, laeufe: [...s.laeufe, lauf].slice(-1000) }));
  return lauf;
}

export const laufKlasse = (l: Pick<Lauf, 'modus' | 'n' | 'ziffern' | 'eingabe'>) => `${l.modus}-${l.n}-${l.ziffern ? 'z' : 'b'}-${l.eingabe}`;

export function bestzeit(laeufe: Lauf[], klasse: string, ausser?: string) {
  let best: Lauf | null = null;
  for (const l of laeufe) if (l.id !== ausser && laufKlasse(l) === klasse && l.fehler === 0 && (!best || l.ms < best.ms)) best = l;
  return best;
}

/** Serie: aufeinanderfolgende Tage mit erreichtem Tagesziel (heute zählt, sobald erreicht). */
export function serie(s: Zustand) {
  let n = 0;
  let tag = heute();
  if ((s.tage[tag] || 0) < s.einstellungen.tagesziel) tag = plusTage(tag, -1);
  while ((s.tage[tag] || 0) >= s.einstellungen.tagesziel) { n++; tag = plusTage(tag, -1); }
  return n;
}

export function zuruecksetzen() {
  setze((s) => ({ ...START, geladen: true, einstellungen: s.einstellungen }));
}
