import React, { useEffect, useMemo, useState } from 'react';
import { PageHead, Icon, Bar, shuffle } from '../ui.jsx';
import { useAppState, C, update, kartenDecks, kartenStatus, recordKarte, LEITNER } from '../store.js';
import { ttsSupported, sprich, stille } from '../tts.js';

const BOX = ['Neu', 'Fach 1', 'Fach 2', 'Fach 3', 'Fach 4', 'Fach 5'];
const TYP = { tabelle: 'Tabelle', merksatz: 'Merksatz', definition: 'Definition', glossar: 'Glossar' };
const strip = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h;
  d.querySelectorAll('br').forEach((b) => b.replaceWith('. '));
  d.querySelectorAll('p,li,div,tr,dt,dd,h1,h2,h3,h4').forEach((b) => b.append('. '));
  return d.textContent.replace(/\s+/g, ' ').replace(/(:\s*)?\.\s*(\.\s*)+/g, '. ').replace(/:\s*\./g, ':').trim();
};

// Anki: Tab-getrennt mit Kopfzeilen (#separator/#html/#deck column/#tags column), direkt importierbar.
function ankiExport(deckIds, decks) {
  const cell = (s) => String(s).replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');
  const name = (id) => decks.find((d) => d.id === id)?.name || id;
  const rows = C.karten.filter((k) => deckIds.includes(k.deck)).map((k) => [
    cell(`${k.front}${k.sub ? `<br><small>${k.sub}</small>` : ''}`), cell(k.back), cell(`Flugschein::${name(k.deck)}`),
    cell(['flugschein', k.typ, (k.deck || '').replace(/\s+/g, '_')].join(' ')),
  ].join('\t'));
  const text = ['#separator:tab', '#html:true', '#deck column:3', '#tags column:4', ...rows].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/tab-separated-values;charset=utf-8' }));
  a.download = `flugschein-lernkarten-${deckIds.length === 1 ? deckIds[0] : 'alle'}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Lernkarten() {
  const s = useAppState();
  const decks = useMemo(kartenDecks, []);
  const [sel, setSel] = useState(() => decks.filter((d) => !d.zusatz && d.id !== 'glossar').map((d) => d.id));
  const [session, setSession] = useState(null);
  const limit = s.settings.neueLernkartenProTag ?? 20;
  const st = kartenStatus(s, sel, limit);
  if (session) return <Session session={session} onEnd={() => setSession(null)} />;
  const start = (ids, titel) => setSession({ ids, titel });
  const toggle = (id) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  return (
    <>
      <PageHead icon="🃏" title="Lernkarten" sub={`${C.karten.length} Karteikarten aus Skripten (Tabellen, Merksätze, Definitionen) und Glossar – Vorderseite Begriff/Frage, Rückseite Antwort. Wiederholung nach dem Leitner-System.`}>
        <button className="btn ghost sm" onClick={() => ankiExport(sel, decks)} disabled={!sel.length}><Icon name="download" size={16} /> Anki-Export</button>
      </PageHead>
      <section className="card leitner-hero">
        <h2 className="mt0">{st.due.length} Karten fällig · {st.neuHeute.length} neue heute</h2>
        <p className="muted">{st.pool.length} Karten in der Auswahl · {st.sicher} sicher (ab Fach 3) · {st.neu.length} noch nie gesehen</p>
        <div className="row gap wrap">
          <button className="btn primary big" disabled={!st.due.length && !st.neuHeute.length} onClick={() => start([...st.due, ...shuffle(st.neuHeute)].map((k) => k.id), 'Lernkarten')}>
            <Icon name="cards" size={18} /> Jetzt lernen
          </button>
          <button className="btn ghost" disabled={!st.neu.length} onClick={() => start(shuffle(st.neu).slice(0, 20).map((k) => k.id), '20 neue Karten')}>20 neue Karten</button>
          <button className="btn ghost" disabled={!st.pool.length} onClick={() => start(shuffle(st.pool).slice(0, 30).map((k) => k.id), 'Zufallsmix')}>Zufallsmix (30)</button>
        </div>
        <label className="inline-field mt">Neue Lernkarten pro Tag
          <input type="number" min="0" max="200" value={limit} onChange={(e) => update((x) => { x.settings.neueLernkartenProTag = Number(e.target.value) || 0; })} />
        </label>
      </section>
      <h2 className="section-title">Stapel <small className="muted">antippen zum Auswählen</small></h2>
      <div className="deck-grid">
        {decks.map((d) => {
          const ds = kartenStatus(s, [d.id], limit);
          const on = sel.includes(d.id);
          return (
            <div key={d.id} className={`deck ${on ? 'on' : ''}`} style={{ '--c': d.farbe }}>
              <button className="deck-main" onClick={() => toggle(d.id)} aria-pressed={on}>
                <span className="lib-icon">{d.icon}</span>
                <span className="grow"><strong>{d.name}</strong><small className="muted">{ds.pool.length} Karten · {ds.due.length} fällig · {ds.neu.length} neu</small></span>
                <span className="deck-check">{on && <Icon name="check" size={14} />}</span>
              </button>
              <Bar value={ds.pool.length ? ds.sicher / ds.pool.length : 0} color={d.farbe} height={5} />
              <div className="row gap wrap">
                <button className="btn ghost sm" disabled={!ds.due.length && !ds.neuHeute.length} onClick={() => start([...ds.due, ...shuffle(ds.neuHeute)].map((k) => k.id), d.name)}>Lernen</button>
                <button className="btn ghost sm" onClick={() => start(ds.pool.map((k) => k.id), `${d.name} – alle`)}>Alle</button>
                <button className="btn ghost sm" onClick={() => ankiExport([d.id], decks)} title="Für Anki exportieren"><Icon name="download" size={14} /> Anki</button>
              </div>
            </div>
          );
        })}
      </div>
      <section className="card small muted">
        <strong>Anki-Import:</strong> Datei in Anki über „Datei → Importieren“ öffnen – Trennzeichen, HTML, Stapel (Flugschein::Fach) und Schlagwörter werden automatisch erkannt.
        Karten entstehen beim Neubau der Plattform automatisch aus den Skripten; wird ein Tabelleneintrag umformuliert, entsteht eine neue Karte.
      </section>
    </>
  );
}

function Session({ session, onEnd }) {
  const s = useAppState();
  const [queue, setQueue] = useState(session.ids);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [stats, setStats] = useState({ ok: 0, nok: 0 });
  const [vorlesen, setVorlesen] = useState(() => localStorage.getItem('flugschein-karten-vorlesen') === '1');
  const k = C.karten.find((x) => x.id === queue[i]);
  const rec = k ? s.karten[k.id] : null;
  useEffect(() => { localStorage.setItem('flugschein-karten-vorlesen', vorlesen ? '1' : '0'); }, [vorlesen]);
  useEffect(() => {
    if (!vorlesen || !k) return;
    sprich(flip ? strip(k.back) : `${k.front}${k.sub && k.typ !== 'glossar' ? '. ' + k.sub.split(' · ')[0] : ''}`);
  }, [k?.id, flip, vorlesen]);
  useEffect(() => () => stille(), []);
  const answer = (ok) => {
    recordKarte(k.id, ok);
    setStats((x) => ({ ok: x.ok + (ok ? 1 : 0), nok: x.nok + (ok ? 0 : 1) }));
    if (!ok) setQueue((q) => [...q, k.id]);
    setFlip(false);
    setI((x) => x + 1);
  };
  useEffect(() => {
    const h = (e) => {
      if (e.target.closest('input,textarea,select')) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlip((f) => !f); }
      if (flip && (e.key === '1' || e.key === 'ArrowLeft')) answer(false);
      if (flip && (e.key === '2' || e.key === 'ArrowRight')) answer(true);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });
  if (!k) {
    return (
      <div className="card result center-text">
        <div className="result-emoji">🎉</div>
        <h2>Runde geschafft</h2>
        <p className="muted">{stats.ok} gewusst · {stats.nok} wiederholt</p>
        <button className="btn primary" onClick={onEnd}>Zurück zu den Stapeln</button>
      </div>
    );
  }
  return (
    <div className="karten-session">
      <div className="row-between wrap">
        <button className="btn ghost sm" onClick={onEnd}><Icon name="chevL" size={16} /> {session.titel}</button>
        <span className="muted small">Karte {Math.min(i + 1, queue.length)} / {queue.length} · {BOX[rec?.box || 0]}</span>
        {ttsSupported && (
          <button className={`btn sm ${vorlesen ? 'ok' : 'ghost'}`} onClick={() => setVorlesen(!vorlesen)} title="Karten vorlesen">
            <Icon name="headphones" size={16} /> Vorlesen {vorlesen ? 'an' : 'aus'}
          </button>
        )}
      </div>
      <Bar value={i / queue.length} height={5} />
      <div role="button" tabIndex={0} className={`flashcard ${flip ? 'flipped' : ''}`} onClick={(e) => !e.target.closest('a') && setFlip(!flip)} aria-label="Karte umdrehen">
        <div className="fc-face fc-front">
          <span className="pill">{TYP[k.typ] || 'Karte'}</span>
          <h2>{k.front}</h2>
          {k.sub && <p className="muted">{k.sub}</p>}
          <span className="muted small fc-hint">Tippen oder Leertaste zum Umdrehen</span>
        </div>
        <div className="fc-face fc-back">
          <p className="muted small">{k.front}</p>
          <div className="md" dangerouslySetInnerHTML={{ __html: k.back }} />
        </div>
      </div>
      {flip ? (
        <div className="row gap center karten-buttons">
          <button className="btn danger big" onClick={() => answer(false)}><Icon name="x" size={18} /> Nicht gewusst</button>
          <button className="btn ok big" onClick={() => answer(true)}><Icon name="check" size={18} /> Gewusst{rec ? ` · in ${LEITNER[Math.min(5, (rec.box || 0) + 1)]} T.` : ''}</button>
        </div>
      ) : (
        <div className="row gap center karten-buttons">
          <button className="btn primary big" onClick={() => setFlip(true)}>Antwort zeigen</button>
        </div>
      )}
      {k.quelle && <p className="center-text small"><a href={k.quelle} onClick={() => stille()}>Im Skript nachlesen: {k.kapitel || 'Quelle'}</a></p>}
    </div>
  );
}
