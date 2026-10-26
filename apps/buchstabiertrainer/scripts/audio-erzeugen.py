#!/usr/bin/env python3
"""Rendert die Hörbeispiele (ICAO-Codewörter) mit edge-tts nach assets/audio/<stimme>/<id>.mp3.

  pip install edge-tts   (ffmpeg muss installiert sein)
  python3 scripts/audio-erzeugen.py [--neu]

Die Sprechtexte sind teils lautmalerisch geschrieben (z. B. „Keh-beck“), damit die englische Stimme
die ICAO-Aussprache trifft. Danach `node scripts/audio-index.mjs` ausführen (erzeugt src/data/audio.ts).
"""
import argparse, asyncio, os, subprocess, sys

import edge_tts

STIMMEN = {'frau': 'en-GB-SoniaNeural', 'mann': 'en-GB-RyanNeural'}
TEXTE = {
    'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf',
    'H': 'Hotel', 'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Leema', 'M': 'Mike', 'N': 'November',
    'O': 'Oscar', 'P': 'Papa', 'Q': 'Keh-beck', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform',
    'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee', 'Z': 'Zulu',
    '0': 'Zero', '1': 'Wun', '2': 'Too', '3': 'Tree', '4': 'Fow-er', '5': 'Fife', '6': 'Six', '7': 'Seven',
    '8': 'Ait', '9': 'Niner', 'decimal': 'Day-see-mal', 'hundred': 'Hundred', 'thousand': 'Tousand',
}
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'audio')


async def render(stimme, voice, key, text, neu, sem):
    ziel = os.path.join(ROOT, stimme, f'{key.lower()}.mp3')
    if os.path.exists(ziel) and not neu:
        return
    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    async with sem:
        for versuch in range(5):
            try:
                roh = b''
                async for ch in edge_tts.Communicate(text, voice, rate='-8%').stream():
                    if ch['type'] == 'audio':
                        roh += ch['data']
                if roh:
                    break
            except Exception as e:  # Netz/Drosselung
                if versuch == 4:
                    raise RuntimeError(f'{voice} {text}: {e}')
            await asyncio.sleep(2 ** versuch)
    # Stille am Anfang/Ende entfernen, mono 24 kHz 48 kbps → kurze Latenz beim Abspielen
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'pipe:0', '-af',
                    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.08',
                    '-ac', '1', '-ar', '24000', '-b:a', '48k', ziel], input=roh, check=True)
    print('✔', stimme, key, text)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--neu', action='store_true', help='alle Dateien neu erzeugen')
    a = ap.parse_args()
    sem = asyncio.Semaphore(6)
    await asyncio.gather(*(render(s, v, k, t, a.neu, sem) for s, v in STIMMEN.items() for k, t in TEXTE.items()))


if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
