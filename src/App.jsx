import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useTheme } from './hooks/useTheme';
import { TopBar } from './components/TopBar';
import { ProfileHeader } from './components/ProfileHeader';
import { Work } from './components/Work';
import { TechStack } from './components/TechStack';
import { Services } from './components/Services';
import { FAQ } from './components/FAQ';
import { FooterGrid } from './components/FooterGrid';
import { PokeButton } from './components/PokeButton';
// Certifications (Gallery.jsx) stay hidden; files kept in /public/certificates/.

function App() {
  const { theme, toggle } = useTheme();

  // Cards light up where the pointer is: CSS reads --mx/--my (see .glow-card).
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const onMove = e => {
      const card = e.target.closest?.('.work-card, .featured, .svc-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <Analytics />
      <TopBar theme={theme} onToggle={toggle} />

      <main className="page page-enter">
        <ProfileHeader />
        <TechStack />
        <Work />
        <Services />
        <FAQ />
        <FooterGrid />
      </main>

      <div className="poke-dock">
        <PokeButton />
      </div>
    </>
  );
}

export default App;
