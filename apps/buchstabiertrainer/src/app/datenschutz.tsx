import React from 'react';
import { Seite, Panel, T } from '../ui/komponenten';

// Auch als öffentliche Datenschutz-URL für App Store / Google Play nutzbar: …/buchstabiertrainer/datenschutz
const ABSCHNITTE: [string, string][] = [
  ['Kurzfassung', 'Der Buchstabiertrainer kommt ohne Konto, Werbung, Tracking und eigene Server aus. Alle Übungsergebnisse bleiben auf deinem Gerät.'],
  ['Mikrofon und Spracherkennung', 'Das Mikrofon ist nur aktiv, während du eine Sprechübung machst. Die Sprache wird in Text umgewandelt, um deine Codewörter zu bewerten; Audio wird weder gespeichert noch an uns übertragen. Wenn dein Gerät es unterstützt, läuft die Erkennung vollständig auf dem Gerät („on-device“). Andernfalls verarbeitet der Spracherkennungsdienst deines Betriebssystems bzw. Browsers (Apple, Google oder Microsoft) die Aufnahme nach dessen Datenschutzbestimmungen. Ohne Mikrofon kannst du die App mit Tippen oder Selbstbewertung nutzen.'],
  ['Gespeicherte Daten', 'Lokal gespeichert werden: Einstellungen, Ergebnisse der Läufe (Zeit, Fehler), Statistik je Buchstabe, Karteikasten-Fortschritt und Tagesaktivität. Diese Daten verlassen das Gerät nicht und werden mit „Alle Daten löschen“ in den Einstellungen oder durch Löschen der App entfernt.'],
  ['Hörbeispiele', 'Die Hörbeispiele sind fest in der App enthalten; zum Abspielen werden keine Daten übertragen. Die Web-Version lädt Programm und Hörbeispiele einmalig von GitHub Pages (GitHub speichert dabei technisch übliche Zugriffsdaten wie die IP-Adresse).'],
  ['Weitergabe', 'Es werden keine personenbezogenen Daten an Dritte weitergegeben, verkauft oder für Werbung genutzt. Es gibt keine Analyse- oder Absturzberichts-Dienste.'],
  ['Kinder', 'Die App richtet sich an Flugschüler:innen und Funk-Interessierte und erhebt keine Daten von Kindern.'],
  ['Kontakt', 'Verantwortlich: [Name, Anschrift, E-Mail – vor Veröffentlichung eintragen]. Du hast nach DSGVO das Recht auf Auskunft, Berichtigung, Löschung und Beschwerde bei der Datenschutzbehörde (in Österreich: dsb.gv.at). Da wir keine Daten von dir speichern, betreffen Anfragen in der Regel nur die lokal auf deinem Gerät gespeicherten Daten.'],
  ['Stand', 'Oktober 2026'],
];

export default function Datenschutz() {
  return (
    <Seite titel="Datenschutz">
      {ABSCHNITTE.map(([titel, text]) => (
        <Panel key={titel} titel={titel}><T groesse={15}>{text}</T></Panel>
      ))}
    </Seite>
  );
}
