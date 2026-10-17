import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageHead, Icon, navigate, shuffle, FachChip, Bar, pct, Tabs } from '../ui.jsx';
import { useAppState, C, fachById, frageById, recordAnswer, recordExam, toggleGemerkt, fachStats } from '../store.js';

let pending = null;
export function startSession(cfg) {
  let ids = cfg.ids || [];
  if (cfg.zufall) ids = shuffle(ids);
  if (cfg.anzahl) ids = ids.slice(0, cfg.anzahl);
  pending = { ...cfg, ids };
  navigate(`/fragen/${cfg.modus === 'pruefung' ? 'pruefung' : 'sitzung'}?k=${Date.now()}`);
}
export function startExam(fachIds, opts = {}) {
  const parts = fachIds.map((id) => {
    const f = fachById[id];
    const pool = C.fragen.filter((q) => q.fachId === id);
    return { f, ids: shuffle(pool.map((q) => q.id)).slice(0, opts.anzahl || f.pruefung.fragen) };
  });
  const ids = parts.flatMap((p) => p.ids);
  const minuten = opts.minuten || parts.reduce((n, p) => n + Math.round((p.f.pruefung.minuten * p.ids.length) / p.f.pruefung.fragen), 0);
  startSession({ modus: 'pruefung', ids, minuten, fachId: fachIds.length === 1 ? fachIds[0] : 'mix', titel: opts.titel || (fachIds.length === 1 ? fachById[fachIds[0]].name : 'Gemischte Prüfung') });
}

export default function Fragen({ route }) {
  const sub = route.parts[1];
  if (sub === 'sitzung' && pending) return <Quiz key={route.query.k} cfg={pending} />;
  if (sub === 'pruefung' && pending) return <Exam key={route.query.k} cfg={pending} />;
  return <Setup />;
}

const isZusatz = (f) => !!f.zusatz;

function Setup() {
  const s = useAppState();
  const [tab, setTab] = useState('lernen');
  const [sel, setSel] = useState([]);
  const [anzahl, setAnzahl] = useState(20);
  const [filter, setFilter] = useState('alle');
  const haupt = C.faecher.filter((f) => !isZusatz(f));
  const zusatz = C.faecher.filter(isZusatz);
  const toggle = (id) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  const pool = C.fragen.filter((q) => (sel.length ? sel.includes(q.fachId) : !fachById[q.fachId]?.zusatz));
  const filtered = pool.filter((q) => {
    const r = s.fragen[q.id];
    if (filter === 'neu') return !r;
    if (filter === 'falsch') return r && !r.lastOk;
    if (filter === 'gemerkt') return s.gemerkt[q.id];
    return true;
  });
  const fehler = C.fragen.filter((q) => s.fragen[q.id] && !s.fragen[q.id].lastOk);
  const gemerkt = C.fragen.filter((q) => s.gemerkt[q.id]);

  const chips = (list) => <div className="chips">{list.map((f) => <FachChip key={f.id} fach={f} active={sel.includes(f.id)} onClick={() => toggle(f.id)} />)}</div>;

  return (
    <>
      <PageHead icon="❓" title="Übungsfragen" sub={`${C.fragen.length} Fragen · Bestehensgrenze ${C.meta.bestehensgrenze} % je Fach`} />
      <div className="mode-grid">
        <button className={`mode ${tab === 'lernen' ? 'active' : ''}`} onClick={() => setTab('lernen')}><span>📖</span><strong>Lernmodus</strong><small>Sofortiges Feedback mit Erklärung</small></button>
        <button className={`mode ${tab === 'pruefung' ? 'active' : ''}`} onClick={() => setTab('pruefung')}><span>⏱️</span><strong>Prüfungsmodus</strong><small>Original-Fragenzahl und Zeitlimit</small></button>
        <button className={`mode ${tab === 'fehler' ? 'active' : ''}`} onClick={() => setTab('fehler')}><span>🔁</span><strong>Fehler</strong><small>{fehler.length} falsch · {gemerkt.length} gemerkt</small></button>
        <a className="mode" href="#/karteikasten"><span>🗂️</span><strong>Karteikasten</strong><small>Spaced Repetition</small></a>
      </div>

      {tab === 'lernen' && (
        <section className="card">
          <h3 className="mt0">Fächer wählen <span className="muted small">(keine Auswahl = alle Hauptfächer)</span></h3>
          {chips(haupt)}
          {zusatz.length > 0 && <><h4>Zusatzausbildungen</h4>{chips(zusatz)}</>}
          <div className="row gap wrap mt">
            <div className="seg">
              {[['alle', 'Alle'], ['neu', 'Neue'], ['falsch', 'Falsche'], ['gemerkt', 'Gemerkte']].map(([v, l]) => (
                <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
            <div className="seg">
              {[10, 20, 40, 0].map((n) => <button key={n} className={anzahl === n ? 'active' : ''} onClick={() => setAnzahl(n)}>{n || 'Alle'}</button>)}
            </div>
          </div>
          <button className="btn primary big mt" disabled={!filtered.length}
            onClick={() => startSession({ titel: 'Lernmodus', ids: filtered.map((q) => q.id), modus: 'lernen', zufall: true, anzahl: anzahl || undefined })}>
            <Icon name="quiz" size={18} /> {Math.min(anzahl || filtered.length, filtered.length)} Fragen starten
          </button>
        </section>
      )}

      {tab === 'pruefung' && (
        <section className="card">
          <p className="muted">Wie in der echten Theorieprüfung: zufällige Fragen, Zeitlimit, Auswertung erst am Ende. Bestanden ab {C.meta.bestehensgrenze} %.</p>
          <div className="exam-grid">
            {[...haupt, ...zusatz].map((f) => {
              const last = [...s.pruefungen].reverse().find((p) => p.fachId === f.id);
              const n = Math.min(f.pruefung.fragen, C.fragen.filter((q) => q.fachId === f.id).length);
              return (
                <button key={f.id} className="exam-card" style={{ '--c': f.farbe }} onClick={() => startExam([f.id])} disabled={!n}>
                  <span className="exam-icon">{f.icon}</span>
                  <strong>{f.name}</strong>
                  <small>{n} Fragen · {f.pruefung.minuten} min</small>
                  {last && <span className={`pill ${last.bestanden ? 'ok' : 'bad'}`}>zuletzt {last.prozent} %</span>}
                </button>
              );
            })}
          </div>
          <h3>Gesamtsimulation</h3>
          <div className="row gap wrap">
            <button className="btn primary" onClick={() => startExam(haupt.map((f) => f.id), { titel: 'Gesamtsimulation (alle Fächer)' })}>
              Alle {haupt.length} Fächer ({haupt.reduce((n, f) => n + f.pruefung.fragen, 0)} Fragen, {haupt.reduce((n, f) => n + f.pruefung.minuten, 0)} min)
            </button>
            <button className="btn ghost" onClick={() => {
              const ids = shuffle(C.fragen.filter((q) => !fachById[q.fachId]?.zusatz).map((q) => q.id)).slice(0, 30);
              startSession({ modus: 'pruefung', ids, minuten: 60, fachId: 'mix', titel: 'Schnelltest gemischt' });
            }}>Schnelltest gemischt (30 Fragen, 60 min)</button>
          </div>
        </section>
      )}

      {tab === 'fehler' && (
        <section className="card">
          <p className="muted">Fragen, die du zuletzt falsch beantwortet hast, bleiben hier, bis du sie richtig beantwortest.</p>
          <div className="fehler-list">
            {C.faecher.map((f) => {
              const n = fehler.filter((q) => q.fachId === f.id).length;
              return n ? <div key={f.id} className="row-between"><span>{f.icon} {f.name}</span><span className="pill bad">{n}</span></div> : null;
            })}
          </div>
          <div className="row gap wrap mt">
            <button className="btn primary" disabled={!fehler.length} onClick={() => startSession({ titel: 'Fehlerwiederholung', ids: fehler.map((q) => q.id), modus: 'fehler', zufall: true })}>
              <Icon name="repeat" size={16} /> {fehler.length} Fehler wiederholen
            </button>
            <button className="btn ghost" disabled={!gemerkt.length} onClick={() => startSession({ titel: 'Gemerkte Fragen', ids: gemerkt.map((q) => q.id), modus: 'lernen' })}>
              <Icon name="bookmark" size={16} /> {gemerkt.length} gemerkte Fragen
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function useShuffled(q) {
  return useMemo(() => (q ? shuffle(q.antworten.map((a, i) => ({ text: a, i }))) : []), [q?.id]);
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function Question({ q, order, chosen, reveal, onChoose, s, nr, total }) {
  const f = fachById[q.fachId];
  return (
    <div className="question">
      <div className="q-meta">
        <span className="chip small" style={{ '--c': f?.farbe }}>{f?.icon} {f?.name}</span>
        <span className="muted small">{q.id}{nr ? ` · Frage ${nr}/${total}` : ''}</span>
        <button className={`icon-btn sm ${s.gemerkt[q.id] ? 'on' : ''}`} onClick={() => toggleGemerkt(q.id)} title="Frage merken" aria-label="Frage merken">
          <Icon name="bookmark" size={16} />
        </button>
      </div>
      <h2 className="q-text">{q.frage}</h2>
      <div className="answers">
        {order.map((a, k) => {
          let cls = '';
          if (reveal) {
            if (a.i === q.richtig) cls = 'right';
            else if (a.i === chosen) cls = 'wrong';
          } else if (a.i === chosen) cls = 'chosen';
          return (
            <button key={a.i} className={`answer ${cls}`} onClick={() => onChoose(a.i)} disabled={reveal}>
              <span className="letter">{LETTERS[k]}</span>
              <span>{a.text}</span>
            </button>
          );
        })}
      </div>
      {reveal && q.erklaerung && (
        <div className={`explain ${chosen === q.richtig ? 'ok' : 'bad'}`}>
          <strong>{chosen === q.richtig ? '✔ Richtig!' : '✘ Leider falsch.'}</strong> {q.erklaerung}
        </div>
      )}
    </div>
  );
}

function Quiz({ cfg }) {
  const s = useAppState();
  const [queue, setQueue] = useState(cfg.ids);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [res, setRes] = useState([]);
  const q = frageById[queue[i]];
  const order = useShuffled(q);
  const reveal = chosen != null;
  const finished = i >= queue.length;

  const choose = (ai) => {
    if (reveal) return;
    setChosen(ai);
    const ok = ai === q.richtig;
    recordAnswer(q.id, ok);
    setRes((r) => [...r, { id: q.id, ok }]);
    if (!ok && cfg.modus !== 'lernen' && queue.slice(i + 1).filter((x) => x === q.id).length === 0 && res.filter((r) => r.id === q.id).length < 2) {
      setQueue((qq) => [...qq, q.id]);
    }
  };
  const next = () => { setChosen(null); setI(i + 1); };

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (!reveal && /^[1-6a-f]$/i.test(e.key)) {
        const k = /\d/.test(e.key) ? Number(e.key) - 1 : e.key.toLowerCase().charCodeAt(0) - 97;
        if (order[k]) choose(order[k].i);
      } else if (reveal && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  if (!queue.length) return <div className="card"><p>Keine Fragen ausgewählt.</p><a className="btn" href="#/fragen">Zurück</a></div>;
  const richtig = res.filter((r) => r.ok).length;
  if (finished) {
    const quote = res.length ? richtig / res.length : 0;
    const falsche = [...new Set(res.filter((r) => !r.ok).map((r) => r.id))];
    return (
      <div className="card result">
        <div className="result-emoji">{quote >= 0.9 ? '🏆' : quote >= 0.75 ? '🎉' : quote >= 0.5 ? '💪' : '📚'}</div>
        <h1>{cfg.titel} abgeschlossen</h1>
        <p className="big-num">{richtig} / {res.length} richtig · {pct(quote)}</p>
        <p className="muted">{quote >= 0.9 ? 'Hervorragend – Prüfungsniveau!' : quote >= 0.75 ? 'Bestanden-Niveau erreicht. Weiter so!' : 'Dranbleiben – die falschen Fragen landen in der Fehlerwiederholung und im Karteikasten.'}</p>
        <div className="row gap wrap center">
          {falsche.length > 0 && <button className="btn primary" onClick={() => startSession({ titel: 'Fehler dieser Runde', ids: falsche, modus: 'fehler' })}>{falsche.length} Fehler wiederholen</button>}
          <button className="btn ghost" onClick={() => startSession({ ...cfg, ids: cfg.ids, zufall: true })}>Nochmal</button>
          <a className="btn ghost" href="#/fragen">Zur Auswahl</a>
        </div>
      </div>
    );
  }
  return (
    <div className="quiz">
      <div className="quiz-top">
        <a href="#/fragen" className="icon-btn" aria-label="Beenden"><Icon name="x" /></a>
        <div className="grow">
          <div className="row-between small"><strong>{cfg.titel}</strong><span>{i + 1} / {queue.length} · ✔ {richtig}</span></div>
          <Bar value={i / queue.length} />
        </div>
      </div>
      <div className="card">
        <Question q={q} order={order} chosen={chosen} reveal={reveal} onChoose={choose} s={s} />
        <div className="quiz-actions">
          <span className="muted small hide-mobile">Tasten 1–4 zum Antworten, Enter für weiter</span>
          {reveal && <button className="btn primary" onClick={next} autoFocus>{i + 1 < queue.length ? 'Weiter' : 'Auswertung'} <Icon name="chevR" size={16} /></button>}
        </div>
      </div>
    </div>
  );
}

function Exam({ cfg }) {
  const s = useAppState();
  const [i, setI] = useState(0);
  const [ans, setAns] = useState({});
  const [flags, setFlags] = useState({});
  const [done, setDone] = useState(null);
  const startRef = useRef(Date.now());
  const total = cfg.minuten * 60;
  const [left, setLeft] = useState(total);
  const orders = useMemo(() => Object.fromEntries(cfg.ids.map((id) => [id, shuffle(frageById[id].antworten.map((a, k) => ({ text: a, i: k })))])), [cfg]);

  const finish = () => {
    const antworten = cfg.ids.map((id) => ({ id, gewaehlt: ans[id] ?? null, ok: ans[id] === frageById[id].richtig }));
    const richtig = antworten.filter((a) => a.ok).length;
    const prozent = Math.round((richtig / cfg.ids.length) * 100);
    const perFach = {};
    for (const a of antworten) {
      const f = frageById[a.id].fachId;
      perFach[f] = perFach[f] || { n: 0, ok: 0 };
      perFach[f].n++;
      if (a.ok) perFach[f].ok++;
    }
    const bestanden = Object.values(perFach).every((p) => p.ok / p.n >= C.meta.bestehensgrenze / 100);
    const r = { fachId: cfg.fachId, titel: cfg.titel, anzahl: cfg.ids.length, richtig, prozent, bestanden, antworten, perFach, dauerSek: Math.round((Date.now() - startRef.current) / 1000) };
    recordExam(r);
    setDone(r);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      const l = total - Math.floor((Date.now() - startRef.current) / 1000);
      setLeft(l);
      if (l <= 0) { clearInterval(t); finish(); }
    }, 1000);
    return () => clearInterval(t);
  });

  if (done) {
    return (
      <>
        <div className={`card result ${done.bestanden ? 'pass' : 'fail'}`}>
          <div className="result-emoji">{done.bestanden ? '🎓' : '🛬'}</div>
          <h1>{done.bestanden ? 'Bestanden!' : 'Nicht bestanden'}</h1>
          <p className="big-num">{done.richtig} / {done.anzahl} · {done.prozent} %</p>
          <p className="muted">{cfg.titel} · Zeit: {Math.floor(done.dauerSek / 60)}:{String(done.dauerSek % 60).padStart(2, '0')} min · Grenze {C.meta.bestehensgrenze} % je Fach</p>
          {Object.keys(done.perFach).length > 1 && (
            <div className="perfach">
              {Object.entries(done.perFach).map(([f, p]) => (
                <div key={f} className="row-between">
                  <span>{fachById[f].icon} {fachById[f].name}</span>
                  <span className={`pill ${p.ok / p.n >= C.meta.bestehensgrenze / 100 ? 'ok' : 'bad'}`}>{p.ok}/{p.n} · {Math.round((p.ok / p.n) * 100)} %</span>
                </div>
              ))}
            </div>
          )}
          <div className="row gap wrap center">
            <a className="btn primary" href="#/fragen">Zur Auswahl</a>
            {done.antworten.some((a) => !a.ok) && <button className="btn ghost" onClick={() => startSession({ titel: 'Fehler der Prüfung', ids: done.antworten.filter((a) => !a.ok).map((a) => a.id), modus: 'fehler' })}>Fehler üben</button>}
          </div>
        </div>
        <h2 className="section-title">Auswertung</h2>
        {done.antworten.map((a, k) => (
          <div key={a.id} className="card">
            <Question q={frageById[a.id]} order={orders[a.id]} chosen={a.gewaehlt} reveal s={s} nr={k + 1} total={done.anzahl} onChoose={() => {}} />
            {a.gewaehlt == null && <p className="muted small">Nicht beantwortet.</p>}
          </div>
        ))}
      </>
    );
  }

  const q = frageById[cfg.ids[i]];
  const answered = Object.keys(ans).length;
  const mm = Math.max(0, Math.floor(left / 60));
  const ss = String(Math.max(0, left % 60)).padStart(2, '0');
  return (
    <div className="quiz exam">
      <div className="quiz-top sticky">
        <button className="icon-btn" onClick={() => confirm('Prüfung abbrechen? Der Versuch wird nicht gewertet.') && navigate('/fragen')} aria-label="Abbrechen"><Icon name="x" /></button>
        <div className="grow">
          <div className="row-between small"><strong>{cfg.titel}</strong><span>{answered}/{cfg.ids.length} beantwortet</span></div>
          <Bar value={left / total} color={left < 300 ? 'var(--bad)' : 'var(--accent)'} />
        </div>
        <span className={`timer ${left < 300 ? 'low' : ''}`}><Icon name="clock" size={16} /> {mm}:{ss}</span>
      </div>
      <div className="exam-layout">
        <div className="card">
          <Question q={q} order={orders[q.id]} chosen={ans[q.id]} reveal={false} onChoose={(ai) => setAns({ ...ans, [q.id]: ai })} s={s} nr={i + 1} total={cfg.ids.length} />
          <div className="quiz-actions">
            <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}><Icon name="chevL" size={16} /></button>
            <button className={`btn ghost ${flags[q.id] ? 'flagged' : ''}`} onClick={() => setFlags({ ...flags, [q.id]: !flags[q.id] })}><Icon name="flag" size={16} /> Markieren</button>
            {i < cfg.ids.length - 1 ? (
              <button className="btn primary" onClick={() => setI(i + 1)}>Weiter <Icon name="chevR" size={16} /></button>
            ) : (
              <button className="btn primary" onClick={() => (answered < cfg.ids.length ? confirm(`${cfg.ids.length - answered} Fragen unbeantwortet. Trotzdem abgeben?`) : true) && finish()}>Abgeben</button>
            )}
          </div>
        </div>
        <aside className="card exam-nav">
          <h4 className="mt0">Fragen</h4>
          <div className="qgrid">
            {cfg.ids.map((id, k) => (
              <button key={id} onClick={() => setI(k)} className={`${k === i ? 'cur' : ''} ${ans[id] != null ? 'ans' : ''} ${flags[id] ? 'flag' : ''}`}>{k + 1}</button>
            ))}
          </div>
          <button className="btn primary full mt" onClick={() => confirm(answered < cfg.ids.length ? `${cfg.ids.length - answered} Fragen unbeantwortet. Abgeben?` : 'Prüfung abgeben?') && finish()}>Abgeben</button>
        </aside>
      </div>
    </div>
  );
}
