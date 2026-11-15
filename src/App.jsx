import { Analytics } from '@vercel/analytics/react';
import { useTheme } from './hooks/useTheme';
import { TopBar } from './components/TopBar';
import { ProfileHeader } from './components/ProfileHeader';
import { Work } from './components/Work';
import { TechStack } from './components/TechStack';
import { FooterGrid } from './components/FooterGrid';
import { PokeButton } from './components/PokeButton';
// Certifications (Gallery.jsx) stay hidden; files kept in /public/certificates/.

function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <Analytics />
      <TopBar theme={theme} onToggle={toggle} />

      <main className="page page-enter">
        <ProfileHeader />
        <Work />
        <TechStack />
        <FooterGrid />
      </main>

      <div className="poke-dock">
        <PokeButton />
      </div>
    </>
  );
}

export default App;
