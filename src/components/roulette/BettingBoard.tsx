import { cn } from '@/lib/utils';

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

export interface PlacedBet {
  bet: BetType;
  amount: number;
}

interface BettingBoardProps {
  placedBets: PlacedBet[];
  onPlaceBet: (bet: BetType) => void;
  disabled: boolean;
}

const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
};

export const getBetKey = (bet: BetType): string => {
  switch (bet.type) {
    case 'straight':
      return `straight-${bet.number}`;
    case 'dozen':
      return `dozen-${bet.dozen}`;
    case 'column':
      return `column-${bet.column}`;
    default:
      return bet.type;
  }
};

const BettingBoard = ({ placedBets, onPlaceBet, disabled }: BettingBoardProps) => {
  const getBetAmount = (bet: BetType): number => {
    const key = getBetKey(bet);
    const placed = placedBets.find(p => getBetKey(p.bet) === key);
    return placed?.amount || 0;
  };

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  
  return (
    <div className="bg-casino-felt border-4 border-casino-wood rounded-xl p-4 overflow-x-auto">
      <div className="min-w-[320px]">
        {/* Zero */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => onPlaceBet({ type: 'straight', number: 0 })}
            disabled={disabled}
            className={cn(
              'w-12 h-10 rounded bg-casino-green text-foreground font-bold text-lg transition-all relative',
              'hover:ring-2 hover:ring-primary disabled:opacity-50',
              getBetAmount({ type: 'straight', number: 0 }) > 0 && 'ring-2 ring-primary scale-105'
            )}
          >
            0
            {getBetAmount({ type: 'straight', number: 0 }) > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getBetAmount({ type: 'straight', number: 0 })}
              </span>
            )}
          </button>
        </div>
        
        {/* Number grid 1-36 */}
        <div className="grid grid-cols-12 gap-1 mb-2">
          {numbers.slice(1).map((num) => {
            const color = getNumberColor(num);
            const betAmount = getBetAmount({ type: 'straight', number: num });
            return (
              <button
                key={num}
                onClick={() => onPlaceBet({ type: 'straight', number: num })}
                disabled={disabled}
                className={cn(
                  'w-full aspect-square rounded text-foreground font-bold text-sm transition-all relative',
                  'hover:ring-2 hover:ring-primary disabled:opacity-50',
                  color === 'red' && 'bg-casino-red',
                  color === 'black' && 'bg-background/80',
                  betAmount > 0 && 'ring-2 ring-primary scale-105'
                )}
              >
                {num}
                {betAmount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {betAmount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Dozens */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          {([1, 2, 3] as const).map((dozen) => {
            const betAmount = getBetAmount({ type: 'dozen', dozen });
            return (
              <button
                key={dozen}
                onClick={() => onPlaceBet({ type: 'dozen', dozen })}
                disabled={disabled}
                className={cn(
                  'py-2 rounded bg-card border border-primary/30 text-foreground font-semibold text-sm transition-all relative',
                  'hover:border-primary disabled:opacity-50',
                  betAmount > 0 && 'border-primary bg-primary/20'
                )}
              >
                {dozen === 1 ? '1-12' : dozen === 2 ? '13-24' : '25-36'}
                {betAmount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {betAmount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Outside bets */}
        <div className="grid grid-cols-6 gap-1">
          {[
            { bet: { type: 'low' } as BetType, label: '1-18' },
            { bet: { type: 'even' } as BetType, label: 'EVEN' },
            { bet: { type: 'red' } as BetType, label: 'RED', isRed: true },
            { bet: { type: 'black' } as BetType, label: 'BLACK', isBlack: true },
            { bet: { type: 'odd' } as BetType, label: 'ODD' },
            { bet: { type: 'high' } as BetType, label: '19-36' },
          ].map(({ bet, label, isRed, isBlack }) => {
            const betAmount = getBetAmount(bet);
            return (
              <button
                key={label}
                onClick={() => onPlaceBet(bet)}
                disabled={disabled}
                className={cn(
                  'py-2 rounded text-foreground font-semibold text-xs transition-all relative',
                  'disabled:opacity-50',
                  isRed && 'bg-casino-red hover:ring-2 hover:ring-primary',
                  isBlack && 'bg-background/80 hover:ring-2 hover:ring-primary',
                  !isRed && !isBlack && 'bg-card border border-primary/30 hover:border-primary',
                  betAmount > 0 && (isRed || isBlack ? 'ring-2 ring-primary' : 'border-primary bg-primary/20')
                )}
              >
                {label}
                {betAmount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {betAmount}
                  </span>
                )}
              </button>
            );
          })}
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
