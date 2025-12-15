import { useCasino } from '@/contexts/CasinoContext';
import { User, Award, Coins, TrendingUp } from 'lucide-react';

const badges = [
  { id: 'beginner', icon: '🎰', name: 'First Spin', condition: (stats: any) => stats.gamesPlayed >= 1 },
  { id: 'winner', icon: '🏆', name: 'First Win', condition: (stats: any) => stats.totalWins >= 1 },
  { id: 'streak3', icon: '🔥', name: '3 Win Streak', condition: (stats: any) => stats.bestStreak >= 3 },
  { id: 'streak5', icon: '💎', name: '5 Win Streak', condition: (stats: any) => stats.bestStreak >= 5 },
  { id: 'bigwin', icon: '💰', name: 'Big Winner', condition: (stats: any) => stats.biggestWin >= 500 },
  { id: 'veteran', icon: '⭐', name: 'Veteran', condition: (stats: any) => stats.gamesPlayed >= 25 },
];

const ProfilePanel = () => {
  const { chips, stats } = useCasino();
  
  const earnedBadges = badges.filter(b => b.condition(stats));
  const lockedBadges = badges.filter(b => !b.condition(stats));

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center">
          <User className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-xl text-foreground">High Roller</h3>
          <p className="text-sm text-muted-foreground">Level {Math.floor(stats.gamesPlayed / 10) + 1}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-background/50 rounded-lg p-2 text-center">
          <Coins className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-lg font-display text-foreground">{chips}</p>
          <p className="text-[10px] text-muted-foreground">Chips</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2 text-center">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-casino-green" />
          <p className="text-lg font-display text-foreground">{stats.totalWins}</p>
          <p className="text-[10px] text-muted-foreground">Wins</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2 text-center">
          <Award className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-lg font-display text-foreground">{earnedBadges.length}</p>
          <p className="text-[10px] text-muted-foreground">Badges</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-display text-foreground mb-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Badges
        </h4>
        <div className="flex flex-wrap gap-2">
          {earnedBadges.map(badge => (
            <div
              key={badge.id}
              className="bg-primary/20 border border-primary/50 rounded-lg px-2 py-1 flex items-center gap-1"
              title={badge.name}
            >
              <span>{badge.icon}</span>
              <span className="text-xs text-foreground">{badge.name}</span>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div
              key={badge.id}
              className="bg-muted/30 border border-muted rounded-lg px-2 py-1 flex items-center gap-1 opacity-50"
              title={`Locked: ${badge.name}`}
            >
              <span className="grayscale">🔒</span>
              <span className="text-xs text-muted-foreground">???</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
