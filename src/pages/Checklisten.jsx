import React from 'react';
import { PageHead, Icon, Html, Check, Bar } from '../ui.jsx';
import { useAppState, C, toggleCheck, update } from '../store.js';

const itemsOf = (cl) => cl.abschnitte.flatMap((a) => a.bloecke.filter((b) => b.typ === 'item'));

export default function Checklisten({ route }) {
  const s = useAppState();
  const list = C.checklisten || [];
  const cl = list.find((x) => x.id === route.parts[1]);
  if (cl) return <Checkliste cl={cl} s={s} druck={route.query.druck === '1'} />;
  return (
    <>
      <PageHead icon="✅" title="Checklisten" sub="Abhakbare Checklisten für Flugvorbereitung, Cockpit und Notfälle – zum Üben am Schreibtisch oder ausgedruckt fürs Kniebrett." />
      {!list.length && (
        <div className="card empty-state">
          <div className="result-emoji">🛠️</div>
          <h2>Checklisten folgen in Kürze</h2>
          <p className="muted">Sobald unter <code>docs/checklisten/</code> Inhalte liegen, erscheinen sie nach dem nächsten Update automatisch hier.</p>
        </div>
      )}
      {C.checklistenIntro && <section className="card"><Html html={C.checklistenIntro} /></section>}
      <div className="lib-list">
        {list.map((x) => {
          const it = itemsOf(x);
          const done = it.filter((i) => s.checks[i.id]).length;
          return (
            <a key={x.id} href={`#/checklisten/${x.id}`} className={`lib-row lib-main ${x.notfall ? 'notfall' : ''}`} style={{ '--c': x.notfall ? 'var(--bad)' : 'var(--ok)' }}>
              <span className="lib-icon">{x.notfall ? '🚨' : '📋'}</span>
              <span className="grow">
                <strong>{x.titel}</strong>
                <small className="muted">{x.anzahl} Punkte · {done} abgehakt</small>
                <Bar value={x.anzahl ? done / x.anzahl : 0} height={4} color={done === x.anzahl ? 'var(--ok)' : undefined} />
              </span>
              <Icon name="chevR" />
            </a>
          );
        })}
      </div>
    </>
  );
}

function Checkliste({ cl, s, druck }) {
  const it = itemsOf(cl);
  const done = it.filter((i) => s.checks[i.id]).length;
  const reset = () => confirm(`Alle ${done} Haken in „${cl.titel}“ entfernen?`) && update((x) => { for (const i of it) delete x.checks[i.id]; });
  return (
    <div className={`checkliste ${druck ? 'druck' : ''} ${cl.notfall ? 'notfall' : ''}`}>
      <div className="row-between wrap no-print">
        <a href="#/checklisten" className="link small"><Icon name="chevL" size={14} /> Alle Checklisten</a>
        <div className="row gap wrap">
          <button className="btn ghost sm" disabled={!done} onClick={reset}><Icon name="repeat" size={16} /> Alle zurücksetzen</button>
          <button className="btn ghost sm" onClick={() => window.print()}><Icon name="doc" size={16} /> Drucken</button>
        </div>
      </div>
      <div className="card">
        <div className="row-between wrap">
          <h1 className="mt0">{cl.notfall ? '🚨 ' : ''}{cl.titel}</h1>
          <span className="pill no-print">{done}/{it.length}</span>
        </div>
        <Bar value={it.length ? done / it.length : 0} height={6} color={done === it.length ? 'var(--ok)' : undefined} />
        {done === it.length && it.length > 0 && <div className="alert ok mt no-print">Alle Punkte erledigt ✓</div>}
        {cl.abschnitte.map((a, ai) => (
          <section key={ai} className="cl-abschnitt">
            {a.titel && (a.ebene > 2 ? <h4>{a.titel}</h4> : <h3>{a.titel}</h3>)}
            {a.bloecke.map((b, bi) => (b.typ === 'text' ? (
              <Html key={bi} html={b.html} className="cl-text" />
            ) : (
              <Check key={b.id} sub={b.sub} checked={s.checks[b.id]} onChange={() => toggleCheck(b.id)}>
                <span className="cl-item"><span dangerouslySetInnerHTML={{ __html: b.html }} />{b.aktion && <span className="cl-aktion" dangerouslySetInnerHTML={{ __html: b.aktion }} />}</span>
              </Check>
            )))}
          </section>
        ))}
        <p className="muted small print-only">Flugschein-Lernplattform · {cl.titel} · Stand {new Date(C.meta.erstellt).toLocaleDateString('de-AT')} – maßgeblich ist das Flughandbuch (AFM/POH) des Luftfahrzeugs.</p>
      </div>
    </div>
  );
}
