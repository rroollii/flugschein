// iOS/Android: expo-speech-recognition (SFSpeechRecognizer bzw. Android SpeechRecognizer).
import { Platform } from 'react-native';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import type { Erkenner, ErkennerHandler, OnDeviceStatus, Verfuegbarkeit } from './speech-typen';
import { simAktiv, simErkenner } from './sim';
import { t } from '../i18n';

export function verfuegbar(): Verfuegbarkeit {
  if (simAktiv()) return { ok: true };
  try {
    return ExpoSpeechRecognitionModule.isRecognitionAvailable()
      ? { ok: true }
      : { ok: false, grund: t('erk.keinGeraet') };
  } catch {
    return { ok: false, grund: t('erk.expoGo') };
  }
}

export async function onDeviceStatus(lang: string): Promise<OnDeviceStatus> {
  try {
    if (!ExpoSpeechRecognitionModule.supportsOnDeviceRecognition()) return 'nein';
    if (Platform.OS === 'android') {
      const { installedLocales } = await ExpoSpeechRecognitionModule.getSupportedLocales({});
      return installedLocales.some((l) => l.toLowerCase() === lang.toLowerCase()) ? 'ja' : 'laden';
    }
    return 'ja';
  } catch {
    return 'unbekannt';
  }
}

export async function onDeviceLaden(lang: string) {
  if (Platform.OS !== 'android') return false;
  try {
    await ExpoSpeechRecognitionModule.androidTriggerOfflineModelDownload({ locale: lang });
    return true;
  } catch {
    return false;
  }
}

export async function berechtigung(): Promise<boolean> {
  if (simAktiv()) return true;
  const r = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return r.granted;
}

export function erstelleErkenner(h: ErkennerHandler): Erkenner {
  if (simAktiv()) return simErkenner(h);
  let subs: { remove: () => void }[] = [];
  const weg = () => { subs.forEach((s) => s.remove()); subs = []; };
  return {
    async start(o) {
      weg();
      subs = [
        ExpoSpeechRecognitionModule.addListener('start', () => h.zustand(true)),
        ExpoSpeechRecognitionModule.addListener('end', () => { weg(); h.zustand(false); }),
        ExpoSpeechRecognitionModule.addListener('result', (e) => {
          const alt = e.results.map((r) => r.transcript);
          h.segment(alt[0] ?? '', e.isFinal, alt);
        }),
        ExpoSpeechRecognitionModule.addListener('error', (e) => h.fehler(e.error, e.message)),
      ];
      let lokal = false;
      try { lokal = o.onDevice && ExpoSpeechRecognitionModule.supportsOnDeviceRecognition(); } catch {}
      if (lokal && Platform.OS === 'android') lokal = (await onDeviceStatus(o.lang)) === 'ja';
      ExpoSpeechRecognitionModule.start({
        lang: o.lang,
        interimResults: true,
        continuous: !o.einzelwort,
        maxAlternatives: o.einzelwort ? 5 : 1,
        requiresOnDeviceRecognition: lokal,
        addsPunctuation: false,
        contextualStrings: o.phrasen,
        iosTaskHint: o.einzelwort ? 'confirmation' : 'unspecified',
        androidIntentOptions: o.einzelwort ? { EXTRA_LANGUAGE_MODEL: 'web_search' } : { EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 4000 },
        iosCategory: { category: 'playAndRecord', categoryOptions: ['defaultToSpeaker', 'allowBluetooth'], mode: 'measurement' },
      });
    },
    stop() { ExpoSpeechRecognitionModule.stop(); },
    abort() { ExpoSpeechRecognitionModule.abort(); },
  };
}
