import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Line, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import { MONO, useFarben } from '../lib/theme';
import { useT } from '../i18n';

export function Seite({ titel, children, zurueck = true, scroll = true, rechts }: {
  titel?: string; children: React.ReactNode; zurueck?: boolean; scroll?: boolean; rechts?: React.ReactNode;
}) {
  const f = useFarben();
  const { t } = useT();
  const ins = useSafeAreaInsets();
  const inhalt = <View style={[st.inhalt]}>{children}</View>;
  return (
    <View style={{ flex: 1, backgroundColor: f.bg, paddingTop: ins.top }}>
      {titel != null && (
        <View style={[st.kopf, { borderBottomColor: f.rand }]}>
          {zurueck ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t('allg.zurueck')} hitSlop={12}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={st.zurueck}>
              <Text style={{ color: f.akzent, fontSize: 28, lineHeight: 30 }}>‹</Text>
            </Pressable>
          ) : <View style={st.zurueck} />}
          <Text style={[st.kopfText, { color: f.text }]} numberOfLines={1} accessibilityRole="header">{titel}</Text>
          <View style={[st.zurueck, { alignItems: 'flex-end', width: 'auto', minWidth: 40 }]}>{rechts}</View>
        </View>
      )}
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: ins.bottom + 32 }} keyboardShouldPersistTaps="handled">{inhalt}</ScrollView>
      ) : (
        <View style={{ flex: 1, paddingBottom: ins.bottom }}>{inhalt}</View>
      )}
    </View>
  );
}

export function Panel({ children, style, titel }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; titel?: string }) {
  const f = useFarben();
  return (
    <View style={[st.panel, { backgroundColor: f.panel, borderColor: f.rand }, style]}>
      {titel && <Etikett style={{ marginBottom: 10 }}>{titel}</Etikett>}
      {children}
    </View>
  );
}

export function Etikett({ children, style, farbe }: { children: React.ReactNode; style?: StyleProp<TextStyle>; farbe?: string }) {
  const f = useFarben();
  return <Text style={[st.etikett, { color: farbe ?? f.leise }, style]}>{children}</Text>;
}

export function T({ children, style, leise, groesse = 16, fett, mono, farbe, zeilen }: {
  children: React.ReactNode; style?: StyleProp<TextStyle>; leise?: boolean; groesse?: number; fett?: boolean; mono?: boolean; farbe?: string; zeilen?: number;
}) {
  const f = useFarben();
  return (
    <Text numberOfLines={zeilen} style={[{ color: farbe ?? (leise ? f.leise : f.text), fontSize: groesse, lineHeight: Math.round(groesse * 1.35), fontWeight: fett ? '700' : '400' },
      mono && { fontFamily: MONO, fontVariant: ['tabular-nums'] }, style]}>
      {children}
    </Text>
  );
}

export function Knopf({ titel, onPress, art = 'primaer', klein, deaktiviert, style, symbol, label }: {
  titel: string; onPress: () => void; art?: 'primaer' | 'sekundaer' | 'ok' | 'fehler' | 'leer'; klein?: boolean; deaktiviert?: boolean;
  style?: StyleProp<ViewStyle>; symbol?: string; label?: string;
}) {
  const f = useFarben();
  const bg = { primaer: f.akzent, sekundaer: f.panel2, ok: f.ok, fehler: f.fehler, leer: 'transparent' }[art];
  const fg = art === 'primaer' ? f.akzentText : art === 'ok' || art === 'fehler' ? '#06110b' : f.text;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label ?? titel} disabled={deaktiviert} onPress={onPress}
      style={({ pressed }) => [st.knopf, klein && st.knopfKlein, { backgroundColor: bg, borderColor: art === 'sekundaer' || art === 'leer' ? f.rand : bg, opacity: deaktiviert ? 0.4 : pressed ? 0.75 : 1 }, style]}>
      <Text style={[st.knopfText, klein && { fontSize: 14 }, { color: fg }]}>{symbol ? `${symbol}  ` : ''}{titel}</Text>
    </Pressable>
  );
}

export function Auswahl<V extends string | number | boolean>({ werte, wert, onWahl, label }: {
  werte: { wert: V; text: string }[]; wert: V; onWahl: (v: V) => void; label?: string;
}) {
  const f = useFarben();
  return (
    <View style={[st.auswahl, { borderColor: f.rand, backgroundColor: f.panel2 }]} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {werte.map((w) => {
        const an = w.wert === wert;
        return (
          <Pressable key={String(w.wert)} accessibilityRole="radio" accessibilityState={{ selected: an }} onPress={() => onWahl(w.wert)}
            style={[st.auswahlTeil, an && { backgroundColor: f.akzent }]}>
            <Text style={{ color: an ? f.akzentText : f.text, fontWeight: '700', fontSize: 14 }}>{w.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Zeile({ children, style, abstand = 10 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; abstand?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: abstand, flexWrap: 'wrap' }, style]}>{children}</View>;
}

export function Balken({ wert, farbe, hoehe = 8 }: { wert: number; farbe?: string; hoehe?: number }) {
  const f = useFarben();
  return (
    <View style={{ height: hoehe, borderRadius: hoehe, backgroundColor: f.panel2, overflow: 'hidden', flex: 1 }}>
      <View style={{ width: `${Math.max(0, Math.min(1, wert)) * 100}%`, height: '100%', backgroundColor: farbe ?? f.akzent }} />
    </View>
  );
}

export function Anzeige({ wert, einheit, label, farbe, groesse = 34 }: { wert: string; einheit?: string; label: string; farbe?: string; groesse?: number }) {
  const f = useFarben();
  return (
    <View style={{ flex: 1, minWidth: 90 }}>
      <Etikett>{label}</Etikett>
      <Text style={{ color: farbe ?? f.text, fontFamily: MONO, fontVariant: ['tabular-nums'], fontSize: groesse, fontWeight: '700' }}>
        {wert}{einheit ? <Text style={{ fontSize: groesse * 0.45, color: f.leise }}> {einheit}</Text> : null}
      </Text>
    </View>
  );
}

/** Verlauf der Zeiten (s) mit Ziellinie. */
export function Verlauf({ werte, ziel, breite = 320, hoehe = 150 }: { werte: { s: number; ok: boolean }[]; ziel: number; breite?: number; hoehe?: number }) {
  const f = useFarben();
  const { t } = useT();
  if (!werte.length) return <T leise>{t('verlauf.leer')}</T>;
  const max = Math.max(ziel * 1.4, ...werte.map((w) => w.s)) * 1.05;
  const min = Math.max(0, Math.min(ziel * 0.6, ...werte.map((w) => w.s)) * 0.9);
  const pl = 34, pr = 8, pt = 10, pb = 18;
  const x = (i: number) => pl + (werte.length === 1 ? (breite - pl - pr) / 2 : (i * (breite - pl - pr)) / (werte.length - 1));
  const y = (s: number) => pt + (1 - (s - min) / (max - min)) * (hoehe - pt - pb);
  const ticks = [min, ziel, max].map((v) => Math.round(v));
  return (
    <Svg width="100%" height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`} accessibilityLabel={t('verlauf.label', { n: werte.length })}>
      {ticks.map((t) => (
        <SvgText key={t} x={pl - 6} y={y(t) + 4} fill={f.leise} fontSize="10" textAnchor="end">{t}s</SvgText>
      ))}
      <Line x1={pl} x2={breite - pr} y1={y(ziel)} y2={y(ziel)} stroke={f.ok} strokeDasharray="5 4" strokeWidth={1.5} />
      <SvgText x={breite - pr} y={y(ziel) - 4} fill={f.ok} fontSize="10" textAnchor="end">{t('sprint.zielKurz', { s: ziel })}</SvgText>
      <Polyline points={werte.map((w, i) => `${x(i)},${y(w.s)}`).join(' ')} fill="none" stroke={f.akzent} strokeWidth={2} />
      {werte.map((w, i) => (
        <Circle key={i} cx={x(i)} cy={y(w.s)} r={3.5} fill={w.ok ? f.akzent : f.fehler} />
      ))}
    </Svg>
  );
}

export const st = StyleSheet.create({
  inhalt: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 16, gap: 14, flexGrow: 1 },
  kopf: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, height: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  zurueck: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  kopfText: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  panel: { borderRadius: 14, borderWidth: 1, padding: 14 },
  etikett: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  knopf: { minHeight: 52, borderRadius: 12, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  knopfKlein: { minHeight: 38, paddingHorizontal: 12, borderRadius: 10 },
  knopfText: { fontSize: 17, fontWeight: '800', letterSpacing: 0.3, textAlign: 'center' },
  auswahl: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3, gap: 3, alignSelf: 'flex-start', flexWrap: 'wrap' },
  auswahlTeil: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, minWidth: 44, alignItems: 'center' },
});

export const istWeb = Platform.OS === 'web';
