import { BUCHSTABEN, ZIFFERN } from '../data/alphabet';
import type { SymStat } from './store';
import type { Schluessel } from '../i18n/de';

export const BUCHST = BUCHSTABEN.map((s) => s.sym);
export const ZIFF = ZIFFERN.map((s) => s.sym);

const zufall = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

/** Gewicht je Symbol für gezieltes Nachtraining: Fehlerquote und Langsamkeit erhöhen die Häufigkeit. */
export function gewichte(syms: string[], stats: Record<string, SymStat>) {
  const zeiten = syms.map((s) => (stats[s]?.msN ? stats[s].msSumme / stats[s].msN : null)).filter((x): x is number => x != null);
  const mittel = zeiten.length ? zeiten.reduce((a, b) => a + b, 0) / zeiten.length : 0;
  return syms.map((s) => {
    const st = stats[s];
    if (!st || !st.n) return 1.5;
    const quote = st.falsch / st.n;
    const zeit = st.msN && mittel ? st.msSumme / st.msN / mittel : 1;
    return 1 + quote * 8 + Math.max(0, zeit - 1) * 3;
  });
}

export function folge(n: number, syms: string[], w?: number[]) {
  const out: string[] = [];
  const summe = w ? w.reduce((a, b) => a + b, 0) : 0;
  while (out.length < n) {
    let s: string;
    if (w) {
      let r = Math.random() * summe;
      let i = 0;
      while (r > w[i] && i < w.length - 1) { r -= w[i]; i++; }
      s = syms[i];
    } else s = zufall(syms);
    if (s !== out[out.length - 1] || syms.length < 3) out.push(s);
  }
  return out;
}

const L = () => zufall(BUCHST);
const D = () => zufall(ZIFF);
const rep = (n: number, f: () => string) => Array.from({ length: n }, f).join('');

export const KENNZEICHEN: { land: string; muster: () => string }[] = [
  { land: 'Österreich (Motorflugzeug)', muster: () => `OE-${zufall(['K', 'D', 'A', 'C', 'F'])}${rep(2, L)}` },
  { land: 'Österreich (Segelflugzeug)', muster: () => `OE-${zufall(['5', '0', '9'])}${rep(3, D)}` },
  { land: 'Deutschland', muster: () => `D-${zufall(['E', 'E', 'M', 'K', 'G'])}${rep(3, L)}` },
  { land: 'Ungarn', muster: () => `HA-${rep(3, L)}` },
  { land: 'Schweiz', muster: () => `HB-${rep(3, L)}` },
  { land: 'Tschechien', muster: () => `OK-${rep(3, L)}` },
  { land: 'Slowenien', muster: () => `S5-${rep(3, L)}` },
  { land: 'Kroatien', muster: () => `9A-${rep(3, L)}` },
  { land: 'Italien', muster: () => `I-${rep(4, L)}` },
  { land: 'Vereinigtes Königreich', muster: () => `G-${rep(4, L)}` },
  { land: 'USA', muster: () => `N${zufall(['1', '2', '3', '4', '5', '6', '7', '8', '9'])}${rep(zufall([2, 3]), D)}${rep(zufall([1, 2]), L)}` },
];

export const FESTE_KENNZEICHEN = ['OE-KRF', 'D-EABC', 'OE-AKM', 'HA-SKA', 'OE-DLF', 'D-EFLY'];

const mitZahl = (k: string) => /\d/.test(k);

export function kennzeichen(anzahl: number, mitZiffern: boolean) {
  const feste = FESTE_KENNZEICHEN.filter((k) => mitZiffern || !mitZahl(k));
  const out = [zufall(feste)];
  for (let versuch = 0; out.length < anzahl && versuch < 500; versuch++) {
    const k = zufall(KENNZEICHEN).muster();
    if ((mitZiffern || !mitZahl(k)) && !out.includes(k)) out.push(k);
  }
  return out;
}

export const WORTLISTEN: { id: string; titel: Schluessel; woerter: string[] }[] = [
  { id: 'flugplaetze', titel: 'liste.flugplaetze', woerter: ['LOGF', 'LOWG', 'LOWW', 'LOWS', 'LOWI', 'LOWL', 'LOWK', 'LOAN', 'LOAV', 'LOGO', 'LOLW', 'LOGK', 'LOAG', 'LOWZ', 'LOKN', 'LOGP'] },
  { id: 'orte', titel: 'liste.orte', woerter: ['Fuerstenfeld', 'Graz', 'Wien', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Linz', 'Hartberg', 'Feldbach', 'Gleisdorf', 'Kapfenberg', 'Voeslau', 'Zell am See', 'Punitz', 'Niederoeblarn', 'Wels', 'Spitzerberg', 'Trieben', 'Leoben', 'Riegersburg'] },
  { id: 'funk', titel: 'liste.funk', woerter: ['METAR', 'TAF', 'QNH', 'QFE', 'CAVOK', 'NOTAM', 'ATIS', 'SQUAWK', 'MAYDAY', 'PAN PAN', 'WILCO', 'ROGER', 'VFR', 'IFR', 'SIGMET', 'TRANSPONDER', 'FLIGHT PLAN', 'GAFOR'] },
  { id: 'namen', titel: 'liste.namen', woerter: ['Huber', 'Gruber', 'Wagner', 'Pichler', 'Steiner', 'Moser', 'Mayer', 'Hofer', 'Leitner', 'Berger', 'Schwarz', 'Fuchs', 'Eder', 'Fischer', 'Weber', 'Schmid'] },
];

/** Wörter auf buchstabierbare Zeichen reduzieren (Umlaute als ae/oe/ue, Leerzeichen entfallen). */
export function buchstabierbar(wort: string, mitZiffern: boolean) {
  return wort
    .toUpperCase()
    .replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').replace(/ß/g, 'SS')
    .split('')
    .filter((c) => /[A-Z]/.test(c) || (mitZiffern && /\d/.test(c)));
}

export function mischen<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
