import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Seite, Panel, Etikett, T, Knopf, Auswahl, Zeile, Anzeige, Verlauf } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, einstellen, speichereLauf, zaehle, bestzeit, laufKlasse, hole, type Eingabe, type Lauf } from '../lib/store';
import { BUCHST, ZIFF, folge as zufallsFolge, gewichte, kennzeichen, WORTLISTEN, buchstabierbar, mischen } from '../lib/generator';
import { Folge, type Ergebnis } from '../lib/folge';
import { useErkennung } from '../lib/useErkennung';
import { NACH_SYM, lautschrift } from '../data/alphabet';
import { simAktiv, simSprich } from '../lib/sim';
import { spiele } from '../lib/audio';
import { useT, type Schluessel } from '../i18n';

type Modus = 'sprint' | 'kennzeichen' | 'woerter' | 'nachtraining';
type Gruppe = { anzeige: string; von: number; bis: number };
type Plan = { ziel: string[]; gruppen: Gruppe[] | null; syms: string[] };

const MS_PRO_ZEICHEN = 600; // 50 Zeichen in 30 s
const sek = (ms: number) => (ms / 1000).toFixed(2);
const TITEL: Record<Modus, Schluessel> = { sprint: 'modus.sprint', kennzeichen: 'modus.kennzeichen', woerter: 'modus.woerter', nachtraining: 'modus.nachtraining' };

function planErstellen(modus: Modus, o: { n: number; ziffern: boolean; anzahl: number; liste: string; eigenes: string; schwach?: string[] }): Plan {
  const syms = o.ziffern ? [...BUCHST, ...ZIFF] : BUCHST;
  if (modus === 'sprint' || modus === 'nachtraining') {
    if (modus === 'nachtraining') {
      const st = hole().stats;
      const pool = o.schwach?.length ? o.schwach : syms;
      return { ziel: zufallsFolge(o.n, syms, gewichte(syms, st).map((w, i) => (pool.includes(syms[i]) ? w * 6 : w))), gruppen: null, syms };
    }
    return { ziel: zufallsFolge(o.n, syms), gruppen: null, syms };
  }
  const anzeigen = modus === 'kennzeichen'
    ? kennzeichen(o.anzahl, o.ziffern)
    : o.eigenes.trim()
      ? o.eigenes.split(/[,;\n]+/).map((w) => w.trim()).filter(Boolean)
      : mischen(WORTLISTEN.find((l) => l.id === o.liste)?.woerter ?? []).slice(0, o.anzahl);
  const ziel: string[] = [];
  const gruppen: Gruppe[] = [];
  const mitZ = modus === 'kennzeichen' ? true : o.ziffern || /\d/.test(o.eigenes);
  for (const a of anzeigen) {
    const z = buchstabierbar(a, mitZ);
    if (!z.length) continue;
    gruppen.push({ anzeige: a, von: ziel.length, bis: ziel.length + z.length });
    ziel.push(...z);
  }
  return { ziel, gruppen, syms: mitZ ? [...BUCHST, ...ZIFF] : BUCHST };
}

export default function SprintSeite() {
  const p = useLocalSearchParams<{ modus?: string; schwach?: string }>();
  const modus = (['sprint', 'kennzeichen', 'woerter', 'nachtraining'].includes(p.modus ?? '') ? p.modus : 'sprint') as Modus;
  const [plan, setPlan] = useState<Plan | null>(null);
  const [runde, setRunde] = useState(0);
  const [opts, setOpts] = useState({ anzahl: modus === 'kennzeichen' ? 6 : 8, liste: WORTLISTEN[0].id, eigenes: '' });
  const e = useStore((s) => s.einstellungen);

  const starten = () => {
    setPlan(planErstellen(modus, { n: e.laenge, ziffern: e.ziffern, ...opts, schwach: p.schwach ? p.schwach.split(',') : undefined }));
    setRunde((r) => r + 1);
  };

  if (plan) return <LaufSeite key={runde} modus={modus} plan={plan} nochmal={starten} zurueck={() => setPlan(null)} />;
  return <Vorbereitung modus={modus} opts={opts} setOpts={setOpts} starten={starten} schwach={p.schwach} />;
}

function Vorbereitung({ modus, opts, setOpts, starten, schwach }: {
  modus: Modus; opts: { anzahl: number; liste: string; eigenes: string }; setOpts: (o: any) => void; starten: () => void; schwach?: string;
}) {
  const f = useFarben();
  const { t } = useT();
  const e = useStore((s) => s.einstellungen);
  const laeufe = useStore((s) => s.laeufe);
  const klasse = laufKlasse({ modus, n: e.laenge, ziffern: e.ziffern, eingabe: e.eingabe });
  const best = modus === 'sprint' ? bestzeit(laeufe, klasse) : null;
  return (
    <Seite titel={t(TITEL[modus])}>
      {modus === 'nachtraining' && (
        <Panel><T>{t('sprint.nachtraining', { liste: schwach ? `: ${schwach.split(',').join(' ')}` : '' })}</T></Panel>
      )}
      {(modus === 'sprint' || modus === 'nachtraining') && (
        <Panel titel={t('sprint.laenge')}>
          <Auswahl label={t('sprint.laengeLabel')} werte={[{ wert: 10, text: '10' }, { wert: 25, text: '25' }, { wert: 50, text: '50' }]} wert={e.laenge} onWahl={(v) => einstellen('laenge', v as 10 | 25 | 50)} />
          <T leise groesse={13} style={{ marginTop: 8 }}>{t('sprint.zielZeit', { s: (e.laenge * MS_PRO_ZEICHEN / 1000).toFixed(0), je: MS_PRO_ZEICHEN / 1000 })}{best ? t('sprint.bestzeit', { s: sek(best.ms) }) : ''}</T>
        </Panel>
      )}
      {modus === 'kennzeichen' && (
        <Panel titel={t('sprint.anzahlKennzeichen')}>
          <Auswahl label={t('sprint.anzahl')} werte={[3, 6, 10].map((n) => ({ wert: n, text: String(n) }))} wert={opts.anzahl} onWahl={(v) => setOpts({ ...opts, anzahl: v })} />
          <T leise groesse={13} style={{ marginTop: 8 }}>{t('sprint.kennzeichenInfo')}</T>
        </Panel>
      )}
      {modus === 'woerter' && (
        <Panel titel={t('sprint.wortliste')}>
          <Auswahl label={t('sprint.liste')} werte={WORTLISTEN.map((l) => ({ wert: l.id, text: t(l.titel) }))} wert={opts.liste} onWahl={(v) => setOpts({ ...opts, liste: v })} />
          <Etikett style={{ marginTop: 14 }}>{t('sprint.eigene')}</Etikett>
          <TextInput value={opts.eigenes} onChangeText={(t) => setOpts({ ...opts, eigenes: t })} placeholder={t('sprint.eigenePlatzhalter')}
            placeholderTextColor={f.leise} autoCorrect={false} style={[stl.eingabe, { color: f.text, borderColor: f.rand, backgroundColor: f.panel2 }]} />
          <T leise groesse={13} style={{ marginTop: 8 }}>{t('sprint.umlaute')}</T>
        </Panel>
      )}
      <Panel titel={t('sprint.eingabe')}>
        <Auswahl label={t('sprint.eingabe')} werte={(['sprache', 'tippen', 'selbst'] as const).map((w) => ({ wert: w, text: t(`sprint.eingabe.${w}`) }))}
          wert={e.eingabe} onWahl={(v) => einstellen('eingabe', v as Eingabe)} />
        <T leise groesse={13} style={{ marginTop: 8 }}>
          {t(`sprint.info.${e.eingabe}`)}
        </T>
      </Panel>
      <Panel titel={t('sprint.optionen')}>
        <Zeile>
          {modus !== 'kennzeichen' && <Knopf klein art={e.ziffern ? 'primaer' : 'sekundaer'} titel={t('sprint.ziffern', { wert: { k: e.ziffern ? 'allg.an' : 'allg.aus' } })} onPress={() => einstellen('ziffern', !e.ziffern)} />}
          <Knopf klein art={e.codewortZeigen ? 'primaer' : 'sekundaer'} titel={t('sprint.codewortZeigen', { wert: { k: e.codewortZeigen ? 'allg.an' : 'allg.aus' } })} onPress={() => einstellen('codewortZeigen', !e.codewortZeigen)} />
          <Knopf klein art="sekundaer" titel={t(e.fehlerModus === 'weiter' ? 'sprint.fehlerWeiter' : 'sprint.fehlerWiederholen')} onPress={() => einstellen('fehlerModus', e.fehlerModus === 'weiter' ? 'wiederholen' : 'weiter')} />
        </Zeile>
      </Panel>
      <Knopf titel={t('allg.start')} symbol="▶" onPress={starten} />
      {simAktiv() && <T leise groesse={12}>{t('sprint.sim')}</T>}
    </Seite>
  );
}

function useFolge(fo: Folge) {
  return useSyncExternalStore((cb) => fo.abo(cb), () => fo.z, () => fo.z);
}

function LaufSeite({ modus, plan, nochmal, zurueck }: { modus: Modus; plan: Plan; nochmal: () => void; zurueck: () => void }) {
  const f = useFarben();
  const { t, th } = useT();
  const e = useStore((s) => s.einstellungen);
  const fo = useMemo(() => new Folge(plan.ziel, plan.syms, e.fehlerModus === 'wiederholen'), [plan]);
  const z = useFolge(fo);
  const [, tick] = useState(0);
  const [lauf, setLauf] = useState<Lauf | null>(null);
  const [vorBest, setVorBest] = useState<Lauf | null>(null);
  const eingabe = e.eingabe;
  const erk = useErkennung({ syms: plan.syms, onSegment: (t, fin) => fo.segment(t, fin) });

  useEffect(() => {
    if (eingabe === 'sprache') erk.starte();
    return () => erk.stoppe(true);
  }, []);

  useEffect(() => {
    if (z.start == null || z.ende != null) return;
    const id = setInterval(() => tick((x) => x + 1), 47);
    return () => clearInterval(id);
  }, [z.start, z.ende]);

  useEffect(() => {
    if (!z.letzte || z.letzte.ok || Platform.OS === 'web' || !e.haptik) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }, [z.versuche.length]);

  const abgeschlossen = z.ende != null && z.pos >= plan.ziel.length;
  useEffect(() => {
    if (!abgeschlossen || lauf) return;
    erk.stoppe(true);
    const daten = { modus, n: plan.ziel.length, ziffern: plan.syms.length > 26, eingabe };
    setVorBest(bestzeit(hole().laeufe, laufKlasse(daten)));
    zaehle((z.ergebnisse.filter(Boolean) as Ergebnis[]).map((r) => ({ sym: r.sym, ok: r.ok, ms: r.ms })));
    setLauf(speichereLauf({ ...daten, ms: fo.ms, fehler: fo.fehler, hinweise: fo.hinweise }));
  }, [abgeschlossen]);

  if (lauf) return <ErgebnisSeite lauf={lauf} vorBest={vorBest} fo={fo} plan={plan} nochmal={nochmal} zurueck={zurueck} />;

  const ms = fo.ms;
  const zielMs = plan.ziel.length * MS_PRO_ZEICHEN;
  const sollMs = z.pos * MS_PRO_ZEICHEN;
  const delta = z.start != null && z.pos > 0 ? ms - sollMs : null;
  const aktuell = plan.ziel[z.pos];
  const sym = aktuell ? NACH_SYM[aktuell] : null;
  const letzteFalsch = z.letzte && !z.letzte.ok;
  const zeigeWort = e.codewortZeigen || (e.fehlerModus === 'wiederholen' && letzteFalsch && z.ergebnisse[z.pos] && !z.ergebnisse[z.pos]!.ok);
  const gruppe = plan.gruppen?.find((g) => z.pos >= g.von && z.pos < g.bis) ?? null;

  return (
    <Seite titel={t(TITEL[modus])} scroll={false} rechts={<Knopf klein art="leer" titel={t('allg.abbrechen')} onPress={() => { erk.stoppe(true); zurueck(); }} />}>
      <View style={[stl.instrumente, { backgroundColor: f.panel, borderColor: f.rand }]}>
        <Anzeige label={t('sprint.zeit')} wert={sek(ms)} einheit="s" groesse={44} farbe={z.start == null ? f.leise : ms <= zielMs ? f.text : f.fehler} />
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <T mono groesse={22} fett>{Math.min(z.pos + 1, plan.ziel.length)}<T mono groesse={16} leise>/{plan.ziel.length}</T></T>
          <T mono groesse={14} farbe={fo.fehler ? f.fehler : f.leise}>✗ {fo.fehler}</T>
          <T mono groesse={14} farbe={delta == null ? f.leise : delta <= 0 ? f.ok : f.fehler}>
            {delta == null ? t('sprint.zielKurz', { s: sek(zielMs) }) : `${delta <= 0 ? '−' : '+'}${sek(Math.abs(delta))} s`}
          </T>
        </View>
      </View>
      <Fortschritt plan={plan} z={z} />

      <View style={stl.mitte}>
        {gruppe && (
          <Text style={[stl.gruppe, { color: f.text }]} accessibilityLabel={t('sprint.buchstabiere', { text: gruppe.anzeige })}>
            {(() => {
              let i = gruppe.von;
              return gruppe.anzeige.toUpperCase().replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').split('').map((c, k) => {
                const zaehlt = /[A-Z0-9]/.test(c);
                const idx = zaehlt ? i++ : -1;
                const r = idx >= 0 ? z.ergebnisse[idx] : null;
                const farbe = idx === z.pos ? f.akzent : idx >= 0 && idx < z.pos ? (r?.ok ? f.ok : f.fehler) : f.leise;
                return <Text key={k} style={{ color: farbe, textDecorationLine: idx === z.pos ? 'underline' : 'none' }}>{c}</Text>;
              });
            })()}
          </Text>
        )}
        <Text style={[stl.zeichen, { color: letzteFalsch && z.letzte?.sym === aktuell ? f.fehler : f.akzent }]} accessibilityLiveRegion="polite">
          {aktuell ?? '✓'}
        </Text>
        <T groesse={22} fett farbe={f.leise} style={{ minHeight: 30, textAlign: 'center' }}>
          {sym && zeigeWort ? `${sym.wort}  ·  ${lautschrift(sym)}` : ' '}
        </T>
        {!gruppe && (
          <Text style={[stl.vorschau, { color: f.leise }]}>{plan.ziel.slice(z.pos + 1, z.pos + 7).join('  ')}</Text>
        )}
        <View style={{ minHeight: 48, alignItems: 'center', marginTop: 8 }}>
          {z.letzte && (
            <T groesse={16} farbe={z.letzte.ok ? (z.letzte.hinweis ? f.warn : f.ok) : f.fehler} style={{ textAlign: 'center' }}>
              {z.letzte.ok ? '✓ ' : '✗ '}{z.letzte.hinweis ? th(z.letzte.hinweis) : z.letzte.ok ? NACH_SYM[z.letzte.sym].wort : t('sprint.erwartet', { wort: NACH_SYM[z.letzte.sym].wort })}
            </T>
          )}
        </View>
      </View>

      {eingabe === 'sprache' && (
        <View style={{ gap: 10 }}>
          <View style={[stl.mic, { borderColor: erk.laeuft ? f.ok : f.rand, backgroundColor: f.panel }]}>
            <View style={[stl.punkt, { backgroundColor: erk.laeuft ? f.ok : f.leise }]} />
            <T groesse={14} leise={!erk.laeuft} zeilen={2} style={{ flex: 1 }}>
              {erk.fehler ?? (z.live ? t('allg.gehoert', { text: z.live }) : erk.laeuft ? t(z.start == null ? 'sprint.bereit' : 'allg.hoereZu') : t('sprint.micStart'))}
            </T>
            {!erk.laeuft && <Knopf klein titel={t('sprint.mikrofon')} onPress={() => erk.starte()} />}
          </View>
          {erk.fehler && <Knopf art="sekundaer" titel={t('sprint.stattTippen')} onPress={() => { einstellen('eingabe', 'tippen'); nochmal(); }} />}
          <Zeile style={{ justifyContent: 'center' }}>
            <Knopf klein art="sekundaer" titel={t('sprint.ueberspringen')} onPress={() => fo.ueberspringen()} />
          </Zeile>
          {simAktiv() && <SimPanel fo={fo} />}
        </View>
      )}
      {eingabe === 'tippen' && <TippFeld fo={fo} />}
      {eingabe === 'selbst' && <SelbstTasten fo={fo} />}
    </Seite>
  );
}

function Fortschritt({ plan, z }: { plan: Plan; z: Folge['z'] }) {
  const f = useFarben();
  const { t } = useT();
  return (
    <View style={stl.band} accessibilityLabel={t('sprint.erledigt', { n: z.pos, gesamt: plan.ziel.length })}>
      {plan.ziel.map((s, i) => {
        const r = z.ergebnisse[i];
        const bg = i < z.pos ? (r?.ok ? f.ok : f.fehler) : i === z.pos ? f.akzent : f.panel2;
        return <View key={i} style={[stl.bandTeil, { backgroundColor: bg }]} />;
      })}
    </View>
  );
}

function TippFeld({ fo }: { fo: Folge }) {
  const f = useFarben();
  const { t } = useT();
  const [text, setText] = useState('');
  const ref = useRef<any>(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 150); }, []);
  const aendern = (t: string) => {
    if (/\s$/.test(t) && t.trim()) { fo.tippen(t, true); setText(''); return; }
    if (fo.tippen(t, false)) setText(''); else setText(t);
  };
  return (
    <View style={{ gap: 8 }}>
      <TextInput ref={ref} value={text} onChangeText={aendern} onSubmitEditing={() => { if (text.trim()) fo.tippen(text, true); setText(''); }}
        blurOnSubmit={false} autoCapitalize="none" autoCorrect={false} spellCheck={false} autoComplete="off" returnKeyType="next"
        placeholder={t('sprint.tippPlatzhalter')} placeholderTextColor={f.leise} accessibilityLabel={t('sprint.tippLabel')}
        style={[stl.eingabe, { fontSize: 24, color: f.text, borderColor: f.akzent, backgroundColor: f.panel, fontFamily: MONO }]} />
      <T leise groesse={12} style={{ textAlign: 'center' }}>{t('sprint.tippInfo')}</T>
    </View>
  );
}

function SelbstTasten({ fo }: { fo: Folge }) {
  const { t } = useT();
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const h = (ev: KeyboardEvent) => {
      if (ev.key === ' ' || ev.key === 'ArrowRight' || ev.key === 'j') { ev.preventDefault(); fo.selbst(true); }
      if (ev.key === 'f' || ev.key === 'ArrowLeft' || ev.key === 'n') { ev.preventDefault(); fo.selbst(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [fo]);
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Knopf art="fehler" titel={t('sprint.falsch')} style={{ flex: 1, minHeight: 84 }} onPress={() => fo.selbst(false)} />
      <Knopf art="ok" titel={t('sprint.richtig')} style={{ flex: 2, minHeight: 84 }} onPress={() => fo.selbst(true)} />
    </View>
  );
}

function SimPanel({ fo }: { fo: Folge }) {
  const f = useFarben();
  const { t } = useT();
  const [text, setText] = useState('');
  const [auto, setAuto] = useState<null | number>(null);
  useEffect(() => {
    if (auto == null) return;
    let stop = false;
    (async () => {
      while (!stop && !fo.fertig) {
        const soll = fo.erwartet!;
        const falsch = Math.random() < auto;
        const wort = falsch ? NACH_SYM[soll === 'A' ? 'B' : 'A'].wort : NACH_SYM[soll].varianten[Math.random() < 0.8 ? 0 : 1] ?? NACH_SYM[soll].wort;
        await simSprich(wort, 40);
        await new Promise((r) => setTimeout(r, 380));
      }
    })();
    return () => { stop = true; };
  }, [auto]);
  return (
    <Panel titel={t('sprint.simTitel')} style={{ borderStyle: 'dashed' }}>
      <Zeile>
        <TextInput value={text} onChangeText={setText} placeholder={t('sprint.simPlatzhalter')} placeholderTextColor={f.leise} autoCapitalize="none"
          onSubmitEditing={() => { simSprich(text); setText(''); }} style={[stl.eingabe, { flex: 1, minWidth: 160, color: f.text, borderColor: f.rand, backgroundColor: f.panel2, marginTop: 0 }]} />
        <Knopf klein titel={t('sprint.simSprechen')} onPress={() => { simSprich(text); setText(''); }} />
        <Knopf klein art="sekundaer" titel="Auto ✓" onPress={() => setAuto(0)} />
        <Knopf klein art="sekundaer" titel="Auto 10 % ✗" onPress={() => setAuto(0.1)} />
      </Zeile>
    </Panel>
  );
}

function ErgebnisSeite({ lauf, vorBest, fo, plan, nochmal, zurueck }: { lauf: Lauf; vorBest: Lauf | null; fo: Folge; plan: Plan; nochmal: () => void; zurueck: () => void }) {
  const f = useFarben();
  const { t, th } = useT();
  const e = useStore((s) => s.einstellungen);
  const laeufe = useStore((s) => s.laeufe);
  const klasse = laufKlasse(lauf);
  const verlauf = laeufe.filter((l) => laufKlasse(l) === klasse).slice(-20);
  const zielMs = lauf.n * MS_PRO_ZEICHEN;
  const neueBest = lauf.fehler === 0 && (!vorBest || lauf.ms < vorBest.ms);
  const zpm = lauf.ms ? (lauf.n / (lauf.ms / 60000)) : 0;
  const ergebnisse = fo.z.ergebnisse.filter(Boolean) as Ergebnis[];
  const falsch = ergebnisse.filter((r) => !r.ok);
  const hinweise = ergebnisse.filter((r) => r.ok && r.hinweis);
  const langsam = [...ergebnisse].filter((r) => r.ok).sort((a, b) => b.ms - a.ms).slice(0, 5);
  const geschafft = lauf.fehler === 0 && lauf.ms < zielMs;
  const schwach = [...new Set([...falsch.map((r) => r.sym), ...langsam.slice(0, 3).map((r) => r.sym)])];

  return (
    <Seite titel={t('ergebnis.titel')} rechts={<Knopf klein art="leer" titel={t('allg.fertig')} onPress={() => router.replace('/')} />}>
      <Panel style={{ borderColor: geschafft ? f.ok : f.rand, alignItems: 'center' }}>
        <Etikett farbe={geschafft ? f.ok : f.leise}>{geschafft ? t('ergebnis.zielErreicht') : lauf.fehler ? t(lauf.fehler === 1 ? 'ergebnis.fehlerEins' : 'ergebnis.fehlerAnzahl', { n: lauf.fehler }) : t('ergebnis.nochBisZiel', { s: sek(lauf.ms - zielMs) })}</Etikett>
        <Text style={[stl.zeit, { color: geschafft ? f.ok : f.text }]}>{sek(lauf.ms)}<Text style={{ fontSize: 28, color: f.leise }}> s</Text></Text>
        {neueBest && <T fett farbe={f.akzent}>{t('ergebnis.neueBest')}{vorBest ? t('ergebnis.vorher', { s: sek(vorBest.ms) }) : ''}</T>}
        {!neueBest && vorBest && <T leise>{t('ergebnis.bestzeit', { s: sek(vorBest.ms) })}</T>}
      </Panel>
      <Panel>
        <Zeile abstand={16}>
          <Anzeige label={t('ergebnis.zeichen')} wert={String(lauf.n)} groesse={26} />
          <Anzeige label={t('ergebnis.fehler')} wert={String(lauf.fehler)} groesse={26} farbe={lauf.fehler ? f.fehler : f.ok} />
          <Anzeige label={t('ergebnis.proMin')} wert={zpm.toFixed(0)} groesse={26} />
          <Anzeige label={t('ergebnis.jeZeichen')} wert={(lauf.ms / lauf.n / 1000).toFixed(2)} einheit="s" groesse={26} />
        </Zeile>
      </Panel>
      <Panel titel={t('ergebnis.verlauf', { n: lauf.n, eingabe: { k: `ergebnis.eingabe.${lauf.eingabe}` } })}>
        <Verlauf werte={verlauf.map((l) => ({ s: l.ms / 1000, ok: l.fehler === 0 }))} ziel={zielMs / 1000} />
      </Panel>
      {falsch.length > 0 && (
        <Panel titel={t('ergebnis.fehler')}>
          {falsch.map((r, i) => <FehlerZeile key={i} r={r} stimme={e.stimme} />)}
        </Panel>
      )}
      {hinweise.length > 0 && (
        <Panel titel={t('ergebnis.hinweise')}>
          {hinweise.map((r, i) => <T key={i} groesse={14} farbe={f.warn}>• {r.sym}: {th(r.hinweis!)}</T>)}
        </Panel>
      )}
      {langsam.length > 0 && (
        <Panel titel={t('ergebnis.langsamste')}>
          <Zeile>{langsam.map((r, i) => <T key={i} mono groesse={15}>{r.sym} {(r.ms / 1000).toFixed(2)} s</T>)}</Zeile>
        </Panel>
      )}
      <Zeile>
        <Knopf titel={t('ergebnis.nochmal')} symbol="↻" style={{ flex: 1 }} onPress={nochmal} />
        {schwach.length > 0 && plan.gruppen == null && (
          <Knopf art="sekundaer" titel={t('ergebnis.schwaechen')} style={{ flex: 1 }} onPress={() => router.replace({ pathname: '/sprint', params: { modus: 'nachtraining', schwach: schwach.join(',') } })} />
        )}
      </Zeile>
      <Knopf art="sekundaer" titel={t('ergebnis.einstellungen')} onPress={zurueck} />
    </Seite>
  );
}

function FehlerZeile({ r, stimme }: { r: Ergebnis; stimme: 'frau' | 'mann' }) {
  const f = useFarben();
  const { t, th } = useT();
  const s = NACH_SYM[r.sym];
  return (
    <Pressable onPress={() => spiele(r.sym, stimme)} accessibilityRole="button" accessibilityLabel={t('allg.anhoeren', { wort: s.wort })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <Text style={{ color: f.fehler, fontFamily: MONO, fontSize: 22, fontWeight: '800', width: 28 }}>{r.sym}</Text>
      <View style={{ flex: 1 }}>
        <T fett>{s.wort} <T leise groesse={13}>{lautschrift(s)}</T></T>
        <T leise groesse={13}>{r.hinweis ? th(r.hinweis) : t('allg.gehoertZitat', { text: r.gehoert })}</T>
      </View>
      <T farbe={f.info} groesse={20}>🔊</T>
    </Pressable>
  );
}

const stl = StyleSheet.create({
  instrumente: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14 },
  mitte: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 220 },
  zeichen: { fontFamily: MONO, fontSize: 150, lineHeight: 170, fontWeight: '800' },
  vorschau: { fontFamily: MONO, fontSize: 26, letterSpacing: 2, marginTop: 4 },
  gruppe: { fontFamily: MONO, fontSize: 40, fontWeight: '800', letterSpacing: 4, marginBottom: 4 },
  mic: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, minHeight: 56 },
  punkt: { width: 12, height: 12, borderRadius: 6 },
  band: { flexDirection: 'row', gap: 2, height: 8 },
  bandTeil: { flex: 1, borderRadius: 2 },
  eingabe: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 17, marginTop: 8 },
  zeit: { fontFamily: MONO, fontVariant: ['tabular-nums'], fontSize: 76, fontWeight: '800' },
});
