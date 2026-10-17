import React from 'react';
import { PageHead, Check, Bar, Icon, Html, navigate, FachChip, Collapse } from '../ui.jsx';
import { useAppState, C, toggleCheck, checklistProgress, currentWeek, weekDates, weekOf, update, fachById } from '../store.js';
import { startSession } from './Fragen.jsx';

const short = (iso) => new Date(iso + 'T12:00').toLocaleDateString('de-AT', { day: 'numeric', month: 'short' });

export default function Lernplan({ route }) {
  const s = useAppState();
  const wochen = C.lernplan.wochen;
  const cur = currentWeek(s);
  const curW = wochen.find((w) => weekOf(w, cur));
  const sel = wochen.find((w) => String(w.nr) === route.parts[1]) || curW || wochen[0];
  const all = checklistProgress(s, wochen.flatMap((w) => w.items));
  const blocks = [...new Set(wochen.map((w) => w.block))];

  if (!wochen.length) return <><PageHead title="Lernplan" /><p className="muted">Kein Wochenplan in lernplan.md gefunden.</p></>;
  return (
    <>
      <PageHead icon="🗓️" title="Lernplan Theorie" sub={`${C.lernplan.planTitel} · ${all.done}/${all.total} Aufgaben erledigt`}>
        <label className="inline-field">Lernstart
          <input type="date" value={s.settings.startDatum} onChange={(e) => update((st) => { st.settings.startDatum = e.target.value; })} />
        </label>
      </PageHead>
      {C.lernplan.ziel && <div className="alert info" dangerouslySetInnerHTML={{ __html: '🎯 ' + C.lernplan.ziel }} />}

      <div className="week-strip">
        {wochen.map((w) => {
          const p = checklistProgress(s, w.items);
          const isCur = weekOf(w, cur);
          return (
            <button key={w.id} onClick={() => navigate(`/lernplan/${w.nr}`)}
              className={`wk ${sel === w ? 'sel' : ''} ${isCur ? 'cur' : ''} ${p.pct === 1 ? 'done' : p.done ? 'part' : ''}`}>
              <small>{w.bis ? `W${w.nr}–${w.bis}` : `W${w.nr}`}</small>
              <span className="wk-bar" style={{ '--p': p.pct }} />
              <small className="wk-date">{short(weekDates(s, w.nr)[0])}</small>
            </button>
          );
        })}
      </div>

      {sel && <WeekCard s={s} w={sel} cur={cur} />}

      <h2 className="section-title">Alle Wochen</h2>
      {blocks.map((b) => (
        <div key={b || 'x'}>
          {b && <h3 className="block-title">{b}</h3>}
          <div className="week-grid">
            {wochen.filter((w) => w.block === b).map((w) => {
              const p = checklistProgress(s, w.items);
              return (
                <a key={w.id} href={`#/lernplan/${w.nr}`} className={`week-mini ${weekOf(w, cur) ? 'cur' : ''} ${p.pct === 1 ? 'done' : ''}`}>
                  <div className="row-between"><strong>{w.label}</strong><span className="muted small">{short(weekDates(s, w.nr)[0])}</span></div>
                  <p>{w.titel}</p>
                  <div className="dots">{w.faecher.slice(0, 5).map((f) => <span key={f} title={fachById[f]?.name}>{fachById[f]?.icon}</span>)}</div>
                  <Bar value={p.pct} height={6} color={p.pct === 1 ? 'var(--ok)' : 'var(--accent)'} />
                </a>
              );
            })}
          </div>
        </div>
      ))}

      {C.lernplan.checklisten.map((cl) => (
        <Collapse key={cl.id} title={<h3>{cl.titel} <span className="muted small">{checklistProgress(s, cl.items).done}/{cl.items.length}</span></h3>}>
          {cl.descHtml && <Html html={cl.descHtml} />}
          <div className="checklist">
            {cl.items.map((it) => (
              <Check key={it.id} sub={it.sub} checked={s.checks[it.id]} onChange={() => toggleCheck(it.id)}><span dangerouslySetInnerHTML={{ __html: it.html }} /></Check>
            ))}
          </div>
        </Collapse>
      ))}
      <Collapse title={<h3>Kompletter Lernplan (Text)</h3>}>
        <Html html={C.dokumente.find((d) => d.id === 'lernplan')?.html || ''} />
      </Collapse>
    </>
  );
}

function WeekCard({ s, w, cur }) {
  const p = checklistProgress(s, w.items);
  const [a, b] = weekDates(s, w.bis || w.nr).map(short);
  const start = short(weekDates(s, w.nr)[0]);
  const fragenIds = C.fragen.filter((q) => w.faecher.includes(q.fachId)).map((q) => q.id);
  return (
    <section className="card week-card">
      <div className="row-between wrap">
        <div>
          <p className="eyebrow">{w.block}{weekOf(w, cur) ? ' · diese Woche' : ''}</p>
          <h2 className="mt0">{w.label}: {w.titel}</h2>
          <p className="muted small">{start} – {b}</p>
        </div>
        <div className="week-prog"><strong>{p.done}/{p.total}</strong><Bar value={p.pct} color={p.pct === 1 ? 'var(--ok)' : 'var(--accent)'} /></div>
      </div>
      <div className="chips">{w.faecher.map((f) => <FachChip key={f} fach={fachById[f]} onClick={() => navigate(`/skripte/${fachById[f].skriptId}`)} />)}</div>
      <div className="checklist">
        {w.items.map((it) => (
          <Check key={it.id} sub={it.sub} checked={s.checks[it.id]} onChange={() => toggleCheck(it.id)}><span dangerouslySetInnerHTML={{ __html: it.html }} /></Check>
        ))}
      </div>
      {fragenIds.length > 0 && (
        <div className="row gap wrap">
          <button className="btn primary" onClick={() => startSession({ titel: `${w.label} – Übungsfragen`, ids: fragenIds, modus: 'lernen', anzahl: 20, zufall: true })}>
            <Icon name="quiz" size={16} /> 20 Fragen zu dieser Woche
          </button>
        </div>
      )}
    </section>
  );
}
