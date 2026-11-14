import { useEffect, useState } from 'react';
import { SOCIAL } from '../lib/social';

const NAV = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'stack', label: 'Stack' },
    { id: 'contact', label: 'Contact' },
];

/* Floating glass pill. On phones the section links move into a menu panel. */
export function TopBar({ theme, onToggle }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = e => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <header className={`topbar${scrolled ? ' scrolled' : ''}${open ? ' menu-open' : ''}`}>
            <div className="topbar-inner">
                <a href="#top" className="brand" aria-label="Arvee Avena, back to top" onClick={() => setOpen(false)}>
                    <img className="brand-mark" src="/picture-256.webp" width="30" height="30" alt="" />
                    <span className="brand-name">Arvee Avena</span>
                </a>
                <nav className="topnav" aria-label="Sections">
                    {NAV.map(n => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
                </nav>
                <div className="top-social">
                    {SOCIAL.map(s => (
                        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer me"
                            className={`soc soc-${s.name.toLowerCase()}`} aria-label={`Arvee Avena on ${s.name}`} title={s.name}>
                            {s.icon}
                        </a>
                    ))}
                </div>
                <button
                    className="theme-btn"
                    onClick={onToggle}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    {isDark ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                        </svg>
                    )}
                </button>
                <button
                    className="menu-btn"
                    onClick={() => setOpen(v => !v)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                >
                    <span className="burger" aria-hidden="true"><i /><i /></span>
                </button>
            </div>
            {/* Always mounted so it can animate out; inert + aria-hidden while closed. */}
            <div className="menu-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
            <nav id="mobile-menu" className="mobile-menu" aria-label="Sections" aria-hidden={!open} inert={!open}>
                {NAV.map((n, i) => (
                    <a key={n.id} href={`#${n.id}`} style={{ '--i': i }} onClick={() => setOpen(false)}>
                        {n.label}
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </a>
                ))}
            </nav>
        </header>
    );
}
