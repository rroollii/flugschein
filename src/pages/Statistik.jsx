import React from 'react';
import { PageHead, Bar, Ring, pct, fmtDate } from '../ui.jsx';
import { useAppState, C, fachStats, skriptProgress, skriptById, today, addDays, streak, fachById } from '../store.js';
import { startExam, startSession } from './Fragen.jsx';

export default function Statistik() {
  const s = useAppState();
  const gesamt = fachStats(s, null);
  const days = 7 * 15;
  const start = addDays(today(), -days + 1);
  const cells = Array.from({ length: days }, (_, i) => addDays(start, i));
  const pad = (new Date(start + 'T12:00').getDay() + 6) % 7;
  const maxA = Math.max(1, ...cells.map((d) => s.aktivitaet[d] || 0));
  const aktiveTage = Object.keys(s.aktivitaet).length;

  return (
    <>
      <PageHead icon="📊" title="Statistik" sub="Dein Lernstand je Prüfungsfach" />
      <section className="grid4">
        <div className="stat-card"><Ring value={gesamt.abdeckung} size={70} stroke={8} color="#2f80ed" /><div><h3>Bearbeitet</h3><p>{gesamt.beantwortet} / {gesamt.total} Fragen</p></div></div>
        <div className="stat-card"><Ring value={gesamt.quoteZuletzt} size={70} stroke={8} color="#27ae60" /><div><h3>Zuletzt richtig</h3><p>{gesamt.richtigZuletzt} Fragen</p></div></div>
        <div className="stat-card"><Ring value={gesamt.beherrscht} size={70} stroke={8} color="#9b51e0" /><div><h3>Sicher</h3><p>{gesamt.sicher} Fragen ab Fach 3</p></div></div>
        <div className="stat-card"><Ring value={Math.min(1, streak(s) / 30)} label={streak(s)} size={70} stroke={8} color="#f2994a" /><div><h3>Tage Serie</h3><p>{aktiveTage} aktive Tage insgesamt</p></div></div>
      </section>

      <section className="card">
        <h3 className="mt0">Aktivität (letzte 15 Wochen)</h3>
        <div className="heatmap">
          {Array.from({ length: pad }, (_, i) => <span key={'p' + i} className="hm empty" />)}
          {cells.map((d) => {
            const n = s.aktivitaet[d] || 0;
            return <span key={d} className="hm" title={`${fmtDate(d)}: ${n}`} style={{ '--a': n ? 0.25 + (0.75 * n) / maxA : 0 }} />;
          })}
        </div>
      </section>

      <div className="fach-stats">
        {C.faecher.map((f) => {
          const st = fachStats(s, f.id);
          const sk = skriptById[f.skriptId];
          const sp = sk ? skriptProgress(s, sk) : null;
          const exams = s.pruefungen.filter((p) => p.fachId === f.id);
          const best = exams.reduce((m, p) => Math.max(m, p.prozent), 0);
          const bereit = st.quoteZuletzt >= 0.9 && st.abdeckung >= 0.9 && exams.slice(-2).length === 2 && exams.slice(-2).every((p) => p.prozent >= 85);
          return (
            <section key={f.id} className="card fach-card" style={{ '--c': f.farbe }}>
              <div className="row-between">
                <h3 className="mt0">{f.icon} {f.name}</h3>
                {bereit ? <span className="pill ok">prüfungsreif</span> : f.zusatz ? <span className="pill">Zusatz</span> : null}
              </div>
              <div className="fs-rows">
                <span>Skript gelesen</span><Bar value={sp?.pct} color={f.farbe} /><small>{sp ? `${sp.done}/${sp.total}` : '–'}</small>
                <span>Fragen bearbeitet</span><Bar value={st.abdeckung} color={f.farbe} /><small>{st.beantwortet}/{st.total}</small>
                <span>Zuletzt richtig</span><Bar value={st.quoteZuletzt} color={f.farbe} marker={C.meta.bestehensgrenze / 100} /><small>{pct(st.quoteZuletzt)}</small>
                <span>Sicher (Fach ≥ 3)</span><Bar value={st.beherrscht} color={f.farbe} /><small>{st.sicher}</small>
              </div>
              <p className="muted small">
                Trefferquote gesamt {pct(st.quote)} · {st.falsch} offene Fehler · Prüfungen: {exams.length}{exams.length ? ` (beste ${best} %, letzte ${exams[exams.length - 1].prozent} %)` : ''}
              </p>
              <div className="row gap wrap">
                <button className="btn ghost sm" onClick={() => startSession({ titel: f.name, ids: C.fragen.filter((q) => q.fachId === f.id).map((q) => q.id), modus: 'lernen', zufall: true, anzahl: 20 })}>Üben</button>
                <button className="btn ghost sm" onClick={() => startExam([f.id])}>Prüfung</button>
                {sk && <a className="btn ghost sm" href={`#/${f.zusatz ? 'zusatz' : 'skripte'}/${sk.id}`}>Skript</a>}
              </div>
            </section>
          );
        })}
      </div>

      <section className="card">
        <h3 className="mt0">Prüfungsverlauf</h3>
        {!s.pruefungen.length ? <p className="muted">Noch keine Prüfungssimulation abgelegt.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Datum</th><th>Prüfung</th><th>Ergebnis</th><th>Dauer</th><th /></tr></thead>
              <tbody>
                {[...s.pruefungen].reverse().map((p, i) => (
                  <tr key={i}>
                    <td>{fmtDate(p.datum)}</td>
                    <td>{p.titel || fachById[p.fachId]?.name || p.fachId}</td>
                    <td>{p.richtig}/{p.anzahl} · {p.prozent} %</td>
                    <td>{Math.round(p.dauerSek / 60)} min</td>
                    <td><span className={`pill ${p.bestanden ? 'ok' : 'bad'}`}>{p.bestanden ? 'bestanden' : 'nicht bestanden'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
