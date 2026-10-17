# Flugleistung und Flugplanung (Flight Performance and Planning) – PPL(A)

> Prüfungsfach nach FCL.215 / AMC1 FCL.210; FCL.215 (ECQB-PPL, Sachgebiet 030 „Flight Performance and Planning“).
> Prüfung bei der **Austro Control** (Fach 70 „Flugleistung und Flugplanung“): **12 Fragen, 25 Minuten**, Bestehensgrenze **75 %**. Der Fragenkatalog der Austro Control basiert auf dem ECQB; Diagramme und Tabellen stammen aus dem zugehörigen **Anlagenhandbuch** – übe mit genau diesen Anlagen [prüfen: welche Anlagen die Austro Control ausgibt].
> Alle Flugzeugdaten unten sind **Beispielwerte**. Im echten Betrieb gilt ausschließlich das **Flughandbuch (AFM/POH)** des jeweiligen Flugzeugs.

---

## Lernziele

Nach diesem Skript kannst du …

1. Massenbegriffe (Leermasse, Zuladung, MTOM usw.) unterscheiden und Massengrenzen prüfen,
2. Schwerpunktlage über Momente berechnen, Umladungen und Ballast bestimmen,
3. Druckhöhe und Dichtehöhe berechnen und ihren Einfluss auf die Leistung erklären,
4. Start-, Steig-, Reise-, Sink- und Landeleistung aus Tabellen/Diagrammen und mit Zuschlagsfaktoren bestimmen,
5. Gegen- und Seitenwindkomponenten berechnen,
6. Reichweite und Flugdauer (range/endurance) unterscheiden,
7. einen VFR-Flug planen (Route, Lufträume, Frequenzen, NOTAM, Wetter, AIP),
8. den Kraftstoffbedarf nach Teil-NCO berechnen,
9. einen ICAO-Flugplan ausfüllen, aufgeben und schließen.

---

## Teil A – Masse und Schwerpunkt (Mass and Balance)

### A1. Warum Masse und Schwerpunkt?

- **Zu große Masse:** längere Start-/Landestrecke, schlechteres Steigen, höhere \(V_S\), geringere Reichweite, strukturelle Überlastung (das zulässige Lastvielfache bezieht sich auf MTOM).
- **Schwerpunkt zu weit vorne:** hohe Steuerkräfte, höhere \(V_S\), Höhenruder kann zum Abfangen bei der Landung nicht mehr reichen, Bugradbelastung.
- **Schwerpunkt zu weit hinten:** verringerte Längsstabilität, Neigung zum Überziehen und Trudeln, Trudeln evtl. nicht beendbar. **Gefährlichster Fall.**

### A2. Massenbegriffe

| Begriff | Bedeutung |
|---|---|
| **Leermasse (Basic Empty Mass, BEM)** | Zelle, Triebwerk, fest eingebaute Ausrüstung, **nicht ausfliegbarer Kraftstoff**, Hydraulikflüssigkeit und i. d. R. **Motoröl** (je nach Handbuch). Steht im **Wägebericht** |
| **Zuladung (Useful Load)** | MTOM − Leermasse = Insassen + Gepäck + ausfliegbarer Kraftstoff |
| **Nutzlast (Payload)** | Passagiere, Gepäck, Fracht (ohne Kraftstoff und Besatzung) |
| **Höchstzulässige Rollmasse (MRM/MTW)** | max. Masse beim Rollen (inkl. Kraftstoff für Anlassen/Rollen) |
| **Höchstzulässige Startmasse (MTOM)** | max. Masse beim Beginn des Startlaufs |
| **Höchstzulässige Landemasse (MLM)** | max. Masse beim Aufsetzen |
| **Höchstzulässige Leertankmasse (MZFM)** | max. Masse ohne ausfliegbaren Kraftstoff (eher bei größeren Flugzeugen) |

> **Prüfungsfalle:** „Zuladung“ (useful load) enthält den Kraftstoff, „Nutzlast“ (payload) nicht.

### A3. Physikalische Grundlagen

- **Moment = Masse × Hebelarm**  (kg·m bzw. lb·in)
- Der **Hebelarm (arm, station)** wird von einer **Bezugsebene (datum)** gemessen, die der Hersteller festlegt (z. B. Brandschott oder Propellerflansch). Hinter dem Datum = positiv.
- **Schwerpunktlage:**

\[ x_{CG} = \frac{\sum \text{Momente}}{\sum \text{Massen}} \]

- Häufig in % der **mittleren aerodynamischen Flügeltiefe (MAC)** angegeben (eher größere Flugzeuge).

### A4. Einheiten und Dichten

| Umrechnung | Wert |
|---|---|
| 1 kg | 2,2046 lb |
| 1 lb | 0,4536 kg |
| 1 US-Gallone (USG) | 3,785 l |
| 1 Imperial Gallon | 4,546 l |
| 1 inch | 2,54 cm |
| Dichte **AVGAS 100LL** | **0,72 kg/l** (≈ 6 lb/USG) |
| Dichte Jet A-1 / Diesel | ca. 0,80–0,84 kg/l |
| Dichte Motoröl | ca. 0,9 kg/l (≈ 7,5 lb/USG) |

### A5. Durchgerechnetes Beispiel – Beladung prüfen

**Flugzeugdaten (Beispiel, viersitziger Hochdecker):**
- MTOM 1111 kg, MLM 1111 kg
- Schwerpunktbereich: **0,89 m bis 1,20 m** hinter Datum (vereinfacht, unabhängig von der Masse)
- Max. Gepäck 54 kg

| Posten | Masse (kg) | Hebelarm (m) | Moment (kg·m) |
|---|---|---|---|
| Leermasse (Wägebericht) | 680,0 | 0,95 | 646,00 |
| Pilot + Passagier vorne | 160,0 | 0,94 | 150,40 |
| Passagier hinten | 75,0 | 1,85 | 138,75 |
| Gepäck | 20,0 | 2,41 | 48,20 |
| Kraftstoff 140 l × 0,72 | 100,8 | 1,22 | 122,98 |
| **Summe (Startmasse)** | **1035,8** | | **1106,33** |

\[ x_{CG} = \frac{1106{,}33}{1035{,}8} = \mathbf{1{,}068\ m} \]

- Masse 1035,8 kg ≤ 1111 kg ✔
- Schwerpunkt 1,068 m liegt zwischen 0,89 und 1,20 m ✔

**Landung:** Verbrauch 60 l = 43,2 kg (Moment 43,2 × 1,22 = 52,70 kg·m)
- Masse = 1035,8 − 43,2 = **992,6 kg**
- Moment = 1106,33 − 52,70 = **1053,63 kg·m**
- \(x_{CG}\) = 1053,63 / 992,6 = **1,061 m** ✔

> **Merke:** Liegt der Tank **hinter** dem Schwerpunkt, wandert der Schwerpunkt mit dem Verbrauch nach **vorne** (und umgekehrt). Immer **Start- UND Landeschwerpunkt** prüfen.

### A6. Umladung (Massenverschiebung)

\[ \Delta x_{CG} = \frac{m_{verschoben} \cdot d}{M_{gesamt}} \]

**Beispiel:** Die 20 kg Gepäck (2,41 m) werden auf den Rücksitz (1,85 m) gelegt, Gesamtmasse 1035,8 kg.
d = 2,41 − 1,85 = 0,56 m
Δx = 20 × 0,56 / 1035,8 = **0,0108 m nach vorne** → neuer Schwerpunkt 1,068 − 0,011 = **1,057 m**.

### A7. Ballast / Zuladung zur Schwerpunktkorrektur

\[ m_{Ballast} = \frac{M \cdot (x_{neu} - x_{alt})}{x_{Ballast} - x_{neu}} \]

**Beispiel:** M = 1050 kg, Schwerpunkt 1,21 m (hintere Grenze 1,20 m). Ballast soll auf den Vordersitz (0,94 m).
m = 1050 × (1,20 − 1,21) / (0,94 − 1,20) = 1050 × (−0,01) / (−0,26) ≈ **40,4 kg**.
Prüfen: Die neue Masse (1090,4 kg) darf die MTOM nicht überschreiten! Oft ist **Umladen** die bessere Lösung.

### A8. Grafische Verfahren

- **Beladediagramm (Loading Graph):** Momente je Posten werden abgelesen (oft Moment/1000).
- **Schwerpunktbereichsdiagramm (CG Envelope):** Gesamtmasse über Gesamtmoment (oder Schwerpunktlage) eingetragen; der Punkt muss **innerhalb der Umhüllenden** liegen. Häufig gibt es einen separaten **Utility-Bereich** (kleiner, für Kunstflug/Trudeln zulässig).

> **Prüfungstipp:** Im Anlagenhandbuch sind die Beladediagramme oft in **lb und in** – beim Ablesen auf die Einheit achten und nicht kg mit lb mischen.

---

## Teil B – Flugleistung (Performance)

### B1. Atmosphäre, Druckhöhe und Dichtehöhe

- **Druckhöhe (Pressure Altitude, PA):** Höhe in der ISA, die dem aktuellen Luftdruck entspricht; Höhenmesseranzeige bei Einstellung **1013,25 hPa**.

\[ PA = \text{Elevation} + (1013 - QNH) \times 30\ \text{ft} \]

(Faustwert 1 hPa ≈ 30 ft; genauer 27 ft in Bodennähe.)

- **ISA-Temperatur in der Höhe:** \(T_{ISA} = 15\ °C - 2\ °C \times \frac{\text{Höhe}}{1000\ \text{ft}}\)
- **Dichtehöhe (Density Altitude, DA):** Höhe in der ISA, die der aktuellen Luftdichte entspricht. **Maßgeblich für Leistung von Flügel, Motor und Propeller.**

\[ DA \approx PA + 120\ \text{ft} \times (OAT - T_{ISA}) \]

#### Rechenbeispiel Dichtehöhe
Flugplatzhöhe 1500 ft, QNH 1003 hPa, OAT 30 °C.
- PA = 1500 + (1013 − 1003) × 30 = **1800 ft**
- \(T_{ISA}\) bei 1800 ft = 15 − 3,6 = 11,4 °C → Abweichung = 30 − 11,4 = +18,6 °C
- DA = 1800 + 120 × 18,6 ≈ 1800 + 2232 ≈ **4030 ft**

→ Das Flugzeug verhält sich wie in ca. 4000 ft Höhe: deutlich längerer Startlauf, schlechteres Steigen.

**Einflüsse auf die Dichte:** hohe Temperatur ↓, große Höhe ↓, niedriger Luftdruck ↓, **hohe Luftfeuchte ↓** (Wasserdampf ist leichter als trockene Luft).

### B2. Wind und Windkomponenten

\[ \text{Gegenwind (HW)} = V_W \cdot \cos\alpha \qquad \text{Seitenwind (XW)} = V_W \cdot \sin\alpha \]

α = Winkel zwischen Windrichtung und Pistenrichtung.

**Faustwerte für sin α (Seitenwindanteil):**

| α | 10° | 20° | 30° | 40° | 45° | 50° | 60° | ≥ 70° |
|---|---|---|---|---|---|---|---|---|
| Anteil XW | 0,2 | 0,3 | **0,5** | 0,6 | **0,7** | 0,8 | **0,9** | ≈ 1,0 |

> **Merksatz (Uhrmethode):** 10° = 10 min → 1/6, 20° = 1/3, 30° = 1/2, 40° = 2/3, 50° = 5/6, ab 60° = ganze Windstärke.

#### Rechenbeispiel Wind
Piste 26 (260°), Wind 300°/20 kt → α = 40°
- HW = 20 × cos 40° = 20 × 0,766 ≈ **15 kt**
- XW = 20 × sin 40° = 20 × 0,643 ≈ **13 kt** von rechts
- Vergleich mit der **maximal demonstrierten Seitenwindkomponente** im POH (z. B. 15 kt) ✔

> **Prüfungsfalle:** Pistenrichtung ist **missweisend** (magnetisch), Wind im METAR/TAF ist **rechtweisend**, Wind von ATC/ATIS ist **missweisend**. In Österreich (Ortsmissweisung ca. 4–6° E) ist der Unterschied klein, kann aber in Prüfungsfragen relevant sein.

### B3. Startleistung

**Definitionen:**
- **TORA** (Take-Off Run Available) – verfügbare Startlaufstrecke
- **TODA** (Take-Off Distance Available) = TORA + Freifläche (clearway)
- **ASDA** (Accelerate-Stop Distance Available) = TORA + Stoppfläche (stopway)
- **LDA** (Landing Distance Available) – verfügbare Landestrecke
- Startrollstrecke (ground roll) und **Startstrecke bis 50 ft (15 m)** Hindernishöhe aus dem POH.

**Einflussfaktoren (Faustwerte, falls das POH nichts angibt – UK CAA Safety Sense 09 / AIC):**

| Bedingung | Startstrecke bis 50 ft | Faktor |
|---|---|---|
| +10 % Masse | +20 % | 1,20 |
| +1000 ft Platzhöhe | +10 % | 1,10 |
| +10 °C Temperatur | +10 % | 1,10 |
| Trockenes Gras (bis 20 cm, fester Boden) | +20 % | 1,20 |
| Nasses Gras | +30 % | 1,30 |
| 2 % Steigung (bergauf) | +10 % | 1,10 |
| Rückenwind 10 % der Abhebegeschwindigkeit | +20 % | 1,20 |
| Weicher Boden / Schnee | ≥ +25 % | ≥ 1,25 |
| **Sicherheitsfaktor** (zuletzt anwenden) | +33 % | **1,33** |

- Faktoren werden **multipliziert**, nicht addiert.
- **Gegenwind verkürzt**, **Rückenwind verlängert** – Rückenwind wirkt überproportional (typisch POH: −10 % je 9 kt Gegenwind, +10 % je 2 kt Rückenwind).
- **Klappen** in Startstellung verkürzen meist den Startlauf; Vollklappen verschlechtern den Steigflug.

#### Rechenbeispiel Startstrecke
POH-Tabelle liefert für die aktuelle Druckhöhe und Temperatur eine Startstrecke bis 50 ft von **520 m** (Asphalt, trocken, Windstille). Tatsächlich: **trockene Graspiste** mit **2 % Steigung**.

520 × 1,20 (Gras) × 1,10 (Steigung) = **686 m**
mit Sicherheitsfaktor: 686 × 1,33 ≈ **913 m**

Verfügbare TODA: 800 m → **Start nicht zulässig/verantwortbar**. Abhilfe: Masse reduzieren (Kraftstoff, Passagiere), kühlere Tageszeit, andere Piste/Richtung.

### B4. Steigleistung

- **\(V_X\)**: bester Steigwinkel (Hindernisse), **\(V_Y\)**: beste Steigrate (Zeit).
- **Steiggradient** = Höhengewinn pro Strecke:

\[ \text{ft/NM} = \frac{ROC\ (\text{ft/min}) \times 60}{GS\ (\text{kt})} \qquad \text{Gradient (\%)} \approx \frac{\text{ft/NM}}{6076} \times 100 \]

#### Rechenbeispiel Steiggradient
ROC 700 ft/min, GS 70 kt → 700 × 60 / 70 = **600 ft/NM** ≈ 600/6076 ≈ **9,9 %**.
Mit 10 kt Gegenwind (GS 60 kt): 700 × 60 / 60 = **700 ft/NM** → **Gegenwind verbessert den Steigwinkel über Grund**, nicht die Steigrate.

**Einflüsse:** Masse ↑, Temperatur ↑, Höhe ↑, Klappen ausgefahren, verschmutztes Flugzeug → Steigleistung ↓.

### B5. Reiseflug – Reichweite und Flugdauer

| Ziel | Geschwindigkeit (Propellerflugzeug) | Erklärung |
|---|---|---|
| **Größte Reichweite (max. range)** | ≈ \(V_{md}\) (bestes L/D) | geringster Verbrauch pro **Strecke** |
| **Größte Flugdauer (max. endurance)** | ≈ \(V_{mp}\) (min. Leistungsbedarf), langsamer als \(V_{md}\) | geringster Verbrauch pro **Zeit** |

- **Gegenwind:** für maximale Reichweite **etwas schneller** fliegen; Rückenwind: etwas langsamer.
- **Flugdauer** hängt nicht vom Wind ab, die **Reichweite über Grund** schon.
- **Masse ↑** → höhere Geschwindigkeit für beste Reichweite, geringere Reichweite.
- **Gemisch richtig abmagern** (leaning) senkt den Verbrauch erheblich (→ Luftfahrzeugkenntnisse).
- Leistungstabellen im POH: Leistung in % (z. B. 65 %/75 %) in Abhängigkeit von Druckhöhe, Drehzahl, Temperatur → TAS und Verbrauch.

#### Rechenbeispiel Reichweite/Flugdauer
Ausfliegbarer Kraftstoff 150 l, Verbrauch 30 l/h, TAS 105 kt, Gegenwind 15 kt.
- Gesamtflugdauer = 150 / 30 = **5,0 h**
- Flugdauer ohne Reserve (30 min) = 4,5 h
- Reichweite über Grund (mit Reserve) = 4,5 h × (105 − 15) kt = **405 NM**

### B6. Sinkflug und Landung

**Einflussfaktoren auf die Landestrecke (Faustwerte):**

| Bedingung | Landestrecke ab 50 ft | Faktor |
|---|---|---|
| +10 % Masse | +10 % | 1,10 |
| +1000 ft Platzhöhe | +5 % | 1,05 |
| +10 °C Temperatur | +5 % | 1,05 |
| Nasse Asphaltpiste | +15 % | 1,15 |
| Trockenes Gras (bis 20 cm) | +15 % | 1,15 |
| Nasses Gras | +35 % | 1,35 |
| 2 % Gefälle (bergab) | +10 % | 1,10 |
| Rückenwind 10 % der Landegeschwindigkeit | +20 % | 1,20 |
| Schnee | ≥ +25 % | ≥ 1,25 |
| **Sicherheitsfaktor** (zuletzt anwenden) | +43 % | **1,43** |

#### Rechenbeispiel Landestrecke
POH: 420 m ab 50 ft (Asphalt, trocken, Windstille). Nasse Graspiste: 420 × 1,35 = 567 m; × 1,43 ≈ **811 m** erforderlich.

**Sinkflugplanung:**

\[ \text{Sinkzeit} = \frac{\Delta H}{ROD} \qquad \text{Sinkstrecke} = GS \times \text{Sinkzeit} \]

Faustregel 3°-Gleitpfad: **≈ 300 ft pro NM**; Sinkrate ≈ **GS × 5** (ft/min).

#### Rechenbeispiel Sinkflug
Von 5500 ft auf Platzrundenhöhe 1500 ft (ΔH = 4000 ft), Sinkrate 500 ft/min, GS 120 kt.
Sinkzeit = 4000 / 500 = **8 min**; Strecke = 120 × 8/60 = **16 NM** vor dem Platz beginnen.

### B7. Leistungsdiagramme lesen

- Immer in der vorgegebenen Reihenfolge: **Druckhöhe → Temperatur (Referenzlinie) → Masse → Wind → Hindernishöhe**.
- An den **Referenzlinien** parallel zu den Hilfslinien entlangfahren.
- **Interpolieren** zwischen Tabellenwerten (linear).

#### Rechenbeispiel Interpolation
Startrollstrecke bei 2000 ft: 280 m, bei 4000 ft: 340 m. Gesucht: 3000 ft.
→ 280 + (340 − 280) × (1000/2000) = **310 m**.

---

## Teil C – VFR-Flugplanung

### C1. Ablauf einer Flugvorbereitung (Checkliste)

1. **Route** wählen: Lufträume (C, D, E, G, RMZ/TMZ, LOR/LOD/LOP, militärische Tiefflugstrecken), Gelände, Hindernisse, Ausweichplätze, markante Wegpunkte, Meldepunkte.
2. **Karten**: aktuelle **ICAO-Karte Österreich 1:500 000** (Austro Control, jährlich im März), Sichtanflugkarten aus der **eAIP Austria (AD 2)**, bei Auslandsflügen die Karten der Nachbarstaaten.
3. **AIP Austria**, **AIP SUP** und **AIC** prüfen: Flugplatzdaten, Platzrunden, Betriebszeiten, PPR, Frequenzen.
4. **NOTAM** für Route, Start-, Ziel- und Ausweichplätze (über **Homebriefing** der Austro Control, homebriefing.com).
5. **Wetter**: GAFOR (Österreich, O/D/M/X), ALPFOR, METAR, TAF, Low-Level-SWC Alps, Wind/Temperatur in der Höhe, Radar/Satellit (Austro Control Flugwetter / Homebriefing), ggf. telefonische Flugwetterberatung.
6. **Masse und Schwerpunkt**, **Start- und Landestrecken**.
7. **Flugdurchführungsplan (Navigationsflugplan, Flight Log):** rwK, mwK, Wind, WCA, Steuerkurs, GS, Distanz, Zeit, Kraftstoff, Sicherheitsmindesthöhe, Frequenzen.
8. **Kraftstoffplanung** (C3).
9. **Sonnenuntergang/Dämmerung** prüfen (Ende der bürgerlichen Abenddämmerung = Beginn der Nacht).
10. Ggf. **ATS-Flugplan** aufgeben (C4).
11. Flugzeugdokumente, Lufttüchtigkeit, Vorflugkontrolle.

### C2. Wahl der Flughöhe

- **Sicherheitsmindesthöhe:** Faustregel höchstes Hindernis im Streckenkorridor (z. B. ±5 NM bzw. ±10 km) **+ 1000 ft** (in Gebirgen mehr). SERA-Mindesthöhen beachten.
- **Halbkreisflugregel** (SERA.5005(g), Anlage 3): oberhalb **3000 ft AGL** sind VFR-Reiseflughöhen nach **missweisendem Kurs (mwK)** zu wählen:
  - **000°–179°**: ungerade Tausender + 500 ft (3500, 5500, 7500 ft bzw. FL 35, 55, 75 …)
  - **180°–359°**: gerade Tausender + 500 ft (4500, 6500, 8500 ft bzw. FL 45, 65, 85 …)
  - Oberhalb der Übergangshöhe (in Österreich **10 000 ft AMSL**) werden **Flugflächen** verwendet; darunter fliegst du mit **QNH** und gibst Höhen in ft an.
- Lufträume, Wolkenuntergrenzen (GAFOR), Wind in der Höhe und Leistung beeinflussen die Höhenwahl.

> **Eselsbrücke:** „**O**st = **u**ngerade“ („**O**dd **E**ast“ – Kurs Richtung Osten → ungerade).

### C3. Kraftstoffplanung

**Gesetzliche Mindestanforderung VFR Flugzeug (NCO.OP.125):** Kraftstoff bis zum Zielflugplatz **plus 30 min** (Tag) bzw. **45 min** (Nacht) in normaler Reiseflughöhe; lokaler Flug in Sichtweite des Platzes am Tag: 10 min.

**Empfohlene Gliederung:**

| Posten | Inhalt |
|---|---|
| Rollkraftstoff (taxi) | Anlassen, Rollen, Abflugcheck |
| Streckenkraftstoff (trip) | Steigflug, Reiseflug, Sinkflug, Anflug |
| Zuschlag (contingency) | unvorhergesehene Abweichungen (z. B. 5–10 % des Trip) |
| Ausweichkraftstoff (alternate) | zum Ausweichflugplatz (für VFR empfohlen) |
| **Endreserve (final reserve)** | **30 min** (Tag) / **45 min** (Nacht) |
| Extra | nach Ermessen des PIC |

#### Rechenbeispiel Kraftstoffplanung
- Strecke 120 NM, TAS 105 kt, Gegenwindkomponente 10 kt → GS 95 kt
- Flugzeit = 120 / 95 h = 1,263 h ≈ **76 min**
- Verbrauch Reiseflug 30 l/h, Zuschlag Steigflug 3 l, Rollen 3 l
- Ausweichplatz 25 NM entfernt (≈ 16 min)

| Posten | Berechnung | Liter |
|---|---|---|
| Rollen | | 3 |
| Steigflugzuschlag | | 3 |
| Strecke | 76/60 × 30 = 38,0 | 38 |
| Zuschlag 10 % | 0,1 × 38 | 4 |
| Ausweichplatz | 16/60 × 30 = 8,0 | 8 |
| Endreserve 30 min | 0,5 × 30 | 15 |
| **Mindestmenge** | | **71 l** |

→ Mit 71 l × 0,72 = **51 kg** in die Massenberechnung eintragen (oder die tatsächliche Tankmenge).
Bei USG: 71 / 3,785 ≈ **18,8 USG**.

> **Prüfungsfalle:** Rechne mit **ausfliegbarem (usable)** Kraftstoff, nicht mit der Gesamttankkapazität.

### C4. ATS-Flugplan (ICAO-Flugplan)

**Wann erforderlich (SERA.4001, Auszug):**
- für Flüge, die **ATC-Flugverkehrskontrolldienst** erfordern (z. B. IFR; VFR in bestimmten Lufträumen nach nationaler Festlegung),
- für Flüge **über Staatsgrenzen** (sofern der Staat nichts anderes bestimmt) – **Österreich:** VFR-Tagflüge in Luftraum G/E sind seit 15.05.2025 auch grenzüberschreitend **flugplanfrei** (§ 21 LVR 2014, aktiver Mode-S-Transponder nötig); Anforderungen des Nachbarstaats beachten [prüfen],
- wenn von der zuständigen Behörde verlangt (in Österreich u. a. für Flüge in Luftraum **C/D**, Flüge mit Landung auf einem **kontrollierten Flugplatz** bzw. in einer **CTR** und **VFR-Flüge bei Nacht** über die Platzumgebung hinaus – Details AIP Austria ENR 1.10),
- empfohlen bei Flügen über unwirtlichem Gelände/Wasser (Alarmierungsdienst).

**Aufgabe:** spätestens **60 Minuten vor** der voraussichtlichen Abblockzeit (EOBT), z. B. über **Homebriefing** (homebriefing.com), telefonisch bei **AIS/ARO Wien** (+43 5 1703 3211) oder bei Wien Information im Flug (dann so, dass er rechtzeitig vor dem Einflug in den betroffenen Luftraum vorliegt).

**Verspätung:** Bei mehr als **60 min Verspätung** (unkontrollierter VFR-Flug) bzw. **30 min** (kontrollierter Flug) Flugplan ändern oder neu aufgeben.

**Schließen:** **Landemeldung** an das ATS des Zielflugplatzes; ist dort kein ATS, telefonisch beim AIS/FIS. Ohne Landemeldung startet die Suche (INCERFA spätestens 30 min nach ETA).

**Wichtige Felder:**

| Feld | Inhalt | Beispiel |
|---|---|---|
| 7 | Luftfahrzeugkennung | OEDTT |
| 8 | Flugregeln / Art des Fluges | **V** / **G** (General Aviation) |
| 9 | Anzahl, Muster (ICAO-Code), Wirbelschleppenkategorie | C172/**L** |
| 10 | Ausrüstung (COM/NAV / Überwachung) | SDFGY/S |
| 13 | Startflugplatz und **EOBT in UTC** | LOGF0930 |
| 15 | Reisegeschwindigkeit, Flughöhe, Route | **N0105 VFR** DCT … |
| 16 | Zielflugplatz, **Gesamt-EET**, Ausweichflugplatz | LOWZ0110 LOWS |
| 18 | Sonstiges (DOF/, RMK/, DEP/, DEST/ bei ZZZZ) | DOF/261017 |
| 19 | Höchstflugdauer (Endurance), Personen an Bord, Notausrüstung | E/0430 P/002 |

- Geschwindigkeit: **N** = Knoten (N0105), **K** = km/h (K0190); Höhe: **A045** = 4500 ft Höhe, **F055** = FL 55, oder **VFR**.
- Flugplätze ohne ICAO-Kennung: **ZZZZ** und in Feld 18 DEP/ bzw. DEST/ mit Namen.
- Alle Zeiten in **UTC**.

### C5. Informationsquellen in Österreich

- **eAIP Austria** (Austro Control, eaip.austrocontrol.at) – Flugplatzdaten (AD 2, z. B. LOGF), Sichtanflugkarten, Verfahren; Änderungen via AIP SUP, AIC und NOTAM.
- **VFR Pilotfolder Austria** – kompakte Übersicht über Frequenzen, Verfahren und Lufträume.
- **NOTAM, Flugplan und Wetter:** **Homebriefing** der Austro Control (homebriefing.com); AIS/ARO Wien +43 5 1703 3211.
- **Wetter:** Austro Control Flugwetter (GAFOR, ALPFOR, Low-Level-SWC Alps, METAR/TAF), Telefon-Flugwetter 0900 97 9703 [prüfen].
- **FIS** „Wien Information“ auf den in der ICAO-Karte angegebenen Frequenzen.
- **Flugplatz-PPR:** viele österreichische Flugplätze (auch LOGF außerhalb der Öffnungszeiten) verlangen **PPR** – Anmeldung per Telefon/E-Mail.

---

## Typische Prüfungsfallen

1. **Faktoren multiplizieren**, Sicherheitsfaktor (1,33 Start / 1,43 Landung) **zuletzt**.
2. Rückenwind wirkt überproportional auf Start- und Landestrecke.
3. **Hohe Luftfeuchte** verringert die Dichte → schlechtere Leistung.
4. Druckhöhe: **niedriger QNH → höhere Druckhöhe**.
5. Dichtehöhe ↑ bei Wärme → **TAS bei gleicher IAS höher** → längere Strecken trotz gleicher IAS-Abhebegeschwindigkeit.
6. **Max. Flugdauer** bei langsamerer Geschwindigkeit als max. Reichweite.
7. Gegenwind verbessert den **Steigwinkel über Grund**, nicht die Steigrate.
8. Kraftstoffmasse: **Liter × 0,72** (AVGAS), nicht 1:1.
9. Schwerpunkt bei **Landung** neu berechnen.
10. Halbkreisflugregel nach **missweisendem Kurs** (nicht Steuerkurs, nicht rechtweisend).
11. Flugplan-Zeiten in **UTC**, Aufgabe ≥ **60 min** vor EOBT.
12. „Zuladung“ ≠ „Nutzlast“.

---

## Formelsammlung

| Formel | Anwendung |
|---|---|
| Moment = m × a | Schwerpunktrechnung |
| \(x_{CG} = ΣM / Σm\) | Schwerpunktlage |
| \(Δx = m·d/M\) | Umladung |
| \(m_B = M(x_{neu}-x_{alt})/(x_B-x_{neu})\) | Ballast |
| \(PA = Elev + (1013 - QNH) × 30\) | Druckhöhe (ft) |
| \(T_{ISA} = 15 - 2 × H/1000\) | ISA-Temperatur (°C) |
| \(DA ≈ PA + 120 × (OAT - T_{ISA})\) | Dichtehöhe (ft) |
| HW = V·cos α, XW = V·sin α | Windkomponenten |
| ft/NM = ROC × 60 / GS | Steiggradient |
| Zeit = Distanz / GS | Flugzeit |
| Kraftstoff = Zeit × Verbrauch | Kraftstoffbedarf |
| 3°-Pfad ≈ 300 ft/NM; ROD ≈ GS × 5 | Sinkflug |
| AVGAS: 0,72 kg/l; 1 USG = 3,785 l | Umrechnung |

---

## Kurz-Zusammenfassung

- Masse und Schwerpunkt müssen bei Start **und** Landung innerhalb der Grenzen liegen; Schwerpunkt = Summe Momente / Summe Massen.
- Leistung hängt von der **Dichtehöhe** ab; Hitze, Höhe, niedriger Druck und Feuchte verschlechtern alles.
- Start-/Landestrecken aus dem POH mit Faktoren für Oberfläche, Neigung, Wind korrigieren und mit Sicherheitsfaktoren multiplizieren.
- Reichweite und Flugdauer werden mit unterschiedlichen Geschwindigkeiten optimiert.
- VFR-Planung: Route, Lufträume, AIP, NOTAM, Wetter, Masse/Schwerpunkt, Leistung, Flight Log, Kraftstoff (Endreserve 30/45 min), ggf. ATS-Flugplan (UTC, ≥ 60 min vorher, schließen!).

---

## Kontrollfragen

1. Was ist der Unterschied zwischen Zuladung (useful load) und Nutzlast (payload)?
2. Ein Flugzeug hat 900 kg Masse und ein Gesamtmoment von 945 kg·m. Wo liegt der Schwerpunkt?
3. In einem Flugzeug mit 1000 kg Gesamtmasse werden 25 kg Gepäck um 0,8 m nach vorne verlagert. Um wie viel verschiebt sich der Schwerpunkt?
4. Welche Folgen hat ein Schwerpunkt hinter der hinteren Grenze?
5. Flugplatzhöhe 800 ft, QNH 1023 hPa. Wie groß ist die Druckhöhe?
6. Druckhöhe 2000 ft, OAT 25 °C. Wie groß ist die Dichtehöhe ungefähr?
7. Piste 09, Wind 150°/16 kt. Wie groß sind Seiten- und Gegenwindkomponente?
8. Die POH-Startstrecke beträgt 450 m. Start von nassem Gras, Sicherheitsfaktor 1,33. Welche Strecke ist erforderlich?
9. Wie viel kg wiegen 120 l AVGAS? Wie viele USG sind das?
10. Bei welcher Geschwindigkeit fliegt man für die größte Flugdauer, bei welcher für die größte Reichweite?
11. Welche Endreserve ist für einen VFR-Flug bei Nacht nach Teil-NCO mindestens erforderlich?
12. Wie lange vor der EOBT soll ein Flugplan spätestens aufgegeben werden, und in welcher Zeitzone werden die Zeiten angegeben?

### Lösungen

1. **Zuladung** = MTOM − Leermasse (Insassen, Gepäck **und Kraftstoff**); **Nutzlast** = nur Passagiere, Gepäck, Fracht (ohne Kraftstoff/Besatzung).
2. 945 / 900 = **1,05 m** hinter dem Datum.
3. Δx = 25 × 0,8 / 1000 = **0,02 m (2 cm) nach vorne**.
4. Verringerte bis negative **Längsstabilität**, empfindliche Steuerung, Überzieh- und Trudelneigung, Trudeln evtl. **nicht beendbar** – lebensgefährlich.
5. PA = 800 + (1013 − 1023) × 30 = 800 − 300 = **500 ft**.
6. \(T_{ISA}\) = 15 − 4 = 11 °C; Abweichung +14 °C; DA ≈ 2000 + 120 × 14 = **3680 ft** (≈ 3700 ft).
7. α = 60° → XW = 16 × sin 60° ≈ **14 kt** (von rechts), HW = 16 × cos 60° = **8 kt**.
8. 450 × 1,30 × 1,33 ≈ **778 m**.
9. 120 × 0,72 = **86,4 kg**; 120 / 3,785 ≈ **31,7 USG**.
10. Größte Flugdauer: ≈ \(V_{mp}\) (geringster Leistungsbedarf, langsamer); größte Reichweite: ≈ \(V_{md}\) (bestes L/D); bei Gegenwind etwas schneller.
11. Kraftstoff bis zum Zielflugplatz **plus 45 Minuten** in normaler Reiseflughöhe.
12. Spätestens **60 Minuten** vor EOBT; alle Zeiten in **UTC**.

---

## Quellen

- EASA, *Easy Access Rules for Aircrew* – FCL.215, AMC1 FCL.210; FCL.215 (Syllabus) – https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-aircrew-regulation-eu-no
- UK CAA, *CAP 1298 – PPL(A) Theoretical Knowledge Syllabus* – https://www.caa.co.uk/data-and-publications/publications/documents/content/cap1298/
- EASA, *Part-NCO* NCO.OP.125 (Kraftstoff) – https://www.easa.europa.eu/sites/default/files/dfu/Part-NCO%20IR.pdf ; *AMC/GM Part-NCO* – https://www.easa.europa.eu/en/downloads/136242/en
- EASA, *Easy Access Rules for SERA* (SERA.4001 ff. Flugplan, SERA.5005 VFR, Anlage 3 Reiseflughöhen) – https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-standardised-european-rules-air-sera
- UK CAA, *Safety Sense Leaflet 09 – Weight, Balance and Performance* – https://www.caa.co.uk/media/wcebqozv/ssl09-caa-safety-sense-weight-balance-and-performance.pdf
- NATS, *AIC 173/2024 – Take-off, Climb and Landing Performance of Light Aeroplanes* – https://www.aurora.nats.co.uk/htmlAIP/Publications/2024-12-12/html/eAIC/EG-eAIC-2024-173-P-en-GB.html
- FAA, *Pilot’s Handbook of Aeronautical Knowledge (FAA-H-8083-25C)*, Kap. 10–11 – https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak
- Austro Control, *eAIP Austria* (ENR 1.10 Flugplan, AD 2) und Homebriefing – https://eaip.austrocontrol.at/ , https://www.homebriefing.com/
- Aircademy, *ECQB-PPL* (Anlagenhandbuch mit Leistungs- und Beladediagrammen) – https://aircademy.com/de/ecqb-ppl/
- Austro Control, *Theorieprüfung PPL/LAPL* (DC_LFA_ACW_034) – https://www.austrocontrol.at/luftfahrtbehoerde/lizenzen
