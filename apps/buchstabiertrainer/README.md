# Buchstabiertrainer – ICAO-/NATO-Alphabet

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

## Technik

- `src/lib/speech.ts` – iOS/Android über `expo-speech-recognition` (SFSpeechRecognizer / Android SpeechRecognizer),
  `requiresOnDeviceRecognition`, wenn das Gerät es kann, `contextualStrings` mit den Codewörtern.
- `src/lib/speech.web.ts` – Web Speech API; Chrome ≥ 139 erkennt mit `processLocally` auf dem Gerät (Sprachpaket in den Einstellungen laden).
- `src/lib/matcher.ts` – toleranter Abgleich: Varianten/Fehlhörungen je Codewort, Lautangleichung + Levenshtein (erwartetes Wort
  bevorzugt), Hinweise bei Nicht-ICAO-Aussprache (THREE → TREE, FIVE → FIFE, NINE → NINER …) und bei deutschen Buchstabiertafeln.
- `src/lib/folge.ts` – wertet laufend überarbeitete Zwischenergebnisse aus, ohne doppelt zu zählen (Tests: `npm test`).
- `src/lib/sim.ts` – simulierte Erkennung für Browser-Tests: `…/buchstabiertrainer/?sim=1`, dann `window.__sprich('alfa bravo')`
  oder das Simulationsfeld im Sprint.
- Hörbeispiele: `assets/audio/<frau|mann>/*.mp3` (edge-tts, en-GB Sonia/Ryan), neu erzeugen mit `npm run audio`.
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

App-Store-Plan, Texte und Datenschutzerklärung: Projekt-Store `docs/buchstabiertrainer/app-store-plan.md`.
