# Grundlagen des Fliegens (Principles of Flight) – PPL(A)

> Prüfungsfach nach FCL.215 / AMC1 FCL.210; FCL.215 (ECQB-PPL, Sachgebiet 080 „Principles of Flight“).
> Prüfung bei der **Austro Control** (Fach 50 „Grundlagen des Fliegens“): **12 Fragen, 25 Minuten**, Bestehensgrenze **75 %** je Fach.
> Hinweis: Alle Zahlenwerte für konkrete Flugzeuge stammen immer aus dem Flughandbuch (POH/AFM). Die Werte hier sind Lern- und Rechenbeispiele.

---

## Lernziele

Nach diesem Skript kannst du …

1. die Normatmosphäre (ISA) und die Begriffe statischer, dynamischer und Gesamtdruck erklären,
2. die Entstehung des Auftriebs (Bernoulli, Kontinuität, Umlenkung) und die Auftriebsformel anwenden,
3. die Profilgeometrie (Sehne, Wölbung, Anstellwinkel, Einstellwinkel) benennen,
4. die Widerstandsarten (induziert, parasitär) unterscheiden und die Widerstandskurve deuten,
5. das Kräftegleichgewicht im Horizontal-, Steig-, Sink- und Kurvenflug beschreiben,
6. Überziehen (Stall) und Trudeln erkennen, Einflussgrößen auf die Überziehgeschwindigkeit berechnen,
7. Stabilität um alle drei Achsen und die Wirkung der Ruder, Trimmung und Klappen erklären,
8. Lastvielfache und das V-n-Diagramm (Betriebsgrenzen, Fahrtmesser-Farbmarkierungen) anwenden,
9. Propellereffekte, Bodeneffekt und Wirbelschleppen erklären.

---

## 1. Grundbegriffe und Atmosphäre

### 1.1 ICAO-Standardatmosphäre (ISA)

| Größe | Wert in MSL |
|---|---|
| Luftdruck | 1013,25 hPa (29,92 inHg) |
| Temperatur | +15 °C |
| Luftdichte ρ | 1,225 kg/m³ |
| Temperaturgradient | −6,5 °C/km ≈ **−2 °C pro 1000 ft** bis 11 km (36 090 ft) |
| Druckabnahme (unten) | ca. 1 hPa pro **27–30 ft** |

**Merke:** Mit zunehmender Höhe nehmen Druck, Temperatur und Dichte ab. Weniger Dichte bedeutet weniger Auftrieb, weniger Motorleistung und weniger Propellerschub bei gleicher angezeigter Geschwindigkeit; die wahre Geschwindigkeit (TAS) ist höher.

Warme Luft, hohe Lage und Feuchtigkeit verringern die Dichte („hot, high and humid“ = schlechte Flugleistung).

### 1.2 Drücke

- **Statischer Druck p**: wirkt in alle Richtungen, Druck der ruhenden Luft.
- **Dynamischer Druck (Staudruck) q = ½ · ρ · v²**: Druck aus der Bewegung.
- **Gesamtdruck (Pitotdruck) = p + q**: wird vom Staurohr gemessen.
- Der Fahrtmesser zeigt die Differenz Gesamtdruck − statischer Druck = q, also eine Geschwindigkeit, die auf die ISA-Dichte in MSL kalibriert ist (IAS).

### 1.3 Bernoulli und Kontinuität

- **Kontinuitätsgleichung:** A₁ · v₁ = A₂ · v₂ → In einer Verengung (Venturi) strömt Luft schneller.
- **Bernoulli-Gleichung:** p + ½ρv² = konstant → Wo die Strömung schneller ist, ist der statische Druck kleiner.

> **Merksatz:** „Schnell = wenig Druck, langsam = viel Druck.“

---

## 2. Das Tragflächenprofil

### 2.1 Profilgeometrie

- **Profilsehne (chord):** gerade Verbindung von Profilnase zur Hinterkante.
- **Wölbung (camber)** und **Skelettlinie (mean camber line):** Mittellinie zwischen Ober- und Unterseite.
- **Profildicke:** größter Abstand Ober-/Unterseite (relativ zur Sehne in %).
- **Anstellwinkel α (angle of attack):** Winkel zwischen Profilsehne und **anströmender Luft** (relativer Wind). Wird vom Piloten mit dem Höhenruder gesteuert.
- **Einstellwinkel (angle of incidence):** Winkel zwischen Profilsehne und **Rumpflängsachse**. Konstruktiv festgelegt, nicht veränderbar.
- **Schränkung (washout):** Einstellwinkel nimmt zur Flügelspitze hin ab → Strömungsabriss beginnt an der Flügelwurzel, Querruder bleiben länger wirksam.

> **Prüfungsfalle:** Anstellwinkel ≠ Einstellwinkel ≠ Längsneigung (pitch attitude). Im Steigflug kann die Längsneigung groß, der Anstellwinkel aber klein sein.

### 2.2 Flügelgeometrie

- **Spannweite b**, **Flügelfläche S**
- **Streckung (aspect ratio) Λ = b² / S** – hohe Streckung (Segelflugzeug) = geringer induzierter Widerstand.
- **Zuspitzung (taper)**, **Pfeilung (sweep)**, **V-Stellung (dihedral)**.
- **Flächenbelastung = m / S** (kg/m²) – hohe Flächenbelastung = höhere Überziehgeschwindigkeit, ruhigeres Verhalten in Turbulenz.

### 2.3 Druckverteilung und Druckpunkt

- Auf der Oberseite entsteht Unterdruck (Sog), auf der Unterseite leichter Überdruck. Der **Sog auf der Oberseite liefert den größeren Anteil** am Auftrieb (ca. 2/3).
- **Druckpunkt (centre of pressure, CP):** Angriffspunkt der resultierenden Luftkraft. Bei gewölbten Profilen wandert er mit **zunehmendem Anstellwinkel nach vorne**, bei abnehmendem nach hinten.
- **Neutralpunkt / aerodynamischer Mittelpunkt (≈ 25 % der Sehne):** Punkt, um den das Moment unabhängig vom Anstellwinkel konstant bleibt.

---

## 3. Auftrieb

### 3.1 Auftriebsformel

\[ L = C_L \cdot \tfrac{1}{2} \rho v^2 \cdot S \]

- \(C_L\) = Auftriebsbeiwert (abhängig von Profilform und **Anstellwinkel**)
- \(\rho\) = Luftdichte, \(v\) = Geschwindigkeit (TAS), \(S\) = Flügelfläche

**Konsequenzen:**
- Doppelte Geschwindigkeit → **vierfacher** Auftrieb (bei gleichem Anstellwinkel).
- Um bei geringerer Geschwindigkeit denselben Auftrieb zu erzeugen, muss der Anstellwinkel (C_L) steigen.
- Der Auftrieb wirkt **senkrecht zur Anströmung**, der Widerstand **parallel** dazu.

### 3.2 Auftriebsbeiwert und kritischer Anstellwinkel

- \(C_L\) steigt nahezu linear mit dem Anstellwinkel bis zum **kritischen Anstellwinkel** (typisch ca. **15–18°**).
- Danach löst sich die Strömung auf der Oberseite ab → \(C_{L,max}\) überschritten → **Strömungsabriss (Stall)**.
- **Ein Flügel überzieht immer beim gleichen kritischen Anstellwinkel – unabhängig von Geschwindigkeit, Masse, Fluglage oder Lastvielfachem.**

### 3.3 Grenzschicht

- Dünne Luftschicht an der Oberfläche, in der die Geschwindigkeit von 0 (an der Haut) auf die Außengeschwindigkeit ansteigt.
- **Laminar** (geordnet, wenig Reibung) → **Umschlagpunkt** → **turbulent** (mehr Reibung, aber energiereicher und haftet besser).
- **Ablösung** entsteht durch Druckanstieg zur Hinterkante; Vortex-Generatoren führen Energie zu und verzögern die Ablösung.
- Verschmutzung, Insekten, **Eis, Reif, Schnee** zerstören die Grenzschicht → C_L,max sinkt drastisch, Stall bei kleinerem Anstellwinkel und höherer Geschwindigkeit. **Mit Reif auf den Flügeln niemals starten.**

---

## 4. Widerstand

### 4.1 Widerstandsformel

\[ D = C_D \cdot \tfrac{1}{2}\rho v^2 \cdot S \]

### 4.2 Widerstandsarten

| Art | Entstehung | Abhängigkeit von v |
|---|---|---|
| **Induzierter Widerstand** | Druckausgleich an den Flügelspitzen (Randwirbel), entsteht nur bei Auftrieb | **∝ 1/v²** – groß bei langsamem Flug/hohem α |
| **Parasitärer Widerstand** (schädlicher Widerstand) | Formwiderstand, Reibungswiderstand, Interferenzwiderstand | **∝ v²** – groß bei schnellem Flug |

- Induzierter Widerstandsbeiwert: \(C_{Di} = \dfrac{C_L^2}{\pi \cdot \Lambda \cdot e}\) → große Streckung Λ verringert ihn.
- **Mittel gegen induzierten Widerstand:** hohe Streckung, Winglets, elliptische Auftriebsverteilung, Flügelspitzenformen.
- **Mehr Masse** → mehr erforderlicher Auftrieb → mehr induzierter Widerstand.

### 4.3 Widerstandskurve (Polare)

- Gesamtwiderstand = induzierter + parasitärer Widerstand → U-förmige Kurve.
- **Minimum bei \(V_{md}\)** (minimum drag speed): dort sind induzierter und parasitärer Widerstand **gleich groß**.
- Bei \(V_{md}\) ist das Verhältnis **L/D maximal** → **bestes Gleiten** (beim Propellerflugzeug ungefähr auch bestes Reichweitenverhalten).
- Unterhalb von \(V_{md}\) liegt der „**Bereich der umgekehrten Steuerung**“ (back side of the power curve): Langsamer fliegen erfordert **mehr** Leistung.

> **Merksatz:** „Induziert ist faul (langsam), parasitär ist eilig (schnell).“

### 4.4 Gleitzahl und Gleitwinkel

- **Gleitzahl E = L/D** = zurückgelegte Strecke / verlorene Höhe (bei Windstille).
- Beispiel: E = 10 → aus 3000 ft Höhe (≈ 0,49 NM) ca. **4,9 NM** Gleitstrecke (1 NM = 6076 ft).
- **Masse ändert den Gleitwinkel nicht**, aber die Geschwindigkeit für bestes Gleiten (schwerer = schneller, gleicher Winkel).
- **Gegenwind** verkürzt die Gleitstrecke über Grund, **Rückenwind** verlängert sie. Bei Gegenwind etwas schneller als \(V_{bg}\) fliegen.
- Ausgefahrene Klappen, Fahrwerk, stehender Propeller verschlechtern die Gleitzahl.

#### Rechenbeispiel Gleitflug
Flugzeug mit Gleitzahl 9, Motorausfall in 4500 ft AGL, Windstille.
Gleitstrecke = 4500 ft × 9 = 40 500 ft = 40 500 / 6076 ≈ **6,7 NM** (≈ 12,3 km).

---

## 5. Die vier Kräfte und Flugzustände

### 5.1 Geradeaus-Horizontalflug (unbeschleunigt)

- **Auftrieb = Gewicht**, **Schub = Widerstand**.
- Kräftepaare: Auftrieb/Gewicht und Schub/Widerstand erzeugen Momente. Typisch liegt der Druckpunkt hinter dem Schwerpunkt → kopflastiges Moment, das durch Abtrieb am Höhenleitwerk ausgeglichen wird.

### 5.2 Steigflug

- Im stationären Steigflug ist der **Auftrieb kleiner als das Gewicht**: \(L = W \cdot \cos\gamma\).
- Steigwinkel: \( \sin\gamma = \dfrac{T - D}{W} \) → abhängig vom **Schubüberschuss**.
- Steigrate (ROC) ∝ **Leistungsüberschuss**: \( ROC = \dfrac{P_{verf} - P_{erf}}{W} \).
- **\(V_X\)** = Geschwindigkeit des **besten Steigwinkels** (größte Höhe pro Strecke, Hindernisüberflug).
- **\(V_Y\)** = Geschwindigkeit der **besten Steigrate** (größte Höhe pro Zeit).
- \(V_X < V_Y\). Mit zunehmender Höhe steigt \(V_X\) (IAS) leicht und \(V_Y\) (IAS) sinkt; beide treffen sich in der **absoluten Gipfelhöhe** (Steigrate 0). **Dienstgipfelhöhe** = Steigrate 100 ft/min.
- Mehr Masse, höhere Temperatur, größere Dichtehöhe → schlechteres Steigen.

> **Eselsbrücke:** „**X** wie e**X**tra steil – **Y** wie **Y**ippie, schnell oben.“

### 5.3 Sinkflug / Gleitflug

- Im Gleitflug ohne Schub liefert die Gewichtskomponente entlang der Flugbahn den „Vortrieb“: \(W \sin\gamma = D\).
- Bester Gleitwinkel bei \(V_{md}\) (max. L/D), geringstes Sinken bei **\(V_{mp}\)** (minimum power speed), etwas langsamer als \(V_{md}\) → längste Flugzeit, nicht weiteste Strecke.

### 5.4 Kurvenflug

- In der Kurve wird der Auftrieb geneigt: Vertikalkomponente trägt das Gewicht, Horizontalkomponente ist die **Zentripetalkraft**.
- Damit die Höhe gehalten wird, muss der Gesamtauftrieb größer werden → **Lastvielfaches** steigt.

\[ n = \frac{L}{W} = \frac{1}{\cos\varphi} \]

| Querneigung φ | 0° | 30° | 45° | 60° | 70° |
|---|---|---|---|---|---|
| Lastvielfaches n | 1,0 | 1,15 | 1,41 | **2,0** | 2,92 |
| Faktor für Vs (√n) | 1,00 | 1,07 | 1,19 | **1,41** | 1,71 |

- **Überziehgeschwindigkeit in der Kurve:** \( V_{S,Kurve} = V_S \cdot \sqrt{n} \)
- **Standardkurve (Rate One):** 3°/s → 360° in 2 Minuten. Faustformel Querneigung ≈ **TAS/10 + 7** (in kt). Bei 100 kt ≈ 17°.
- **Kurvenradius** \( r = \dfrac{v^2}{g \cdot \tan\varphi} \) – wächst mit dem **Quadrat der Geschwindigkeit**.
- Bei gleicher Querneigung und Geschwindigkeit haben alle Flugzeuge **denselben Radius und dieselbe Drehrate** – unabhängig von der Masse.

#### Rechenbeispiel Kurve
\(V_{S1}\) = 50 kt. Steilkurve mit 60° Querneigung.
n = 1/cos 60° = 2,0 → \(V_S\) = 50 × √2 = 50 × 1,414 ≈ **71 kt**.

### 5.5 Schiebe- und Schmierkurve

- **Schiebeflug (slip):** Kugel zur Kurveninnenseite, zu viel Querneigung für die Drehrate → mehr Seitenruder zur Kugelseite.
- **Schmierflug (skid):** Kugel nach außen, zu viel Seitenruder.
- **Merksatz:** „**Tritt auf die Kugel**“ (step on the ball).
- **Gefährlich:** Schmierflug im Endanflugkurvenbereich mit niedriger Geschwindigkeit → Trudeln aus geringer Höhe.

---

## 6. Überziehen (Stall) und Trudeln

### 6.1 Einflüsse auf die Überziehgeschwindigkeit

\[ V_S = \sqrt{\frac{2 \cdot W}{\rho \cdot S \cdot C_{L,max}}} \]

| Faktor | Wirkung auf \(V_S\) |
|---|---|
| Masse ↑ | \(V_S\) ↑ (∝ √Masse) |
| Lastvielfaches ↑ (Kurve, Abfangen) | \(V_S\) ↑ (∝ √n) |
| Klappen ausgefahren (C_L,max ↑) | \(V_S\) ↓ |
| Eis, Reif, Schmutz (C_L,max ↓) | \(V_S\) ↑ |
| Schwerpunkt vorne | \(V_S\) ↑ (mehr Abtrieb am Höhenleitwerk) |
| Schwerpunkt hinten | \(V_S\) ↓, aber Stabilität ↓ |
| Leistung/Propellerstrahl | \(V_S\) ↓ (leicht) |
| Höhe | **\(V_S\) als IAS bleibt (nahezu) gleich**, TAS steigt |

#### Rechenbeispiel Masse
\(V_S\) = 48 kt bei 1000 kg. Neue Masse 850 kg.
\(V_S\)neu = 48 × √(850/1000) = 48 × 0,922 ≈ **44 kt**.

### 6.2 Anzeichen eines Strömungsabrisses

- Abnehmende Ruderwirkung („schwammige“ Steuerung), Schütteln (buffeting), Überziehwarnung (Horn/Lampe, ca. 5–10 kt vor dem Stall), hohe Nase, niedrige Fahrt, evtl. Abkippen über einen Flügel.
- **Beenden (Recovery):** Anstellwinkel verringern (**Höhenruder nachlassen/drücken**), Flügel mit Seitenruder (nicht mit Querruder) gerade halten, Leistung setzen, abfangen ohne Sekundärstall.

### 6.3 Trudeln (Spin)

- Entsteht, wenn ein Flügel stärker überzogen ist als der andere (Schiebeflug, Seitenruder bei Stall) → **Autorotation**.
- Kennzeichen: überzogener Zustand, steile Rotation um die Hochachse, niedrige, konstante Geschwindigkeit.
- **Spiralsturz** (nicht überzogen!): Fahrt nimmt stark zu, Lastvielfaches steigt → Leistung raus, Flügel gerade, sanft abfangen.

**Standardverfahren zum Beenden (falls POH nichts anderes vorschreibt) – Merkwort „PARE“:**
1. **P**ower – Leistung Leerlauf
2. **A**ilerons – Querruder neutral
3. **R**udder – Seitenruder voll gegen die Drehrichtung
4. **E**levator – Höhenruder nachlassen/drücken bis Rotation stoppt
→ dann Seitenruder neutral, sanft abfangen.

---

## 7. Stabilität und Steuerbarkeit

### 7.1 Begriffe

- **Statische Stabilität:** Anfangstendenz, nach einer Störung in die Ausgangslage zurückzukehren (positiv), dort zu bleiben (neutral) oder sich weiter zu entfernen (negativ).
- **Dynamische Stabilität:** Verlauf über die Zeit (gedämpfte, ungedämpfte, aufschaukelnde Schwingung).

### 7.2 Die drei Achsen

| Achse | Bewegung | Ruder | Stabilität |
|---|---|---|---|
| Querachse (lateral axis) | **Nicken** (pitch) | Höhenruder | **Längsstabilität** |
| Längsachse (longitudinal axis) | **Rollen** (roll) | Querruder | **Querstabilität** (Rollstabilität) |
| Hochachse (vertical/normal axis) | **Gieren** (yaw) | Seitenruder | **Richtungsstabilität** |

> **Prüfungsfalle:** Die **Längsstabilität** betrifft die Bewegung um die **Querachse** (Nicken)! Die **Querstabilität** betrifft das Rollen um die **Längsachse**.

Alle drei Achsen schneiden sich im **Schwerpunkt**.

### 7.3 Längsstabilität

- Hauptsächlich durch das **Höhenleitwerk** und die **Schwerpunktlage**.
- Bedingung: **Schwerpunkt vor dem Neutralpunkt**. Der Abstand heißt **Stabilitätsmaß** (static margin).
- **Schwerpunkt weit vorne:** sehr stabil, schwergängig, hohe Steuerkräfte, höhere \(V_S\), u. U. reicht das Höhenruder beim Abfangen zur Landung nicht.
- **Schwerpunkt hinter der hinteren Grenze:** instabil, Gefahr von Überreaktionen, Trudeln schwer oder nicht beendbar. **Lebensgefährlich.**

### 7.4 Querstabilität

- **V-Stellung (dihedral):** Beim Hängen einer Tragfläche entsteht Schiebeflug; der hängende Flügel bekommt größeren Anstellwinkel → richtet auf.
- **Hochdecker / Pendelstabilität (keel effect):** Schwerpunkt unter dem Flügel wirkt aufrichtend.
- **Pfeilung** wirkt ebenfalls querstabilisierend.

### 7.5 Richtungsstabilität

- Hauptsächlich durch das **Seitenleitwerk** (Seitenflosse) und die Rumpffläche hinter dem Schwerpunkt („Wetterfahneneffekt“).

### 7.6 Kopplung

- **Spiralstabilität:** große Seitenflosse + wenig V-Stellung → Neigung zum Spiralsturz.
- **Dutch Roll:** große V-Stellung + kleine Seitenflosse → Pendeln Gieren/Rollen.

---

## 8. Steuerflächen, Trimmung, Klappen

### 8.1 Primärsteuerung

- **Höhenruder** (oder Pendelruder/Stabilator) – Nicken.
- **Querruder** – Rollen; gegensinnig ausschlagend.
- **Seitenruder** – Gieren.

### 8.2 Negatives Wendemoment (adverse yaw)

- Das nach unten ausschlagende Querruder (Flügel geht hoch) erzeugt mehr Auftrieb **und mehr induzierten Widerstand** → Flugzeug giert **entgegen** der gewünschten Kurvenrichtung.
- Gegenmaßnahmen: **Differenzialquerruder** (nach oben stärker als nach unten), **Frise-Querruder** (hochgehendes Ruder ragt mit der Nase in die Strömung), koordinierter Seitenrudereinsatz.

### 8.3 Ausgleich und Massenausgleich

- **Aerodynamischer Ausgleich** (Hornausgleich, Nasenausgleich, Hilfsruder/Servo tab): verringert die Steuerkräfte.
- **Massenausgleich** (Gewicht vor der Ruderdrehachse): verhindert **Ruderflattern** (flutter). Prüfungsfrage: „Wozu dient der Massenausgleich?“ → gegen Flattern.

### 8.4 Trimmung

- Trimmruder (trim tab) bewegt sich **entgegengesetzt** zum Ruder: Trimmruder nach oben → Höhenruder geht nach unten → Nase senkt sich.
- Trimmung beseitigt die **Steuerkräfte**, nicht die Notwendigkeit eines Ruderausschlags.
- **Anti-Balance-Tab** (Stabilator): bewegt sich in Ruderrichtung, erhöht das Steuergefühl.

### 8.5 Hochauftriebshilfen

| Hilfe | Wirkung |
|---|---|
| **Wölbungsklappe** (plain flap) | C_L ↑, Widerstand ↑, krit. α ↓ leicht |
| **Spreizklappe** (split flap) | viel Widerstand, C_L ↑ |
| **Spaltklappe** (slotted flap) | Spalt führt energiereiche Luft auf die Oberseite → C_L ↑↑ |
| **Fowler-Klappe** | fährt nach hinten aus, vergrößert Fläche und Wölbung → größte C_L-Steigerung |
| **Vorflügel (slat) / Spalt (slot)** | erhöhen den **kritischen Anstellwinkel** |

- Klappen: **senken \(V_S\)**, ermöglichen steileren Anflug bei gleicher Geschwindigkeit, erzeugen beim Ausfahren eine Nickmomentänderung („Ballooning“ bei Hochdeckern).
- **Klappen in der Nähe des Stalls nicht schlagartig einfahren** → Auftriebsverlust/Durchsacken.
- **Störklappen (spoiler) / Bremsklappen:** zerstören Auftrieb bzw. erhöhen Widerstand.

---

## 9. Betriebsgrenzen, Lastvielfache und V-n-Diagramm

### 9.1 Lastvielfache nach Kategorie (CS-23)

| Kategorie | positiv | negativ |
|---|---|---|
| Normal (N) | **+3,8 g** | −1,52 g |
| Utility (U) | +4,4 g | −1,76 g |
| Akrobatik (A) | +6,0 g | −3,0 g |

- Bruchlast = Grenzlast × **1,5** (Sicherheitsfaktor).

### 9.2 Wichtige Geschwindigkeiten

| Kürzel | Bedeutung |
|---|---|
| \(V_{S0}\) | Überziehgeschwindigkeit in **Landekonfiguration** |
| \(V_{S1}\) | Überziehgeschwindigkeit in einer bestimmten (meist Reise-)Konfiguration |
| \(V_{FE}\) | höchstzulässige Geschwindigkeit mit ausgefahrenen Klappen |
| \(V_A\) | **Manövergeschwindigkeit** – volle Ruderausschläge zulässig (aber nicht mehrfach/abwechselnd) |
| \(V_{NO}\) | höchste Geschwindigkeit im Normalbetrieb (max. structural cruising speed) |
| \(V_{NE}\) | Höchstgeschwindigkeit, nie überschreiten |
| \(V_X\), \(V_Y\) | bester Steigwinkel / beste Steigrate |
| \(V_{RA}\)/\(V_B\) | Geschwindigkeit für Turbulenz |

- \(V_A = V_S \cdot \sqrt{n_{max}}\). **\(V_A\) sinkt mit abnehmender Masse!** (Prüfungsklassiker)

#### Rechenbeispiel \(V_A\)
\(V_S\) = 52 kt (bei MTOM), n_max = 3,8 → \(V_A\) = 52 × √3,8 = 52 × 1,949 ≈ **101 kt**.
Bei 81 % der Masse: \(V_A\) ≈ 101 × √0,81 = 101 × 0,9 ≈ **91 kt**.

### 9.3 Farbmarkierungen am Fahrtmesser

| Markierung | Bereich |
|---|---|
| **Weißer Bogen** | \(V_{S0}\) bis \(V_{FE}\) (Klappenbereich) |
| **Grüner Bogen** | \(V_{S1}\) bis \(V_{NO}\) (Normalbereich) |
| **Gelber Bogen** | \(V_{NO}\) bis \(V_{NE}\) (nur bei ruhiger Luft, mit Vorsicht) |
| **Roter Strich** | \(V_{NE}\) |
| (Blauer Strich) | \(V_{YSE}\) bei Zweimots |

> **Prüfungsfalle:** Der Beginn des weißen Bogens ist \(V_{S0}\), der Beginn des grünen ist \(V_{S1}\). Fahrtmessermarkierungen sind **IAS**, gelten für MTOM.

### 9.4 V-n-Diagramm (Manövrierbereich)

- x-Achse Geschwindigkeit, y-Achse Lastvielfaches.
- Linke Begrenzung: Stallkurve (Parabel, n ∝ v²).
- Obere Grenze: positive Grenzlast. Schnittpunkt Stallkurve/positive Grenzlast = **\(V_A\)**.
- Rechte Grenze: \(V_{NE}\) bzw. \(V_D\) (Design dive speed).
- Unterhalb \(V_A\): Flugzeug überzieht, bevor die Struktur überlastet wird. Oberhalb: Strukturüberlastung möglich.

---

## 10. Propeller und Propellereffekte

### 10.1 Propeller als rotierender Flügel

- Jedes Blattelement hat ein Profil; der Blattwinkel nimmt zur Spitze hin ab (**Verwindung**), weil die Umfangsgeschwindigkeit zunimmt → konstanter Anstellwinkel entlang des Blattes.
- **Festpropeller:** optimal nur für einen Betriebspunkt (Steig- oder Reiseprop).
- **Verstellpropeller (constant speed):** Drehzahlregler hält Drehzahl konstant, Blattwinkel passt sich an.

### 10.2 Effekte (rechtsdrehender Propeller, vom Cockpit aus im Uhrzeigersinn)

| Effekt | Ursache | Wirkung |
|---|---|---|
| **Propellerstrahl (slipstream)** | spiralförmiger Luftstrom trifft Seitenleitwerk links | Gieren nach **links** |
| **Drehmoment (torque)** | Reaktionsmoment | Rollen nach **links**, mehr Last auf linkem Rad |
| **P-Faktor (asymmetrische Blattbelastung)** | bei hohem α hat das abwärtsgehende (rechte) Blatt größeren Anstellwinkel | Gieren nach **links** |
| **Kreiselpräzession (gyroscopic)** | Kraft wirkt 90° versetzt in Drehrichtung | v. a. beim Heckanheben im Spornradflugzeug: Gieren nach **links** |

→ Beim Start mit Vollgas ist **rechtes Seitenruder** nötig.

> **Eselsbrücke Präzession:** Kraft wirkt „eine Viertelumdrehung später“.

---

## 11. Bodeneffekt und Wirbelschleppen

### 11.1 Bodeneffekt

- Wirkt bis ca. **eine Spannweite** über dem Boden, deutlich unter ½ Spannweite.
- Randwirbel und Abwind werden behindert → **induzierter Widerstand sinkt**, Auftrieb steigt.
- Folgen: Flugzeug „schwebt“ bei der Landung (floating), hebt beim Start evtl. zu früh ab und sackt nach Verlassen des Bodeneffekts durch. Static-Druck-Anzeige kann verfälscht sein.

### 11.2 Randwirbel / Wirbelschleppen

- Entstehen durch Druckausgleich von der Unter- zur Oberseite um die Flügelspitzen.
- **Am stärksten bei: schwer, langsam, Reiseflug-/Clean-Konfiguration (clean, heavy, slow)**.
- Sinken mit einigen hundert ft/min ab, bis etwa 500–1000 ft unter die Flugbahn, und breiten sich am Boden seitlich aus (ca. 5 kt). Leichter Seitenwind (ca. 3–5 kt) kann einen Wirbel über der Piste „festhalten“.
- Details zu Vermeidung → Skript Betriebliche Verfahren.

---

## 12. Typische Prüfungsfallen

1. **Längsstabilität = Nicken um die Querachse** (nicht Längsachse).
2. **Kritischer Anstellwinkel ist konstant** – Stall kann bei jeder Geschwindigkeit und Lage auftreten.
3. **\(V_A\) sinkt bei geringerer Masse.**
4. Höhere Masse → gleicher Gleitwinkel, aber höhere Geschwindigkeit für bestes Gleiten.
5. Induzierter Widerstand ist bei **niedriger** Geschwindigkeit am größten.
6. Beim **Minimum des Gesamtwiderstands** sind induzierter und parasitärer Widerstand **gleich**.
7. Trimmruder bewegt sich **entgegengesetzt** zum Ruder.
8. Schwerpunkt vorne → \(V_S\) **höher**, Stabilität **größer**.
9. Vorflügel erhöhen den **kritischen Anstellwinkel**, Klappen erhöhen vor allem **C_L,max**.
10. Lastvielfaches bei 60° Querneigung = **2**; \(V_S\) steigt um ca. **41 %**.
11. Weißer Bogen beginnt bei \(V_{S0}\), grüner Bogen bei \(V_{S1}\).
12. Druckpunkt wandert bei zunehmendem α **nach vorne**.

---

## 13. Formelsammlung

| Formel | Bedeutung |
|---|---|
| \(q = ½ρv^2\) | Staudruck |
| \(L = C_L · q · S\) | Auftrieb |
| \(D = C_D · q · S\) | Widerstand |
| \(Λ = b^2/S\) | Streckung |
| \(n = 1/\cos φ\) | Lastvielfaches Horizontalkurve |
| \(V_{S,n} = V_S · \sqrt{n}\) | Überziehgeschw. bei Last |
| \(V_{S,neu} = V_S · \sqrt{m_{neu}/m_{alt}}\) | Masseneinfluss |
| \(V_A = V_S · \sqrt{n_{max}}\) | Manövergeschwindigkeit |
| \(E = L/D\) = Strecke/Höhe | Gleitzahl |
| \(r = v^2/(g · \tan φ)\) | Kurvenradius |
| Querneigung Rate One ≈ TAS/10 + 7 | Standardkurve |

---

## 14. Kurz-Zusammenfassung

- Auftrieb entsteht durch Druckunterschiede am Profil; er wächst mit dem Quadrat der Geschwindigkeit, mit der Dichte, der Fläche und dem Anstellwinkel (bis zum kritischen Winkel).
- Widerstand setzt sich aus induziertem (langsam groß) und parasitärem Widerstand (schnell groß) zusammen; das Minimum liefert bestes Gleiten.
- Der Stall hängt ausschließlich vom Anstellwinkel ab. Die Überziehgeschwindigkeit steigt mit Masse und Lastvielfachem, sinkt mit Klappen.
- Stabilität: Längs (Nicken) durch Höhenleitwerk und Schwerpunkt vor dem Neutralpunkt, Quer (Rollen) durch V-Stellung/Hochdecker, Richtung (Gieren) durch Seitenleitwerk.
- In der Kurve steigt das Lastvielfache mit 1/cos φ – bei 60° auf 2 g.
- Betriebsgrenzen stehen im POH; Fahrtmesser-Farbbögen markieren die wichtigsten Grenzwerte.
- Propellereffekte ziehen das Flugzeug (rechtsdrehender Propeller) beim Start nach links.

---

## 15. Kontrollfragen

1. Wie ist der Anstellwinkel definiert?
2. Wie verändert sich der Auftrieb, wenn die Geschwindigkeit bei gleichem Anstellwinkel verdoppelt wird?
3. Bei welcher Geschwindigkeit ist der induzierte Widerstand am größten, und warum?
4. Ein Flugzeug hat \(V_S\) = 55 kt. Wie groß ist \(V_S\) in einer Horizontalkurve mit 45° Querneigung?
5. Um welche Achse wirkt die Längsstabilität, und welche Bedingung muss für sie erfüllt sein?
6. Wie wirkt sich ein Schwerpunkt an der vorderen Grenze auf Überziehgeschwindigkeit und Steuerbarkeit aus?
7. Wodurch entsteht das negative Wendemoment, und wie wird es konstruktiv verringert?
8. Wie verändert sich die Manövergeschwindigkeit \(V_A\), wenn das Flugzeug leichter ist?
9. Ein Flugzeug mit Gleitzahl 12 befindet sich 2500 ft über Grund. Welche Gleitstrecke ist bei Windstille möglich (in NM)?
10. Welche Bereiche kennzeichnen der weiße und der grüne Bogen am Fahrtmesser?
11. Unter welchen Bedingungen sind Wirbelschleppen am stärksten?
12. Nenne die Schritte zum Beenden des Trudelns (Standardverfahren).

### Lösungen

1. Winkel zwischen der **Profilsehne** und der **Richtung der anströmenden Luft** (relativer Wind).
2. Er **vervierfacht** sich (L ∝ v²).
3. Bei **niedriger Geschwindigkeit**: Dann ist ein hoher Anstellwinkel/C_L nötig, der Druckunterschied und damit die Randwirbel sind stark (C_Di ∝ C_L²).
4. n = 1/cos 45° = 1,414; \(V_S\) = 55 × √1,414 = 55 × 1,189 ≈ **65 kt**.
5. Um die **Querachse** (Nicken). Der **Schwerpunkt muss vor dem Neutralpunkt** liegen.
6. \(V_S\) **steigt** (mehr Abtrieb am Höhenleitwerk nötig), das Flugzeug ist sehr stabil, aber schwergängig; das Abfangen bei der Landung kann schwierig werden.
7. Das nach unten ausschlagende Querruder erzeugt mehr Auftrieb und damit mehr **induzierten Widerstand**; Gegenmittel: **Differenzialquerruder, Frise-Querruder** (und koordiniertes Seitenruder).
8. Sie **sinkt** (∝ √Masse).
9. 2500 ft × 12 = 30 000 ft; 30 000 / 6076 ≈ **4,9 NM**.
10. Weiß: \(V_{S0}\) bis \(V_{FE}\) (Klappenbetriebsbereich); Grün: \(V_{S1}\) bis \(V_{NO}\) (Normalbetrieb).
11. **Schwer, langsam, clean** (große Masse, geringe Geschwindigkeit, Klappen eingefahren), bei ruhiger Luft.
12. **PARE**: Leistung Leerlauf, Querruder neutral, Seitenruder voll gegen die Drehrichtung, Höhenruder nachlassen bis die Rotation endet; dann Seitenruder neutral und sanft abfangen (POH beachten).

---

## Quellen

- EASA, *Easy Access Rules for Aircrew (Regulation (EU) No 1178/2011)*, FCL.210/FCL.215 und AMC1 FCL.210; FCL.215 (Syllabus PPL(A)) – https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-aircrew-regulation-eu-no
- EASA, *AMC & GM to Part-FCL* – https://www.easa.europa.eu/en/downloads/141594/en
- UK CAA, *CAP 1298 – Syllabus of Theoretical Knowledge for the PPL(A)* – https://www.caa.co.uk/data-and-publications/publications/documents/content/cap1298/
- Aircademy, *ECQB-PPL* (Lernziele, veröffentlichte Fragen, Anlagenhandbuch) – https://aircademy.com/de/ecqb-ppl/
- Austro Control, *Theorieprüfung PPL/LAPL – Fächer, Fragenanzahl, Zeiten* (DC_LFA_ACW_034) – https://www.austrocontrol.at/luftfahrtbehoerde/lizenzen
- FAA, *Pilot’s Handbook of Aeronautical Knowledge (FAA-H-8083-25C)*, Kap. 4–6 – https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak
- EASA, *CS-23* (Lastvielfache je Kategorie, historische Amendments) – https://www.easa.europa.eu/en/document-library/certification-specifications
