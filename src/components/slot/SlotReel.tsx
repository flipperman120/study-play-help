import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SlotReelProps {
  symbols: string[];
  finalSymbol: string;
  isSpinning: boolean;
  spinDuration: number;
  onStop?: () => void;
}

const SlotReel = ({ symbols, finalSymbol, isSpinning, spinDuration, onStop }: SlotReelProps) => {
  const [displaySymbol, setDisplaySymbol] = useState(finalSymbol);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      setIsAnimating(true);
      
      // Rapidly cycle through symbols during spin
      const interval = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        setDisplaySymbol(randomSymbol);
      }, 50);

      // Stop after duration and show final symbol
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplaySymbol(finalSymbol);
        setIsAnimating(false);
        onStop?.();
      }, spinDuration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isSpinning, finalSymbol, spinDuration, symbols, onStop]);

  const getSymbolColor = (symbol: string) => {
    if (symbol.includes('♥') || symbol.includes('♦')) return 'text-casino-red';
    return 'text-foreground';
  };

  return (
    <div className="relative w-20 h-24 sm:w-24 sm:h-28 overflow-hidden rounded-lg slot-reel border-2 border-primary/40">
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-100",
          isAnimating && "blur-[1px]"
        )}
      >
        <span className={cn(
          "text-4xl sm:text-5xl font-bold select-none",
          getSymbolColor(displaySymbol)
        )}>
          {displaySymbol}
        </span>
      </div>
      
      {/* Highlight effect on edges */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default SlotReel;
