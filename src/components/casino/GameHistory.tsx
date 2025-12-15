import { useCasino, GameType } from '@/contexts/CasinoContext';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const gameIcons: Record<GameType, string> = {
  slots: '🎰',
  blackjack: '🃏',
  poker: '🂡',
  roulette: '🎡'
};

const gameLabels: Record<GameType, string> = {
  slots: 'Slots',
  blackjack: 'Blackjack',
  poker: 'Poker',
  roulette: 'Roulette'
};

const formatTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const GameHistory = () => {
  const { gameHistory } = useCasino();

  if (gameHistory.length === 0) {
    return (
      <div className="bg-card border border-primary/30 rounded-xl p-4">
        <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
          <History className="w-5 h-5" />
          Game History
        </h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No games played yet. Start playing to see your history!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4">
      <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
        <History className="w-5 h-5" />
        Recent Games
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {gameHistory.map((record) => (
          <div
            key={record.id}
            className={cn(
              'flex items-center justify-between p-2 rounded-lg',
              record.result === 'win' 
                ? 'bg-casino-green/10 border border-casino-green/30' 
                : 'bg-casino-red/10 border border-casino-red/30'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{gameIcons[record.game]}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{gameLabels[record.game]}</p>
                <p className="text-xs text-muted-foreground">{formatTime(record.timestamp)}</p>
              </div>
            </div>
            
            <div className={cn(
              'flex items-center gap-1 font-display',
              record.result === 'win' ? 'text-casino-green' : 'text-casino-red'
            )}>
              {record.result === 'win' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{record.amount > 0 ? '+' : ''}{record.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
