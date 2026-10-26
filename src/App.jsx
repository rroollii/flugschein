import React, { useEffect, useState } from 'react';
import { useRoute, Icon, navigate } from './ui.jsx';
import { useAppState, C, isStorageOk, dueCards } from './store.js';
import Dashboard from './pages/Dashboard.jsx';
import Ausbildung from './pages/Ausbildung.jsx';
import Lernplan from './pages/Lernplan.jsx';
import Skripte from './pages/Skripte.jsx';
import Fragen from './pages/Fragen.jsx';
import Karteikasten from './pages/Karteikasten.jsx';
import Statistik from './pages/Statistik.jsx';
import Suche from './pages/Suche.jsx';
import Glossar from './pages/Glossar.jsx';
import Dokumente from './pages/Dokumente.jsx';
import Daten from './pages/Daten.jsx';
import Zusatz from './pages/Zusatz.jsx';
import Bibliothek from './pages/Bibliothek.jsx';
import Player from './Player.jsx';
import Lernkarten from './pages/Lernkarten.jsx';
import Funk from './pages/Funk.jsx';
import Lpe from './pages/Lpe.jsx';
import Checklisten from './pages/Checklisten.jsx';
import Sync from './pages/Sync.jsx';

const NAV = [
  { id: '', label: 'Übersicht', icon: 'home' },
  { id: 'bibliothek', label: 'Lernunterlagen', icon: 'library' },
  { id: 'ausbildung', label: 'Ausbildung', icon: 'plane' },
  { id: 'lernplan', label: 'Lernplan', icon: 'calendar' },
  { id: 'skripte', label: 'Skripte', icon: 'book' },
  { id: 'fragen', label: 'Übungsfragen', icon: 'quiz' },
  { id: 'karteikasten', label: 'Karteikasten', icon: 'cards' },
  { id: 'lernkarten', label: 'Lernkarten', icon: 'flip' },
  { id: 'funk', label: 'Funktraining', icon: 'radio' },
  { id: 'lpe', label: 'LPE-Training', icon: 'mic' },
  { id: 'buchstabiertrainer', label: 'Buchstabiertrainer', icon: 'spell', href: './buchstabiertrainer/' },
  { id: 'checklisten', label: 'Checklisten', icon: 'log' },
  { id: 'zusatz', label: 'Zusatzausbildungen', icon: 'star' },
  { id: 'statistik', label: 'Statistik', icon: 'chart' },
  { id: 'glossar', label: 'Glossar', icon: 'glossary' },
  { id: 'dokumente', label: 'Dokumente', icon: 'doc' },
  { id: 'sync', label: 'Geräte-Sync', icon: 'repeat' },
  { id: 'daten', label: 'Daten & Einstellungen', icon: 'settings' },
];
const MOBILE = ['', 'bibliothek', 'ausbildung', 'fragen'];
const LERNEN = ['bibliothek', 'skripte', 'zusatz', 'dokumente', 'glossar'];
const KURZ = { 'Übungsfragen': 'Fragen', Lernunterlagen: 'Lernen' };

const PAGES = {
  '': Dashboard, ausbildung: Ausbildung, lernplan: Lernplan, skripte: Skripte, fragen: Fragen, karteikasten: Karteikasten,
  statistik: Statistik, suche: Suche, glossar: Glossar, dokumente: Dokumente, daten: Daten, zusatz: Zusatz, bibliothek: Bibliothek,
  lernkarten: Lernkarten, funk: Funk, lpe: Lpe, checklisten: Checklisten, sync: Sync,
};

function useTheme(theme) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#0b1526' : '#1565c0');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

export default function App() {
  const route = useRoute();
  const s = useAppState();
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState('');
  useTheme(s.settings.theme);
  const page = route.parts[0] || '';
  const Page = PAGES[page] || Dashboard;
  const due = dueCards(s).due.length;

  useEffect(() => {
    setDrawer(false);
    const [pg, , a2, a3] = route.parts;
    const anker = (pg === 'skripte' || pg === 'zusatz') ? a3 : (pg === 'dokumente' || pg === 'ausbildung') ? a2 : null;
    if (!anker) window.scrollTo(0, 0);
  }, [route.raw]);
  useEffect(() => {
    if (page === 'suche') setQ(route.query.q || '');
  }, [page, route.query.q]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/suche?q=${encodeURIComponent(q)}`);
  };

  const navLink = (n) => (
    <a key={n.id} href={n.href || `#/${n.id}`} className={`nav-link ${page === n.id ? 'active' : ''}`}>
      <Icon name={n.icon} />
      <span>{n.label}</span>
      {n.id === 'karteikasten' && due > 0 && <span className="nav-badge">{due}</span>}
    </a>
  );

  return (
    <div className="app">
      <aside className={`sidebar ${drawer ? 'open' : ''}`}>
        <a className="brand" href="#/">
          <span className="brand-logo"><Icon name="plane" size={22} /></span>
          <span>
            <strong>Flugschein</strong>
            <small>PPL(A) · {C.meta.schule.replace(/^Flugschule\s*/i, 'FS ')}</small>
          </span>
        </a>
        <nav>{NAV.map(navLink)}</nav>
        <div className="sidebar-foot muted">
          Stand Inhalte: {new Date(C.meta.erstellt).toLocaleDateString('de-AT')}
          {C.meta.land ? ` · ${C.meta.land}` : ''}
        </div>
      </aside>
      {drawer && <div className="scrim" onClick={() => setDrawer(false)} />}
      <div className="main-col">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setDrawer(true)} aria-label="Menü öffnen"><Icon name="menu" /></button>
          <a className="brand only-mobile" href="#/"><span className="brand-logo sm"><Icon name="plane" size={16} /></span><strong>Flugschein</strong></a>
          <form className="search" onSubmit={submitSearch} role="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suche in Skripten, Fragen, Glossar …" aria-label="Suche" />
          </form>
        </header>
        {!isStorageOk() && <div className="alert warn">Der Browser erlaubt kein lokales Speichern – Fortschritt geht beim Schließen verloren. Bitte regelmäßig exportieren.</div>}
        <main className="content" key={page}>
          <Page route={route} />
        </main>
      </div>
      <Player />
      <nav className="bottom-nav">
        {NAV.filter((n) => MOBILE.includes(n.id)).map((n) => (
          <a key={n.id} href={`#/${n.id}`} className={page === n.id || (n.id === 'bibliothek' && LERNEN.includes(page)) ? 'active' : ''}>
            <Icon name={n.icon} />
            <span>{KURZ[n.label] || n.label}</span>
          </a>
        ))}
        <button onClick={() => setDrawer(true)} className={!MOBILE.includes(page) && !LERNEN.includes(page) ? 'active' : ''}>
          <Icon name="more" />
          <span>Mehr</span>
        </button>
      </nav>
    </div>
  );
}
