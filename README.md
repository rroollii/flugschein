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
| `ppl-ueberblick.md`, `flugschule-*.md` | Dokumente |
| `glossar.md` (optional) | ergänzt/überschreibt `content/glossar.json` (Tabelle `| Begriff | Erklärung |` oder `**Begriff**: Erklärung`) |
| `zusatzausbildungen/` (optional) | Bereich „Zusatzausbildungen“: `index.md` (Einleitung, Reihenfolge der Links), weitere `*.md` als Module, `fragen-zusatz.json` (Schema wie `fragenbank.json`). Module sind Objekte in `content.zusatz.module` (`id, titel, fachId, kapitel, fragen, checklisten`); Checkboxen der Module werden abhakbar |

Kapitel-Ebene: `##`; hat ein Dokument höchstens 4 `##`-Teile mit vielen `###`, wird auf `###` geteilt (Teil-Überschrift erscheint im Inhaltsverzeichnis).
Checklisten-IDs werden aus dem Text gebildet: Wird ein Punkt umformuliert, gilt er als neu (Haken muss erneut gesetzt werden).

## Hosting (GitHub Pages: https://rroollii.github.io/flugschein/)

- **Variante A – fertige Seite pushen:** Inhalt von `docs/plattform/` in die Wurzel eines Branches von `rroollii/flugschein` legen, Pages auf „Deploy from branch“ stellen.
- **Variante B – Repo mit Build-Workflow:** `bash build.sh --repo /pfad/zum/repo` kopiert Quellen + Inhalte (`inhalte/`) dorthin.
  Dort baut `bash build.sh` lokal aus `inhalte/` nach `_site/`; `.github/workflows/pages.yml` baut bei jedem Push auf `main` und veröffentlicht (Settings → Pages → Source: „GitHub Actions“).

`BASE_PATH` (Standard `/flugschein/`) setzt `start_url`/`scope` im Manifest. Die App selbst verwendet nur relative Pfade und Hash-Routing (`#/skripte/…`),
läuft also auch unter anderen Pfaden. Für Netlify o. Ä. in der Domain-Wurzel: `BASE_PATH=/ bash build.sh` (oder `./` für relativ).

## Aufbau

```
scripts/build-content.mjs   Inhalte → src/generated/content.json
scripts/postbuild.mjs       dist/index.html → OUT_DIR, Manifest, Service Worker
content/glossar.json        kuratiertes Glossar
src/store.js                Fortschritt (localStorage), Karteikasten (Leitner 1/2/4/8/16 Tage), Kennzahlen
src/pages/*.jsx             Übersicht, Ausbildung (Phasen, Flugbuch, Fristen), Lernplan, Skripte, Fragen (Lern-/Prüfungsmodus),
                            Karteikasten, Zusatzausbildungen, Statistik, Suche, Glossar, Dokumente, Daten (Export/Import)
```

Entwicklung: `CONTENT_DIR=/pfad/zu/docs npm run dev`.
