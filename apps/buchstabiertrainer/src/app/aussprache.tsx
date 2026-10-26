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
import { useT } from '../i18n';

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
  const { t, th } = useT();
  const stimme = useStore((s) => s.einstellungen.stimme);
  const [gewaehlt, setGewaehlt] = useState<string>('A');
  const [ergebnis, setErgebnis] = useState<{ ok: boolean; titel: string; text: string; warn?: boolean } | null>(null);
  const [gruppe, setGruppe] = useState<'buchstaben' | 'ziffern'>('buchstaben');
  const s = NACH_SYM[gewaehlt];

  const erk = useErkennung({
    syms: ALLE_SYMS, einzelwort: true,
    onSegment: (text, final, alt) => {
      if (!final) { setErgebnis({ ok: false, titel: t('aussprache.hoere'), text }); return; }
      const r = pruefeWort(alt.length ? alt : [text], gewaehlt, ALLE_SYMS);
      const gehoert = r.alle.slice(0, 3).join(' · ');
      const hinweis = r.hinweis ? th(r.hinweis) : null;
      if (r.sym === gewaehlt && r.art !== 'fremd') {
        setErgebnis({ ok: true, warn: !!hinweis, titel: t(hinweis ? 'aussprache.nichtIcao' : r.art === 'unscharf' ? 'aussprache.knapp' : 'aussprache.sauber'), text: `${hinweis ? hinweis + ' · ' : ''}${t('allg.gehoert', { text: gehoert })}` });
        zaehle([{ sym: gewaehlt, ok: true }]);
      } else {
        const anders = r.sym && r.art !== 'fremd' ? t('aussprache.klingtNach', { wort: NACH_SYM[r.sym].wort, sym: r.sym }) : '';
        setErgebnis({ ok: false, warn: r.art === 'fremd', titel: t('aussprache.nichtErkannt'), text: `${hinweis ? hinweis + ' · ' : anders}${t('allg.gehoert', { text: gehoert || '–' })}. ${t('aussprache.tippBetonung', { silbe: s.laut[s.betont].toUpperCase() })}` });
        zaehle([{ sym: gewaehlt, ok: false }]);
      }
      erk.stoppe();
    },
  });

  const waehle = (x: string) => { setGewaehlt(x); setErgebnis(null); spiele(x, stimme); };
  const liste = gruppe === 'buchstaben' ? BUCHSTABEN : [...ZIFFERN, ...ZUSATZ];

  return (
    <Seite titel={t('aussprache.titel')}>
      <Panel style={{ borderColor: f.akzent }}>
        <Zeile abstand={14} style={{ flexWrap: 'nowrap' }}>
          <Text style={[stl.gross, { color: f.akzent }]}>{s.sym === '000' ? '1000' : s.sym === '00' ? '100' : s.sym}</Text>
          <View style={{ flex: 1 }}>
            <T groesse={30} fett>{s.wort}</T>
            <Laut s={s} groesse={20} />
          </View>
        </Zeile>
        {s.tipp && <T leise groesse={14} style={{ marginTop: 8 }}>{t(s.tipp)}</T>}
        {s.standard?.length ? <T groesse={14} farbe={f.warn} style={{ marginTop: 4 }}>{t(s.standard[0].hinweis)}</T> : null}
        <Zeile style={{ marginTop: 12 }}>
          <Knopf klein art="sekundaer" titel={t('allg.frau')} symbol="🔊" onPress={() => spiele(gewaehlt, 'frau')} />
          <Knopf klein art="sekundaer" titel={t('allg.mann')} symbol="🔊" onPress={() => spiele(gewaehlt, 'mann')} />
          <Knopf klein art="sekundaer" titel={t('allg.langsam')} symbol="🐢" onPress={() => spiele(gewaehlt, stimme, 0.7)} />
          <Knopf klein art={erk.laeuft ? 'ok' : 'primaer'} titel={erk.laeuft ? t('allg.hoereZu') : t('aussprache.nachsprechen')} symbol="🎙" onPress={() => (erk.laeuft ? erk.stoppe() : (setErgebnis(null), erk.starte()))} />
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

      <Auswahl label={t('aussprache.gruppe')} werte={[{ wert: 'buchstaben', text: t('aussprache.buchstaben') }, { wert: 'ziffern', text: t('aussprache.ziffern') }]} wert={gruppe} onWahl={setGruppe} />
      <View style={stl.raster}>
        {liste.map((x) => (
          <Pressable key={x.sym} onPress={() => waehle(x.sym)} accessibilityRole="button" accessibilityLabel={t('allg.anhoeren', { wort: x.wort })}
            style={({ pressed }) => [stl.karte, { backgroundColor: x.sym === gewaehlt ? f.panel2 : f.panel, borderColor: x.sym === gewaehlt ? f.akzent : f.rand, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={{ color: f.akzent, fontFamily: MONO, fontSize: 22, fontWeight: '800', width: 46 }}>{x.sym === '000' ? '1000' : x.sym === '00' ? '100' : x.sym}</Text>
            <View style={{ flex: 1 }}>
              <T fett groesse={15}>{x.wort}</T>
              <Laut s={x} groesse={13} />
            </View>
          </Pressable>
        ))}
      </View>

      <Panel titel={t('aussprache.merkhilfe')}>
        <T groesse={14}>{t('aussprache.m1a')}<T groesse={14} fett farbe={f.akzent}>{t('aussprache.m1b')}</T>{t('aussprache.m1c')}</T>
        <T groesse={14}>{t('aussprache.m2')}</T>
        <T groesse={14}>{t('aussprache.m3')}</T>
        <T groesse={14}>{t('aussprache.m4')}</T>
        <Etikett style={{ marginTop: 10 }}>{t('aussprache.erkennung')}</Etikett>
        <T leise groesse={13}>{t('aussprache.erkennungInfo')}</T>
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
