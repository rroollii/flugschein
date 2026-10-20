# Flugschein – Hörbuch-Audios (Branch `audio`)

Vorab gerenderte Sprachausgabe (Microsoft-Edge-Neural-Stimmen über `edge-tts`) für Hörbuch-Player und Funkübungen.
Erzeugt mit `internal/audio-quellen/neu-generieren.sh` (Projekt-Store) – inkrementell, Segmentierung direkt aus `src/tts.js`.

| Stimme | Deutsch | Englisch |
|---|---|---|
| `frau` | de-AT-IngridNeural | en-GB-SoniaNeural |
| `mann` | de-AT-JonasNeural | en-GB-RyanNeural |

Format: MP3, mono, 24 kHz, 32 kbps CBR. Abrufbar z. B. über `https://raw.githubusercontent.com/rroollii/flugschein/audio/<datei>`
(CORS `*`, Range-Requests) – `basisUrl` im Manifest.

## Dateien

```
manifest.json                                    Index (siehe unten)
audio/<stimme>/skript/<skriptId>/<kapitelId>.mp3 Hörbuch: ein Teil = ein Player-Teil (Kapitel)
audio/<stimme>/doc/<docId>/doc.mp3               Dokumente
audio/<stimme>/fragen/<fachId>/alle.mp3          Fragenkataloge (inkl. 1,8 s Denkpause vor der Lösung)
audio/<stimme>/glossar/alle/alle.mp3             Glossar
audio/<stimme>/dialog/<skriptId>/<kapitelId>-<n>.mp3   englische Funk-Dialoge aus Codeblöcken (<pre> Nr. n im Kapitel-HTML)
audio/<stimme>/funkuebung/<szenarioId>/<ii>-<rolle>.mp3 Funkübungen: ein Schritt = eine Datei
audio/index.json                                 nur für das Generator-Skript (Hashes)
```

Ordnernamen sind die IDs in Kleinbuchstaben, Zeichen außerhalb `[a-z0-9._-]` → `-`. Immer den Pfad aus `datei` verwenden, nicht selbst bauen.

## manifest.json

```jsonc
{
  "version": 1,
  "erzeugt": "2026-10-17T19:30:00+00:00",
  "basisUrl": "https://raw.githubusercontent.com/rroollii/flugschein/audio/",
  "format": { "codec": "mp3", "kbps": 32, "hz": 24000, "kanaele": 1 },
  "stimmen": { "frau": { "name": "Ingrid", "de": "de-AT-IngridNeural", "en": "en-GB-SoniaNeural" },
               "mann": { "name": "Jonas",  "de": "de-AT-JonasNeural",  "en": "en-GB-RyanNeural" } },

  // Hörbuch: Schlüssel = src.key aus tts.js getSource() ("skript:<id>", "doc:<id>", "fragen:<fachId>", "glossar:alle"),
  // darunter part.id. t[i] = Startzeit (ms) von Segment i aus segmentsOf(part) – gleiche Reihenfolge,
  // Pausen-Segmente (Denkpause) zählen mit. Segment i endet, wo i+1 beginnt (bzw. bei ms).
  "hoerbuch": {
    "skript:luftrecht": {
      "lernziele": {
        "n": 10, "hash": "7fec1713",
        "frau": { "datei": "audio/frau/skript/luftrecht/lernziele.mp3", "ms": 63935, "t": [0, 1385, 4145, …] },
        "mann": { "datei": "audio/mann/skript/luftrecht/lernziele.mp3", "ms": 64824, "t": [0, 1343, 4158, …] }
      }
    }
  },

  // Funk-Dialoge in Codeblöcken (werden vom Player bisher nicht gelesen). Pilot = gewählte Stimme, Gegenstelle = andere.
  "dialoge": {
    "skript:z-flugfunk-international": {
      "5-beispiel-dialoge": [ { "pre": 2, "rollen": ["P", "FIS", "P"], "frau": { "datei": "…", "ms": 21000, "t": [0, 4100, 15800] }, "mann": { … } } ]
    }
  },

  // Funkübungen (docs/funkuebungen/szenarien.json): Schlüssel = Szenario-id, darunter Schritt-Index (String, 0-basiert).
  // Fehlt ein Index, ist der Schritt eine reine Handlung „(Aktion: …)“ ohne Sprachausgabe. Klammertexte sind nicht gesprochen.
  // hash = FNV-1a des Original-"text" → bei Abweichung Gerätestimme verwenden.
  "funkuebungen": {
    "logf-abflug-platzrunde": {
      "0": { "rolle": "pilot", "sprache": "de", "hash": "…", "frau": { "datei": "audio/frau/funkuebung/logf-abflug-platzrunde/00-pilot.mp3", "ms": 7400 }, "mann": { … } },
      "1": { "rolle": "atc",   "sprache": "de", "hash": "…", "frau": { … }, "mann": { … } }
    }
  },

  // LPE-Übungen (docs/funkuebungen/lpe-uebungen.json): wie "funkuebungen", zusätzlich "sprecher" (atc | pruefer | ansage | pilot).
  // Schlüssel = Übungs-id, darunter Schritt-Index (String, 0-basiert); hash = FNV-1a des Original-"text".
  "lpe": {
    "lpe-intro": {
      "0": { "rolle": "atc", "sprecher": "pruefer", "sprache": "en", "hash": "…", "frau": { "datei": "audio/frau/lpe/lpe-intro/00-atc.mp3", "ms": 6100 }, "mann": { … } }
    }
  },

  "gesamt": { "dateien": 1636, "bytes": 0, "ms": 0 }
}
```

## Abgleich im Player (wichtig)

Audio nur verwenden, wenn `eintrag.n === segs.length` **und** `eintrag.hash === textHash(segs)`; sonst (Inhalt geändert,
Audio noch nicht neu gerendert) für diesen Teil auf die Gerätestimme zurückfallen.

```js
const fnv1a = (s) => { let h = 0x811c9dc5; for (const b of new TextEncoder().encode(s)) h = Math.imul(h ^ b, 0x01000193) >>> 0; return h.toString(16).padStart(8, '0'); };
const textHash = (segs) => fnv1a(segs.map((s) => (s.pause ? `#${s.pause}` : s.text)).join('\n'));
// Funkübungen und LPE: fnv1a(schritt.text)
```

Segment → Zeit: `audio.currentTime = t[i] / 1000`. Zeit → Segment (Hervorhebung): größtes `i` mit `t[i] <= currentTime*1000`;
`segs[i].b` ist die Absatz-ID wie bisher. Geschwindigkeit über `audio.playbackRate` (Pausen skalieren mit).

## Lizenz / Nutzung

`edge-tts` (LGPL-3.0) nutzt den kostenlosen Vorlese-Dienst von Microsoft Edge ohne Account. Microsoft gibt dafür keine
ausdrückliche Lizenz für generierte Audiodateien; für eine private, nicht-kommerzielle Lernplattform ist das üblich, rechtlich
aber eine Grauzone (keine Garantie, Dienst kann sich ändern). Für kommerzielle Nutzung: Azure Speech (gleiche Stimmen, kostenpflichtig)
oder Fallback Piper TTS (MIT, Stimmen z. B. `de_DE-thorsten-high`, `en_GB-alan-medium`; Stimmlizenzen je Modell prüfen) – dafür in
`audio.py` nur `Tts.pcm()` ersetzen.
