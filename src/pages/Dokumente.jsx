import React, { useRef } from 'react';
import { PageHead, Html, Icon } from '../ui.jsx';
import { C } from '../store.js';
import { ListenButton, useTtsHighlight } from '../Player.jsx';

const DESC = {
  'ppl-ueberblick': 'Voraussetzungen, Ablauf, Mindeststunden, Prüfungen, Kosten',
  ausbildungsplan: 'Phasen der praktischen Ausbildung mit Meilensteinen',
  lernplan: 'Wochenplan für die Theorie',
  'fragen-ueberblick': 'Prüfungsumfang bei der Austro Control und Aufbau der Übungsfragen',
  'skripte-ueberblick': 'Prüfungsfächer, Lernreihenfolge und Lerntipps',
  'zusatzausbildungen-ueberblick': 'Nachtflug, MEP und Flugfunk international im Überblick',
};

export default function Dokumente({ route }) {
  const [id, anchor] = route.parts.slice(1);
  const d = C.dokumente.find((x) => x.id === id);
  if (d) return <Dokument d={d} anchor={anchor} />;
  return (
    <>
      <PageHead icon="📄" title="Dokumente" sub="Hintergrundwissen zur Ausbildung – alle Unterlagen inkl. Skripte findest du unter Lernunterlagen">
        <a className="btn ghost sm" href="#/bibliothek"><Icon name="library" size={16} /> Lernunterlagen</a>
      </PageHead>
      <div className="doc-grid">
        {C.dokumente.map((x) => (
          <a key={x.id} href={`#/dokumente/${x.id}`} className="card doc-card">
            <Icon name="doc" size={28} />
            <h3>{x.titel}</h3>
            <p className="muted small">{DESC[x.id] || `${x.toc.length} Abschnitte`}</p>
          </a>
        ))}
      </div>
    </>
  );
}

function Dokument({ d, anchor }) {
  const ref = useRef(null);
  useTtsHighlight(ref, 'doc', d.id, 0);
  return (
    <div className="doc-layout">
      <aside className="doc-toc card">
        <a href="#/dokumente" className="link small"><Icon name="chevL" size={14} /> Alle Dokumente</a>
        <h4>{d.titel}</h4>
        <ListenButton type="doc" id={d.id} part={0} />
        <ol>{d.toc.map((t) => <li key={t.id}><a href={`#/dokumente/${d.id}/${t.id}`}>{t.titel}</a></li>)}</ol>
      </aside>
      <article className="card reading">
        <h1 className="mt0">{d.titel}</h1>
        <div ref={ref}><Html html={d.html} scrollTo={anchor} key={d.id} /></div>
      </article>
    </div>
  );
}
