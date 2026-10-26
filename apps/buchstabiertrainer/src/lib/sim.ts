// Simulierte Spracherkennung für Tests im Browser (?sim=1). Liefert Texte wie ein echter Erkenner
// (Zwischenergebnisse Wort für Wort, danach ein Endergebnis).
import type { Erkenner, ErkennerHandler } from './speech-typen';

let aktiv = false;
let aktuell: ErkennerHandler | null = null;

export function simPruefen() {
  if (typeof window === 'undefined') return false;
  try {
    const q = new URLSearchParams(window.location.search).get('sim');
    if (q === '1') window.sessionStorage.setItem('sim', '1');
    if (q === '0') window.sessionStorage.removeItem('sim');
    aktiv = window.sessionStorage.getItem('sim') === '1';
  } catch {
    aktiv = false;
  }
  if (aktiv) (window as any).__sprich = simSprich;
  return aktiv;
}

export const simAktiv = () => aktiv;

let warteschlange = Promise.resolve();

/** Spricht `text` (simuliert): jedes Wort als Zwischenergebnis, dann Endergebnis. */
export function simSprich(text: string, wortMs = 60) {
  warteschlange = warteschlange.then(async () => {
    const h = aktuell;
    if (!h) return;
    const woerter = text.trim().split(/\s+/);
    for (let i = 1; i <= woerter.length; i++) {
      h.segment(woerter.slice(0, i).join(' '), false, []);
      await new Promise((r) => setTimeout(r, wortMs));
    }
    h.segment(text, true, [text]);
  });
  return warteschlange;
}

export function simErkenner(h: ErkennerHandler): Erkenner {
  return {
    async start() {
      aktuell = h;
      h.zustand(true);
    },
    stop() {
      if (aktuell === h) aktuell = null;
      h.zustand(false);
    },
    abort() {
      if (aktuell === h) aktuell = null;
      h.zustand(false);
    },
  };
}
