import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import SlotReel from './SlotReel';
import BetSelector from '@/components/casino/BetSelector';
import { useCasino } from '@/contexts/CasinoContext';
import { soundManager } from '@/utils/sounds';
import { cn } from '@/lib/utils';

const SYMBOLS = ['A♠', 'K♥', 'Q♦', 'J♣', '10♠', '9♥', '8♦', '7♣'];

const SlotMachine = () => {
  const { chips, addChips, removeChips } = useCasino();
  const [bet, setBet] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['A♠', 'K♥', 'Q♦', 'J♣']);
  const [stoppedReels, setStoppedReels] = useState(0);
  const [result, setResult] = useState<{ type: string; multiplier: number } | null>(null);
  const [showWin, setShowWin] = useState(false);

  const calculateWin = useCallback((finalReels: string[]) => {
    const counts: Record<string, number> = {};
    finalReels.forEach((symbol) => {
      const base = symbol.replace(/[♠♥♦♣]/g, '');
      counts[base] = (counts[base] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));

    if (maxCount === 4) return { type: 'JACKPOT!', multiplier: 10 };
    if (maxCount === 3) return { type: 'BIG WIN!', multiplier: 5 };
    if (maxCount === 2) return { type: 'WINNER!', multiplier: 2 };
    return null;
  }, []);

  const spin = () => {
    if (isSpinning || chips < bet) return;

    if (!removeChips(bet)) return;

    soundManager.buttonClick();
    setIsSpinning(true);
    setStoppedReels(0);
    setResult(null);
    setShowWin(false);

    // Generate random final symbols
    const newReels = Array(4)
      .fill(null)
      .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    setReels(newReels);

    // Play spinning sound
    const spinInterval = setInterval(() => {
      soundManager.spin();
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
    }, 2000);
  };

  const handleReelStop = useCallback(
    (index: number) => {
      soundManager.reelStop();
      setStoppedReels((prev) => {
        const newCount = prev + 1;
        if (newCount === 4) {
          // All reels stopped, calculate result
          setTimeout(() => {
            setIsSpinning(false);
            const winResult = calculateWin(reels);
            if (winResult) {
              setResult(winResult);
              setShowWin(true);
              const winAmount = bet * winResult.multiplier;
              addChips(winAmount);
              if (winResult.multiplier >= 5) {
                soundManager.bigWin();
              } else {
                soundManager.win();
              }
            } else {
              soundManager.lose();
            }
          }, 200);
        }
        return newCount;
      });
    },
    [reels, bet, addChips, calculateWin]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Slot Machine Frame */}
      <div className="relative bg-gradient-to-b from-casino-dark to-background p-6 sm:p-8 rounded-2xl border-4 border-primary/50 vegas-glow">
        {/* Top decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 gold-gradient rounded-full">
          <span className="text-sm font-display text-primary-foreground uppercase tracking-wider">
            Lucky Cards
          </span>
        </div>

        {/* Reels */}
        <div className="flex gap-2 sm:gap-3 p-4 bg-black/50 rounded-xl border border-primary/20">
          {reels.map((symbol, index) => (
            <SlotReel
              key={index}
              symbols={SYMBOLS}
              finalSymbol={symbol}
              isSpinning={isSpinning}
              spinDuration={1000 + index * 300}
              onStop={() => handleReelStop(index)}
            />
          ))}
        </div>

        {/* Result Display */}
        <div className="h-16 flex items-center justify-center mt-4">
          {showWin && result && (
            <div
              className={cn(
                'text-center animate-bounce-win',
                result.multiplier >= 5 ? 'scale-110' : ''
              )}
            >
              <div className="text-2xl sm:text-3xl font-display text-primary vegas-text-glow">
                {result.type}
              </div>
              <div className="text-lg text-casino-gold-light">
                Won {bet * result.multiplier} chips!
              </div>
            </div>
          )}
        </div>

        {/* Paytable */}
        <div className="mt-4 p-3 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div>4 Matching = <span className="text-primary">10x</span></div>
            <div>3 Matching = <span className="text-primary">5x</span></div>
            <div>2 Matching = <span className="text-primary">2x</span></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <BetSelector bet={bet} onBetChange={setBet} disabled={isSpinning} />

        <Button
          size="lg"
          onClick={spin}
          disabled={isSpinning || chips < bet}
          className="w-full max-w-[200px] h-14 text-xl font-display gold-gradient text-primary-foreground hover:opacity-90 transition-all vegas-glow disabled:opacity-50"
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </Button>

        {chips < bet && !isSpinning && (
          <p className="text-destructive text-sm">Not enough chips!</p>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;
