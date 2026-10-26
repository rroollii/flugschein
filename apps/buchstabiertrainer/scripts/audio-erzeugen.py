#!/usr/bin/env python3
"""Rendert die Hörbeispiele (ICAO-Codewörter) mit Piper TTS nach assets/audio/<stimme>/<id>.mp3.

  pip install piper-tts onnx      (ffmpeg muss installiert sein)
  python3 scripts/audio-erzeugen.py [--neu] [--pruefen 6]

Stimmen mit klarer Lizenz (Datensatz gemeinfrei, Modell MIT, siehe assets/audio/LIZENZ.md):
  frau = en_GB-cori-high (LibriVox-Aufnahmen, public domain)
  mann = en_US-bryce-medium (eigene Aufnahmen des Autors, public domain)

Einzelwörter sprechen VITS-Stimmen oft unsauber (Nachplappern am Wortende). Deshalb wird jedes Wort
im Trägersatz „The word is, …“ synthetisiert und anhand der Phonem-Zeitmarken herausgeschnitten.
Die Sprechtexte sind teils lautmalerisch geschrieben (z. B. „Keh-beck“), damit die Stimme die ICAO-Aussprache trifft.
Danach `node scripts/audio-index.mjs` ausführen (erzeugt src/data/audio.ts).
"""
import argparse, difflib, os, re, subprocess, sys, urllib.request

import numpy as np

from piper import PiperVoice, SynthesisConfig

HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/'
STIMMEN = {
    'frau': ('en/en_GB/cori/high/', 'en_GB-cori-high', 1.0),
    'mann': ('en/en_US/bryce/medium/', 'en_US-bryce-medium', 1.05),
}
TEXTE = {
    'A': 'Alfa.', 'B': 'Bravo.', 'C': 'Charlie.', 'D': 'Delta.', 'E': 'Echo.', 'F': 'Foxtrot.', 'G': 'Golf.',
    'H': 'Hotel.', 'I': 'India.', 'J': 'Juliett.', 'K': 'Kilo.', 'L': 'Leema.', 'M': 'Mike.', 'N': 'November.',
    'O': 'Oscar.', 'P': 'Papa.', 'Q': 'Keh-beck.', 'R': 'Romeo.', 'S': 'Sierra.', 'T': 'Tango.', 'U': 'Uniform.',
    'V': 'Victor.', 'W': 'Whiskey.', 'X': 'X-ray.', 'Y': 'Yankee.', 'Z': 'Zulu.',
    '0': 'Zero.', '1': 'Wun.', '2': 'Too.', '3': 'Tree.', '4': 'Fow-er.', '5': 'Fife.', '6': 'Six.', '7': 'Seven.',
    '8': 'Ait.', '9': 'Niner.', 'decimal': 'Day-see-mal.', 'hundred': 'Hundred.', 'thousand': 'Tousand.',
}
# Was Whisper bei guter Aussprache hören soll (für --pruefen)
ERWARTET = {
    'A': ['alfa', 'alpha'], 'J': ['juliet', 'juliett'], 'L': ['lima', 'leema'], 'Q': ['kebeck', 'kbec', 'quebec'], 'X': ['xray'],
    '0': ['zero', '0'], '1': ['one', 'won', '1'], '2': ['two', 'too', '2'], '3': ['tree', 'three', '3'],
    '4': ['fower', 'four', 'tower', '4'], '5': ['fife', 'five', '5'], '6': ['six', '6'], '7': ['seven', '7'],
    '8': ['ait', 'eight', '8'], '9': ['niner', '9'], 'decimal': ['decimal', 'daysemal', 'deseemal'],
    'hundred': ['hundred', '100'], 'thousand': ['tousand', 'thousand', '1000'],
}
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'audio')
CACHE = os.path.expanduser('~/.cache/piper-voices')
TRAEGER = 'The word is,'


def modell(pfad, name):
    os.makedirs(CACHE, exist_ok=True)
    for endung in ('.onnx', '.onnx.json'):
        ziel = os.path.join(CACHE, name + endung)
        if not os.path.exists(ziel):
            print('↓', name + endung)
            urllib.request.urlretrieve(HF + pfad + name + endung, ziel)
    return PiperVoice.load(os.path.join(CACHE, name + '.onnx'), include_alignments=True)


def wort_aus_satz(voice, text, cfg):
    chunk = next(iter(voice.synthesize(f'{TRAEGER} {text}', syn_config=cfg, include_alignments=True)))
    if not chunk.phoneme_alignments:
        raise SystemExit('Stimme liefert keine Phonem-Zeitmarken (pip install onnx)')
    pos = start = 0
    # Schnitt in der Mitte der letzten Wortgrenze vor dem Codewort (Bindestriche bleiben im Wort)
    for a in chunk.phoneme_alignments:
        if a.phoneme in (' ', ','):
            start = pos + a.num_samples // 2
        pos += a.num_samples
    return chunk.sample_rate, chunk.audio_int16_array[start:].tobytes()


def norm(t):
    return re.sub(r'[^a-z0-9]', '', t.lower())


def bester_take(voice, key, text, cfg, whisper, versuche):
    """Piper ist zufallsbasiert: mehrere Takes erzeugen, den am besten verständlichen behalten."""
    ziele = ERWARTET.get(key, [norm(text)])
    best = (-1.0, None, '')
    for _ in range(versuche):
        sr, pcm = wort_aus_satz(voice, text, cfg)
        a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
        a16 = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype(np.float32)
        segs, _ = whisper.transcribe(a16, beam_size=5, language='en')
        gehoert = norm(' '.join(s.text for s in segs))
        score = max(difflib.SequenceMatcher(None, gehoert, z).ratio() for z in ziele)
        if score > best[0]:
            best = (score, (sr, pcm), gehoert)
        if score >= 0.99:
            break
    print(f'   {key}: „{best[2]}“ ({best[0]:.2f})')
    return best[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--neu', action='store_true', help='alle Dateien neu erzeugen')
    ap.add_argument('--pruefen', type=int, default=0, metavar='N',
                    help='bis zu N Takes je Wort, Auswahl per Whisper (pip install faster-whisper)')
    a = ap.parse_args()
    whisper = None
    if a.pruefen:
        from faster_whisper import WhisperModel
        whisper = WhisperModel('small.en', device='cpu', compute_type='int8')
    for stimme, (pfad, name, laenge) in STIMMEN.items():
        voice = modell(pfad, name)
        cfg = SynthesisConfig(length_scale=laenge, noise_scale=0.4, noise_w_scale=0.5)
        for key, text in TEXTE.items():
            ziel = os.path.join(ROOT, stimme, f'{key.lower()}.mp3')
            if os.path.exists(ziel) and not a.neu:
                continue
            os.makedirs(os.path.dirname(ziel), exist_ok=True)
            sr, pcm = bester_take(voice, key, text, cfg, whisper, a.pruefen) if whisper else wort_aus_satz(voice, text, cfg)
            # Stille am Anfang/Ende entfernen, Lautheit angleichen, mono 24 kHz 48 kbps
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(sr), '-ac', '1', '-i', 'pipe:0', '-af',
                            'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                            'loudnorm=I=-16:TP=-1.5:LRA=11,apad=pad_dur=0.08',
                            '-ac', '1', '-ar', '24000', '-b:a', '48k', ziel], input=pcm, check=True)
            print('✔', stimme, key, text)


if __name__ == '__main__':
    sys.exit(main())
