import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router, type Href } from 'expo-router';
import { Seite, Panel, Etikett, T, Knopf, Balken, Anzeige, Zeile } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, bestzeit, laufKlasse, serie, heute, type Zustand } from '../lib/store';
import { faelligeKarten } from '../lib/karten';
import { useT } from '../i18n';

const MODI: { href: Href; k: 'sprint' | 'lernen' | 'hoeren' | 'kennzeichen' | 'woerter' | 'aussprache' | 'statistik' | 'einstellungen'; icon: string }[] = [
  { href: '/sprint', k: 'sprint', icon: '⏱' },
  { href: '/lernen', k: 'lernen', icon: '🗂' },
  { href: '/hoeren', k: 'hoeren', icon: '🎧' },
  { href: { pathname: '/sprint', params: { modus: 'kennzeichen' } }, k: 'kennzeichen', icon: '✈︎' },
  { href: { pathname: '/sprint', params: { modus: 'woerter' } }, k: 'woerter', icon: '🗺' },
  { href: '/aussprache', k: 'aussprache', icon: '🗣' },
  { href: '/statistik', k: 'statistik', icon: '📈' },
  { href: '/einstellungen', k: 'einstellungen', icon: '⚙︎' },
];

const fmt = (ms: number) => (ms / 1000).toFixed(2);

export default function Start() {
  const f = useFarben();
  const { t, sprache } = useT();
  const s = useStore((x) => x);
  const e = s.einstellungen;
  const klasse = laufKlasse({ modus: 'sprint', n: 50, ziffern: false, eingabe: 'sprache' });
  const best = bestzeit(s.laeufe, klasse);
  const bestTippen = bestzeit(s.laeufe, laufKlasse({ modus: 'sprint', n: 50, ziffern: false, eingabe: 'tippen' }));
  const tag = s.tage[heute()] || 0;
  const ser = serie(s);
  const faellig = faelligeKarten(s as Zustand).length;

  return (
    <Seite zurueck={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[stl.logo, { backgroundColor: f.akzent }]}><Text style={[stl.logoText, { color: f.akzentText }]}>A·B</Text></View>
        <View style={{ flex: 1 }}>
          <T groesse={22} fett zeilen={1}>{t('app.name')}</T>
          <T leise groesse={14}>{t('app.untertitel')}</T>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('einst.sprache')} onPress={() => router.push('/einstellungen')}
          style={({ pressed }) => [stl.sprache, { borderColor: f.rand, backgroundColor: f.panel, opacity: pressed ? 0.7 : 1 }]}>
          <Text style={{ color: f.text, fontFamily: MONO, fontWeight: '700', fontSize: 13 }}>🌐 {sprache.toUpperCase()}</Text>
        </Pressable>
      </View>

      <Panel style={{ borderColor: f.akzent }}>
        <Etikett farbe={f.akzent}>{t('start.missionsziel')}</Etikett>
        <T groesse={20} fett style={{ marginTop: 4 }}>{t('start.zielText')}</T>
        <Zeile style={{ marginTop: 12 }} abstand={16}>
          <Anzeige label={t('start.best50')} wert={best ? fmt(best.ms) : '--.--'} einheit="s" farbe={best && best.ms < 30000 ? f.ok : f.akzent} />
          <Anzeige label={t('allg.ziel')} wert="30.00" einheit="s" farbe={f.leise} />
        </Zeile>
        {bestTippen && <T leise groesse={13}>{t('start.bestTippen', { s: fmt(bestTippen.ms) })}</T>}
        <Knopf titel={t('start.sprintStarten')} symbol="▶" style={{ marginTop: 14 }} onPress={() => router.push('/sprint')} />
      </Panel>

      <Panel>
        <Zeile style={{ justifyContent: 'space-between' }}>
          <Etikett>{t('start.tagesziel')}</Etikett>
          <T mono groesse={14} leise>{t('start.tageszielWert', { n: Math.min(tag, e.tagesziel), ziel: e.tagesziel })}</T>
        </Zeile>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Balken wert={tag / e.tagesziel} farbe={tag >= e.tagesziel ? f.ok : f.akzent} hoehe={10} /></View>
        <Zeile style={{ marginTop: 10 }} abstand={18}>
          <T groesse={14}>🔥 {t('start.serie')} <T fett groesse={14}>{ser} {t(ser === 1 ? 'allg.tag' : 'allg.tage')}</T></T>
          {faellig > 0 && <Link href="/lernen"><T groesse={14} farbe={f.info}>🗂 {t('start.faellig', { n: faellig })}</T></Link>}
        </Zeile>
      </Panel>

      <View style={stl.raster}>
        {MODI.map((m) => (
          <Pressable key={m.k} accessibilityRole="button" onPress={() => router.push(m.href)}
            style={({ pressed }) => [stl.kachel, { backgroundColor: f.panel, borderColor: f.rand, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={{ fontSize: 26 }}>{m.icon}</Text>
            <T fett groesse={16} style={{ marginTop: 6 }}>{t(`modus.${m.k}`)}</T>
            <T leise groesse={13}>{t(`modus.${m.k}.text`)}</T>
          </Pressable>
        ))}
      </View>

      <T leise groesse={12} style={{ textAlign: 'center', marginTop: 8 }}>
        {t('start.datenschutz')}
      </T>
    </Seite>
  );
}

const stl = StyleSheet.create({
  logo: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: MONO, fontWeight: '900', fontSize: 17 },
  sprache: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, alignSelf: 'flex-start' },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kachel: { flexGrow: 1, flexBasis: 160, minHeight: 118, borderRadius: 14, borderWidth: 1, padding: 14 },
});
