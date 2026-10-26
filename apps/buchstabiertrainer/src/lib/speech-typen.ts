export type ErkennerOptionen = {
  lang: string;
  onDevice: boolean;
  phrasen: string[];
  /** true: einzelnes Wort (Aussprache, Karteikasten) – false: fortlaufende Folge (Sprint) */
  einzelwort: boolean;
};

export type ErkennerHandler = {
  segment: (text: string, final: boolean, alternativen: string[]) => void;
  zustand: (aktiv: boolean) => void;
  fehler: (code: string, meldung: string) => void;
};

export type Erkenner = {
  start: (o: ErkennerOptionen) => Promise<void>;
  stop: () => void;
  abort: () => void;
};

export type OnDeviceStatus = 'ja' | 'laden' | 'nein' | 'unbekannt';
export type Verfuegbarkeit = { ok: boolean; grund?: string };
