import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Seite, Panel, Etikett, T, Knopf, Auswahl, Zeile } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, zaehle, type Zustand } from '../lib/store';
import { faelligeKarten, bewerteKarte, fachVerteilung, kartenSyms } from '../lib/karten';
import { NACH_SYM, lautschrift } from '../data/alphabet';
import { mischen } from '../lib/generator';
import { spiele } from '../lib/audio';
import { useErkennung } from '../lib/useErkennung';
import { pruefeWort } from '../lib/matcher';
import { simAktiv, simSprich } from '../lib/sim';

export default function Lernen() {
  const f = useFarben();
  const s = useStore((x) => x) as Zustand;
  const [richtung, setRichtung] = useState<'zeichen' | 'wort'>('zeichen');
  const [antwort, setAntwort] = useState<'aufdecken' | 'sprechen'>('aufdecken');
  const [stapel, setStapel] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [offen, setOffen] = useState(false);
  const [bewertung, setBewertung] = useState<{ ok: boolean; text: string } | null>(null);
  const [geschafft, setGeschafft] = useState(0);
  const verteilung = fachVerteilung(s);
  const faellig = faelligeKarten(s);
  const syms = kartenSyms(s);
  const aktuell = stapel?.[i];
  const sym = aktuell ? NACH_SYM[aktuell] : null;

  const erk = useErkennung({
    syms, einzelwort: true,
    onSegment: (text, final, alt) => {
      if (!aktuell || !final) { setBewertung({ ok: false, text: `Gehört: ${text} …` }); return; }
      const r = pruefeWort(alt.length ? alt : [text], aktuell, syms);
      const ok = r.sym === aktuell && r.art !== 'fremd';
      setBewertung({ ok, text: ok ? `✓ ${r.hinweis ?? 'Richtig'} – gehört: „${r.gehoert}“` : `✗ ${r.hinweis ?? `Gehört: „${r.gehoert || text}“`}` });
      setOffen(true);
      erk.stoppe();
    },
  });

  const starte = (liste: string[]) => { setStapel(mischen(liste)); setI(0); setOffen(false); setBewertung(null); setGeschafft(0); };
  const weiter = (gewusst: boolean) => {
    if (!aktuell) return;
    bewerteKarte(aktuell, gewusst);
    zaehle([{ sym: aktuell, ok: gewusst }]);
    if (gewusst) setGeschafft((g) => g + 1);
    const neu = gewusst ? stapel! : [...stapel!, aktuell];
    setStapel(neu);
    setI((x) => x + 1);
    setOffen(false);
    setBewertung(null);
  };

  useEffect(() => { if (offen && sym && richtung === 'zeichen') spiele(sym.sym, s.einstellungen.stimme); }, [offen]);

  if (!stapel || i >= stapel.length) {
    return (
      <Seite titel="Lernen · Karteikasten">
        {stapel && <Panel style={{ borderColor: f.ok }}><T fett groesse={18}>Runde geschafft: {geschafft} Karten gelernt.</T></Panel>}
        <Panel titel="Fächer">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {verteilung.map((n, fach) => (
              <View key={fach} style={[stl.fach, { borderColor: f.rand, backgroundColor: f.panel2 }]}>
                <Etikett>{fach === 0 ? 'neu' : `Fach ${fach}`}</Etikett>
                <T mono fett groesse={22}>{n}</T>
              </View>
            ))}
          </View>
          <T leise groesse={13} style={{ marginTop: 10 }}>Gewusste Karten wandern ein Fach weiter (Wiederholung nach 1, 3, 7, 14 Tagen), vergessene zurück in Fach 1.</T>
        </Panel>
        <Panel titel="Abfrage">
          <Auswahl label="Richtung" werte={[{ wert: 'zeichen', text: 'Buchstabe → Codewort' }, { wert: 'wort', text: 'Codewort → Buchstabe' }]} wert={richtung} onWahl={setRichtung} />
          <View style={{ height: 10 }} />
          <Auswahl label="Antwort" werte={[{ wert: 'aufdecken', text: 'Aufdecken' }, { wert: 'sprechen', text: '🎙 Sprechen' }]} wert={antwort} onWahl={setAntwort} />
        </Panel>
        <Knopf titel={faellig.length ? `${faellig.length} fällige Karten lernen` : 'Alles wiederholt – frei üben'} symbol="▶" onPress={() => starte(faellig.length ? faellig : syms)} />
      </Seite>
    );
  }

  return (
    <Seite titel={`Karte ${i + 1} / ${stapel.length}`} scroll>
      <Panel style={{ alignItems: 'center', paddingVertical: 28, minHeight: 300, justifyContent: 'center' }}>
        {richtung === 'zeichen' || offen ? <Text style={[stl.gross, { color: f.akzent }]}>{sym!.sym}</Text> : null}
        {richtung === 'wort' && (
          <Knopf klein art="sekundaer" titel="Anhören" symbol="🔊" onPress={() => spiele(sym!.sym, s.einstellungen.stimme)} style={{ marginBottom: 8 }} />
        )}
        {(richtung === 'wort' || offen) && (
          <>
            <T groesse={34} fett>{sym!.wort}</T>
            <T mono groesse={20} farbe={f.info}>{lautschrift(sym!)}</T>
          </>
        )}
        {offen && sym!.tipp && <T leise groesse={14} style={{ marginTop: 10, textAlign: 'center' }}>{sym!.tipp}</T>}
        {offen && (
          <Zeile style={{ marginTop: 14, justifyContent: 'center' }}>
            <Knopf klein art="sekundaer" titel="Frau" symbol="🔊" onPress={() => spiele(sym!.sym, 'frau')} />
            <Knopf klein art="sekundaer" titel="Mann" symbol="🔊" onPress={() => spiele(sym!.sym, 'mann')} />
          </Zeile>
        )}
        {bewertung && <T groesse={16} farbe={bewertung.ok ? f.ok : f.fehler} style={{ marginTop: 14, textAlign: 'center' }}>{bewertung.text}</T>}
      </Panel>
      {!offen ? (
        antwort === 'sprechen' && richtung === 'zeichen' ? (
          <View style={{ gap: 10 }}>
            <Knopf titel={erk.laeuft ? 'Höre zu …' : 'Codewort sprechen'} symbol="🎙" art={erk.laeuft ? 'ok' : 'primaer'} onPress={() => (erk.laeuft ? erk.stoppe() : erk.starte())} />
            {erk.fehler && <T farbe={f.fehler} groesse={14}>{erk.fehler}</T>}
            {simAktiv() && erk.laeuft && <Knopf klein art="sekundaer" titel={`Sim: „${sym!.wort}“ sprechen`} onPress={() => simSprich(sym!.wort)} />}
            <Knopf art="sekundaer" titel="Aufdecken" onPress={() => setOffen(true)} />
          </View>
        ) : (
          <Knopf titel="Aufdecken" onPress={() => setOffen(true)} />
        )
      ) : (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Knopf art="fehler" titel="✗ Vergessen" style={{ flex: 1 }} onPress={() => weiter(false)} />
          <Knopf art="ok" titel="✓ Gewusst" style={{ flex: 1 }} onPress={() => weiter(true)} />
        </View>
      )}
    </Seite>
  );
}

const stl = StyleSheet.create({
  fach: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 8 },
  gross: { fontFamily: MONO, fontSize: 120, lineHeight: 136, fontWeight: '800' },
});
