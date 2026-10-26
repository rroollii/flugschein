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
import { useT } from '../i18n';

export default function Lernen() {
  const f = useFarben();
  const { t, th } = useT();
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
      if (!aktuell || !final) { setBewertung({ ok: false, text: `${t('allg.gehoert', { text })} …` }); return; }
      const r = pruefeWort(alt.length ? alt : [text], aktuell, syms);
      const ok = r.sym === aktuell && r.art !== 'fremd';
      setBewertung({ ok, text: ok ? t('lernen.richtigGehoert', { hinweis: r.hinweis ? th(r.hinweis) : t('lernen.richtig'), text: r.gehoert }) : `✗ ${r.hinweis ? th(r.hinweis) : t('allg.gehoertZitat', { text: r.gehoert || text })}` });
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
      <Seite titel={t('lernen.titel')}>
        {stapel && <Panel style={{ borderColor: f.ok }}><T fett groesse={18}>{t('lernen.geschafft', { n: geschafft })}</T></Panel>}
        <Panel titel={t('lernen.faecher')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {verteilung.map((n, fach) => (
              <View key={fach} style={[stl.fach, { borderColor: f.rand, backgroundColor: f.panel2 }]}>
                <Etikett>{fach === 0 ? t('lernen.neu') : t('lernen.fach', { n: fach })}</Etikett>
                <T mono fett groesse={22}>{n}</T>
              </View>
            ))}
          </View>
          <T leise groesse={13} style={{ marginTop: 10 }}>{t('lernen.faecherInfo')}</T>
        </Panel>
        <Panel titel={t('lernen.abfrage')}>
          <Auswahl label={t('lernen.richtung')} werte={[{ wert: 'zeichen', text: t('lernen.zeichenWort') }, { wert: 'wort', text: t('lernen.wortZeichen') }]} wert={richtung} onWahl={setRichtung} />
          <View style={{ height: 10 }} />
          <Auswahl label={t('lernen.antwort')} werte={[{ wert: 'aufdecken', text: t('allg.aufdecken') }, { wert: 'sprechen', text: t('lernen.sprechen') }]} wert={antwort} onWahl={setAntwort} />
        </Panel>
        <Knopf titel={faellig.length ? t('lernen.faelligLernen', { n: faellig.length }) : t('lernen.freiUeben')} symbol="▶" onPress={() => starte(faellig.length ? faellig : syms)} />
      </Seite>
    );
  }

  return (
    <Seite titel={t('lernen.karte', { i: i + 1, n: stapel.length })} scroll>
      <Panel style={{ alignItems: 'center', paddingVertical: 28, minHeight: 300, justifyContent: 'center' }}>
        {richtung === 'zeichen' || offen ? <Text style={[stl.gross, { color: f.akzent }]}>{sym!.sym}</Text> : null}
        {richtung === 'wort' && (
          <Knopf klein art="sekundaer" titel={t('lernen.anhoeren')} symbol="🔊" onPress={() => spiele(sym!.sym, s.einstellungen.stimme)} style={{ marginBottom: 8 }} />
        )}
        {(richtung === 'wort' || offen) && (
          <>
            <T groesse={34} fett>{sym!.wort}</T>
            <T mono groesse={20} farbe={f.info}>{lautschrift(sym!)}</T>
          </>
        )}
        {offen && sym!.tipp && <T leise groesse={14} style={{ marginTop: 10, textAlign: 'center' }}>{t(sym!.tipp)}</T>}
        {offen && (
          <Zeile style={{ marginTop: 14, justifyContent: 'center' }}>
            <Knopf klein art="sekundaer" titel={t('allg.frau')} symbol="🔊" onPress={() => spiele(sym!.sym, 'frau')} />
            <Knopf klein art="sekundaer" titel={t('allg.mann')} symbol="🔊" onPress={() => spiele(sym!.sym, 'mann')} />
          </Zeile>
        )}
        {bewertung && <T groesse={16} farbe={bewertung.ok ? f.ok : f.fehler} style={{ marginTop: 14, textAlign: 'center' }}>{bewertung.text}</T>}
      </Panel>
      {!offen ? (
        antwort === 'sprechen' && richtung === 'zeichen' ? (
          <View style={{ gap: 10 }}>
            <Knopf titel={erk.laeuft ? t('allg.hoereZu') : t('lernen.codewortSprechen')} symbol="🎙" art={erk.laeuft ? 'ok' : 'primaer'} onPress={() => (erk.laeuft ? erk.stoppe() : erk.starte())} />
            {erk.fehler && <T farbe={f.fehler} groesse={14}>{erk.fehler}</T>}
            {simAktiv() && erk.laeuft && <Knopf klein art="sekundaer" titel={t('lernen.simSprechen', { wort: sym!.wort })} onPress={() => simSprich(sym!.wort)} />}
            <Knopf art="sekundaer" titel={t('allg.aufdecken')} onPress={() => setOffen(true)} />
          </View>
        ) : (
          <Knopf titel={t('allg.aufdecken')} onPress={() => setOffen(true)} />
        )
      ) : (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Knopf art="fehler" titel={t('lernen.vergessen')} style={{ flex: 1 }} onPress={() => weiter(false)} />
          <Knopf art="ok" titel={t('lernen.gewusst')} style={{ flex: 1 }} onPress={() => weiter(true)} />
        </View>
      )}
    </Seite>
  );
}

const stl = StyleSheet.create({
  fach: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 8 },
  gross: { fontFamily: MONO, fontSize: 120, lineHeight: 136, fontWeight: '800' },
});
