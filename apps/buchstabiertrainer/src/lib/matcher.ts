import { NACH_SYM, FREMDE_ALPHABETE, type Sym } from '../data/alphabet';

export type Treffer = {
  sym: string | null;
  laenge: number;
  gehoert: string;
  art: 'exakt' | 'unscharf' | 'fremd' | 'unbekannt';
  hinweis?: string;
};

const DIGIT_WORT: Record<string, string> = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine' };

export function tokenize(text: string): string[] {
  const t = text
    .toLowerCase()
    .replace(/[‐-―-]/g, ' ')
    .replace(/(\d)/g, ' $1 ')
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/'/g, '');
  return t.split(/\s+/).filter(Boolean);
}

// Grobe Lautangleichung, damit „Kebeck“, „Quebec“ und „Cubeck“ nahe beieinander liegen
export function lautKey(w: string): string {
  return w
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/qu/g, 'k').replace(/[cq]/g, 'k').replace(/x/g, 'ks')
    .replace(/th/g, 't').replace(/sch|sh/g, 's').replace(/w/g, 'v').replace(/y/g, 'i').replace(/z/g, 's')
    .replace(/h/g, '').replace(/(.)\1+/g, '$1')
    .replace(/[^a-z0-9]/g, '');
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

type Index = { exakt: Map<string, string>; keys: { sym: string; key: string }[] };
const cache = new Map<string, Index>();

function indexFuer(syms: string[]): Index {
  const id = syms.join('|');
  const hit = cache.get(id);
  if (hit) return hit;
  const exakt = new Map<string, string>();
  const keys: Index['keys'] = [];
  for (const sym of syms) {
    const s = NACH_SYM[sym];
    if (!s) continue;
    for (const v of [s.wort.toLowerCase(), ...s.varianten]) {
      const w = v.replace(/[^\p{L}\p{N}]/gu, '');
      if (!exakt.has(w)) exakt.set(w, sym);
      keys.push({ sym, key: lautKey(w) });
    }
    if (/^\d$/.test(sym)) exakt.set(sym, sym);
  }
  const idx = { exakt, keys };
  cache.set(id, idx);
  return idx;
}

const toleranz = (n: number, streng: boolean) => (streng ? (n <= 5 ? 0 : n <= 8 ? 1 : 2) : n <= 3 ? 0 : n <= 5 ? 1 : n <= 8 ? 2 : 3);

function standardHinweis(s: Sym | undefined, gehoert: string) {
  return s?.standard?.find((x) => x.wort === gehoert)?.hinweis;
}

function abstand(key: string, sym: string, idx: Index) {
  let best = Infinity;
  for (const k of idx.keys) if (k.sym === sym) best = Math.min(best, levenshtein(key, k.key));
  return best;
}

/** Sucht ab tokens[i] das nächste Codewort (1–2 Wörter). `erwartet` wird beim unscharfen Abgleich bevorzugt. */
export function finde(tokens: string[], i: number, syms: string[], erwartet: string | null): Treffer {
  const idx = indexFuer(syms);
  const fenster = [2, 1].filter((n) => i + n <= tokens.length);
  const wort = (n: number) => tokens.slice(i, i + n).join('');
  const roh = (n: number) => tokens.slice(i, i + n).join(' ');

  for (const n of fenster) {
    let w = wort(n);
    if (n === 1 && DIGIT_WORT[w] && syms.includes(w)) {
      return { sym: w, laenge: 1, gehoert: w, art: 'exakt' };
    }
    const sym = idx.exakt.get(w);
    if (sym) return { sym, laenge: n, gehoert: roh(n), art: 'exakt', hinweis: standardHinweis(NACH_SYM[sym], w) };
  }
  if (erwartet && NACH_SYM[erwartet]) {
    for (const n of fenster) {
      const w = wort(n);
      const key = lautKey(w);
      if (key.length >= 3 && abstand(key, erwartet, idx) <= toleranz(key.length, false)) {
        return { sym: erwartet, laenge: n, gehoert: roh(n), art: 'unscharf' };
      }
    }
  }
  const einzel = tokens[i];
  const fremd = FREMDE_ALPHABETE[einzel];
  if (fremd && syms.includes(fremd.sym)) {
    return { sym: fremd.sym, laenge: 1, gehoert: einzel, art: 'fremd', hinweis: `„${einzel[0].toUpperCase() + einzel.slice(1)}“ ist aus der ${fremd.quelle} – ICAO: ${NACH_SYM[fremd.sym].wort}` };
  }
  const key = lautKey(einzel);
  if (key.length >= 4) {
    let best: { sym: string; d: number } | null = null;
    for (const k of idx.keys) {
      const d = levenshtein(key, k.key);
      if (!best || d < best.d) best = { sym: k.sym, d };
    }
    if (best && best.d <= toleranz(key.length, true)) return { sym: best.sym, laenge: 1, gehoert: einzel, art: 'unscharf' };
  }
  return { sym: null, laenge: 1, gehoert: einzel, art: 'unbekannt' };
}

/** Einzelwort-Prüfung (Aussprache-Modus): bestes Ergebnis über mehrere Alternativen. */
export function pruefeWort(alternativen: string[], ziel: string, syms: string[]): Treffer & { alle: string[] } {
  let erstes: Treffer | null = null;
  for (const alt of alternativen) {
    const tokens = tokenize(alt);
    for (let i = 0; i < tokens.length; ) {
      const t = finde(tokens, i, syms, ziel);
      if (t.sym === ziel && t.art !== 'fremd') return { ...t, alle: alternativen };
      if (t.sym && !erstes) erstes = t;
      i += t.laenge;
    }
  }
  return { ...(erstes ?? { sym: null, laenge: 0, gehoert: alternativen[0] ?? '', art: 'unbekannt' as const }), alle: alternativen };
}
