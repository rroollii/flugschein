import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageHead, Icon, Html, Bar } from '../ui.jsx';
import { useAppState, C, update } from '../store.js';
import { ttsSupported, sprich, stille, getStimme, getTts, pause } from '../tts.js';
import { playClip, lpeClip, ladeManifest, andereStimme, useAudio } from '../audio.js';
import { StimmWahl } from '../Player.jsx';
import { abgleich } from './Funk.jsx';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const REC = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
const KEY = 'flugschein-lpe-einstellungen';
const SIM_KEY = 'flugschein-lpe-simulationen';

const TYP = {
  interview: ['🎙️', 'Interview'], bildbeschreibung: ['🖼️', 'Bildbeschreibung'], bildvergleich: ['🖼️', 'Bildvergleich'], hoerverstehen: ['👂', 'Hörverstehen'],
  readback: ['🔁', 'Readback'], weitergabe: ['📨', 'Weitergabe'], 'unerwartete-situation': ['⚠️', 'Unerwartete Situation'],
};
const typName = (t) => TYP[t]?.[1] || t;
const LANG = ['interview', 'bildbeschreibung', 'bildvergleich'];
const SPRECHER = { pruefer: 'Prüfer', atc: 'ATC', ansage: 'Aufnahme', pilot: 'Du' };
const NIVEAU = ['leicht', 'mittel', 'schwer'];
const ICAO = [
  ['aussprache', 'Pronunciation', 'Aussprache, Betonung, Satzmelodie – verständlich?'],
  ['struktur', 'Structure', 'Grammatik und Satzbau – Fehler stören die Bedeutung nicht?'],
  ['wortschatz', 'Vocabulary', 'Wortschatz reicht für Alltags- und Fliegerthemen, Umschreiben gelingt?'],
  ['fluessigkeit', 'Fluency', 'Flüssig, ohne lange Pausen, mit Bindewörtern?'],
  ['verstehen', 'Comprehension', 'Prüfer, ATIS und Funk verstanden, auch Unerwartetes?'],
  ['interaktion', 'Interactions', 'Passend reagiert, nachgefragt (say again), bestätigt?'],
];

const DEF = { lang: 60, kurz: 20, aufnahme: false, erkennung: false, textVerbergen: true, vorlesen: false };
const loadCfg = () => { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { ...DEF }; } };
const zeitFuer = (u, cfg) => (LANG.includes(u.typ) ? cfg.lang : cfg.kurz);
const ladeSims = () => { try { return JSON.parse(localStorage.getItem(SIM_KEY)) || []; } catch { return []; } };

export default function Lpe({ route }) {
  const s = useAppState();
  const audio = useAudio();
  const list = C.lpe?.uebungen || [];
  const [f, setF] = useState({ typ: '', niveau: '', level: '' });
  if (route.parts[1] === 'simulation') return <Simulation />;
  const u = list.find((x) => x.id === route.parts[1]);
  if (u) return <LpeUebung key={u.id} u={u} />;
  const gefiltert = list.filter((x) => (!f.typ || x.typ === f.typ) && (!f.niveau || x.niveau === f.niveau) && (!f.level || x.level === f.level));
  const done = list.filter((x) => s.checks[`lpe:${x.id}`]).length;
  const typen = [...new Set(list.map((x) => x.typ))];
  const setFilter = (k, v) => setF((o) => ({ ...o, [k]: o[k] === v ? '' : v }));
  const sims = ladeSims();
  const modul = C.zusatz?.module?.find((m) => /lpe/.test(m.id));
  return (
    <>
      <PageHead icon="🗣️" title="LPE-Training" sub="Sprachtest Englisch (FCL.055): Prüfer, ATIS und Funk hören, frei auf Englisch antworten – mit Zeitvorgabe, optionaler Aufnahme und Musterantwort." />
      {!list.length && <div className="alert info">Die LPE-Übungen werden gerade erstellt und erscheinen nach dem nächsten Update automatisch.</div>}
      {!ttsSupported && audio.status === 'fehlt' && <div className="alert warn">Dieser Browser hat keine Sprachausgabe – die Texte werden nur angezeigt.</div>}
      {C.lpe?.hinweis && <div className="alert warn small">⚠️ {C.lpe.hinweis}</div>}
      {list.length > 0 && (
        <section className="card lpe-sim-card">
          <div className="row-between wrap">
            <div>
              <h3 className="mt0">🎓 Prüfungssimulation</h3>
              <p className="muted small mt0">Teil I: Interview + Bild · Teil II: Hörverstehen, Readback/Weitergabe, unerwartete Situation – zufällig zusammengestellt, ca. 15–20 Minuten. Danach Selbsteinschätzung nach den 6 ICAO-Kriterien.</p>
              {sims[0] && <p className="small mt0">Zuletzt: {new Date(sims[0].datum).toLocaleDateString('de-AT')} – eingeschätzt Level {sims[0].level}</p>}
            </div>
            <a className="btn primary" href="#/lpe/simulation"><Icon name="play" size={16} /> Simulation starten</a>
          </div>
        </section>
      )}
      {list.length > 0 && (
        <section className="card funk-filter">
          <div className="row-between wrap"><strong>{gefiltert.length} von {list.length} Übungen</strong><span className="muted small">{done} geübt{modul ? <> · <a href={`#/zusatz/${modul.id}`}>Skript & 8-Wochen-Plan</a></> : null}</span></div>
          <div className="chips">{typen.map((t) => <button key={t} className={`chip small ${f.typ === t ? 'active' : ''}`} onClick={() => setFilter('typ', t)} title={C.lpe.typen?.[t]}>{TYP[t]?.[0]} {typName(t)}</button>)}</div>
          <div className="chips">
            {NIVEAU.map((v) => <button key={v} className={`chip small ${f.niveau === v ? 'active' : ''}`} onClick={() => setFilter('niveau', v)}>{v}</button>)}
            <span className="chip-sep" />
            {['4', '5'].map((v) => <button key={v} className={`chip small ${f.level === v ? 'active' : ''}`} onClick={() => setFilter('level', v)}>Ziel Level {v}</button>)}
          </div>
          {f.typ && C.lpe.typen?.[f.typ] && <p className="muted small mt0">{C.lpe.typen[f.typ]}</p>}
        </section>
      )}
      <div className="lib-list">
        {gefiltert.map((x) => (
          <a key={x.id} href={`#/lpe/${x.id}`} className="lib-row lib-main funk-row">
            <span className="lib-icon">{TYP[x.typ]?.[0] || '🗣️'}</span>
            <span className="grow">
              <strong>{x.titel}</strong>
              <small className="muted">{[typName(x.typ), x.niveau, x.level && `Level ${x.level}`, `${x.schritte.filter((y) => y.pilot).length} Antworten`].filter(Boolean).join(' · ')}</small>
            </span>
            {s.checks[`lpe:${x.id}`] && <span className="pill ok">✓ geübt</span>}
            <Icon name="chevR" />
          </a>
        ))}
      </div>
    </>
  );
}

function Einstellungen({ cfg, setC, kompakt }) {
  return (
    <>
      <div className="player-field"><span>Antwortzeit bei Interview und Bildern</span>
        <div className="seg">{[[45, '45 s'], [60, '60 s'], [90, '90 s'], [0, 'ohne Timer']].map(([v, l]) => <button key={v} className={cfg.lang === v ? 'active' : ''} onClick={() => setC('lang', v)}>{l}</button>)}</div>
      </div>
      <div className="player-field"><span>Antwortzeit bei Funk, Readback und Weitergabe</span>
        <div className="seg">{[[15, '15 s'], [20, '20 s'], [30, '30 s'], [0, 'ohne Timer']].map(([v, l]) => <button key={v} className={cfg.kurz === v ? 'active' : ''} onClick={() => setC('kurz', v)}>{l}</button>)}</div>
      </div>
      {!kompakt && <div className="player-field"><span>Stimme der Musterantwort (Prüfer und ATC sprechen mit der anderen Stimme)</span><StimmWahl /></div>}
      <div className="player-opts">
        <label className={REC ? '' : 'muted'}><input type="checkbox" disabled={!REC} checked={cfg.aufnahme && REC} onChange={(e) => setC('aufnahme', e.target.checked)} /> Meine Antworten aufnehmen und danach anhören{REC ? '' : ' (in diesem Browser nicht verfügbar)'}</label>
        <label className={SR ? '' : 'muted'}><input type="checkbox" disabled={!SR} checked={cfg.erkennung && !!SR} onChange={(e) => setC('erkennung', e.target.checked)} /> Spracherkennung: Gesagtes mitschreiben und grob mit der Musterantwort vergleichen{SR ? '' : ' (nicht verfügbar)'}</label>
        <label><input type="checkbox" checked={cfg.textVerbergen} onChange={(e) => setC('textVerbergen', e.target.checked)} /> Prüfer/ATIS nur hören – Text erst danach zeigen</label>
        <label><input type="checkbox" checked={cfg.vorlesen} onChange={(e) => setC('vorlesen', e.target.checked)} /> Musterantwort automatisch vorlesen</label>
      </div>
      {(cfg.aufnahme || cfg.erkennung) && <p className="muted small">Aufnahmen bleiben nur in diesem Browser-Tab und werden nirgends gespeichert. Die Spracherkennung schickt Audio je nach Browser an den Hersteller (z. B. Google).</p>}
    </>
  );
}

function BildKarte({ u }) {
  if (!u.bild) return null;
  return (
    <section className="card lpe-bild">
      <div className="lpe-bild-rahmen"><span>🖼️</span><small>{u.typ === 'bildvergleich' ? 'Zwei Fotos' : 'Foto'} – im Test liegt hier ein echtes Bild</small></div>
      <p className="mt0" dangerouslySetInnerHTML={{ __html: u.bild }} />
    </section>
  );
}

function Uhr({ rest, gesamt }) {
  if (!gesamt) return null;
  const m = Math.floor(Math.max(0, rest) / 60);
  const sek = String(Math.max(0, rest) % 60).padStart(2, '0');
  return (
    <div className={`lpe-uhr ${rest <= 10 ? 'knapp' : ''}`}>
      <strong>{m}:{sek}</strong>
      <Bar value={Math.max(0, rest) / gesamt} height={6} color={rest <= 10 ? 'var(--warn, #e67e22)' : undefined} />
    </div>
  );
}

// Eine Übung; mit `sim` als Teil der Prüfungssimulation (onFertig → nächste Aufgabe).
function LpeUebung({ u, sim, cfgOverride, onFertig }) {
  const [cfgEigen, setCfg] = useState(loadCfg);
  const cfg = cfgOverride || cfgEigen;
  const [i, setI] = useState(-1);
  const [phase, setPhase] = useState(sim ? 'bereit' : 'start');
  const [rest, setRest] = useState(0);
  const [gesagt, setGesagt] = useState('');
  const [aufnahmen, setAufnahmen] = useState({});
  const [quoten, setQuoten] = useState({});
  const [fehler, setFehler] = useState('');
  const [nimmtAuf, setNimmtAuf] = useState(false);
  const rec = useRef(null);
  const mr = useRef(null);
  const stream = useRef(null);
  const tick = useRef(null);
  const alive = useRef(true);
  const step = u.schritte[i];
  const setC = (k, v) => setCfg((c) => { const n = { ...c, [k]: v }; localStorage.setItem(KEY, JSON.stringify(n)); return n; });

  useEffect(() => () => {
    alive.current = false; stille(); clearInterval(tick.current);
    try { rec.current?.abort(); } catch { /* */ }
    try { if (mr.current?.state === 'recording') mr.current.stop(); } catch { /* */ }
    stream.current?.getTracks().forEach((t) => t.stop());
  }, []);
  useEffect(() => () => Object.values(aufnahmen).forEach((x) => URL.revokeObjectURL(x)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const say = async (st) => {
    const stimme = getStimme();
    if (stimme !== 'geraet') {
      await ladeManifest();
      const c = lpeClip(u.id, st.n, st.text, st.pilot ? stimme : andereStimme(stimme));
      if (c) {
        if (getTts().playing) pause();
        stille();
        const ok = await playClip(c);
        if (ok !== false || !alive.current) return ok;
      }
    }
    return sprich(st.text.replace(/\([^)]*\)|\[[^\]]*\]/g, ' '), st.sprache || 'en', st.sprecher === 'ansage' ? 0.9 : 0.95);
  };

  const fertig = () => {
    setPhase('ende'); setI(u.schritte.length);
    update((x) => { x.checks[`lpe:${u.id}`] = new Date().toISOString().slice(0, 10); });
  };
  const go = async (n) => {
    clearInterval(tick.current);
    setFehler('');
    if (n >= u.schritte.length) { fertig(); return; }
    setI(n);
    setGesagt('');
    const st = u.schritte[n];
    if (!st.pilot) {
      setPhase('hoeren');
      await say(st);
      if (!alive.current) return;
      const naechster = u.schritte[n + 1];
      // Ansagen (ATIS, Funkspruch) und Prüferfragen vor Notizen/Antwort nicht sofort weiterschalten
      if (st.sprecher === 'ansage' || (naechster && !naechster.pilot)) setPhase('gehoert');
      else setTimeout(() => alive.current && go(n + 1), 400);
      return;
    }
    setPhase('antwort');
    await starteAufnahme(n);
    startHoeren(st);
    const t = zeitFuer(u, cfg);
    if (t > 0) {
      let r = t;
      setRest(r);
      tick.current = setInterval(() => { r -= 1; setRest(r); if (r <= 0) { clearInterval(tick.current); zeigeLoesung(n); } }, 1000);
    }
  };
  const starteAufnahme = async (n) => {
    if (!cfg.aufnahme || !REC) return;
    try {
      stream.current ||= await navigator.mediaDevices.getUserMedia({ audio: true });
      const m = new MediaRecorder(stream.current);
      const teile = [];
      m.ondataavailable = (e) => e.data.size && teile.push(e.data);
      m.onstop = () => { setNimmtAuf(false); if (teile.length) { const url = URL.createObjectURL(new Blob(teile, { type: m.mimeType || 'audio/webm' })); setAufnahmen((a) => ({ ...a, [m.schritt]: url })); } };
      m.schritt = n;
      m.start();
      mr.current = m;
      setNimmtAuf(true);
    } catch {
      setFehler('Mikrofon nicht freigegeben – erlaube den Zugriff in den Browser-Einstellungen oder schalte die Aufnahme aus.');
    }
  };
  const startHoeren = (st) => {
    if (!cfg.erkennung || !SR) return;
    try {
      const r = new SR();
      r.lang = 'en-GB';
      r.interimResults = true;
      r.continuous = true;
      r.onresult = (e) => setGesagt([...e.results].map((x) => x[0].transcript).join(' '));
      r.onerror = (e) => {
        if (e.error === 'aborted' || e.error === 'no-speech') return;
        setFehler(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Mikrofon nicht freigegeben – erlaube den Zugriff oder schalte die Spracherkennung aus.' : `Spracherkennung nicht verfügbar (${e.error}). Sprich trotzdem laut – die Musterantwort kommt wie gewohnt.`);
      };
      r.onend = () => { if (rec.current === r && alive.current) { try { r.start(); } catch { /* */ } } };
      r.start();
      rec.current = r;
    } catch { rec.current = null; }
  };
  const zeigeLoesung = async (n = i) => {
    clearInterval(tick.current);
    const r = rec.current; rec.current = null;
    try { r?.stop(); } catch { /* */ }
    if (mr.current?.state === 'recording') { mr.current.schritt = n; mr.current.stop(); }
    setPhase('loesung');
    const st = u.schritte[n];
    setGesagt((g) => { if (g) setQuoten((q) => ({ ...q, [n]: abgleich(g, st.text).quote })); return g; });
    if (cfg.vorlesen) await say(st);
  };

  const a = phase === 'loesung' && gesagt && step?.pilot ? abgleich(gesagt, step.text) : null;
  const zeigeText = (st) => !cfg.textVerbergen || phase !== 'hoeren' || st !== step;
  const verlauf = u.schritte.slice(0, Math.max(0, ['loesung', 'ende', 'gehoert'].includes(phase) ? i + 1 : i));
  const t = zeitFuer(u, cfg);

  return (
    <div className="funk lpe">
      {!sim && <a href="#/lpe" className="link small" onClick={() => stille()}><Icon name="chevL" size={14} /> Alle Übungen</a>}
      <header className="page-head"><div>
        <h1>{TYP[u.typ]?.[0]} {u.titel}</h1>
        <p className="muted">{[typName(u.typ), u.niveau, u.level && `Ziel Level ${u.level}`].filter(Boolean).join(' · ')}</p>
      </div></header>
      {u.situation && <div className="alert info" dangerouslySetInnerHTML={{ __html: u.situation }} />}
      {u.aufgabe && <section className="card lpe-aufgabe"><small>Aufgabe</small><p className="mt0" dangerouslySetInnerHTML={{ __html: u.aufgabe }} /></section>}
      <BildKarte u={u} />
      <Bar value={Math.max(0, i) / u.schritte.length} height={5} />
      <div className="funk-log">
        {verlauf.map((st, k) => (
          <div key={k} className={`bubble ${st.pilot ? 'pilot' : 'atc'}`}>
            <small>{st.pilot ? 'Du (Musterantwort)' : SPRECHER[st.sprecher] || st.sprecher}</small>
            <p lang="en">{st.sprecher === 'ansage' && cfg.textVerbergen && phase !== 'ende' ? <span className="muted">· · · Text erscheint am Ende der Übung</span> : st.text}</p>
            {st.pilot && aufnahmen[k] && <audio controls src={aufnahmen[k]} className="lpe-audio" />}
            {st.pilot && quoten[k] != null && <span className={`pill ${quoten[k] >= 0.6 ? 'ok' : quoten[k] >= 0.35 ? '' : 'bad'}`}>{Math.round(quoten[k] * 100)} % Schlüsselwörter</span>}
            {st.hinweis && k !== i && <p className="muted small">💡 {st.hinweis}</p>}
          </div>
        ))}
        {phase === 'hoeren' && step && (
          <div className="bubble atc live">
            <small><Icon name="headphones" size={12} /> {SPRECHER[step.sprecher] || step.sprecher} spricht …</small>
            <p lang="en">{zeigeText(step) ? step.text : '· · ·'}</p>
          </div>
        )}
      </div>

      {phase === 'start' && (
        <section className="card">
          <h3 className="mt0">Einstellungen</h3>
          <Einstellungen cfg={cfg} setC={setC} />
          <button className="btn primary big" onClick={() => go(0)}><Icon name="play" size={18} /> Übung starten</button>
        </section>
      )}
      {phase === 'bereit' && (
        <section className="card"><button className="btn primary big" onClick={() => go(0)}><Icon name="play" size={18} /> Aufgabe starten</button></section>
      )}

      {phase === 'gehoert' && step && (
        <section className="card funk-antwort">
          <p className="muted mt0">{step.sprecher === 'ansage' ? 'Mach dir Notizen – im Test darfst du meist um Wiederholung bitten.' : 'Bereit?'}</p>
          <div className="row gap wrap">
            <button className="btn ghost" onClick={() => say(step)}><Icon name="headphones" size={16} /> Nochmal hören</button>
            <button className="btn primary" onClick={() => go(i + 1)}>Weiter <Icon name="chevR" size={16} /></button>
          </div>
        </section>
      )}

      {phase === 'antwort' && step && (
        <section className="card funk-antwort">
          <h3 className="mt0"><Icon name="target" /> Du bist dran – auf Englisch</h3>
          <p className="muted">{LANG.includes(u.typ) ? 'Sprich frei und zusammenhängend, 4–6 Sätze.' : 'Sprich deine Antwort laut.'}{nimmtAuf ? ' 🔴 Aufnahme läuft.' : ''}</p>
          <Uhr rest={rest} gesamt={t} />
          {fehler && <div className="alert warn small">{fehler}</div>}
          {cfg.erkennung && SR && !fehler && <p className="gesagt" lang="en">{gesagt || <span className="muted">Ich höre zu …</span>}</p>}
          <div className="row gap wrap">
            <button className="btn primary" onClick={() => zeigeLoesung()}>Fertig – Musterantwort zeigen</button>
          </div>
        </section>
      )}

      {phase === 'loesung' && step && (
        <section className="card funk-antwort">
          <h3 className="mt0">Musterantwort</h3>
          <p className="loesung-text" lang="en">{step.text}</p>
          {step.hinweis && <p className="small">💡 {step.hinweis}</p>}
          {aufnahmen[i] && <div className="lpe-vergleich"><small className="muted">Deine Aufnahme</small><audio controls src={aufnahmen[i]} className="lpe-audio" /></div>}
          {a && (
            <div className={`alert ${a.quote >= 0.6 ? 'ok' : a.quote >= 0.35 ? 'info' : 'warn'}`}>
              <strong>{Math.round(a.quote * 100)} % der Schlüsselwörter der Musterantwort</strong> <span className="small">(freie Antworten dürfen abweichen)</span>
              <div className="small">Erkannt: „{gesagt}“</div>
            </div>
          )}
          <div className="row gap wrap">
            <button className="btn ghost" onClick={() => say(step)}><Icon name="headphones" size={16} /> Musterantwort anhören</button>
            <button className="btn ghost" onClick={() => go(i)}><Icon name="repeat" size={16} /> Nochmal antworten</button>
            <button className="btn primary" onClick={() => go(i + 1)}>Weiter <Icon name="chevR" size={16} /></button>
          </div>
        </section>
      )}

      {phase === 'ende' && (
        <section className="card">
          {u.vokabeln?.length > 0 && (
            <>
              <h3 className="mt0">📚 Vokabeln</h3>
              <table className="lpe-vokabeln"><tbody>{u.vokabeln.map((v, k) => <tr key={k}><td lang="en"><strong>{v.en}</strong></td><td>{v.de}</td></tr>)}</tbody></table>
            </>
          )}
          <div className="row gap wrap">
            {sim ? <button className="btn primary" onClick={onFertig}>Nächste Aufgabe <Icon name="chevR" size={16} /></button> : (
              <>
                <button className="btn ghost" onClick={() => { setQuoten({}); go(0); }}><Icon name="repeat" size={16} /> Nochmal</button>
                <a className="btn primary" href="#/lpe">Nächste Übung</a>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const zufall = (arr) => arr[Math.floor(Math.random() * arr.length)];
function planeSimulation() {
  const L = C.lpe?.uebungen || [];
  const von = (...typen) => L.filter((x) => typen.includes(x.typ));
  const plan = [
    ['I', 'Interview', von('interview')],
    ['I', 'Bild beschreiben / vergleichen', von('bildbeschreibung', 'bildvergleich')],
    ['II', 'Hörverstehen', von('hoerverstehen')],
    ['II', 'Readback / Weitergabe', von('readback', 'weitergabe')],
    ['II', 'Unerwartete Situation', von('unerwartete-situation')],
  ];
  return plan.filter((p) => p[2].length).map(([teil, name, kand]) => ({ teil, name, u: zufall(kand) }));
}

function Simulation() {
  const [plan, setPlan] = useState(planeSimulation);
  const [k, setK] = useState(-1);
  const [cfg, setCfg] = useState(() => ({ ...loadCfg(), textVerbergen: true, vorlesen: false }));
  const [noten, setNoten] = useState({});
  const [gespeichert, setGespeichert] = useState(false);
  const setC = (key, v) => setCfg((c) => ({ ...c, [key]: v }));
  const level = useMemo(() => (ICAO.every(([id]) => noten[id]) ? Math.min(...ICAO.map(([id]) => noten[id])) : null), [noten]);
  useEffect(() => { window.scrollTo(0, 0); }, [k]);
  const aktuell = plan[k];

  if (k >= 0 && aktuell) {
    return (
      <div>
        <div className="lpe-sim-kopf">
          <a href="#/lpe" className="link small" onClick={() => stille()}><Icon name="chevL" size={14} /> Abbrechen</a>
          <span className="pill">Teil {aktuell.teil} · Aufgabe {k + 1}/{plan.length}: {aktuell.name}</span>
        </div>
        <LpeUebung key={`${k}-${aktuell.u.id}`} u={aktuell.u} sim cfgOverride={cfg} onFertig={() => setK(k + 1)} />
      </div>
    );
  }
  if (k >= plan.length) {
    const speichern = () => {
      const sims = [{ datum: new Date().toISOString(), level, noten, aufgaben: plan.map((p) => p.u.id) }, ...ladeSims()].slice(0, 20);
      localStorage.setItem(SIM_KEY, JSON.stringify(sims));
      setGespeichert(true);
    };
    return (
      <>
        <PageHead icon="🎓" title="Simulation abgeschlossen" sub="Schätze dich ehrlich ein – im Test zählt das schwächste der sechs ICAO-Kriterien." />
        <section className="card">
          {ICAO.map(([id, en, frage]) => (
            <div key={id} className="lpe-kriterium">
              <div><strong>{en}</strong><small className="muted"> – {frage}</small></div>
              <div className="seg">{[[3, 'unter 4'], [4, '4'], [5, '5'], [6, '6']].map(([v, l]) => <button key={v} className={noten[id] === v ? 'active' : ''} onClick={() => setNoten((n) => ({ ...n, [id]: v }))}>{l}</button>)}</div>
            </div>
          ))}
          {level != null && (
            <div className={`alert ${level >= 4 ? 'ok' : 'warn'}`}>
              <strong>Eingeschätzt: {level >= 4 ? `Level ${level}` : 'unter Level 4'}</strong>
              <div className="small">{level >= 6 ? 'Level 6 gilt unbefristet.' : level === 5 ? 'Level 5 gilt 6 Jahre.' : level === 4 ? 'Level 4 gilt 4 Jahre – für den Test reicht das.' : 'Noch nicht ausreichend – übe die schwächsten Kriterien gezielt (Skript LPE Englisch).'}</div>
            </div>
          )}
          <div className="row gap wrap">
            <button className="btn primary" disabled={level == null || gespeichert} onClick={speichern}>{gespeichert ? '✓ Gespeichert' : 'Ergebnis speichern'}</button>
            <button className="btn ghost" onClick={() => { setPlan(planeSimulation()); setNoten({}); setGespeichert(false); setK(-1); }}><Icon name="repeat" size={16} /> Neue Simulation</button>
            <a className="btn ghost" href="#/lpe">Zur Übersicht</a>
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <a href="#/lpe" className="link small"><Icon name="chevL" size={14} /> LPE-Training</a>
      <PageHead icon="🎓" title="Prüfungssimulation" sub="Nachbildung des Sprachtests: Teil I (Gespräch mit dem Prüfer, Bild) und Teil II (Hören und Funk). Antworte jeweils frei und laut auf Englisch." />
      <section className="card">
        <h3 className="mt0">Ablauf</h3>
        <ol className="lpe-plan">
          {plan.map((p, n) => <li key={n}><span className="pill">Teil {p.teil}</span> <strong>{p.name}</strong> <span className="muted small">– {p.u.titel}</span></li>)}
        </ol>
        <button className="btn ghost sm" onClick={() => setPlan(planeSimulation())}><Icon name="repeat" size={14} /> Andere Aufgaben</button>
      </section>
      <section className="card">
        <h3 className="mt0">Einstellungen</h3>
        <Einstellungen cfg={cfg} setC={setC} />
        <p className="muted small">In der Simulation werden Prüferfragen und Aufnahmen zuerst nur gesprochen – der Text erscheint danach.</p>
        <button className="btn primary big" onClick={() => setK(0)}><Icon name="play" size={18} /> Simulation starten</button>
      </section>
    </>
  );
}
