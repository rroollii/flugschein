# PilotABC – ICAO-/NATO-Alphabet (Buchstabiertrainer)

Ziel: **50 Buchstaben in unter 30 Sekunden** korrekt buchstabieren. Eine Codebasis (Expo SDK 58, React Native, Expo Router)
für iPhone, Android und Web. Web-Version: https://rroollii.github.io/flugschein/buchstabiertrainer/

## Funktionen

| Modus | Inhalt |
|---|---|
| Sprint | 10 / 25 / 50 zufällige Zeichen (optional Ziffern), Uhr startet beim ersten Wort, Live-Erkennung, sofort richtig/falsch, Soll-Ist-Abstand zum Ziel (0,6 s je Zeichen), Ergebnis mit Zeit, Fehlern, Wörtern/Minute, Bestzeit, Verlauf |
| Gezieltes Nachtraining | Sprint, in dem schwache/langsame Zeichen gehäuft vorkommen (aus Ergebnis oder Statistik) |
| Kennzeichen | OE-KRF, D-EABC, HA-…, HB-…, OK-…, S5-…, 9A-…, I-…, G-…, N… |
| Wörter & Orte | ICAO-Codes (LOGF, LOWG …), Orte, Funk-/Wetterbegriffe, Namen, eigene Wörter |
| Lernen | Karteikasten (Leitner, 5 Fächer), Buchstabe → Codewort oder Codewort → Buchstabe, Aufdecken oder Sprechen |
| Hören | Codewort hören → Buchstabe tippen; Kennzeichen hören → mitschreiben |
| Aussprache | Lautschrift-Karte (betonte Silbe markiert), Hörbeispiele Frau/Mann/langsam, Nachsprechen mit Rückmeldung |
| Statistik | Verlauf je Länge/Eingabe, 14-Tage-Aktivität, Fehlerquote und Ø-Zeit je Zeichen |

Eingabe: Sprache, Tippen (ohne Mikrofon) oder Selbstbewertung. Tagesziel (Zeichen/Tag) und Serie.

## Sprachen

Oberfläche, Hinweise, Fehlermeldungen und Datenschutz auf **Deutsch, Englisch, Französisch, Italienisch, Spanisch**.
Die Sprache folgt automatisch dem Gerät (`expo-localization`, Fallback Englisch) und lässt sich in den Einstellungen
umstellen; im Web zusätzlich per `?lang=de|en|fr|it|es` (z. B. für die Datenschutz-URL je Store-Sprache).
Die Codewörter bleiben ICAO-Englisch, die Spracherkennung läuft immer mit `en-US`/`en-GB`.

Nationale Buchstabiertafeln werden unabhängig von der UI-Sprache erkannt und als **Nicht-ICAO** gewertet (Fehler mit Hinweis):
ÖNORM, DIN 5009 (alt/neu), Französisch (Anatole …), Italienisch (Ancona …), Spanisch (Antonio …), altes Englisch (Able, Baker …).
Wörter, die zugleich ICAO-Formen sind (Oscar, Victor, Hotel, Kilo, Charlie …), sind ausgenommen.

Neue Sprache hinzufügen:

1. `src/i18n/de.ts` nach `src/i18n/<code>.ts` kopieren und übersetzen (Typ `Woerterbuch` meldet fehlende Schlüssel, `npm test` prüft Platzhalter).
2. In `src/i18n/index.ts` unter `SPRACHEN` eintragen.
3. `locales/<code>.json` (App-Name, iOS-Berechtigungstexte) anlegen und in `app.json` unter `locales` und `expo-localization` → `supportedLocales` ergänzen.
4. Optional: Name der eigenen Buchstabiertafel als `tafel.<id>` und Tafel in `src/data/alphabet.ts` registrieren.

## Technik

- `src/lib/speech.ts` – iOS/Android über `expo-speech-recognition` (SFSpeechRecognizer / Android SpeechRecognizer),
  `requiresOnDeviceRecognition`, wenn das Gerät es kann, `contextualStrings` mit den Codewörtern.
- `src/lib/speech.web.ts` – Web Speech API; Chrome ≥ 139 erkennt mit `processLocally` auf dem Gerät (Sprachpaket in den Einstellungen laden).
- `src/lib/matcher.ts` – toleranter Abgleich: Varianten/Fehlhörungen je Codewort, Lautangleichung + Levenshtein (erwartetes Wort
  bevorzugt), Hinweise bei Nicht-ICAO-Aussprache (THREE → TREE, FIVE → FIFE, NINE → NINER …) und bei nationalen Buchstabiertafeln.
  Hinweise sind strukturiert (`{ k, p }`) und werden erst beim Anzeigen übersetzt.
- `src/lib/folge.ts` – wertet laufend überarbeitete Zwischenergebnisse aus, ohne doppelt zu zählen (Tests: `npm test`).
- `src/lib/sim.ts` – simulierte Erkennung für Browser-Tests: `…/buchstabiertrainer/?sim=1`, dann `window.__sprich('alfa bravo')`
  oder das Simulationsfeld im Sprint.
- Hörbeispiele: `assets/audio/<frau|mann>/*.mp3`, lokal erzeugt mit Piper TTS (Cori en-GB / Bryce en-US, Trainingsdaten Public Domain,
  Modelle MIT – siehe `assets/audio/LIZENZ.md`). Neu erzeugen: `pip install piper-tts onnx faster-whisper`, dann
  `python3 scripts/audio-erzeugen.py --neu --pruefen 6 && node scripts/audio-index.mjs` (wählt per Whisper den verständlichsten Take).
- Fortschritt lokal (`AsyncStorage` bzw. `localStorage`), keine Server, kein Konto.

## Entwickeln und bauen

```bash
npm ci
npm test              # Abgleich/Auswertung
npm run typecheck
npm run web           # Entwicklungsserver (Web)
npm run build:web     # statischer Export nach dist/ (+ Manifest, Service Worker)
```

Spracherkennung braucht nativen Code → **kein Expo Go**. Für iPhone/Android: Development Build oder EAS Build:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform ios     # Testgerät (Dev-Client)
npx eas-cli@latest build --profile production --platform ios      # App Store / TestFlight
npx eas-cli@latest submit --platform ios --latest                 # Upload zu App Store Connect → TestFlight
```

App-Store-Plan, Store-Texte (5 Sprachen) und Veröffentlichungs-Anleitung: Projekt-Store `docs/buchstabiertrainer/`.
