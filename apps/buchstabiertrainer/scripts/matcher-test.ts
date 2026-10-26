// Prüft Abgleich und Folgen-Auswertung ohne Gerät: npm test
import assert from 'node:assert/strict';
import { finde, tokenize, pruefeWort } from '../src/lib/matcher';
import { Folge } from '../src/lib/folge';
import { BUCHST, ZIFF } from '../src/lib/generator';

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
  assert.equal(eins('zebra', 'Z').sym, null);
});

test('Ziffern inkl. ICAO-Hinweisen', () => {
  assert.equal(eins('niner', '9', ALLE).sym, '9');
  const t = eins('three', '3', ALLE);
  assert.equal(t.sym, '3');
  assert.match(t.hinweis ?? '', /TREE/);
  assert.equal(eins('45', '4', ALLE).sym, '4');
  assert.equal(eins('for', null, BUCHST).sym, null, '„for“ ohne Ziffern ist kein Codewort');
});

test('deutsche Buchstabiertafel wird erkannt', () => {
  const t = eins('Anton', 'A');
  assert.equal(t.art, 'fremd');
  assert.match(t.hinweis ?? '', /Alfa/);
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
