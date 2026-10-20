# Flugschein – PPL(A)-Lernplattform (Quellcode)

Statische Lern- und Ausbildungsplattform (Vite + React) für die PPL(A)-Ausbildung an der Flugschule Fürstenfeld.
Alle Inhalte werden **beim Build** aus den Projektdateien gelesen – nach Inhaltsänderungen einfach neu bauen.
Fortschritt liegt nur im Browser (`localStorage`), es gibt keinen Server.

## Neu bauen

```bash
cd internal/plattform-quellen
bash build.sh
```

Voraussetzung: Node.js ≥ 18 und Internet für den ersten `npm ci`. Ergebnis in `docs/plattform/`:

| Datei | Zweck |
|---|---|
| `index.html` | komplette App in **einer** Datei (JS, CSS, Inhalte eingebettet) – läuft per Doppelklick und auf jedem Webserver |
| `flugschein-plattform.html` | identische Kopie zum Weitergeben als Einzeldatei |
| `manifest.webmanifest`, `sw.js`, `icon*.{svg,png}` | PWA: installierbar, offline nutzbar (nur über http/https) |
| `404.html`, `.nojekyll` | GitHub-Pages-Hilfsdateien |

`build.sh` (Aufruf mit `bash`, da der Store keine Ausführungsrechte speichert) arbeitet in einem temporären Ordner (`$TMPDIR/flugschein-build`), weil der Projekt-Store keine Symlinks (`node_modules/.bin`) erlaubt.
In einem normalen Checkout geht auch: `npm ci && CONTENT_DIR=… OUT_DIR=… npm run build`.

## Inhaltsquellen (`CONTENT_DIR`, Standard `../../docs`)

| Quelle | wird zu |
|---|---|
| `fragen/fragenbank.json` | Fächer (Name, Kürzel, Prüfungsumfang) und Übungsfragen |
| `skripte/*.md` (+ `index.md`) | Skripte; jedes `##` = Kapitel, `###` = Abschnitt; Fachzuordnung über Dateiname/Titel; Lernreihenfolge aus `index.md` |
| `ausbildungsplan.md` | Phasen (`## Phase N – …`), Checkboxen `- [ ]`, `**Ziel:**`, `**Meilenstein …:**`, Flugzeit aus Tabelle „auf einen Blick“, Fristen aus Tabelle „Fristen“, Mindestwerte aus der Zeile `**Mindestwerte …**` |
| `lernplan.md` | Wochen (`**Woche N – Titel**` + Checkboxen), Blöcke (`###`), weitere Checklisten, Ziel (`> Ziel: …`) |
| alle `*.md` der obersten Ebene, `fragen/README.md`, `skripte/index.md`, `zusatzausbildungen/index.md` | Dokumente (auch unter „Lernunterlagen“) |
| `glossar.md` (optional) | ergänzt/überschreibt `content/glossar.json` (Tabelle `| Begriff | Erklärung |` oder `**Begriff**: Erklärung`) |
| `zusatzausbildungen/` (optional) | Bereich „Zusatzausbildungen“: `index.md` (Einleitung, Reihenfolge der Links), weitere `*.md` als Module, `fragen-zusatz.json` (Schema wie `fragenbank.json`). Module sind Objekte in `content.zusatz.module` (`id, titel, fachId, kapitel, fragen, checklisten`); Checkboxen der Module werden abhakbar |

Kapitel-Ebene: `##`; hat ein Dokument höchstens 4 `##`-Teile mit vielen `###`, wird auf `###` geteilt (Teil-Überschrift erscheint im Inhaltsverzeichnis).
Fragenkataloge zum Lesen/Anhören (`#/bibliothek/fragen/<fach>`) entstehen in der App direkt aus den Fragen-JSONs; `fragen/0N-*.md` werden dafür nicht gelesen.

**Lernunterlagen & Hörbuch:** Die Seite „Lernunterlagen“ (`#/bibliothek`) listet alles zum Lesen und Anhören. Das Hörbuch (`src/tts.js`, `src/Player.jsx`)
nutzt die Sprachausgabe des Geräts (Web Speech API) – keine Audiodateien, funktioniert offline mit lokal installierten Stimmen (iOS/Android/Windows; „Google“-Stimmen in Chrome brauchen Internet).
Gelesen wird satzweise mit Hervorhebung; Aussprache-Korrekturen (Abkürzungen, Einheiten) stehen in `ABK` in `src/tts.js`. Position und Einstellungen liegen in `localStorage` (`flugschein-hoerbuch-v1`).

Checklisten-IDs werden aus dem Text gebildet: Wird ein Punkt umformuliert, gilt er als neu (Haken muss erneut gesetzt werden).

**Lernkarten** (`#/lernkarten`, `src/pages/Lernkarten.jsx`): entstehen beim Build aus den Skripten (Tabellenzeilen: Spalte 1 = Vorderseite,
übrige Spalten = Rückseite; Absätze/Zitate mit fettem Label wie „Merksatz“, „Eselsbrücke“, „Prüfungsfalle“, „Grenzwert“; Listenpunkte `**Begriff**: Erklärung`)
und dem Glossar. Stapel je Fach + Glossar, Leitner wie der Karteikasten (`state.karten`), Neue pro Tag einstellbar, Vorlesen optional,
Anki-Export als TSV (`#deck column`/`#tags column`, Import in Anki: Datei → Importieren).

**Funktraining** (`#/funk`, `src/pages/Funk.jsx`): aus `funkuebungen/szenarien.json` (Schema dort in `README.md`; Zusatzfelder `themen`, `frequenzen[].uebungswert`).
Gegenstelle spricht (Stimme je `sprache` de/en), Bedenkzeit, dann Musterlösung (Text + Vorlesen). Pilot-Schritte der Form „(Aktion: …)“ werden nur angezeigt.
Optional Spracherkennung (Web Speech API) mit grobem Schlüsselwort-Abgleich (Zahlwörter → Ziffern).

**LPE-Training** (`#/lpe`, `src/pages/Lpe.jsx`): aus `funkuebungen/lpe-uebungen.json` (Schema in `funkuebungen/README.md`; `content.lpe`, Schritt-Feld `n` = Index
in der JSON-Datei = Schlüssel im Audio-Manifest `lpe`). Prüfer/ATC/Ansage sprechen mit der anderen Stimme als der gewählten, Musterantwort mit der gewählten
(sonst Gerätestimme `en`). Aufgabe + Bildbeschreibung (`bild`) als Karte, Antwort-Timer (Interview/Bild 45/60/90 s, sonst 15/20/30 s), optional Aufnahme
(MediaRecorder, nur im Tab) und Spracherkennung `en-GB` mit Schlüsselwort-Abgleich; Ansagen (`sprecher: ansage`) mit „Nochmal hören“, Text erst am Ende.
Am Ende Vokabeln, Fortschritt `checks['lpe:<id>']`. Prüfungssimulation `#/lpe/simulation`: Teil I Interview + Bild, Teil II Hörverstehen, Readback/Weitergabe,
unerwartete Situation (zufällig), danach Selbsteinschätzung nach 6 ICAO-Kriterien (Level = Minimum, `localStorage` `flugschein-lpe-simulationen`).
Wochenpläne in Zusatzmodulen (`**Woche N – …**` + Checkboxen) werden je Woche gruppiert.

**Checklisten** (`#/checklisten`, `src/pages/Checklisten.jsx`): aus `checklisten/*.md` (Reihenfolge/Einleitung aus `index.md`), Abschnitte `##`–`####`,
Listenpunkte werden abhakbar (Punkt/Handlung getrennt bei Punktlinien `....` oder Tab), Tabellen bleiben Text. „Alle zurücksetzen“, Druckansicht (`@media print`).

**Geräte-Sync** (`#/sync`, `src/sync.js`, `src/pages/Sync.jsx`): ohne eigenen Server über ein privates GitHub-Gist (`flugschein-fortschritt.json`).
Token mit nur `gist`-Scope, nur lokal gespeichert (`flugschein-sync-v1`). Zusammenführen pro Eintrag über Zeitstempel (`state.ts`, von `update()` gepflegt),
Fragen/Karten nach Anzahl Wiederholungen, Flugbuch per ID mit Löschmarken. Alternative: Link/QR-Code mit komprimiertem Fortschritt (`#/sync?d=…`).

**Audio (natürliche Stimmen)**: MP3s + `manifest.json` aus dem Branch `audio` (Generator: `internal/audio-quellen/`, Schema dort in `manifest-schema.md`).
- Auslieferung: Der Workflow kopiert `audio/` und `manifest.json` des Branches nach `_site/audio/` (GitHub Pages, gleiche Herkunft, CDN; ein Push auf `audio`
  löst ebenfalls einen Deploy aus). Ist `./audio/manifest.json` nicht erreichbar (z. B. Einzeldatei per `file://`), nutzt `src/audio.js` `raw.githubusercontent.com`;
  auch einzelne Dateien fallen bei Fehlern dorthin zurück.
- Player (`src/tts.js`): Stimmwahl Frau/Mann (Standard Frau) oder Gerätestimme. Pro Teil wird die Aufnahme nur genutzt, wenn Segmentzahl `n` und Text-Hash
  zur aktuellen Segmentierung passen – sonst liest die Gerätestimme (Hinweis im Player). Mitlesen/Springen über die Zeitmarken `t[i]`.
- **Aussprache (`ABK`, `BUCHSTABIEREN`, NATO-Kennzeichen in `src/tts.js`) und Segmentierung ändern die Hashes** → danach
  `bash internal/audio-quellen/neu-generieren.sh --push` (inkrementell), sonst Gerätestimme für die betroffenen Teile.
- Funktraining: Pilot = gewählte Stimme, Gegenstelle = andere Stimme (Hash über den Original-Text). Englische Funk-Dialoge in Codeblöcken der Skripte:
  Knopf „Dialog anhören“ mit Zeilen-Hervorhebung.
- Offline: „Lernunterlagen → Offline hören“ legt je Fach (Skript + Fragenkatalog + Dialoge), „Dokumente & Glossar“, „Funktraining“ oder „LPE-Training“ die MP3s in den Cache
  `flugschein-audio`. Der Service Worker lädt Audio nie vorab, liefert gespeicherte Dateien als Range-Antwort (206, nötig für Safari) und streamt den Rest.

## Hosting (GitHub Pages: https://rroollii.github.io/flugschein/)

Aktuelle Einrichtung: Repo öffentlich, Settings → Pages → „Deploy from a branch“: **`gh-pages` / (root)**.
`main` enthält Quellen + Inhalte (`inhalte/`); `.github/workflows/pages.yml` baut bei jedem Push auf `main` nach `_site/`
und committet das Ergebnis in den Branch `gh-pages` (nur wenn sich der Build geändert hat). Danach veröffentlicht GitHub
Pages automatisch („pages build and deployment“). Lokal baut `bash build.sh` im Repo aus `inhalte/` nach `_site/`.

### Inhalte aktualisieren und neu deployen

1. Inhalte in `docs/` (Projekt-Store) ändern – siehe „Inhaltsquellen“.
2. Repo neu zusammenstellen und pushen:
   ```bash
   git clone https://github.com/rroollii/flugschein /tmp/flugschein   # oder vorhandenen Checkout nutzen
   bash internal/plattform-quellen/build.sh --repo /tmp/flugschein   # baut docs/plattform/ und kopiert Quellen + inhalte/
   cd /tmp/flugschein && git add -A && git commit -m "Inhalte aktualisiert" && git push origin main
   ```
3. Der Push auf `main` startet „Plattform bauen (gh-pages)“, das nach `gh-pages` pusht; anschließend läuft „pages build and deployment“
   (Status: `gh run list -R rroollii/flugschein`). Nach 1–2 min ist die neue Version live. Direkt im Repo geht auch: Dateien unter `inhalte/` bearbeiten und pushen.
4. Ohne Actions (Notfall): Inhalt von `docs/plattform/` (ohne `BUILD-INFO.txt`) in die Wurzel des Branches `gh-pages` committen und pushen.
   Nicht von Hand auf `gh-pages` arbeiten, wenn gleichzeitig `main` geändert wird – der Workflow überschreibt den Branch-Inhalt.

Pages-Quelle nicht auf „GitHub Actions“ umstellen, ohne den Workflow wieder auf `upload-pages-artifact`/`deploy-pages` zurückzubauen.
Bereits installierte PWAs holen die neue Version beim nächsten Online-Start (Service-Worker-Version ändert sich mit jedem Build).

`BASE_PATH` (Standard `/flugschein/`) setzt `start_url`/`scope` im Manifest. Die App selbst verwendet nur relative Pfade und Hash-Routing (`#/skripte/…`),
läuft also auch unter anderen Pfaden. Für Netlify o. Ä. in der Domain-Wurzel: `BASE_PATH=/ bash build.sh` (oder `./` für relativ).

## Aufbau

```
scripts/build-content.mjs   Inhalte → src/generated/content.json
scripts/postbuild.mjs       dist/index.html → OUT_DIR, Manifest, Service Worker
content/glossar.json        kuratiertes Glossar
src/store.js                Fortschritt (localStorage), Karteikasten (Leitner 1/2/4/8/16 Tage), Kennzahlen
src/tts.js, src/Player.jsx  Hörbuch (Sprachausgabe, Player, Hervorhebung)
src/pages/*.jsx             Lernunterlagen, Übersicht, Ausbildung (Phasen, Flugbuch, Fristen), Lernplan, Skripte, Fragen (Lern-/Prüfungsmodus),
                            Karteikasten, Zusatzausbildungen, Statistik, Suche, Glossar, Dokumente, Daten (Export/Import)
```

Entwicklung: `CONTENT_DIR=/pfad/zu/docs npm run dev`.
