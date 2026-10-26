# Hörbeispiele – Herkunft und Lizenz

Alle MP3-Dateien in `frau/` und `mann/` wurden mit `scripts/audio-erzeugen.py` lokal per
[Piper TTS](https://github.com/OHF-Voice/piper1-gpl) erzeugt. Es gibt keine Cloud-Dienste und keine Nutzungsbedingungen Dritter für die Ausgabe.

| Ordner | Stimme | Trainingsdaten | Lizenz Daten | Modell |
|---|---|---|---|---|
| `frau/` | `en_GB-cori-high` | LibriVox-Hörbücher (24 h), von Grund auf trainiert | Public Domain | [piper-voices](https://huggingface.co/rhasspy/piper-voices) (MIT) |
| `mann/` | `en_US-bryce-medium` | Eigene Aufnahmen des Modellautors (Bryce Beattie) | Public Domain | [piper-voices](https://huggingface.co/rhasspy/piper-voices) (MIT) |

- Modellkarten: `en/en_GB/cori/high/MODEL_CARD` und `en/en_US/bryce/medium/MODEL_CARD` im Repository rhasspy/piper-voices.
- Trainingsdetails: https://brycebeattie.com/files/tts/
- Die Piper-Software (GPL-3.0) wird nur zum Erzeugen verwendet und nicht mit der App ausgeliefert. Die erzeugten Audiodateien fallen nicht unter die GPL.

Die Hörbeispiele dürfen deshalb ohne Einschränkung in der App (auch kommerziell und in App Stores) verwendet werden. Ein Namensnachweis ist nicht verpflichtend, wird aber in den Einstellungen unter „Hörbeispiele“ freiwillig angezeigt.
