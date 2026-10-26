// ICAO-Buchstabieralphabet (ICAO Annex 10, Vol. II) mit Lautschrift. Codewörter bleiben in jeder UI-Sprache ICAO-Englisch.
// `laut`: Silben, betonte Silbe in GROSSBUCHSTABEN. `varianten`: was Spracherkenner typischerweise liefern.
// `standard`: Schreibweisen, die zwar akzeptiert werden, aber nicht der ICAO-Aussprache entsprechen.
import type { Schluessel } from '../i18n/de';

export type Sym = {
  sym: string;
  wort: string;
  laut: string[];
  betont: number;
  varianten: string[];
  standard?: { wort: string; hinweis: Schluessel }[];
  tipp?: Schluessel;
};

const L = (sym: string, wort: string, laut: string[], betont: number, varianten: string[], extra: Partial<Sym> = {}): Sym => ({
  sym, wort, laut, betont, varianten, ...extra,
});

export const BUCHSTABEN: Sym[] = [
  L('A', 'Alfa', ['al', 'fah'], 0, ['alfa', 'alpha', 'alfah', 'alva', 'alpa', 'elfa', 'alfred'], { tipp: 'tipp.A' }),
  L('B', 'Bravo', ['brah', 'voh'], 0, ['bravo', 'brahvo', 'bravoh', 'brava', 'bravos']),
  L('C', 'Charlie', ['char', 'lee'], 0, ['charlie', 'charley', 'charly', 'sharlie', 'charli', 'shari', 'charlee', 'charlies'], { tipp: 'tipp.C' }),
  L('D', 'Delta', ['dell', 'tah'], 0, ['delta', 'deltah', 'delter', 'dealt', 'delt']),
  L('E', 'Echo', ['eck', 'oh'], 0, ['echo', 'eko', 'ecco', 'echoe', 'ecko', 'eckoh']),
  L('F', 'Foxtrot', ['foks', 'trot'], 0, ['foxtrot', 'foxtrott', 'fox', 'foxtrots', 'foxtrop']),
  L('G', 'Golf', ['golf'], 0, ['golf', 'gulf', 'golfe', 'goal', 'goff']),
  L('H', 'Hotel', ['hoh', 'tell'], 1, ['hotel', 'hotell', 'hotels', 'hoteru']),
  L('I', 'India', ['in', 'dee', 'ah'], 0, ['india', 'indiah', 'indya', 'indie', 'indian']),
  L('J', 'Juliett', ['jew', 'lee', 'ett'], 0, ['juliett', 'juliet', 'juliette', 'julia', 'julie', 'julieta', 'juli'], { tipp: 'tipp.J' }),
  L('K', 'Kilo', ['key', 'loh'], 0, ['kilo', 'keylo', 'kilos', 'keelo', 'kilow', 'killo']),
  L('L', 'Lima', ['lee', 'mah'], 0, ['lima', 'leema', 'lemma', 'limah', 'lena', 'lima\'s', 'lemur', 'leamer']),
  L('M', 'Mike', ['mike'], 0, ['mike', 'mic', 'maik', 'mikes', 'mich', 'mikey', 'might', 'mic\'d']),
  L('N', 'November', ['no', 'vem', 'ber'], 1, ['november', 'novembre', 'novemba', 'novembers'], { tipp: 'tipp.N' }),
  L('O', 'Oscar', ['oss', 'cah'], 0, ['oscar', 'oskar', 'oscars', 'osca', 'ossca', 'oscur']),
  L('P', 'Papa', ['pah', 'pah'], 1, ['papa', 'pappa', 'poppa', 'papas', 'papah', 'pa pa'], { tipp: 'tipp.P' }),
  L('Q', 'Quebec', ['keh', 'beck'], 1, ['quebec', 'kebec', 'kebab', 'kabeck', 'cubeck', 'kebeck', 'quebecs', 'kebek', 'que bec', 'keh beck'], { tipp: 'tipp.Q' }),
  L('R', 'Romeo', ['row', 'me', 'oh'], 0, ['romeo', 'romeos', 'romio', 'romeoh', 'romeu']),
  L('S', 'Sierra', ['see', 'air', 'rah'], 1, ['sierra', 'siera', 'sierrah', 'sierras', 'cierra', 'ciara', 'sarah', 'see era']),
  L('T', 'Tango', ['tang', 'go'], 0, ['tango', 'tangoh', 'tangle', 'tangos', 'tank go']),
  L('U', 'Uniform', ['you', 'nee', 'form'], 0, ['uniform', 'uniforms', 'unifor', 'uni form', 'you knee form'], { tipp: 'tipp.U' }),
  L('V', 'Victor', ['vik', 'tah'], 0, ['victor', 'viktor', 'victa', 'vikta', 'victors', 'victoria']),
  L('W', 'Whiskey', ['wiss', 'key'], 0, ['whiskey', 'whisky', 'wisky', 'whiskies', 'wiskey', 'whisk key']),
  L('X', 'X-ray', ['ecks', 'ray'], 0, ['xray', 'x ray', 'exray', 'ex ray', 'x-ray', 'eksray', 'xrays']),
  L('Y', 'Yankee', ['yang', 'key'], 0, ['yankee', 'yankees', 'yanki', 'yanky', 'yanke', 'yang key']),
  L('Z', 'Zulu', ['zoo', 'loo'], 0, ['zulu', 'zoolu', 'zulus', 'zoo loo', 'sulu', 'zuluh']),
];

export const ZIFFERN: Sym[] = [
  L('0', 'Zero', ['ze', 'ro'], 0, ['zero', 'ziro', 'zeroes', 'zeros', 'oh', 'null']),
  L('1', 'Wun', ['wun'], 0, ['one', 'wun', 'won', 'wan']),
  L('2', 'Too', ['too'], 0, ['two', 'too', 'to', 'tu']),
  L('3', 'Tree', ['tree'], 0, ['tree', 'three', 'free', 'trees', 'tri'], {
    standard: [{ wort: 'three', hinweis: 'hinweis.three' }],
  }),
  L('4', 'Fower', ['fow', 'er'], 0, ['fower', 'four', 'for', 'fore', 'flower', 'power', 'fow er'], {
    standard: [{ wort: 'four', hinweis: 'hinweis.fower' }, { wort: 'for', hinweis: 'hinweis.fower' }, { wort: 'fore', hinweis: 'hinweis.fower' }],
  }),
  L('5', 'Fife', ['fife'], 0, ['fife', 'five', 'fives', 'fyfe', 'fife\'s'], {
    standard: [{ wort: 'five', hinweis: 'hinweis.five' }],
  }),
  L('6', 'Six', ['six'], 0, ['six', 'sicks', 'sex', 'sixx']),
  L('7', 'Seven', ['sev', 'en'], 0, ['seven', 'sevens', 'sevn']),
  L('8', 'Ait', ['ait'], 0, ['eight', 'ait', 'ate', 'eighth']),
  L('9', 'Niner', ['nin', 'er'], 0, ['niner', 'nine', 'nina', 'nyner', 'minor', 'nine er', 'nein'], {
    standard: [{ wort: 'nine', hinweis: 'hinweis.nine' }, { wort: 'nein', hinweis: 'hinweis.niner' }],
  }),
];

export const ZUSATZ: Sym[] = [
  L('.', 'Decimal', ['day', 'see', 'mal'], 0, ['decimal', 'daysimal', 'day see mal', 'point'], {
    standard: [{ wort: 'point', hinweis: 'hinweis.decimal' }],
  }),
  L('00', 'Hundred', ['hun', 'dred'], 0, ['hundred', 'hundret']),
  L('000', 'Tousand', ['tou', 'sand'], 0, ['tousand', 'thousand', 'tausend', 'tow sand'], {
    standard: [{ wort: 'thousand', hinweis: 'hinweis.thousand' }, { wort: 'tausend', hinweis: 'hinweis.tausend' }],
  }),
];

export const ALLE = [...BUCHSTABEN, ...ZIFFERN];
export const NACH_SYM: Record<string, Sym> = Object.fromEntries([...ALLE, ...ZUSATZ].map((s) => [s.sym, s]));

// Häufige Verwechslung: nationale Buchstabiertafeln. Werden unabhängig von der UI-Sprache erkannt und als Nicht-ICAO gewertet.
export type Tafel = 'at' | 'de_alt' | 'de' | 'fr' | 'it' | 'es' | 'en_alt';
/** UI-Sprache, in der eine Tafel „zu Hause“ ist (bei mehrdeutigen Wörtern wird diese Tafel genannt). */
export const TAFEL_SPRACHE: Record<Tafel, string> = { at: 'de', de_alt: 'de', de: 'de', fr: 'fr', it: 'it', es: 'es', en_alt: 'en' };
export const FREMDE_ALPHABETE: Record<string, { sym: string; tafeln: Tafel[] }> = {};

export const ohneAkzent = (w: string) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const ICAO_FORMEN = new Set([...ALLE, ...ZUSATZ].flatMap((s) => [s.wort, ...s.varianten]).map((w) => ohneAkzent(w).replace(/[^a-z0-9]/g, '')));
// Füllwörter, die im Satz ständig vorkommen (alte englische Tafel: How, Love, Easy, Item, Nan, Tare)
const AUSNAHMEN = new Set(['how', 'love', 'easy', 'item', 'nan', 'tare']);

const reg = (tafel: Tafel, woerter: string) =>
  woerter.split(' ').forEach((w, i) => {
    const k = ohneAkzent(w).replace(/[^a-z0-9]/g, '');
    if (ICAO_FORMEN.has(k) || AUSNAHMEN.has(k)) return;
    const e = (FREMDE_ALPHABETE[k] ??= { sym: String.fromCharCode(65 + i), tafeln: [] });
    if (e.sym === String.fromCharCode(65 + i)) e.tafeln.push(tafel);
  });
reg('at', 'Anton Berta Cäsar Dora Emil Friedrich Gustav Heinrich Ida Julius Konrad Ludwig Martha Nordpol Otto Paula Quelle Richard Siegfried Theodor Ulrich Viktor Wilhelm Xaver Ypsilon Zürich');
reg('de_alt', 'Anton Berta Cäsar Dora Emil Friedrich Gustav Heinrich Ida Julius Kaufmann Ludwig Martha Nordpol Otto Paula Quelle Richard Samuel Theodor Ulrich Viktor Wilhelm Xanthippe Ypsilon Zacharias');
reg('de', 'Aachen Berlin Chemnitz Düsseldorf Essen Frankfurt Goslar Hamburg Ingelheim Jena Köln Leipzig München Nürnberg Offenbach Potsdam Quickborn Rostock Salzwedel Tübingen Unna Völklingen Wuppertal Xanten Ypsilon Zwickau');
reg('fr', 'Anatole Berthe Célestin Désiré Eugène François Gaston Henri Irma Joseph Kléber Louis Marcel Nicolas Oscar Pierre Quintal Raoul Suzanne Thérèse Ursule Victor William Xavier Yvonne Zoé');
reg('it', 'Ancona Bologna Como Domodossola Empoli Firenze Genova Hotel Imola Jolly Kappa Livorno Milano Napoli Otranto Padova Quarto Roma Savona Torino Udine Venezia Washington Xilofono York Zara');
reg('es', 'Antonio Barcelona Carmen Dolores Enrique Francia Gerona Historia Inés José Kilo Lorenzo Madrid Navarra Oviedo París Querido Ramón Sábado Tarragona Ulises Valencia Washington Xilófono Yegua Zaragoza');
reg('en_alt', 'Able Baker Charlie Dog Easy Fox George How Item Jig King Love Mike Nan Oboe Peter Queen Roger Sugar Tare Uncle Victor William X-ray Yoke Zebra');

export function lautschrift(s: Sym) {
  return s.laut.map((x, i) => (i === s.betont ? x.toUpperCase() : x.toLowerCase())).join('-');
}
