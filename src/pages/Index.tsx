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
            Welcome to the most exclusive casino in town. Try your luck at the slots or challenge the dealer at blackjack.
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {/* Slot Machine Card */}
          <Link
            to="/slots"
            className="group relative bg-card border border-primary/30 rounded-2xl p-8 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-4 right-4 px-3 py-1 gold-gradient rounded-full">
              <span className="text-xs font-display text-primary-foreground">HOT</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-3xl">
                🎰
              </div>
              <div>
                <h2 className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">
                  Slot Machine
                </h2>
                <p className="text-sm text-muted-foreground">4-Wheel Lucky Cards</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Spin the reels and match playing cards for big wins. Hit 4 of a kind for the jackpot!
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Max Win:</span>
              <span className="text-primary font-semibold">10x Bet</span>
            </div>
          </Link>

          {/* Blackjack Card */}
          <Link
            to="/blackjack"
            className="group relative bg-card border border-primary/30 rounded-2xl p-8 hover:border-primary/60 transition-all hover:vegas-glow"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-casino-green rounded-full">
              <span className="text-xs font-display text-foreground">CLASSIC</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center text-3xl">
                🃏
              </div>
              <div>
                <h2 className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">
                  Blackjack
                </h2>
                <p className="text-sm text-muted-foreground">Beat the Dealer</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Get as close to 21 as possible without going bust. Hit, stand, or double down!
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Blackjack Pays:</span>
              <span className="text-primary font-semibold">3:2</span>
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
