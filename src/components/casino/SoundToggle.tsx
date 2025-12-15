import { useCasino } from '@/contexts/CasinoContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

const SoundToggle = () => {
  const { soundEnabled, toggleSound } = useCasino();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-colors',
        soundEnabled && 'text-primary'
      )}
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </Button>
  );
};

export default SoundToggle;
