import React from 'react';
import { Seite, Panel, T } from '../ui/komponenten';
import { useT, type Schluessel } from '../i18n';

// Auch als öffentliche Datenschutz-URL für App Store / Google Play nutzbar: …/buchstabiertrainer/datenschutz (?lang=en|fr|it|es)
const ABSCHNITTE = ['kurz', 'mikro', 'daten', 'audio', 'weitergabe', 'kinder', 'kontakt', 'stand'] as const;

export default function Datenschutz() {
  const { t } = useT();
  return (
    <Seite titel={t('ds.titel')}>
      {ABSCHNITTE.map((a) => (
        <Panel key={a} titel={t(`ds.${a}.t` as Schluessel)}><T groesse={15}>{t(`ds.${a}` as Schluessel)}</T></Panel>
      ))}
    </Seite>
  );
}
