import React, { useEffect, useRef, useState } from 'react';
import { PageHead, Icon } from '../ui.jsx';
import { useAppState, update, setState, getState, emptyState, normalize, SCHEMA, C, today } from '../store.js';

let installEvt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installEvt = e;
});

function merge(a, b) {
  const out = structuredClone(a);
  for (const k of ['checks', 'gelesen', 'gemerkt', 'fristen']) out[k] = { ...a[k], ...b[k] };
  for (const [id, r] of Object.entries(b.fragen || {})) {
    const x = a.fragen[id];
    out.fragen[id] = !x || (r.last || '') >= (x.last || '') ? r : x;
  }
  for (const [d, n] of Object.entries(b.aktivitaet || {})) out.aktivitaet[d] = Math.max(a.aktivitaet[d] || 0, n);
  const ids = new Set(a.logbuch.map((f) => f.id));
  out.logbuch = [...a.logbuch, ...(b.logbuch || []).filter((f) => !ids.has(f.id))];
  const ex = new Set(a.pruefungen.map((p) => p.datum));
  out.pruefungen = [...a.pruefungen, ...(b.pruefungen || []).filter((p) => !ex.has(p.datum))].sort((x, y) => x.datum.localeCompare(y.datum));
  return out;
}

export default function Daten() {
  const s = useAppState();
  const file = useRef(null);
  const [msg, setMsg] = useState(null);
  const [canInstall, setCanInstall] = useState(!!installEvt);
  useEffect(() => {
    const h = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  const set = (k) => (e) => update((st) => { st.settings[k] = e.target.value; });

  const exportJson = () => {
    const data = { ...getState(), exportiert: new Date().toISOString(), app: C.meta.titel };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `flugschein-fortschritt-${today()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg({ ok: true, text: 'Export erstellt – die Datei liegt in deinem Download-Ordner.' });
  };
  const importJson = async (e, mode) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data.schema !== SCHEMA && !data.fragen && !data.checks) throw new Error('Keine Flugschein-Fortschrittsdatei.');
      const n = normalize(data);
      setState(mode === 'merge' ? merge(getState(), n) : n);
      setMsg({ ok: true, text: mode === 'merge' ? 'Fortschritt zusammengeführt.' : 'Fortschritt importiert.' });
    } catch (err) {
      setMsg({ ok: false, text: 'Import fehlgeschlagen: ' + err.message });
    }
  };
  const [importMode, setImportMode] = useState('merge');
  const counts = [
    ['Abgehakte Punkte', Object.keys(s.checks).length], ['Gelesene Kapitel', Object.keys(s.gelesen).length],
    ['Bearbeitete Fragen', Object.keys(s.fragen).length], ['Flüge', s.logbuch.length], ['Prüfungen', s.pruefungen.length],
  ];

  return (
    <>
      <PageHead icon="⚙️" title="Daten & Einstellungen" sub="Dein Fortschritt wird nur lokal in diesem Browser gespeichert – kein Konto, kein Server." />
      {msg && <div className={`alert ${msg.ok ? 'ok' : 'warn'}`}>{msg.text}</div>}
      <div className="two-col">
        <section className="card form">
          <h2 className="mt0">Einstellungen</h2>
          <label>Dein Vorname<input value={s.settings.name} onChange={set('name')} placeholder="für die Begrüßung" /></label>
          <label>Lernstart (Woche 1 des Lernplans)<input type="date" value={s.settings.startDatum} onChange={set('startDatum')} /></label>
          <label>Neue Karteikarten pro Tag<input type="number" min="0" value={s.settings.neueKartenProTag} onChange={(e) => update((st) => { st.settings.neueKartenProTag = Number(e.target.value) || 0; })} /></label>
          <label>Darstellung
            <div className="seg">
              {[['auto', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([v, l]) => (
                <button type="button" key={v} className={s.settings.theme === v ? 'active' : ''} onClick={() => update((st) => { st.settings.theme = v; })}>{l}</button>
              ))}
            </div>
          </label>
          {canInstall && (
            <button className="btn primary" onClick={async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; setCanInstall(false); }}>
              <Icon name="download" size={16} /> Als App installieren
            </button>
          )}
          <p className="muted small">{location.protocol.startsWith('http') ? 'Offline-Modus: Die Seite wird nach dem ersten Besuch zwischengespeichert und funktioniert auch ohne Internet.' : 'Als lokale Datei geöffnet: alles funktioniert offline. Hinweis: Jeder Browser speichert den Fortschritt getrennt – nutze Export/Import zum Übertragen.'}</p>
        </section>
        <section className="card">
          <h2 className="mt0">Fortschritt sichern</h2>
          <div className="kv">{counts.map(([k, v]) => <React.Fragment key={k}><span>{k}</span><strong>{v}</strong></React.Fragment>)}</div>
          <div className="row gap wrap mt">
            <button className="btn primary" onClick={exportJson}><Icon name="download" size={16} /> Als JSON exportieren</button>
          </div>
          <h3>Importieren</h3>
          <div className="seg">
            <button className={importMode === 'merge' ? 'active' : ''} onClick={() => setImportMode('merge')}>Zusammenführen</button>
            <button className={importMode === 'replace' ? 'active' : ''} onClick={() => setImportMode('replace')}>Ersetzen</button>
          </div>
          <p className="muted small">{importMode === 'merge' ? 'Kombiniert die Datei mit dem aktuellen Stand (z. B. Handy + Laptop).' : 'Überschreibt den aktuellen Stand vollständig mit der Datei.'}</p>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e, importMode)} />
          <button className="btn ghost" onClick={() => file.current.click()}><Icon name="upload" size={16} /> Datei wählen …</button>
          <h3>Zurücksetzen</h3>
          <button className="btn danger" onClick={() => confirm('Wirklich den gesamten Fortschritt löschen? Vorher am besten exportieren.') && (setState(emptyState()), setMsg({ ok: true, text: 'Fortschritt zurückgesetzt.' }))}>
            <Icon name="trash" size={16} /> Alles zurücksetzen
          </button>
        </section>
      </div>
      <section className="card">
        <h3 className="mt0">Über diese Plattform</h3>
        <p className="small muted">
          Inhalte erstellt am {new Date(C.meta.erstellt).toLocaleString('de-AT')} · {C.faecher.length} Fächer · {C.fragen.length} Fragen · {C.skripte.length} Skripte.
          {C.meta.fragenHinweis ? ' ' + C.meta.fragenHinweis : ''} Maßgeblich sind immer die Unterlagen deiner Flugschule und der zuständigen Behörde.
        </p>
      </section>
    </>
  );
}
