import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/** Systemeinstellung „Bewegung reduzieren“ (iOS/Android, im Browser prefers-reduced-motion). */
export function useRuhig() {
  const [ruhig, setRuhig] = useState(false);
  useEffect(() => {
    let aktiv = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (aktiv) setRuhig(v); }).catch(() => {});
    const abo = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setRuhig(v));
    return () => { aktiv = false; abo?.remove?.(); };
  }, []);
  return ruhig;
}

/** Native Treiber laufen außerhalb des JS-Threads; react-native-web kennt sie nicht. */
export const NATIV = Platform.OS !== 'web';
