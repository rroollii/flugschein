import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Seite, Panel, Etikett, T, Knopf, Auswahl, Zeile, Balken, Anzeige, Verlauf } from '../ui/komponenten';
import { useFarben } from '../lib/theme';
import { useStore, bestzeit, laufKlasse, heute, plusTage, serie, type Eingabe, type Zustand } from '../lib/store';
import { ALLE, BUCHSTABEN } from '../data/alphabet';
import { useT } from '../i18n';

const sek = (ms: number) => (ms / 1000).toFixed(2);

export default function Statistik() {
  const f = useFarben();
  const { t } = useT();
  const s = useStore((x) => x) as Zustand;
  const [n, setN] = useState<10 | 25 | 50>(50);
  const [eingabe, setEingabe] = useState<Eingabe>('sprache');
  const klasse = laufKlasse({ modus: 'sprint', n, ziffern: false, eingabe });
  const laeufe = s.laeufe.filter((l) => laufKlasse(l) === klasse);
  const best = bestzeit(s.laeufe, klasse);
  const syms = (s.einstellungen.ziffern ? ALLE : BUCHSTABEN).map((x) => x.sym);
  const zeiten = syms.map((sym) => s.stats[sym]).filter((x) => x?.msN).map((x) => x!.msSumme / x!.msN);
  const maxZeit = Math.max(1000, ...zeiten);
  const zeilen = syms
    .map((sym) => {
      const st = s.stats[sym];
      const quote = st?.n ? st.falsch / st.n : 0;
      const ms = st?.msN ? st.msSumme / st.msN : 0;
      return { sym, n: st?.n ?? 0, quote, ms, score: quote * 3 + ms / maxZeit };
    })
    .sort((a, b) => b.score - a.score);
  const schwach = zeilen.filter((z) => z.n > 0).slice(0, 6).map((z) => z.sym);
  const tage = Array.from({ length: 14 }, (_, i) => plusTage(heute(), i - 13));
  const maxTag = Math.max(s.einstellungen.tagesziel, ...tage.map((x) => s.tage[x] || 0));
  const gesamt = Object.values(s.tage).reduce((a, b) => a + b, 0);

  return (
    <Seite titel={t('statistik.titel')}>
      <Panel>
        <Zeile abstand={16}>
          <Anzeige label={t('statistik.laeufe')} wert={String(s.laeufe.length)} groesse={26} />
          <Anzeige label={t('statistik.gesamt')} wert={String(gesamt)} groesse={26} />
          <Anzeige label={t('statistik.serie')} wert={String(serie(s))} einheit={t(serie(s) === 1 ? 'allg.tag' : 'allg.tage')} groesse={26} />
        </Zeile>
      </Panel>

      <Panel titel={t('statistik.verlauf')}>
        <Zeile>
          <Auswahl label={t('sprint.laengeLabel')} werte={[10, 25, 50].map((x) => ({ wert: x, text: String(x) }))} wert={n} onWahl={(v) => setN(v as 10 | 25 | 50)} />
          <Auswahl label={t('sprint.eingabe')} werte={[{ wert: 'sprache', text: t('ergebnis.eingabe.sprache') }, { wert: 'tippen', text: t('ergebnis.eingabe.tippen') }, { wert: 'selbst', text: t('statistik.selbst') }]} wert={eingabe} onWahl={(v) => setEingabe(v as Eingabe)} />
        </Zeile>
        <T leise groesse={13} style={{ marginVertical: 8 }}>
          {t('statistik.bestzeit', { best: best ? `${sek(best.ms)} s` : '–', n: laeufe.length })}
        </T>
        <Verlauf werte={laeufe.slice(-30).map((l) => ({ s: l.ms / 1000, ok: l.fehler === 0 }))} ziel={n * 0.6} />
      </Panel>

      <Panel titel={t('statistik.tage14')}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 90 }}>
          {tage.map((tag) => {
            const v = s.tage[tag] || 0;
            return (
              <View key={tag} style={{ flex: 1, alignItems: 'center', gap: 4 }} accessibilityLabel={t('statistik.tagWert', { tag, n: v })}>
                <View style={{ width: '100%', height: Math.max(2, (v / maxTag) * 70), backgroundColor: v >= s.einstellungen.tagesziel ? f.ok : v ? f.akzent : f.panel2, borderRadius: 3 }} />
                <T leise groesse={9}>{tag.slice(8)}</T>
              </View>
            );
          })}
        </View>
      </Panel>

      <Panel titel={t('statistik.jeZeichen')}>
        {schwach.length > 0 && (
          <Knopf titel={t('statistik.nachtrainieren', { liste: schwach.join(' ') })} symbol="🎯" style={{ marginBottom: 12 }}
            onPress={() => router.push({ pathname: '/sprint', params: { modus: 'nachtraining', schwach: schwach.join(',') } })} />
        )}
        <Zeile style={{ marginBottom: 4 }}>
          <Etikett style={{ width: 28 }}>{t('statistik.zei')}</Etikett>
          <Etikett style={{ flex: 1 }}>{t('statistik.quote')}</Etikett>
          <Etikett style={{ flex: 1 }}>{t('statistik.zeit')}</Etikett>
        </Zeile>
        {zeilen.map((z) => (
          <View key={z.sym} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 3 }}>
            <T mono fett style={{ width: 28 }} farbe={f.akzent}>{z.sym}</T>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Balken wert={z.quote} farbe={f.fehler} />
              <T mono groesse={12} leise style={{ width: 40 }}>{z.n ? `${Math.round(z.quote * 100)} %` : '–'}</T>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Balken wert={z.ms / maxZeit} farbe={f.info} />
              <T mono groesse={12} leise style={{ width: 44 }}>{z.ms ? `${(z.ms / 1000).toFixed(2)}` : '–'}</T>
            </View>
          </View>
        ))}
      </Panel>
    </Seite>
  );
}
