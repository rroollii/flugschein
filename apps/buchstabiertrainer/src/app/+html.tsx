import React from 'react';
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';

const BASIS = process.env.EXPO_BASE_URL ?? '';

// Nur Web: HTML-Gerüst für die statisch erzeugten Seiten.
export default function Root({ children }: { children: React.ReactNode }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();
  return (
    <html {...htmlAttributes} lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#070b10" />
        <meta name="description" content="ICAO-/NATO-Buchstabieralphabet trainieren: Sprint auf Zeit mit Spracherkennung, Aussprache, Hörübungen und Kennzeichen. Ohne Konto, Fortschritt bleibt auf dem Gerät." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PilotABC" />
        <link rel="manifest" href={`${BASIS}/manifest.webmanifest`} />
        <link rel="apple-touch-icon" href={`${BASIS}/apple-touch-icon.png`} />
        <title>PilotABC – Buchstabieren wie ein Pilot</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'html,body{background:#070b10;color-scheme:dark light}' }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
