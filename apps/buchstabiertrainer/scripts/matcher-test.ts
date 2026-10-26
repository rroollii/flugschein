// Prüft Abgleich und Folgen-Auswertung ohne Gerät: npm test
import assert from 'node:assert/strict';
import { finde, tokenize, pruefeWort } from '../src/lib/matcher';
import { Folge } from '../src/lib/folge';
import { NACH_SYM } from '../src/data/alphabet';
import { BUCHST, ZIFF } from '../src/lib/generator';
import { de } from '../src/i18n/de';
import { en } from '../src/i18n/en';
import { fr } from '../src/i18n/fr';
import { it } from '../src/i18n/it';
import { es } from '../src/i18n/es';

const ALLE = [...BUCHST, ...ZIFF];
const eins = (text: string, erwartet: string | null, syms = BUCHST) => finde(tokenize(text), 0, syms, erwartet);
let n = 0;
const test = (name: string, f: () => void) => { f(); n++; console.log('✔', name); };

test('exakte Codewörter und Varianten', () => {
  for (const [t, s] of [['Alfa', 'A'], ['alpha', 'A'], ['Juliet', 'J'], ['Juliett', 'J'], ['X-ray', 'X'], ['x ray', 'X'], ['fox trot', 'F'], ['Whisky', 'W'], ['kebab', 'Q'], ['Quebec', 'Q']] as const) {
    assert.equal(eins(t, null).sym, s, t);
  }
});

test('unscharfer Abgleich bevorzugt das erwartete Codewort', () => {
  assert.equal(eins('novembar', 'N').sym, 'N');
  assert.equal(eins('sierraa', 'S').sym, 'S');
  assert.equal(eins('zebra', 'Z').art, 'fremd', 'alte englische Tafel');
  assert.equal(eins('zebra', 'S').sym, 'Z', 'nicht unscharf als Sierra');
});

test('Ziffern inkl. ICAO-Hinweisen', () => {
  assert.equal(eins('niner', '9', ALLE).sym, '9');
  const t = eins('three', '3', ALLE);
  assert.equal(t.sym, '3');
  assert.equal(t.hinweis?.k, 'hinweis.three');
  assert.match(de[t.hinweis!.k], /TREE/);
  assert.equal(eins('45', '4', ALLE).sym, '4');
  assert.equal(eins('for', null, BUCHST).sym, null, '„for“ ohne Ziffern ist kein Codewort');
});

test('nationale Buchstabiertafeln werden erkannt und als Nicht-ICAO markiert', () => {
  for (const [wort, sym, tafel] of [['Anton', 'A', 'tafel.at'], ['Anatole', 'A', 'tafel.fr'], ['Ancona', 'A', 'tafel.it'], ['Antonio', 'A', 'tafel.es'],
    ['Baker', 'B', 'tafel.en_alt'], ['Thérèse', 'T', 'tafel.fr'], ['therese', 'T', 'tafel.fr'], ['Domodossola', 'D', 'tafel.it'], ['Zaragoza', 'Z', 'tafel.es']] as const) {
    const t = eins(wort, sym);
    assert.equal(t.art, 'fremd', wort);
    assert.equal(t.sym, sym, wort);
    const p = t.hinweis?.p as any;
    assert.equal(t.hinweis?.k, 'hinweis.fremd');
    assert.equal(p.tafel.k, tafel, wort);
    assert.equal(p.icao, NACH_SYM[sym].wort);
  }
});

test('fremde Tafeln: Vorrang vor unscharfem Abgleich, keine Kollision mit ICAO', () => {
  assert.equal(eins('Roma', 'R').art, 'fremd', '„Roma“ darf nicht als Romeo durchgehen');
  assert.equal(eins('Oscar', 'O').art, 'exakt');
  assert.equal(eins('Victor', 'V').art, 'exakt');
  assert.equal(eins('Hotel', 'H').art, 'exakt');
  assert.equal(eins('Kilo', 'K').art, 'exakt');
  assert.equal(eins('Charlie', 'C').art, 'exakt');
  assert.notEqual(eins('how', 'H').art, 'fremd', 'Füllwort');
  assert.notEqual(eins('love', 'L').art, 'fremd', 'Füllwort');
  const w = eins('Washington', 'W');
  assert.deepEqual([(w.hinweis?.p as any).tafel.je.it, (w.hinweis?.p as any).tafel.je.es], ['tafel.it', 'tafel.es']);
});

test('Wörterbücher: gleiche Schlüssel und Platzhalter in allen Sprachen', () => {
  const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
  for (const [name, wb] of Object.entries({ en, fr, it, es })) {
    assert.deepEqual(Object.keys(wb).sort(), Object.keys(de).sort(), name);
    for (const k of Object.keys(de) as (keyof typeof de)[]) assert.equal(ph(wb[k]), ph(de[k]), `${name}: ${k}`);
  }
});

test('Folge: Zwischenergebnisse werden nicht doppelt gezählt', () => {
  const f = new Folge(['A', 'B', 'C', 'D'], BUCHST, false);
  f.segment('alfa', false);
  f.segment('alfa bra', false);
  f.segment('alfa bravo', false);
  f.segment('alfa bravo charlie', true);
  assert.equal(f.z.pos, 3);
  f.segment('delta', true);
  assert.equal(f.z.pos, 4);
  assert.equal(f.fehler, 0);
  assert.ok(f.fertig);
});

test('Folge: Chrome teilt ein Segment nachträglich', () => {
  const f = new Folge(['A', 'B', 'C'], BUCHST, false);
  f.segment('alfa bravo', false);
  f.segment('alfa', true);
  f.segment('bravo', false);
  f.segment('bravo charlie', true);
  assert.equal(f.z.pos, 3);
  assert.equal(f.fehler, 0);
});

test('Folge: falsches Codewort wird markiert, Füllwörter ignoriert', () => {
  const f = new Folge(['A', 'B', 'C'], BUCHST, false);
  f.segment('uh alfa', false);
  f.segment('uh alfa delta charlie', true);
  assert.equal(f.z.pos, 3);
  assert.equal(f.fehler, 1);
  assert.equal(f.z.ergebnisse[1]?.ok, false);
});

test('Folge: Wiederholen-Modus bleibt beim Zeichen', () => {
  const f = new Folge(['A', 'B'], BUCHST, true);
  f.segment('alfa charlie', true);
  assert.equal(f.z.pos, 1);
  f.segment('bravo', true);
  assert.equal(f.z.pos, 2);
  assert.equal(f.fehler, 1);
});

test('Folge: unfertiges letztes Wort wartet', () => {
  const f = new Folge(['N', 'O'], BUCHST, false);
  f.segment('nov', false);
  assert.equal(f.z.pos, 0);
  f.segment('november', false);
  assert.equal(f.z.pos, 1);
});

test('Tippen und Aussprache-Prüfung', () => {
  const f = new Folge(['K', 'L'], BUCHST, false);
  assert.equal(f.tippen('kil', false), false);
  const g = new Folge(['F'], BUCHST, false);
  assert.equal(g.tippen('fox', false), false, '„fox“ ist nur der Anfang von Foxtrot');
  assert.equal(g.tippen('foxtrot', false), true);
  assert.equal(f.tippen('kilo', false), true);
  assert.equal(f.tippen('mike', true), true);
  assert.equal(f.fehler, 1);
  assert.equal(pruefeWort(['tree'], '3', ALLE).sym, '3');
  assert.equal(pruefeWort(['Berta'], 'B', BUCHST).art, 'fremd');
});

console.log(`\n${n} Tests bestanden.`);
