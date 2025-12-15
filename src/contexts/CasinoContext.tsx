import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Types
export type GameType = 'slots' | 'blackjack' | 'poker' | 'roulette';
export type ThemeType = 'vegas' | 'neon' | 'dark';

export interface GameRecord {
  id: string;
  game: GameType;
  result: 'win' | 'loss';
  amount: number;
  timestamp: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  biggestWin: number;
  currentStreak: number;
  bestStreak: number;
  favoriteGame: GameType | null;
  gamesCounts: Record<GameType, number>;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  game: GameType | 'any';
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  icon: string;
}

interface CasinoContextType {
  // Chips
  chips: number;
  addChips: (amount: number) => void;
  removeChips: (amount: number) => boolean;
  resetChips: () => void;
  
  // Daily Bonus
  dailyBonusAvailable: boolean;
  dailyBonusCooldown: number;
  claimDailyBonus: () => void;
  
  // Stats
  stats: PlayerStats;
  recordGame: (game: GameType, won: boolean, amount: number) => void;
  
  // Game History
  gameHistory: GameRecord[];
  
  // Challenges
  challenges: Challenge[];
  
  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

const INITIAL_CHIPS = 1000;
const DAILY_BONUS_AMOUNT = 250;
const DAILY_BONUS_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

const getInitialChallenges = (): Challenge[] => [
  {
    id: 'blackjack-wins',
    title: 'Blackjack Pro',
    description: 'Win 3 Blackjack games',
    game: 'blackjack',
    target: 3,
    progress: 0,
    reward: 100,
    completed: false,
    icon: '🂡'
  },
  {
    id: 'slots-spins',
    title: 'Lucky Spinner',
    description: 'Play 5 slot games',
    game: 'slots',
    target: 5,
    progress: 0,
    reward: 75,
    completed: false,
    icon: '🎰'
  },
  {
    id: 'roulette-straight',
    title: 'Straight Shooter',
    description: 'Win 2 Roulette games',
    game: 'roulette',
    target: 2,
    progress: 0,
    reward: 150,
    completed: false,
    icon: '🎯'
  },
  {
    id: 'poker-wins',
    title: 'Card Shark',
    description: 'Win 2 Poker games',
    game: 'poker',
    target: 2,
    progress: 0,
    reward: 125,
    completed: false,
    icon: '🃏'
  },
  {
    id: 'high-roller',
    title: 'High Roller',
    description: 'Win 500+ chips in a single game',
    game: 'any',
    target: 500,
    progress: 0,
    reward: 200,
    completed: false,
    icon: '💎'
  }
];

export const CasinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chips, setChips] = useState(INITIAL_CHIPS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<ThemeType>('vegas');
  const [lastBonusClaim, setLastBonusClaim] = useState<number>(0);
  const [dailyBonusCooldown, setDailyBonusCooldown] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(getInitialChallenges);
  const [stats, setStats] = useState<PlayerStats>({
    gamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0,
    currentStreak: 0,
    bestStreak: 0,
    favoriteGame: null,
    gamesCounts: { slots: 0, blackjack: 0, poker: 0, roulette: 0 }
  });

  // Daily bonus cooldown timer
  useEffect(() => {
    const updateCooldown = () => {
      const elapsed = Date.now() - lastBonusClaim;
      const remaining = Math.max(0, DAILY_BONUS_COOLDOWN - elapsed);
      setDailyBonusCooldown(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [lastBonusClaim]);

  const dailyBonusAvailable = dailyBonusCooldown === 0;

  const addChips = useCallback((amount: number) => {
    setChips(prev => prev + amount);
  }, []);

  const removeChips = useCallback((amount: number): boolean => {
    if (chips >= amount) {
      setChips(prev => prev - amount);
      return true;
    }
    return false;
  }, [chips]);

  const resetChips = useCallback(() => {
    setChips(INITIAL_CHIPS);
  }, []);

  const claimDailyBonus = useCallback(() => {
    if (dailyBonusAvailable) {
      addChips(DAILY_BONUS_AMOUNT);
      setLastBonusClaim(Date.now());
    }
  }, [dailyBonusAvailable, addChips]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const recordGame = useCallback((game: GameType, won: boolean, amount: number) => {
    // Add to history
    const record: GameRecord = {
      id: `${Date.now()}-${Math.random()}`,
      game,
      result: won ? 'win' : 'loss',
      amount: won ? amount : -amount,
      timestamp: Date.now()
    };
    setGameHistory(prev => [record, ...prev].slice(0, 10));

    // Update stats
    setStats(prev => {
      const newGamesCounts = { ...prev.gamesCounts, [game]: prev.gamesCounts[game] + 1 };
      const favoriteGame = (Object.entries(newGamesCounts) as [GameType, number][])
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      const newStreak = won ? prev.currentStreak + 1 : 0;
      
      return {
        gamesPlayed: prev.gamesPlayed + 1,
        totalWins: prev.totalWins + (won ? 1 : 0),
        totalLosses: prev.totalLosses + (won ? 0 : 1),
        biggestWin: won ? Math.max(prev.biggestWin, amount) : prev.biggestWin,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        favoriteGame,
        gamesCounts: newGamesCounts
      };
    });

    // Update challenges
    setChallenges(prev => prev.map(challenge => {
      if (challenge.completed) return challenge;
      
      let newProgress = challenge.progress;
      
      if (challenge.id === 'high-roller' && won && amount >= 500) {
        newProgress = 500;
      } else if (challenge.game === game) {
        if (challenge.id.includes('wins') && won) {
          newProgress = challenge.progress + 1;
        } else if (challenge.id.includes('spins') || challenge.id.includes('plays')) {
          newProgress = challenge.progress + 1;
        } else if (won) {
          newProgress = challenge.progress + 1;
        }
      }
      
      const completed = newProgress >= challenge.target;
      
      if (completed && !challenge.completed) {
        // Award reward
        setTimeout(() => addChips(challenge.reward), 100);
      }
      
      return { ...challenge, progress: newProgress, completed };
    }));
  }, [addChips]);

  return (
    <CasinoContext.Provider value={{
      chips,
      addChips,
      removeChips,
      resetChips,
      dailyBonusAvailable,
      dailyBonusCooldown,
      claimDailyBonus,
      stats,
      recordGame,
      gameHistory,
      challenges,
      soundEnabled,
      toggleSound,
      theme,
      setTheme
    }}>
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = () => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error('useCasino must be used within a CasinoProvider');
  }
  return context;
};
