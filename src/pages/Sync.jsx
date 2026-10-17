import React, { useEffect, useState, useSyncExternalStore } from 'react';
import qrcode from 'qrcode-generator';
import { PageHead, Icon, navigate } from '../ui.jsx';
import { getState, setState } from '../store.js';
import { getSync, subscribeSync, setSync, syncNow, disconnect, merge, encodeState, decodeState, transferLink } from '../sync.js';

const QR_MAX = 2300;
const fmt = (iso) => (iso ? new Date(iso).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' }) : 'noch nie');

function Qr({ text }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    try {
      const q = qrcode(0, 'L');
      q.addData(text, 'Byte');
      q.make();
      setSvg(q.createSvgTag({ cellSize: 3, margin: 3, scalable: true }));
    } catch { setSvg(''); }
  }, [text]);
  return svg ? <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="muted small">QR-Code zu groß – bitte den Link verwenden.</p>;
}

function Empfang({ code }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');
  useEffect(() => { decodeState(code).then(setData).catch((e) => setErr('Link ist unvollständig oder beschädigt: ' + e.message)); }, [code]);
  const apply = (mode) => {
    setState(mode === 'merge' ? merge(getState(), data) : data);
    setDone(mode === 'merge' ? 'Fortschritt zusammengeführt.' : 'Fortschritt übernommen.');
    setTimeout(() => navigate('/sync'), 1200);
  };
  return (
    <section className="card">
      <h2 className="mt0"><Icon name="download" /> Fortschritt von einem anderen Gerät</h2>
      {err && <div className="alert warn">{err}</div>}
      {done && <div className="alert ok">{done}</div>}
      {data && !done && (
        <>
          <p>Enthalten: {Object.keys(data.checks).length} abgehakte Punkte · {Object.keys(data.gelesen).length} gelesene Kapitel · {Object.keys(data.fragen).length} bearbeitete Fragen · {Object.keys(data.karten).length} Lernkarten · {data.logbuch.length} Flüge</p>
          <div className="row gap wrap">
            <button className="btn primary" onClick={() => apply('merge')}>Mit diesem Gerät zusammenführen</button>
            <button className="btn ghost" onClick={() => confirm('Den Stand dieses Geräts vollständig ersetzen?') && apply('replace')}>Stand ersetzen</button>
          </div>
          <p className="muted small">Zusammenführen ist fast immer richtig: Es gewinnt je Eintrag die jüngere Änderung, nichts geht verloren.</p>
        </>
      )}
    </section>
  );
}

export default function Sync({ route }) {
  const cfg = useSyncExternalStore(subscribeSync, getSync);
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [code, setCode] = useState('');
  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const r = await syncNow();
      setMsg({ ok: true, text: r.remote ? 'Synchronisiert – Stände zusammengeführt.' : 'Erster Sync: privates Gist angelegt. Jetzt auf dem anderen Gerät denselben Token eintragen.' });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy(false);
  };
  const connect = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setSync({ token: token.trim(), gistId: '' });
    setToken('');
    await run();
  };
  const makeLink = async () => setCode(await encodeState());
  const link = code ? transferLink(code) : '';
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Flugschein – Fortschritt', url: link });
      else { await navigator.clipboard.writeText(link); setMsg({ ok: true, text: 'Link kopiert.' }); }
    } catch { /* abgebrochen */ }
  };

  return (
    <>
      <PageHead icon="🔄" title="Geräte-Sync" sub="Fortschritt zwischen Handy, Tablet und PC abgleichen – ohne Konto bei uns und ohne eigenen Server." />
      {route.query.d && <Empfang code={route.query.d} />}
      {msg && <div className={`alert ${msg.ok ? 'ok' : 'warn'}`}>{msg.text}</div>}
      <div className="two-col">
        <section className="card">
          <h2 className="mt0">Automatisch über GitHub Gist</h2>
          {cfg.token ? (
            <>
              <p className="pill ok">Verbunden</p>
              <div className="kv mt">
                <span>Letzter Sync</span><strong>{fmt(cfg.last)}</strong>
                <span>Gist</span><strong>{cfg.gistId ? <a href={`https://gist.github.com/${cfg.gistId}`} target="_blank" rel="noopener">privat · öffnen</a> : '–'}</strong>
              </div>
              {cfg.lastError && <div className="alert warn mt">Letzter Fehler: {cfg.lastError}</div>}
              <label className="player-opts mt"><span><input type="checkbox" checked={cfg.auto} onChange={(e) => setSync({ auto: e.target.checked })} /> Automatisch synchronisieren (beim Öffnen, nach Änderungen, beim Schließen)</span></label>
              <div className="row gap wrap mt">
                <button className="btn primary" disabled={busy} onClick={run}><Icon name="repeat" size={16} /> {busy ? 'Synchronisiere …' : 'Jetzt synchronisieren'}</button>
                <button className="btn danger" onClick={() => confirm('Token von diesem Gerät entfernen? Das Gist bleibt bestehen.') && disconnect()}>Trennen</button>
              </div>
            </>
          ) : (
            <form onSubmit={connect} className="form">
              <ol className="steps small">
                <li>Auf <a href="https://github.com/settings/tokens/new?scopes=gist&description=Flugschein-Sync" target="_blank" rel="noopener">github.com → Token erstellen</a> (kostenloses GitHub-Konto) einen „classic“ Token mit <strong>nur</strong> dem Haken <code>gist</code> anlegen, Ablauf z. B. „No expiration“ oder 1 Jahr.</li>
                <li>Token hier einfügen und verbinden – es wird ein <strong>privates</strong> Gist „flugschein-fortschritt.json“ angelegt.</li>
                <li>Auf dem zweiten Gerät dieselbe Seite öffnen und <strong>denselben Token</strong> eintragen. Fertig – ab jetzt gleichen sich beide automatisch ab.</li>
              </ol>
              <label>GitHub-Token (gist)<input type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_…" /></label>
              <button className="btn primary" disabled={busy || !token.trim()}><Icon name="repeat" size={16} /> Verbinden & synchronisieren</button>
              <p className="muted small">Der Token bleibt nur in diesem Browser gespeichert und wird ausschließlich an api.github.com geschickt. Mit dem gist-Recht kann er nur Gists lesen/schreiben – nicht deine Repositories. Er ist nicht im JSON-Export enthalten.</p>
            </form>
          )}
        </section>
        <section className="card">
          <h2 className="mt0">Einmalig per Link oder QR-Code</h2>
          <p className="muted small">Ohne Konto: Der komplette Stand steckt (komprimiert) im Link. Auf dem anderen Gerät öffnen und „Zusammenführen“ wählen.</p>
          <button className="btn primary" onClick={makeLink}><Icon name="upload" size={16} /> Link mit meinem Fortschritt erzeugen</button>
          {code && (
            <div className="mt">
              {link.length <= QR_MAX ? <Qr text={link} /> : <p className="muted small">Dein Fortschritt ist zu groß für einen QR-Code ({Math.round(link.length / 1000)} kB) – nutze „Teilen“ (z. B. per Messenger an dich selbst) oder den Gist-Sync.</p>}
              <div className="row gap wrap mt">
                {navigator.share && <button className="btn ghost" onClick={share}><Icon name="upload" size={16} /> Teilen …</button>}
                <button className="btn ghost" onClick={async () => { try { await navigator.clipboard.writeText(link); setMsg({ ok: true, text: 'Link kopiert.' }); } catch { setMsg({ ok: false, text: 'Kopieren nicht möglich – Link unten markieren und kopieren.' }); } }}>Link kopieren</button>
              </div>
              <textarea className="sync-link" readOnly rows={2} value={link} onFocus={(e) => e.target.select()} aria-label="Übertragungslink" />
              <p className="muted small">Linklänge: {link.length.toLocaleString('de-AT')} Zeichen. Der Link enthält deinen Fortschritt – nur an dich selbst schicken.</p>
            </div>
          )}
          <h3>Alternativ</h3>
          <p className="muted small">Unter <a href="#/daten">Daten & Einstellungen</a> als Datei exportieren und auf dem anderen Gerät importieren.</p>
        </section>
      </div>
    </>
  );
}
