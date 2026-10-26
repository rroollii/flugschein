import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { AUDIO } from '../data/audio';

const DATEI: Record<string, string> = { '.': 'decimal', '00': 'hundred', '000': 'thousand' };
const player = new Map<string, AudioPlayer>();
let modusGesetzt = false;

function quelle(sym: string, stimme: string) {
  return AUDIO[stimme]?.[DATEI[sym] ?? sym.toLowerCase()];
}

export function hatAudio(sym: string) {
  return quelle(sym, 'frau') != null;
}

export async function spiele(sym: string, stimme: 'frau' | 'mann', tempo = 1): Promise<number> {
  const q = quelle(sym, stimme);
  if (q == null) return 0;
  if (!modusGesetzt) {
    modusGesetzt = true;
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {});
  }
  const key = `${stimme}:${sym}`;
  let p = player.get(key);
  if (!p) {
    p = createAudioPlayer(q);
    player.set(key, p);
  }
  player.forEach((x) => { if (x !== p && x.playing) x.pause(); });
  try { p.setPlaybackRate(tempo, 'high'); } catch {}
  await p.seekTo(0);
  p.play();
  return Math.max(500, (p.duration || 0.7) * 1000 / tempo);
}

/** Spielt mehrere Codewörter nacheinander (Hörmodus: Kennzeichen). */
export async function spieleFolge(syms: string[], stimme: 'frau' | 'mann', pauseMs = 250, abbruch?: { stop: boolean }) {
  for (const s of syms) {
    if (abbruch?.stop) return;
    const ms = await spiele(s, stimme);
    await new Promise((r) => setTimeout(r, ms + pauseMs));
  }
}
