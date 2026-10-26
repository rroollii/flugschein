import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Seite, Panel, Etikett, T, Knopf, Zeile, Auswahl } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, zaehle } from '../lib/store';
import { BUCHSTABEN, ZIFFERN, ZUSATZ, NACH_SYM, type Sym } from '../data/alphabet';
import { spiele } from '../lib/audio';
import { useErkennung } from '../lib/useErkennung';
import { pruefeWort } from '../lib/matcher';
import { simAktiv, simSprich } from '../lib/sim';

const ALLE_SYMS = [...BUCHSTABEN, ...ZIFFERN, ...ZUSATZ].map((s) => s.sym);

function Laut({ s, groesse = 15 }: { s: Sym; groesse?: number }) {
  const f = useFarben();
  return (
    <Text style={{ fontFamily: MONO, fontSize: groesse }}>
      {s.laut.map((x, i) => (
        <Text key={i} style={{ color: i === s.betont ? f.akzent : f.leise, fontWeight: i === s.betont ? '800' : '400' }}>
          {i > 0 ? '-' : ''}{x.toUpperCase()}
        </Text>
      ))}
    </Text>
  );
}

export default function Aussprache() {
  const f = useFarben();
  const stimme = useStore((s) => s.einstellungen.stimme);
  const [gewaehlt, setGewaehlt] = useState<string>('A');
  const [ergebnis, setErgebnis] = useState<{ ok: boolean; titel: string; text: string; warn?: boolean } | null>(null);
  const [gruppe, setGruppe] = useState<'buchstaben' | 'ziffern'>('buchstaben');
  const s = NACH_SYM[gewaehlt];

  const erk = useErkennung({
    syms: ALLE_SYMS, einzelwort: true,
    onSegment: (text, final, alt) => {
      if (!final) { setErgebnis({ ok: false, titel: 'Höre …', text }); return; }
      const r = pruefeWort(alt.length ? alt : [text], gewaehlt, ALLE_SYMS);
      const gehoert = r.alle.slice(0, 3).map((a) => `„${a}“`).join(', ');
      if (r.sym === gewaehlt && r.art !== 'fremd') {
        setErgebnis({ ok: true, warn: !!r.hinweis, titel: r.hinweis ? 'Erkannt – aber nicht ICAO-Aussprache' : r.art === 'unscharf' ? 'Erkannt (knapp)' : 'Sauber erkannt', text: `${r.hinweis ? r.hinweis + ' · ' : ''}Gehört: ${gehoert}` });
        zaehle([{ sym: gewaehlt, ok: true }]);
      } else {
        const anders = r.sym && r.art !== 'fremd' ? `Klingt nach ${NACH_SYM[r.sym].wort} (${r.sym}). ` : '';
        setErgebnis({ ok: false, titel: 'Nicht erkannt', text: `${r.hinweis ?? anders}Gehört: ${gehoert || '–'}. Hör dir das Beispiel an und betone ${s.laut[s.betont].toUpperCase()}.` });
        zaehle([{ sym: gewaehlt, ok: false }]);
      }
      erk.stoppe();
    },
  });

  const waehle = (x: string) => { setGewaehlt(x); setErgebnis(null); spiele(x, stimme); };
  const liste = gruppe === 'buchstaben' ? BUCHSTABEN : [...ZIFFERN, ...ZUSATZ];

  return (
    <Seite titel="Aussprache · Lautschrift">
      <Panel style={{ borderColor: f.akzent }}>
        <Zeile abstand={14} style={{ flexWrap: 'nowrap' }}>
          <Text style={[stl.gross, { color: f.akzent }]}>{s.sym === '000' ? '1000' : s.sym === '00' ? '100' : s.sym}</Text>
          <View style={{ flex: 1 }}>
            <T groesse={30} fett>{s.wort}</T>
            <Laut s={s} groesse={20} />
          </View>
        </Zeile>
        {s.tipp && <T leise groesse={14} style={{ marginTop: 8 }}>{s.tipp}</T>}
        {s.standard?.length ? <T groesse={14} farbe={f.warn} style={{ marginTop: 4 }}>{s.standard[0].hinweis}</T> : null}
        <Zeile style={{ marginTop: 12 }}>
          <Knopf klein art="sekundaer" titel="Frau" symbol="🔊" onPress={() => spiele(gewaehlt, 'frau')} />
          <Knopf klein art="sekundaer" titel="Mann" symbol="🔊" onPress={() => spiele(gewaehlt, 'mann')} />
          <Knopf klein art="sekundaer" titel="Langsam" symbol="🐢" onPress={() => spiele(gewaehlt, stimme, 0.7)} />
          <Knopf klein art={erk.laeuft ? 'ok' : 'primaer'} titel={erk.laeuft ? 'Höre zu …' : 'Nachsprechen'} symbol="🎙" onPress={() => (erk.laeuft ? erk.stoppe() : (setErgebnis(null), erk.starte()))} />
          {simAktiv() && erk.laeuft && <Knopf klein art="sekundaer" titel="Sim" onPress={() => simSprich(s.varianten[0])} />}
        </Zeile>
        {erk.fehler && <T farbe={f.fehler} groesse={14} style={{ marginTop: 8 }}>{erk.fehler}</T>}
        {ergebnis && (
          <View style={[stl.ergebnis, { borderColor: ergebnis.warn ? f.warn : ergebnis.ok ? f.ok : f.fehler }]}>
            <T fett farbe={ergebnis.warn ? f.warn : ergebnis.ok ? f.ok : f.fehler}>{ergebnis.warn ? '⚠ ' : ergebnis.ok ? '✓ ' : '✗ '}{ergebnis.titel}</T>
            <T groesse={14} leise>{ergebnis.text}</T>
          </View>
        )}
      </Panel>

      <Auswahl label="Gruppe" werte={[{ wert: 'buchstaben', text: 'Buchstaben' }, { wert: 'ziffern', text: 'Ziffern & Zahlen' }]} wert={gruppe} onWahl={setGruppe} />
      <View style={stl.raster}>
        {liste.map((x) => (
          <Pressable key={x.sym} onPress={() => waehle(x.sym)} accessibilityRole="button" accessibilityLabel={`${x.wort} anhören`}
            style={({ pressed }) => [stl.karte, { backgroundColor: x.sym === gewaehlt ? f.panel2 : f.panel, borderColor: x.sym === gewaehlt ? f.akzent : f.rand, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={{ color: f.akzent, fontFamily: MONO, fontSize: 22, fontWeight: '800', width: 46 }}>{x.sym === '000' ? '1000' : x.sym === '00' ? '100' : x.sym}</Text>
            <View style={{ flex: 1 }}>
              <T fett groesse={15}>{x.wort}</T>
              <Laut s={x} groesse={13} />
            </View>
          </Pressable>
        ))}
      </View>

      <Panel titel="Merkhilfe ICAO">
        <T groesse={14}>• Betonte Silbe in <T groesse={14} fett farbe={f.akzent}>Farbe</T> – so steht es in ICAO Annex 10.</T>
        <T groesse={14}>• Ziffern einzeln: 3 = TREE, 4 = FOW-er, 5 = FIFE, 9 = NIN-er, 1000 = TOU-SAND.</T>
        <T groesse={14}>• Schreibweise „Alfa“ und „Juliett“ ist Absicht: sie verhindert falsche Aussprache in anderen Sprachen.</T>
        <T groesse={14}>• Kein „Anton, Berta, Cäsar“ im Funk – die deutschen und österreichischen Buchstabiertafeln erkennt die App und weist darauf hin.</T>
        <Etikett style={{ marginTop: 10 }}>Erkennung</Etikett>
        <T leise groesse={13}>Die Spracherkennung wertet aus, was sie versteht. Feine Unterschiede (z. B. TREE statt THREE) erkennt sie nur, wenn sie das Wort auch anders schreibt – nutze daher zusätzlich die Hörbeispiele.</T>
      </Panel>
    </Seite>
  );
}

const stl = StyleSheet.create({
  gross: { fontFamily: MONO, fontSize: 72, fontWeight: '800', minWidth: 70 },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  karte: { flexGrow: 1, flexBasis: 160, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 12, padding: 10 },
  ergebnis: { marginTop: 12, borderLeftWidth: 4, paddingLeft: 10, paddingVertical: 4 },
});
