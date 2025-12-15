import { Link } from 'react-router-dom';
import CasinoHeader from '@/components/casino/CasinoHeader';
import DailyBonus from '@/components/casino/DailyBonus';
import PlayerStats from '@/components/casino/PlayerStats';
import GameHistory from '@/components/casino/GameHistory';
import Challenges from '@/components/casino/Challenges';
import ProfilePanel from '@/components/casino/ProfilePanel';
import { useCasino } from '@/contexts/CasinoContext';
import { Button } from '@/components/ui/button';
import { Spade, Club, Diamond, Heart, RotateCcw } from 'lucide-react';

const Index = () => {
  const { chips, resetChips } = useCasino();

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <Spade className="w-8 h-8 text-foreground" />
            <Heart className="w-8 h-8 text-casino-red" />
            <Diamond className="w-8 h-8 text-casino-red" />
            <Club className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-display text-primary vegas-text-glow mb-4">
            Vegas Royale
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Welcome to the most exclusive casino in town. Choose your game and try your luck!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Column - Daily Bonus & Profile */}
          <div className="space-y-4">
            <DailyBonus />
            <ProfilePanel />
          </div>

          {/* Center Column - Games */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-xl text-primary mb-4 text-center">Choose Your Game</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Slot Machine Card */}
              <Link
                to="/slots"
                className="group relative bg-card border border-primary/30 rounded-xl p-4 hover:border-primary/60 transition-all hover:vegas-glow"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 flex items-center justify-center text-2xl mb-2">
                    🎰
                  </div>
                  <h3 className="font-display text-foreground group-hover:text-primary transition-colors">
                    Slots
                  </h3>
                  <p className="text-xs text-muted-foreground">Max 10x</p>
                </div>
              </Link>

              {/* Blackjack Card */}
              <Link
                to="/blackjack"
                className="group relative bg-card border border-primary/30 rounded-xl p-4 hover:border-primary/60 transition-all hover:vegas-glow"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/20 flex items-center justify-center text-2xl mb-2">
                    🃏
                  </div>
                  <h3 className="font-display text-foreground group-hover:text-primary transition-colors">
                    Blackjack
                  </h3>
                  <p className="text-xs text-muted-foreground">Pays 3:2</p>
                </div>
              </Link>

              {/* Poker Card */}
              <Link
                to="/poker"
                className="group relative bg-card border border-primary/30 rounded-xl p-4 hover:border-primary/60 transition-all hover:vegas-glow"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-casino-red/20 flex items-center justify-center text-2xl mb-2">
                    🂡
                  </div>
                  <h3 className="font-display text-foreground group-hover:text-primary transition-colors">
                    Poker
                  </h3>
                  <p className="text-xs text-muted-foreground">Royal 250x</p>
                </div>
              </Link>

              {/* Roulette Card */}
              <Link
                to="/roulette"
                className="group relative bg-card border border-primary/30 rounded-xl p-4 hover:border-primary/60 transition-all hover:vegas-glow"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 flex items-center justify-center text-2xl mb-2">
                    🎡
                  </div>
                  <h3 className="font-display text-foreground group-hover:text-primary transition-colors">
                    Roulette
                  </h3>
                  <p className="text-xs text-muted-foreground">Straight 35x</p>
                </div>
              </Link>
            </div>

            {/* Balance Display */}
            <div className="mt-4 bg-card/50 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-3xl font-display text-primary vegas-text-glow">{chips.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">chips</p>
              {chips < 50 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetChips}
                  className="mt-2 border-primary/30 hover:border-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to 1,000
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Challenges */}
          <div className="space-y-4">
            <PlayerStats />
            <Challenges />
            <GameHistory />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground">
        <p>🎲 Play responsibly. This is a game for entertainment only.</p>
      </footer>
    </div>
  );
};

export default Index;
