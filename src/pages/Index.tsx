import { Link } from 'react-router-dom';
import CasinoHeader from '@/components/casino/CasinoHeader';
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
        <div className="text-center mb-12">
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

        {/* Game Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
          {/* Slot Machine Card */}
          <Link
            to="/slots"
            className="group relative bg-card border border-primary/30 rounded-2xl p-5 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 gold-gradient rounded-full">
              <span className="text-[10px] font-display text-primary-foreground">HOT</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
                🎰
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
                  Slots
                </h2>
                <p className="text-[10px] text-muted-foreground">4-Wheel Cards</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Spin and match cards for wins!
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Max:</span>
              <span className="text-primary font-semibold">10x</span>
            </div>
          </Link>

          {/* Blackjack Card */}
          <Link
            to="/blackjack"
            className="group relative bg-card border border-primary/30 rounded-2xl p-5 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-casino-green rounded-full">
              <span className="text-[10px] font-display text-foreground">CLASSIC</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-xl">
                🃏
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
                  Blackjack
                </h2>
                <p className="text-[10px] text-muted-foreground">Beat the Dealer</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get close to 21 without bust!
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pays:</span>
              <span className="text-primary font-semibold">3:2</span>
            </div>
          </Link>

          {/* Poker Card */}
          <Link
            to="/poker"
            className="group relative bg-card border border-primary/30 rounded-2xl p-5 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-casino-red rounded-full">
              <span className="text-[10px] font-display text-foreground">NEW</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-casino-red/20 flex items-center justify-center text-xl">
                🂡
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
                  Poker
                </h2>
                <p className="text-[10px] text-muted-foreground">Texas Hold'em</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Best 5-card hand wins!
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Royal:</span>
              <span className="text-primary font-semibold">250x</span>
            </div>
          </Link>

          {/* Roulette Card */}
          <Link
            to="/roulette"
            className="group relative bg-card border border-primary/30 rounded-2xl p-5 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary rounded-full">
              <span className="text-[10px] font-display text-primary-foreground">NEW</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
                🎡
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
                  Roulette
                </h2>
                <p className="text-[10px] text-muted-foreground">European Style</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Spin the wheel to win!
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Straight:</span>
              <span className="text-primary font-semibold">35x</span>
            </div>
          </Link>
        </div>

        {/* Chips Info */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 bg-card/50 border border-primary/20 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-4xl font-display text-primary vegas-text-glow">{chips.toLocaleString()}</p>
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
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground">
        <p>🎲 Play responsibly. This is a game for entertainment only.</p>
      </footer>
    </div>
  );
};

export default Index;
