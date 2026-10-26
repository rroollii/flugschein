// Web: Web Speech API. Chrome ab Version 139 kann mit `processLocally` auf dem Gerät erkennen
// (Sprachpaket wird einmalig installiert); sonst verarbeitet der Browser die Sprache auf seinen Servern.
import type { Erkenner, ErkennerHandler, OnDeviceStatus, Verfuegbarkeit } from './speech-typen';
import { simAktiv, simErkenner } from './sim';

const Klasse = (): any =>
  typeof window === 'undefined' ? null : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

export function verfuegbar(): Verfuegbarkeit {
  if (simAktiv()) return { ok: true };
  if (!Klasse()) return { ok: false, grund: 'Dieser Browser unterstützt keine Spracherkennung (z. B. Firefox). Bitte Chrome, Edge oder Safari verwenden – oder Tippen bzw. Selbstbewertung wählen.' };
  return { ok: true };
}

export async function onDeviceStatus(lang: string): Promise<OnDeviceStatus> {
  const K = Klasse();
  if (!K?.available) return 'nein';
  try {
    const r = await K.available({ langs: [lang], processLocally: true });
    return r === 'available' ? 'ja' : r === 'downloadable' || r === 'downloading' ? 'laden' : 'nein';
  } catch {
    return 'unbekannt';
  }
}

export async function onDeviceLaden(lang: string) {
  const K = Klasse();
  if (!K?.install) return false;
  try {
    return Boolean(await K.install({ langs: [lang], processLocally: true }));
  } catch {
    return false;
  }
}

export async function berechtigung(): Promise<boolean> {
  if (simAktiv()) return true;
  try {
    const s = await navigator.mediaDevices?.getUserMedia({ audio: true });
    s?.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export function erstelleErkenner(h: ErkennerHandler): Erkenner {
  if (simAktiv()) return simErkenner(h);
  let rec: any = null;
  return {
    async start(o) {
      const K = Klasse();
      if (!K) { h.fehler('not-supported', 'Keine Spracherkennung'); return; }
      rec?.abort?.();
      const r = new K();
      rec = r;
      r.lang = o.lang;
      r.continuous = !o.einzelwort;
      r.interimResults = true;
      r.maxAlternatives = o.einzelwort ? 5 : 1;
      if (o.onDevice && 'processLocally' in r && (await onDeviceStatus(o.lang)) === 'ja') {
        r.processLocally = true;
        const Phrase = (window as any).SpeechRecognitionPhrase;
        if (Phrase) { try { r.phrases = o.phrasen.map((p) => new Phrase(p, 4.0)); } catch {} }
      }
      r.onstart = () => h.zustand(true);
      r.onend = () => { if (rec === r) rec = null; h.zustand(false); };
      r.onerror = (e: any) => h.fehler(e.error, e.message || '');
      r.onresult = (e: any) => {
        let zwischen = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            const alt = Array.from({ length: res.length }, (_, j) => res[j].transcript as string);
            h.segment(alt[0] ?? '', true, alt);
          } else zwischen += res[0].transcript;
        }
        if (zwischen) h.segment(zwischen, false, [zwischen]);
      };
      r.start();
    },
    stop() { rec?.stop(); },
    abort() { rec?.abort(); },
  };
}
