import CasinoHeader from '@/components/casino/CasinoHeader';
import RouletteGame from '@/components/roulette/RouletteGame';

const Roulette = () => {
  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-primary vegas-text-glow mb-2">
            European Roulette
          </h1>
          <p className="text-muted-foreground">
            Place your bets and watch the wheel spin
          </p>
        </div>

        <RouletteGame />
      </main>
    </div>
  );
};

export default Roulette;
