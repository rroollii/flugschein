// Liest die Projektinhalte (docs/) und erzeugt src/generated/content.json.
// Robust gegenüber inhaltlichen Änderungen: Es werden nur Dateinamen und grobe
// Markdown-Konventionen (## Kapitel, - [ ] Checkboxen, **Woche N – …**) vorausgesetzt.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.resolve(process.env.CONTENT_DIR || path.join(root, '../../docs'));
const OUT = path.join(root, 'src/generated/content.json');

const warn = (...a) => console.warn('  ⚠', ...a);
const read = (rel) => {
  const p = path.join(CONTENT_DIR, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : null;
};

export const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`[\]()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'x';
const hash = (s) => crypto.createHash('sha1').update(String(s).trim().replace(/\s+/g, ' ')).digest('hex').slice(0, 8);
const stripTags = (h) =>
  h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const cleanTitle = (t) => t.replace(/\s+[–-]\s+(Lernskript\s+)?PPL\(A\).*$/i, '').replace(/\s+[–-]\s+[^–]*(Lern)?skript\s*$/i, '').replace(/^\d+\.\s*/, '').trim();

// ---------- Link-Umschreibung (Markdown-Dateien -> Hash-Routen) ----------
function routeFor(href, baseDir) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return null;
  const [file, anchor] = href.split('#');
  if (!file) return anchor ? `#${anchor}` : null;
  const norm = path.posix.normalize(path.posix.join(baseDir, file)).replace(/^\.\//, '');
  const a = anchor ? `/${slug(decodeURIComponent(anchor))}` : '';
  if (/^skripte\/index\.md$/.test(norm) || /^skripte\/?$/.test(norm)) return '#/skripte';
  let m = norm.match(/^skripte\/(.+)\.md$/);
  if (m) return `#/skripte/${m[1]}${a}`;
  if (/^zusatzausbildungen\/(index\.md)?$/.test(norm) || norm === 'zusatzausbildungen') return '#/zusatz';
  m = norm.match(/^zusatzausbildungen\/(.+)\.md$/);
  if (m) return `#/zusatz/z-${m[1]}${a}`;
  if (/^zusatzausbildungen\//.test(norm)) return '#/zusatz';
  if (/^fragen\/(readme\.md)?$/i.test(norm)) return '#/dokumente/fragen-ueberblick';
  m = norm.match(/^fragen\/\d+-(.+)\.md$/);
  if (m) return `#/bibliothek/fragen/${m[1]}`;
  if (/^fragen/.test(norm) || /^pruefungssimulator/.test(norm)) return '#/fragen';
  if (/^ausbildungsplan\.md$/.test(norm)) return '#/ausbildung';
  if (/^lernplan\.md$/.test(norm)) return '#/lernplan';
  m = norm.match(/^([^/]+)\.md$/);
  if (m) return `#/dokumente/${m[1]}${a}`;
  return '#/';
}

function makeMarked(baseDir) {
  const mk = new Marked({ gfm: true });
  mk.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        return `<h${depth} id="${slug(text)}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const r = routeFor(href || '', baseDir);
        if (r === null) return `<a href="${href}" target="_blank" rel="noopener"${title ? ` title="${title}"` : ''}>${inner}</a>`;
        return `<a href="${r}">${inner}</a>`;
      },
    },
  });
  return mk;
}
const postHtml = (h) =>
  h.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
    .replace(/<input (checked="" )?disabled="" type="checkbox">/g, (m, c) => `<span class="md-check${c ? ' on' : ''}"></span>`);

const mdToHtml = (md, baseDir = '') => postHtml(makeMarked(baseDir).parse(md));
const mdInline = (md, baseDir = '') => makeMarked(baseDir).parseInline(md);

// ---------- Fächer & Fragen ----------
const fb = JSON.parse(read('fragen/fragenbank.json') || '{"faecher":[]}');
const PALETTE = ['#2f80ed', '#eb5757', '#27ae60', '#9b51e0', '#f2994a', '#00a3a3', '#e84393', '#56ccf2', '#6c5ce7', '#f2c94c'];
const ICONS = {
  luftrecht: '⚖️', menschlich: '🧠', meteo: '🌦️', kommunikation: '📻', grundlagen: '🪽', betrieb: '🛠️',
  flugleistung: '📐', luftfahrzeug: '✈️', navigation: '🧭',
};
const iconFor = (id) => Object.entries(ICONS).find(([k]) => id.includes(k))?.[1] || '📘';

const faecher = (fb.faecher || []).map((f, i) => ({
  id: f.id, nr: f.nr ?? i + 1, name: f.name, kuerzel: f.kuerzel || f.name.slice(0, 3).toUpperCase(),
  pruefung: f.pruefung || { fragen: 12, minuten: 24 }, farbe: PALETTE[i % PALETTE.length], icon: iconFor(f.id),
  skriptId: null, anzahlFragen: (f.fragen || []).length,
}));
const fragen = [];
for (const f of fb.faecher || []) {
  for (const q of f.fragen || []) {
    if (!q || !Array.isArray(q.antworten) || typeof q.richtig !== 'number') { warn('Frage übersprungen', q?.id); continue; }
    fragen.push({ id: q.id, fachId: f.id, frage: q.frage, antworten: q.antworten, richtig: q.richtig, erklaerung: q.erklaerung || '' });
  }
}

// Schlüsselwörter, um Texte (Lernplan, Ausbildung) einem Fach zuzuordnen
const SYN = {
  'allgemeine-luftfahrzeugkenntnisse': ['Luftfahrzeugkunde', 'Luftfahrzeugkenntnisse', 'Flugzeugkunde', 'Technik'],
  'flugleistung-und-flugplanung': ['Flugleistung', 'Flugplanung'],
  'menschliches-leistungsvermoegen': ['Menschliches Leistungsvermögen', 'Human Performance'],
  'grundlagen-des-fliegens': ['Grundlagen des Fliegens', 'Aerodynamik'],
  'betriebliche-verfahren': ['Betriebliche Verfahren'],
};
for (const f of faecher) f.keywords = [...new Set([f.name, ...(SYN[f.id] || [])])];
const fachMentions = (text) =>
  faecher.filter((f) => f.keywords.some((k) => text.toLowerCase().includes(k.toLowerCase()))).map((f) => f.id);

// ---------- Skripte ----------
const skriptDir = path.join(CONTENT_DIR, 'skripte');
const skriptFiles = fs.existsSync(skriptDir) ? fs.readdirSync(skriptDir).filter((f) => f.endsWith('.md') && f !== 'index.md' && !/^readme/i.test(f)).sort() : [];
const tokensOf = (s) => slug(s).split('-').filter((t) => t.length > 3 && !['und', 'des', 'der', 'die'].includes(t));

function parseSkript(dir, file, idPrefix, fachPool, bereich) {
  const id = idPrefix + file.replace(/\.md$/, '');
  const md = read(`${dir}/${file}`);
  const mk = makeMarked(dir);
  const tokens = mk.lexer(md);
  let titel = file.replace(/\.md$/, '');
  const intro = [];
  const chapters = [];
  // Kapitel-Ebene: normalerweise „##“. Hat ein Dokument nur wenige „##“-Teile, die in viele „###“
  // gegliedert sind (z. B. „Teil A – Ausbildungsplan / Teil B – Lernskript“), wird auf „###“ geteilt.
  const n2 = tokens.filter((t) => t.type === 'heading' && t.depth === 2).length;
  const n3 = tokens.filter((t) => t.type === 'heading' && t.depth === 3).length;
  const D = n2 <= 4 && n3 >= 2 * Math.max(1, n2) ? 3 : 2;
  let teil = null;
  for (const t of tokens) {
    if (t.type === 'heading' && t.depth === 1) { titel = cleanTitle(t.text); continue; }
    if (t.type === 'heading' && t.depth === 2 && D === 3) {
      teil = stripTags(mdInline(t.text));
      chapters.push({ titel: t.text, teil, tokens: [t], nurTeil: true });
      continue;
    }
    if (t.type === 'heading' && t.depth === D) { chapters.push({ titel: t.text, teil, tokens: [t] }); continue; }
    const cur = chapters[chapters.length - 1];
    if (cur && cur.nurTeil && t.type !== 'space' && t.type !== 'hr') cur.nurTeil = false;
    (cur ? cur.tokens : intro).push(t);
  }
  // Reine Teil-Überschriften ohne eigenen Text dem folgenden Kapitel voranstellen
  for (let i = chapters.length - 2; i >= 0; i--) {
    if (chapters[i].nurTeil) { chapters[i + 1].tokens.unshift(...chapters[i].tokens); chapters.splice(i, 1); }
  }
  const render = (toks) => { toks.links = tokens.links; return postHtml(mk.parser(toks)); };
  const seen = {};
  const kapitel = chapters.map((c) => {
    const html = render(c.tokens);
    const abschnitte = c.tokens.filter((t) => t.type === 'heading' && t.depth === D + 1).map((t) => ({ id: slug(t.text), titel: stripTags(mdInline(t.text)) }));
    const t = stripTags(mdInline(c.titel));
    let kid = slug(c.titel);
    seen[kid] = (seen[kid] || 0) + 1;
    if (seen[kid] > 1) kid += '-' + seen[kid];
    return {
      id: kid, titel: t, teil: c.teil || null, html, abschnitte,
      zaehlt: !/^(quellen|literatur|weiterf)/i.test(t),
      woerter: stripTags(html).split(' ').length,
    };
  });
  // Fach zuordnen über Token-Überlappung von Dateiname/Titel mit Fach-ID/Name
  const st = new Set([...tokensOf(file.replace(/\.md$/, '')), ...tokensOf(titel)]);
  const baseName = file.replace(/\.md$/, '');
  let best = fachPool.find((f) => f.id === baseName || f.id === `zusatz-${baseName}`) || null, bestScore = best ? 99 : 0;
  for (const f of best ? [] : fachPool) {
    const ft = [...new Set([...tokensOf(f.id), ...tokensOf(f.name), ...(f.keywords || []).flatMap(tokensOf)])];
    const score = ft.filter((x) => st.has(x)).length;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  if (best && !best.skriptId) best.skriptId = id;
  else if (!best && bereich === 'ppl') warn('Skript ohne Fachzuordnung:', file);
  return { id, titel, fachId: best?.id || null, bereich, intro: render(intro), kapitel };
}
const skripte = skriptFiles.map((file) => parseSkript('skripte', file, '', faecher, 'ppl'));
// Reihenfolge der Skripte wie die Fächer
skripte.sort((a, b) => (faecher.findIndex((f) => f.id === a.fachId) + 100 * !a.fachId) - (faecher.findIndex((f) => f.id === b.fachId) + 100 * !b.fachId));

const skriptIndexMd = read('skripte/index.md');
const skriptIndex = skriptIndexMd ? mdToHtml(skriptIndexMd.replace(/^# .*\n/, ''), 'skripte') : '';
let empfohleneReihenfolge = [];
if (skriptIndexMd) {
  const m = skriptIndexMd.match(/##[^\n]*Reihenfolge[^\n]*\n+([\s\S]*?)(\n## |\n\n[^0-9]|$)/i);
  if (m) {
    const parts = m[1].split(/→|\n\d+\.|\d+\.\s/).map((s) => s.trim()).filter(Boolean);
    for (const p of parts) for (const id of fachMentions(p)) if (!empfohleneReihenfolge.includes(id)) empfohleneReihenfolge.push(id);
  }
}
if (!empfohleneReihenfolge.length) empfohleneReihenfolge = faecher.map((f) => f.id);

// ---------- Checklisten-Dokumente (Ausbildungsplan, Lernplan) ----------
const CHECK = /^(\s*)[-*] \[( |x|X)\]\s+(.*)$/;
const WEEK = /^\s*(?:#{2,5}\s*)?\**\s*(Wochen?)\s+(\d+)(?:\s*[–-]\s*(\d+))?\s*(?:[–:-]\s*(.*?))?\s*\**\s*$/;
const PHASE = /^Phase\s+(\d+)\s*[–:-]\s*(.*)$/i;

function parseChecklistDoc(md, key, baseDir = '') {
  const lines = md.split('\n');
  const sections = [];
  let sec = null, group = null, block = null, label = null;
  const newSection = (titel) => {
    sec = { id: slug(titel), titel: stripTags(mdInline(titel)), items: [], gruppen: [], descMd: [], ziel: null, meilenstein: null, theorie: null };
    const pm = titel.match(PHASE);
    if (pm) { sec.phaseNr = Number(pm[1]); sec.kurz = stripTags(mdInline(pm[2])); }
    sections.push(sec); group = null; block = null; label = null;
  };
  newSection('Einleitung');
  let inCode = false;
  for (const raw of lines) {
    if (/^```/.test(raw.trim())) { inCode = !inCode; sec.descMd.push(raw); continue; }
    if (inCode) { sec.descMd.push(raw); continue; }
    if (/^# /.test(raw)) continue;
    const h2 = raw.match(/^## (.*)$/);
    if (h2) { newSection(h2[1].trim()); continue; }
    const h3 = raw.match(/^### (.*)$/);
    const wk = raw.match(WEEK);
    if (wk && (wk[4] || /\*\*/.test(raw) || /^#/.test(raw))) {
      group = {
        id: `${key}:${slug(sec.titel).slice(0, 20)}:w${wk[2]}${wk[3] ? '-' + wk[3] : ''}`,
        nr: Number(wk[2]), bis: wk[3] ? Number(wk[3]) : null,
        titel: stripTags(mdInline((wk[4] || '').replace(/\*\*/g, ''))), block, items: [],
      };
      group.label = `${wk[1]} ${wk[2]}${wk[3] ? '–' + wk[3] : ''}`;
      group.faecher = fachMentions(group.titel);
      sec.gruppen.push(group); label = null; continue;
    }
    if (h3) { block = stripTags(mdInline(h3[1])); label = block; group = null; sec.descMd.push(raw); continue; }
    const cm = raw.match(CHECK);
    if (cm) {
      const text = cm[3].trim();
      const item = {
        id: `${key}:${slug(sec.titel).slice(0, 20)}:${hash(text)}`,
        html: mdInline(text, baseDir), text: stripTags(mdInline(text)), sub: cm[1].length >= 2, label,
        faecher: fachMentions(text), vorgabe: cm[2].toLowerCase() === 'x',
      };
      (group ? group.items : sec.items).push(item);
      if (group) for (const f of item.faecher) if (!group.faecher.includes(f)) group.faecher.push(f);
      continue;
    }
    const bold = raw.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
    if (bold) {
      const k = bold[1].trim();
      if (/^ziel$/i.test(k)) { sec.ziel = mdInline(bold[2], baseDir); continue; }
      if (/^meilenstein/i.test(k)) { sec.meilenstein = { id: `${key}:ms:${slug(k)}`, titel: k, html: mdInline(bold[2], baseDir) }; continue; }
      if (/voraussetzung/i.test(k)) { label = k; continue; }
    }
    const tp = raw.match(/^Theorie parallel:\s*(.*)$/i);
    if (tp) { sec.theorie = { html: mdInline(tp[1], baseDir), faecher: fachMentions(tp[1]) }; continue; }
    const lab = raw.match(/^([^|#>\-*].{1,70}):\s*$/);
    if (lab && !group) { label = stripTags(mdInline(lab[1])); continue; }
    if (raw.trim() === '---') continue;
    sec.descMd.push(raw);
  }
  for (const s of sections) {
    const d = s.descMd.join('\n').trim();
    s.descHtml = d ? mdToHtml(d, baseDir) : '';
    delete s.descMd;
  }
  return sections;
}

function parseTableRows(md, sectionRe) {
  const m = md.match(new RegExp(`##[^\\n]*${sectionRe}[^\\n]*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'));
  if (!m) return [];
  return m[1].split('\n').filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1)
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim())).filter((c) => c[0] && !/^\*\*summe/i.test(c[0]));
}

// Ausbildungsplan
const apMd = read('ausbildungsplan.md') || '';
if (!apMd) warn('ausbildungsplan.md fehlt');
const apSections = parseChecklistDoc(apMd, 'ap');
const phasen = apSections.filter((s) => s.items.length || s.meilenstein);
// Mindestwerte: bevorzugt die Zeile „**Mindestwerte …**“, sonst die Tabelle im Überblick, sonst Part-FCL-Standard
const minLine = (apMd.match(/^.*Mindest(?:werte|stunden|anforderungen)[^\n]*\d+\s*h\s*(?:gesamt|dual)(?![a-zäöü])[^\n]*$/im) || [''])[0];
const ueMd = read('ppl-ueberblick.md') || '';
const tableVal = (re) => { const m = ueMd.match(re); return m ? Number(m[1]) : null; };
const fromLine = (re) => { const m = minLine.match(re); return m ? Number(m[1]) : null; };
const minima = {
  gesamt: fromLine(/(\d+)\s*h\s*gesamt(?![a-zäöü])/i) ?? tableVal(/Gesamtflugzeit[^|]*\|[^\d|]*(\d+)\s*h/i) ?? 45,
  dual: fromLine(/(\d+)\s*h\s*dual/i) ?? tableVal(/dual[^|]*\|[^\d|]*(\d+)\s*h/i) ?? 25,
  solo: fromLine(/(?:^|[·,;])\s*(\d+)\s*h\s*solo/i) ?? tableVal(/solo unter Aufsicht[^|]*\|[^\d|]*(\d+)\s*h/i) ?? 10,
  ueberlandSolo: fromLine(/(\d+)\s*h\s*(?:davon\s*)?Überland\s*solo/i) ?? tableVal(/Überland solo[^|]*\|[^\d|]*(\d+)\s*h/i) ?? 5,
  langerUeberlandKm: fromLine(/(\d+)\s*km/i) ?? 270,
  text: minLine.replace(/\*\*/g, '').replace(/^[-*\s]+/, ''),
};
const fristen = parseTableRows(apMd, 'Fristen').map((c) => ({ id: slug(c[0]), name: stripTags(mdInline(c[0])), notiz: c[3] ? stripTags(mdInline(c[3])) : '' }));
const ueberblickTabelle = (() => {
  const rows = parseTableRows(apMd, 'auf einen Blick');
  return rows.map((c) => ({ phaseNr: Number(c[0]), inhalt: c[1], flugzeit: c[2], theorie: c[3] })).filter((r) => !Number.isNaN(r.phaseNr));
})();
for (const p of phasen) {
  const r = ueberblickTabelle.find((x) => x.phaseNr === p.phaseNr);
  if (r) { p.flugzeit = r.flugzeit; p.theorieKurz = r.theorie; }
}

// Lernplan
const lpMd = read('lernplan.md') || '';
if (!lpMd) warn('lernplan.md fehlt');
const lpSections = parseChecklistDoc(lpMd, 'lp');
const planSection = lpSections.find((s) => s.gruppen.length >= 3) || null;
const wochen = planSection ? planSection.gruppen : [];
const lpChecklisten = lpSections.filter((s) => s !== planSection && (s.items.length || s.gruppen.length))
  .map((s) => ({ id: s.id, titel: s.titel, items: [...s.items, ...s.gruppen.flatMap((g) => g.items)], descHtml: s.descHtml }));
const lpZiel = (lpMd.match(/^>\s*Ziel:\s*(.*)$/m) || [])[1];

// ---------- Dokumente ----------
const DOCS = ['ppl-ueberblick', 'flugschule-fuerstenfeld', 'ausbildungsplan', 'lernplan'];
// Alle Markdown-Dateien der obersten Ebene sind Dokumente; dazu die Übersicht der Übungsfragen.
const extra = fs.existsSync(CONTENT_DIR) ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') && !/^(readme|index)\.md$/i.test(f)).sort().map((f) => f.replace(/\.md$/, '')) : [];
const docFromMd = (id, rel, baseDir = '', titelFallback = id) => {
  const md = read(rel);
  if (!md) return null;
  const titel = cleanTitle((md.match(/^# (.*)$/m) || [, titelFallback])[1]);
  const html = mdToHtml(md.replace(/^# .*\n/, ''), baseDir);
  const toc = [...md.matchAll(/^## (.*)$/gm)].map((m) => ({ id: slug(m[1]), titel: stripTags(mdInline(m[1])) }));
  return { id, titel, html, toc };
};
const dokumente = [
  ...[...new Set([...DOCS, ...extra])].map((id) => docFromMd(id, `${id}.md`)),
  docFromMd('fragen-ueberblick', 'fragen/README.md', 'fragen'),
  docFromMd('skripte-ueberblick', 'skripte/index.md', 'skripte'),
].filter(Boolean);

// ---------- Glossar ----------
let glossar = JSON.parse(fs.readFileSync(path.join(root, 'content/glossar.json'), 'utf8'));
const glMd = read('glossar.md');
if (glMd) {
  const add = [];
  for (const l of glMd.split('\n')) {
    let m = l.match(/^\|\s*\**([^|*]+?)\**\s*\|\s*([^|]+?)\s*\|/);
    if (m && !/^-+$/.test(m[1]) && !/^begriff$/i.test(m[1])) { add.push({ begriff: m[1].trim(), erklaerung: m[2].trim() }); continue; }
    m = l.match(/^[-*]?\s*\*\*(.+?)\*\*\s*[:–-]\s*(.+)$/);
    if (m) add.push({ begriff: m[1].trim(), erklaerung: m[2].trim() });
  }
  const map = new Map(glossar.map((g) => [g.begriff.toLowerCase(), g]));
  for (const g of add) map.set(g.begriff.toLowerCase(), { ...map.get(g.begriff.toLowerCase()), ...g });
  glossar = [...map.values()];
}
glossar = glossar.map((g) => ({ ...g, html: mdInline(g.erklaerung) })).sort((a, b) => a.begriff.localeCompare(b.begriff, 'de'));

// ---------- Zusatzausbildungen (optional: docs/zusatzausbildungen/) ----------
const ZDIR = 'zusatzausbildungen';
const zAbs = path.join(CONTENT_DIR, ZDIR);
const zusatz = { intro: '', titel: 'Zusatzausbildungen', module: [] };
if (fs.existsSync(zAbs)) {
  const zIndex = read(`${ZDIR}/index.md`);
  if (zIndex) {
    zusatz.titel = cleanTitle((zIndex.match(/^# (.*)$/m) || [, zusatz.titel])[1]);
    zusatz.intro = mdToHtml(zIndex.replace(/^# .*\n/, ''), ZDIR);
  }
  const zfb = read(`${ZDIR}/fragen-zusatz.json`);
  const zFaecher = [];
  if (zfb) {
    try {
      const data = JSON.parse(zfb);
      const ZICONS = { nacht: '🌙', mep: '🛩️', mehrmotor: '🛩️', funk: '📡', flugfunk: '📡', englisch: '📡' };
      const known = new Set(fragen.map((q) => q.id));
      (data.faecher || []).forEach((f, i) => {
        const id = faecher.some((x) => x.id === f.id) ? `zusatz-${f.id}` : f.id;
        const zf = {
          id, nr: 100 + i, name: f.name, kuerzel: f.kuerzel || f.name.slice(0, 3).toUpperCase(), zusatz: true,
          pruefung: f.pruefung || { fragen: Math.min(20, (f.fragen || []).length), minuten: 2 * Math.min(20, (f.fragen || []).length) },
          farbe: PALETTE[(faecher.length + i) % PALETTE.length],
          icon: Object.entries(ZICONS).find(([k]) => slug(f.id + ' ' + f.name).includes(k))?.[1] || '⭐',
          skriptId: null, anzahlFragen: 0, keywords: [f.name],
        };
        for (const q of f.fragen || []) {
          if (!q || !Array.isArray(q.antworten) || typeof q.richtig !== 'number') { warn('Zusatzfrage übersprungen', q?.id); continue; }
          const qid = known.has(q.id) ? `Z-${q.id}` : q.id;
          known.add(qid);
          fragen.push({ id: qid, fachId: id, frage: q.frage, antworten: q.antworten, richtig: q.richtig, erklaerung: q.erklaerung || '' });
          zf.anzahlFragen++;
        }
        zFaecher.push(zf);
      });
    } catch (e) {
      warn('fragen-zusatz.json nicht lesbar:', e.message);
    }
  }
  const zFiles = fs.readdirSync(zAbs).filter((f) => f.endsWith('.md') && f !== 'index.md' && !/^readme/i.test(f)).sort();
  // Reihenfolge laut index.md (Reihenfolge der Links), sonst alphabetisch
  if (zIndex) {
    const pos = (f) => { const i = zIndex.indexOf(f); return i < 0 ? 1e9 : i; };
    zFiles.sort((a, b) => pos(a) - pos(b));
  }
  for (const file of zFiles) {
    const sk = parseSkript(ZDIR, file, 'z-', zFaecher, 'zusatz');
    skripte.push(sk);
    // Abhakbare Punkte (z. B. „Ablauf mit Checkboxen“) des Moduls
    const secs = parseChecklistDoc(read(`${ZDIR}/${file}`), sk.id, ZDIR);
    const checklisten = [];
    for (const sec of secs) {
      const items = [...sec.items, ...sec.gruppen.flatMap((g) => g.items)];
      if (!items.length) continue;
      const gruppen = [];
      for (const it of items) {
        const g = gruppen[gruppen.length - 1];
        if (!g || g.label !== it.label) gruppen.push({ label: it.label, items: [it] });
        else g.items.push(it);
      }
      checklisten.push({ id: `${sk.id}:${sec.id}`, titel: sec.titel, gruppen, anzahl: items.length });
    }
    zusatz.module.push({
      id: sk.id, datei: `${ZDIR}/${file}`, titel: sk.titel, fachId: sk.fachId,
      kapitel: sk.kapitel.length, fragen: zFaecher.find((f) => f.id === sk.fachId)?.anzahlFragen || 0, checklisten,
    });
  }
  faecher.push(...zFaecher);
  const zDoc = docFromMd('zusatzausbildungen-ueberblick', `${ZDIR}/index.md`, ZDIR);
  if (zDoc) dokumente.push(zDoc);
}

// ---------- Ausgabe ----------
const ueberblickMd = read('ppl-ueberblick.md') || '';
const land = /Österreich|Austro Control/i.test(apMd + ueberblickMd) ? 'Österreich' : /Deutschland/.test(apMd + ueberblickMd) ? 'Deutschland' : '';
const content = {
  meta: {
    erstellt: new Date().toISOString(), stand: fb.stand || '', titel: 'Flugschein – PPL(A)-Lernplattform',
    land, schule: process.env.SCHULE || 'Flugschule Fürstenfeld',
    bestehensgrenze: fb.bestehensgrenze_prozent || 75, fragenHinweis: fb.hinweis || '',
  },
  faecher, fragen, skripte, skriptIndex, empfohleneReihenfolge,
  ausbildung: { phasen, minima, fristen, intro: apSections[0]?.descHtml || '', checklisten: apSections.filter((s) => !phasen.includes(s) && s.items.length) },
  lernplan: { ziel: lpZiel ? mdInline(lpZiel) : '', wochen, checklisten: lpChecklisten, planTitel: planSection?.titel || 'Wochenplan', planIntro: planSection?.descHtml || '' },
  dokumente, glossar, zusatz,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(content));
console.log(`✔ Inhalte aus ${CONTENT_DIR}`);
console.log(`  ${faecher.length} Fächer · ${fragen.length} Fragen · ${skripte.length} Skripte (${skripte.reduce((n, s) => n + s.kapitel.length, 0)} Kapitel)`);
console.log(`  ${phasen.length} Ausbildungsphasen (${phasen.reduce((n, p) => n + p.items.length, 0)} Punkte) · ${wochen.length} Lernwochen · ${fristen.length} Fristen · ${glossar.length} Glossarbegriffe · ${dokumente.length} Dokumente`);
console.log(`  Mindestwerte: ${JSON.stringify({ ...minima, text: undefined })}${land ? ' · Land: ' + land : ''}`);
console.log(`  Zusatzausbildungen: ${zusatz.module.map((m) => `${m.id} (${m.kapitel} Kap., ${m.fragen} Fragen, ${m.checklisten.reduce((n, c) => n + c.anzahl, 0)} Checkpunkte)`).join(' · ') || 'keine'}`);
console.log(`  ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB → ${path.relative(root, OUT)}`);
