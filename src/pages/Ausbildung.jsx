import React, { useEffect, useState } from 'react';
import { PageHead, Tabs, Check, Bar, Icon, Html, navigate, fmtDate, fmtH, Collapse } from '../ui.jsx';
import { useAppState, C, toggleCheck, checklistProgress, phaseItems, allPhaseItems, logTotals, update, today, daysBetween } from '../store.js';

export default function Ausbildung({ route }) {
  const tab = route.parts[1] || 'phasen';
  const s = useAppState();
  const t = logTotals(s);
  const p = checklistProgress(s, allPhaseItems());
  return (
    <>
      <PageHead icon="🛩️" title="Ausbildung" sub={`Praxis-Ausbildungsplan, Flugbuch und Fristen · ${p.done}/${p.total} Punkte erledigt`}>
      </PageHead>
      <Tabs active={tab} onChange={(id) => navigate(`/ausbildung/${id}`)}
        tabs={[{ id: 'phasen', label: 'Phasen & Meilensteine' }, { id: 'logbuch', label: 'Flugbuch', badge: s.logbuch.length || null }, { id: 'fristen', label: 'Fristen' }, { id: 'dokument', label: 'Plan als Text' }]} />
      {tab === 'phasen' && <Phasen s={s} focus={route.parts[2]} />}
      {tab === 'logbuch' && <Logbuch s={s} t={t} />}
      {tab === 'fristen' && <Fristen s={s} />}
      {tab === 'dokument' && <DocView id="ausbildungsplan" />}
    </>
  );
}

export function DocView({ id }) {
  const d = C.dokumente.find((x) => x.id === id);
  return d ? <div className="card"><Html html={d.html} /></div> : <p className="muted">Dokument nicht vorhanden.</p>;
}

function Minima({ t }) {
  const m = C.ausbildung.minima;
  const rows = [
    ['Gesamtflugzeit', t.gesamt, m.gesamt, '#2f80ed'],
    ['Dual (mit Fluglehrer)', t.dual, m.dual, '#27ae60'],
    ['Solo', t.solo, m.solo, '#f2994a'],
    ['davon Überland solo', t.ueberlandSolo, m.ueberlandSolo, '#9b51e0'],
  ];
  return (
    <div className="card">
      <div className="card-head"><h2><Icon name="target" /> Mindestanforderungen</h2><span className="muted small">{t.fluege} Flüge · {t.landungen} Landungen</span></div>
      <div className="minima">
        {rows.map(([l, v, max, c]) => (
          <div key={l} className="minima-row">
            <div className="row-between"><span>{l}</span><strong>{fmtH(v)} / {max}:00 h {v >= max && '✅'}</strong></div>
            <Bar value={v / max} color={c} height={10} />
          </div>
        ))}
        <div className="minima-row">
          <div className="row-between"><span>Langer Überlandflug solo (≥ {m.langerUeberlandKm} km, 2 Landungen auswärts)</span><strong>{t.langerUeberland ? '✅ erledigt' : 'offen'}</strong></div>
        </div>
      </div>
      {m.text && <p className="muted small">Laut Ausbildungsplan: {m.text}</p>}
    </div>
  );
}

function Phasen({ s, focus }) {
  useEffect(() => {
    if (focus) setTimeout(() => document.getElementById('phase-' + focus)?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [focus]);
  const phasen = C.ausbildung.phasen;
  return (
    <>
      <div className="timeline">
        {phasen.map((ph) => {
          const items = phaseItems(ph);
          const pr = checklistProgress(s, items);
          const msDone = ph.meilenstein && s.checks[ph.meilenstein.id];
          const groups = [];
          for (const it of ph.items) {
            const g = groups[groups.length - 1];
            if (!g || g.label !== it.label) groups.push({ label: it.label, items: [it] });
            else g.items.push(it);
          }
          return (
            <div key={ph.id} id={'phase-' + ph.id} className={`phase ${pr.pct === 1 ? 'done' : pr.done ? 'active' : ''}`}>
              <div className="phase-dot">{pr.pct === 1 ? <Icon name="check" size={16} /> : ph.phaseNr ?? '+'}</div>
              <Collapse open={focus === ph.id || (pr.done > 0 && pr.pct < 1)} className="phase-card"
                title={<><h3>{ph.titel}</h3><p className="muted small">{[ph.flugzeit, ph.theorieKurz && 'Theorie: ' + ph.theorieKurz].filter(Boolean).join(' · ')}</p></>}
                right={<div className="phase-prog"><span>{pr.done}/{pr.total}</span><Bar value={pr.pct} color={pr.pct === 1 ? 'var(--ok)' : 'var(--accent)'} /></div>}>
                {ph.ziel && <p className="phase-goal"><strong>Ziel:</strong> <span dangerouslySetInnerHTML={{ __html: ph.ziel }} /></p>}
                {groups.map((g, i) => (
                  <div key={i} className="checklist">
                    {g.label && <h4>{g.label}</h4>}
                    {g.items.map((it) => (
                      <Check key={it.id} sub={it.sub} checked={s.checks[it.id]} onChange={() => toggleCheck(it.id)}>
                        <span dangerouslySetInnerHTML={{ __html: it.html }} />
                        {s.checks[it.id] && <span className="done-date">{fmtDate(s.checks[it.id])}</span>}
                      </Check>
                    ))}
                  </div>
                ))}
                {ph.theorie && <p className="small muted">📚 Theorie parallel: <span dangerouslySetInnerHTML={{ __html: ph.theorie.html }} /></p>}
                {ph.meilenstein && (
                  <div className={`milestone ${msDone ? 'on' : ''}`}>
                    <Check big checked={msDone} onChange={() => toggleCheck(ph.meilenstein.id)}>
                      <strong>🏁 {ph.meilenstein.titel}:</strong> <span dangerouslySetInnerHTML={{ __html: ph.meilenstein.html }} />
                    </Check>
                  </div>
                )}
                {ph.descHtml && <Collapse title={<span className="small">Weitere Hinweise</span>}><Html html={ph.descHtml} /></Collapse>}
              </Collapse>
            </div>
          );
        })}
      </div>
    </>
  );
}

const EMPTY = () => ({ datum: today(), art: 'dual', dauer: '', ueberland: false, langerUeberland: false, landungen: 1, kennzeichen: '', route: '', bemerkung: '' });
const parseDauer = (v) => {
  const str = String(v).trim().replace(',', '.');
  if (!str) return 0;
  if (str.includes(':')) {
    const [h, m] = str.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  return Math.round(Number(str) * 60) || 0;
};

function Logbuch({ s, t }) {
  const [f, setF] = useState(EMPTY());
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const save = (e) => {
    e.preventDefault();
    const minuten = parseDauer(f.dauer);
    if (!minuten) return alert('Bitte eine Flugdauer angeben (z. B. 1:15 oder 1,25).');
    const entry = { ...f, minuten, landungen: Number(f.landungen) || 0, ueberland: !!f.ueberland, langerUeberland: f.art === 'solo' && f.ueberland && f.langerUeberland };
    delete entry.dauer;
    update((st) => {
      if (editId) st.logbuch = st.logbuch.map((x) => (x.id === editId ? { ...entry, id: editId } : x));
      else st.logbuch.push({ ...entry, id: Date.now().toString(36) });
      const d = today();
      st.aktivitaet[d] = (st.aktivitaet[d] || 0) + 1;
    });
    setF(EMPTY());
    setEditId(null);
  };
  const edit = (x) => {
    setEditId(x.id);
    setF({ ...EMPTY(), ...x, dauer: fmtH(x.minuten / 60) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const del = (id) => confirm('Diesen Flug löschen?') && update((st) => { st.logbuch = st.logbuch.filter((x) => x.id !== id); });
  const list = [...s.logbuch].sort((a, b) => (b.datum || '').localeCompare(a.datum || ''));
  return (
    <div className="two-col">
      <div>
        <form className="card form" onSubmit={save}>
          <div className="card-head"><h2><Icon name="log" /> {editId ? 'Flug bearbeiten' : 'Flug eintragen'}</h2></div>
          <div className="form-grid">
            <label>Datum<input type="date" value={f.datum} onChange={set('datum')} required /></label>
            <label>Art
              <div className="seg">
                {[['dual', 'Dual'], ['solo', 'Solo']].map(([v, l]) => (
                  <button type="button" key={v} className={f.art === v ? 'active' : ''} onClick={() => setF({ ...f, art: v })}>{l}</button>
                ))}
              </div>
            </label>
            <label>Flugzeit (h:mm)<input inputMode="decimal" placeholder="z. B. 1:15" value={f.dauer} onChange={set('dauer')} required /></label>
            <label>Landungen<input type="number" min="0" value={f.landungen} onChange={set('landungen')} /></label>
            <label>Kennzeichen<input placeholder="z. B. OE-…" value={f.kennzeichen} onChange={set('kennzeichen')} /></label>
            <label>Route / Übung<input placeholder="z. B. LOGF – Platzrunden" value={f.route} onChange={set('route')} /></label>
          </div>
          <div className="form-checks">
            <Check checked={f.ueberland} onChange={set('ueberland')}>Überlandflug</Check>
            {f.art === 'solo' && f.ueberland && (
              <Check checked={f.langerUeberland} onChange={set('langerUeberland')}>Langer Überlandflug (≥ {C.ausbildung.minima.langerUeberlandKm} km, 2 Landungen auswärts)</Check>
            )}
          </div>
          <label className="full">Bemerkung<input value={f.bemerkung} onChange={set('bemerkung')} placeholder="Übungen, Wetter, Lehrer …" /></label>
          <div className="row gap">
            <button className="btn primary" type="submit"><Icon name={editId ? 'check' : 'plus'} size={16} /> {editId ? 'Speichern' : 'Eintragen'}</button>
            {editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setF(EMPTY()); }}>Abbrechen</button>}
          </div>
        </form>
        <div className="card">
          <div className="card-head"><h2>Flüge</h2><span className="muted small">{list.length} Einträge</span></div>
          {!list.length && <p className="muted">Noch keine Flüge eingetragen. Trage nach jedem Flug Datum, Art, Zeit und Landungen ein – so siehst du deinen Fortschritt zu den Mindeststunden.</p>}
          <div className="table-wrap">
            {list.length > 0 && (
              <table className="log-table">
                <thead><tr><th>Datum</th><th>Art</th><th>Zeit</th><th>Ldg.</th><th>Route / Bemerkung</th><th /></tr></thead>
                <tbody>
                  {list.map((x) => (
                    <tr key={x.id}>
                      <td>{fmtDate(x.datum)}</td>
                      <td><span className={`tag ${x.art}`}>{x.art === 'solo' ? 'Solo' : 'Dual'}</span>{x.ueberland && <span className="tag xc">Überland</span>}{x.langerUeberland && <span className="tag long">270 km</span>}</td>
                      <td>{fmtH(x.minuten / 60)}</td>
                      <td>{x.landungen}</td>
                      <td className="small">{[x.kennzeichen, x.route, x.bemerkung].filter(Boolean).join(' · ')}</td>
                      <td className="nowrap">
                        <button className="icon-btn sm" onClick={() => edit(x)} aria-label="Bearbeiten"><Icon name="edit" size={16} /></button>
                        <button className="icon-btn sm" onClick={() => del(x.id)} aria-label="Löschen"><Icon name="trash" size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div>
        <Minima t={t} />
        <div className="card">
          <div className="card-head"><h2>Summen</h2></div>
          <div className="kv">
            <span>Dual Überland</span><strong>{fmtH(t.ueberlandDual)} h</strong>
            <span>Solo gesamt</span><strong>{fmtH(t.solo)} h</strong>
            <span>Landungen</span><strong>{t.landungen}</strong>
            <span>Flüge</span><strong>{t.fluege}</strong>
          </div>
          <p className="muted small">Das offizielle Flugbuch bleibt maßgeblich – diese Übersicht dient deiner Planung.</p>
        </div>
      </div>
    </div>
  );
}

function Fristen({ s }) {
  const set = (id, k, v) => update((st) => { st.fristen[id] = { ...(st.fristen[id] || {}), [k]: v }; });
  return (
    <div className="card">
      <div className="card-head"><h2><Icon name="clock" /> Fristen-Tracker</h2></div>
      <p className="muted small">Trage Beginn und Ablauf ein – auf der Übersicht erscheint eine Warnung, sobald eine Frist in weniger als 60 Tagen abläuft.</p>
      <div className="fristen">
        {C.ausbildung.fristen.map((f) => {
          const v = s.fristen[f.id] || {};
          const d = v.ablauf ? daysBetween(today(), v.ablauf) : null;
          return (
            <div key={f.id} className={`frist ${d != null && d < 0 ? 'bad' : d != null && d <= 60 ? 'warn' : ''}`}>
              <div className="frist-name"><strong>{f.name}</strong>{f.notiz && <small className="muted">{f.notiz}</small>}</div>
              <label>Beginn<input type="date" value={v.beginn || ''} onChange={(e) => set(f.id, 'beginn', e.target.value)} /></label>
              <label>Ablauf<input type="date" value={v.ablauf || ''} onChange={(e) => set(f.id, 'ablauf', e.target.value)} /></label>
              <label className="grow">Notiz<input value={v.notiz || ''} onChange={(e) => set(f.id, 'notiz', e.target.value)} /></label>
              <span className="frist-status">{d == null ? '–' : d < 0 ? `abgelaufen` : `${d} Tage`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
