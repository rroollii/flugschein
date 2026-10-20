# Funkübungen mit Sprachausgabe

> Interaktive Funkszenarien zur Vorbereitung auf das **Flugfunk-Zeugnis (Fokus EFZ)** und den Funkverkehr ab Fürstenfeld (LOGF). Deutsch und Englisch gemischt. Datei: [`szenarien.json`](szenarien.json) – **30 Szenarien** (17 Deutsch, 13 Englisch; 8 leicht, 13 mittel, 9 schwer). Zusätzlich: [`lpe-uebungen.json`](lpe-uebungen.json) – **26 Sprech-/Hörübungen für den Sprachtest Englisch** (siehe [unten](#lpe-übungen-sprachtest-englisch-lpe-uebungenjson)).

**Frequenzen:** Echt sind nur **Fürstenfeld Radio 122,705 MHz**, **Wien Information 124,400 MHz** [prüfen] und die internationale Notfrequenz **121,500 MHz**. Alle anderen Frequenzen (Graz, Budapest, Ljubljana, Maribor) sowie Squawks, QNH-Werte und Meldepunkte außerhalb von LOGF sind **Übungswerte** (`"uebungswert": true`). Im Flug gelten AIP, NOTAM und die Anweisungen von ATC.

## Ablauf in der Plattform

1. Szenario wählen (Filter nach `sprache`, `schwierigkeit`, `themen`), `situation` anzeigen.
2. Schritte der Reihe nach abarbeiten:
   - `rolle: "atc"` → Text per Sprachausgabe vorlesen (`de-AT`/`de-DE` bzw. `en-GB` je nach `sprache`).
   - `rolle: "pilot"` → Nutzer spricht/tippt seine Antwort; danach wird `text` als **Musterlösung** angezeigt (optional vorlesen), `hinweis` als Erklärung.
3. Pilot-Texte in Klammern, z. B. `(Aktion: IDENT-Taste drücken …)`, sind **Handlungen ohne Sprachantwort** – nicht vorlesen.
4. Mehrere Pilot-Schritte hintereinander sind normal (z. B. Meldungen in der Platzrunde ohne ATC-Antwort).

Zahlen und Rufzeichen sind **ausgeschrieben, wie sie gesprochen werden** („eins null eins drei“, „zwo“, „niner“, „Oscar Echo Charlie Bravo Foxtrot“), damit die Sprachausgabe korrekt klingt.

## Schema

```json
{
  "version": 1,
  "stand": "2026-10-17",
  "hinweis": "string – Sicherheits-/Frequenzhinweis",
  "rufzeichen": { "kennzeichen": "OE-CBF", "gesprochen": "Oscar Echo Charlie Bravo Foxtrot", "muster": "DA20" },
  "szenarien": [
    {
      "id": "string, eindeutig, kebab-case",
      "titel": "string",
      "sprache": "de | en",
      "schwierigkeit": "leicht | mittel | schwer",
      "themen": ["string", "…"],
      "frequenzen": [ { "name": "string", "mhz": "122,705", "uebungswert": false } ],
      "situation": "string – Kurzbeschreibung der Ausgangslage",
      "schritte": [
        { "rolle": "atc | pilot", "text": "string", "hinweis": "string (optional)" }
      ]
    }
  ]
}
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Eindeutiger Schlüssel (z. B. für Fortschritt speichern) |
| `titel` | ja | Anzeigename |
| `sprache` | ja | `de` oder `en` – steuert die Stimme |
| `schwierigkeit` | ja | `leicht`, `mittel`, `schwer` |
| `situation` | ja | Ausgangslage, vor dem ersten Schritt anzeigen |
| `schritte` | ja | Geordnete Liste; `atc` = vorlesen, `pilot` = erwartete Antwort (Musterlösung) |
| `schritte[].hinweis` | nein | Erklärung/Lerntipp zum Schritt |
| `themen` | nein (immer vorhanden) | Filter-Tags, siehe unten |
| `frequenzen` | nein (immer vorhanden) | Im Szenario genutzte Stationen, `uebungswert` kennzeichnet fiktive Werte |

**Themen-Tags:** `fuerstenfeld`, `abflug`, `ankunft`, `platzrunde`, `meldepunkte`, `blindmeldung`, `fis`, `flugplan`, `verkehrsinformation`, `ctr`, `tma`, `graz`, `transponder`, `grenzueberflug`, `ungarn`, `slowenien`, `positionsmeldung`, `wetter`, `funkausfall`, `notfall`, `panpan`, `mayday`, `readback`, `englisch`.

## Abgedeckte Situationen

| Bereich | Szenario-IDs |
|---|---|
| Fürstenfeld Radio (Ab-/Anflug, Platzrunde, Blindmeldungen) | `logf-abflug-platzrunde`, `logf-ankunft-therme`, `logf-abflug-ueberland`, `logf-arrival-english`, `logf-blindmeldungen`, `logf-departure-english`, `pilot-korrektur-de` |
| Wien Information (FIS) | `wien-info-erstkontakt`, `vienna-info-initial`, `wien-info-flugplan-eroeffnen`, `wien-info-tiefflug-militaer` |
| CTR/TMA Graz | `graz-ctr-einflug`, `graz-ctr-transit-en`, `graz-radar-luftraum-d` |
| Transponder | `transponder-anweisungen-de`, `transponder-instructions-en` |
| Grenzüberflug Ungarn/Slowenien | `grenze-ungarn`, `grenze-slowenien-maribor`, `positionsmeldung-budapest` |
| Positionsmeldungen | `positionsmeldung-wien`, `positionsmeldung-budapest` |
| Wetterabfrage | `wetter-wien-info`, `weather-request-en` |
| Funkausfall | `funkausfall-empfang-ok`, `radio-failure-blind` |
| PAN PAN / MAYDAY | `pan-pan-oeldruck`, `pan-pan-orientierung-en`, `mayday-engine-failure-en`, `mayday-motorbrand-logf` |
| Readback-Fehler-Korrektur | `readback-fehler-de`, `readback-error-en`, `pilot-korrektur-de` |

---

## LPE-Übungen: Sprachtest Englisch (`lpe-uebungen.json`)

> Sprech- und Hörübungen für den **Sprachtest Englisch (FCL.055, ICAO Level 4–6)**. Datei: [`lpe-uebungen.json`](lpe-uebungen.json) – **26 Übungen**, alle Englisch (6 leicht, 12 mittel, 8 schwer). Theorie und Prüfungsablauf: [LPE Englisch](../zusatzausbildungen/lpe-englisch.md). Erzeugt per `internal/zusatzausbildungen-quellen/lpe_uebungen.py` (prüft das Schema).

Im Unterschied zu `szenarien.json` wird hier **plain English** geübt, nicht nur Phraseologie: Der Prüfer stellt Fragen, zeigt Bilder, spielt ATIS/Funksprüche vor; der Nutzer antwortet frei, danach erscheint die **Musterantwort**. Alle Werte (Frequenzen, QNH, ATIS, Positionen) sind **Übungswerte**.

### Ablauf in der Plattform

1. Übung wählen (Filter `typ`, `schwierigkeit`, `level_ziel`, `themen`), `situation` und `aufgabe` anzeigen; bei Bildtypen zusätzlich `bild` (Textbeschreibung des Bildes, solange keine Fotos hinterlegt sind).
2. Schritte der Reihe nach – **dieselben Rollen wie in `szenarien.json`**:
   - `rolle: "atc"` → mit `en-GB`-Stimme vorlesen. `sprecher` sagt, wer spricht: `atc` (Fluglotse/FIS), `pruefer` (Sprachprüfer), `ansage` (ATIS-/Funkaufnahme, Geschichte – optional langsamer/„Funkqualität“). Bei `ansage` sollte die Plattform **„Nochmal hören“** anbieten (im Test ist eine Wiederholung meist erlaubt).
   - `rolle: "pilot"` → Nutzer spricht (Aufnahme/Timer **45–60 s** bei `interview`, `bildbeschreibung`, `bildvergleich`); danach `text` als **Musterantwort** anzeigen, `hinweis` als Lerntipp.
3. Am Ende `vokabeln` als Lernliste anzeigen.

### Schema

```json
{
  "version": 1,
  "stand": "2026-10-20",
  "hinweis": "string",
  "rufzeichen": { "kennzeichen": "OE-CBF", "gesprochen": "Oscar Echo Charlie Bravo Foxtrot", "muster": "DA20" },
  "typen": { "interview": "Beschreibung", "…": "…" },
  "uebungen": [
    {
      "id": "string, eindeutig, kebab-case, Präfix lpe-",
      "titel": "string",
      "typ": "interview | bildbeschreibung | bildvergleich | hoerverstehen | readback | weitergabe | unerwartete-situation",
      "sprache": "en",
      "schwierigkeit": "leicht | mittel | schwer",
      "level_ziel": "4 | 5",
      "themen": ["string"],
      "situation": "string (Deutsch) – Ausgangslage",
      "aufgabe": "string (Deutsch) – was der Nutzer tun soll",
      "bild": "string (Deutsch) – nur bei bildbeschreibung/bildvergleich",
      "schritte": [
        { "rolle": "atc", "sprecher": "atc | pruefer | ansage", "text": "string (Englisch)", "hinweis": "string (optional)" },
        { "rolle": "pilot", "text": "Musterantwort (Englisch)", "hinweis": "string (optional)" }
      ],
      "vokabeln": [ { "en": "string", "de": "string" } ]
    }
  ]
}
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `typ` | ja | Übungsart, Beschreibung in `typen` |
| `level_ziel` | ja | `4` = Basis, `5` = anspruchsvoller (Argumentation, Schlussfolgerung) |
| `aufgabe` | ja | Arbeitsauftrag, vor dem ersten Schritt anzeigen |
| `bild` | bei Bildtypen | Was auf dem (gedachten) Foto zu sehen ist |
| `schritte[].sprecher` | bei `atc` | `atc`, `pruefer` oder `ansage` – Stimme/Darstellung |
| `vokabeln` | ja (ggf. leer) | Wortschatz zur Übung |

### Abgedeckte Übungen

| Typ | IDs |
|---|---|
| Interview | `lpe-intro`, `lpe-first-solo`, `lpe-weather-decision`, `lpe-biggest-risk` |
| Bildbeschreibung | `lpe-bild-birdstrike`, `lpe-bild-smoke-gear`, `lpe-bild-fog`, `lpe-bild-thunderstorm`, `lpe-bild-forced-landing`, `lpe-bild-fuel` |
| Bildvergleich | `lpe-vergleich-cockpits`, `lpe-vergleich-airports` |
| Hörverstehen (ATIS, Geschichte) | `lpe-atis-graz`, `lpe-atis-ljubljana`, `lpe-story-student` |
| Readback | `lpe-readback-graz-ctr`, `lpe-readback-hold` |
| Weitergabe (relay) | `lpe-relay-mayday`, `lpe-relay-medical` |
| Unerwartete Situationen | `lpe-unexp-birdstrike`, `lpe-unexp-passenger`, `lpe-unexp-rough-engine`, `lpe-unexp-diversion`, `lpe-unexp-runway-blocked`, `lpe-unexp-smoke`, `lpe-unexp-lost` |

Verwandt: [Skript Kommunikation](../skripte/kommunikation.md) · [Checklisten](../checklisten/index.md) · [Flugschule Fürstenfeld](../flugschule-fuerstenfeld.md)
