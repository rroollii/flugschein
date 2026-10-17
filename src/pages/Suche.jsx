import React, { useMemo } from 'react';
import { PageHead } from '../ui.jsx';
import { C, fachById } from '../store.js';
import { startSession } from './Fragen.jsx';

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

let INDEX = null;
function buildIndex() {
  const idx = [];
  for (const sk of C.skripte) {
    const base = sk.bereich === 'zusatz' ? 'zusatz' : 'skripte';
    for (const k of sk.kapitel) {
      const parts = k.html.split(/(?=<h3 )/);
      parts.forEach((p, i) => {
        const m = p.match(/^<h3 id="([^"]+)">([\s\S]*?)<\/h3>/);
        const titel = m ? strip(m[2]) : k.titel;
        const text = strip(p);
        idx.push({ typ: 'Skript', titel: `${sk.titel} › ${k.titel}${m && i ? ' › ' + titel : ''}`, text, href: `#/${base}/${sk.id}/${k.id}${m ? '/' + m[1] : ''}`, n: norm(titel + ' ' + text), boost: norm(titel) });
      });
    }
  }
  for (const q of C.fragen) {
    const text = `${q.frage} – ${q.antworten[q.richtig]}. ${q.erklaerung}`;
    idx.push({ typ: 'Frage', titel: q.frage, text, qid: q.id, fach: q.fachId, n: norm(text + ' ' + q.antworten.join(' ')), boost: norm(q.frage) });
  }
  for (const g of C.glossar) idx.push({ typ: 'Glossar', titel: g.begriff, text: strip(g.html), href: `#/glossar?q=${encodeURIComponent(g.begriff)}`, n: norm(g.begriff + ' ' + g.erklaerung), boost: norm(g.begriff) });
  for (const d of C.dokumente) {
    d.html.split(/(?=<h2 )/).forEach((p) => {
      const m = p.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/);
      const titel = m ? strip(m[2]) : d.titel;
      idx.push({ typ: 'Dokument', titel: `${d.titel}${m ? ' › ' + titel : ''}`, text: strip(p), href: `#/dokumente/${d.id}${m ? '/' + m[1] : ''}`, n: norm(titel + ' ' + strip(p)), boost: norm(titel) });
    });
  }
  return idx;
}

function snippet(text, terms) {
  const n = norm(text);
  let pos = -1;
  for (const t of terms) { pos = n.indexOf(t); if (pos >= 0) break; }
  const start = Math.max(0, pos - 60);
  let s = (start ? '…' : '') + text.slice(start, start + 200) + (text.length > start + 200 ? '…' : '');
  s = s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  for (const t of terms) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    s = s.replace(re, '<mark>$1</mark>');
  }
  return s;
}

export default function Suche({ route }) {
  const q = (route.query.q || '').trim();
  const res = useMemo(() => {
    if (q.length < 2) return [];
    INDEX = INDEX || buildIndex();
    const terms = norm(q).split(/\s+/).filter(Boolean);
    return INDEX.filter((e) => terms.every((t) => e.n.includes(t)))
      .map((e) => ({ ...e, score: terms.reduce((n, t) => n + (e.boost.includes(t) ? 10 : 0) + (e.typ === 'Glossar' ? 5 : 0), 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 80)
      .map((e) => ({ ...e, snip: snippet(e.text, terms) }));
  }, [q]);
  const groups = ['Glossar', 'Skript', 'Dokument', 'Frage'];
  return (
    <>
      <PageHead icon="🔎" title="Suche" sub={q ? `${res.length}${res.length === 80 ? '+' : ''} Treffer für „${q}“` : 'Suchbegriff oben eingeben (mind. 2 Zeichen).'} />
      {q && !res.length && <p className="muted">Keine Treffer. Tipp: Abkürzungen (z. B. QNH, VOR) oder Wortanfänge probieren.</p>}
      {groups.map((g) => {
        const list = res.filter((r) => r.typ === g);
        if (!list.length) return null;
        return (
          <section key={g}>
            <h2 className="section-title">{g === 'Frage' ? 'Übungsfragen' : g === 'Skript' ? 'Skripte' : g === 'Dokument' ? 'Dokumente' : 'Glossar'} <span className="muted small">({list.length})</span></h2>
            <div className="results">
              {list.map((r, i) =>
                r.qid ? (
                  <button key={i} className="result-item" onClick={() => startSession({ titel: 'Frage aus der Suche', ids: [r.qid], modus: 'lernen' })}>
                    <span className="pill">{fachById[r.fach]?.icon} {fachById[r.fach]?.kuerzel}</span>
                    <strong>{r.titel}</strong>
                    <p className="small muted" dangerouslySetInnerHTML={{ __html: r.snip }} />
                  </button>
                ) : (
                  <a key={i} className="result-item" href={r.href}>
                    <strong>{r.titel}</strong>
                    <p className="small muted" dangerouslySetInnerHTML={{ __html: r.snip }} />
                  </a>
                ),
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
