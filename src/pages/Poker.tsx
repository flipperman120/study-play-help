import CasinoHeader from '@/components/casino/CasinoHeader';
import PokerGame from '@/components/poker/PokerGame';

const Poker = () => {
  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-primary vegas-text-glow mb-2">
            Texas Hold'em
          </h1>
          <p className="text-muted-foreground">
            Beat the dealer with the best 5-card hand
          </p>
        </div>

        <PokerGame />
      </main>
    </div>
  );
};

export default Poker;
