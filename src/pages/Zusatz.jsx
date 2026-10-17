import React from 'react';
import { PageHead, Ring, Icon, Html, Check, Collapse, Bar } from '../ui.jsx';
import { useAppState, C, skriptById, fachById, skriptProgress, kapitelKey, fachStats, toggleCheck } from '../store.js';
import { Reader } from './Skripte.jsx';
import { startSession, startExam } from './Fragen.jsx';

export default function Zusatz({ route }) {
  const s = useAppState();
  const [id, kap, abs] = route.parts.slice(1);
  if (id && skriptById[id]) return <Reader skript={skriptById[id]} kapId={kap} abschnitt={abs} base="zusatz" />;
  const module = C.zusatz.module.map((m) => skriptById[m.id]).filter(Boolean);
  const zFaecher = C.faecher.filter((f) => f.zusatz);
  const ohneSkript = zFaecher.filter((f) => !f.skriptId);
  return (
    <>
      <PageHead icon="🌟" title={C.zusatz.titel} sub="Erweiterungen nach der PPL(A): Nachtflug, Mehrmotorenberechtigung, internationales Flugfunkzeugnis" />
      {!module.length && !zFaecher.length && (
        <div className="card empty-state">
          <div className="result-emoji">🛠️</div>
          <h2>Noch keine Zusatzmodule vorhanden</h2>
          <p className="muted">Sobald unter <code>docs/zusatzausbildungen/</code> Inhalte liegen (z. B. <code>nachtflug.md</code>, <code>mep.md</code>, <code>flugfunk-international.md</code>, <code>fragen-zusatz.json</code>), erscheinen sie nach einem Neubau der Plattform automatisch hier.</p>
        </div>
      )}
      <div className="skript-grid">
        {module.map((sk) => {
          const f = fachById[sk.fachId];
          const p = skriptProgress(s, sk);
          const st = f ? fachStats(s, f.id) : null;
          const next = sk.kapitel.find((k) => k.zaehlt && !s.gelesen[kapitelKey(sk.id, k.id)]);
          return (
            <div key={sk.id} className="skript-card" style={{ '--c': f?.farbe || '#6c5ce7' }}>
              <div className="skript-top">
                <span className="skript-icon">{f?.icon || '⭐'}</span>
                <Ring value={p.pct} size={54} stroke={6} color={f?.farbe || '#6c5ce7'} />
              </div>
              <h3>{sk.titel}</h3>
              <p className="muted small">{p.done}/{p.total} Kapitel gelesen{st ? ` · ${st.beantwortet}/${st.total} Fragen bearbeitet` : ''}</p>
              <div className="row gap wrap">
                <a className="btn primary sm" href={`#/zusatz/${sk.id}${next ? '/' + next.id : ''}`}><Icon name="book" size={14} /> {p.done ? 'Weiterlesen' : 'Lesen'}</a>
                {f && f.anzahlFragen > 0 && (
                  <>
                    <button className="btn ghost sm" onClick={() => startSession({ titel: f.name, ids: C.fragen.filter((q) => q.fachId === f.id).map((q) => q.id), modus: 'lernen', zufall: true, anzahl: 20 })}>Üben</button>
                    <button className="btn ghost sm" onClick={() => startExam([f.id])}>Test</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {ohneSkript.map((f) => (
          <div key={f.id} className="skript-card" style={{ '--c': f.farbe }}>
            <div className="skript-top"><span className="skript-icon">{f.icon}</span></div>
            <h3>{f.name}</h3>
            <p className="muted small">{f.anzahlFragen} Übungsfragen</p>
            <div className="row gap wrap">
              <button className="btn primary sm" onClick={() => startSession({ titel: f.name, ids: C.fragen.filter((q) => q.fachId === f.id).map((q) => q.id), modus: 'lernen', zufall: true, anzahl: 20 })}>Üben</button>
            </div>
          </div>
        ))}
      </div>
      {C.zusatz.module.filter((m) => m.checklisten.length).map((m) => {
        const items = m.checklisten.flatMap((c) => c.gruppen.flatMap((g) => g.items));
        const done = items.filter((i) => s.checks[i.id]).length;
        const f = fachById[m.fachId];
        return (
          <Collapse key={m.id} title={<><h3>{f?.icon || '⭐'} Ausbildungsplan: {m.titel}</h3><p className="muted small">{done}/{items.length} Punkte erledigt</p></>}
            right={<div className="phase-prog"><span>{done}/{items.length}</span><Bar value={items.length ? done / items.length : 0} color={done === items.length ? 'var(--ok)' : f?.farbe} /></div>}>
            {m.checklisten.map((cl) => (
              <div key={cl.id} className="checklist">
                <h4>{cl.titel}</h4>
                {cl.gruppen.map((g, gi) => (
                  <div key={gi}>
                    {g.label && g.label !== cl.titel && <p className="small muted mt0"><strong>{g.label}</strong></p>}
                    {g.items.map((it) => (
                      <Check key={it.id} sub={it.sub} checked={s.checks[it.id]} onChange={() => toggleCheck(it.id)}><span dangerouslySetInnerHTML={{ __html: it.html }} /></Check>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </Collapse>
        );
      })}
      {C.zusatz.intro && <Collapse title={<h3>Überblick: {C.zusatz.titel}</h3>}><Html html={C.zusatz.intro} /></Collapse>}
    </>
  );
}
