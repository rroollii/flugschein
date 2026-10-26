import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Seite, Panel, T, Knopf, Auswahl, Zeile, Anzeige } from '../ui/komponenten';
import { MONO, useFarben } from '../lib/theme';
import { useStore, zaehle } from '../lib/store';
import { BUCHST, ZIFF, folge, kennzeichen } from '../lib/generator';
import { NACH_SYM } from '../data/alphabet';
import { spiele, spieleFolge } from '../lib/audio';

type Art = 'zeichen' | 'kennzeichen';
const RUNDEN = { zeichen: 20, kennzeichen: 6 };

export default function Hoeren() {
  const f = useFarben();
  const e = useStore((s) => s.einstellungen);
  const [art, setArt] = useState<Art>('zeichen');
  const [aufgaben, setAufgaben] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [antworten, setAntworten] = useState<{ soll: string; ist: string; ms: number }[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [text, setText] = useState('');
  const t0 = useRef(0);
  const abbruch = useRef({ stop: false });
  const syms = e.ziffern ? [...BUCHST, ...ZIFF] : BUCHST;
  const aufgabe = aufgaben?.[i];

  const abspielen = async () => {
    if (!aufgabe) return;
    abbruch.current.stop = true;
    abbruch.current = { stop: false };
    if (art === 'zeichen') await spiele(aufgabe, e.stimme);
    else await spieleFolge(aufgabe.replace(/-/g, '').split(''), e.stimme, 180, abbruch.current);
    t0.current = Date.now();
  };

  useEffect(() => {
    if (!aufgabe) return;
    const id = setTimeout(abspielen, 350);
    return () => { clearTimeout(id); abbruch.current.stop = true; };
  }, [aufgabe, i]);

  const starte = () => {
    setAufgaben(art === 'zeichen' ? folge(RUNDEN.zeichen, syms) : kennzeichen(RUNDEN.kennzeichen, e.ziffern));
    setI(0); setAntworten([]); setFeedback(null); setText('');
  };

  const antworte = (ist: string) => {
    if (!aufgabe || feedback) return;
    const soll = aufgabe.replace(/-/g, '').toUpperCase();
    const norm = ist.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const ok = norm === soll;
    const ms = t0.current ? Date.now() - t0.current : 0;
    setAntworten((a) => [...a, { soll: aufgabe, ist: norm, ms }]);
    if (art === 'zeichen') zaehle([{ sym: aufgabe, ok }]);
    else zaehle(soll.split('').map((c, k) => ({ sym: c, ok: norm[k] === c })));
    setFeedback({ ok, text: ok ? `✓ ${art === 'zeichen' ? NACH_SYM[aufgabe].wort : aufgabe}` : `✗ Richtig: ${art === 'zeichen' ? `${aufgabe} – ${NACH_SYM[aufgabe].wort}` : aufgabe}` });
    setTimeout(() => { setFeedback(null); setText(''); setI((x) => x + 1); }, ok ? 550 : 1600);
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || art !== 'zeichen' || !aufgabe) return;
    const h = (ev: KeyboardEvent) => {
      const k = ev.key.toUpperCase();
      if (syms.includes(k)) antworte(k);
      if (ev.key === ' ') { ev.preventDefault(); abspielen(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  if (!aufgaben || i >= aufgaben.length) {
    const richtig = antworten.filter((a) => a.ist === a.soll.replace(/-/g, '')).length;
    const zeit = antworten.length ? antworten.reduce((s, a) => s + a.ms, 0) / antworten.length / 1000 : 0;
    return (
      <Seite titel="Hören">
        {aufgaben && (
          <Panel style={{ borderColor: f.ok }}>
            <Zeile abstand={16}>
              <Anzeige label="Richtig" wert={`${richtig}/${antworten.length}`} groesse={28} farbe={richtig === antworten.length ? f.ok : f.text} />
              <Anzeige label="Ø Reaktion" wert={zeit.toFixed(2)} einheit="s" groesse={28} />
            </Zeile>
            {antworten.filter((a) => a.ist !== a.soll.replace(/-/g, '')).map((a, k) => (
              <T key={k} groesse={14} farbe={f.fehler}>✗ {a.soll} – du: {a.ist || '–'}</T>
            ))}
          </Panel>
        )}
        <Panel titel="Übung">
          <Auswahl label="Übung" werte={[{ wert: 'zeichen', text: 'Einzelne Codewörter' }, { wert: 'kennzeichen', text: 'Kennzeichen (wie im Funk)' }]} wert={art} onWahl={setArt} />
          <T leise groesse={13} style={{ marginTop: 8 }}>
            {art === 'zeichen' ? `${RUNDEN.zeichen} Codewörter mit natürlicher Stimme – tippe den passenden Buchstaben. Leertaste = nochmal hören.`
              : `${RUNDEN.kennzeichen} Kennzeichen werden buchstabiert – schreib mit wie bei einer Funkfreigabe.`}
          </T>
        </Panel>
        <Knopf titel="Start" symbol="🎧" onPress={starte} />
      </Seite>
    );
  }

  return (
    <Seite titel={`Hören ${i + 1} / ${aufgaben.length}`}>
      <Panel style={{ alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
        {feedback ? (
          <T groesse={26} fett farbe={feedback.ok ? f.ok : f.fehler} style={{ textAlign: 'center' }}>{feedback.text}</T>
        ) : (
          <Knopf titel="Nochmal hören" symbol="🔊" art="sekundaer" onPress={abspielen} />
        )}
      </Panel>
      {art === 'zeichen' ? (
        <View style={stl.tasten}>
          {syms.map((k) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={k} onPress={() => antworte(k)}
              style={({ pressed }) => [stl.taste, { backgroundColor: pressed ? f.akzent : f.panel, borderColor: f.rand }]}>
              <Text style={{ color: f.text, fontFamily: MONO, fontSize: 24, fontWeight: '800' }}>{k}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <TextInput value={text} onChangeText={(t) => setText(t.toUpperCase())} onSubmitEditing={() => antworte(text)} autoFocus autoCapitalize="characters" autoCorrect={false}
            placeholder="z. B. OEKRF" placeholderTextColor={f.leise} accessibilityLabel="Kennzeichen eingeben"
            style={{ borderWidth: 1, borderRadius: 12, borderColor: f.akzent, color: f.text, backgroundColor: f.panel, fontFamily: MONO, fontSize: 30, padding: 14, letterSpacing: 4, textAlign: 'center' }} />
          <Knopf titel="Prüfen" onPress={() => antworte(text)} />
        </View>
      )}
    </Seite>
  );
}

const stl = StyleSheet.create({
  tasten: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  taste: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
