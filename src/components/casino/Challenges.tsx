import { useCasino } from '@/contexts/CasinoContext';
import { Target, Check, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const Challenges = () => {
  const { challenges } = useCasino();

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4">
      <h3 className="font-display text-lg text-primary mb-4 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Daily Challenges
      </h3>
      
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
          
          return (
            <div
              key={challenge.id}
              className={cn(
                'p-3 rounded-lg border transition-all',
                challenge.completed 
                  ? 'bg-casino-green/10 border-casino-green/50' 
                  : 'bg-background/50 border-primary/20'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{challenge.icon}</span>
                  <div>
                    <p className={cn(
                      'font-medium text-sm',
                      challenge.completed ? 'text-casino-green' : 'text-foreground'
                    )}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                
                <div className={cn(
                  'flex items-center gap-1 text-sm font-display',
                  challenge.completed ? 'text-casino-green' : 'text-primary'
                )}>
                  {challenge.completed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>+{challenge.reward}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Progress 
                  value={progressPercent} 
                  className={cn(
                    'h-2 flex-1',
                    challenge.completed && '[&>div]:bg-casino-green'
                  )}
                />
                <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                  {challenge.progress}/{challenge.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
