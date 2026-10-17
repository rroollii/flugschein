import React, { useEffect, useState } from 'react';
import { Icon, Bar, navigate } from './ui.jsx';
import {
  useTts, ttsSupported, BLOCK, RATES, play, toggle, stop, skipSentence, skipSection, setSetting, setSleep, germanVoices,
  restaurieren, restMinuten, playFrom, getSource,
} from './tts.js';

// Hebt im angezeigten Text den gerade gesprochenen Absatz hervor; Klick auf einen Absatz springt dorthin.
export function useTtsHighlight(ref, type, id, part = 0) {
  const t = useTts();
  const key = `${type}:${id}`;
  const active = t.srcKey === key && t.part === part;
  const b = active ? t.segs[t.seg]?.b : null;
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll('.tts-cur').forEach((el) => el.classList.remove('tts-cur'));
    root.classList.toggle('tts-aktiv', active);
    if (b == null || b < 0) return;
    const el = root.querySelectorAll(BLOCK)[b];
    if (!el) return;
    el.classList.add('tts-cur');
    if (t.playing && t.settings.follow) {
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 170) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [active, b, t.playing, t.part, part, id]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = (e) => {
      if (!root.classList.contains('tts-aktiv') || e.target.closest('a,button,input,summary')) return;
      if (window.getSelection()?.toString()) return;
      const el = e.target.closest(BLOCK);
      if (!el || !root.contains(el)) return;
      const idx = [...root.querySelectorAll(BLOCK)].indexOf(el);
      if (idx >= 0) playFrom(type, id, part, idx);
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [type, id, part]);
}

export function ListenButton({ type, id, part = null, label = 'Anhören', className = 'btn ghost sm' }) {
  const t = useTts();
  if (!ttsSupported) return null;
  const key = `${type}:${id}`;
  const here = t.srcKey === key && (part == null || t.part === part);
  const playing = here && t.playing;
  return (
    <button className={className} onClick={() => (here ? toggle() : play(type, id, part, part == null ? null : 0))}
      title={playing ? 'Vorlesen pausieren' : 'Als Hörbuch vorlesen'}>
      <Icon name={playing ? 'pause' : 'headphones'} size={16} /> {playing ? 'Pause' : here ? 'Weiter anhören' : label}
    </button>
  );
}

const SLEEP = [[null, 'Aus'], [15, '15 min'], [30, '30 min'], [60, '60 min'], ['kapitel', 'Kapitelende']];

export default function Player() {
  const t = useTts();
  const [open, setOpen] = useState(false);
  useEffect(() => { restaurieren(); }, []);
  useEffect(() => {
    document.body.classList.toggle('has-player', !!t.src);
  }, [!!t.src]);
  if (!t.src) return null;
  const part = t.src.parts[t.part];
  const progress = t.segs.length ? t.seg / t.segs.length : 0;
  const voices = germanVoices();
  const rate = t.settings.rate;
  const nextRate = RATES[(RATES.indexOf(rate) + 1) % RATES.length] || 1;
  const sleepLeft = t.sleepUntil ? Math.max(0, Math.ceil((t.sleepUntil - Date.now()) / 60000)) : 0;
  return (
    <div className={`player ${open ? 'open' : ''}`} style={{ '--c': t.src.farbe || 'var(--accent)' }} role="region" aria-label="Hörbuch">
      <div className="player-row">
        <button className="player-play" onClick={toggle} aria-label={t.playing ? 'Pause' : 'Abspielen'}>
          <Icon name={t.playing ? 'pause' : 'play'} size={22} />
        </button>
        <button className="player-title" onClick={() => navigate(part.route)} title="Zum Text (mitlesen)">
          <small>{t.src.icon} {t.src.titel}{t.src.parts.length > 1 ? ` · ${t.part + 1}/${t.src.parts.length}` : ''}</small>
          <strong>{part.titel}</strong>
        </button>
        <button className="icon-btn sm hide-xs" onClick={() => skipSentence(-1)} aria-label="Satz zurück" title="Satz zurück"><Icon name="rew" size={18} /></button>
        <button className="icon-btn sm" onClick={() => skipSection(1)} aria-label="Nächster Abschnitt" title="Nächster Abschnitt"><Icon name="skipF" size={18} /></button>
        <button className="icon-btn sm" onClick={() => setOpen(!open)} aria-label="Mehr Steuerung" aria-expanded={open}><Icon name={open ? 'chevD' : 'chevU'} size={18} /></button>
        <button className="icon-btn sm" onClick={stop} aria-label="Hörbuch schließen" title="Schließen"><Icon name="x" size={18} /></button>
      </div>
      <Bar value={progress} height={4} color={t.src.farbe} />
      {t.fehler && <p className="player-err small">{t.fehler}</p>}
      {open && (
        <div className="player-more">
          <div className="player-controls">
            <button className="icon-btn" onClick={() => skipSection(-1)} title="Abschnitt zurück"><Icon name="skipB" /></button>
            <button className="icon-btn" onClick={() => skipSentence(-1)} title="Satz zurück"><Icon name="rew" /></button>
            <button className="player-play big" onClick={toggle}><Icon name={t.playing ? 'pause' : 'play'} size={26} /></button>
            <button className="icon-btn" onClick={() => skipSentence(1)} title="Satz vor"><Icon name="fwd" /></button>
            <button className="icon-btn" onClick={() => skipSection(1)} title="Nächster Abschnitt"><Icon name="skipF" /></button>
            <button className="btn ghost sm rate" onClick={() => setSetting('rate', nextRate)} title="Tempo">{String(rate).replace('.', ',')}×</button>
          </div>
          <p className="muted small center-text">Absatz {Math.min(t.seg + 1, t.segs.length)} von {t.segs.length} · noch ca. {restMinuten(t)} min in diesem Teil</p>
          <label className="player-field">
            <span>Tempo {String(rate).replace('.', ',')}×</span>
            <input type="range" min="0.6" max="2" step="0.05" value={rate} onChange={(e) => setSetting('rate', Number(e.target.value))} />
          </label>
          <label className="player-field">
            <span>Stimme</span>
            {voices.length ? (
              <select value={t.settings.voiceURI} onChange={(e) => setSetting('voiceURI', e.target.value)}>
                <option value="">Automatisch (beste deutsche Stimme)</option>
                {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang}){v.localService ? '' : ' · online'}</option>)}
              </select>
            ) : <small className="muted">Keine deutsche Stimme gefunden – in den Geräteeinstellungen unter „Sprachausgabe“ eine deutsche Stimme installieren.</small>}
          </label>
          <div className="player-field">
            <span>Sleep-Timer{sleepLeft ? ` (noch ${sleepLeft} min)` : ''}</span>
            <div className="seg">
              {SLEEP.map(([v, l]) => <button key={l} className={t.sleep === v ? 'active' : ''} onClick={() => setSleep(v)}>{l}</button>)}
            </div>
          </div>
          <div className="player-opts">
            <label><input type="checkbox" checked={t.settings.follow} onChange={(e) => setSetting('follow', e.target.checked)} /> Mitlesen: Text folgt der Stimme</label>
            <label><input type="checkbox" checked={t.settings.weiter} onChange={(e) => setSetting('weiter', e.target.checked)} /> Danach nächstes Skript (Lernreihenfolge)</label>
            <label><input type="checkbox" checked={t.settings.markRead} onChange={(e) => setSetting('markRead', e.target.checked)} /> Fertig gehörte Kapitel als gelesen markieren</label>
            <label><input type="checkbox" checked={t.settings.wake} onChange={(e) => setSetting('wake', e.target.checked)} /> Bildschirm beim Hören wach halten</label>
          </div>
          <p className="muted small">Tipp: Während der Wiedergabe auf einen Absatz im Text tippen, um dort weiterzuhören.</p>
        </div>
      )}
    </div>
  );
}

export const hoerMinuten = (type, id) => {
  const s = getSource(type, id);
  return s ? Math.max(1, Math.round(s.zeichen / 14 / 60)) : 0;
};
