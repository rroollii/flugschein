# Funkübungen mit Sprachausgabe

> Interaktive Funkszenarien zur Vorbereitung auf das **Flugfunk-Zeugnis (Fokus EFZ)** und den Funkverkehr ab Fürstenfeld (LOGF). Deutsch und Englisch gemischt. Datei: [`szenarien.json`](szenarien.json) – **30 Szenarien** (17 Deutsch, 13 Englisch; 8 leicht, 13 mittel, 9 schwer).

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

Verwandt: [Skript Kommunikation](../skripte/kommunikation.md) · [Checklisten](../checklisten/index.md) · [Flugschule Fürstenfeld](../flugschule-fuerstenfeld.md)
