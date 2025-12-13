import { Button } from '@/components/ui/button';
import { useCasino } from '@/contexts/CasinoContext';
import { soundManager } from '@/utils/sounds';
import { Minus, Plus } from 'lucide-react';

interface BetSelectorProps {
  bet: number;
  onBetChange: (bet: number) => void;
  disabled?: boolean;
  minBet?: number;
  maxBet?: number;
}

const BetSelector = ({
  bet,
  onBetChange,
  disabled = false,
  minBet = 10,
  maxBet = 500,
}: BetSelectorProps) => {
  const { chips } = useCasino();
  const betOptions = [10, 25, 50, 100, 250, 500];

  const adjustBet = (amount: number) => {
    const newBet = Math.max(minBet, Math.min(maxBet, Math.min(chips, bet + amount)));
    if (newBet !== bet) {
      soundManager.chipPlace();
      onBetChange(newBet);
    }
  };

  const setBet = (amount: number) => {
    if (amount <= chips) {
      soundManager.chipPlace();
      onBetChange(amount);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-muted-foreground uppercase tracking-wider">Your Bet</div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustBet(-10)}
          disabled={disabled || bet <= minBet}
          className="border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="w-24 text-center">
          <span className="text-3xl font-display text-primary vegas-text-glow">
            {bet}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustBet(10)}
          disabled={disabled || bet >= Math.min(maxBet, chips)}
          className="border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {betOptions.map((amount) => (
          <Button
            key={amount}
            variant={bet === amount ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(amount)}
            disabled={disabled || amount > chips}
            className={`min-w-[50px] ${
              bet === amount
                ? 'gold-gradient text-primary-foreground'
                : 'border-primary/30 hover:border-primary hover:bg-primary/10'
            }`}
          >
            {amount}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BetSelector;
