import { Link, useLocation } from 'react-router-dom';
import ChipDisplay from './ChipDisplay';
import DailyBonus from './DailyBonus';
import SoundToggle from './SoundToggle';
import ThemeSelector from './ThemeSelector';
import { Home, Spade } from 'lucide-react';

const CasinoHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center group-hover:animate-glow-pulse transition-all">
            <Spade className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl text-primary vegas-text-glow hidden sm:block">
            Vegas Royale
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <DailyBonus compact />
          
          <div className="flex items-center gap-1">
            <SoundToggle />
            <ThemeSelector />
          </div>
          
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block">Lobby</span>
            </Link>
          )}
          
          <ChipDisplay />
        </div>
      </div>
    </header>
  );
};

export default CasinoHeader;
