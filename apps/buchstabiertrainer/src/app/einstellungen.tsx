import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Seite, Panel, T, Knopf, Auswahl, Zeile } from '../ui/komponenten';
import { useFarben } from '../lib/theme';
import { useStore, einstellen, zuruecksetzen } from '../lib/store';
import { onDeviceLaden, onDeviceStatus, verfuegbar } from '../lib/speech';
import type { OnDeviceStatus } from '../lib/speech-typen';
import { spiele } from '../lib/audio';
import { SPRACHEN, UI_SPRACHEN, geraeteSprache, useT, type Schluessel } from '../i18n';

const STATUS: Record<OnDeviceStatus, Schluessel> = {
  ja: 'einst.status.ja',
  laden: 'einst.status.laden',
  nein: Platform.OS === 'web' ? 'einst.status.neinWeb' : 'einst.status.nein',
  unbekannt: 'einst.status.unbekannt',
};

export default function Einstellungen() {
  const f = useFarben();
  const { t } = useT();
  const e = useStore((s) => s.einstellungen);
  const [status, setStatus] = useState<OnDeviceStatus>('unbekannt');
  const v = verfuegbar();
  const anAus = (x: boolean) => ({ k: x ? 'allg.an' : 'allg.aus' }) as const;

  useEffect(() => { onDeviceStatus(e.sprache).then(setStatus); }, [e.sprache]);

  const loeschen = () => {
    const ok = () => zuruecksetzen();
    if (Platform.OS === 'web') { if (window.confirm(t('einst.loeschenFrage'))) ok(); }
    else Alert.alert(t('einst.loeschenTitel'), t('einst.loeschenFrage'), [{ text: t('allg.abbrechen'), style: 'cancel' }, { text: t('einst.loeschenOk'), style: 'destructive', onPress: ok }]);
  };

  return (
    <Seite titel={t('einst.titel')}>
      <Panel titel={t('einst.sprache')}>
        <Auswahl label={t('einst.sprache')} wert={e.uiSprache} onWahl={(x) => einstellen('uiSprache', x)}
          werte={[{ wert: 'auto' as const, text: t('einst.spracheAuto', { name: SPRACHEN[geraeteSprache()].name }) }, ...UI_SPRACHEN.map((s) => ({ wert: s, text: SPRACHEN[s].name }))]} />
        <T leise groesse={13} style={{ marginTop: 8 }}>{t('einst.spracheInfo')}</T>
      </Panel>

      <Panel titel={t('einst.erkennung')}>
        <T groesse={14} farbe={v.ok ? f.ok : f.fehler}>{v.ok ? t('einst.verfuegbar') : v.grund}</T>
        <T groesse={14} style={{ marginTop: 8 }}>{t('einst.erkennungSprache')}</T>
        <Auswahl label={t('einst.erkennung')} werte={[{ wert: 'en-US', text: t('einst.enUS') }, { wert: 'en-GB', text: t('einst.enGB') }]} wert={e.sprache} onWahl={(x) => einstellen('sprache', x)} />
        <Zeile style={{ marginTop: 12 }}>
          <Knopf klein art={e.onDevice ? 'primaer' : 'sekundaer'} titel={t('einst.onDevice', { wert: anAus(e.onDevice) })} onPress={() => einstellen('onDevice', !e.onDevice)} />
          {status === 'laden' && <Knopf klein art="sekundaer" titel={t('einst.paketLaden')} onPress={async () => { await onDeviceLaden(e.sprache); setStatus(await onDeviceStatus(e.sprache)); }} />}
        </Zeile>
        <T leise groesse={13} style={{ marginTop: 8 }}>{t(STATUS[status])}</T>
      </Panel>

      <Panel titel={t('einst.hoerbeispiele')}>
        <Auswahl label={t('einst.stimme')} werte={[{ wert: 'frau', text: t('einst.stimmeFrau') }, { wert: 'mann', text: t('einst.stimmeMann') }]} wert={e.stimme} onWahl={(x) => { einstellen('stimme', x); spiele('A', x); }} />
        <T leise groesse={13} style={{ marginTop: 8 }}>{t('einst.stimmeInfo')}</T>
      </Panel>

      <Panel titel={t('einst.tagesziel')}>
        <Auswahl label={t('einst.tagesziel')} werte={[50, 100, 150, 300].map((x) => ({ wert: x, text: `${x}` }))} wert={e.tagesziel} onWahl={(x) => einstellen('tagesziel', x)} />
        <T leise groesse={13} style={{ marginTop: 8 }}>{t('einst.tageszielInfo')}</T>
      </Panel>

      <Panel titel={t('einst.darstellung')}>
        <Auswahl label={t('einst.thema')} werte={[{ wert: 'auto', text: t('einst.system') }, { wert: 'dunkel', text: t('einst.dunkel') }, { wert: 'hell', text: t('einst.hell') }]} wert={e.thema} onWahl={(x) => einstellen('thema', x)} />
        {Platform.OS !== 'web' && (
          <Zeile style={{ marginTop: 12 }}>
            <Knopf klein art={e.haptik ? 'primaer' : 'sekundaer'} titel={t('einst.haptik', { wert: anAus(e.haptik) })} onPress={() => einstellen('haptik', !e.haptik)} />
          </Zeile>
        )}
      </Panel>

      <Panel titel={t('einst.datenschutz')}>
        <T groesse={14}>{t('einst.dsKurz')}</T>
        <T leise groesse={13} style={{ marginTop: 6 }}>{t('einst.dsMikro')}</T>
        <Zeile style={{ marginTop: 12 }}>
          <Knopf klein art="sekundaer" titel={t('einst.dsErklaerung')} onPress={() => router.push('/datenschutz')} />
          <Knopf klein art="fehler" titel={t('einst.loeschen')} onPress={loeschen} />
        </Zeile>
      </Panel>
      <T leise groesse={12} style={{ textAlign: 'center' }}>{t('app.fusszeile', { v: Constants.expoConfig?.version ?? '1.0' })}</T>
    </Seite>
  );
}
