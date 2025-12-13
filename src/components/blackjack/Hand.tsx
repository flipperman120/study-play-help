import Card from './Card';
import { cn } from '@/lib/utils';

export interface CardType {
  suit: string;
  value: string;
}

interface HandProps {
  cards: CardType[];
  hideFirst?: boolean;
  label: string;
  score?: number | string;
  className?: string;
}

const Hand = ({ cards, hideFirst = false, label, score, className }: HandProps) => {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
        <span>{label}</span>
        {score !== undefined && (
          <span className="px-2 py-0.5 bg-primary/20 rounded text-primary font-semibold">
            {score}
          </span>
        )}
      </div>
      <div className="flex gap-[-20px] sm:gap-[-30px]">
        {cards.map((card, index) => (
          <Card
            key={index}
            suit={card.suit}
            value={card.value}
            hidden={hideFirst && index === 0}
            className={cn(
              'transition-all duration-300',
              index > 0 && '-ml-8 sm:-ml-10'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Hand;
