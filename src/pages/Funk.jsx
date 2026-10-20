import React, { useEffect, useRef, useState } from 'react';
import { PageHead, Icon, Html, Bar } from '../ui.jsx';
import { useAppState, C, update } from '../store.js';
import { ttsSupported, sprich, stille, getStimme, getTts, pause } from '../tts.js';
import { playClip, funkClip, ladeManifest, andereStimme, useAudio } from '../audio.js';
import { StimmWahl } from '../Player.jsx';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const KEY = 'flugschein-funk-einstellungen';
const FLAG = { de: '🇦🇹', en: '🇬🇧' };

// Platzhalter, bis docs/funkuebungen/szenarien.json vorliegt.
const DEMO = [{
  id: 'demo', titel: 'Beispiel: Rollen zur Piste (unkontrollierter Platz)', sprache: 'de', kategorie: 'Beispiel', niveau: 'Einstieg', flugplatz: 'Beispielplatz', rufzeichen: 'OE-ABC',
  beschreibung: 'Du stehst mit OE-ABC (C172) am Abstellplatz und möchtest zur Piste 09 rollen. Beispiel zum Ausprobieren – die echten Szenarien folgen.', hinweise: [], demo: true,
  schritte: [
    { pilot: true, station: 'Pilot', text: 'Beispielplatz Info, OE-ABC, Abstellplatz, VFR nach Graz, erbitte Rollinformation.', hinweis: 'Melde dich bei der Info-Stelle und erbitte Rollinformationen.', sprache: 'de', varianten: [] },
    { pilot: false, station: 'Info', text: 'OE-ABC, Beispielplatz Info, Piste 09, Wind 080 Grad 6 Knoten, QNH 1018.', sprache: 'de' },
    { pilot: true, station: 'Pilot', text: 'Piste 09, QNH 1018, OE-ABC.', hinweis: 'Lies die sicherheitsrelevanten Angaben zurück.', sprache: 'de', varianten: [] },
  ],
}];

const ZAHL = { null: '0', zero: '0', eins: '1', one: '1', wun: '1', zwo: '2', zwei: '2', two: '2', too: '2', drei: '3', three: '3', tree: '3', vier: '4', four: '4', fower: '4', fünf: '5', fuenf: '5', five: '5', fife: '5', sechs: '6', six: '6', sieben: '7', seven: '7', acht: '8', eight: '8', ait: '8', neun: '9', nine: '9', niner: '9', hundert: '00', hundred: '00', tausend: '000', thousand: '000', tousand: '000' };
const tokens = (t) => t.toLowerCase().replace(/[.,;:!?()„“"'’]/g, ' ').replace(/(\d)/g, ' $1 ').split(/[\s/-]+/).filter(Boolean).map((w) => ZAHL[w] || w);
export function abgleich(gesagt, loesung) {
  const soll = tokens(loesung);
  const ist = new Set(tokens(gesagt));
  const wichtig = soll.filter((w) => w.length > 1 || /\d/.test(w));
  const treffer = wichtig.filter((w) => ist.has(w));
  return { quote: wichtig.length ? treffer.length / wichtig.length : 0, fehlt: [...new Set(wichtig.filter((w) => !ist.has(w)))] };
}

const loadCfg = () => { try { return { pause: 10, erkennung: !!SR, vorlesen: true, textVerbergen: false, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { pause: 10, erkennung: !!SR, vorlesen: true, textVerbergen: false }; } };

const NIVEAU = ['leicht', 'mittel', 'schwer'];
const THEMA = { fuerstenfeld: 'Fürstenfeld', abflug: 'Abflug', ankunft: 'Ankunft', platzrunde: 'Platzrunde', meldepunkte: 'Meldepunkte', blindmeldung: 'Blindmeldung', fis: 'FIS', flugplan: 'Flugplan', verkehrsinformation: 'Verkehrsinfo', ctr: 'CTR', tma: 'TMA', graz: 'Graz', transponder: 'Transponder', grenzueberflug: 'Grenzüberflug', ungarn: 'Ungarn', slowenien: 'Slowenien', positionsmeldung: 'Positionsmeldung', wetter: 'Wetter', funkausfall: 'Funkausfall', notfall: 'Notfall', panpan: 'PAN PAN', mayday: 'MAYDAY', readback: 'Readback', englisch: 'Englisch' };
const themaName = (t) => THEMA[t] || t;

export default function Funk({ route }) {
  const s = useAppState();
  const audio = useAudio();
  const echte = C.funk?.szenarien || [];
  const list = echte.length ? echte : DEMO;
  const [f, setF] = useState({ sprache: '', niveau: '', thema: '' });
  const sz = list.find((x) => x.id === route.parts[1]);
  if (sz) return <Uebung key={sz.id} sz={sz} />;
  const themen = [...new Set(list.flatMap((x) => x.themen || []))];
  const gefiltert = list.filter((x) => (!f.sprache || x.sprache === f.sprache) && (!f.niveau || x.niveau === f.niveau) && (!f.thema || (x.themen || []).includes(f.thema)));
  const done = list.filter((x) => s.checks[`funk:${x.id}`]).length;
  const setFilter = (k, v) => setF((o) => ({ ...o, [k]: o[k] === v ? '' : v }));
  return (
    <>
      <PageHead icon="📻" title="Funktraining" sub="Sprechfunk üben: Die Gegenstelle spricht, du antwortest laut – danach siehst und hörst du die Musterlösung. Auf Wunsch hört die App mit und vergleicht grob." />
      {!echte.length && <div className="alert info">Die Funk-Szenarien werden gerade erstellt und erscheinen nach dem nächsten Update automatisch. Bis dahin kannst du den Ablauf mit einem Beispiel ausprobieren.</div>}
      {!ttsSupported && audio.status === 'fehlt' && <div className="alert warn">Dieser Browser hat keine Sprachausgabe – die Funksprüche werden nur als Text angezeigt.</div>}
      {C.funk?.hinweis && <div className="alert warn small">⚠️ {C.funk.hinweis}</div>}
      {C.lpe?.uebungen?.length > 0 && <a className="alert info lpe-hinweis" href="#/lpe">🗣️ <strong>Neu: LPE-Training</strong> – Sprachtest Englisch mit Interview, Bildbeschreibung, ATIS-Hörverstehen und Prüfungssimulation →</a>}
      {C.funk?.intro && <section className="card"><Html html={C.funk.intro} /></section>}
      {echte.length > 0 && (
        <section className="card funk-filter">
          <div className="row-between wrap"><strong>{gefiltert.length} von {list.length} Szenarien</strong><span className="muted small">{done} geübt{C.funk.rufzeichen ? ` · Rufzeichen ${C.funk.rufzeichen.kennzeichen} (${C.funk.rufzeichen.muster || ''})` : ''}</span></div>
          <div className="chips">
            {[['de', '🇦🇹 Deutsch'], ['en', '🇬🇧 Englisch']].map(([v, l]) => <button key={v} className={`chip small ${f.sprache === v ? 'active' : ''}`} onClick={() => setFilter('sprache', v)}>{l}</button>)}
            <span className="chip-sep" />
            {NIVEAU.map((v) => <button key={v} className={`chip small ${f.niveau === v ? 'active' : ''}`} onClick={() => setFilter('niveau', v)}>{v}</button>)}
          </div>
          <div className="chips">{themen.map((t) => <button key={t} className={`chip small ${f.thema === t ? 'active' : ''}`} onClick={() => setFilter('thema', t)}>{themaName(t)}</button>)}</div>
        </section>
      )}
      <div className="lib-list">
        {gefiltert.map((x) => (
          <a key={x.id} href={`#/funk/${x.id}`} className="lib-row lib-main funk-row">
            <span className="lib-icon">{FLAG[x.sprache] || '📻'}</span>
            <span className="grow">
              <strong>{x.titel}</strong>
              <small className="muted">{[x.niveau, `${x.schritte.filter((y) => y.pilot && !y.aktion).length} Antworten`, (x.themen || []).slice(0, 4).map(themaName).join(', ')].filter(Boolean).join(' · ')}</small>
            </span>
            {s.checks[`funk:${x.id}`] && <span className="pill ok">✓ geübt</span>}
            <Icon name="chevR" />
          </a>
        ))}
      </div>
    </>
  );
}

function Uebung({ sz }) {
  const [cfg, setCfg] = useState(loadCfg);
  const [i, setI] = useState(-1);
  const [phase, setPhase] = useState('start');
  const [rest, setRest] = useState(0);
  const [gesagt, setGesagt] = useState('');
  const [ergebnisse, setErgebnisse] = useState([]);
  const [fehler, setFehler] = useState('');
  const rec = useRef(null);
  const tick = useRef(null);
  const alive = useRef(true);
  const step = sz.schritte[i];
  const setC = (k, v) => setCfg((c) => { const n = { ...c, [k]: v }; localStorage.setItem(KEY, JSON.stringify(n)); return n; });

  useEffect(() => () => { alive.current = false; stille(); clearInterval(tick.current); try { rec.current?.abort(); } catch { /* */ } }, []);

  const say = async (st) => {
    if (st.aktion) return false;
    const idx = sz.schritte.indexOf(st);
    const stimme = getStimme();
    if (stimme !== 'geraet') {
      await ladeManifest();
      const c = funkClip(sz.id, idx, st.text, st.pilot ? stimme : andereStimme(stimme));
      if (c) {
        if (getTts().playing) pause();
        stille();
        const ok = await playClip(c);
        if (ok !== false || !alive.current) return ok;
      }
    }
    return sprich(st.text.replace(/\((?:aktion|action)\b[^)]*\)/gi, ' '), st.sprache || sz.sprache, 0.95);
  };
  const go = async (n) => {
    clearInterval(tick.current);
    if (n >= sz.schritte.length) { setPhase('ende'); setI(n); update((x) => { x.checks[`funk:${sz.id}`] = new Date().toISOString().slice(0, 10); }); return; }
    setI(n);
    setGesagt('');
    const st = sz.schritte[n];
    if (!st.pilot) {
      setPhase('atc');
      await say(st);
      if (alive.current) setTimeout(() => alive.current && go(n + 1), 500);
      return;
    }
    if (st.aktion) { setPhase('loesung'); return; }
    setPhase('antwort');
    startHoeren(st);
    if (cfg.pause > 0) {
      let r = cfg.pause;
      setRest(r);
      tick.current = setInterval(() => { r -= 1; setRest(r); if (r <= 0) { clearInterval(tick.current); zeigeLoesung(n); } }, 1000);
    }
  };
  const startHoeren = (st) => {
    if (!cfg.erkennung || !SR) return;
    try {
      const r = new SR();
      r.lang = (st.sprache || sz.sprache) === 'en' ? 'en-GB' : 'de-AT';
      r.interimResults = true;
      r.continuous = true;
      r.onresult = (e) => setGesagt([...e.results].map((x) => x[0].transcript).join(' '));
      r.onerror = (e) => {
        if (e.error === 'aborted' || e.error === 'no-speech') return;
        setFehler(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Mikrofon nicht freigegeben – erlaube den Zugriff in den Browser-Einstellungen oder schalte das Mithören aus.' : 'Spracherkennung nicht verfügbar (' + e.error + '). Sprich trotzdem laut – die Musterlösung kommt wie gewohnt.');
      };
      r.start();
      rec.current = r;
    } catch { rec.current = null; }
  };
  const zeigeLoesung = async (n = i) => {
    clearInterval(tick.current);
    try { rec.current?.stop(); } catch { /* */ }
    rec.current = null;
    setPhase('loesung');
    const st = sz.schritte[n];
    setGesagt((g) => {
      const a = g ? abgleich(g, [st.text, ...(st.varianten || [])].join(' ')) : null;
      setErgebnisse((e) => [...e.filter((x) => x.i !== n), { i: n, quote: a?.quote ?? null }]);
      return g;
    });
    if (cfg.vorlesen) await say(st);
  };
  const a = phase === 'loesung' && gesagt && step ? abgleich(gesagt, [step.text, ...(step.varianten || [])].join(' ')) : null;
  const verlauf = sz.schritte.slice(0, Math.max(0, phase === 'loesung' || phase === 'ende' ? i + 1 : i));

  return (
    <div className="funk">
      <a href="#/funk" className="link small" onClick={() => stille()}><Icon name="chevL" size={14} /> Alle Szenarien</a>
      <header className="page-head"><div>
        <h1>{FLAG[sz.sprache]} {sz.titel}</h1>
        <p className="muted">{[sz.flugplatz, sz.rufzeichen && `Rufzeichen ${sz.rufzeichen}`, sz.niveau].filter(Boolean).join(' · ')}</p>
      </div></header>
      {sz.beschreibung && <div className="alert info" dangerouslySetInnerHTML={{ __html: sz.beschreibung }} />}
      {sz.frequenzen?.length > 0 && (
        <div className="chips">{sz.frequenzen.map((q, k) => <span key={k} className={`pill ${q.uebungswert ? '' : 'ok'}`} title={q.uebungswert ? 'Übungswert – nicht real' : 'reale Frequenz'}>📻 {q.name}{q.mhz ? ` ${q.mhz}` : ''}{q.uebungswert ? ' · Übungswert' : ''}</span>)}</div>
      )}
      <Bar value={Math.max(0, i) / sz.schritte.length} height={5} />
      <div className="funk-log">
        {verlauf.map((st, k) => (
          <div key={k} className={`bubble ${st.pilot ? 'pilot' : 'atc'}`}>
            <small>{st.pilot ? (st.aktion ? 'Du (Handlung)' : 'Du (Musterlösung)') : st.station === 'atc' ? 'Gegenstelle' : st.station}</small>
            <p>{st.text}</p>
            {st.pilot && ergebnisse.find((e) => e.i === k)?.quote != null && <span className={`pill ${ergebnisse.find((e) => e.i === k).quote >= 0.8 ? 'ok' : ergebnisse.find((e) => e.i === k).quote >= 0.5 ? '' : 'bad'}`}>{Math.round(ergebnisse.find((e) => e.i === k).quote * 100)} %</span>}
            {(st.erklaerung || st.hinweis) && <p className="muted small">💡 {st.erklaerung || st.hinweis}</p>}
          </div>
        ))}
        {phase === 'atc' && step && (
          <div className="bubble atc live">
            <small><Icon name="headphones" size={12} /> {step.station === 'atc' ? 'Gegenstelle' : step.station} spricht …</small>
            <p>{cfg.textVerbergen ? '· · ·' : step.text}</p>
          </div>
        )}
      </div>

      {phase === 'start' && (
        <section className="card">
          <h3 className="mt0">Einstellungen</h3>
          <div className="player-field"><span>Bedenkzeit für deine Antwort</span>
            <div className="seg">{[[5, '5 s'], [10, '10 s'], [15, '15 s'], [25, '25 s'], [0, 'bis ich tippe']].map(([v, l]) => <button key={v} className={cfg.pause === v ? 'active' : ''} onClick={() => setC('pause', v)}>{l}</button>)}</div>
          </div>
          <div className="player-field"><span>Stimme (du als Pilot – die Gegenstelle spricht mit der anderen Stimme)</span>
            <StimmWahl />
          </div>
          <div className="player-opts">
            <label><input type="checkbox" checked={cfg.vorlesen} onChange={(e) => setC('vorlesen', e.target.checked)} /> Musterlösung vorlesen</label>
            <label><input type="checkbox" checked={cfg.textVerbergen} onChange={(e) => setC('textVerbergen', e.target.checked)} /> Funkspruch der Gegenstelle nur hören (Text erst danach)</label>
            <label className={SR ? '' : 'muted'}><input type="checkbox" disabled={!SR} checked={cfg.erkennung && !!SR} onChange={(e) => setC('erkennung', e.target.checked)} /> Mithören und grob vergleichen (Spracherkennung{SR ? '' : ' – in diesem Browser nicht verfügbar'})</label>
          </div>
          {SR && cfg.erkennung && <p className="muted small">Die Spracherkennung des Browsers schickt Audio je nach Browser an den Hersteller (z. B. Google). Der Vergleich ist grob: gezählt werden Schlüsselwörter und Zahlen der Musterlösung.</p>}
          {sz.hinweise?.length > 0 && <ul className="small">{sz.hinweise.map((h, k) => <li key={k} dangerouslySetInnerHTML={{ __html: h }} />)}</ul>}
          <button className="btn primary big" onClick={() => go(0)}><Icon name="play" size={18} /> Übung starten</button>
        </section>
      )}

      {phase === 'antwort' && step && (
        <section className="card funk-antwort">
          <h3 className="mt0"><Icon name="target" /> Du bist dran{(step.sprache || sz.sprache) === 'en' ? ' (englisch)' : ''}</h3>
          <p className="muted">Was sagst du jetzt? Sprich deine Meldung laut{cfg.erkennung && SR ? '' : ' – oder denk sie dir'}.</p>
          {cfg.erkennung && SR && (fehler ? <div className="alert warn small">{fehler}</div> : <p className="gesagt">{gesagt || <span className="muted">Ich höre zu … sprich jetzt laut.</span>}</p>)}
          <div className="row gap wrap">
            <button className="btn primary" onClick={() => zeigeLoesung()}>{cfg.pause > 0 ? `Lösung zeigen (${rest} s)` : 'Fertig – Lösung zeigen'}</button>
          </div>
        </section>
      )}

      {phase === 'loesung' && step && (
        <section className="card funk-antwort">
          <h3 className="mt0">{step.aktion ? 'Handlung (keine Sprachantwort)' : 'Musterlösung'}</h3>
          <p className="loesung-text">{step.text}</p>
          {step.hinweis && <p className="small">💡 {step.hinweis}</p>}
          {step.varianten?.length > 0 && <p className="muted small">Auch richtig: {step.varianten.join(' · ')}</p>}
          {a && (
            <div className={`alert ${a.quote >= 0.8 ? 'ok' : a.quote >= 0.5 ? 'info' : 'warn'}`}>
              <strong>{a.quote >= 0.8 ? 'Sehr gut' : a.quote >= 0.5 ? 'Teilweise' : 'Nochmal üben'} – {Math.round(a.quote * 100)} % der Schlüsselwörter</strong>
              <div className="small">Erkannt: „{gesagt}“{a.fehlt.length ? <><br />Fehlt: {a.fehlt.slice(0, 12).join(', ')}</> : null}</div>
            </div>
          )}
          <div className="row gap wrap">
            <button className="btn ghost" onClick={() => say(step)}><Icon name="headphones" size={16} /> Nochmal hören</button>
            <button className="btn ghost" onClick={() => go(i)}><Icon name="repeat" size={16} /> Wiederholen</button>
            <button className="btn primary" onClick={() => go(i + 1)}>Weiter <Icon name="chevR" size={16} /></button>
          </div>
        </section>
      )}

      {phase === 'ende' && (
        <section className="card center-text">
          <div className="result-emoji">🎧</div>
          <h2>Szenario abgeschlossen</h2>
          {ergebnisse.some((e) => e.quote != null) && <p className="muted">Durchschnitt Schlüsselwörter: {Math.round(100 * ergebnisse.filter((e) => e.quote != null).reduce((n, e) => n + e.quote, 0) / ergebnisse.filter((e) => e.quote != null).length)} %</p>}
          <div className="row gap center wrap">
            <button className="btn ghost" onClick={() => { setErgebnisse([]); go(0); }}><Icon name="repeat" size={16} /> Nochmal</button>
            <a className="btn primary" href="#/funk">Nächstes Szenario</a>
          </div>
        </section>
      )}
    </div>
  );
}
