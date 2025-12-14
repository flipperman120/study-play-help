import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type BetType = 
  | { type: 'straight'; number: number }
  | { type: 'red' }
  | { type: 'black' }
  | { type: 'odd' }
  | { type: 'even' }
  | { type: 'low' }
  | { type: 'high' }
  | { type: 'dozen'; dozen: 1 | 2 | 3 }
  | { type: 'column'; column: 1 | 2 | 3 };

interface BettingBoardProps {
  selectedBet: BetType | null;
  onSelectBet: (bet: BetType) => void;
  disabled: boolean;
}

const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
};

const BettingBoard = ({ selectedBet, onSelectBet, disabled }: BettingBoardProps) => {
  const isBetSelected = (bet: BetType): boolean => {
    if (!selectedBet) return false;
    if (bet.type !== selectedBet.type) return false;
    if (bet.type === 'straight' && selectedBet.type === 'straight') {
      return bet.number === selectedBet.number;
    }
    if (bet.type === 'dozen' && selectedBet.type === 'dozen') {
      return bet.dozen === selectedBet.dozen;
    }
    if (bet.type === 'column' && selectedBet.type === 'column') {
      return bet.column === selectedBet.column;
    }
    return true;
  };

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  
  return (
    <div className="bg-casino-felt border-4 border-casino-wood rounded-xl p-4 overflow-x-auto">
      <div className="min-w-[320px]">
        {/* Zero */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => onSelectBet({ type: 'straight', number: 0 })}
            disabled={disabled}
            className={cn(
              'w-12 h-10 rounded bg-casino-green text-foreground font-bold text-lg transition-all',
              'hover:ring-2 hover:ring-primary disabled:opacity-50',
              isBetSelected({ type: 'straight', number: 0 }) && 'ring-2 ring-primary scale-105'
            )}
          >
            0
          </button>
        </div>
        
        {/* Number grid 1-36 */}
        <div className="grid grid-cols-12 gap-1 mb-2">
          {numbers.slice(1).map((num) => {
            const color = getNumberColor(num);
            return (
              <button
                key={num}
                onClick={() => onSelectBet({ type: 'straight', number: num })}
                disabled={disabled}
                className={cn(
                  'w-full aspect-square rounded text-foreground font-bold text-sm transition-all',
                  'hover:ring-2 hover:ring-primary disabled:opacity-50',
                  color === 'red' && 'bg-casino-red',
                  color === 'black' && 'bg-background/80',
                  isBetSelected({ type: 'straight', number: num }) && 'ring-2 ring-primary scale-105'
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
        
        {/* Dozens */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          {([1, 2, 3] as const).map((dozen) => (
            <button
              key={dozen}
              onClick={() => onSelectBet({ type: 'dozen', dozen })}
              disabled={disabled}
              className={cn(
                'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-sm transition-all',
                'hover:border-primary disabled:opacity-50',
                isBetSelected({ type: 'dozen', dozen }) && 'border-primary bg-primary/20'
              )}
            >
              {dozen === 1 ? '1-12' : dozen === 2 ? '13-24' : '25-36'}
            </button>
          ))}
        </div>
        
        {/* Outside bets */}
        <div className="grid grid-cols-6 gap-1">
          <button
            onClick={() => onSelectBet({ type: 'low' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-xs transition-all',
              'hover:border-primary disabled:opacity-50',
              isBetSelected({ type: 'low' }) && 'border-primary bg-primary/20'
            )}
          >
            1-18
          </button>
          <button
            onClick={() => onSelectBet({ type: 'even' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-xs transition-all',
              'hover:border-primary disabled:opacity-50',
              isBetSelected({ type: 'even' }) && 'border-primary bg-primary/20'
            )}
          >
            EVEN
          </button>
          <button
            onClick={() => onSelectBet({ type: 'red' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-casino-red text-foreground font-semibold text-xs transition-all',
              'hover:ring-2 hover:ring-primary disabled:opacity-50',
              isBetSelected({ type: 'red' }) && 'ring-2 ring-primary'
            )}
          >
            RED
          </button>
          <button
            onClick={() => onSelectBet({ type: 'black' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-background/80 text-foreground font-semibold text-xs transition-all',
              'hover:ring-2 hover:ring-primary disabled:opacity-50',
              isBetSelected({ type: 'black' }) && 'ring-2 ring-primary'
            )}
          >
            BLACK
          </button>
          <button
            onClick={() => onSelectBet({ type: 'odd' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-xs transition-all',
              'hover:border-primary disabled:opacity-50',
              isBetSelected({ type: 'odd' }) && 'border-primary bg-primary/20'
            )}
          >
            ODD
          </button>
          <button
            onClick={() => onSelectBet({ type: 'high' })}
            disabled={disabled}
            className={cn(
              'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-xs transition-all',
              'hover:border-primary disabled:opacity-50',
              isBetSelected({ type: 'high' }) && 'border-primary bg-primary/20'
            )}
          >
            19-36
          </button>
        </div>
        
        {/* Payout info */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <span className="mr-4">Straight: 35:1</span>
          <span className="mr-4">Dozen: 2:1</span>
          <span>Even bets: 1:1</span>
        </div>
      </div>
    </div>
  );
};

export default BettingBoard;
