# Meteorologie – Lernskript PPL(A)

> **Prüfungsfach 30 – Meteorologie** (Meteorology). Bei der **Austro Control**: **20 Fragen, 40 Minuten, Bestehensgrenze 75 %** (also mind. 15 richtige Antworten).
> Stand der Recherche: Oktober 2026. Für die Flugvorbereitung in Österreich gelten die aktuellen Produkte des **Flugwetterdienstes der Austro Control** (Homebriefing / „Flugwetter“: GAFOR, ALPFOR, Low-Level-SWC Alps, METAR/TAF). Besonderer Schwerpunkt: **Alpen- und Gebirgswetter**, weil Fürstenfeld (LOGF) am Rand der Alpen liegt.

---

## Lernziele

Nach Durcharbeiten dieses Skripts kannst du …

1. Aufbau und Zusammensetzung der Atmosphäre sowie die Werte der ICAO-Standardatmosphäre (ISA) wiedergeben.
2. Luftdruck, Höhenmessung (QNH, QFE, QNE) und die Fehler durch Druck- und Temperaturänderungen berechnen.
3. die Entstehung von Wind erklären (Druckgradient, Coriolis, Reibung) und lokale Windsysteme beschreiben.
4. Feuchte, Stabilität und adiabatische Vorgänge anwenden, z. B. Wolkenbasis und Föhn berechnen.
5. Wolken, Nebel und Niederschläge benennen und ihre Bedeutung für den Sichtflug einschätzen.
6. Luftmassen, Fronten und Druckgebilde mit dem typischen Wetterablauf verbinden.
7. Gefahren wie Gewitter, Vereisung, Turbulenz und Windscherung erkennen und vermeiden.
8. METAR, TAF, SIGMET, AIRMET, das österreichische **GAFOR**, **ALPFOR** und die **Low-Level-SWC Alps** lesen und für die Flugentscheidung nutzen.
9. typische Gefahren des Gebirgsflugs (Föhn, Talwinde, Leewellen, Gewitter über den Bergen, verdeckte Pässe) einschätzen.

---

## Kapitel 1 – Die Atmosphäre

### 1.1 Zusammensetzung

| Gas | Volumenanteil (trockene Luft) |
|---|---|
| Stickstoff N₂ | 78 % |
| Sauerstoff O₂ | 21 % |
| Argon | 0,93 % |
| CO₂ und Spurengase | ca. 0,04 % |
| **Wasserdampf** | **0 – 4 %**, variabel – wetterwirksam! |

### 1.2 Stockwerke

| Schicht | Höhe | Merkmal |
|---|---|---|
| **Troposphäre** | bis zur **Tropopause**: ca. **8 km (Pol)**, **11 km (mittlere Breiten)**, **16–18 km (Äquator)** | Temperatur nimmt mit der Höhe ab; **fast das gesamte Wetter** |
| **Tropopause** | Grenzschicht | Temperaturabnahme endet; Lage von **Strahlströmen (Jetstreams)** |
| Stratosphäre | bis ca. 50 km | Temperatur zunächst konstant, dann zunehmend (Ozon) |
| Mesosphäre, Thermosphäre | darüber | für die Allgemeine Luftfahrt bedeutungslos |

> **Prüfungsfalle:** Die Tropopause liegt im **Sommer höher** als im Winter und am **Äquator höher** als an den Polen (warme Luft dehnt sich aus).

### 1.3 ICAO-Standardatmosphäre (ISA)

| Größe | Wert |
|---|---|
| Luftdruck MSL | **1013,25 hPa** (29,92 inHg) |
| Temperatur MSL | **+15 °C** |
| Dichte MSL | **1,225 kg/m³** |
| Temperaturgradient bis 11 km | **–0,65 °C / 100 m** ≈ **–2 °C / 1 000 ft** |
| Tropopause | **11 km (36 090 ft)**, **–56,5 °C** |
| Druckabnahme nahe MSL | ca. **1 hPa pro 8 m (≈ 27–30 ft)** |
| Halber Druck (500 hPa) | ca. **5 500 m (18 000 ft)** |

**ISA-Temperatur in einer Höhe:** \(T_{ISA} = 15\,°C - 2\,°C \times \frac{\text{Höhe in ft}}{1000}\).
Beispiel: in 6 000 ft ist \(T_{ISA} = 15 - 12 = 3\,°C\). Gemessene 13 °C → **ISA + 10**.

---

## Kapitel 2 – Luftdruck und Höhenmessung

### 2.1 Begriffe

| Begriff | Bedeutung | Höhenmesser zeigt |
|---|---|---|
| **QFE** | Luftdruck in **Platzhöhe** | **Höhe über Platz** (Height), am Boden 0 |
| **QNH** | Luftdruck auf **MSL reduziert** (mit ISA-Annahme) | **Höhe über MSL** (Altitude), am Boden = **Platzhöhe (Elevation)** |
| **QNE / Standard 1013,2 hPa** | Standardeinstellung | **Druckhöhe / Flugfläche** (FL) |
| QFF | auf MSL reduziert mit tatsächlicher Temperatur (für Wetterkarten) | – |

**Isobaren** = Linien gleichen Luftdrucks (in Wetterkarten meist im Abstand von 5 hPa). Eng beieinander → **starker Wind**.

### 2.2 Höhenmesserfehler durch Druck

> **Merksatz:** „**Vom Hoch ins Tief – geht's schief.**“
> Fliegt man ohne Nachstellen in ein Gebiet **tieferen Drucks**, zeigt der Höhenmesser **zu viel** an → man ist **tiefer** als angezeigt.

Faustwert: **1 hPa ≈ 30 ft** (genauer 27 ft).

**Beispiel:** Eingestellt QNH 1020 hPa, tatsächlich am Zielort 1010 hPa. Differenz 10 hPa ≈ 300 ft. Angezeigt 3 000 ft → tatsächlich ca. **2 700 ft** MSL.

### 2.3 Höhenmesserfehler durch Temperatur

> **Merksatz:** „**Von warm nach kalt – wird's bald knapp (oder: knallt's bald).**“
> In **kälterer** Luft als ISA liegen die Druckflächen **tiefer** → wahre Höhe **niedriger** als angezeigt.

Faustwert: ca. **4 % der Höhe über der Druckbezugsstelle je 10 °C Abweichung** von ISA.
Beispiel: 5 000 ft über dem Platz, ISA –20 °C → 2 × 4 % × 5 000 ft = **400 ft zu tief**.

### 2.4 Dichtehöhe

- **Dichtehöhe** = Höhe in der ISA mit derselben Luftdichte.
- **Hoch, heiß, feucht** („**high, hot and humid**“) → geringe Dichte → **hohe Dichtehöhe** → längere Startstrecke, schlechtere Steigleistung, weniger Motorleistung.
- Feuchte Luft ist **leichter** als trockene Luft (Wasserdampf ist leichter als N₂/O₂).

---

## Kapitel 3 – Wind

### 3.1 Entstehung

| Kraft | Wirkung |
|---|---|
| **Druckgradientkraft** | treibt Luft vom **Hoch zum Tief**, senkrecht zu den Isobaren; stärker bei engen Isobaren |
| **Corioliskraft** | Ablenkung durch die Erddrehung: **Nordhalbkugel nach rechts**; am Äquator null, an den Polen maximal; wächst mit der Windgeschwindigkeit |
| **Reibung** | in der Grundschicht (bis ca. **2 000–3 000 ft / 600–1 000 m** über Grund) – verringert Geschwindigkeit und damit Coriolis |

- **Geostrophischer Wind** (über der Reibungsschicht): Gleichgewicht Druckgradient–Coriolis → weht **parallel zu den Isobaren**.
- **Bodenwind**: durch Reibung **schwächer** und **zurückgedreht** (nach links gedreht), d. h. er weht **schräg über die Isobaren ins Tief**: über **Land ca. 30°**, über **Wasser ca. 10°**.
- **Regel von Buys-Ballot** (Nordhalbkugel): **Steht man mit dem Rücken zum Wind, liegt das Tief links (vorne)** und das Hoch rechts (hinten).

| Druckgebilde (Nordhalbkugel) | Drehsinn am Boden |
|---|---|
| **Hoch** (Antizyklone) | **im Uhrzeigersinn**, ausströmend |
| **Tief** (Zyklone) | **gegen den Uhrzeigersinn**, einströmend |

> **Eselsbrücke:** „**Tiefe Töne drehen links**“ (Tief → linksherum / gegen den Uhrzeigersinn).

**Rechtsdrehen (veering)** = Windrichtung dreht im Uhrzeigersinn (z. B. 180° → 270°). **Rückdrehen (backing)** = gegen den Uhrzeigersinn. Beim **Steigen aus der Reibungsschicht** dreht der Wind auf der Nordhalbkugel **nach rechts** und **nimmt zu**.

### 3.2 Windangaben

| Quelle | Bezug der Windrichtung |
|---|---|
| **METAR, TAF, Wetterkarten** | **rechtweisend** (geografisch Nord) |
| **Tower, ATIS, Flugleiter** | **missweisend** (magnetisch Nord) – passend zur Pistenrichtung |

> **Prüfungsfalle:** Im METAR ist der Wind **rechtweisend**, am Funk **missweisend**.

Einheiten: **1 kt = 1,852 km/h**; **1 m/s ≈ 2 kt**. Böen: **G** (z. B. 27015G28KT); wechselnde Richtung: **VRB** oder **240V300**.

### 3.3 Lokale Windsysteme

| System | Entstehung | Tagesgang |
|---|---|---|
| **Seewind** | Land wärmer als Wasser → Luft steigt über Land, Wind **vom Meer zum Land** | **tagsüber** |
| **Landwind** | Land kälter als Wasser | **nachts**, schwächer |
| **Talwind (Hangaufwind)** | Hänge erwärmen sich | **tagsüber** talaufwärts |
| **Bergwind (Hangabwind)** | Hänge kühlen ab, kalte Luft fließt ab | **nachts** talabwärts |
| **Föhn** | Luft wird über ein Gebirge gezwungen (siehe Kap. 4.4) | warm, trocken im Lee |
| Bora, Mistral | kalte Fallwinde (Adria, Rhonetal) | – |

---

## Kapitel 4 – Thermodynamik: Feuchte, Stabilität, Föhn

### 4.1 Feuchte

| Begriff | Bedeutung |
|---|---|
| **Relative Feuchte** | Verhältnis vorhandener zu maximal möglichem Wasserdampf (%) – steigt beim Abkühlen |
| **Taupunkt** | Temperatur, auf die Luft abkühlen muss, damit **Sättigung (100 %)** eintritt |
| **Spread** (Taupunktdifferenz) | Temperatur minus Taupunkt – klein = Nebel-/Wolkengefahr |
| Sättigungsmenge | Warme Luft kann **mehr** Wasserdampf aufnehmen als kalte |

**Phasenübergänge:** Verdunstung, Schmelzen, Sublimation (fest → gasförmig) **verbrauchen** Wärme; **Kondensation**, Gefrieren, Deposition **setzen Wärme frei** (latente Wärme = Energie für Gewitter).

### 4.2 Adiabatische Vorgänge

| Prozess | Temperaturänderung |
|---|---|
| **Trockenadiabatisch** (ungesättigte Luft) | **1 °C / 100 m** ≈ **3 °C / 1 000 ft** |
| **Feuchtadiabatisch** (gesättigte Luft) | ca. **0,6 °C / 100 m** (0,4–0,9) ≈ **1,8 °C / 1 000 ft** |
| **Taupunkt** steigender Luft | sinkt ca. **0,2 °C / 100 m** |

**Wolkenbasis (Kumulus) abschätzen:**
\[ \text{Basis über Grund} \approx (T - T_d) \times 125\ \text{m} \approx (T - T_d) \times 400\ \text{ft} \]
Beispiel: T = 22 °C, Td = 12 °C → Spread 10 → Basis ca. **4 000 ft (1 250 m) über Grund**.

### 4.3 Stabilität

Man vergleicht den **tatsächlichen Temperaturgradienten** der Umgebung mit den adiabatischen Gradienten:

| Umgebungsgradient | Schichtung | Wetter |
|---|---|---|
| kleiner als 0,6 °C/100 m (oder **Inversion**/Isothermie) | **absolut stabil** | Schichtwolken (St, As), Dunst, ruhige Luft, schlechte Sicht unter Inversion |
| zwischen 0,6 und 1 °C/100 m | **bedingt labil** (labil, wenn feucht) | Quellwolken möglich, wenn Luft gesättigt |
| größer als 1 °C/100 m | **absolut labil** | Thermik, Cu/Cb, Schauer, Böen, gute Sicht |

- **Inversion** = Temperatur **nimmt mit der Höhe zu** → sehr stabil, „Deckel“ für Dunst/Schadstoffe; **Bodeninversion** nachts im Hoch, **Absinkinversion** im Hoch.
- **Isothermie** = Temperatur bleibt konstant (ebenfalls stabil).

> **Merksatz:** „**Stabil = Schicht, Labil = Quell.**“

### 4.4 Föhn

1. **Luv**: Luft steigt am Gebirge auf, zunächst **trockenadiabatisch**, ab dem Kondensationsniveau **feuchtadiabatisch** → Wolken und **Stauniederschlag**.
2. **Gipfel**: Wasser ist ausgeregnet.
3. **Lee**: Luft sinkt **trockenadiabatisch** ab → **wärmer und trockener** als auf gleicher Höhe im Luv.

**Rechenbeispiel:** Luv auf 500 m: 15 °C, Kondensation ab 1 500 m, Kamm 3 000 m, Lee auf 500 m.
- 500 → 1 500 m trocken: 15 – 10 = **5 °C**
- 1 500 → 3 000 m feucht (0,6): 5 – 9 = **–4 °C**
- 3 000 → 500 m trocken: –4 + 25 = **21 °C** im Lee (6 °C wärmer als im Luv).

Flugbetriebliche Gefahren: **Föhnmauer** am Kamm, **Leewellen** mit **Rotoren** (starke Turbulenz unterhalb der Wellenkämme, oft markiert durch **Rotorwolken** und linsenförmige **Altocumulus lenticularis**), starke Fallwinde. Gebirge im Lee mit ausreichender Höhe (mind. 1/3 bis 1/2 der Gebirgshöhe zusätzlich) überfliegen oder meiden.

---

## Kapitel 5 – Wolken, Nebel, Sicht

### 5.1 Wolkengattungen

| Stockwerk (mittlere Breiten) | Gattungen | Merkmale |
|---|---|---|
| **Hoch** (ca. 5–13 km) | **Ci** Cirrus, **Cc** Cirrocumulus, **Cs** Cirrostratus | Eiskristalle; Cs erzeugt **Halo**; Vorboten einer Warmfront |
| **Mittel** (ca. 2–7 km) | **Ac** Altocumulus, **As** Altostratus | As: Sonne „wie durch Milchglas“, kein Halo |
| **Tief** (unter ca. 2 km) | **St** Stratus, **Sc** Stratocumulus | St: Nieselregen, tiefe Untergrenze |
| **Mehrere Stockwerke** | **Ns** Nimbostratus | Dauerniederschlag, dunkelgrau |
| **Vertikal / Quellwolken** | **Cu** Cumulus, **Cb** Cumulonimbus (auch **TCU** Towering Cu) | Cb: Gewitter, Hagel, Böen, Vereisung, Turbulenz |

> **Eselsbrücke:** „**Cirrus** = Haar/Feder (hoch), **Alto** = mittel, **Stratus** = Schicht, **Cumulus** = Haufen, **Nimbus** = Regen.“

**Bedeckungsgrade (Achtel, Okta):**

| METAR | Bedeckung |
|---|---|
| **SKC / NSC / NCD** | wolkenlos / keine signifikanten Wolken / keine Wolken erkannt (automatisch) |
| **FEW** | 1–2/8 |
| **SCT** | 3–4/8 |
| **BKN** | 5–7/8 |
| **OVC** | 8/8 |
| **VV** | Vertikalsicht (Himmel nicht erkennbar, z. B. bei Nebel) |

**Hauptwolkenuntergrenze (Ceiling)** = niedrigste Schicht **BKN oder OVC** unter 20 000 ft.

### 5.2 Wolkenbildung – Hebungsarten

| Hebung | Beispiel |
|---|---|
| **Konvektion** (Thermik) | Erwärmung vom Boden → Cu, Cb |
| **Orografisch** | Aufgleiten an Gebirgen → Stauwolken |
| **Frontal** | Aufgleiten warmer Luft (Warmfront) oder Anheben durch Kaltluft (Kaltfront) |
| **Konvergenz** | Zusammenströmen von Luft (z. B. im Tief) |
| Turbulente Durchmischung | Sc unter Inversion |

### 5.3 Nebel und Dunst

| Erscheinung | Sichtweite | METAR |
|---|---|---|
| **Nebel** | **unter 1 000 m** | **FG** (MIFG flach, BCFG Schwaden, FZFG gefrierend) |
| **Feuchter Dunst** (Mist) | **1 000 – 5 000 m**, hohe Feuchte | **BR** |
| **Trockener Dunst** (Haze) | bis 5 000 m, trockene Teilchen | **HZ** |

| Nebelart | Entstehung | typische Bedingungen |
|---|---|---|
| **Strahlungsnebel** | nächtliche Ausstrahlung kühlt Boden und bodennahe Luft unter den Taupunkt | **klare Nacht**, **wenig Wind (ca. 2–8 kt)**, hohe Feuchte, Hochdruck, Herbst/Winter; löst sich am Vormittag auf |
| **Advektionsnebel** | **warme, feuchte Luft** strömt über **kalten Untergrund** | Küste, Winter; auch bei Wind, hält oft lange |
| **Hangnebel/orografisch** | feuchte Luft steigt am Hang auf | Mittelgebirge |
| **Verdunstungs-/Dampfnebel** | kalte Luft über warmem Wasser | Seen im Herbst |
| **Frontnebel** | Niederschlag aus warmer Luft verdunstet in kalter Luft | vor Warmfronten |

> **Prüfungsfalle:** Bei **völliger Windstille** entsteht eher **Tau/Reif** oder nur Bodennebel; bei **leichtem Wind** dehnt sich Strahlungsnebel in die Höhe aus; bei **starkem Wind** entsteht eher **Hochnebel/Stratus**.

---

## Kapitel 6 – Niederschlag

| Niederschlag | Wolke | METAR |
|---|---|---|
| **Sprühregen/Niesel** | **St** | **DZ** |
| **Regen** (Dauerregen) | **Ns**, As | **RA** |
| **Schauer** (Regen/Schnee) | **Cu, Cb** | **SHRA, SHSN** |
| **Schnee** | Ns, Sc, Cb | **SN** |
| **Hagel** | **Cb** | **GR** (Graupel GS) |
| **Gefrierender Regen/Niesel** | warme Schicht über kalter Bodenschicht | **FZRA, FZDZ** – **sehr gefährlich** (Klareis) |
| Gewitter | Cb | **TS** (z. B. TSRA) |

Intensität: **–** leicht, (ohne) mäßig, **+** stark; **VC** = in der Umgebung (8–16 km); **RE** = kürzlich (recent).

---

## Kapitel 7 – Luftmassen und Fronten

### 7.1 Luftmassen (Europa)

| Luftmasse | Kürzel | Eigenschaften in Mitteleuropa / Österreich |
|---|---|---|
| Arktische Kaltluft | A | sehr kalt, im Winter trocken |
| **Maritime Polarluft** | **mP** | kühl, feucht, **labil** → Schauer, gute Sicht (Rückseitenwetter) |
| Kontinentale Polarluft | cP | im Winter sehr kalt und trocken, stabil |
| **Maritime Tropikluft** | **mT** | warm, feucht, **stabil** → Stratus, Niesel, schlechte Sicht |
| Kontinentale Tropikluft | cT | heiß, trocken, Dunst/Staub |

### 7.2 Warmfront

- Warme Luft gleitet **flach** (ca. **1 : 100 bis 1 : 200**) auf kalte Luft auf.
- **Wolkenfolge** beim Herannahen: **Ci → Cs → As → Ns** (später St in der Kaltluft).
- **Niederschlag**: lang anhaltender **Landregen** bereits **mehrere hundert km vor** der Bodenfront; Sicht und Untergrenzen werden schlecht; im Winter **gefrierender Regen** möglich.
- **Luftdruck fällt** stetig; bei Durchgang **dreht der Wind nach rechts**, Temperatur **steigt**.

> **Merksatz Warmfront:** „**Ci-Cs-As-Ns – erst Haar, dann Milchglas, dann Regen.**“

### 7.3 Kaltfront

- Kalte Luft schiebt sich **keilförmig** unter warme Luft; Front **steiler** (ca. **1 : 50 bis 1 : 100**) und **schneller**.
- **Wetter**: **Cb**, **Gewitter**, **Schauer**, **Böen**, Turbulenz, **Böenwalze**, mögliche Hagel; oft eine **Squall Line** (Böenlinie) vor der Front.
- Bei Durchgang: Wind **dreht stark nach rechts** und frischt böig auf; Temperatur **fällt**; Druck **steigt** danach.
- **Rückseitenwetter**: labile mP-Luft, **sehr gute Sicht**, Cu und Schauer.

| Merkmal | Warmfront | Kaltfront |
|---|---|---|
| Neigung | flach (1:100–1:200) | steil (1:50–1:100) |
| Wolken | Ci, Cs, As, Ns, St | Cb, Cu, (Ns) |
| Niederschlag | Dauerregen **vor** der Front | Schauer/Gewitter **an und hinter** der Front |
| Sicht | schlecht (Niederschlag, Nebel) | außerhalb der Schauer gut |
| Temperatur nach Durchgang | steigt | fällt |
| Druck | fällt vorher | steigt danach |
| Wind bei Durchgang | dreht rechts | dreht stark rechts, böig |

### 7.4 Okklusion und Warmsektor

- **Warmsektor** zwischen Warm- und Kaltfront: mT-Luft, oft St, Niesel, schlechte Sicht.
- **Okklusion**: die schnellere Kaltfront holt die Warmfront ein, Warmluft wird vom Boden abgehoben. **Kaltfrontokklusion** (Rückseitenluft kälter) bzw. **Warmfrontokklusion** (Rückseitenluft wärmer). Wetter: Mischung aus beiden.
- **Stationäre Front**: kaum Verlagerung, lang anhaltendes Schlechtwetter.

### 7.5 Druckgebilde

| Gebilde | Vorgang | typisches Wetter |
|---|---|---|
| **Hoch** | **Absinken** (Subsidenz) → Erwärmung, Wolkenauflösung | wenig Wolken, **Inversion**, **Dunst**, im Herbst/Winter **Nebel/Hochnebel** |
| **Tief** | **Aufsteigen** (Konvergenz) | Wolken, Niederschlag, Fronten |
| **Trog** | Tiefdruckausläufer | labil, Schauer/Gewitter |
| **Rücken/Keil** | Hochdruckausläufer | Wetterberuhigung |
| **Sattel** | zwischen zwei Hochs und zwei Tiefs | schwache Winde, uneinheitlich |
| **Hitzetief** | starke Erwärmung (Sommer) | Wärmegewitter |
| **Kältehoch** | starke Abkühlung (Winter, Kontinent) | kalt, trocken |

Großwetterlage Mitteleuropa: **Westwindzone** mit wandernden Tiefs (Island-Tief) und Hochs (Azoren-Hoch); Polarfront als Entstehungsort der Tiefs.

---

## Kapitel 8 – Flugwettergefahren

### 8.1 Gewitter

**Voraussetzungen:** (1) **labile Schichtung**, (2) **ausreichend Feuchte**, (3) **Auslösung** (Hebung durch Erwärmung, Front, Gebirge, Konvergenz).

| Stadium | Merkmal | Dauer (Zelle) |
|---|---|---|
| **Cumulus-/Aufbaustadium** | nur **Aufwinde**, Cu/TCU wachsen | ca. 10–15 min |
| **Reifestadium** | **Auf- und Abwinde**, Niederschlag erreicht den Boden, **Blitze, Hagel, Böenfront**, Amboss | ca. 15–30 min – **gefährlichste Phase** |
| **Auflösungsstadium** | überwiegend **Abwinde**, Niederschlag lässt nach | ca. 30 min |

| Gewitterart | Entstehung |
|---|---|
| **Wärmegewitter** (Luftmassengewitter) | Sommer, nachmittags, lokale Erwärmung |
| **Frontgewitter** | an Kaltfronten, auch nachts, oft in Linien |
| Orografische Gewitter | Hebung an Gebirgen |

**Gefahren:** schwere **Turbulenz**, **Hagel** (auch unter dem Amboss und im klaren Bereich daneben), **Vereisung**, **Blitzschlag**, **Böenfront** (Windsprung, Scherung) **bis 15–30 km** vor der Zelle, **Microbursts**, Starkregen mit Sichtverlust, Höhenmesserfehler durch Druckschwankungen.

**Microburst:** konzentrierter Fallwind, Durchmesser **unter 4 km**, Dauer meist **5–15 Minuten**, Abwinde bis **6 000 ft/min** – im Anflug: erst Gegenwind (Fahrtzunahme), dann Rückenwind (Fahrtverlust).

> **Regel:** Gewitter **weiträumig umfliegen** (Empfehlung **mindestens 10 NM**, bei starken Zellen 20 NM); **nie** darunter durch, **nie** in Cb einfliegen. Bei Gewitter am Zielflugplatz: warten oder Ausweichplatz.

### 8.2 Vereisung

| Eisart | Entstehung | Temperatur | Gefahr |
|---|---|---|---|
| **Klareis** (Glatteis, clear ice) | **große unterkühlte Tropfen** gefrieren langsam und fließen breit | ca. **0 bis –10 °C**; in **Cu/Cb**, bei **gefrierendem Regen** | **am gefährlichsten**: schwer, glatt, verändert Profil, schwer erkennbar |
| **Raueis** (rime ice) | **kleine unterkühlte Tröpfchen** gefrieren sofort, Lufteinschlüsse → weiß, porös | ca. –10 bis –20 °C; Schichtwolken | an Vorderkanten, leichter |
| **Mischeis** | Mischung | –5 bis –15 °C | |
| **Reif** (hoar frost) | Deposition von Wasserdampf an kalter Oberfläche | Flugzeug kälter als feuchte Umgebungsluft (z. B. Sinken in wärmere Luft, abgestelltes Flugzeug über Nacht) | vor dem Start **vollständig** entfernen! |

- **Stärkste Vereisung** bei Temperaturen zwischen **0 °C und –10 °C** in Wolken mit großen Tropfen.
- **Gefrierender Regen**: warme Schicht (über 0 °C) über kalter Schicht; meist **vor Warmfronten** im Winter → **sofort** aus dem Niederschlag, meist durch **Steigen** in die warme Schicht oder Umkehren.
- **Vergaservereisung**: durch Druck- und Temperaturabfall im Vergaser (Venturi, Kraftstoffverdunstung – bis ca. 20–30 °C Abkühlung). **Möglich bei Außentemperaturen von ca. –10 °C bis +30 °C**, besonders bei **hoher Luftfeuchte** und **Teillast** (Sinkflug); auch bei wolkenlosem Himmel! Gegenmaßnahme: **Vergaservorwärmung**.

> **Prüfungsfalle:** Vergaservereisung ist **nicht** an Temperaturen unter 0 °C gebunden – im **Sommer bei feuchtem Wetter** ist sie besonders häufig.

### 8.3 Turbulenz und Windscherung

| Turbulenzart | Ursache |
|---|---|
| **Thermische** | Konvektion an sonnigen Tagen, unter Cu |
| **Mechanische/Bodenturbulenz** | Wind über Hindernisse, Gebäude, Wald; stärker bei starkem Wind |
| **Orografische / Leewellen / Rotor** | Wind quer über Gebirge (Föhnlagen) |
| **Frontale** | an Kaltfronten, Böenlinien |
| **CAT** (Clear Air Turbulence) | Windscherungen in großer Höhe (Jetstream) – ohne Wolken |
| **Wirbelschleppen** | hinter großen Luftfahrzeugen (stärkste bei **schwer, langsam, sauber** = Start/Landung) |

**Windscherung** = Änderung von Windrichtung/-geschwindigkeit auf kurzer Strecke: an **Inversionen**, **Fronten**, **Gewittern/Microbursts**, hinter Hindernissen. Im Endanflug besonders gefährlich → Fahrtreserve, Durchstartbereitschaft.

---

## Kapitel 9 – Klimatologie (kurz)

- Österreich liegt in der **gemäßigten Westwindzone**, aber stark geprägt durch die **Alpen**: Wetter nördlich und südlich des Hauptkamms ist oft völlig verschieden (Stau auf der Luv-, Föhn auf der Leeseite).
- **Südoststeiermark / Fürstenfeld:** Übergang zum **pannonischen** (kontinentalen) Klima – warme Sommer, relativ trocken, aber die Steiermark gehört zu den **gewitterreichsten** Regionen Österreichs (Wärmegewitter über dem Steirischen Randgebirge, Hagel).
- **Sommer**: Wärmegewitter ab Mittag/Nachmittag, zuerst über den Bergen, dann Verlagerung ins Vorland; morgens fliegen, nachmittags Gewitter beobachten.
- **Herbst/Winter**: **Hochnebel- und Inversionslagen** im Grazer Becken und im Alpenvorland, oft tagelang; über der Inversion strahlend schön (Berge frei) – Vorsicht: Wiederabstieg durch die Nebeldecke ist nicht möglich.
- **Frühjahr**: labile Rückseitenluft mit Schauern und Graupel; in den Alpen noch Schnee, Vereisung in Wolken.
- **Föhn**: **Südföhn** (Strömung aus Süden → Föhn nördlich des Hauptkamms, z. B. Innsbruck) und **Nordföhn**; starke Turbulenz, Rotoren und Leewellen.

---

---

## Kapitel 10 – Flugwetterinformationen

### 10.1 Produkte in Österreich (Austro Control Flugwetterdienst)

| Produkt | Inhalt | Gültigkeit / Ausgabe |
|---|---|---|
| **METAR** | Routine-Wettermeldung eines Flugplatzes (Beobachtung) | **halbstündlich** oder stündlich |
| **SPECI** | Sonderwettermeldung bei signifikanter Änderung | bei Bedarf |
| **TREND** | Kurzfristvorhersage am METAR angehängt | **2 Stunden** |
| **TAF** | Flugplatzvorhersage | **9 Stunden** (kurzer TAF) oder **24/30 Stunden** (langer TAF) |
| **SIGMET** | Warnung vor gefährlichen Wettererscheinungen in einer FIR (z. B. schwere Turbulenz, schwere Vereisung, eingelagerte Gewitter, Vulkanasche) | max. **4 Stunden** (Vulkanasche bis 6 h) |
| **AIRMET** | Warnung vor Wettererscheinungen, die für Flüge im **unteren Luftraum** gefährlich sind (z. B. mäßige Vereisung/Turbulenz, verdeckte Berge, verbreitet Sicht < 5 km) | max. 4 Stunden [prüfen: Ausgabe für FIR Wien] |
| **GAFOR** (Austro Control) | **Gebietsvorhersage für Sichtflüge** entlang festgelegter **GAFOR-Routen** (u. a. über die Alpenpässe), Einstufung **O/D/M/X** für aufeinanderfolgende Zeiträume | mehrmals täglich [prüfen: Zeiträume] |
| **ALPFOR** | **grafische Alpenwettervorhersage** (Wolken, Sicht, Nullgradgrenze, Wind, Vereisung, Turbulenz) für den Alpenraum | **2× täglich**, u. a. Lauf um 12 UTC |
| **Low-Level-SWC Alps** | gemeinsam mit **MeteoSchweiz** erstellte Karte der signifikanten Wettererscheinungen für den Alpenraum (**SFC bis FL 250**) | mehrmals täglich |
| **Flugwetterübersicht** | Text-Übersicht über Wetterlage und Entwicklung für Österreich | mehrmals täglich (**wird nicht amendiert**) |
| **ATIS / VOLMET** | automatische Ansagen an Verkehrsflughäfen (z. B. Graz) bzw. Wetter mehrerer Flughäfen | laufend |
| **Homebriefing / Flugwetter-Tonband** | Briefing-Portal der Austro Control (homebriefing.com) bzw. Telefon **0900 97 9703** (kostenpflichtig) [prüfen] | – |

> **Praxis:** Das Wetterbriefing für einen Überlandflug soll **nicht älter als ca. 1 Stunde** sein. Für LOGF gibt es kein eigenes METAR/TAF – nimm **Graz (LOWG)** und die GAFOR-/ALPFOR-Produkte für das Südost-Gebiet und frage am Platz nach Wind/QNH („Fürstenfeld Radio“).

> **Prüfungsfalle:** Im ECQB werden **GAMET** und **AIRMET** nach **ICAO-Definition** gefragt: **AIRMET** = Warnung für den **unteren Luftraum** (bis FL 100, im Gebirge bis FL 150), **GAMET** = **Gebietsvorhersage** für niedrige Flughöhen im Abkürzungscode.

### 10.2 GAFOR-Einstufungen (Österreich)

| Stufe | Sicht | Wolkenuntergrenze (≥ 5/8) über der Bezugshöhe der Route |
|---|---|---|
| **O – Oscar** (offen/open) | **≥ 8 km** und | **≥ 2 000 ft** |
| **D – Delta** (schwierig/difficult) | **≥ 5 km** und | **≥ 1 500 ft** |
| **M – Mike** (kritisch/marginal) | **≥ 2 km** und | **≥ 1 000 ft** |
| **X – X-Ray** (geschlossen/closed) | **< 2 km** oder | **< 1 000 ft** |

Jede österreichische GAFOR-Route hat eine **Bezugshöhe** (höchster relevanter Geländepunkt bzw. Passhöhe). Die Wolkenuntergrenze bezieht sich auf diese Bezugshöhe, **nicht** auf den Talboden.

> **Unterschied zu Deutschland:** Das deutsche GAFOR (DWD) bewertet **Gebiete**, hat zusätzlich die Stufe **C (Charlie)** und andere Grenzwerte (D: 5 km/1 000 ft, M: 1,5 km/500 ft). In Österreich gibt es **kein C**, und die Werte sind wegen des Gebirges **strenger** [prüfen: aktuelle Grenzwerte lt. AIP GEN 3.5].

> **Eselsbrücke:** „**O**ffen – **D**ifficult – **M**arginal – **X** = zu“; Werte **8/2000 – 5/1500 – 2/1000**.

### 10.2a Gebirgsflug-Wetter (Alpen)

| Gefahr | Worauf achten |
|---|---|
| **Verdeckte Pässe/Gipfel** | Wolkenbasis im Tal sagt nichts über die Passhöhe; GAFOR-Route (Bezugshöhe) und ALPFOR prüfen, immer einen **Umkehrplan** haben |
| **Föhn** | Leeseite: Turbulenz, **Rotoren**, Leewellen; Luvseite: Stau, Wolken bis zum Boden |
| **Tal- und Bergwinde** | tagsüber talaufwärts (Talwind), nachts talabwärts; Hangaufwinde auf der Sonnenseite, Abwinde auf der Schattenseite → Talflug an der **Luv-/Sonnenseite** |
| **Gewitter** | entstehen früh über den Bergen, versperren Pässe; ab Mittag Rückweg einplanen |
| **Dichtehöhe** | hohe Plätze + Hitze → deutlich längere Startstrecke, schwächere Steigleistung |
| **Nullgradgrenze/Vereisung** | ALPFOR liefert die Nullgradgrenze; Wolken über Gipfelniveau oft vereisungsgefährdet |

### 10.3 METAR lesen

**Beispiel:**
`METAR LOWG 161220Z 24012G25KT 200V280 6000 -SHRA SCT015 BKN030CB 14/09 Q1008 TEMPO 3000 TSRA BKN012CB`

| Teil | Bedeutung |
|---|---|
| `LOWG` | Graz (nächster METAR-Platz für Fürstenfeld) |
| `161220Z` | 16. des Monats, 12:20 **UTC** |
| `24012G25KT` | Wind aus **240° rechtweisend**, 12 kt, **Böen 25 kt** |
| `200V280` | Richtung schwankt zwischen 200° und 280° |
| `6000` | Sicht 6 000 m (`9999` = 10 km oder mehr) |
| `-SHRA` | leichter Regenschauer |
| `SCT015` | 3–4/8 in **1 500 ft über Platz** |
| `BKN030CB` | 5–7/8 in 3 000 ft mit **Cumulonimbus** → Ceiling 3 000 ft |
| `14/09` | Temperatur 14 °C, Taupunkt 9 °C (Spread 5) |
| `Q1008` | **QNH** 1008 hPa |
| `TEMPO 3000 TSRA BKN012CB` | zeitweise Sicht 3 000 m, Gewitter mit Regen, Ceiling 1 200 ft |

> **Prüfungsfalle:** Wolkenhöhen im METAR/TAF sind **Höhen über Platz (AGL)** in Hundert Fuß, **nicht** MSL.

**Weitere Codes:**

| Code | Bedeutung |
|---|---|
| **CAVOK** | Sicht **≥ 10 km**, **keine Wolken unter 5 000 ft** (oder unter der höchsten Mindestsektorhöhe, falls höher), **kein Cb/TCU**, **keine signifikanten Wettererscheinungen** |
| **NOSIG** | keine signifikante Änderung in den nächsten 2 h erwartet |
| **R23/0600** | Pistensichtweite (RVR) Piste 23: 600 m |
| **M02/M05** | M = minus: –2 °C / –5 °C |
| **WS R27** | Windscherung Piste 27 |
| **NSW** | keine signifikanten Wettererscheinungen mehr (in Vorhersagen) |

### 10.4 TAF lesen

**Beispiel:**
`TAF LOWW 161100Z 1612/1718 26010KT 9999 SCT030 BECMG 1614/1616 30018G30KT TEMPO 1616/1620 4000 TSRA BKN025CB PROB30 1702/1706 0800 FG`

| Gruppe | Bedeutung |
|---|---|
| `1612/1718` | gültig vom 16. 12 UTC bis 17. 18 UTC (30-h-TAF) |
| `BECMG 1614/1616` | **allmähliche, dauerhafte Änderung** zwischen 14 und 16 UTC |
| `TEMPO 1616/1620` | **zeitweise** Schwankungen (jeweils < 1 h, insgesamt < Hälfte des Zeitraums) |
| `PROB30` | **Wahrscheinlichkeit 30 %** (nur 30 oder 40 zulässig) |
| `FM` | ab einem Zeitpunkt (from) gilt ein neuer Zustand |

---

## Typische Prüfungsfallen

1. **„Vom Hoch ins Tief – geht's schief“** und **„von warm nach kalt – wird's knapp“**: In beiden Fällen ist man **tiefer** als angezeigt.
2. **METAR-Wind rechtweisend**, **Turm/ATIS missweisend**.
3. **Bodenwind** ist gegenüber dem Höhenwind **schwächer** und **nach links gedreht** (Nordhalbkugel); beim Steigen dreht er **nach rechts** und nimmt zu.
4. **Strahlungsnebel** braucht **klare Nacht und schwachen Wind** – nicht Windstille, nicht starken Wind.
5. **Advektionsnebel** entsteht durch **warme feuchte Luft über kaltem Boden** und kann auch bei Wind bestehen.
6. **Warmfront:** Niederschlag **vor** der Front, Wolkenfolge Ci–Cs–As–Ns; **Kaltfront:** Cb und Schauer, danach gute Sicht.
7. **Gewitter-Reifestadium** = Auf- **und** Abwinde, Niederschlag am Boden – gefährlichste Phase.
8. **Klareis** ist gefährlicher als Raueis, Hauptbereich **0 bis –10 °C**.
9. **Vergaservereisung** auch bei **+20 °C** und hoher Feuchte, besonders bei **Teillast**.
10. **Wolkenhöhen** im METAR sind **über Platz**; Ceiling = **BKN/OVC**, nicht SCT.
11. **CAVOK** heißt nicht „wolkenlos“, sondern keine Wolken **unter 5 000 ft** (bzw. MSA) und kein Cb/TCU.
12. **Feuchte Luft ist leichter** als trockene → höhere Dichtehöhe.
13. **Föhn**: im Lee **wärmer und trockener**, aber **Rotoren und Leewellen**.
14. **GAFOR Österreich**: Stufen **O/D/M/X** (kein C), Wolkenuntergrenze über der **Bezugshöhe der Route**, nicht über Talboden.
15. **ALPFOR** = grafische Alpenvorhersage, **Low-Level-SWC Alps** = SFC bis FL 250 (mit MeteoSchweiz).

---

## Kurz-Zusammenfassung

- **Atmosphäre:** Wetter in der Troposphäre (Tropopause ca. 11 km in mittleren Breiten). **ISA**: 15 °C, 1013,25 hPa, –2 °C/1 000 ft, –56,5 °C ab 11 km; 1 hPa ≈ 27–30 ft.
- **Höhenmessung:** QNH → Altitude, QFE → Height, 1013,2 → FL. Hoch→Tief und warm→kalt: man ist **tiefer** als angezeigt.
- **Wind:** Druckgradient + Coriolis (rechts auf der Nordhalbkugel) + Reibung; Bodenwind schwächer und zurückgedreht (Land 30°, See 10°). Hoch im Uhrzeigersinn, Tief gegen den Uhrzeigersinn; Buys-Ballot: Rücken zum Wind, Tief links.
- **Thermodynamik:** trocken 1 °C/100 m, feucht ca. 0,6 °C/100 m; Wolkenbasis ≈ Spread × 400 ft; stabil = Schicht, labil = Quell; Föhn: Lee warm und trocken.
- **Wolken/Nebel:** hoch Ci/Cc/Cs, mittel Ac/As, tief St/Sc, Ns, Cu/Cb; Nebel < 1 000 m, BR 1–5 km; Strahlungs- vs. Advektionsnebel.
- **Fronten:** Warmfront flach, Dauerregen davor; Kaltfront steil, Cb/Böen, danach gute Sicht; Wind dreht beim Durchgang rechts.
- **Gefahren:** Gewitter (labil + feucht + Auslösung; Reifestadium; ≥ 10 NM Abstand), Klareis 0 bis –10 °C, Vergaservereisung bis +30 °C, Leewellen/Rotoren, Windscherung, Microbursts.
- **Informationen (Austro Control):** METAR/SPECI, TREND (2 h), TAF (9/24/30 h), SIGMET (4 h), AIRMET, Low-Level-SWC Alps, ALPFOR und **GAFOR** (O ≥8 km/2 000 ft, D ≥5 km/1 500 ft, M ≥2 km/1 000 ft, X darunter – jeweils über Bezugshöhe der Route).

---

## Kontrollfragen

1. Wie hoch ist die ISA-Temperatur in 8 000 ft, und wie groß ist die ISA-Abweichung, wenn dort +4 °C gemessen werden?
2. Du fliegst mit eingestelltem QNH 1018 hPa auf 2 500 ft in ein Gebiet mit QNH 1006 hPa, ohne nachzustellen. Wie hoch bist du tatsächlich (ungefähr)?
3. Warum weht der Bodenwind nicht parallel zu den Isobaren, und in welche Richtung weicht er ab?
4. Am Boden misst du 26 °C und einen Taupunkt von 16 °C. In welcher Höhe über Grund liegt ungefähr die Basis der Quellwolken?
5. Nenne die Bedingungen für Strahlungsnebel.
6. Beschreibe die Wolkenfolge beim Herannahen einer Warmfront und den Niederschlagscharakter.
7. Welche drei Voraussetzungen braucht ein Gewitter, und welches Stadium ist das gefährlichste?
8. In welchem Temperaturbereich und unter welchen Bedingungen ist die Gefahr von Klareis am größten?
9. Bei welchen Bedingungen ist Vergaservereisung besonders wahrscheinlich?
10. Was bedeutet `CAVOK`?
11. Das österreichische GAFOR meldet für deine Route über den Packsattel „M“. Was bedeutet das für deinen Sichtflug?
12. Erkläre im METAR `BKN008 OVC015 02/01 Q1021` die Bedeutung für einen VFR-Anflug in eine Kontrollzone.

### Lösungen

1. \(15 - 2 \times 8 = -1\,°C\). Gemessene +4 °C → **ISA + 5**.
2. Differenz 12 hPa × 30 ft ≈ **360 ft** → tatsächlich ca. **2 140 ft MSL** (tiefer als angezeigt – „vom Hoch ins Tief geht's schief“).
3. In der **Reibungsschicht** verringert die Bodenreibung die Windgeschwindigkeit und damit die Corioliskraft; die Druckgradientkraft überwiegt. Der Wind wird **zurückgedreht (nach links)** und weht schräg **ins Tief** (Land ca. 30°, Wasser ca. 10°).
4. Spread 10 °C × 400 ft ≈ **4 000 ft (ca. 1 250 m) über Grund**.
5. **Klare Nacht** (starke Ausstrahlung), **schwacher Wind** (ca. 2–8 kt), **hohe Luftfeuchte / kleiner Spread**, meist **Hochdrucklage** im Herbst/Winter.
6. **Ci → Cs (Halo) → As → Ns** (später St). **Lang anhaltender, gleichmäßiger Landregen** schon weit vor der Bodenfront; Sichten und Untergrenzen sinken, im Winter gefrierender Regen möglich.
7. **Labile Schichtung, genügend Feuchte, Auslösung (Hebung)**. Das **Reifestadium** (Auf- und Abwinde, Niederschlag, Blitze, Hagel, Böenfront).
8. Zwischen **0 °C und ca. –10 °C**, bei **großen unterkühlten Tropfen** – in **Cu/Cb** und bei **gefrierendem Regen/Niesel**.
9. Bei **hoher Luftfeuchte** und Außentemperaturen von etwa **–10 °C bis +30 °C**, besonders im **Teillast-/Leerlaufbetrieb** (Sinkflug), auch bei wolkenlosem Himmel.
10. **Ceiling and Visibility OK**: Sicht **≥ 10 km**, **keine Wolken unter 5 000 ft** (bzw. unter der höchsten Mindestsektorhöhe), **keine Cb/TCU**, **keine signifikanten Wettererscheinungen**.
11. **Kritisch (marginal)**: Sicht nur **2 bis < 5 km** und/oder Wolkenuntergrenze nur **1 000 bis < 1 500 ft über der Bezugshöhe** (Passhöhe) – für einen Flugschüler bzw. jungen PPL-Piloten über das Gebirge **nicht geeignet**; Route ums Gebirge oder Flug verschieben.
12. Ceiling **800 ft** (BKN008), Temperatur 2 °C / Taupunkt 1 °C (sehr kleiner Spread → Nebelneigung), QNH 1021 hPa. Für VFR in eine CTR ist ein Ceiling von **mindestens 1 500 ft** nötig → **kein normales VFR**, allenfalls **Sonder-VFR** (Ceiling ≥ 600 ft, Bodensicht ≥ 1 500 m) – Vorsicht, Vereisungsgefahr in den Wolken knapp über 0 °C.

---

## Quellen

- ICAO Doc 7488 *Manual of the ICAO Standard Atmosphere*; ICAO Annex 3 *Meteorological Service for International Air Navigation* (METAR/TAF/SIGMET-Codes, CAVOK).
- EASA, AMC1 FCL.115/FCL.120 – Lehrplan PPL/LAPL, Fach „Meteorology“ – https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-aircrew-regulation-eu-no-11782011
- Austro Control, *Flugwetter / Homebriefing* (GAFOR, ALPFOR, Low-Level-SWC Alps, Flugwetterübersicht) – https://www.homebriefing.com/ und https://www.austrocontrol.at/flugwetter
- Austro Control, *AIP Austria GEN 3.5 – Meteorological Services* (GAFOR-Kategorien, Produkte) – https://eaip.austrocontrol.at/
- MeteoSchweiz / Austro Control, *Low Level SWC Alps* – https://www.meteoschweiz.admin.ch/
- DWD, *GAFOR* (zum Vergleich der deutschen Einstufung) – https://www.dwd.de/SharedDocs/broschueren/DE/luftfahrt/gafor.pdf
- UK CAA Safety Sense Leaflet 14 *Piston Engine Icing* (Vergaservereisung, Temperatur-/Feuchtebereiche) – https://www.caa.co.uk
- FAA *Aviation Weather Handbook* (FAA-H-8083-28) – Gewitterstadien, Microbursts, Vereisung – https://www.faa.gov/regulations_policies/handbooks_manuals/aviation
