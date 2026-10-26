import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { laden, useStore } from '../lib/store';
import { useDunkel, useFarben } from '../lib/theme';
import { simPruefen } from '../lib/sim';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const geladen = useStore((s) => s.geladen);
  const f = useFarben();
  const dunkel = useDunkel();

  useEffect(() => {
    simPruefen();
    laden().finally(() => SplashScreen.hideAsync().catch(() => {}));
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

  return (
    <SafeAreaProvider>
      <StatusBar style={dunkel ? 'light' : 'dark'} />
      {geladen ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: f.bg }, animation: 'slide_from_right' }} />
      ) : null}
    </SafeAreaProvider>
  );
}
