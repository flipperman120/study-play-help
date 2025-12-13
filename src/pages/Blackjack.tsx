import CasinoHeader from '@/components/casino/CasinoHeader';
import BlackjackGame from '@/components/blackjack/BlackjackGame';

const Blackjack = () => {
  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-primary vegas-text-glow mb-2">
            Blackjack
          </h1>
          <p className="text-muted-foreground">
            Get 21 or beat the dealer!
          </p>
        </div>

        <BlackjackGame />
      </main>
    </div>
  );
};

export default Blackjack;
