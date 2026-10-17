import React, { useState } from 'react';
import { PageHead, FachChip } from '../ui.jsx';
import { C, fachById } from '../store.js';

const first = (b) => {
  const c = b[0].toUpperCase().normalize('NFD')[0];
  return /[A-Z]/.test(c) ? c : '#';
};

export default function Glossar({ route }) {
  const [q, setQ] = useState(route.query.q || '');
  const [fach, setFach] = useState(null);
  const n = q.toLowerCase();
  const list = C.glossar.filter((g) => (!fach || g.fach === fach) && (!n || g.begriff.toLowerCase().includes(n) || g.erklaerung.toLowerCase().includes(n)));
  const letters = [...new Set(list.map((g) => first(g.begriff)))];
  const faecher = [...new Set(C.glossar.map((g) => g.fach).filter(Boolean))].map((id) => fachById[id]).filter(Boolean);
  return (
    <>
      <PageHead icon="📖" title="Glossar" sub={`${C.glossar.length} Begriffe und Abkürzungen der PPL-Ausbildung`} />
      <input className="input-lg" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Begriff filtern …" autoFocus={!!route.query.q} />
      <div className="chips mt">{faecher.map((f) => <FachChip small key={f.id} fach={f} active={fach === f.id} onClick={() => setFach(fach === f.id ? null : f.id)} />)}</div>
      <div className="az">{letters.map((l) => <a key={l} href={`#/glossar`} onClick={(e) => { e.preventDefault(); document.getElementById('gl-' + l)?.scrollIntoView({ behavior: 'smooth' }); }}>{l}</a>)}</div>
      {letters.map((l) => (
        <section key={l} id={'gl-' + l}>
          <h2 className="letter-head">{l}</h2>
          <div className="glossar">
            {list.filter((g) => first(g.begriff) === l).map((g) => (
              <div key={g.begriff} className="gl-item">
                <dt>{g.begriff}{g.fach && fachById[g.fach] && <span className="gl-fach" title={fachById[g.fach].name}>{fachById[g.fach].icon}</span>}</dt>
                <dd dangerouslySetInnerHTML={{ __html: g.html }} />
              </div>
            ))}
          </div>
        </section>
      ))}
      {!list.length && <p className="muted">Kein Begriff gefunden.</p>}
    </>
  );
}
