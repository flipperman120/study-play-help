import { useCasino } from '@/contexts/CasinoContext';
import { Coins } from 'lucide-react';

const ChipDisplay = () => {
  const { chips } = useCasino();

  return (
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 vegas-glow">
      <Coins className="w-5 h-5 text-primary" />
      <span className="font-display text-lg text-primary font-semibold">
        {chips.toLocaleString()}
      </span>
    </div>
  );
};

export default ChipDisplay;
