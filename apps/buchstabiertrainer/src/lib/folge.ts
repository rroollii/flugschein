import { finde, tokenize, type Treffer } from './matcher';
import { NACH_SYM } from '../data/alphabet';
import type { Hinweis } from '../i18n';

export type Ergebnis = { sym: string; ok: boolean; gehoert: string; ms: number; hinweis?: Hinweis; art?: Treffer['art'] };

export type FolgeZustand = {
  pos: number;
  ergebnisse: (Ergebnis | null)[];
  versuche: Ergebnis[];
  start: number | null;
  ende: number | null;
  live: string;
  letzte: Ergebnis | null;
};

/**
 * Wertet einen Strom von Erkennungsergebnissen gegen eine Folge erwarteter Symbole aus.
 * Ein „Segment“ ist ein Abschnitt, den der Erkenner laufend überarbeitet (Zwischenergebnisse) und
 * irgendwann abschließt. Segmente werden bei jeder Änderung neu geparst; ausgewertet werden nur Codewörter,
 * die über die bereits gezählten hinausgehen. Das unsichere letzte Wort eines Zwischenergebnisses zählt nur,
 * wenn es das erwartete Codewort ist – sonst wird auf die nächste Fassung gewartet.
 */
export class Folge {
  z: FolgeZustand;
  private seg: string[] = [];
  private hoerer = new Set<() => void>();
  private letzteZeit = 0;

  constructor(readonly ziel: string[], readonly syms: string[], readonly wiederholen: boolean) {
    this.z = { pos: 0, ergebnisse: ziel.map(() => null), versuche: [], start: null, ende: null, live: '', letzte: null };
  }

  abo(f: () => void) { this.hoerer.add(f); return () => { this.hoerer.delete(f); }; }
  private melde() { this.z = { ...this.z }; this.hoerer.forEach((h) => h()); }

  get fertig() { return this.z.ende != null; }
  get erwartet() { return this.ziel[this.z.pos] ?? null; }

  starteUhr(t = Date.now()) {
    if (this.z.start == null) { this.z.start = t; this.letzteZeit = t; }
  }

  private werte(t: Treffer) {
    const jetzt = Date.now();
    this.starteUhr(jetzt);
    const soll = this.erwartet!;
    const ok = t.sym === soll && t.art !== 'fremd';
    const e: Ergebnis = { sym: soll, ok, gehoert: t.gehoert, ms: jetzt - this.letzteZeit, hinweis: t.hinweis, art: t.art };
    if (!ok && t.sym && t.art !== 'fremd') e.hinweis = { k: 'hinweis.falschesWort', p: { gehoert: NACH_SYM[t.sym]?.wort ?? t.gehoert, erwartet: NACH_SYM[soll].wort } };
    this.z.versuche.push(e);
    this.z.letzte = e;
    if (ok || !this.wiederholen) {
      const vorher = this.z.ergebnisse[this.z.pos];
      this.z.ergebnisse[this.z.pos] = vorher && !vorher.ok ? { ...e, ok: false, hinweis: vorher.hinweis } : e;
      this.z.pos++;
      this.letzteZeit = jetzt;
    } else {
      this.z.ergebnisse[this.z.pos] = e;
    }
    if (this.z.pos >= this.ziel.length) this.z.ende = jetzt;
  }

  segment(text: string, final: boolean) {
    if (this.fertig) return;
    const tokens = tokenize(text);
    if (tokens.length) this.starteUhr();
    this.z.live = text;
    let pos = 0;
    let k = 0;
    while (pos < tokens.length && !this.fertig) {
      const alt = k < this.seg.length;
      const exp = alt ? this.seg[k] : this.erwartet;
      const t = finde(tokens, pos, this.syms, exp);
      if (!t.sym) { pos += 1; continue; }
      const istLetztes = pos + t.laenge >= tokens.length;
      if (!alt) {
        if (!final && istLetztes && t.sym !== exp) break;
        this.seg.push(exp!);
        this.werte(t);
      }
      k++;
      pos += t.laenge;
    }
    // Chrome teilt Abschnitte nachträglich: bereits gezählte Wörter, die im Endergebnis fehlen, gehören zum nächsten Segment
    if (final) this.seg = this.seg.slice(k);
    this.melde();
  }

  /** Getipptes Codewort (Fallback ohne Mikrofon). Gibt true zurück, wenn ausgewertet. */
  tippen(text: string, abschliessen: boolean) {
    if (this.fertig) return false;
    const tokens = tokenize(text);
    if (!tokens.length) return false;
    this.starteUhr();
    const t = finde(tokens, 0, this.syms, this.erwartet);
    const getippt = tokens.join('');
    const s = NACH_SYM[this.erwartet!];
    const wort = s.wort.toLowerCase().replace(/[^a-z0-9]/g, '');
    const laenger = wort.length > getippt.length && wort.startsWith(getippt);
    if (t.sym === this.erwartet && t.art === 'exakt' && t.laenge === tokens.length && !laenger) { this.werte(t); this.melde(); return true; }
    if (abschliessen) { this.werte(t.sym ? t : { ...t, gehoert: text.trim() }); this.melde(); return true; }
    return false;
  }

  /** Selbstbewertung: laut gesprochen, dann richtig/falsch getippt. */
  selbst(ok: boolean) {
    if (this.fertig) return;
    const soll = this.erwartet!;
    this.werte({ sym: ok ? soll : null, laenge: 1, gehoert: ok ? NACH_SYM[soll].wort : '–', art: ok ? 'exakt' : 'unbekannt' });
    this.melde();
  }

  ueberspringen() {
    if (this.fertig) return;
    this.werte({ sym: null, laenge: 1, gehoert: '–', art: 'unbekannt', hinweis: { k: 'sprint.uebersprungen' } });
    if (this.wiederholen && !this.fertig) { this.z.pos++; if (this.z.pos >= this.ziel.length) this.z.ende = Date.now(); }
    this.melde();
  }

  abbrechen() { this.z.ende = this.z.ende ?? Date.now(); this.melde(); }

  get ms() { return this.z.start == null ? 0 : (this.z.ende ?? Date.now()) - this.z.start; }
  get fehler() { return this.z.ergebnisse.filter((e) => e && !e.ok).length; }
  get hinweise() { return this.z.versuche.filter((e) => e.ok && e.hinweis).length; }
}
