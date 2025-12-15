import { useCasino } from '@/contexts/CasinoContext';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatTime = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};

interface DailyBonusProps {
  compact?: boolean;
}

const DailyBonus = ({ compact = false }: DailyBonusProps) => {
  const { dailyBonusAvailable, dailyBonusCooldown, claimDailyBonus } = useCasino();

  if (compact) {
    return (
      <Button
        onClick={claimDailyBonus}
        disabled={!dailyBonusAvailable}
        size="sm"
        className={cn(
          'gap-2',
          dailyBonusAvailable 
            ? 'gold-gradient text-primary-foreground animate-pulse' 
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Gift className="w-4 h-4" />
        {dailyBonusAvailable ? '+250' : formatTime(dailyBonusCooldown)}
      </Button>
    );
  }

  return (
    <div className={cn(
      'bg-card border rounded-xl p-4 text-center',
      dailyBonusAvailable 
        ? 'border-primary vegas-glow' 
        : 'border-primary/30'
    )}>
      <Gift className={cn(
        'w-8 h-8 mx-auto mb-2',
        dailyBonusAvailable ? 'text-primary animate-bounce' : 'text-muted-foreground'
      )} />
      <h3 className="font-display text-lg text-foreground mb-1">Daily Bonus</h3>
      {dailyBonusAvailable ? (
        <>
          <p className="text-2xl font-display text-primary mb-3">+250 chips</p>
          <Button 
            onClick={claimDailyBonus}
            className="gold-gradient text-primary-foreground w-full"
          >
            Claim Now!
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-2">Available in</p>
          <p className="text-xl font-display text-primary">{formatTime(dailyBonusCooldown)}</p>
        </>
      )}
    </div>
  );
};

export default DailyBonus;
