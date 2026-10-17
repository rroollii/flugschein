import React, { useEffect, useState } from 'react';
import { Icon, Bar, navigate } from './ui.jsx';
import {
  useTts, hoerbar, BLOCK, RATES, play, toggle, stop, skipSentence, skipSection, setSetting, setSleep, germanVoices,
  restaurieren, restMinuten, playFrom, getSource, quelleFuerTeil,
} from './tts.js';
import { useAudio, dialogClip, playClip, stopClip } from './audio.js';
import { getTts, pause } from './tts.js';

const GRUND = {
  geaendert: 'Dieser Teil wurde inhaltlich geändert – die natürliche Aufnahme wird neu erstellt. Bis dahin liest die Gerätestimme.',
  fehlt: 'Für diesen Teil gibt es keine natürliche Aufnahme – es liest die Gerätestimme.',
  netz: 'Aufnahme gerade nicht erreichbar (offline?) – es liest die Gerätestimme. Tipp: Unter Lernunterlagen „Offline verfügbar machen“.',
  laden: 'Aufnahmen werden geladen …',
};
export function StimmWahl({ compact = false }) {
  const t = useTts();
  const a = useAudio();
  const name = (s) => a.manifest?.stimmen?.[s]?.name;
  const opts = [['frau', `Frau${name('frau') ? ` · ${name('frau')}` : ''}`], ['mann', `Mann${name('mann') ? ` · ${name('mann')}` : ''}`], ['geraet', 'Gerätestimme']];
  return (
    <div className={`seg stimm-wahl ${compact ? 'sm' : ''}`} role="radiogroup" aria-label="Stimme">
      {opts.map(([v, l]) => (
        <button key={v} role="radio" aria-checked={t.settings.stimme === v} className={t.settings.stimme === v ? 'active' : ''}
          disabled={v !== 'geraet' && a.status === 'fehlt'} onClick={() => setSetting('stimme', v)}>{l}</button>
      ))}
    </div>
  );
}

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

// Englische Funk-Dialoge in Codeblöcken: Abspielknopf + Mitlesen Zeile für Zeile (Zeitmarken aus dem Manifest).
// Zeilen-Zählung wie im Generator: jede Zeile „Rolle: Text“ beginnt einen neuen Funkspruch.
const ROLLE = /^\s*([A-Za-zÄÖÜäöü][\w-]{0,11}(?:\s*\([^)]*\))?)\s*:\s+(.*)$/u;
export function useFunkDialoge(ref, srcKey, partId) {
  const a = useAudio();
  const t = useTts();
  const stimme = t.settings.stimme === 'mann' ? 'mann' : 'frau';
  useEffect(() => {
    const root = ref.current;
    if (!root || !a.manifest || partId == null) return undefined;
    const knoepfe = [];
    root.querySelectorAll('pre').forEach((pre, n) => {
      const c = dialogClip(srcKey, partId, n, stimme);
      if (!c) return;
      if (!pre.dataset.dlg) {
        const code = pre.querySelector('code') || pre;
        const lines = code.textContent.replace(/\n$/, '').split('\n');
        let z = -1;
        code.textContent = '';
        lines.forEach((line, i) => {
          if (line.trim() && ROLLE.test(line)) z++;
          const sp = document.createElement('span');
          sp.className = 'dlg-line';
          if (z >= 0 && line.trim()) sp.dataset.z = String(z);
          sp.textContent = line;
          code.append(sp);
          if (i < lines.length - 1) code.append('\n');
        });
        pre.dataset.dlg = '1';
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn ghost sm dlg-btn';
      const label = () => { btn.textContent = `▶ Dialog anhören (${a.manifest.stimmen?.[stimme]?.name || stimme} als Pilot)`; delete btn.dataset.on; pre.classList.remove('dlg-aktiv'); pre.querySelectorAll('.dlg-cur').forEach((s) => s.classList.remove('dlg-cur')); };
      label();
      btn.onclick = async () => {
        if (btn.dataset.on) { stopClip(); return; }
        if (getTts().playing) pause();
        stopClip();
        btn.dataset.on = '1';
        btn.textContent = '■ Dialog stoppen';
        pre.classList.add('dlg-aktiv');
        let cur = -1;
        await playClip(c, {
          rate: getTts().settings.rate,
          onTime: (ms) => {
            let k = 0;
            while (k + 1 < c.t.length && c.t[k + 1] <= ms + 60) k++;
            if (k === cur) return;
            cur = k;
            pre.querySelectorAll('.dlg-line').forEach((s) => s.classList.toggle('dlg-cur', s.dataset.z === String(k)));
          },
        });
        label();
      };
      pre.before(btn);
      knoepfe.push(btn);
    });
    return () => { if (knoepfe.some((b) => b.dataset.on)) stopClip(); knoepfe.forEach((b) => b.remove()); };
  }, [a.manifest, srcKey, partId, stimme]);
}

export function ListenButton({ type, id, part = null, label = 'Anhören', className = 'btn ghost sm' }) {
  const t = useTts();
  if (!hoerbar) return null;
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
  const a = useAudio();
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
  const q = t.playing && t.modus ? { modus: t.modus, grund: t.audioGrund } : quelleFuerTeil(t);
  const sprecher = q?.modus === 'audio' ? a.manifest?.stimmen?.[t.settings.stimme]?.name || (t.settings.stimme === 'mann' ? 'Mann' : 'Frau') : 'Gerätestimme';
  return (
    <div className={`player ${open ? 'open' : ''}`} style={{ '--c': t.src.farbe || 'var(--accent)' }} role="region" aria-label="Hörbuch">
      <div className="player-row">
        <button className="player-play" onClick={toggle} aria-label={t.playing ? 'Pause' : 'Abspielen'}>
          <Icon name={t.playing ? 'pause' : 'play'} size={22} />
        </button>
        <button className="player-title" onClick={() => navigate(part.route)} title="Zum Text (mitlesen)">
          <small>{t.src.icon} {t.src.titel}{t.src.parts.length > 1 ? ` · ${t.part + 1}/${t.src.parts.length}` : ''} · <span className={`stimm-badge ${q?.modus === 'audio' ? 'natur' : ''}`}>{sprecher}</span></small>
          <strong>{part.titel}</strong>
        </button>
        <button className="icon-btn sm hide-xs" onClick={() => skipSentence(-1)} aria-label="Satz zurück" title="Satz zurück"><Icon name="rew" size={18} /></button>
        <button className="icon-btn sm" onClick={() => skipSection(1)} aria-label="Nächster Abschnitt" title="Nächster Abschnitt"><Icon name="skipF" size={18} /></button>
        <button className="icon-btn sm" onClick={() => setOpen(!open)} aria-label="Mehr Steuerung" aria-expanded={open}><Icon name={open ? 'chevD' : 'chevU'} size={18} /></button>
        <button className="icon-btn sm" onClick={stop} aria-label="Hörbuch schließen" title="Schließen"><Icon name="x" size={18} /></button>
      </div>
      <Bar value={progress} height={4} color={t.src.farbe} />
      {t.fehler && <p className="player-err small">{t.fehler}</p>}
      {!t.fehler && open && q?.grund && GRUND[q.grund] && <p className="player-hint small">{GRUND[q.grund]}</p>}
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
          <div className="player-field">
            <span>Stimme</span>
            <StimmWahl />
            <small className="muted">
              {a.status === 'fehlt' ? 'Natürliche Aufnahmen gerade nicht erreichbar – es liest die Gerätestimme.'
                : 'Frau und Mann sind natürliche, vorab aufgenommene Stimmen (Internet nötig oder vorher offline speichern). Die Gerätestimme springt ein, wenn es für einen Teil keine passende Aufnahme gibt.'}
            </small>
          </div>
          <label className="player-field">
            <span>{t.settings.stimme === 'geraet' ? 'Gerätestimme' : 'Gerätestimme (Ersatz)'}</span>
            {voices.length ? (
              <select value={t.settings.voiceURI} onChange={(e) => setSetting('voiceURI', e.target.value)}>
                <option value="">Automatisch (beste deutsche Stimme)</option>
                {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang}){v.localService ? '' : ' · online'}</option>)}
              </select>
            ) : <small className="muted">Keine deutsche Gerätestimme gefunden{t.settings.stimme === 'geraet' ? ' – in den Geräteeinstellungen unter „Sprachausgabe“ eine deutsche Stimme installieren' : ''}.</small>}
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
