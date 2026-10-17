import React, { useState } from 'react';
import { PageHead, Icon, FachChip, Bar } from '../ui.jsx';
import { useAppState, C, dueCards, LEITNER, fachStats, update, today, addDays, fachById } from '../store.js';
import { startSession } from './Fragen.jsx';

const BOX_NAMES = ['Neu', 'Fach 1', 'Fach 2', 'Fach 3', 'Fach 4', 'Fach 5'];

export default function Karteikasten() {
  const s = useAppState();
  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  const { due, neu, neuHeute } = dueCards(s, sel);
  const ids = sel.length ? sel : null;
  const boxes = [0, 0, 0, 0, 0, 0];
  for (const f of C.faecher) if (ids ? ids.includes(f.id) : !f.zusatz) fachStats(s, f.id).boxes.forEach((n, i) => (boxes[i] += n));
  const max = Math.max(1, ...boxes);
  const forecast = [1, 2, 3, 4, 5, 6, 7].map((d) => {
    const day = addDays(today(), d);
    return { day, n: C.fragen.filter((q) => (ids ? ids.includes(q.fachId) : !fachById[q.fachId]?.zusatz) && s.fragen[q.id]?.due === day).length };
  });
  const fmax = Math.max(1, ...forecast.map((f) => f.n));

  return (
    <>
      <PageHead icon="🗂️" title="Karteikasten" sub="Spaced Repetition nach dem Leitner-System: Richtig beantwortete Karten wandern ein Fach weiter und kommen seltener, falsche zurück in Fach 1. Ohne Auswahl: alle PPL-Fächer." />
      <div className="chips">{C.faecher.map((f) => <FachChip key={f.id} fach={f} active={sel.includes(f.id)} onClick={() => toggle(f.id)} />)}</div>

      <section className="card leitner-hero">
        <div>
          <h2 className="mt0">{due.length} Karten fällig</h2>
          <p className="muted">+ {neuHeute.length} neue Karten heute (Limit {s.settings.neueKartenProTag}/Tag) · {neu.length} noch nie gesehen</p>
          <div className="row gap wrap">
            <button className="btn primary big" disabled={!due.length && !neuHeute.length}
              onClick={() => startSession({ titel: 'Karteikasten', ids: [...due.map((q) => q.id), ...neuHeute.map((q) => q.id)], modus: 'karteikasten' })}>
              <Icon name="cards" size={18} /> Jetzt lernen
            </button>
            <button className="btn ghost" disabled={!neu.length} onClick={() => startSession({ titel: 'Neue Karten', ids: neu.map((q) => q.id), modus: 'karteikasten', zufall: true, anzahl: 10 })}>
              10 zusätzliche neue Karten
            </button>
          </div>
          <label className="inline-field mt">Neue Karten pro Tag
            <input type="number" min="0" max="200" value={s.settings.neueKartenProTag} onChange={(e) => update((st) => { st.settings.neueKartenProTag = Number(e.target.value) || 0; })} />
          </label>
        </div>
      </section>

      <section className="leitner">
        {boxes.map((n, i) => (
          <div key={i} className={`lbox b${i}`}>
            <div className="lbox-bar"><div style={{ height: `${(n / max) * 100}%` }} /></div>
            <strong>{n}</strong>
            <span>{BOX_NAMES[i]}</span>
            <small className="muted">{i === 0 ? 'ungesehen' : `alle ${LEITNER[i]} ${LEITNER[i] === 1 ? 'Tag' : 'Tage'}`}</small>
          </div>
        ))}
      </section>

      <section className="card">
        <h3 className="mt0">Vorschau nächste 7 Tage</h3>
        <div className="forecast">
          {forecast.map((f) => (
            <div key={f.day} className="fc">
              <div className="fc-bar"><div style={{ height: `${(f.n / fmax) * 100}%` }} /></div>
              <strong>{f.n}</strong>
              <small>{new Date(f.day + 'T12:00').toLocaleDateString('de-AT', { weekday: 'short' })}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
