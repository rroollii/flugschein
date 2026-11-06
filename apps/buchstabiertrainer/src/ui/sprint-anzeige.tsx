import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { MONO, useFarben, type Farben } from '../lib/theme';
import { NATIV, useRuhig } from '../lib/bewegung';
import { SPRINT_ANZEIGEN, einstellen, type SprintAnzeige } from '../lib/store';
import { useT } from '../i18n';
import { T } from './komponenten';

/** Teil des Folge-Zustands, den die Anzeigen brauchen (auch für die Vorschau mit Musterdaten). */
export type Stand = { pos: number; ergebnisse: readonly ({ ok: boolean } | null)[] };
type Props = {
  ziel: string[]; stand: Stand; falsch: boolean; breite: number; ruhig: boolean;
  /** Miniatur für die Vorschaukachel */
  mini?: boolean;
  /** Codewort/Lautschrift zum aktuellen Zeichen (leer = ausgeblendet) */
  wort?: string;
};
type Status = 'ok' | 'fehler' | 'aktuell' | 'falsch' | 'offen';

function statusVon(p: Props, i: number): Status {
  if (i < p.stand.pos) return p.stand.ergebnisse[i]?.ok ? 'ok' : 'fehler';
  if (i === p.stand.pos) return p.falsch ? 'falsch' : 'aktuell';
  return 'offen';
}

function kachelFarben(f: Farben, s: Status) {
  switch (s) {
    case 'ok': return { bg: f.ok + '26', rand: f.ok + '99', text: f.ok };
    case 'fehler': return { bg: f.fehler + '26', rand: f.fehler, text: f.fehler };
    case 'aktuell': return { bg: f.akzent, rand: f.akzent, text: f.akzentText };
    case 'falsch': return { bg: f.fehler, rand: f.fehler, text: f.bg };
    default: return { bg: f.panel2, rand: f.rand, text: f.text };
  }
}

const leuchten = (farbe: string) => ({ shadowColor: farbe, shadowOpacity: 0.9, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 8 });

function Kachel({ sym, s, groesse, mini }: { sym: string; s: Status; groesse: number; mini?: boolean }) {
  const f = useFarben();
  const k = kachelFarben(f, s);
  const an = s === 'aktuell' || s === 'falsch';
  return (
    <View style={[stl.kachel, { width: groesse, height: groesse, borderRadius: Math.round(groesse * 0.2), backgroundColor: k.bg, borderColor: k.rand, borderWidth: mini ? 1 : 1.5 },
      an && !mini && leuchten(k.rand)]}>
      <Text style={{ fontFamily: MONO, fontWeight: '800', fontSize: Math.round(groesse * 0.56), color: k.text, textDecorationLine: s === 'fehler' ? 'line-through' : 'none' }}>{sym}</Text>
      {!mini && groesse >= 34 && (s === 'ok' || s === 'fehler') && (
        <Text style={[stl.marke, { color: k.text, fontSize: Math.round(groesse * 0.24) }]}>{s === 'ok' ? '✓' : '✗'}</Text>
      )}
    </View>
  );
}

function WortZeile({ wort }: { wort?: string }) {
  const f = useFarben();
  return <T groesse={22} fett farbe={f.leise} style={{ minHeight: 30, textAlign: 'center' }}>{wort || ' '}</T>;
}

/** 1 – bisherige Darstellung: großer Buchstabe, Codewort, Vorschau der nächsten sechs. */
function Klassisch(p: Props) {
  const f = useFarben();
  const a = p.ziel[p.stand.pos];
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[stl.zeichen, p.mini && stl.zeichenMini, { color: p.falsch ? f.fehler : f.akzent }]} accessibilityLiveRegion="polite">{a ?? '✓'}</Text>
      {!p.mini && <WortZeile wort={p.wort} />}
      <Text style={[stl.vorschau, p.mini && stl.vorschauMini, { color: f.leise }]}>{p.ziel.slice(p.stand.pos + 1, p.stand.pos + (p.mini ? 5 : 7)).join('  ')}</Text>
    </View>
  );
}

/** 2 – Laufband: alle gleich groß in einer Reihe; die Reihe rückt nach links aus dem Bild. */
function Laufband(p: Props) {
  const groesse = p.mini ? 16 : p.breite < 360 ? 50 : 60;
  const abstand = p.mini ? 3 : 8;
  const rand = p.mini ? 0 : 16;
  const anker = Math.round((p.breite + 2 * rand) * 0.36);
  const ziel = anker - p.stand.pos * (groesse + abstand);
  const [x] = useState(() => new Animated.Value(ziel));
  const vorher = useRef(p.stand.pos);
  useEffect(() => {
    const vor = p.stand.pos > vorher.current;
    vorher.current = p.stand.pos;
    if (p.ruhig || !vor) { x.stopAnimation(); x.setValue(ziel); return; }
    Animated.timing(x, { toValue: ziel, duration: p.mini ? 320 : 180, easing: Easing.out(Easing.cubic), useNativeDriver: NATIV }).start();
  }, [ziel, p.ruhig, p.mini, p.stand.pos, x]);
  return (
    <View style={{ height: groesse + (p.mini ? 6 : 28), width: p.breite + 2 * rand, alignSelf: 'center', overflow: 'hidden', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', left: 0, flexDirection: 'row', gap: abstand, transform: [{ translateX: x }] }}>
        {p.ziel.map((s, i) => <Kachel key={i} sym={s} s={statusVon(p, i)} groesse={groesse} mini={p.mini} />)}
      </Animated.View>
    </View>
  );
}

/** 3 – Raster: alle Zeichen auf einen Blick, das aktuelle leuchtet in der Akzentfarbe. */
function Raster(p: Props) {
  const spalten = p.mini ? 5 : 10;
  const abstand = p.mini ? 2 : p.breite < 360 ? 4 : 6;
  const zelle = Math.max(8, Math.floor(Math.min(p.mini ? 14 : 52, (p.breite - abstand * (spalten - 1)) / spalten)));
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: abstand, width: spalten * zelle + abstand * (spalten - 1), alignSelf: 'center', paddingVertical: p.mini ? 0 : 8 }}>
      {p.ziel.map((s, i) => <Kachel key={i} sym={s} s={statusVon(p, i)} groesse={zelle} mini={p.mini} />)}
    </View>
  );
}

const FOKUS_NAECHSTE = [{ g: 0.36, o: 0.95 }, { g: 0.28, o: 0.65 }, { g: 0.22, o: 0.4 }];

/** 4 – Fokus: aktuelles Zeichen groß, die nächsten drei klein daneben, die letzten zwei mit Ergebnis. */
function Fokus(p: Props) {
  const f = useFarben();
  const gross = p.mini ? 30 : p.breite < 360 ? 110 : 130;
  const pos = p.stand.pos;
  const a = p.ziel[pos];
  const [pop] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (p.ruhig) { pop.setValue(1); return; }
    pop.setValue(0);
    Animated.timing(pop, { toValue: 1, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: NATIV }).start();
  }, [pos, p.ruhig, pop]);
  const vorige = [pos - 2, pos - 1].filter((i) => i >= 0);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', gap: p.mini ? 2 : 6, width: gross * 0.55, justifyContent: 'flex-end', marginRight: p.mini ? 3 : 8 }}>
        {vorige.map((i) => {
          const ok = p.stand.ergebnisse[i]?.ok;
          return (
            <Text key={i} style={{ fontFamily: MONO, fontWeight: '800', fontSize: Math.round(gross * 0.22), color: ok ? f.ok : f.fehler, textDecorationLine: ok ? 'none' : 'line-through' }}>
              {p.ziel[i]}
            </Text>
          );
        })}
      </View>
      <Animated.Text style={{ fontFamily: MONO, fontWeight: '800', fontSize: gross, lineHeight: Math.round(gross * 1.13), color: p.falsch ? f.fehler : f.akzent,
        opacity: pop.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }), transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }}>
        {a ?? '✓'}
      </Animated.Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: p.mini ? 3 : 8, width: gross * 0.95, marginLeft: p.mini ? 3 : 8 }}>
        {FOKUS_NAECHSTE.map((n, k) => {
          const s = p.ziel[pos + 1 + k];
          return s ? <Text key={k} style={{ fontFamily: MONO, fontWeight: '700', fontSize: Math.round(gross * n.g), color: f.text, opacity: n.o }}>{s}</Text> : null;
        })}
      </View>
    </View>
  );
}

function Karte({ sym, s, b, h, mini }: { sym: string; s: Status; b: number; h: number; mini?: boolean }) {
  const f = useFarben();
  const farbe = s === 'ok' ? f.ok : s === 'fehler' || s === 'falsch' ? f.fehler : s === 'aktuell' ? f.akzent : f.rand;
  const toenung = s === 'ok' ? f.ok + '22' : s === 'fehler' ? f.fehler + '22' : null;
  const vorne = s === 'aktuell' || s === 'falsch';
  const radius = mini ? 4 : 16;
  return (
    <View style={[stl.karte, { width: b, height: h, borderRadius: radius, borderWidth: vorne && !mini ? 2.5 : 1, borderColor: farbe, backgroundColor: s === 'offen' ? f.panel2 : f.panel }, vorne && !mini && leuchten(farbe)]}>
      {toenung && <View style={[StyleSheet.absoluteFill, { backgroundColor: toenung, borderRadius: radius }]} />}
      <Text style={{ fontFamily: MONO, fontWeight: '800', fontSize: Math.round(b * 0.66), color: s === 'offen' ? f.leise : farbe, textDecorationLine: s === 'fehler' ? 'line-through' : 'none' }}>{sym}</Text>
      {(s === 'ok' || s === 'fehler') && (
        <View style={[stl.plakette, { backgroundColor: farbe, width: Math.round(b * 0.26), height: Math.round(b * 0.26), borderRadius: b * 0.13, top: b * 0.05, right: b * 0.05 }]}>
          <Text style={{ color: f.bg, fontWeight: '900', fontSize: Math.round(b * 0.17) }}>{s === 'ok' ? '✓' : '✗'}</Text>
        </View>
      )}
    </View>
  );
}

/** 5 – Karten: Stapel rechts, aktuelle Karte in der Mitte, beantwortete fliegt markiert nach links auf die Ablage. */
function Karten(p: Props) {
  const b = p.mini ? 26 : p.breite < 360 ? 116 : 140;
  const h = Math.round(b * 1.3);
  const pos = p.stand.pos;
  const n = p.ziel.length;
  const [v] = useState(() => new Animated.Value(1));
  const vorher = useRef(pos);
  useEffect(() => {
    const vor = pos > vorher.current;
    vorher.current = pos;
    if (p.ruhig || !vor) { v.stopAnimation(); v.setValue(1); return; }
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: p.mini ? 380 : 220, easing: Easing.out(Easing.cubic), useNativeDriver: NATIV }).start();
  }, [pos, p.ruhig, p.mini, v]);
  const dx = Math.max(b * 0.6, Math.min(b * 1.05, p.breite / 2 - b * 0.31 - 4));
  const ablage = [{ translateX: -dx - b * 0.04 }, { scale: 0.62 }, { rotate: '-14deg' }];
  const hoehe = h + (p.mini ? 4 : 24);
  const lage = { position: 'absolute' as const, left: (p.breite - b) / 2, top: (hoehe - h) / 2 };
  const iv = (a: number | string, z: number | string) => v.interpolate({ inputRange: [0, 1], outputRange: [a, z] as any });
  return (
    <View style={{ height: hoehe, width: p.breite }}>
      {pos + 2 < n && <View style={[lage, { transform: [{ translateX: dx * 0.78 }, { scale: 0.62 }] }]}><Karte sym={p.ziel[pos + 2]} s="offen" b={b} h={h} mini={p.mini} /></View>}
      {pos + 1 < n && (
        <Animated.View style={[lage, { transform: [{ translateX: iv(dx * 0.78, dx * 0.5) }, { scale: iv(0.62, 0.72) }] }]}>
          <Karte sym={p.ziel[pos + 1]} s="offen" b={b} h={h} mini={p.mini} />
        </Animated.View>
      )}
      {pos >= 2 && <View style={[lage, { transform: ablage }]}><Karte sym={p.ziel[pos - 2]} s={statusVon(p, pos - 2)} b={b} h={h} mini={p.mini} /></View>}
      {pos >= 1 && (
        <Animated.View style={[lage, { transform: [{ translateX: iv(0, -dx) }, { scale: iv(1, 0.62) }, { rotate: iv('0deg', '-8deg') }] }]}>
          <Karte sym={p.ziel[pos - 1]} s={statusVon(p, pos - 1)} b={b} h={h} mini={p.mini} />
        </Animated.View>
      )}
      {pos < n && (
        <Animated.View style={[lage, { opacity: iv(0.6, 1), transform: [{ translateX: iv(dx * 0.5, 0) }, { scale: iv(0.72, 1) }] }]}>
          <Karte sym={p.ziel[pos]} s={p.falsch ? 'falsch' : 'aktuell'} b={b} h={h} mini={p.mini} />
        </Animated.View>
      )}
    </View>
  );
}

const ANSICHTEN: Record<SprintAnzeige, (p: Props) => React.ReactElement> = { klassisch: Klassisch, laufband: Laufband, raster: Raster, fokus: Fokus, karten: Karten };

/**
 * Anzeige der Zeichenfolge im Lauf. Memoisiert: die Sprint-Uhr rendert die Seite alle ~50 ms neu,
 * die Anzeige aber nur, wenn sich der Folge-Zustand ändert.
 */
export const SprintAnzeigeAnsicht = memo(function SprintAnzeigeAnsicht(p: Props & { art: SprintAnzeige }) {
  const { t } = useT();
  const art = ANSICHTEN[p.art] ? p.art : 'klassisch';
  const Ansicht = ANSICHTEN[art];
  if (art === 'klassisch') return <Ansicht {...p} />;
  if (!p.breite) return null;
  const a = p.ziel[p.stand.pos];
  return (
    <View style={{ alignSelf: 'stretch', alignItems: 'center', gap: 6 }}>
      <View style={{ alignSelf: 'stretch', alignItems: 'center' }} accessible={!p.mini} accessibilityLabel={a ? t('sprint.aktuell', { sym: a }) : undefined} accessibilityLiveRegion="polite">
        <Ansicht {...p} />
      </View>
      {!p.mini && <WortZeile wort={p.wort} />}
    </View>
  );
});

const MUSTER = 'PILOTABCDE'.split('');
const MUSTER_ERG = MUSTER.map((_, i) => ({ ok: i !== 2 }));

/** Auswahl der Anzeige mit animierten Vorschaukacheln (bei „Bewegung reduzieren“ als Standbild). */
export function AnzeigeWahl({ wert }: { wert: SprintAnzeige }) {
  const f = useFarben();
  const { t } = useT();
  const ruhig = useRuhig();
  const [breite, setBreite] = useState(0);
  const [takt, setTakt] = useState(4);
  useEffect(() => {
    if (ruhig) return;
    const id = setInterval(() => setTakt((x) => (x + 1) % MUSTER.length), 1000);
    return () => clearInterval(id);
  }, [ruhig]);
  const k = ruhig ? 4 : takt;
  const spalten = breite >= 640 ? 5 : breite >= 420 ? 3 : 2;
  const abstand = 10;
  const kb = breite ? Math.floor((breite - abstand * (spalten - 1)) / spalten) : 0;
  const stand = { pos: k, ergebnisse: MUSTER_ERG };
  return (
    <View onLayout={(e) => setBreite(e.nativeEvent.layout.width)} accessibilityRole="radiogroup" accessibilityLabel={t('sprint.anzeige')} style={stl.wahlListe}>
      {kb > 0 && SPRINT_ANZEIGEN.map((a) => {
        const an = a === wert;
        return (
          <Pressable key={a} accessibilityRole="radio" accessibilityState={{ selected: an, checked: an }}
            accessibilityLabel={`${t(`sprint.anzeige.${a}`)}: ${t(`sprint.anzeige.${a}.text`)}`} onPress={() => einstellen('sprintAnzeige', a)}
            style={({ pressed }) => [stl.wahl, { width: kb, borderColor: an ? f.akzent : f.rand, backgroundColor: an ? f.panel2 : f.panel, opacity: pressed ? 0.8 : 1 }]}>
            <View style={[stl.skizze, { backgroundColor: f.bg, borderColor: an ? f.akzent + '66' : f.rand }]} pointerEvents="none"
              aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              <SprintAnzeigeAnsicht art={a} ziel={MUSTER} stand={stand} falsch={false} breite={kb - 2 * 8 - 2 * 2} ruhig={ruhig} mini />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[stl.radio, { borderColor: an ? f.akzent : f.leise }]}>{an && <View style={[stl.radioPunkt, { backgroundColor: f.akzent }]} />}</View>
              <Text style={{ color: f.text, fontWeight: '800', fontSize: 14, flexShrink: 1 }} numberOfLines={1}>{t(`sprint.anzeige.${a}`)}</Text>
            </View>
            <T leise groesse={12}>{t(`sprint.anzeige.${a}.text`)}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

const stl = StyleSheet.create({
  kachel: { alignItems: 'center', justifyContent: 'center' },
  marke: { position: 'absolute', top: 1, right: 3, fontWeight: '900' },
  zeichen: { fontFamily: MONO, fontSize: 150, lineHeight: 170, fontWeight: '800' },
  zeichenMini: { fontSize: 34, lineHeight: 38 },
  vorschau: { fontFamily: MONO, fontSize: 26, letterSpacing: 2, marginTop: 4 },
  vorschauMini: { fontSize: 10, letterSpacing: 1, marginTop: 0 },
  karte: { alignItems: 'center', justifyContent: 'center' },
  plakette: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  wahlListe: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  wahl: { borderWidth: 2, borderRadius: 12, padding: 8, gap: 6 },
  skizze: { height: 72, borderRadius: 8, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  radio: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioPunkt: { width: 6, height: 6, borderRadius: 3 },
});
