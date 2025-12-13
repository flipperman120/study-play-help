import { cn } from '@/lib/utils';

interface CardProps {
  suit: string;
  value: string;
  hidden?: boolean;
  className?: string;
}

const Card = ({ suit, value, hidden = false, className }: CardProps) => {
  const isRed = suit === '♥' || suit === '♦';

  if (hidden) {
    return (
      <div
        className={cn(
          'w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-primary/30 flex items-center justify-center',
          'bg-gradient-to-br from-casino-red to-secondary',
          className
        )}
      >
        <div className="w-10 h-14 sm:w-12 sm:h-16 rounded border-2 border-primary/20 bg-background/10 flex items-center justify-center">
          <span className="text-primary/50 text-2xl">?</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-primary/30 flex flex-col items-center justify-between p-1.5 sm:p-2',
        'bg-gradient-to-br from-foreground to-muted-foreground/90 shadow-lg',
        className
      )}
    >
      <div className={cn('text-sm sm:text-base font-bold self-start', isRed ? 'text-casino-red' : 'text-background')}>
        {value}
        <span className="text-xs sm:text-sm">{suit}</span>
      </div>
      <div className={cn('text-2xl sm:text-3xl', isRed ? 'text-casino-red' : 'text-background')}>
        {suit}
      </div>
      <div
        className={cn(
          'text-sm sm:text-base font-bold self-end rotate-180',
          isRed ? 'text-casino-red' : 'text-background'
        )}
      >
        {value}
        <span className="text-xs sm:text-sm">{suit}</span>
      </div>
    </div>
  );
};

export default Card;
