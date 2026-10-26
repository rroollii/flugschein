import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Seite, Panel, T, Knopf, Auswahl, Zeile } from '../ui/komponenten';
import { useFarben } from '../lib/theme';
import { useStore, einstellen, zuruecksetzen } from '../lib/store';
import { onDeviceLaden, onDeviceStatus, verfuegbar } from '../lib/speech';
import type { OnDeviceStatus } from '../lib/speech-typen';
import { spiele } from '../lib/audio';

const STATUS: Record<OnDeviceStatus, string> = {
  ja: 'On-device verfügbar – Sprache verlässt das Gerät nicht.',
  laden: 'On-device möglich, Sprachpaket muss einmalig geladen werden.',
  nein: Platform.OS === 'web'
    ? 'Dieser Browser erkennt nicht lokal – die Sprache wird vom Browser-Anbieter (z. B. Google, Apple) verarbeitet.'
    : 'Dieses Gerät unterstützt keine on-device-Erkennung – es wird der Dienst des Betriebssystems genutzt.',
  unbekannt: 'Status unbekannt.',
};

export default function Einstellungen() {
  const f = useFarben();
  const e = useStore((s) => s.einstellungen);
  const [status, setStatus] = useState<OnDeviceStatus>('unbekannt');
  const v = verfuegbar();

  useEffect(() => { onDeviceStatus(e.sprache).then(setStatus); }, [e.sprache]);

  const loeschen = () => {
    const ok = () => zuruecksetzen();
    if (Platform.OS === 'web') { if (window.confirm('Alle Läufe, Statistik und Karteikasten löschen?')) ok(); }
    else Alert.alert('Daten löschen', 'Alle Läufe, Statistik und Karteikasten löschen?', [{ text: 'Abbrechen', style: 'cancel' }, { text: 'Löschen', style: 'destructive', onPress: ok }]);
  };

  return (
    <Seite titel="Einstellungen">
      <Panel titel="Spracherkennung">
        <T groesse={14} farbe={v.ok ? f.ok : f.fehler}>{v.ok ? '✓ Spracherkennung verfügbar' : v.grund}</T>
        <T groesse={14} style={{ marginTop: 8 }}>Erkennungssprache (die Codewörter sind englisch):</T>
        <Auswahl label="Sprache" werte={[{ wert: 'en-US', text: 'Englisch (US)' }, { wert: 'en-GB', text: 'Englisch (UK)' }]} wert={e.sprache} onWahl={(x) => einstellen('sprache', x)} />
        <Zeile style={{ marginTop: 12 }}>
          <Knopf klein art={e.onDevice ? 'primaer' : 'sekundaer'} titel={e.onDevice ? 'On-device bevorzugen: an' : 'On-device bevorzugen: aus'} onPress={() => einstellen('onDevice', !e.onDevice)} />
          {status === 'laden' && <Knopf klein art="sekundaer" titel="Sprachpaket laden" onPress={async () => { await onDeviceLaden(e.sprache); setStatus(await onDeviceStatus(e.sprache)); }} />}
        </Zeile>
        <T leise groesse={13} style={{ marginTop: 8 }}>{STATUS[status]}</T>
      </Panel>

      <Panel titel="Hörbeispiele">
        <Auswahl label="Stimme" werte={[{ wert: 'frau', text: 'Sonia (Frau)' }, { wert: 'mann', text: 'Ryan (Mann)' }]} wert={e.stimme} onWahl={(x) => { einstellen('stimme', x); spiele('A', x); }} />
        <T leise groesse={13} style={{ marginTop: 8 }}>Natürliche britisch-englische Stimmen, vorab aufgenommen und in der App enthalten – funktioniert offline.</T>
      </Panel>

      <Panel titel="Tagesziel">
        <Auswahl label="Tagesziel" werte={[50, 100, 150, 300].map((x) => ({ wert: x, text: `${x}` }))} wert={e.tagesziel} onWahl={(x) => einstellen('tagesziel', x)} />
        <T leise groesse={13} style={{ marginTop: 8 }}>Zeichen pro Tag (z. B. 150 = drei 50er-Sprints). Die Serie zählt Tage mit erreichtem Ziel.</T>
      </Panel>

      <Panel titel="Darstellung & Rückmeldung">
        <Auswahl label="Thema" werte={[{ wert: 'auto', text: 'System' }, { wert: 'dunkel', text: 'Dunkel' }, { wert: 'hell', text: 'Hell' }]} wert={e.thema} onWahl={(x) => einstellen('thema', x)} />
        {Platform.OS !== 'web' && (
          <Zeile style={{ marginTop: 12 }}>
            <Knopf klein art={e.haptik ? 'primaer' : 'sekundaer'} titel={e.haptik ? 'Vibration bei Fehler: an' : 'Vibration bei Fehler: aus'} onPress={() => einstellen('haptik', !e.haptik)} />
          </Zeile>
        )}
      </Panel>

      <Panel titel="Datenschutz">
        <T groesse={14}>Kein Konto, keine Werbung, keine Analyse. Läufe, Statistik und Einstellungen werden nur auf diesem Gerät gespeichert.</T>
        <T leise groesse={13} style={{ marginTop: 6 }}>Mikrofon und Spracherkennung laufen nur während einer Übung. Ist on-device nicht möglich, verarbeitet der Erkennungsdienst des Systems bzw. Browsers (Apple, Google) die Sprache.</T>
        <Knopf klein art="fehler" titel="Alle Daten löschen" style={{ marginTop: 12, alignSelf: 'flex-start' }} onPress={loeschen} />
      </Panel>
      <T leise groesse={12} style={{ textAlign: 'center' }}>Buchstabiertrainer 1.0 · Teil der Flugschein-Lernplattform</T>
    </Seite>
  );
}
