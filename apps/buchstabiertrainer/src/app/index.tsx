import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router, type Href } from 'expo-router';
import { Seite, Panel, Etikett, T, Knopf, Balken, Anzeige, Zeile } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, bestzeit, laufKlasse, serie, heute, type Zustand } from '../lib/store';
import { faelligeKarten } from '../lib/karten';

const MODI: { href: Href; titel: string; text: string; icon: string }[] = [
  { href: '/sprint', titel: 'Sprint', text: '10 · 25 · 50 Zeichen auf Zeit', icon: '⏱' },
  { href: '/lernen', titel: 'Lernen', text: 'Karteikasten Buchstabe ↔ Codewort', icon: '🗂' },
  { href: '/hoeren', titel: 'Hören', text: 'Codewort hören, Buchstabe tippen', icon: '🎧' },
  { href: { pathname: '/sprint', params: { modus: 'kennzeichen' } }, titel: 'Kennzeichen', text: 'OE-KRF, D-EABC, HA-…', icon: '✈︎' },
  { href: { pathname: '/sprint', params: { modus: 'woerter' } }, titel: 'Wörter & Orte', text: 'LOGF, Fürstenfeld, QNH …', icon: '🗺' },
  { href: '/aussprache', titel: 'Aussprache', text: 'Lautschrift, Hörbeispiele, Nachsprechen', icon: '🗣' },
  { href: '/statistik', titel: 'Statistik', text: 'Fehler je Buchstabe, Nachtraining', icon: '📈' },
  { href: '/einstellungen', titel: 'Einstellungen', text: 'Erkennung, Stimme, Tagesziel, Daten', icon: '⚙︎' },
];

const fmt = (ms: number) => (ms / 1000).toFixed(2);

export default function Start() {
  const f = useFarben();
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
          <T groesse={24} fett>Buchstabiertrainer</T>
          <T leise groesse={14}>ICAO-/NATO-Alphabet für Pilot:innen</T>
        </View>
      </View>

      <Panel style={{ borderColor: f.akzent }}>
        <Etikett farbe={f.akzent}>Missionsziel</Etikett>
        <T groesse={20} fett style={{ marginTop: 4 }}>50 Buchstaben in unter 30 Sekunden</T>
        <Zeile style={{ marginTop: 12 }} abstand={16}>
          <Anzeige label="Bestzeit 50 (Sprache)" wert={best ? fmt(best.ms) : '--.--'} einheit="s" farbe={best && best.ms < 30000 ? f.ok : f.akzent} />
          <Anzeige label="Ziel" wert="30.00" einheit="s" farbe={f.leise} />
        </Zeile>
        {bestTippen && <T leise groesse={13}>Bestzeit Tippen: {fmt(bestTippen.ms)} s</T>}
        <Knopf titel="Sprint starten" symbol="▶" style={{ marginTop: 14 }} onPress={() => router.push('/sprint')} />
      </Panel>

      <Panel>
        <Zeile style={{ justifyContent: 'space-between' }}>
          <Etikett>Tagesziel</Etikett>
          <T mono groesse={14} leise>{Math.min(tag, e.tagesziel)} / {e.tagesziel} Zeichen</T>
        </Zeile>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Balken wert={tag / e.tagesziel} farbe={tag >= e.tagesziel ? f.ok : f.akzent} hoehe={10} /></View>
        <Zeile style={{ marginTop: 10 }} abstand={18}>
          <T groesse={14}>🔥 Serie: <T fett groesse={14}>{ser} {ser === 1 ? 'Tag' : 'Tage'}</T></T>
          {faellig > 0 && <Link href="/lernen"><T groesse={14} farbe={f.info}>🗂 {faellig} Karten fällig</T></Link>}
        </Zeile>
      </Panel>

      <View style={stl.raster}>
        {MODI.map((m) => (
          <Pressable key={m.titel} accessibilityRole="button" onPress={() => router.push(m.href)}
            style={({ pressed }) => [stl.kachel, { backgroundColor: f.panel, borderColor: f.rand, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={{ fontSize: 26 }}>{m.icon}</Text>
            <T fett groesse={16} style={{ marginTop: 6 }}>{m.titel}</T>
            <T leise groesse={13}>{m.text}</T>
          </Pressable>
        ))}
      </View>

      <T leise groesse={12} style={{ textAlign: 'center', marginTop: 8 }}>
        Datenschutz: kein Konto, keine Server. Fortschritt bleibt auf diesem Gerät; Spracherkennung wenn möglich on-device.
      </T>
    </Seite>
  );
}

const stl = StyleSheet.create({
  logo: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: MONO, fontWeight: '900', fontSize: 17 },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kachel: { flexGrow: 1, flexBasis: 160, minHeight: 118, borderRadius: 14, borderWidth: 1, padding: 14 },
});
