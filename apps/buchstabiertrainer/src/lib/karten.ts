import { ALLE, BUCHSTABEN } from '../data/alphabet';
import { heute, plusTage, setze, type Zustand } from './store';

// Leitner-Karteikasten: Fach 1–5, Wiederholungsabstand in Tagen
export const ABSTAND = [0, 0, 1, 3, 7, 14];

export function kartenSyms(s: Zustand) {
  return (s.einstellungen.ziffern ? ALLE : BUCHSTABEN).map((x) => x.sym);
}

export function faelligeKarten(s: Zustand) {
  const t = heute();
  return kartenSyms(s).filter((sym) => {
    const k = s.karten[sym];
    return !k || k.faellig <= t;
  });
}

export function bewerteKarte(sym: string, gewusst: boolean) {
  setze((s) => {
    const alt = s.karten[sym]?.fach ?? 0;
    const fach = gewusst ? Math.min(5, Math.max(1, alt) + 1) : 1;
    return { ...s, karten: { ...s.karten, [sym]: { fach, faellig: plusTage(heute(), gewusst ? ABSTAND[fach] : 0) } } };
  });
}

export function fachVerteilung(s: Zustand) {
  const v = [0, 0, 0, 0, 0, 0];
  for (const sym of kartenSyms(s)) v[s.karten[sym]?.fach ?? 0]++;
  return v;
}
