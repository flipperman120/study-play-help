import { useState, useCallback } from 'react';
import { useCasino } from '@/contexts/CasinoContext';
import BetSelector from '@/components/casino/BetSelector';
import RouletteWheel from './RouletteWheel';
import BettingBoard, { BetType, PlacedBet, getBetKey } from './BettingBoard';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/utils/sounds';
import { cn } from '@/lib/utils';

const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
};

const calculatePayout = (bet: BetType, result: number): number => {
  const color = getNumberColor(result);
  
  switch (bet.type) {
    case 'straight':
      return bet.number === result ? 35 : -1;
    case 'red':
      return color === 'red' ? 1 : -1;
    case 'black':
      return color === 'black' ? 1 : -1;
    case 'odd':
      return result !== 0 && result % 2 === 1 ? 1 : -1;
    case 'even':
      return result !== 0 && result % 2 === 0 ? 1 : -1;
    case 'low':
      return result >= 1 && result <= 18 ? 1 : -1;
    case 'high':
      return result >= 19 && result <= 36 ? 1 : -1;
    case 'dozen':
      if (result === 0) return -1;
      if (bet.dozen === 1 && result >= 1 && result <= 12) return 2;
      if (bet.dozen === 2 && result >= 13 && result <= 24) return 2;
      if (bet.dozen === 3 && result >= 25 && result <= 36) return 2;
      return -1;
    case 'column':
      if (result === 0) return -1;
      if (result % 3 === bet.column % 3) return 2;
      return -1;
    default:
      return -1;
  }
};

const getBetName = (bet: BetType): string => {
  switch (bet.type) {
    case 'straight':
      return `#${bet.number}`;
    case 'red':
      return 'Red';
    case 'black':
      return 'Black';
    case 'odd':
      return 'Odd';
    case 'even':
      return 'Even';
    case 'low':
      return '1-18';
    case 'high':
      return '19-36';
    case 'dozen':
      return bet.dozen === 1 ? '1st 12' : bet.dozen === 2 ? '2nd 12' : '3rd 12';
    case 'column':
      return `Col ${bet.column}`;
    default:
      return 'Unknown';
  }
};

const RouletteGame = () => {
  const { chips, addChips, removeChips } = useCasino();
  const [betAmount, setBetAmount] = useState(25);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<{ message: string; won: boolean; winnings: number } | null>(null);

  const totalBetAmount = placedBets.reduce((sum, p) => sum + p.amount, 0);

  const placeBet = useCallback((bet: BetType) => {
    if (chips < betAmount) return;
    
    const key = getBetKey(bet);
    const existingIndex = placedBets.findIndex(p => getBetKey(p.bet) === key);
    
    if (existingIndex >= 0) {
      // Add to existing bet
      setPlacedBets(prev => prev.map((p, i) => 
        i === existingIndex ? { ...p, amount: p.amount + betAmount } : p
      ));
    } else {
      // New bet
      setPlacedBets(prev => [...prev, { bet, amount: betAmount }]);
    }
    
    removeChips(betAmount);
    soundManager.chipPlace();
  }, [betAmount, chips, placedBets, removeChips]);

  const spin = useCallback(() => {
    if (placedBets.length === 0) return;
    
    setSpinning(true);
    setResult(null);
    setGameResult(null);
    
    const spinInterval = setInterval(() => {
      soundManager.spin();
    }, 100);
    
    setTimeout(() => {
      clearInterval(spinInterval);
      const spinResult = Math.floor(Math.random() * 37);
      setResult(spinResult);
      setSpinning(false);
      
      soundManager.reelStop();
      
      setTimeout(() => {
        let totalWinnings = 0;
        const winningBets: string[] = [];
        
        placedBets.forEach(({ bet, amount }) => {
          const payout = calculatePayout(bet, spinResult);
          if (payout > 0) {
            const win = amount + (amount * payout);
            totalWinnings += win;
            winningBets.push(getBetName(bet));
          }
        });
        
        if (totalWinnings > 0) {
          addChips(totalWinnings);
          soundManager.win();
          setGameResult({
            message: `${spinResult} - ${winningBets.join(', ')} wins!`,
            won: true,
            winnings: totalWinnings
          });
        } else {
          soundManager.lose();
          setGameResult({
            message: `${spinResult} - No winning bets`,
            won: false,
            winnings: 0
          });
        }
        
        setPlacedBets([]);
      }, 500);
    }, 3000);
  }, [placedBets, addChips]);

  const clearBets = useCallback(() => {
    // Refund all bets
    addChips(totalBetAmount);
    setPlacedBets([]);
    setGameResult(null);
  }, [totalBetAmount, addChips]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel and Controls */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <RouletteWheel spinning={spinning} result={result} />
        
        <div className="flex flex-col items-center gap-4">
          {/* Placed bets display */}
          {placedBets.length > 0 && (
            <div className="bg-card border border-primary/30 rounded-xl px-4 py-3 max-w-xs">
              <p className="text-sm text-muted-foreground mb-2">Your Bets ({placedBets.length})</p>
              <div className="flex flex-wrap gap-2">
                {placedBets.map((p, i) => (
                  <span key={i} className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
                    {getBetName(p.bet)}: {p.amount}
                  </span>
                ))}
              </div>
              <p className="text-sm text-primary mt-2">Total: {totalBetAmount} chips</p>
            </div>
          )}
          
          {/* Result display */}
          {gameResult && (
            <div
              className={cn(
                'text-center p-4 rounded-xl border-2 animate-scale-in',
                gameResult.won
                  ? 'bg-casino-green/20 border-casino-green text-casino-green'
                  : 'bg-casino-red/20 border-casino-red text-casino-red'
              )}
            >
              <p className="text-xl font-display mb-1">{gameResult.message}</p>
              {gameResult.winnings > 0 && (
                <p className="text-lg">+{gameResult.winnings} chips</p>
              )}
            </div>
          )}
          
          {/* Bet controls */}
          <BetSelector bet={betAmount} onBetChange={setBetAmount} maxBet={Math.min(chips, 500)} />
          
          <div className="flex gap-3">
            <Button
              onClick={spin}
              disabled={spinning || placedBets.length === 0}
              className="gold-gradient text-primary-foreground font-display text-lg px-8 py-6"
            >
              {spinning ? 'Spinning...' : 'Spin'}
            </Button>
            <Button
              onClick={clearBets}
              disabled={spinning || placedBets.length === 0}
              variant="outline"
              className="border-primary/30 hover:border-primary"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      {/* Betting Board */}
      <div className="w-full max-w-2xl">
        <h3 className="text-center font-display text-primary mb-3">Place Your Bets</h3>
        <BettingBoard
          placedBets={placedBets}
          onPlaceBet={placeBet}
          disabled={spinning}
        />
      </div>
    </div>
  );
};

export default RouletteGame;
