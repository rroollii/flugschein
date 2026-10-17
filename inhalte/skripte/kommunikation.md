# Kommunikation (Sprechfunk VFR) – Lernskript PPL(A) mit Flugfunk-Zeugnis (Österreich)

> **Prüfungsfach 40 – Kommunikation** (Communications). Bei der **Austro Control**: **12 Fragen, 25 Minuten, Bestehensgrenze 75 %** (also mind. 9 richtige Antworten).
> Zusätzlich brauchst du in Österreich ein **Flugfunk-Zeugnis** des **Fernmeldebüros** (**BFZ** oder – empfohlen – **EFZ**). Diese Prüfung hat einen eigenen Fragenkatalog und einen praktischen Teil (siehe Kapitel 9).
> Stand der Recherche: Oktober 2026. Maßgeblich sind **SERA Teil 14**, die **AIP Austria (GEN 3.4)** und die Austro-Control-**AIC A 8/25** zu den Sprechfunkverfahren (gültig seit 01.05.2025) [prüfen: AIC-Nummer/Inhalt]. Funkbeispiele mit Bezug auf **Fürstenfeld (LOGF)** und **Graz (LOWG)**; Frequenzen, Pisten und Meldepunkte immer mit aktueller AIP/ICAO-Karte abgleichen.

---

## Lernziele

Nach Durcharbeiten dieses Skripts kannst du …

1. die Rechtsgrundlagen des Flugfunks in Österreich und die Arten der Flugfunk-Zeugnisse (BFZ, EFZ, AFZ) nennen.
2. Ausbreitung und Reichweite von UKW-Funkwellen erklären und die Reichweite abschätzen.
3. Buchstabieralphabet, Zahlenaussprache, Zeitangaben und Rufzeichen (vollständig und abgekürzt) normgerecht verwenden.
4. Standardwörter und -redewendungen (Deutsch und Englisch) korrekt einsetzen und wissen, was zurückgelesen werden muss.
5. typische VFR-Funkgespräche führen: Abflug und Anflug an kontrollierten Flugplätzen, FIS, unkontrollierte Plätze („Radio“), RMZ/TMZ.
6. wetterbezogene Begriffe (ATIS, QNH, Wind, CAVOK) im Funk verstehen und verwenden.
7. die Verfahren bei Funkausfall sowie den Not- und Dringlichkeitsverkehr (MAYDAY, PAN PAN) sicher anwenden.

---

## Kapitel 1 – Grundlagen und Begriffe

### 1.1 Rechtsgrundlagen

| Vorschrift | Inhalt |
|---|---|
| **SERA Teil 14** (VO (EU) 923/2012) | europäische Sprechfunkverfahren (SERA.14001 ff.) |
| **AIP Austria GEN 3.4** / **AIC** der Austro Control | österreichische Sprechfunkverfahren und Sprechgruppen DE/EN, Rufzeichen „Radio“ |
| **LVR 2014** | ergänzende Regeln (z. B. RMZ, Transponder § 30, Entfall von „operations normal“ § 27a) |
| **Funker-Zeugnisgesetz 1998 / FZV** | Flugfunk-Zeugnisse **BFZ / EFZ / AFZ**, Prüfung durch das **Fernmeldebüro** |
| Bewilligung der Bordfunkstelle | Fernmeldebüro; Funkgeräte müssen **8,33-kHz**-fähig sein |
| FCL.055 | Sprachvermerk in der Lizenz (Austro Control) |

### 1.2 Wichtige Begriffe

| Begriff | Bedeutung |
|---|---|
| **Bodenfunkstelle** | Funkstelle am Boden (Tower, FIS, Flugleiter) |
| **Luftfunkstelle** | Funkstelle an Bord eines Luftfahrzeugs |
| **Blindsendung** | Übermittlung einer Meldung, wenn **keine Zweiwegeverbindung** hergestellt werden kann, in der Annahme, dass die Gegenstelle sie trotzdem empfängt |
| **Rundsendung** (Broadcast) | Übermittlung an **nicht bestimmte** Empfänger (z. B. ATIS) |
| **Flugsicherheitsmeldung** | Meldung über Bewegung/Kontrolle von Luftfahrzeugen |
| **Flugverkehrsdienststelle** | ATC oder FIS (AFIS gibt es in Österreich nicht) |
| **Hörbereitschaft** | ständiges Abhören einer Frequenz |
| **Rücklesen (Read back)** | Wiederholen sicherheitsrelevanter Teile einer Freigabe |

### 1.3 Rangfolge der Meldungen (SERA.14005)

| Rang | Meldungsart | Signal |
|---|---|---|
| 1 | **Notmeldungen** | **MAYDAY** |
| 2 | **Dringlichkeitsmeldungen** | **PAN PAN** |
| 3 | Meldungen zur **Peilung** (Direction Finding) | – |
| 4 | **Flugsicherheitsmeldungen** | – |
| 5 | **Wettermeldungen** | – |
| 6 | **Flugbetriebsmeldungen** | – |

> **Eselsbrücke:** „**N**ot – **D**ringend – **P**eilung – **S**icherheit – **W**etter – **B**etrieb“ → „**N**ur **D**ie **P**iloten **S**ind **W**irklich **B**rav“.

---

## Kapitel 2 – Funkwellen und Frequenzen

### 2.1 Frequenzbereiche

| Band | Frequenzen | Nutzung |
|---|---|---|
| LF/MF | 30 kHz – 3 MHz | NDB (ca. 190–1 750 kHz) |
| HF (Kurzwelle) | 3 – 30 MHz | Langstrecken-Sprechfunk (Ozean), Ausbreitung über **Raumwelle** (Ionosphäre) |
| **VHF (UKW)** | **30 – 300 MHz** | **Flugfunk Sprechfunk 118,000 – 136,975 MHz**; VOR/ILS 108–118 MHz |
| UHF | 300 MHz – 3 GHz | Militärfunk, DME, Transponder (1030/1090 MHz), GPS |

- **Kanalraster** im Flugfunk: **8,33 kHz** (in Europa vorgeschrieben); angegeben wird der **Kanal** (6 Ziffern), nicht die physikalische Frequenz.
- **Notfrequenz**: **121,500 MHz** (wird von vielen Stellen abgehört). **Luft-Luft-Frequenz** (Europa): 123,450 MHz.

### 2.2 Ausbreitung von UKW

- UKW breitet sich **quasioptisch** (geradlinig, **Sichtlinie**) aus → Reichweite hängt von der **Höhe von Sender und Empfänger**, der Sendeleistung und dem Gelände ab; Berge erzeugen **Funkschatten**.
- **Keine** Ausbreitung über Raumwelle (Ionosphäre) → nur eingeschränkt durch Wetter, nicht durch Tageszeit.

**Faustformel Reichweite:**
\[ R\,[\text{NM}] \approx 1{,}23 \times \left(\sqrt{h_1\,[\text{ft}]} + \sqrt{h_2\,[\text{ft}]}\right) \]
Bei einer Bodenstation in Bodenhöhe genügt \(1{,}23 \times \sqrt{h}\).

**Beispiel:** Flughöhe 2 500 ft über der Station → \(1{,}23 \times 50 \approx\) **62 NM**. In 1 000 ft → ca. 39 NM.

> **Prüfungsfalle:** Hohe Sendeleistung erhöht die UKW-Reichweite **kaum über die Sichtlinie** hinaus – entscheidend ist die **Höhe**.

### 2.3 Funkgerät richtig bedienen

- **Erst hören, dann sprechen** – nie in laufende Gespräche oder Antworten hineinsenden.
- Sendetaste (PTT) **drücken, kurz warten, dann sprechen**; Taste **erst nach dem letzten Wort** loslassen.
- Gleichmäßige Lautstärke, normales Tempo (ca. **100 Wörter/min**), Mikrofon nah am Mund.
- **Hängende Sendetaste** (stuck mike) blockiert die Frequenz für alle.
- Funkprobe mit „**RADIO CHECK**“ / „**Funkprobe**“; Testsendungen höchstens ca. **10 Sekunden**.

**Verständlichkeitsskala (Funkprobe):**

| Stufe | Bedeutung |
|---|---|
| 1 | **unverständlich** (unreadable) |
| 2 | **zeitweise verständlich** (readable now and then) |
| 3 | **schwer verständlich** (readable but with difficulty) |
| 4 | **verständlich** (readable) |
| 5 | **sehr gut verständlich** (perfectly readable) |

---

## Kapitel 3 – Buchstabieren, Zahlen, Zeit

### 3.1 Buchstabieralphabet (ICAO)

| Buchstabe | Wort | Buchstabe | Wort |
|---|---|---|---|
| A | **ALFA** | N | NOVEMBER |
| B | BRAVO | O | OSCAR |
| C | CHARLIE | P | PAPA |
| D | DELTA | Q | QUEBEC |
| E | ECHO | R | ROMEO |
| F | FOXTROT | S | SIERRA |
| G | GOLF | T | TANGO |
| H | HOTEL | U | UNIFORM |
| I | INDIA | V | VICTOR |
| J | **JULIETT** | W | WHISKEY |
| K | KILO | X | X-RAY |
| L | LIMA | Y | YANKEE |
| M | MIKE | Z | ZULU |

> **Prüfungsfalle:** Schreibweise **ALFA** (nicht Alpha) und **JULIETT** (zwei t) – damit Nicht-Englischsprachige richtig aussprechen.

### 3.2 Zahlen

| Ziffer | Deutsch | Englisch (Aussprache) |
|---|---|---|
| 0 | NULL | ZERO |
| 1 | EINS | ONE (WUN) |
| 2 | **ZWO** | TWO (TOO) |
| 3 | DREI | THREE (**TREE**) |
| 4 | VIER | FOUR (**FOW-er**) |
| 5 | FÜNF | FIVE (**FIFE**) |
| 6 | SECHS | SIX |
| 7 | SIEBEN | SEVEN |
| 8 | ACHT | EIGHT (AIT) |
| 9 | NEUN | NINE (**NIN-er**) |
| , | **KOMMA** | **DECIMAL** |
| 100 | HUNDERT | HUNDRED |
| 1000 | TAUSEND | THOUSAND (TOU-SAND) |

**Regeln (SERA.14035 / AIP GEN 3.4):**

| Information | Übermittlung | Beispiel |
|---|---|---|
| Rufzeichen, Steuerkurse, Pisten, Windrichtung/-geschwindigkeit | **jede Ziffer einzeln** | „PISTE ZWO SIEBEN“, „STEUERKURS NULL ACHT NULL“, „WIND ZWO NULL NULL GRAD SIEBEN KNOTEN“ |
| Flugflächen | einzeln, außer ganze Hunderter | „FLUGFLÄCHE EINS ACHT NULL“, „FLUGFLÄCHE ZWO HUNDERT“ |
| QNH | einzeln, Ausnahme 1000 | „QNH EINS NULL NULL NEUN“, „QNH NEUN NEUN DREI“, „QNH EIN TAUSEND“ |
| Transpondercodes | einzeln, Ausnahme ganze Tausender | „SQUAWK ZWO VIER NULL NULL“, „SQUAWK SIEBEN TAUSEND“ |
| Höhen, Wolkenhöhen, Sichten | ganze Hunderter/Tausender mit HUNDERT/TAUSEND | „DREI TAUSEND VIER HUNDERT“ (3 400 ft), „SICHT SIEBEN HUNDERT“ |
| **Frequenzen** | alle **sechs** Ziffern; nur wenn 5. und 6. Ziffer **null** sind, die ersten vier | 118,000 → „EINS EINS ACHT KOMMA NULL“; 118,005 → „EINS EINS ACHT KOMMA NULL NULL FÜNF“; 123,450 → „EINS ZWO DREI KOMMA VIER FÜNF NULL“ |
| Verkehr nach Uhrzeigerstellung | zusammen | „ZEHN UHR“, „ELEVEN O'CLOCK“ |

### 3.3 Zeitangaben

- Im Flugfunk immer **UTC** („Zulu“). Österreich: MEZ = UTC + 1, MESZ = UTC + 2 (Öffnungszeiten der Flugplätze, z. B. LOGF, sind oft in Lokalzeit angegeben – umrechnen!).
- Normalerweise nur die **Minuten** nennen („**Minute 25**“ bzw. „**two five**“); wenn Verwechslung möglich, mit Stunde („**eins vier zwo fünf**“).
- **Zeitkontrolle** („TIME CHECK“) auf die nächste halbe Minute.

---

## Kapitel 4 – Rufzeichen

### 4.1 Rufzeichen von Bodenfunkstellen (SERA.14050, AIP Austria)

| Dienst | Zusatz DE | Zusatz EN | Beispiel Österreich |
|---|---|---|---|
| Bezirkskontrolle | KONTROLLE | CONTROL | „Wien Kontrolle“ |
| Anflugkontrolle | RADAR / ANFLUGKONTROLLE | APPROACH | „**Graz Radar**“, „Wien Radar“ |
| Flugplatzkontrolle | **TURM** | **TOWER** | „**Graz Turm**“ / „Graz Tower“ |
| Rollkontrolle | **ROLLKONTROLLE** | **GROUND** | „Wien Rollkontrolle“ / „Vienna Ground“ |
| Freigaben | – | DELIVERY | „Vienna Delivery“ |
| **Fluginformationsdienst (FIS)** | **INFORMATION** | INFORMATION | „**Wien Information**“ |
| **Flugplatzbetriebsleiter** an unkontrollierten Plätzen | **RADIO** | **RADIO** | „**Fürstenfeld Radio**“ (122,705) |

> **Prüfungsfalle (Österreich, seit 28.12.2023):** Die Funkstelle des Flugplatzbetriebsleiters an einem unkontrollierten Platz heißt **„… Radio“** (vorher „… Flugplatz“). Sie ist **kein Flugverkehrsdienst**, erteilt **keine Freigaben**, sondern gibt nur **Informationen** (Piste, Wind, QNH, Verkehr). **AFIS** gibt es in Österreich nicht.

### 4.2 Rufzeichen von Luftfahrzeugen

| Typ | Vollständig | Abgekürzt |
|---|---|---|
| **a) Eintragungszeichen** | OE-DTT → „**OSCAR ECHO DELTA TANGO TANGO**“ (auch mit Hersteller/Muster: „Cessna OE-DTT“) | **erstes Zeichen + mindestens die letzten zwei**: „**OSCAR TANGO TANGO**“ (O-TT) bzw. „Cessna TT“ |
| b) Betreiber + letzte 4 Zeichen | „VARIG PVMA“ | „VARIG MA“ |
| c) Betreiber + Flugnummer | „Austrian 123“ | **keine** Abkürzung |

- **Abkürzen erst**, wenn **die Bodenfunkstelle** das abgekürzte Rufzeichen **zuerst verwendet** hat.
- Rufzeichentyp darf während des Flugs nicht gewechselt werden (außer auf Anweisung).
- Bei ähnlich klingenden Rufzeichen kann ATC verlangen, das **vollständige** Rufzeichen zu verwenden.

---

## Kapitel 5 – Standardwörter und Verfahren

### 5.1 Standardwörter (Auswahl, SERA/AIP Austria)

| Englisch | Deutsch | Bedeutung |
|---|---|---|
| **ACKNOWLEDGE** | BESTÄTIGEN SIE | Teilen Sie mit, dass Sie die Meldung erhalten und verstanden haben |
| **AFFIRM** | **POSITIV** | Ja |
| **NEGATIVE** | **NEGATIV** | Nein / nicht erteilt / nicht richtig / nicht in der Lage |
| **APPROVED** | GENEHMIGT | Erlaubnis für das vorgeschlagene Verfahren |
| **BREAK** | TRENNUNG | Trennung zwischen Teilen einer Meldung |
| **CANCEL** | AUFGEHOBEN | vorherige Freigabe aufgehoben |
| **CLEARED** | **FREI** | Genehmigung, unter festgelegten Bedingungen zu verfahren |
| **CONFIRM** | BESTÄTIGEN SIE | Ich erbitte Bestätigung von … |
| **CONTACT** | **RUFEN SIE** | Stellen Sie Funkverbindung her mit … |
| **CORRECT** | KORREKT | richtig |
| **CORRECTION** | **BERICHTIGUNG** | Fehler bei der Übermittlung, richtig heißt es … |
| **DISREGARD** | **IGNORIEREN SIE** | Betrachten Sie die Meldung als nicht gesendet |
| **HOW DO YOU READ** | **WIE VERSTEHEN SIE MICH** | Frage nach der Verständlichkeit |
| **I SAY AGAIN** | ICH WIEDERHOLE | zur Klarstellung/Betonung |
| **MAINTAIN** | BEHALTEN SIE … BEI / BLEIBEN SIE | – |
| **MONITOR** | MONITOR | Frequenz abhören |
| **OVER** | KOMMEN | Ich erwarte Ihre Antwort (bei VHF meist weggelassen) |
| **OUT** | ENDE | Keine Antwort erwartet (bei VHF meist weggelassen) |
| **READ BACK** | WIEDERHOLEN SIE WÖRTLICH | – |
| **REPORT** | MELDEN SIE | – |
| **REQUEST** | ERBITTE | Ich möchte wissen / beantrage |
| **ROGER** | **VERSTANDEN** | Ich habe Ihre letzte Meldung **vollständig erhalten** |
| **SAY AGAIN** | WIEDERHOLEN SIE | – |
| **SPEAK SLOWER** | SPRECHEN SIE LANGSAMER | – |
| **STANDBY** | STANDBY | **Warten Sie, ich rufe Sie** |
| **UNABLE** | NICHT MÖGLICH | Ich kann nicht Folge leisten |
| **WILCO** | WILCO | **Ich habe verstanden und werde entsprechend handeln** |
| **WORDS TWICE** | WORTE DOPPELT | jedes Wort doppelt senden |

> **Prüfungsfallen:**
> – **ROGER** ist **keine** Antwort auf eine Frage und **kein** Ersatz für ein Rücklesen.
> – **ROGER/WILCO** reichen **nicht** als Bestätigung für „HALTEN SIE / HOLD SHORT“ – Antwort immer „**HALTE (KURZ VOR …)**“ / „**HOLDING (SHORT)**“.
> – „**TAKE-OFF / START**“ darf nur gesagt werden, wenn **Startfreigabe** erteilt oder aufgehoben wird – sonst „**DEPARTURE / ABFLUG**“.
> – **STANDBY** ist keine Erlaubnis und keine Ablehnung – einfach warten.

### 5.2 Rücklesepflicht (Read back, SERA.8015)

**Immer zurücklesen:**
1. **Streckenfreigaben**;
2. Freigaben und Anweisungen zum **Aufrollen auf, Landen auf, Starten von, Halten vor, Kreuzen von, Rollen auf und Zurückrollen auf Pisten**;
3. **Betriebspiste**, **Höhenmessereinstellungen (QNH)**, **SSR-Codes (Squawk)**, **neu zugeteilte Funkkanäle (Frequenzen)**, **Höhenanweisungen**, **Kurs- und Geschwindigkeitsanweisungen**;
4. **Übergangsflächen** (Transition Level) – auch wenn sie aus der ATIS stammen.

Rücklesen endet mit dem **eigenen Rufzeichen**. Andere Freigaben (z. B. bedingte Freigaben, Rollanweisungen) zurücklesen oder so bestätigen, dass klar ist, dass sie verstanden wurden.

> **Eselsbrücke „PQRS-Höhe-Kurs-Speed“:** **P**iste, **Q**NH, **R**oute/Freigabe, **S**quawk, **F**requenz + **H**öhe, **K**urs, **G**eschwindigkeit.

### 5.3 Aufbau eines Funkgesprächs

**Erstanruf:** gerufene Stelle – eigenes Rufzeichen (– Meldung)
„**Graz Turm, OE-DTT**“ → Antwort: „**OE-DTT, Graz Turm**“ (oder direkt Anweisung).

**Erste Meldung (Inhalt nach SERA/AIP):** Rufzeichen – **Muster** – **Position** – **Höhe** – **ATIS-Kennung** (falls vorhanden) – **Absicht**.
Merkwort: „**Wer – Was – Wo – Wie hoch – Was will ich**“.

**Berichtigung:** „**BERICHTIGUNG**“ + richtiger Teil; „**BERICHTIGUNG, ICH WIEDERHOLE**“ + ganze Meldung.
**Unvollständig empfangen:** „**WIEDERHOLEN SIE ALLES NACH** (Wort)“ / „**… VOR** (Wort)“.

### 5.4 Positionsmeldung

**Rufzeichen – Position – Zeit – Höhe – nächster Punkt und voraussichtliche Zeit**
„O-TT, Therme Blumau Minute 32, 2 500 ft, Autobahnknoten Minute 37.“

---

## Kapitel 6 – Typische VFR-Funkgespräche

> Die folgenden Beispiele orientieren sich an Graz (LOWG) und Fürstenfeld (LOGF). **Pisten, Meldepunkte, Squawks und Frequenzen bei Graz sind beispielhaft** [prüfen: aktuelle Werte in AIP AD 2 LOWG und Sichtanflugkarte].

### 6.1 Abflug von einem kontrollierten Flugplatz (Deutsch, Graz)

| Wer | Funkspruch |
|---|---|
| Pilot | „**Graz Turm, OE-DTT, Cessna 172, VFR nach Fürstenfeld, Information Kilo, Abstellfläche Allgemeine Luftfahrt, erbitte Rollen.**“ |
| Turm | „O-TT, rollen Sie zum Rollhalt Piste 34C, QNH 1 0 1 5, Squawk 4 6 5 1.“ |
| Pilot | „Rolle zum Rollhalt Piste 34C, QNH 1 0 1 5, Squawk 4 6 5 1, O-TT.“ |
| Pilot | „O-TT, Rollhalt Piste 34C, abflugbereit.“ |
| Turm | „O-TT, Verlassen der Kontrollzone über Echo, Piste 34C, Wind 3 3 0 Grad 8 Knoten, Start frei.“ |
| Pilot | „Verlassen über Echo, Piste 34C, Start frei, O-TT.“ |
| Pilot | „O-TT, Echo, 2 500 Fuß, verlasse die Kontrollzone.“ |
| Turm | „O-TT, Verlassen der Frequenz genehmigt.“ |

### 6.2 Anflug auf einen kontrollierten Flugplatz (Englisch, Graz)

| Wer | Funkspruch |
|---|---|
| Pilot | „**Graz Tower, OE-DTT, C172, 10 miles east of Echo, 3 000 feet, information Lima, for landing.**“ |
| Tower | „O-TT, enter control zone via Echo, 2 500 feet or below, runway 34C, QNH 1 0 1 2, report Echo.“ |
| Pilot | „Enter control zone via Echo, 2 500 feet or below, runway 34C, QNH 1 0 1 2, wilco, O-TT.“ |
| Pilot | „O-TT, Echo.“ |
| Tower | „O-TT, join right downwind runway 34C, report downwind.“ |
| Pilot | „Join right downwind runway 34C, wilco, O-TT.“ |
| Tower | „O-TT, runway 34C, wind 330 degrees 10 knots, cleared to land.“ |
| Pilot | „Runway 34C, cleared to land, O-TT.“ |

### 6.3 Fluginformationsdienst (FIS) – Wien Information

| Wer | Funkspruch |
|---|---|
| Pilot | „**Wien Information, OE-DTT.**“ |
| FIS | „OE-DTT, Wien Information.“ |
| Pilot | „OE-DTT, Cessna 172, VFR von Fürstenfeld nach Zell am See, über Therme Blumau, 3 500 Fuß, **kein Flugplan** (negative flight plan), erbitte Verkehrsinformation.“ |
| FIS | „O-TT, Squawk 4 6 1 4, QNH 1 0 1 8.“ |
| Pilot | „Squawk 4 6 1 4, QNH 1 0 1 8, O-TT.“ |
| FIS | „O-TT, identifiziert, 3 500 Fuß, keine Verkehrsinformation, melden Sie Verlassen der Frequenz.“ |

Wien Information arbeitet u. a. auf **124,400** (Süd) und **134,625** (Nord), Betriebszeit ca. 07:00–21:00 LT [prüfen: aktuelle Sektoren/Frequenzen in ICAO-Karte 2026]. Die früher übliche Routinemeldung „**operations normal**“ ist in Österreich entfallen (§ 27a LVR).

FIS gibt **Informationen** (Verkehr, Wetter, aktive Gebiete, Flugplan öffnen/schließen), aber **keine Freigaben** und keine Staffelung.

### 6.4 Unkontrollierter Flugplatz – Fürstenfeld Radio (LOGF)

| Wer | Funkspruch |
|---|---|
| Pilot | „**Fürstenfeld Radio, OE-DTT, Cessna 172, Therme Blumau, 2 500 Fuß, zur Landung.**“ |
| Radio | „OE-DTT, Fürstenfeld Radio, Piste 30 in Benutzung, Wind 2 9 0 Grad 5 Knoten, QNH 1 0 1 5, ein Luftfahrzeug in der Platzrunde.“ |
| Pilot | „Piste 30, QNH 1 0 1 5, O-TT.“ |
| Pilot | „O-TT, Gegenanflug Piste 30.“ |
| Pilot | „O-TT, Queranflug Piste 30.“ |
| Pilot | „O-TT, Endanflug Piste 30.“ |
| Radio | „O-TT, Piste 30, Wind 2 8 0 Grad 6 Knoten.“ (keine Landefreigabe!) |

In Fürstenfeld liegt die **Platzrunde nördlich** des Platzes in **1 000 ft AGL**; Meldepunkte u. a. **AUTOBAHNKNOTEN (AK)**, **THERME BLUMAU (TH)**, **GOLFPLATZ (GZ)** und **JOBST (JO)** – Details in [Flugschule Fürstenfeld](../flugschule-fuerstenfeld.md). Ist niemand auf der Frequenz (Betrieb ohne Betriebsleiter), werden die Positionsmeldungen als **Blindsendungen** abgesetzt („Fürstenfeld Verkehr, …“) [prüfen: Wortlaut lt. AIP AD 2 LOGF].

**Bezeichnungen der Platzrunde:** **Abflug/Upwind** – **Querabflug/Crosswind** – **Gegenanflug/Downwind** – **Queranflug/Base** – **Endanflug/Final**.

### 6.5 RMZ und TMZ

- **RMZ:** Vor Einflug **Erstmeldung** an die veröffentlichte Stelle: „**Vöslau Radio, OE-DTT, Cessna 172, 5 Meilen westlich, 2 000 Fuß, Einflug in die RMZ, Durchflug nach Osten.**“ Danach Hörbereitschaft, beim Verlassen abmelden.
- **TMZ** (z. B. Innsbruck, Wien): **Mode-S-Transponder** mit Höhenübermittlung muss eingeschaltet sein; eine Funkmeldung ist nicht erforderlich, Hörbereitschaft bei Wien Information ist sinnvoll.

### 6.6 Bedingte Freigaben

„O-TT, **hinter** der landenden Boeing 737 rollen Sie auf Piste 23 und warten.“ – Pilot: „**Hinter** der landenden 737 rolle auf Piste 23 und warte, O-TT.“ Die **Bedingung** wird **zuerst** genannt und mit zurückgelesen; der Pilot muss das betreffende Luftfahrzeug **identifiziert** haben.

---

## Kapitel 7 – Wetterinformationen im Funk

| Begriff | Bedeutung |
|---|---|
| **ATIS** | Automatic Terminal Information Service: Rundsendung mit Kennbuchstabe (Alfa, Bravo …) – Piste, Wind, Sicht, Wolken, Temperatur, Taupunkt, QNH, Transition Level, Hinweise. Im Erstanruf „**Information Kilo erhalten**“ melden. |
| **VOLMET** | Rundsendung von Wettermeldungen mehrerer Flughäfen |
| **QNH** | Höhenmessereinstellung → Höhe über MSL |
| **QFE** | Höhenmessereinstellung → Höhe über Platz |
| **Wind** (Turm/ATIS) | **missweisend**, in Grad und Knoten; Böen „**Böen**/**gusting**“ |
| **CAVOK** | „**KAVOK**“: Sicht ≥ 10 km, keine Wolken unter 5 000 ft (bzw. MSA), kein Cb/TCU, kein signifikantes Wetter |
| **RVR** | Pistensichtweite |
| **Wolkenuntergrenze** | in ft über Platz |
| **Transition Level** | unterste nutzbare Flugfläche oberhalb der Übergangshöhe |

> **Prüfungsfalle:** Windangaben von **Turm/ATIS** sind **missweisend** (passend zur Pistenrichtung), im **METAR/TAF** **rechtweisend**.

---

## Kapitel 8 – Funkausfall, Not- und Dringlichkeitsverkehr

### 8.1 Funkausfall (VFR)

1. **Gerät prüfen**: Lautstärke, Squelch, Frequenz, Headset-Stecker, Sicherung, PTT, ggf. zweites Gerät/anderes Headset.
2. Andere Frequenz versuchen (z. B. vorherige Stelle, FIS, **121,500**).
3. Transponder **7600**.
4. **Blindsendung**: beginnt mit „**BLINDSENDUNG**“ / „**TRANSMITTING BLIND**“; Meldung **zweimal** senden; **Zeitpunkt der nächsten** beabsichtigten Übermittlung angeben.
5. Bei **Empfängerausfall**: „**BLINDSENDUNG WEGEN EMPFÄNGERAUSFALL**“ / „**TRANSMITTING BLIND DUE TO RECEIVER FAILURE**“, Meldung **vollständig wiederholen**, nächste Sendezeit und Absicht angeben.
6. **In VMC bleiben**, den nächsten geeigneten Flugplatz anfliegen, **landen** und die Landung schnellstmöglich der zuständigen Stelle (telefonisch) melden.

**An/zu kontrollierten Flugplätzen:**

| Situation | Verhalten |
|---|---|
| **Vor** Erhalt/Bestätigung der Einflugfreigabe in die CTR | **nicht einfliegen**, außerhalb auf einem geeigneten Flugplatz landen, Landung melden |
| **Nach** Erhalt und Bestätigung der Freigabe | Flug **gemäß Freigabe** fortsetzen (veröffentlichte VFR-Einflugstrecke), auf **Lichtsignale** achten, landen |
| In der Platzrunde | Platzrunde fortsetzen, auf Lichtsignale achten, Blindsendungen |

### 8.2 Notverkehr – MAYDAY

**Notlage** = **schwere und/oder unmittelbare Gefahr**, **sofortige Hilfe** erforderlich (z. B. Motorausfall, Feuer, Orientierungsverlust mit Kraftstoffmangel).

**Notmeldung** (auf der **gerade benutzten Frequenz**, sonst 121,5):

1. „**MAYDAY, MAYDAY, MAYDAY**“ (vorzugsweise dreimal)
2. **Name der gerufenen Stelle** (wenn Zeit)
3. **Rufzeichen** (Kennung des Luftfahrzeugs)
4. **Art der Notlage**
5. **Absicht des Piloten**
6. **Standort, Flughöhe und Kurs**
7. ggf. weitere Angaben (Personen an Bord, Kraftstoff/Restflugzeit, Pilotenqualifikation)

Transponder **7700** (sofern nicht anders zugewiesen).

**Beispiel:**
„**MAYDAY, MAYDAY, MAYDAY, Wien Information, OE-DTT, Motorausfall, beabsichtige Notlandung auf einem Feld, 5 Meilen westlich Fürstenfeld, 2 000 Fuß, Steuerkurs 2 7 0, zwei Personen an Bord.**“

> **Eselsbrücke „SRANAPH“** (bzw. „**Wer – Wer – Was – Was will ich – Wo**“): **S**tation, **R**ufzeichen, **A**rt der Not, **A**bsicht, **P**osition, **H**öhe (und Kurs).

**Funkstille anordnen:** nur das Luftfahrzeug in Not oder die steuernde Stelle: „**HALTEN SIE FUNKSTILLE – MAYDAY**“ / „**STOP TRANSMITTING – MAYDAY**“.
**Ende:** „**NOTVERKEHR BEENDET**“ / „**DISTRESS TRAFFIC ENDED**“.
**Weiterleitung** durch Dritte: „**MAYDAY RELAY**“. Andere Stationen **hören mit** und senden nicht auf der Frequenz, solange sie nicht helfen können.

### 8.3 Dringlichkeitsverkehr – PAN PAN

**Dringlichkeitslage** = betrifft die **Sicherheit** eines Luftfahrzeugs oder einer Person an Bord/in Sicht, **ohne** dass **sofortige** Hilfe nötig ist (z. B. rauer Motorlauf, Orientierungsverlust mit ausreichend Kraftstoff, erkrankter Passagier, Wetterverschlechterung).

„**PAN PAN, PAN PAN, PAN PAN, Wien Information, OE-DTT, Orientierung verloren, erbitte Hilfe, vermutlich 10 Meilen südlich Graz, 3 500 Fuß, Steuerkurs 1 8 0, Kraftstoff für 1 Stunde.**“

Gleiche Struktur wie die Notmeldung. Transponder in der Regel **7700**, wenn erforderlich, sonst nach Anweisung.

### 8.4 Visuelle Not- und Dringlichkeitszeichen

| Zeichen | Bedeutung |
|---|---|
| **Rote** Leuchtkugeln/Raketen, **SOS** (···– – –···) | **Notlage** |
| Wiederholtes Ein-/Ausschalten der **Landescheinwerfer** oder unregelmäßiges Blinken der Positionslichter | **Dringlichkeit** (z. B. „muss landen, benötige aber keine sofortige Hilfe“) |

---

## Kapitel 9 – Flugfunk-Zeugnis in Österreich (Fernmeldebüro)

### 9.1 Arten (Funker-Zeugnisgesetz 1998 / FZV)

| Zeugnis | Berechtigt zu | Mindestalter |
|---|---|---|
| **BFZ** – Beschränkt gültiges Flugfunk-Zeugnis | **VFR**-Sprechfunk **nur auf Deutsch** und **nur in Österreich** | **16 Jahre** |
| **EFZ** – Allgemeines Flugfunk-Zeugnis für VFR | **VFR**-Sprechfunk auf **Deutsch und Englisch**, auch im Ausland | 16 Jahre |
| **AFZ** – Allgemeines Flugfunk-Zeugnis | **VFR und IFR**, Deutsch und Englisch | 16 Jahre [prüfen] |

> **Empfehlung:** Für den PPL(A) in Fürstenfeld gleich das **EFZ** machen – Ungarn, Slowenien und Kroatien sind nah, dort wird englisch gefunkt. Ein BFZ kann später **aufgestockt** werden (Gebühr ca. 100,94 €). Der englische Sprachvermerk (FCL.055) in der Lizenz ist zusätzlich nötig.

### 9.2 Prüfung (Fernmeldebüro)

| Teil | Inhalt |
|---|---|
| **Theorie** | Multiple Choice zu **Recht**, **Technik** und **Sonderbestimmungen** des Flugfunks [prüfen: Fragenzahl/Zeit lt. Fernmeldebüro] |
| **Praxis** | Simulierter Sprechfunkverkehr (Abflug, Strecke, Anflug) inkl. Not-/Dringlichkeitsverfahren |
| **Nur EFZ/AFZ** | Funkverkehr auf **Englisch** und **Übersetzung** eines englischen Luftfahrttextes ins Deutsche |
| Orte | **Wien**, **Graz** (Conrad-von-Hötzendorf-Straße 86 – nächster Ort für Fürstenfeld), Innsbruck |
| Kosten | ca. **122,74 € Prüfungsgebühr + 21 €** (Zeugnis/Stempel) [prüfen: aktueller Tarif] |
| Wiederholung | bei Nichtbestehen frühestens nach **3 Monaten** [prüfen] |

Infos und Anmeldung: **fb.gv.at** (Fernmeldebüros). Die Theorieprüfung „Kommunikation“ bei der Austro Control ersetzt die Funkprüfung **nicht** [prüfen: allfällige Anrechnung].

---

## Typische Prüfungsfallen

1. **ROGER** bedeutet nur „empfangen“ – **nicht** „ja“ und **nicht** „wird ausgeführt“ (dafür **WILCO**); „Ja“ heißt **AFFIRM/POSITIV**.
2. **Abgekürztes Rufzeichen** erst verwenden, **nachdem die Bodenstelle** es verwendet hat; Form: erstes Zeichen + letzte zwei (O-TT).
3. **Rücklesepflichtig** sind u. a. **Piste, QNH, Squawk, Frequenz, Höhe, Kurs, Geschwindigkeit** und alle Pistenfreigaben – **nicht** z. B. Wind oder Verkehrsinformationen.
4. „**TAKE-OFF**“ nur bei Startfreigabe; sonst „**DEPARTURE**“.
5. **Hold short** → Antwort „**HOLDING SHORT**“, nicht „Wilco“.
6. **Frequenzen**: sechs Ziffern, außer wenn die letzten beiden null sind (118,000 → „118 Komma 0“).
7. **UKW-Reichweite** hängt vor allem von der **Flughöhe** ab (Sichtlinie), \(1{,}23\sqrt{h}\) NM.
8. **MAYDAY** = **unmittelbare Gefahr**, sofortige Hilfe nötig; **PAN PAN** = Sicherheit betroffen, **keine sofortige** Hilfe.
9. Notmeldung **zuerst auf der aktuellen Frequenz**, nicht automatisch auf 121,5.
10. **Blindsendung** zweimal senden; bei **Empfängerausfall** zusätzlich nächste Sendezeit und Absicht.
11. **Funkausfall vor** CTR-Freigabe → **nicht einfliegen**; **nach** bestätigter Freigabe → gemäß Freigabe weiter.
12. **„Radio“** = Flugplatzbetriebsleiter ohne Flugverkehrsdienst (in Österreich seit 28.12.2023, vorher „Flugplatz“), **„Information“** = FIS (Wien Information). Kein AFIS in Österreich.
13. Verständlichkeit **5 = sehr gut**, **1 = unverständlich**.
14. **ALFA** und **JULIETT** – Schreibweise im ICAO-Alphabet.
15. **Erstanruf bei Wien Information** ohne Flugplan: „**kein Flugplan / negative flight plan**“ melden; „operations normal“ ist entfallen.

---

## Kurz-Zusammenfassung

- **Rechtsrahmen:** SERA Teil 14 + AIP Austria GEN 3.4/AIC; Flugfunk-Zeugnis des Fernmeldebüros: BFZ (deutsch, nur AT) / **EFZ** (deutsch+englisch, VFR) / AFZ (IFR).
- **UKW (118,000–136,975 MHz, 8,33-kHz-Raster)** breitet sich quasioptisch aus: Reichweite ≈ 1,23 × √Höhe(ft) NM. Notfrequenz 121,5 MHz.
- **Technik:** erst hören, dann sprechen; Verständlichkeit 1–5.
- **Zahlen:** Ziffern einzeln (Piste, Kurs, Wind, QNH, Squawk, Frequenz), Höhen mit HUNDERT/TAUSEND; „ZWO“, „KOMMA“/„DECIMAL“; Zeit in UTC.
- **Rufzeichen:** OE-DTT → abgekürzt O-TT („Oscar Tango Tango“) erst nach der Bodenstelle. Bodenstellen: Turm/Tower, Radar, Information (FIS, „Wien Information“), **Radio** (Flugplatzbetriebsleiter, z. B. „Fürstenfeld Radio“).
- **Standardwörter:** ROGER = empfangen, WILCO = verstanden + ausführen, AFFIRM/NEGATIVE, STANDBY, CORRECTION, SAY AGAIN.
- **Rücklesen:** Pistenfreigaben, Piste, QNH, Squawk, Frequenz, Höhe, Kurs, Speed, Streckenfreigaben, TL.
- **Erstmeldung:** Wer – Muster – Wo – Höhe – ATIS – Absicht.
- **Funkausfall:** 7600, Blindsendung (2×), VMC, landen, melden; vor CTR-Freigabe draußen bleiben.
- **Not/Dringlichkeit:** MAYDAY ×3 bzw. PAN PAN ×3 – Station, Rufzeichen, Art, Absicht, Position/Höhe/Kurs; 7700; Funkstille „STOP TRANSMITTING – MAYDAY“; Ende „DISTRESS TRAFFIC ENDED“.

---

## Kontrollfragen

1. Wie lautet das abgekürzte Rufzeichen von OE-KRF, und wann darfst du es verwenden?
2. Wie überträgst du die Frequenz 122,705 MHz (Fürstenfeld Radio) und die Frequenz 119,000 MHz auf Deutsch?
3. Was bedeutet „WILCO“ im Unterschied zu „ROGER“?
4. Welche Teile einer Freigabe musst du immer zurücklesen? Nenne mindestens fünf.
5. Welche Reichweite hat eine UKW-Verbindung zu einer Bodenstation ungefähr, wenn du 3 600 ft über der Station fliegst?
6. Welche Angaben gehören in die Erstmeldung beim Anflug auf eine Kontrollzone?
7. Wie lautet der Aufbau einer Notmeldung?
8. Wann verwendest du PAN PAN statt MAYDAY? Nenne ein Beispiel.
9. Dein Funkgerät fällt aus, bevor du die Einflugfreigabe in eine Kontrollzone erhalten hast. Was tust du?
10. Was ist eine Blindsendung und welche Besonderheit hat sie?
11. Wie heißt in Österreich seit Ende 2023 die Funkstelle des Flugplatzbetriebsleiters in Fürstenfeld, und darf sie dir eine Landefreigabe erteilen?
12. Welche Zeugnisart brauchst du, um bei einem Ausflug nach Ungarn VFR zu funken, und welche Prüfungsteile kommen gegenüber dem BFZ hinzu?

### Lösungen

1. „**OSCAR ROMEO FOXTROT**“ (O-RF: erstes Zeichen + letzte zwei). Erst **nachdem die Bodenfunkstelle** dich so angesprochen hat.
2. 122,705 → „**EINS ZWO ZWO KOMMA SIEBEN NULL FÜNF**“. 119,000 → „**EINS EINS NEUN KOMMA NULL**“ (5. und 6. Ziffer null → nur die ersten vier).
3. **ROGER** = „Ich habe Ihre letzte Meldung vollständig erhalten.“ **WILCO** = „Ich habe verstanden **und werde entsprechend handeln**.“ Keines von beiden ersetzt ein Rücklesen.
4. **Streckenfreigaben; Freigaben/Anweisungen zum Aufrollen, Landen, Starten, Halten vor, Kreuzen, Rollen und Zurückrollen auf Pisten; Betriebspiste; QNH/Höhenmessereinstellung; Squawk; neu zugeteilte Frequenzen; Höhenanweisungen; Kurs- und Geschwindigkeitsanweisungen; Transition Level.**
5. \(1{,}23 \times \sqrt{3600} = 1{,}23 \times 60 \approx\) **74 NM**.
6. **Gerufene Stelle, Rufzeichen, Muster, Position, Höhe, ATIS-Kennung, Absicht** (z. B. „zur Landung“).
7. **MAYDAY ×3 – Name der gerufenen Stelle – Rufzeichen – Art der Notlage – Absicht des Piloten – Standort, Flughöhe, Kurs** (ggf. Personen an Bord, Kraftstoff). Transponder 7700.
8. Bei einer **Dringlichkeitslage**: Sicherheit betroffen, aber **keine sofortige Hilfe** nötig – z. B. Orientierungsverlust mit ausreichend Kraftstoff, rauer Motorlauf, erkrankter Passagier.
9. **Squawk 7600**, Gerät prüfen, Blindsendung absetzen, **nicht** in die Kontrollzone einfliegen, auf einem **geeigneten Flugplatz außerhalb** landen und die Landung der zuständigen Stelle schnellstmöglich (z. B. telefonisch) melden.
10. Eine Meldung **ohne bestehende Zweiwegeverbindung**, in der Annahme, dass sie empfangen wird. Sie beginnt mit „BLINDSENDUNG / TRANSMITTING BLIND“ und wird **zweimal** gesendet; der Zeitpunkt der nächsten Sendung wird angegeben.
11. „**Fürstenfeld Radio**“. **Nein** – der Flugplatzbetriebsleiter gibt nur **Informationen** (Piste, Wind, QNH, Verkehr), **keine Freigaben**.
12. **EFZ** (Allgemeines Flugfunk-Zeugnis für VFR). Zusätzlich zum BFZ: Funkverkehr **auf Englisch** und **Übersetzung** eines englischen Luftfahrttextes ins Deutsche; außerdem Sprachvermerk Englisch nach FCL.055.

---

## Quellen

- Austro Control, **AIP Austria GEN 3.4** (Sprechfunkverfahren) und **AIC A 8/25** – https://eaip.austrocontrol.at/ [prüfen: AIC-Nummer]
- Austro Control, *VFR Pilotfolder Austria 2026* (Wien Information, Frequenzen, Rufzeichen „Radio“) – https://www.austrocontrol.at/piloten
- AIP Austria AD 2 LOGF (Fürstenfeld Radio 122,705, Meldepunkte, Platzrunde) – https://eaip.austrocontrol.at/
- EASA, SERA Section 14 (SERA.14001–14095) und SERA.8015 (Rücklesen) – https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-standardised-european
- Fernmeldebüros (BMF), *Flugfunk-Zeugnisse BFZ, EFZ, AFZ* (Arten, Mindestalter, Prüfungsorte, Gebühren) – https://www.fb.gv.at/
- Funker-Zeugnisgesetz 1998 und Funker-Zeugnisverordnung (FZV) – https://www.ris.bka.gv.at/
- Luftverkehrsregeln 2014, § 27a und § 30 – https://www.ris.bka.gv.at/
- ICAO Annex 10 Vol. II und Doc 9432 *Manual of Radiotelephony* (Buchstabieralphabet, Aussprache).
