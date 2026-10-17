import React, { useRef, useState } from 'react';
import { PageHead, Ring, Icon, Html, navigate, Bar, Collapse } from '../ui.jsx';
import { ListenButton, useTtsHighlight, useFunkDialoge } from '../Player.jsx';
import { useAppState, C, skriptById, fachById, skriptProgress, kapitelKey, toggleGelesen, allSkriptProgress } from '../store.js';
import { startSession } from './Fragen.jsx';

export default function Skripte({ route }) {
  const [id, kap, abs] = route.parts.slice(1);
  if (id && skriptById[id]) return <Reader skript={skriptById[id]} kapId={kap} abschnitt={abs} base="skripte" />;
  return <Uebersicht />;
}

function Uebersicht() {
  const s = useAppState();
  const all = allSkriptProgress(s);
  const liste = C.skripte.filter((sk) => sk.bereich !== 'zusatz');
  return (
    <>
      <PageHead icon="📚" title="Skripte" sub={`${liste.length} Fachskripte · ${all.done}/${all.total} Kapitel gelesen`}>
        <a className="btn primary sm" href="#/bibliothek"><Icon name="headphones" size={16} /> Als Hörbuch anhören</a>
      </PageHead>
      <div className="skript-grid">
        {liste.map((sk) => {
          const f = fachById[sk.fachId];
          const p = skriptProgress(s, sk);
          const next = sk.kapitel.find((k) => k.zaehlt && !s.gelesen[kapitelKey(sk.id, k.id)]);
          const reihen = C.empfohleneReihenfolge.indexOf(sk.fachId);
          return (
            <a key={sk.id} href={`#/skripte/${sk.id}${next ? '/' + next.id : ''}`} className="skript-card" style={{ '--c': f?.farbe || 'var(--accent)' }}>
              <div className="skript-top">
                <span className="skript-icon">{f?.icon || '📘'}</span>
                <Ring value={p.pct} size={54} stroke={6} color={f?.farbe} />
              </div>
              <h3>{sk.titel}</h3>
              <p className="muted small">{p.done}/{p.total} Kapitel · {f ? `${f.pruefung.fragen} Fragen / ${f.pruefung.minuten} min` : ''}</p>
              {reihen >= 0 && <span className="pill">Empfohlen als {reihen + 1}.</span>}
              <span className="skript-cta">{p.pct === 1 ? 'Wiederholen' : p.done ? 'Weiterlesen' : 'Starten'} <Icon name="chevR" size={14} /></span>
            </a>
          );
        })}
      </div>
      {C.skriptIndex && (
        <Collapse title={<h3>Übersicht zur Prüfung und Lernreihenfolge</h3>}>
          <Html html={C.skriptIndex} />
        </Collapse>
      )}
    </>
  );
}

export function Reader({ skript, kapId, abschnitt, base }) {
  const s = useAppState();
  const [toc, setToc] = useState(false);
  const f = fachById[skript.fachId];
  const idx = Math.max(0, skript.kapitel.findIndex((k) => k.id === kapId));
  const k = kapId ? skript.kapitel[idx] : null;
  const p = skriptProgress(s, skript);
  const go = (i) => navigate(`/${base}/${skript.id}/${skript.kapitel[i].id}`);
  const key = k ? kapitelKey(skript.id, k.id) : null;
  const read = key && s.gelesen[key];
  const textRef = useRef(null);
  useTtsHighlight(textRef, 'skript', skript.id, k ? idx : -1);
  useFunkDialoge(textRef, `skript:${skript.id}`, k?.id);

  const markAndNext = () => {
    if (!read) toggleGelesen(key);
    if (idx < skript.kapitel.length - 1) go(idx + 1);
  };

  return (
    <div className="reader" style={{ '--c': f?.farbe || 'var(--accent)' }}>
      <aside className={`reader-toc ${toc ? 'open' : ''}`}>
        <a href={`#/${base}`} className="link small"><Icon name="chevL" size={14} /> {base === 'zusatz' ? 'Alle Zusatzmodule' : 'Alle Skripte'}</a>
        <h3>{f?.icon} {skript.titel}</h3>
        <Bar value={p.pct} color={f?.farbe} />
        <p className="muted small">{p.done}/{p.total} Kapitel gelesen</p>
        <ol>
          {skript.kapitel.map((kk, i) => {
            const done = s.gelesen[kapitelKey(skript.id, kk.id)];
            const teilNeu = kk.teil && kk.teil !== skript.kapitel[i - 1]?.teil;
            return (
              <React.Fragment key={kk.id}>
              {teilNeu && <li className="toc-teil">{kk.teil}</li>}
              <li className={`${k && i === idx ? 'cur' : ''} ${done ? 'done' : ''}`}>
                <a href={`#/${base}/${skript.id}/${kk.id}`} onClick={() => setToc(false)}>
                  <span className="toc-check">{done ? <Icon name="check" size={12} /> : null}</span>
                  {kk.titel}
                </a>
                {k && i === idx && kk.abschnitte.length > 0 && (
                  <ul>{kk.abschnitte.map((a) => <li key={a.id}><a href={`#/${base}/${skript.id}/${kk.id}/${a.id}`} onClick={() => setToc(false)}>{a.titel}</a></li>)}</ul>
                )}
              </li>
              </React.Fragment>
            );
          })}
        </ol>
      </aside>
      <article className="reader-main">
        <div className="reader-bar">
          <button className="btn ghost sm only-mobile" onClick={() => setToc(!toc)}><Icon name="menu" size={16} /> Kapitel</button>
          <span className="muted small grow">{k ? `Kapitel ${idx + 1} von ${skript.kapitel.length}` : 'Einleitung'}</span>
          {k && <ListenButton type="skript" id={skript.id} part={idx} />}
          {f && <button className="btn ghost sm" onClick={() => startSession({ titel: f.name, ids: C.fragen.filter((q) => q.fachId === f.id).map((q) => q.id), modus: 'lernen', anzahl: 15, zufall: true })}><Icon name="quiz" size={16} /> Fragen üben</button>}
        </div>
        {!k ? (
          <div className="card">
            <h1>{skript.titel}</h1>
            <Html html={skript.intro} />
            <button className="btn primary" onClick={() => go(0)}>Mit Kapitel 1 beginnen <Icon name="chevR" size={16} /></button>
          </div>
        ) : (
          <div className="card reading" ref={textRef}>
            <Html html={k.html} scrollTo={abschnitt} key={key} />
            <p className="muted small">ca. {Math.max(1, Math.round(k.woerter / 180))} min Lesezeit · ca. {Math.max(1, Math.round(k.woerter / 140))} min zum Anhören</p>
          </div>
        )}
        {k && (
          <div className="reader-nav">
            <button className="btn ghost" disabled={idx === 0} onClick={() => go(idx - 1)}><Icon name="chevL" size={16} /> Zurück</button>
            <button className={`btn ${read ? 'ok' : 'ghost'}`} onClick={() => toggleGelesen(key)}>
              <Icon name="check" size={16} /> {read ? 'Gelesen' : 'Als gelesen markieren'}
            </button>
            {idx < skript.kapitel.length - 1 ? (
              <button className="btn primary" onClick={markAndNext}>{read ? 'Weiter' : 'Gelesen & weiter'} <Icon name="chevR" size={16} /></button>
            ) : (
              <button className="btn primary" onClick={() => { if (!read) toggleGelesen(key); navigate(`/${base}`); }}>Skript abschließen 🎉</button>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
