import { useCallback } from 'react';
import { getLocales } from 'expo-localization';
import { de, type Schluessel, type Woerterbuch } from './de';
import { en } from './en';
import { fr } from './fr';
import { it } from './it';
import { es } from './es';
import { hole, useStore } from '../lib/store';

export type { Schluessel } from './de';

// Neue Sprache: Wörterbuch anlegen, hier eintragen, in app.json (locales, CFBundleLocalizations) ergänzen.
export const SPRACHEN = {
  de: { name: 'Deutsch', texte: de },
  en: { name: 'English', texte: en },
  fr: { name: 'Français', texte: fr },
  it: { name: 'Italiano', texte: it },
  es: { name: 'Español', texte: es },
} satisfies Record<string, { name: string; texte: Woerterbuch }>;

export type UiSprache = keyof typeof SPRACHEN;
export const UI_SPRACHEN = Object.keys(SPRACHEN) as UiSprache[];
const RESERVE: UiSprache = 'en';

/** `je`: abweichender Schlüssel je UI-Sprache (z. B. die Buchstabiertafel der eigenen Sprache nennen). */
export type Param = string | number | { k: Schluessel; je?: Partial<Record<string, Schluessel>> };
/** Übersetzbarer Text, der erst beim Anzeigen in die aktuelle Sprache gebracht wird. */
export type Hinweis = { k: Schluessel; p?: Record<string, Param> };

let geraet: UiSprache | null = null;
export function geraeteSprache(): UiSprache {
  if (geraet) return geraet;
  try {
    for (const l of getLocales()) {
      const code = (l.languageCode ?? '').toLowerCase() as UiSprache;
      if (code in SPRACHEN) return (geraet = code);
    }
  } catch {}
  return (geraet = RESERVE);
}

export function aufloesen(wahl: UiSprache | 'auto' | undefined): UiSprache {
  return wahl && wahl !== 'auto' && wahl in SPRACHEN ? wahl : geraeteSprache();
}

export const aktuelleSprache = () => aufloesen(hole().einstellungen.uiSprache);

function uebersetze(sprache: UiSprache, k: Schluessel, p?: Record<string, Param>): string {
  const roh = SPRACHEN[sprache].texte[k] ?? de[k] ?? k;
  if (!p) return roh;
  return roh.replace(/\{(\w+)\}/g, (m, name) => {
    const v = p[name];
    if (v == null) return m;
    return typeof v === 'object' ? uebersetze(sprache, v.je?.[sprache] ?? v.k) : String(v);
  });
}

/** Außerhalb von Komponenten (z. B. Fehlermeldungen beim Auftreten). */
export function t(k: Schluessel, p?: Record<string, Param>) {
  return uebersetze(aktuelleSprache(), k, p);
}

export const text = (h: Hinweis) => t(h.k, h.p);

/** In Komponenten: rendert bei Sprachwechsel neu. */
export function useT() {
  const sprache = useStore((s) => aufloesen(s.einstellungen.uiSprache));
  const tt = useCallback((k: Schluessel, p?: Record<string, Param>) => uebersetze(sprache, k, p), [sprache]);
  const th = useCallback((h: Hinweis) => uebersetze(sprache, h.k, h.p), [sprache]);
  return { t: tt, th, sprache };
}
