import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';

// ---------- Hash-Router (funktioniert auch über file://) ----------
const parse = () => {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const [p, q = ''] = h.split('?');
  return { parts: p.split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(q)), raw: h };
};
let route = parse();
const subs = new Set();
window.addEventListener('hashchange', () => {
  route = parse();
  subs.forEach((f) => f());
});
export const useRoute = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => route);
export const navigate = (to) => {
  location.hash = to.startsWith('#') ? to : '#' + to;
};

// ---------- Icons (Linien-Icons, inline) ----------
const P = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  plane: 'M2 16l20-6-2-3-7 2L8 3H6l3 7-5 1.5L2 9H1l1 4-1 3h1z',
  calendar: 'M3 6h18v15H3zM3 10h18M8 3v4M16 3v4',
  book: 'M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z',
  quiz: 'M12 22a10 10 0 110-20 10 10 0 010 20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01',
  cards: 'M4 7h12v13H4zM8 4h12v13',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  search: 'M11 19a8 8 0 110-16 8 8 0 010 16zM21 21l-4.3-4.3',
  glossary: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5zM4 19.5A2.5 2.5 0 006.5 22H20v-5',
  doc: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  log: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4',
  check: 'M5 13l4 4L19 7',
  x: 'M6 6l12 12M18 6L6 18',
  chevL: 'M15 18l-6-6 6-6',
  chevR: 'M9 18l6-6-6-6',
  chevD: 'M6 9l6 6 6-6',
  menu: 'M3 6h18M3 12h18M3 18h18',
  flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
  clock: 'M12 22a10 10 0 110-20 10 10 0 010 20zM12 6v6l4 2',
  fire: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4 3 7 7 7z',
  star: 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z',
  download: 'M12 3v12M7 10l5 5 5-5M4 21h16',
  upload: 'M12 21V9M7 14l5-5 5 5M4 3h16',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  plus: 'M12 5v14M5 12h14',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  sun: 'M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  target: 'M12 22a10 10 0 110-20 10 10 0 010 20zM12 18a6 6 0 110-12 6 6 0 010 12zM12 14a2 2 0 110-4 2 2 0 010 4z',
  repeat: 'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  edit: 'M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z',
  more: 'M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z',
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z',
  skipF: 'M5 5l10 7-10 7zM19 5v14',
  skipB: 'M19 19L9 12l10-7zM5 5v14',
  rew: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
  fwd: 'M13 17l5-5-5-5M6 17l5-5-5-5',
  headphones: 'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
  library: 'M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.6l3.8-1 3.2 15.5-3.8 1z',
  chevU: 'M18 15l-6-6-6 6',
  flip: 'M3 7h13v13H3zM8 4h13v13M7 12h5M7 15h3',
  mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3M8 21h8',
  spell: 'M3 19l4-14 4 14M4.5 14h5M14 5h4a3 3 0 010 6h-4zM14 11h4.5a3 3 0 010 6H14zM14 5v14',
  radio: 'M4 10h16v10H4zM8 10l9-6M8 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 14h4M13 17h4',
};
export function Icon({ name, size = 20, className = '', ...rest }) {
  return (
    <svg className={'ico ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[name] || P.doc} />
    </svg>
  );
}

// ---------- Fortschritt ----------
export function Ring({ value = 0, size = 92, stroke = 9, color = 'var(--accent)', label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ring-bg)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div className="ring-label">
        <strong>{label ?? `${Math.round(v * 100)}%`}</strong>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}
export function Bar({ value = 0, color, height = 8, marker }) {
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div className="bar" style={{ height }}>
      <div className="bar-fill" style={{ width: `${v * 100}%`, background: color }} />
      {marker != null && <div className="bar-marker" style={{ left: `${marker * 100}%` }} />}
    </div>
  );
}
export const pct = (v, d = 0) => `${(Math.max(0, v || 0) * 100).toFixed(d)} %`;

// ---------- Markdown-HTML mit internen Links ----------
export function Html({ html, className = '', scrollTo }) {
  const ref = useRef(null);
  useEffect(() => {
    if (scrollTo && ref.current) {
      const el = ref.current.querySelector(`[id="${CSS.escape(scrollTo)}"]`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
    }
  }, [scrollTo, html]);
  const onClick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') && !href.startsWith('#/')) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return <div ref={ref} className={'md ' + className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Check({ checked, onChange, children, sub, big }) {
  return (
    <label className={`check ${checked ? 'on' : ''} ${sub ? 'sub' : ''} ${big ? 'big' : ''}`}>
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      <span className="box"><Icon name="check" size={14} /></span>
      <span className="check-text">{children}</span>
    </label>
  );
}

export function Collapse({ title, children, open: o = false, right, className = '' }) {
  const [open, setOpen] = useState(o);
  return (
    <div className={`collapse ${open ? 'open' : ''} ${className}`}>
      <button className="collapse-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="collapse-title">{title}</div>
        {right}
        <Icon name="chevD" className="chev" />
      </button>
      {open && <div className="collapse-body">{children}</div>}
    </div>
  );
}

export const PageHead = ({ title, sub, children, icon }) => (
  <header className="page-head">
    <div>
      <h1>{icon && <span className="page-icon">{icon}</span>}{title}</h1>
      {sub && <p className="muted">{sub}</p>}
    </div>
    {children && <div className="page-actions">{children}</div>}
  </header>
);

export const Tabs = ({ tabs, active, onChange }) => (
  <div className="tabs" role="tablist">
    {tabs.map((t) => (
      <button key={t.id} role="tab" aria-selected={active === t.id} className={active === t.id ? 'active' : ''} onClick={() => onChange(t.id)}>
        {t.label}{t.badge ? <span className="badge">{t.badge}</span> : null}
      </button>
    ))}
  </div>
);

export function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const fmtDate = (iso) => (iso ? new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');
export const fmtH = (h) => {
  const m = Math.round(h * 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
};
export const FachChip = ({ fach, onClick, active, small }) =>
  fach ? (
    <button className={`chip ${active ? 'active' : ''} ${small ? 'small' : ''}`} style={{ '--c': fach.farbe }} onClick={onClick} type="button">
      <span>{fach.icon}</span> {fach.name}
    </button>
  ) : null;
