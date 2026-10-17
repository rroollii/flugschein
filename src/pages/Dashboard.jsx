import React, { useMemo, useState } from 'react';
import { Ring, Bar, Icon, Check, navigate, pct, fmtH, FachChip } from '../ui.jsx';
import {
  useAppState, C, allSkriptProgress, fachStats, checklistProgress, allPhaseItems, flightProgress, currentWeek, weekOf,
  toggleCheck, streak, dueCards, today, skriptById, kapitelKey, fachById, weekDates, daysBetween,
} from '../store.js';
import { startSession } from './Fragen.jsx';
import { hoerbar, lastListened, play, useTts } from '../tts.js';

const TIPPS = [
  'Verständnis vor Auswendiglernen – rund die Hälfte der Prüfungsfragen kennst du vorher nicht.',
  'Kurze, tägliche Einheiten schlagen lange Lernmarathons. 20 Karten am Tag reichen.',
  'Falsche Antworten sind Gold wert: Wiederhole sie am nächsten Tag.',
  'Rechenaufgaben (Navigation, Flugleistung) immer mit echtem Besteck und Flugrechner üben.',
  'Ziel vor der Prüfung: ≥ 90 % in Übungsfragen und ≥ 85 % in zwei Simulationen hintereinander.',
  'Ein gutes Briefing ist der halbe Flug – das gilt auch fürs Lernen: Plane deine Woche.',
];

export function nextChapter(s, fachIds) {
  const order = [...(fachIds || []), ...C.empfohleneReihenfolge.filter((f) => !(fachIds || []).includes(f))];
  for (const fid of order) {
    const sk = skriptById[fachById[fid]?.skriptId];
    if (!sk) continue;
    const k = sk.kapitel.find((k) => k.zaehlt && !s.gelesen[kapitelKey(sk.id, k.id)]);
    if (k) return { skript: sk, kapitel: k };
  }
  return null;
}

export default function Dashboard() {
  const s = useAppState();
  const skr = allSkriptProgress(s);
  const fs = fachStats(s);
  const plan = checklistProgress(s, allPhaseItems());
  const fl = flightProgress(s);
  const gesamt = (skr.pct + fs.beherrscht + plan.pct + fl.pct) / 4;
  const wk = currentWeek(s);
  const woche = C.lernplan.wochen.find((w) => weekOf(w, wk));
  const { due, neuHeute } = dueCards(s);
  const fehler = C.fragen.filter((q) => s.fragen[q.id] && !s.fragen[q.id].lastOk);
  const next = nextChapter(s, woche?.faecher);
  const st = streak(s);
  useTts();
  const gehoert = hoerbar ? lastListened() : null;
  const [neuZu, setNeuZu] = useState(() => localStorage.getItem('flugschein-neu-v3') === 'zu');
  const hoeren = () => (gehoert ? play(gehoert.type, gehoert.id) : next ? play('skript', next.skript.id, next.skript.kapitel.indexOf(next.kapitel), 0) : navigate('/bibliothek'));
  const heute = s.aktivitaet[today()] || 0;
  const tipp = TIPPS[new Date().getDate() % TIPPS.length];
  const begriff = C.glossar.length ? C.glossar[(daysBetween('2026-01-01', today()) + C.glossar.length * 10) % C.glossar.length] : null;
  const nextPhase = C.ausbildung.phasen.find((p) => p.phaseNr != null && !(p.meilenstein && s.checks[p.meilenstein.id]));
  const fristWarn = useMemo(
    () => C.ausbildung.fristen.map((f) => ({ ...f, ...s.fristen[f.id] })).filter((f) => f.ablauf && daysBetween(today(), f.ablauf) <= 60),
    [s.fristen],
  );
  const hour = new Date().getHours();
  const gruss = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  return (
    <div className="dash">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">PPL(A)-Ausbildung · {C.meta.schule}</p>
          <h1>{gruss}{s.settings.name ? `, ${s.settings.name}` : ''}! ✈️</h1>
          <p>{gesamt < 0.02 ? 'Willkommen an Bord. Starte mit dem ersten Skript-Kapitel oder ein paar Übungsfragen.' : gesamt < 0.5 ? 'Du bist auf dem Steigflug – weiter so!' : gesamt < 0.9 ? 'Reiseflughöhe erreicht. Die Lizenz kommt in Sicht.' : 'Endanflug! Fast geschafft.'}</p>
          <div className="hero-stats">
            <span><Icon name="fire" size={16} /> {st} {st === 1 ? 'Tag' : 'Tage'} Serie</span>
            <span><Icon name="target" size={16} /> {heute} Aktionen heute</span>
            {wk > 0 && <span><Icon name="calendar" size={16} /> Lernwoche {wk}</span>}
          </div>
          {hoerbar && (
            <button className="hero-listen" onClick={hoeren}>
              <Icon name="headphones" size={18} /> {gehoert ? 'Weiterhören' : 'Skripte anhören'}
              <small>{gehoert ? gehoert.src.parts[gehoert.pos.part]?.titel : 'als Hörbuch vorlesen lassen'}</small>
            </button>
          )}
        </div>
        <div className="hero-ring">
          <Ring value={gesamt} size={140} stroke={13} color="#fff" sub="Gesamt" />
        </div>
      </section>

      {!neuZu && (
        <section className="card neu-box">
          <div className="row-between"><h2 className="mt0">✨ Neu in deiner Lernplattform</h2><button className="icon-btn sm" aria-label="Ausblenden" onClick={() => { localStorage.setItem('flugschein-neu-v3', 'zu'); setNeuZu(true); }}><Icon name="x" size={16} /></button></div>
          <div className="neu-grid">
            <a href="#/bibliothek"><span>🎧</span><strong>Hörbuch mit natürlichen Stimmen</strong><small>Frau oder Mann, Text läuft mit – „Anhören“ in jedem Kapitel, auch offline</small></a>
            <a href="#/lernkarten"><span>🃏</span><strong>Lernkarten</strong><small>{C.karten.length} Karten aus Skripten & Glossar, Anki-Export</small></a>
            <a href="#/funk"><span>📻</span><strong>Funktraining</strong><small>{C.funk?.szenarien?.length || 'Beispiel-'} Szenarien mit echten Stimmen</small></a>
            <a href="#/checklisten"><span>✅</span><strong>Checklisten</strong><small>{C.checklisten?.length || 0} Checklisten zum Abhaken & Drucken</small></a>
            <a href="#/sync"><span>🔄</span><strong>Geräte-Sync</strong><small>Handy ↔ PC abgleichen</small></a>
          </div>
        </section>
      )}

      <section className="grid4">
        <a className="stat-card" href="#/skripte">
          <Ring value={skr.pct} size={74} stroke={8} color="#2f80ed" />
          <div><h3>Skripte</h3><p>{skr.done} / {skr.total} Kapitel gelesen</p></div>
        </a>
        <a className="stat-card" href="#/statistik">
          <Ring value={fs.beherrscht} size={74} stroke={8} color="#27ae60" />
          <div><h3>Fragen sicher</h3><p>{fs.sicher} / {fs.total} (Karteifach ≥ 3)</p></div>
        </a>
        <a className="stat-card" href="#/ausbildung">
          <Ring value={plan.pct} size={74} stroke={8} color="#f2994a" />
          <div><h3>Ausbildungsplan</h3><p>{plan.done} / {plan.total} Punkte erledigt</p></div>
        </a>
        <a className="stat-card" href="#/ausbildung/logbuch">
          <Ring value={fl.pct} size={74} stroke={8} color="#9b51e0" />
          <div><h3>Flugstunden</h3><p>{fmtH(fl.gesamt)} / {C.ausbildung.minima.gesamt}:00 h · {fl.landungen} Landungen</p></div>
        </a>
      </section>

      <div className="dash-cols">
        <section className="card today">
          <div className="card-head">
            <h2><Icon name="star" /> Heute lernen</h2>
            <span className="muted">{new Date().toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="today-actions">
            <button className="action" disabled={!due.length && !neuHeute.length}
              onClick={() => startSession({ titel: 'Karteikasten', ids: [...due, ...neuHeute].map((q) => q.id), modus: 'karteikasten' })}>
              <span className="action-icon blue"><Icon name="cards" /></span>
              <span><strong>{due.length} fällige Karten</strong><small>+ {neuHeute.length} neue für heute</small></span>
            </button>
            <button className="action" disabled={!fehler.length}
              onClick={() => startSession({ titel: 'Fehlerwiederholung', ids: fehler.map((q) => q.id), modus: 'fehler' })}>
              <span className="action-icon red"><Icon name="repeat" /></span>
              <span><strong>{fehler.length} Fehler wiederholen</strong><small>Zuletzt falsch beantwortet</small></span>
            </button>
            {next && (
              <button className="action" onClick={() => navigate(`/skripte/${next.skript.id}/${next.kapitel.id}`)}>
                <span className="action-icon green"><Icon name="book" /></span>
                <span><strong>Weiterlesen: {next.skript.titel.replace(/\s*\(.*\)$/, '')}</strong><small>{next.kapitel.titel}</small></span>
              </button>
            )}
            {hoerbar && (gehoert || next) && (
              <button className="action" onClick={() => (gehoert ? play(gehoert.type, gehoert.id) : play('skript', next.skript.id, next.skript.kapitel.indexOf(next.kapitel), 0))}>
                <span className="action-icon blue"><Icon name="headphones" /></span>
                <span>
                  <strong>{gehoert ? 'Weiterhören' : 'Als Hörbuch anhören'}: {(gehoert ? gehoert.src.titel : next.skript.titel).replace(/\s*\(.*\)$/, '')}</strong>
                  <small>{gehoert ? gehoert.src.parts[gehoert.pos.part]?.titel : next.kapitel.titel}</small>
                </span>
              </button>
            )}
          </div>
          {woche ? (
            <div className="week-today">
              <div className="row-between">
                <h3>{woche.label}: {woche.titel}</h3>
                <a href={`#/lernplan/${woche.nr}`} className="link">Wochenplan <Icon name="chevR" size={14} /></a>
              </div>
              <p className="muted small">{woche.block} · {weekDates(s, wk).map((d) => new Date(d + 'T12:00').toLocaleDateString('de-AT', { day: 'numeric', month: 'short' })).join(' – ')}</p>
              <div className="chips">{woche.faecher.map((f) => <FachChip key={f} small fach={fachById[f]} onClick={() => navigate(`/skripte/${fachById[f].skriptId}`)} />)}</div>
              <div className="checklist">
                {woche.items.map((it) => (
                  <Check key={it.id} checked={s.checks[it.id]} onChange={() => toggleCheck(it.id)}>
                    <span dangerouslySetInnerHTML={{ __html: it.html }} />
                  </Check>
                ))}
              </div>
            </div>
          ) : (
            <p className="muted">{wk === 0 ? 'Dein Lernplan startet bald.' : 'Der Standard-Lernplan ist durchlaufen – Zeit für Simulationen und Wiederholung!'} Lernstart kannst du unter <a href="#/lernplan">Lernplan</a> einstellen.</p>
          )}
        </section>

        <div className="dash-side">
          {nextPhase && (
            <section className="card">
              <div className="card-head"><h2><Icon name="plane" /> Nächster Meilenstein</h2></div>
              <h3 className="mt0">{nextPhase.titel}</h3>
              <Bar value={checklistProgress(s, nextPhase.items).pct} color="#f2994a" />
              <p className="muted small">{checklistProgress(s, nextPhase.items).done} / {nextPhase.items.length} Punkte · {nextPhase.flugzeit || ''}</p>
              {nextPhase.meilenstein && <p className="small" dangerouslySetInnerHTML={{ __html: '🏁 ' + nextPhase.meilenstein.html }} />}
              <a className="btn ghost sm" href={`#/ausbildung/phasen/${nextPhase.id}`}>Zur Phase</a>
            </section>
          )}
          {fristWarn.length > 0 && (
            <section className="card warn-card">
              <div className="card-head"><h2><Icon name="clock" /> Fristen</h2></div>
              {fristWarn.map((f) => {
                const d = daysBetween(today(), f.ablauf);
                return <p key={f.id} className="small"><strong>{f.name}</strong>: {d < 0 ? `abgelaufen seit ${-d} Tagen` : `läuft in ${d} Tagen ab`}</p>;
              })}
            </section>
          )}
          <section className="card">
            <div className="card-head"><h2><Icon name="chart" /> Fächer</h2><a className="link" href="#/statistik">Details</a></div>
            <div className="mini-faecher">
              {C.faecher.filter((f) => !f.zusatz).map((f) => {
                const st = fachStats(s, f.id);
                return (
                  <a key={f.id} href={`#/statistik`} className="mini-fach" title={f.name}>
                    <span>{f.icon}</span>
                    <span className="mini-name">{f.name}</span>
                    <Bar value={st.beherrscht} color={f.farbe} height={6} />
                    <span className="muted small">{pct(st.beherrscht)}</span>
                  </a>
                );
              })}
            </div>
          </section>
          {begriff && (
            <section className="card tip">
              <p className="eyebrow">Begriff des Tages</p>
              <h3 className="mt0">{begriff.begriff}</h3>
              <p className="small" dangerouslySetInnerHTML={{ __html: begriff.html }} />
              <p className="eyebrow mt">Tipp</p>
              <p className="small">{tipp}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
