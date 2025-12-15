import { useCasino } from '@/contexts/CasinoContext';
import { Trophy, Flame, Star, Gamepad2 } from 'lucide-react';

const gameLabels = {
  slots: 'Slots',
  blackjack: 'Blackjack',
  poker: 'Poker',
  roulette: 'Roulette'
};

const PlayerStats = () => {
  const { stats } = useCasino();
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.totalWins / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4">
      <h3 className="font-display text-lg text-primary mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Player Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-2xl font-display text-foreground">{stats.gamesPlayed}</p>
          <p className="text-xs text-muted-foreground">Games Played</p>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <Star className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-display text-foreground">{stats.biggestWin}</p>
          <p className="text-xs text-muted-foreground">Biggest Win</p>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-casino-red" />
          <p className="text-2xl font-display text-foreground">{stats.bestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-casino-green" />
          <p className="text-2xl font-display text-foreground">{winRate}%</p>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </div>
      </div>
      
      {stats.favoriteGame && (
        <div className="mt-3 pt-3 border-t border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">Favorite Game</p>
          <p className="text-lg font-display text-primary">{gameLabels[stats.favoriteGame]}</p>
        </div>
      )}
      
      {stats.currentStreak > 0 && (
        <div className="mt-2 text-center">
          <p className="text-sm text-casino-green flex items-center justify-center gap-1">
            <Flame className="w-4 h-4" />
            {stats.currentStreak} win streak!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
