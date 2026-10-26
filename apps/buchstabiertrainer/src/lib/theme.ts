import { Platform, useColorScheme } from 'react-native';
import { useStore } from './store';

export type Farben = {
  bg: string; panel: string; panel2: string; rand: string; text: string; leise: string;
  akzent: string; akzentText: string; ok: string; fehler: string; info: string; warn: string;
};

const DUNKEL: Farben = {
  bg: '#070b10', panel: '#0e151d', panel2: '#141f2a', rand: '#223142', text: '#e8eef4', leise: '#8597a8',
  akzent: '#ffb020', akzentText: '#1a1200', ok: '#36d399', fehler: '#ff5d5d', info: '#4cc9f0', warn: '#ffb020',
};
const HELL: Farben = {
  bg: '#eef2f6', panel: '#ffffff', panel2: '#f4f7fa', rand: '#d3dce5', text: '#0d1620', leise: '#5a6b7b',
  akzent: '#c77700', akzentText: '#ffffff', ok: '#0f9d58', fehler: '#d93025', info: '#0077b6', warn: '#c77700',
};

export function useFarben(): Farben {
  const sys = useColorScheme();
  const thema = useStore((s) => s.einstellungen.thema);
  const dunkel = thema === 'dunkel' || (thema === 'auto' && sys !== 'light');
  return dunkel ? DUNKEL : HELL;
}

export function useDunkel(): boolean {
  const sys = useColorScheme();
  const thema = useStore((s) => s.einstellungen.thema);
  return thema === 'dunkel' || (thema === 'auto' && sys !== 'light');
}

export const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace',
});
