import { useState, useEffect, useLayoutEffect } from 'react';

// The page is prerendered in light mode. An inline script in index.html sets
// data-theme from localStorage before first paint, so colors never flash; this
// hook starts at 'light' (matching the server HTML, so hydration is clean) and
// syncs to the real value before the browser paints.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useTheme() {
    const [theme, setTheme] = useState('light');
    const [ready, setReady] = useState(false);

    useIsoLayoutEffect(() => {
        let saved = null;
        try { saved = localStorage.getItem('portfolio-theme'); } catch { /* storage blocked */ }
        setTheme(saved || document.documentElement.getAttribute('data-theme') || 'light');
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('portfolio-theme', theme); } catch { /* storage blocked */ }
    }, [theme, ready]);

    const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

    return { theme, toggle };
}
