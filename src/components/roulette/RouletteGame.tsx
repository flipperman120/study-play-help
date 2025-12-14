import { useState, useCallback } from 'react';
import { useCasino } from '@/contexts/CasinoContext';
import BetSelector from '@/components/casino/BetSelector';
import RouletteWheel from './RouletteWheel';
import BettingBoard, { BetType } from './BettingBoard';
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
      return `Number ${bet.number}`;
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
      return bet.dozen === 1 ? '1st Dozen' : bet.dozen === 2 ? '2nd Dozen' : '3rd Dozen';
    case 'column':
      return `Column ${bet.column}`;
    default:
      return 'Unknown';
  }
};

const RouletteGame = () => {
  const { chips, addChips, removeChips } = useCasino();
  const [bet, setBet] = useState(25);
  const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<{ message: string; won: boolean; winnings: number } | null>(null);

  const spin = useCallback(() => {
    if (!selectedBet || !removeChips(bet)) return;
    
    soundManager.chipPlace();
    setSpinning(true);
    setResult(null);
    setGameResult(null);
    
    // Simulate spinning sound
    const spinInterval = setInterval(() => {
      soundManager.spin();
    }, 100);
    
    // Determine result after spin
    setTimeout(() => {
      clearInterval(spinInterval);
      const spinResult = Math.floor(Math.random() * 37);
      setResult(spinResult);
      setSpinning(false);
      
      soundManager.reelStop();
      
      // Calculate winnings
      setTimeout(() => {
        const payout = calculatePayout(selectedBet, spinResult);
        
        if (payout > 0) {
          const winnings = bet + (bet * payout);
          addChips(winnings);
          soundManager.win();
          setGameResult({
            message: `${spinResult} - You win!`,
            won: true,
            winnings
          });
        } else {
          soundManager.lose();
          setGameResult({
            message: `${spinResult} - ${getBetName(selectedBet)} loses`,
            won: false,
            winnings: 0
          });
        }
      }, 500);
    }, 3000);
  }, [selectedBet, bet, removeChips, addChips]);

  const clearBet = useCallback(() => {
    setSelectedBet(null);
    setGameResult(null);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel and Controls */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <RouletteWheel spinning={spinning} result={result} />
        
        <div className="flex flex-col items-center gap-4">
          {/* Selected bet display */}
          {selectedBet && (
            <div className="bg-card border border-primary/30 rounded-xl px-6 py-3 text-center">
              <p className="text-sm text-muted-foreground">Your Bet</p>
              <p className="text-xl font-display text-primary">{getBetName(selectedBet)}</p>
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
          <BetSelector bet={bet} onBetChange={setBet} maxBet={Math.min(chips, 500)} />
          
          <div className="flex gap-3">
            <Button
              onClick={spin}
              disabled={spinning || !selectedBet || chips < bet}
              className="gold-gradient text-primary-foreground font-display text-lg px-8 py-6"
            >
              {spinning ? 'Spinning...' : 'Spin'}
            </Button>
            <Button
              onClick={clearBet}
              disabled={spinning}
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
        <h3 className="text-center font-display text-primary mb-3">Place Your Bet</h3>
        <BettingBoard
          selectedBet={selectedBet}
          onSelectBet={setSelectedBet}
          disabled={spinning}
        />
      </div>
    </div>
  );
};

export default RouletteGame;
