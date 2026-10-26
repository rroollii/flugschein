import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { einstellen, laden, useStore } from '../lib/store';
import { useDunkel, useFarben } from '../lib/theme';
import { simPruefen } from '../lib/sim';
import { SPRACHEN, useT, type UiSprache } from '../i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const geladen = useStore((s) => s.geladen);
  const f = useFarben();
  const dunkel = useDunkel();
  const { t, sprache } = useT();

  useEffect(() => {
    simPruefen();
    laden().finally(() => {
      SplashScreen.hideAsync().catch(() => {});
      // ?lang=en usw.: feste Sprache per Link (z. B. Datenschutz-URL je Store-Sprache)
      if (Platform.OS === 'web') {
        const lang = new URLSearchParams(location.search).get('lang');
        if (lang && lang in SPRACHEN) einstellen('uiSprache', lang as UiSprache);
      }
    });
    if (Platform.OS === 'web' && 'serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register(`${process.env.EXPO_BASE_URL ?? ''}/sw.js`).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = f.bg;
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', f.bg);
    }
  }, [f.bg]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !geladen) return;
    document.documentElement.lang = sprache;
    document.title = t('app.webtitel');
  }, [sprache, geladen]);

  return (
    <SafeAreaProvider>
      <StatusBar style={dunkel ? 'light' : 'dark'} />
      {geladen ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: f.bg }, animation: 'slide_from_right' }} />
      ) : null}
    </SafeAreaProvider>
  );
}
