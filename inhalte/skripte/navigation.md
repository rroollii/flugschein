# Navigation – PPL(A)

> Prüfungsfach nach FCL.215 / AMC1 FCL.210; FCL.215 (ECQB-PPL, Sachgebiet 060 „Navigation“: allgemeine Navigation und Funknavigation).
> Prüfung bei der **Austro Control** (Fach 90 Navigation): **20 Fragen, 60 Minuten**, Bestehensgrenze **75 %** – das zeitintensivste Fach, weil Kartenaufgaben auf einer **ICAO-Karte** (Ausschnitte aus dem Anlagenhandbuch des Fragenkatalogs) gelöst werden.
> **Hilfsmittel üben:** Kursdreieck/Navigationslineal, Zirkel, Navigationsrechner (z. B. ARISTO/ Jeppesen CR-3 oder E6B). Die Austro Control stellt in der Prüfung einen Taschenrechner (**TI-34 MultiView**) zur Verfügung; welche eigenen Hilfsmittel (Navigationsrechner, Lineal, Zirkel) erlaubt sind, vorab bei der Austro Control bzw. deiner Flugschule klären [prüfen].

---

## Lernziele

Nach diesem Skript kannst du …

1. Form der Erde, Koordinaten, Großkreis und Loxodrome erklären,
2. Richtungen (rechtweisend, missweisend, Kompass) und Entfernungen ineinander umrechnen,
3. Zeit (UTC, MEZ/MESZ, Ortszeit, Sonnenauf- und -untergang, Nacht) bestimmen,
4. die ICAO-Karte 1:500 000 lesen (Projektion, Maßstab, Symbole, Lufträume, Höhenangaben),
5. Geschwindigkeiten (IAS, CAS, TAS, GS) berechnen,
6. das Winddreieck lösen (Luvwinkel, Steuerkurs, Grundgeschwindigkeit) – rechnerisch und mit Faustformeln,
7. einen Navigationsflugplan (Flight Log) erstellen und im Flug mit Koppelnavigation und Kartenlesen fliegen,
8. Kursabweichungen mit der 1:60-Regel korrigieren, ETA berichtigen und Ausweichen planen,
9. Höhenmessereinstellungen, Sicherheitsmindesthöhen und vertikale Navigation anwenden,
10. Funknavigation (VDF, Radar, NDB/ADF, VOR, DME) und GNSS mit ihren Grenzen und Fehlern nutzen.

---

## 1. Die Erde

### 1.1 Form der Erde

- Die Erde ist ein an den Polen abgeplattetes **Rotationsellipsoid** (Äquatorradius ca. 6378 km, Polradius ca. 6357 km). In der Navigation wird sie meist als Kugel betrachtet.
- Referenzsystem für Luftfahrt und GNSS: **WGS 84** (World Geodetic System 1984).
- Die Erde dreht sich von **West nach Ost** (Sonne geht im Osten auf), einmal in 24 h → **15° pro Stunde**.

### 1.2 Großkreis, Kleinkreis, Loxodrome

- **Großkreis (great circle):** Schnitt der Kugeloberfläche mit einer Ebene durch den Erdmittelpunkt. **Kürzeste Verbindung** zwischen zwei Punkten = **Orthodrome**. Äquator und alle Meridiane sind Großkreise.
- **Kleinkreis:** Ebene geht nicht durch den Mittelpunkt (z. B. alle Breitenkreise außer dem Äquator).
- **Loxodrome (rhumb line):** Linie, die **alle Meridiane unter dem gleichen Winkel** schneidet (konstanter Kurs). Länger als die Orthodrome (Ausnahme: entlang Meridian oder Äquator, wo beide identisch sind).

> **Merksatz:** „**Ortho**drome = **orth**odox kurz; **Loxo**drome = **lo**cker gleicher Kurs.“

### 1.3 Koordinaten

- **Breite (latitude, φ):** 0° am Äquator bis 90° N/S. Breitenkreise (Parallele) laufen **parallel zum Äquator**.
- **Länge (longitude, λ):** 0° am Nullmeridian (Greenwich) bis 180° E/W. Meridiane laufen von Pol zu Pol.
- Angabe: z. B. **N 47°03′44″ E 016°05′04″** (Flugplatz Fürstenfeld, LOGF). Österreich liegt etwa zwischen **46,4° und 49° N** sowie **9,5° und 17,2° E**.
- 1° = 60′ (Bogenminuten), 1′ = 60″.

### 1.4 Entfernungen auf der Erde

- **1 Bogenminute Breite (oder auf einem Großkreis) = 1 NM = 1852 m.**
- **1° Breite = 60 NM** ≈ 111 km.
- **Abstand zweier Meridiane** wird zu den Polen hin kleiner (**Abweitung, departure**):

\[ \text{Abstand (NM)} = \Delta\lambda\ (\text{in Minuten}) \times \cos\varphi \]

#### Rechenbeispiel Abweitung
Zwei Orte auf 50° N, Längen 008° E und 010° E. Δλ = 2° = 120′.
Abstand = 120 × cos 50° = 120 × 0,643 ≈ **77 NM**.

#### Rechenbeispiel Breitenunterschied
Von N 48°30′ nach N 52°15′ auf demselben Meridian: Δφ = 3°45′ = 225′ → **225 NM** (≈ 417 km).

---

## 2. Einheiten und Umrechnungen

| Einheit | Umrechnung |
|---|---|
| 1 NM (nautische Meile) | **1,852 km** = 6076 ft |
| 1 km | 0,54 NM |
| 1 SM (statute mile) | 1,609 km = 0,87 NM |
| 1 ft | **0,3048 m** |
| 1 m | **3,28 ft** |
| 1 kt (Knoten) | 1 NM/h = 1,852 km/h |
| 1 m/s | ≈ 2 kt (genau 1,944) ≈ 197 ft/min |
| 100 ft/min | ≈ 0,5 m/s |

**Faustwerte:** km → NM: durch 2 und ca. 8 % dazu (z. B. 100 km ≈ 54 NM); ft → m: × 3 / 10 (1000 ft ≈ 300 m).

---

## 3. Richtungen

### 3.1 Nordrichtungen

- **Rechtweisend Nord (True North, TN):** Richtung zum geografischen Nordpol (Meridian).
- **Missweisend Nord (Magnetic North, MN):** Richtung, in die sich eine freie Magnetnadel einstellt.
- **Kompass-Nord (Compass North, CN):** Richtung, die der Bordkompass anzeigt (inkl. Deviation).

### 3.2 Ortsmissweisung (Variation) und Deviation

- **Ortsmissweisung / Missweisung (MW, OM, VAR):** Winkel zwischen rechtweisend und missweisend Nord. Östlich (E) oder westlich (W). In der ICAO-Karte als **Isogonen** (gestrichelte Linien gleicher Missweisung) eingezeichnet. Ändert sich mit Ort **und Zeit** (jährliche Änderung). Österreich 2026: ca. **4° E (Vorarlberg) bis 5–6° E (Osten)**; im Raum Fürstenfeld rund **5° E** [prüfen: aktuelle Isogone auf ICAO-Karte 2026].
- **Agone:** Linie mit Missweisung 0°.
- **Deviation (Ablenkung, Dev):** Winkel zwischen missweisend und Kompass-Nord, verursacht durch das Flugzeug selbst. Steht in der **Deviationstabelle (Steuertafel)** am Kompass, abhängig vom Steuerkurs.

### 3.3 Kursbegriffe (deutsche Begriffe nach ECQB)

| Abkürzung | Begriff | englisch |
|---|---|---|
| **rwK** | rechtweisender Kurs (gewünschter Kurs über Grund, aus der Karte) | True Course (TC) / True Track |
| **WCA** | Luvwinkel / Vorhaltewinkel | Wind Correction Angle |
| **rwSK** | rechtweisender Steuerkurs | True Heading (TH) |
| **MW / OM** | (Orts-)Missweisung | Variation (VAR) |
| **mwSK** | missweisender Steuerkurs | Magnetic Heading (MH) |
| **mwK** | missweisender Kurs | Magnetic Course (MC) |
| **Dev** | Deviation (Ablenkung) | Deviation (DEV) |
| **KSK** | Kompasssteuerkurs | Compass Heading (CH) |
| **KüG / TT** | Kurs über Grund (tatsächlich geflogen) | Track (TR) |

### 3.4 Umrechnungskette

\[ \text{rwK} \xrightarrow{\pm \text{WCA}} \text{rwSK} \xrightarrow{-\text{MW (E)} / +\text{MW (W)}} \text{mwSK} \xrightarrow{-\text{Dev}(+) / +\text{Dev}(-)} \text{KSK} \]

- Missweisung **östlich → abziehen**, **westlich → addieren** (von rechtweisend nach missweisend).
- WCA **zum Wind hin**: Wind von rechts → WCA positiv (Steuerkurs größer), Wind von links → WCA negativ.
- Deviation mit Vorzeichen (Ost/+ abziehen, West/− addieren).

> **Eselsbrücke:** „**East is least, West is best**“ – Ost-Missweisung wird abgezogen, West-Missweisung addiert (von True nach Magnetic).
> Deutsch: „**Ost weg, West dazu.**“

#### Rechenbeispiel Kursumrechnung
rwK = 072°, WCA = −7° (Wind von links), MW = 3° E, Dev = +1°.
- rwSK = 072° − 7° = **065°**
- mwSK = 065° − 3° = **062°**
- KSK = 062° − 1° = **061°**

> **Prüfungsfalle:** In der Karte misst du **rwK** (am Meridian!). Für die **Halbkreisflugregel** brauchst du den **mwK** (rwK − MW, ohne WCA). Für den **Kompass** brauchst du den **KSK**.

---

## 4. Zeit

### 4.1 Zeitsysteme

- **UTC (Coordinated Universal Time):** einzige Zeit in der Luftfahrt (Flugpläne, METAR/TAF, NOTAM).
- **MEZ (CET) = UTC + 1 h**, **MESZ (CEST, Sommerzeit) = UTC + 2 h**.
- **Mittlere Ortszeit (LMT):** hängt von der geografischen Länge ab: **15° = 1 h, 1° = 4 min, 1′ = 4 s**. Östlich von Greenwich ist die Ortszeit **später** (größer).

#### Rechenbeispiel Ortszeit
Ein Ort auf 010° E: LMT = UTC + 10 × 4 min = UTC + **40 min**.
Wenn es dort 12:00 LMT ist, ist es 11:20 UTC = 12:20 MEZ = 13:20 MESZ.

#### Rechenbeispiel Zeitumrechnung
Geplanter Abflug 15:30 MESZ → **13:30 UTC** (Flugplan: EOBT 1330).

### 4.2 Sonnenaufgang, Sonnenuntergang, Dämmerung

- **Sonnenaufgang/-untergang (SR/SS):** oberer Sonnenrand am Horizont.
- **Bürgerliche Dämmerung (civil twilight):** Sonnenmittelpunkt **bis 6° unter dem Horizont**.
- **Nacht (SERA/EU-Definition):** Zeit zwischen dem **Ende der bürgerlichen Abenddämmerung** und dem **Beginn der bürgerlichen Morgendämmerung**.
- Die bürgerliche Dämmerung dauert in Mitteleuropa je nach Jahreszeit ca. 30–40 min; sie ist im **Sommer länger** und **in höheren Breiten länger**.
- SR/SS-Zeiten (in UTC) aus Tabellen der AIP Austria (GEN 2.7) oder Apps; sie hängen von Datum, Breite und Länge ab. Im Westen Österreichs (Bregenz, ca. 9,7° E) geht die Sonne rund **25 min später** unter als in Fürstenfeld (16,1° E) – ca. 4 min pro Längengrad.

---

## 5. Luftfahrtkarten und ICAO-Karte 1:500 000

### 5.1 Kartenprojektionen

| Projektion | Eigenschaften | Verwendung |
|---|---|---|
| **Lambert (winkeltreue Kegelprojektion)** | **winkeltreu (konform)**, Großkreise ≈ Geraden, Maßstab nahezu konstant; Meridiane laufen zu den Polen zusammen | **ICAO-Karte 1:500 000** (Österreich, Deutschland) |
| **Mercator (Zylinderprojektion)** | winkeltreu, **Loxodromen sind Geraden**, Großkreise gekrümmt, Maßstab nimmt zu den Polen stark zu | Seekarten, Weltkarten |
| **Polarstereografisch (Azimutal)** | Großkreise ≈ Geraden nahe dem Pol | Polargebiete |

- **Winkeltreue (Konformität)** ist für die Navigation besonders wichtig: Winkel auf der Karte = Winkel in der Natur.
- Auf der Lambertkarte **Kurs immer am Meridian in der Mitte der Strecke** messen (Meridiane konvergieren).

### 5.2 Maßstab

\[ \text{Maßstab } 1 : 500\,000 \Rightarrow 1\ \text{cm Karte} = 5\ \text{km Natur} \approx 2{,}7\ \text{NM} \]

#### Rechenbeispiel Maßstab
Auf der ICAO-Karte gemessen: 12,5 cm → 12,5 × 5 km = 62,5 km → 62,5 / 1,852 ≈ **33,7 NM**.
Alternativ mit dem Navigationslineal direkt in NM ablesen; oder Breitenminuten am Meridian als NM-Maßstab nutzen.

### 5.3 Die ICAO-Karte Österreich (Austro Control)

- Herausgeber: **Austro Control**, offizielle VFR-Streckenkarte **„ICAO-Karte Österreich 1:500 000“** – **ein Blatt** für ganz Österreich, jährliche Neuausgabe im **März** (**Ausgabe 2026 gültig ab 19.03.2026**). PDF kostenlos, Druckausgabe ca. 19,90 € [prüfen]. Änderungen während des Jahres: **AIP Austria**, **AIC**, **NOTAM**. Ergänzend: **VFR Pilotfolder Austria** (Frequenzen, Verfahren) und Sichtanflugkarten in der **eAIP** (AD 2).
- Für Flüge nach Ungarn, Slowenien oder Kroatien brauchst du zusätzlich die **ICAO-Karten der Nachbarländer** (bzw. eine aktuelle Moving Map mit deren Lufträumen).
- Inhalte (Legende auf der Karte beachten!):
  - **Topografie:** Höhenschichten (Farbtöne), **Geländehöhen in ft MSL** (in Österreich bis über 12 000 ft!), Städte, Straßen, Bahnlinien, Flüsse, Seen, Wald, **Pässe** mit Passhöhe.
  - **Luftfahrthindernisse:** Höhe der Spitze **über MSL**, in Klammern die **Höhe über Grund**, z. B. „1650 (590)“. **Seilbahnen und Materialseilbahnen** im Gebirge besonders beachten.
  - **Flugplätze:** Symbol nach Art (Flughafen, Flugfeld/Zivilflugplatz, Militär, Hubschrauber, Segelflug), mit **Name, ICAO-Ortskennung (z. B. LOGF), Elevation (ft), Pistenlänge/-richtung, Frequenz**. Beispiel **Fürstenfeld LOGF: 830 ft, RWY 12/30, 122,705**.
  - **Lufträume:** Kontrollzonen (Luftraum D-CTR, z. B. Graz), CTA/TMA (D), Luftraum E, G, **RMZ**, **TMZ**, **LOR** (Flugbeschränkungsgebiete), **LOD** (Gefahrengebiete), **LOP** (Sperrgebiete), militärische Zonen (MCTR/MTMA), militärische Tiefflugstrecken.
  - **Höhenangaben von Lufträumen:** als Bruch **Obergrenze / Untergrenze**, z. B. „FL 195 / 5500“ oder „4500 / 1000 GND“. Angaben ohne Zusatz in **ft MSL**, „ft GND“ ausdrücklich bezeichnet.
  - **FIS-Sektoren** mit Frequenzen („**Wien Information**“).
  - **VFR-Meldepunkte:** **Pflichtmeldepunkt = ausgefülltes Dreieck**, **Meldepunkt nach Bedarf = offenes Dreieck**.
  - **Funknavigationsanlagen:** VOR, VOR/DME, DME, NDB mit **Name, Frequenz, Kennung (Morsecode)**; VOR mit Kompassrose (ausgerichtet nach **missweisend Nord**).
  - **Isogonen** mit Missweisung, Gradnetz (Breiten- und Längengrade mit Minutenteilung).
- Zusätzlich für Anflüge: **Sichtanflugkarten** und Flugplatzkarten in der **eAIP Austria (AD 2)**, z. B. für LOGF mit Platzrunde Nord und den Meldepunkten AK, TH, GZ, JO.

> **Prüfungstipp:** Viele ECQB-Kartenaufgaben fragen: „Welche Luftraumklasse gilt über Punkt X in 3500 ft?“, „Wie hoch ist das Hindernis bei …?“, „Welche Frequenz hat Platz …?“, „Wie groß ist der rwK/die Entfernung von A nach B?“ – genau hinsehen: **ft MSL vs. AGL vs. FL**.

### 5.4 Kartenvorbereitung

1. Kurslinie ziehen (Start → Wendepunkte → Ziel).
2. **Kursmarken alle 10 NM** oder Zeitmarken (z. B. alle 5 min).
3. rwK am **Mittelmeridian** messen, Entfernung messen.
4. **Sicherheitsmindesthöhe** pro Teilstrecke festlegen (höchstes Hindernis/Gelände im Korridor + 1000 ft).
5. Lufträume, LOR/LOD/LOP, militärische Tiefflugstrecken, Frequenzen, markante Auffanglinien (Autobahn, Fluss, Bahn) und Ausweichplätze markieren.

---

## 6. Geschwindigkeiten

### 6.1 Geschwindigkeitsarten

| Kürzel | Bezeichnung | Bedeutung |
|---|---|---|
| **IAS** | angezeigte Fluggeschwindigkeit | Anzeige des Fahrtmessers |
| **CAS** | berichtigte Fluggeschwindigkeit | IAS + Einbau-/Instrumentenfehler (POH-Tabelle) |
| **TAS** | wahre Eigengeschwindigkeit | Geschwindigkeit gegenüber der Luftmasse |
| **GS** | Grundgeschwindigkeit | Geschwindigkeit über Grund (TAS ± Wind) |

### 6.2 TAS berechnen

- **Faustregel:** **TAS ≈ CAS + 2 % pro 1000 ft** (Druck-)Höhe.
- Genau: Navigationsrechner mit Druckhöhe und Außentemperatur (Fenster „Airspeed“).
- **Wärmer als ISA → TAS höher**, kälter → niedriger.

#### Rechenbeispiel TAS
CAS 100 kt in 6000 ft.
Faustregel: 100 × (1 + 6 × 0,02) = **112 kt**.
Navigationsrechner (ISA-Temperatur): ca. **109 kt** – die Faustregel liegt leicht zu hoch, reicht aber für die Prüfung meist als Plausibilitätskontrolle.

---

## 7. Das Winddreieck

### 7.1 Vektoren

Das Winddreieck besteht aus drei Vektoren:

1. **Luftvektor:** rwSK und TAS (wohin das Flugzeug durch die Luft fliegt),
2. **Windvektor:** Windrichtung (woher!) und Windgeschwindigkeit,
3. **Grundvektor:** rwK/KüG und GS (Resultierende über Grund).

- **Windrichtungen** in METAR/TAF und Höhenwindkarten sind **rechtweisend** und geben an, **woher** der Wind kommt. ATIS/Tower-Wind ist **missweisend**.
- **Abdrift (drift):** Winkel zwischen rwSK und tatsächlichem Kurs über Grund (ohne Vorhalt).
- **Luvwinkel (WCA):** Winkel, um den man gegen den Wind vorhält, damit Kurs über Grund = gewünschter Kurs.

### 7.2 Rechnerische Lösung

Windwinkel: \( \alpha = \text{Windrichtung} - \text{rwK} \)

\[ \text{Seitenwind } XW = V_W \cdot \sin\alpha \qquad \text{Gegenwind } HW = V_W \cdot \cos\alpha \]

\[ \sin(\text{WCA}) = \frac{XW}{TAS} \qquad GS = TAS \cdot \cos(\text{WCA}) - HW \]

(α positiv = Wind von rechts → WCA nach rechts/positiv; HW negativ = Rückenwind.)

### 7.3 Faustformeln (Kopfrechnen)

- **Maximaler Luvwinkel:** \( \text{WCA}_{max} \approx \dfrac{V_W \times 60}{TAS} \)
- **Tatsächlicher Luvwinkel:** \( \text{WCA} \approx \text{WCA}_{max} \times \sin\alpha \) (mit der „Uhrmethode“: 30° = ½, 45° ≈ 0,7, 60° ≈ 0,9)
- **GS ≈ TAS − HW** (cos-WCA-Anteil bei kleinen Winkeln vernachlässigbar)

### 7.4 Durchgerechnetes Beispiel

**Gegeben:** rwK = 072°, Strecke 54 NM, TAS = 110 kt, Wind 030°/20 kt (rechtweisend), MW = 3° E, Dev = +1°, Verbrauch 30 l/h.

1. Windwinkel α = 030° − 072° = **−42°** → Wind von **links vorne**.
2. XW = 20 × sin 42° = 20 × 0,669 ≈ **13,4 kt** (von links)
3. HW = 20 × cos 42° = 20 × 0,743 ≈ **14,9 kt** Gegenwind
4. WCA = arcsin(13,4 / 110) = arcsin(0,122) ≈ **7°** nach links → **−7°**
   (Faustformel: 20 × 60 / 110 ≈ 10,9° × 0,67 ≈ 7,3° ✔)
5. rwSK = 072° − 7° = **065°**
6. GS = 110 × cos 7° − 14,9 = 109,2 − 14,9 ≈ **94 kt**
7. mwSK = 065° − 3° = **062°**; KSK = 062° − 1° = **061°**
8. Flugzeit = 54 / 94 h = 0,574 h ≈ **35 min**
9. Kraftstoff = 35/60 × 30 ≈ **17,5 l**
10. mwK für Halbkreisflugregel = 072° − 3° = 069° → oberhalb 3000 ft AGL ungerade + 500 ft (z. B. **3500 ft / 5500 ft**).

### 7.5 Mit dem Navigationsrechner (Windseite, Prinzip)

1. Windrichtung unter die Ablesemarke (TRUE INDEX) drehen, Windpunkt (Windgeschwindigkeit) über der Mitte markieren.
2. rwK unter die Ablesemarke drehen.
3. Schieber so einstellen, dass der Windpunkt auf dem TAS-Kreis liegt.
4. WCA (seitlicher Abstand des Windpunktes) und GS (Mittelpunkt) ablesen.

> **Prüfungsfalle:** Wind **„aus“** einer Richtung – ein Wind 270° kommt **aus Westen** und schiebt nach Osten. Bei Wind von links ist der Steuerkurs **kleiner** als der Kurs.

### 7.6 Rückwärtsrechnung: Wind bestimmen

Gegeben rwSK, TAS, tatsächlicher KüG und GS (aus Standortbestimmungen) → Wind ermitteln (Navigationsrechner). Typische Aufgabe: „rwSK 180°, TAS 100 kt, KüG 172°, GS 90 kt – welcher Wind?“ → Abdrift 8° nach links (Wind von rechts/West), GS < TAS → Gegenwindanteil; Lösung ca. **230°/17 kt** (Rechner bzw. Vektorrechnung).

---

## 8. Navigationsflugplan (Flight Log) und Koppelnavigation

### 8.1 Aufbau des Flight Logs

| Von–Nach | Sicherheitshöhe | Flughöhe | rwK | Wind | WCA | rwSK | MW | mwSK | Dev | KSK | TAS | GS | Dist | Zeit | Kraftstoff | ETO/ATO | Frequenzen |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

- **ETO** (Estimated Time Over) / **ATO** (Actual Time Over) je Wegpunkt.
- Steig- und Sinkflugstrecken getrennt berücksichtigen (geringere GS im Steigflug).

### 8.2 Koppelnavigation (Dead Reckoning, DR)

- Position aus **Steuerkurs, Geschwindigkeit, Zeit und Wind** errechnen; durch **Kartenlesen** bestätigen.
- **Kartenlesen:** Von der Karte zum Gelände („Karte → Boden“) erwarten, was kommt; große, eindeutige Merkmale (Autobahnkreuze, Seen, Flussschleifen, Städte mit Form, Sendemasten). **Auffanglinien (Catch features)** und **Begrenzungslinien** nutzen.
- Karte **in Flugrichtung** halten (genordet nach Flugrichtung).

### 8.3 Die 1:60-Regel

Eine Ablage von 1 NM nach 60 NM entspricht ca. **1°**.

\[ \text{Kursfehler (TE)} = \frac{\text{Ablage} \times 60}{\text{geflogene Strecke}} \qquad \text{Zurückführwinkel (CA)} = \frac{\text{Ablage} \times 60}{\text{Reststrecke}} \]

- **Kursänderung, um das Ziel direkt anzufliegen = TE + CA.**
- **Kursänderung, um zur Kurslinie zurückzukehren (in gleicher Strecke) = 2 × TE**, nach Erreichen der Linie TE wieder herausnehmen.

#### Rechenbeispiel 1:60
Nach **24 NM** befindest du dich **2 NM rechts** der Kurslinie; Reststrecke **36 NM**.
- TE = 2 × 60 / 24 = **5°**
- CA = 2 × 60 / 36 ≈ **3,3°**
- Kursänderung direkt zum Ziel: 5° + 3° ≈ **8° nach links**.
- Neuer Steuerkurs = alter Steuerkurs − 8°.

### 8.4 ETA-Berichtigung

#### Rechenbeispiel ETA
Geplant GS 94 kt. Tatsächlich: Abflugpunkt 10:12 UTC, Wegpunkt 24 NM später um 10:29 UTC → 17 min.
- Tatsächliche GS = 24 / 17 × 60 ≈ **85 kt**
- Reststrecke 30 NM → 30 / 85 × 60 ≈ **21 min** → **neue ETA 10:50 UTC**.

### 8.5 Ausweichen (Diversion)

1. Entscheidung früh treffen (Wetter, Kraftstoff, Tageslicht, Krankheit).
2. **Sofort grob in Richtung Ausweichziel drehen** (Kurs schätzen), dann genau messen.
3. Entfernung, Zeit und Kraftstoff berechnen (Faustformeln), Höhe prüfen (Gelände, Lufträume).
4. FIS/ATC informieren, Flugplan ändern.

> **Faustformel für Zeit:** Bei GS 90 kt fliegt man **1,5 NM pro Minute**, bei 120 kt **2 NM/min**, bei 60 kt **1 NM/min**.

### 8.6 Orientierungsverlust

- Ruhe bewahren, **Kurs und Höhe halten** bzw. auf sicherer Höhe kreisen, Zeit notieren.
- **Wahrscheinlichkeitskreis** um die Koppelposition schlagen und nach großen Merkmalen suchen.
- Funknavigation/GNSS nutzen, **FIS um Hilfe bitten** (Peilung/Radar). Mit Kraftstoff, Tageslicht und Wetter rechnen – ggf. Sicherheitslandung.

---

## 9. Vertikale Navigation

### 9.1 Höhenmessereinstellungen

| Einstellung | Anzeige | Verwendung |
|---|---|---|
| **QNH** | Höhe über MSL (Altitude) | unterhalb der Übergangshöhe, Flugplätze, Hindernisse |
| **QFE** | Höhe über Flugplatz (Height) | Platzrunde (in Österreich selten) |
| **1013,25 hPa (Standard)** | Flugfläche (FL) | oberhalb der Übergangshöhe |

- **Übergangshöhe (Transition Altitude, TA)** in Österreich: **10 000 ft AMSL** (FIR Wien, Ausnahme im Raum Innsbruck lt. AIP). Darunter **QNH**, darüber Flugflächen. (Zum Vergleich Deutschland: 5000 ft MSL bzw. 2000 ft AGL.)
- **Übergangsfläche (Transition Level, TL):** niedrigste nutzbare Flugfläche über der TA (abhängig vom QNH).
- **„Vom Hoch ins Tief geht schief“** (Höhenmesser zeigt zu viel), Kälte ebenfalls → im Winter und bei Tiefdruck mehr Abstand halten.

#### Rechenbeispiel Flugfläche
QNH 998 hPa. Wie hoch über MSL ist FL 55? (In Österreich fliegst du in dieser Höhe zwar mit QNH – die Rechnung wird aber geprüft.)
FL 55 = 5500 ft Druckhöhe; QNH liegt 15 hPa unter Standard → wahre Höhe ≈ 5500 − 15 × 30 = **5050 ft MSL**.

### 9.2 Sicherheitsmindesthöhen

- **SERA.5005(f):** über Städten/Menschenansammlungen **1000 ft** über dem höchsten Hindernis im Umkreis von **600 m**, sonst **500 ft** über Grund/Wasser.
- **Planungsfaustregel:** höchstes Hindernis im Korridor (z. B. 5 NM beidseits) **+ 1000 ft**, im Gebirge mehr (mind. **2000 ft**, Talflüge nur mit Umkehrmöglichkeit).

### 9.3 Halbkreisflugregel (SERA Anlage 3)

Oberhalb **3000 ft AGL**, nach **missweisendem Kurs über Grund (mwK)**:
- **000°–179°:** ungerade Tausender + 500 ft (3500, 5500, 7500 ft; FL 55, 75 …)
- **180°–359°:** gerade Tausender + 500 ft (4500, 6500, 8500 ft; FL 65, 85 …)

### 9.4 Steig- und Sinkflugplanung

- **Sinkstrecke = GS × Sinkzeit**, Sinkzeit = Höhendifferenz / Sinkrate.
- **3°-Pfad ≈ 300 ft/NM**; Sinkrate ≈ **5 × GS**.

#### Rechenbeispiel Sinkflug
Von 4500 ft auf 1500 ft, GS 100 kt, Sinkrate 500 ft/min.
Sinkzeit = 3000/500 = 6 min → Strecke = 100 × 6/60 = **10 NM** vor dem Platz beginnen.

---

## 10. Lufträume aus Navigationssicht (Kurzüberblick)

- Lufträume Österreich: **C, D (inkl. CTR), E, G** sowie **RMZ** und **TMZ** (Details: Skript Luftrecht). Rund um LOGF: westlich die **TMA/CTR Graz**, östlich die **ungarische Grenze** (ca. 15 km) [prüfen].
- **Luftraumverletzungen vermeiden:** Puffer zu Luftraumgrenzen (seitlich ca. 1–2 NM, vertikal 200–500 ft), GNSS-Moving-Map mit aktuellen Luftraumdaten, Höhenmessereinstellung prüfen, **FIS** nutzen, Transponder ALT einschalten (7000).
- Freigabepflicht in **C** und **D**; Einflug **nicht ohne ausdrückliche Freigabe**. Bei Unsicherheit: außen herum fliegen oder rechtzeitig Freigabe anfordern.

---

## 11. Funknavigation

### 11.1 Q-Gruppen (Peilbegriffe)

| Begriff | Bedeutung | Bezug |
|---|---|---|
| **QDM** | **missweisender Kurs ZUR Station** (bei Windstille = mwSK) | magnetisch, zur Station |
| **QDR** | **missweisende Peilung VON der Station** (= Radial) | magnetisch, von der Station |
| **QUJ** | rechtweisender Kurs ZUR Station | rechtweisend, zur Station |
| **QTE** | **rechtweisende Peilung VON der Station** | rechtweisend, von der Station |

- **QDR = QDM ± 180°**, **QTE = QUJ ± 180°**.
- **QTE = QDR + MW (E)** bzw. − MW (W).

> **Eselsbrücke:** „**QDM – D wie ‚Dahin, magnetisch‘**; **QDR – R wie ‚Radial‘ (weg)**; **QTE – T wie ‚True, weg‘**; **QUJ – ‚U jump to station, true‘**.“
> Für die Karte (Standlinie zeichnen) brauchst du **QTE**, weil die Karte rechtweisend ist.

### 11.2 UKW-Peiler (VDF)

- Bodenstation peilt die Sprechfunkaussendung des Flugzeugs und gibt QDM/QDR/QTE/QUJ.
- **Genauigkeitsklassen:** **A = ±2°**, **B = ±5°**, **C = ±10°**.
- Reichweite: **quasioptisch (Sichtlinie)**. In Österreich nur noch eingeschränkt verfügbar [prüfen].

### 11.3 Radar

- **Primärradar (PSR):** Echo vom Flugzeug selbst; keine Kennung/Höhe; Störung durch Wetter/Gelände.
- **Sekundärradar (SSR):** Abfrage 1030 MHz, Antwort des Transponders 1090 MHz; Mode A (Code), Mode C (Druckhöhe), Mode S (selektiv, Kennung, Daten).
- **Transpondercodes:** **7000** (VFR-Standard), **7700** Notfall, **7600** Funkausfall, **7500** widerrechtlicher Eingriff.
- FIS kann **Verkehrsinformationen** geben und bei Orientierungsverlust helfen; VFR-Piloten bleiben für Navigation und Hindernisfreiheit verantwortlich.

### 11.4 NDB und ADF

- **NDB (Non-Directional Beacon):** ungerichtetes Funkfeuer im **LF/MF-Bereich (ca. 190–1750 kHz)**, Kennung im Morsecode (2–3 Buchstaben), **Bodenwelle** → Reichweite auch hinter dem Horizont.
- **ADF (Automatic Direction Finder):** Bordgerät, zeigt die **Seitenpeilung (Relative Bearing, RB)** – Winkel von der Flugzeuglängsachse (Nase) im Uhrzeigersinn zum Sender.

\[ \text{QDM} = \text{mwSK} + \text{RB} \qquad (\text{ggf. } -360°) \]

- **RMI (Radio Magnetic Indicator):** Nadelspitze zeigt direkt das **QDM**, Nadelende das **QDR**.

**Fehler des NDB/ADF:**

| Fehler | Ursache |
|---|---|
| **Nachteffekt (night effect)** | Raumwelle wird nachts reflektiert und interferiert mit der Bodenwelle (besonders in der Dämmerung) |
| **Küsteneffekt (coastal refraction)** | Brechung beim Übergang Land/Wasser – flacher Winkel = größter Fehler |
| **Gebirgseffekt** | Reflexion an Bergen |
| **Gewittereffekt** | Nadel zeigt zu Blitzentladungen/Gewitterzellen |
| **Quadrantenfehler** | Reflexion an der Flugzeugzelle |
| **Querneigungsfehler** | Antennengeometrie in der Kurve – nur im Geradeausflug ablesen |

- Keine TO/FROM-Anzeige, kein Warnflag bei falschem Empfang → **Kennung immer abhören (Ident)**.
- NDBs werden europaweit zunehmend abgebaut (Prüfungsstoff bleibt).

#### Rechenbeispiel ADF
mwSK 040°, RB 330° → QDM = 040° + 330° = 370° − 360° = **010°**; QDR = **190°**.
Bei MW 3° E: QTE = 190° + 3° = **193°** (diese Standlinie wird von der Station aus in die Karte gezeichnet).

**Homing vs. Tracking:**
- **Homing:** Nadel immer auf der Nase halten (RB 0°) → bei Seitenwind gekrümmte „Hundekurve“.
- **Tracking:** Luvwinkel vorhalten, damit ein konstanter Kurs (QDM) über Grund geflogen wird.

### 11.5 VOR (VHF Omnidirectional Radio Range)

- Frequenz **108,00–117,95 MHz** (UKW), Kennung im Morsecode (3 Buchstaben).
- Prinzip: Phasenvergleich zwischen **Bezugssignal** (in allen Richtungen gleich) und **umlaufendem Richtsignal** → **Radial**.
- **Radial = missweisende Richtung VON der Station (QDR).** 360 Radiale.
- **Reichweite quasioptisch** (Sichtlinie):

\[ D\ (\text{NM}) \approx 1{,}23 \times \left(\sqrt{h_{Flz}} + \sqrt{h_{Station}}\right) \quad (h \text{ in ft}) \]

#### Rechenbeispiel VOR-Reichweite
Flughöhe 4900 ft über Stationsniveau, Antennenhöhe vernachlässigt: D ≈ 1,23 × √4900 = 1,23 × 70 ≈ **86 NM**.
In 2500 ft: 1,23 × 50 ≈ **62 NM**.

**Bordanzeige (CDI/OBI):**
- **OBS (Kurswähler):** gewünschten Kurs einstellen.
- **CDI-Nadel:** Ablage vom gewählten Kurs; typisch **5 Punkte (dots) Vollausschlag = 10°**, also **2° pro Punkt**.
- **TO/FROM-Anzeige:** zeigt, ob der eingestellte Kurs **zur** oder **von** der Station führt – **unabhängig vom Steuerkurs** des Flugzeugs!
- **Flagge (OFF/NAV)** bei unzuverlässigem Signal.
- **Kegel der Verwirrung (cone of confusion):** über der Station kein verlässliches Signal, TO/FROM wechselt.
- **Umgekehrte Anzeige (reverse sensing):** Wenn man z. B. mit TO-Anzeige von der Station wegfliegt – Nadel zeigt in die falsche Richtung. Immer **OBS ≈ Steuerkurs** einstellen.

> **Merksatz:** „**Das VOR weiß nicht, wohin die Nase zeigt.**“ Es zeigt nur, auf welchem Radial man sich befindet.

#### Rechenbeispiel VOR
Du befindest dich auf dem **Radial 120** der Station. Welches QDM fliegst du zur Station?
QDM = 120° + 180° = **300°**. Mit OBS 300° zeigt das Gerät **TO** und die Nadel ist mittig.
Mit OBS 120° zeigt es **FROM** (Nadel mittig, aber bei Anflug zur Station reverse sensing).

**Genauigkeit:** Bodenstation ca. ±2°, Gesamtsystem ca. ±5°. **DVOR** (Doppler-VOR) ist genauer und weniger standortempfindlich.

**Fehlerquellen:** Standortfehler (Gelände, Gebäude), Ausbreitungsfehler (Reflexionen im Gebirge – „scalloping“), Propellermodulation bei bestimmten Drehzahlen, Sichtlinie (zu tief → kein Empfang).

### 11.6 DME (Distance Measuring Equipment)

- **UHF 962–1213 MHz**, meist mit VOR gekoppelt (**VOR/DME**, Frequenzpaarung – man wählt die VOR-Frequenz).
- Bordgerät sendet Abfrageimpulse, Bodenstation antwortet nach fester Verzögerung → **Laufzeitmessung**.
- Zeigt die **Schrägentfernung (slant range)** in NM, nicht die Horizontalentfernung; daraus abgeleitet GS und Zeit zur Station (nur korrekt bei direktem An-/Abflug).
- **Schrägentfernungsfehler** am größten **nahe/über der Station**: Über der Station in 6000 ft zeigt das DME ca. **1 NM** (6000 ft ≈ 1 NM).
- Faustregel: Fehler vernachlässigbar, wenn die Entfernung in NM **größer als die Höhe in 1000 ft** ist.
- Genauigkeit ca. ±0,25 NM + 1,25 % (moderne Geräte besser); Sichtlinienreichweite.

#### Rechenbeispiel DME
Flughöhe 9000 ft über Station (≈ 1,5 NM), DME zeigt 2,5 NM.
Horizontalentfernung = √(2,5² − 1,5²) = √(6,25 − 2,25) = √4 = **2 NM**.

### 11.7 GNSS (Global Navigation Satellite System)

**Systeme:** **GPS** (USA), **GLONASS** (Russland), **Galileo** (EU), **BeiDou** (China).

**Aufbau GPS:**
- **Weltraumsegment:** mind. 24 Satelliten (aktuell ca. 31) in 6 Bahnebenen, Höhe ca. **20 200 km**, Umlaufzeit ca. 12 h.
- **Kontrollsegment:** Bodenstationen überwachen Bahnen und Uhren.
- **Nutzersegment:** Empfänger im Flugzeug.

**Prinzip:** Laufzeitmessung der Signale (Pseudoentfernungen).
- **3 Satelliten** → 2D-Position (theoretisch, mit Höhenannahme);
- **mindestens 4 Satelliten** → **3D-Position und Zeit** (vierter Satellit gleicht den Uhrenfehler des Empfängers aus).
- **RAIM** (Receiver Autonomous Integrity Monitoring): Integritätsüberwachung im Empfänger, benötigt **mindestens 5 Satelliten** (Fehlererkennung), **6** zum Ausschluss eines fehlerhaften Satelliten (FDE).

**Fehlerquellen:**

| Fehler | Bemerkung |
|---|---|
| **Ionosphärische Laufzeitverzögerung** | **größter natürlicher Fehler**, durch Zweifrequenzempfang/SBAS korrigierbar |
| Troposphärische Verzögerung | Wetter, Feuchte |
| Satellitenuhr- und Bahnfehler (Ephemeriden) | |
| **Mehrwegeempfang (multipath)** | Reflexionen an Gebäuden/Gelände |
| **Satellitengeometrie (DOP)** | schlechte Verteilung der Satelliten → ungenauer |
| Empfängerrauschen | gering |
| **Störung (jamming) und Täuschung (spoofing)** | zunehmendes Problem (z. B. Ostsee-/Osteuropa-Raum, militärische Übungen – NOTAM beachten) |
| Antennenabschattung | Querneigung, Flügel, Rumpf |

- **SBAS** (Satellite-Based Augmentation System) in Europa: **EGNOS** – verbessert Genauigkeit und Integrität.
- Genauigkeit ohne Augmentation typisch wenige Meter horizontal; vertikal schlechter.

**Betriebliche Hinweise VFR:**
- GNSS ist eine **Navigationshilfe**; die terrestrische Navigation (Karte, Uhr, Kompass) muss beherrscht und **parallel geführt** werden.
- **Datenbank aktuell** halten (AIRAC-Zyklus 28 Tage), Luftraumdaten prüfen.
- **Falsche Wegpunkteingabe** ist eine häufige Fehlerquelle – Plausibilität mit Karte prüfen.
- Gefahr der **Fixierung** (Head-down, Luftraumbeobachtung leidet), Verlass auf GNSS führt zu Luftraumverletzungen bei Ausfall.
- Bei Signalverlust/Warnung: sofort auf Koppelnavigation und Kartenlesen übergehen.
- Moving-Map-Apps (z. B. SkyDemon, Air Navigation Pro auf Tablets) sind erlaubt, ersetzen aber nicht die vorgeschriebene **aktuelle Karte**.

---

## 12. Typische Prüfungsfallen

1. **Kurs in der Karte am Meridian der Streckenmitte messen** – das Ergebnis ist **rechtweisend**.
2. **„Ost weg, West dazu“** beim Übergang von rechtweisend nach missweisend.
3. **Wind kommt „aus“** der angegebenen Richtung; METAR-Wind rechtweisend, ATIS-Wind missweisend.
4. Wind von links → Steuerkurs **kleiner** als Kurs.
5. **1 NM = 1,852 km**, **1° Breite = 60 NM**; Abstand zwischen Längengraden × cos φ.
6. **UTC = MESZ − 2 h, MEZ − 1 h**.
7. **Halbkreisflugregel nach mwK** (missweisender Kurs, nicht Steuerkurs).
8. Hindernisse: **erste Zahl MSL, Zahl in Klammern AGL**.
9. **Radial = QDR** (von der Station, missweisend). Für die Karte braucht man **QTE**.
10. Das VOR-Instrument ist **steuerkursunabhängig**; TO/FROM bezieht sich auf den eingestellten Kurs.
11. **DME misst Schrägentfernung**; größter Fehler über der Station.
12. **NDB-Nachteffekt** in der Dämmerung am stärksten; NDB-Nadel zeigt zu Gewittern.
13. **GNSS: 4 Satelliten für 3D**, **5 für RAIM**; größter Fehler: **Ionosphäre**.
14. 1:60-Regel: Direktkurs zum Ziel = TE + CA (nicht nur TE).
15. **TAS > IAS** in der Höhe (≈ +2 %/1000 ft).

---

## 13. Formelsammlung

| Formel | Anwendung |
|---|---|
| 1′ Breite = 1 NM; 1° = 60 NM | Entfernung auf Meridian |
| Abstand = Δλ′ × cos φ | Entfernung auf Breitenkreis |
| 15° = 1 h, 1° = 4 min | Zeit/Länge |
| rwK ± WCA = rwSK; −MW(E)/+MW(W) = mwSK; −Dev(+) = KSK | Kursumrechnung |
| XW = V_W·sin α, HW = V_W·cos α | Windkomponenten |
| sin WCA = XW/TAS; GS = TAS·cos WCA − HW | Winddreieck |
| WCA_max ≈ V_W × 60 / TAS | Faustformel Luvwinkel |
| TAS ≈ CAS × (1 + 0,02 × H/1000 ft) | Faustformel TAS |
| TE = Ablage × 60 / geflogen; CA = Ablage × 60 / Rest | 1:60-Regel |
| Zeit = Dist / GS × 60 (min) | Flugzeit |
| QDM = mwSK + RB | ADF |
| QDR = QDM ± 180°; QTE = QDR + MW(E) | Peilungen |
| D ≈ 1,23 × (√h₁ + √h₂) NM | UKW-Reichweite |
| horiz. Entfernung = √(DME² − Höhe²) | DME-Schrägentfernung |
| 3°-Pfad ≈ 300 ft/NM, ROD ≈ 5 × GS | Sinkflug |
| 1:500 000 → 1 cm = 5 km ≈ 2,7 NM | Maßstab |

---

## 14. Kurz-Zusammenfassung

- Die Erde wird als Kugel mit Gradnetz behandelt; 1 Breitenminute = 1 NM. Großkreis = kürzester Weg, Loxodrome = konstanter Kurs.
- Kurse werden in der Karte rechtweisend gemessen und über WCA, Missweisung und Deviation in den Kompasssteuerkurs umgerechnet.
- Luftfahrtzeit ist UTC; Nacht beginnt mit dem Ende der bürgerlichen Abenddämmerung.
- Die ICAO-Karte 1:500 000 (Lambert, winkeltreu) zeigt Topografie, Hindernisse (MSL/AGL), Flugplätze, Lufträume (Ober-/Untergrenze), Meldepunkte und Funknavigationsanlagen.
- Das Winddreieck liefert Luvwinkel und Grundgeschwindigkeit; Faustformeln dienen der Kontrolle.
- Im Flug: Koppeln und Kartenlesen, 1:60-Regel zur Korrektur, ETA anpassen, früh ausweichen.
- Funknavigation: VDF (QDM/QDR), NDB/ADF (Seitenpeilung, viele Fehler), VOR (Radiale, Sichtlinie), DME (Schrägentfernung), GNSS (≥ 4 Satelliten, RAIM ≥ 5, Ionosphäre, Jamming) – alles Hilfsmittel, die terrestrische Navigation bleibt Pflicht.

---

## 15. Kontrollfragen

1. Wie groß ist die Entfernung zwischen N 51°10′ E 007°00′ und N 51°10′ E 009°00′?
2. Wie viel Uhr UTC ist es, wenn in Fürstenfeld im Juli 14:45 Uhr Ortszeit (MESZ) ist?
3. rwK 245°, Wind 200°/25 kt, TAS 100 kt, MW 2° E. Berechne WCA, rwSK, mwSK und GS.
4. Welche Reiseflughöhen sind bei einem mwK von 195° oberhalb 3000 ft AGL zu wählen?
5. Auf der ICAO-Karte 1:500 000 misst du 8,4 cm. Wie viele NM sind das?
6. Was bedeutet die Hindernisangabe „1420 (380)“ in der ICAO-Karte?
7. Nach 30 NM bist du 3 NM links der Kurslinie; Reststrecke 45 NM. Um wie viel Grad und in welche Richtung musst du den Kurs ändern, um das Ziel direkt anzufliegen?
8. mwSK 300°, ADF-Seitenpeilung (RB) 090°. Wie groß ist das QDM, wie groß das QDR?
9. Du befindest dich auf dem Radial 045 eines VOR. Welchen Kurs stellst du am OBS ein, um mit zentrierter Nadel und TO-Anzeige zur Station zu fliegen?
10. Wie groß ist die theoretische VOR-Empfangsreichweite in 3600 ft über Stationshöhe?
11. Wie viele Satelliten benötigt ein GPS-Empfänger für eine 3D-Position, und wie viele für RAIM?
12. Was ist der größte natürliche Fehler bei GNSS, und welches europäische System verbessert die Genauigkeit?
13. Warum zeigt das DME über der Station in 6000 ft etwa 1 NM an?

### Lösungen

1. Δλ = 2° = 120′; Abstand = 120 × cos 51°10′ ≈ 120 × 0,627 ≈ **75 NM**.
2. MESZ = UTC + 2 → **12:45 UTC**.
3. α = 200° − 245° = −45° (Wind von links vorne). XW = 25 × sin 45° ≈ 17,7 kt; HW = 25 × cos 45° ≈ 17,7 kt.
   WCA = arcsin(17,7/100) ≈ **10° links (−10°)** → rwSK = **235°**; mwSK = 235° − 2° = **233°**;
   GS = 100 × cos 10° − 17,7 ≈ 98,5 − 17,7 ≈ **81 kt**.
4. mwK 180°–359° → **gerade Tausender + 500 ft**: 4500 ft, 6500 ft, 8500 ft (bzw. FL 45, 65, 85).
5. 8,4 × 5 km = 42 km → 42 / 1,852 ≈ **22,7 NM**.
6. Hindernisspitze **1420 ft MSL**, Hindernis **380 ft hoch über Grund**.
7. TE = 3 × 60 / 30 = 6°; CA = 3 × 60 / 45 = 4° → **10° nach rechts**.
8. QDM = 300° + 090° = 390° − 360° = **030°**; QDR = **210°**.
9. QDM = 045° + 180° = **225°** am OBS einstellen → TO-Anzeige, Nadel mittig.
10. D ≈ 1,23 × √3600 = 1,23 × 60 ≈ **74 NM**.
11. **4 Satelliten** für 3D-Position (und Zeit), **mindestens 5** für RAIM (6 für Fehlerausschluss/FDE).
12. Die **ionosphärische Laufzeitverzögerung**; **EGNOS** (SBAS).
13. Weil das DME die **Schrägentfernung** misst: 6000 ft ≈ 1 NM senkrecht über der Station.

---

## Quellen

- EASA, *Easy Access Rules for Aircrew* – FCL.215, AMC1 FCL.210; FCL.215 (Syllabus Navigation) – https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-aircrew-regulation-eu-no
- UK CAA, *CAP 1298 – PPL(A) Syllabus* (Navigation, VFR Radio Navigation, GNSS) – https://www.caa.co.uk/data-and-publications/publications/documents/content/cap1298/
- Austro Control, *ICAO-Karte Österreich 1:500 000, Ausgabe 2026* und *VFR Pilotfolder Austria 2026* – https://www.austrocontrol.at/piloten
- Austro Control, *eAIP Austria* (ENR 1.7 Übergangshöhe, AD 2 LOGF) – https://eaip.austrocontrol.at/
- EASA, *Easy Access Rules for SERA* (SERA.5005, Anlage 3 Reiseflughöhen, Definition Nacht) – https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-standardised-european-rules-air-sera
- FAA, *Pilot’s Handbook of Aeronautical Knowledge (FAA-H-8083-25C)*, Kap. 16 Navigation – https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak
- EUSPA, *EGNOS* – https://www.euspa.europa.eu/eu-space-programme/egnos
- Aircademy, *ECQB-PPL* (Lernziele, Beispielfragen, Anlagenhandbuch mit Navigationskarten) – https://aircademy.com/de/ecqb-ppl/
- Austro Control, *Theorieprüfung PPL/LAPL – Fächer, Fragenanzahl, Zeiten* (DC_LFA_ACW_034: Navigation 20 Fragen/60 min) – https://www.austrocontrol.at/luftfahrtbehoerde/lizenzen
