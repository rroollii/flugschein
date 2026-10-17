import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageHead, Icon, Html, Ring, Bar } from '../ui.jsx';
import { useAppState, C, fachById, skriptById, skriptProgress, kapitelKey } from '../store.js';
import { hoerbar, fragenHtml, getSource, lastListened, play, useTts, minutenFuer } from '../tts.js';
import { ListenButton, useTtsHighlight, StimmWahl } from '../Player.jsx';
import { useAudio, audioPakete, offlineStand, machOffline, entferneOffline, offlineMoeglich } from '../audio.js';
import { startSession } from './Fragen.jsx';

const DOC_ICON = { 'ppl-ueberblick': '🧭', ausbildungsplan: '🗺️', lernplan: '📅', 'flugschule-fuerstenfeld': '🛫', 'fragen-ueberblick': '❓', 'skripte-ueberblick': '📚', 'zusatzausbildungen-ueberblick': '🌟' };
const lesezeit = (zeichen) => Math.max(1, Math.round(zeichen / 6 / 200));

export default function Bibliothek({ route }) {
  const [sub, id] = route.parts.slice(1);
  if (sub === 'fragen' && fachById[id]) return <Fragenkatalog fach={fachById[id]} />;
  if (sub === 'glossar') return <GlossarLesen />;
  return <Uebersicht />;
}

function Row({ icon, farbe, titel, meta, href, type, id, ring, children }) {
  return (
    <div className="lib-row" style={{ '--c': farbe || 'var(--accent)' }}>
      <a href={href} className="lib-main">
        <span className="lib-icon">{icon}</span>
        <span className="grow">
          <strong>{titel}</strong>
          <small className="muted">{meta}</small>
        </span>
        {ring != null && <Ring value={ring} size={40} stroke={5} color={farbe} />}
      </a>
      <div className="lib-actions">
        <a className="btn ghost sm" href={href}><Icon name="book" size={16} /> Lesen</a>
        <ListenButton type={type} id={id} />
        {children}
      </div>
    </div>
  );
}

function Uebersicht() {
  const s = useAppState();
  useTts();
  const last = lastListened();
  const order = [...C.empfohleneReihenfolge, ...C.faecher.filter((f) => !f.zusatz).map((f) => f.id)];
  const ppl = C.skripte.filter((sk) => sk.bereich !== 'zusatz').sort((a, b) => order.indexOf(a.fachId) - order.indexOf(b.fachId));
  const zusatz = C.skripte.filter((sk) => sk.bereich === 'zusatz');
  const katalogFaecher = C.faecher.filter((f) => f.anzahlFragen > 0);
  const gesamtZeichen = [...C.skripte.map((sk) => getSource('skript', sk.id)), ...C.dokumente.map((d) => getSource('doc', d.id))].reduce((n, x) => n + (x?.zeichen || 0), 0);
  const ersterOffen = (() => {
    for (const sk of ppl) {
      const i = sk.kapitel.findIndex((k) => k.zaehlt && !s.gelesen[kapitelKey(sk.id, k.id)]);
      if (i >= 0) return { sk, i };
    }
    return ppl[0] ? { sk: ppl[0], i: 0 } : null;
  })();
  const skriptRow = (sk) => {
    const f = fachById[sk.fachId];
    const p = skriptProgress(s, sk);
    const src = getSource('skript', sk.id);
    const base = sk.bereich === 'zusatz' ? 'zusatz' : 'skripte';
    const next = sk.kapitel.find((k) => k.zaehlt && !s.gelesen[kapitelKey(sk.id, k.id)]);
    return (
      <Row key={sk.id} icon={f?.icon || '📘'} farbe={f?.farbe} titel={sk.titel} type="skript" id={sk.id} ring={p.pct}
        href={`#/${base}/${sk.id}${next ? '/' + next.id : ''}`}
        meta={`${sk.kapitel.length} Kapitel · ${p.done}/${p.total} gelesen · ca. ${lesezeit(src.zeichen)} min lesen · ${minutenFuer(src.zeichen)} min hören`} />
    );
  };

  return (
    <>
      <PageHead icon="📚" title="Lernunterlagen"
        sub={`Alle Unterlagen zum Lesen und Anhören: ${ppl.length} Fachskripte, ${zusatz.length} Zusatz-Skripte, ${katalogFaecher.length} Fragenkataloge, ${C.dokumente.length} Dokumente und das Glossar – zusammen rund ${Math.round(minutenFuer(gesamtZeichen) / 60)} Stunden Hörbuch.`} />

      {hoerbar ? (
        <section className="card listen-hero">
          <div className="row gap wrap">
            <span className="lib-icon big"><Icon name="headphones" size={26} /></span>
            <div className="grow">
              <h2 className="mt0">Hörbuch</h2>
              <p className="muted small">
                Jede Unterlage lässt sich vorlesen – im Auto, beim Sport oder vor dem Einschlafen. Der aktuelle Absatz wird im Text markiert,
                Kapitel laufen automatisch weiter. Tempo und Sleep-Timer stellst du im Player unten ein.
              </p>
            </div>
          </div>
          <div className="player-field mt"><span>Stimme</span><StimmWahl /></div>
          <div className="row gap wrap mt">
            {last && (
              <button className="btn primary" onClick={() => play(last.type, last.id)}>
                <Icon name="play" size={16} /> Weiterhören: {last.src.titel.replace(/\s*\(.*\)$/, '')} · {last.src.parts[last.pos.part]?.titel}
              </button>
            )}
            {ersterOffen && (
              <button className={`btn ${last ? 'ghost' : 'primary'}`} onClick={() => play('skript', ersterOffen.sk.id, ersterOffen.i, 0)}>
                <Icon name="headphones" size={16} /> Alle Skripte in Lernreihenfolge hören
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="alert warn">Dieser Browser unterstützt keine Sprachausgabe – die Hörbuch-Funktion ist hier nicht verfügbar. Lesen geht natürlich trotzdem.</div>
      )}

      <OfflineAudio />

      <h2 className="section-title">Fachskripte PPL(A) <small className="muted">in empfohlener Lernreihenfolge</small></h2>
      <div className="lib-list">{ppl.map(skriptRow)}</div>

      {zusatz.length > 0 && (
        <>
          <h2 className="section-title">Zusatzausbildungen</h2>
          <div className="lib-list">{zusatz.map(skriptRow)}</div>
        </>
      )}

      <h2 className="section-title">Fragenkataloge zum Lesen <small className="muted">Fragen mit Lösung und Erklärung</small></h2>
      <div className="lib-list">
        {katalogFaecher.map((f) => {
          const src = getSource('fragen', f.id);
          return (
            <Row key={f.id} icon={f.icon} farbe={f.farbe} titel={f.name} type="fragen" id={f.id} href={`#/bibliothek/fragen/${f.id}`}
              meta={`${f.anzahlFragen} Fragen${f.zusatz ? ' · Zusatzausbildung' : ''} · ${minutenFuer(src.zeichen)} min hören`}>
              <button className="btn ghost sm" onClick={() => startSession({ titel: f.name, ids: C.fragen.filter((q) => q.fachId === f.id).map((q) => q.id), modus: 'lernen', zufall: true, anzahl: 20 })}>
                <Icon name="quiz" size={16} /> Üben
              </button>
            </Row>
          );
        })}
      </div>

      <h2 className="section-title">Dokumente & Nachschlagen</h2>
      <div className="lib-list">
        {C.dokumente.map((d) => {
          const src = getSource('doc', d.id);
          return (
            <Row key={d.id} icon={DOC_ICON[d.id] || '📄'} titel={d.titel} type="doc" id={d.id} href={`#/dokumente/${d.id}`}
              meta={`${d.toc.length} Abschnitte · ca. ${lesezeit(src.zeichen)} min lesen · ${minutenFuer(src.zeichen)} min hören`} />
          );
        })}
        <Row icon="📖" titel="Glossar" type="glossar" id="alle" href="#/glossar"
          meta={`${C.glossar.length} Fachbegriffe · ${minutenFuer(getSource('glossar', 'alle').zeichen)} min hören`} />
      </div>
    </>
  );
}

const mb = (kb) => (kb >= 1024 ? `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1).replace('.', ',')} MB` : `${kb} KB`);

function OfflineAudio() {
  const a = useAudio();
  const t = useTts();
  const stimme = t.settings.stimme === 'mann' ? 'mann' : 'frau';
  const pakete = useMemo(() => audioPakete(C, stimme), [a.manifest, stimme]);
  const [lauf, setLauf] = useState({});
  const [offen, setOffen] = useState(false);
  const [platz, setPlatz] = useState(null);
  useEffect(() => { offlineStand(pakete); }, [pakete]);
  useEffect(() => { navigator.storage?.estimate?.().then((e) => setPlatz(e)).catch(() => {}); }, [a.offline]);
  if (a.status !== 'ok' || !pakete.length) return null;
  const name = a.manifest.stimmen?.[stimme]?.name || stimme;
  const gespeichert = pakete.filter((p) => (a.offline[p.id] || 0) >= 0.999);
  const laden = async (p) => {
    setLauf((l) => ({ ...l, [p.id]: 0.001 }));
    const fehler = await machOffline(p, (x) => setLauf((l) => ({ ...l, [p.id]: Math.max(0.001, x) })));
    setLauf((l) => { const n = { ...l }; delete n[p.id]; return n; });
    if (fehler) alert(`${fehler} Datei(en) konnten nicht geladen werden – bitte bei guter Verbindung erneut versuchen.`);
  };
  return (
    <section className="card offline-audio">
      <div className="row-between wrap">
        <div>
          <h2 className="mt0"><Icon name="download" size={18} /> Offline hören</h2>
          <p className="muted small">
            Natürliche Stimme ({name}) für ein Fach aufs Gerät laden – dann läuft das Hörbuch auch im Flugzeug oder ohne Netz.
            {gespeichert.length ? ` Gespeichert: ${gespeichert.map((p) => p.titel).join(', ')}.` : ' Ohne Speichern wird jedes Kapitel beim Abspielen gestreamt.'}
            {platz?.usage ? ` Belegt: ${mb(Math.round(platz.usage / 1024))}.` : ''}
          </p>
        </div>
        <button className="btn ghost sm" onClick={() => setOffen(!offen)} aria-expanded={offen}>{offen ? 'Ausblenden' : 'Fächer anzeigen'}</button>
      </div>
      {!offlineMoeglich() && <p className="alert warn small">Offline-Speichern geht nur in der Web-Version (https://rroollii.github.io/flugschein/), nicht in der Einzeldatei.</p>}
      {offen && offlineMoeglich() && (
        <div className="offline-list">
          {pakete.map((p) => {
            const stand = a.offline[p.id] || 0;
            const l = lauf[p.id];
            return (
              <div key={p.id} className="offline-row" style={{ '--c': p.farbe || 'var(--accent)' }}>
                <span className="lib-icon">{p.icon}</span>
                <span className="grow">
                  <strong>{p.titel}</strong>
                  <small className="muted">{p.info} · {p.minuten} min · ca. {mb(p.kb)}{stand > 0 && stand < 0.999 && !l ? ` · ${Math.round(stand * 100)} % gespeichert` : ''}</small>
                  {l != null && <Bar value={l} height={4} color={p.farbe} />}
                </span>
                {l != null ? <span className="muted small">{Math.round(l * 100)} %</span>
                  : stand >= 0.999 ? (
                    <>
                      <span className="pill ok">✓ offline</span>
                      <button className="btn ghost sm" onClick={() => entferneOffline(p)} title="Vom Gerät löschen"><Icon name="trash" size={14} /></button>
                    </>
                  ) : <button className="btn ghost sm" onClick={() => laden(p)}><Icon name="download" size={14} /> Offline verfügbar machen</button>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Fragenkatalog({ fach }) {
  const ref = useRef(null);
  const [loesung, setLoesung] = useState(true);
  useTtsHighlight(ref, 'fragen', fach.id, 0);
  const sk = skriptById[fach.skriptId];
  return (
    <div className="doc-layout" style={{ '--c': fach.farbe }}>
      <aside className="doc-toc card">
        <a href="#/bibliothek" className="link small"><Icon name="chevL" size={14} /> Alle Lernunterlagen</a>
        <h4>{fach.icon} {fach.name}</h4>
        <p className="muted small">{fach.anzahlFragen} Fragen · Prüfung: {fach.pruefung.fragen} Fragen in {fach.pruefung.minuten} min</p>
        <div className="row gap wrap">
          <ListenButton type="fragen" id={fach.id} part={0} />
          {sk && <a className="btn ghost sm" href={`#/${sk.bereich === 'zusatz' ? 'zusatz' : 'skripte'}/${sk.id}`}><Icon name="book" size={16} /> Skript</a>}
        </div>
        <label className="player-opts mt"><span><input type="checkbox" checked={loesung} onChange={(e) => setLoesung(e.target.checked)} /> Lösungen anzeigen</span></label>
      </aside>
      <article className="card reading">
        <div className="row-between wrap">
          <h1 className="mt0">Fragenkatalog {fach.name}</h1>
          <button className="btn primary sm" onClick={() => startSession({ titel: fach.name, ids: C.fragen.filter((q) => q.fachId === fach.id).map((q) => q.id), modus: 'lernen', zufall: true, anzahl: 20 })}>
            <Icon name="quiz" size={16} /> Interaktiv üben
          </button>
        </div>
        <p className="muted small">Eigene Übungsfragen im ECQB-Stil (keine Originalfragen). Beim Anhören folgt die Lösung nach einer kurzen Denkpause.</p>
        <div ref={ref} className={`katalog ${loesung ? '' : 'verdeckt'}`}>
          <Html html={fragenHtml(fach.id)} />
        </div>
      </article>
    </div>
  );
}

function GlossarLesen() {
  const ref = useRef(null);
  useTtsHighlight(ref, 'glossar', 'alle', 0);
  const src = getSource('glossar', 'alle');
  return (
    <article className="card reading">
      <a href="#/bibliothek" className="link small"><Icon name="chevL" size={14} /> Alle Lernunterlagen</a>
      <div className="row-between wrap"><h1>Glossar</h1><ListenButton type="glossar" id="alle" part={0} /></div>
      <div ref={ref}><Html html={src.parts[0].html} /></div>
    </article>
  );
}
