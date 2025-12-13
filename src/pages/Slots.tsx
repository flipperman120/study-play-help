import CasinoHeader from '@/components/casino/CasinoHeader';
import SlotMachine from '@/components/slot/SlotMachine';

const Slots = () => {
  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-primary vegas-text-glow mb-2">
            Lucky Cards Slots
          </h1>
          <p className="text-muted-foreground">
            Match the cards to win big!
          </p>
        </div>

        <SlotMachine />
      </main>
    </div>
  );
};

export default Slots;
