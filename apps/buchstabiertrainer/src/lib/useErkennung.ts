import { useCallback, useEffect, useRef, useState } from 'react';
import { berechtigung, erstelleErkenner, verfuegbar } from './speech';
import type { Erkenner } from './speech-typen';
import { hole } from './store';
import { NACH_SYM } from '../data/alphabet';
import { t, type Schluessel } from '../i18n';

const FEHLER: Record<string, Schluessel> = {
  'not-allowed': 'erk.notAllowed',
  'service-not-allowed': 'erk.serviceNotAllowed',
  'language-not-supported': 'erk.sprache',
  network: 'erk.netz',
  'audio-capture': 'erk.mikrofon',
};

/**
 * Hält die Spracherkennung aktiv, solange `aktiv` gesetzt ist (Erkenner beenden sich nach Pausen von selbst
 * und werden dann neu gestartet). `onSegment` erhält Zwischen- und Endergebnisse.
 */
export function useErkennung(opts: {
  syms: string[];
  einzelwort?: boolean;
  onSegment: (text: string, final: boolean, alternativen: string[]) => void;
}) {
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const soll = useRef(false);
  const rec = useRef<Erkenner | null>(null);
  const cb = useRef(opts.onSegment);
  cb.current = opts.onSegment;
  const neustarts = useRef(0);

  const optionen = () => {
    const e = hole().einstellungen;
    return {
      lang: e.sprache,
      onDevice: e.onDevice,
      phrasen: opts.syms.map((s) => NACH_SYM[s]?.wort).filter(Boolean) as string[],
      einzelwort: !!opts.einzelwort,
    };
  };

  const starte = useCallback(async () => {
    const v = verfuegbar();
    if (!v.ok) { setFehler(v.grund ?? t('erk.nichtVerfuegbar')); return false; }
    if (!(await berechtigung())) { setFehler(t(FEHLER['not-allowed'])); return false; }
    setFehler(null);
    soll.current = true;
    neustarts.current = 0;
    if (!rec.current) {
      rec.current = erstelleErkenner({
        segment: (t, f, a) => cb.current(t, f, a),
        zustand: (an) => {
          setLaeuft(an);
          if (!an && soll.current && !opts.einzelwort && neustarts.current < 30) {
            neustarts.current++;
            setTimeout(() => { if (soll.current) rec.current?.start(optionen()); }, 60);
          } else if (!an) soll.current = false;
        },
        fehler: (code, msg) => {
          if (code === 'no-speech' || code === 'aborted' || code === 'speech-timeout') return;
          if (code === 'not-allowed' || code === 'audio-capture' || code === 'service-not-allowed' || code === 'language-not-supported') soll.current = false;
          setFehler(FEHLER[code] ? t(FEHLER[code]) : t('erk.sonst', { meldung: msg || code }));
        },
      });
    }
    await rec.current.start(optionen());
    return true;
  }, [opts.einzelwort, opts.syms.join('')]);

  const stoppe = useCallback((sofort = false) => {
    soll.current = false;
    if (sofort) rec.current?.abort(); else rec.current?.stop();
  }, []);

  useEffect(() => () => { soll.current = false; rec.current?.abort(); }, []);

  return { laeuft, fehler, starte, stoppe, setFehler };
}
