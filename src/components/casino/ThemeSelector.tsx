import { useCasino, ThemeType } from '@/contexts/CasinoContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes: { id: ThemeType; label: string; colors: string }[] = [
  { id: 'vegas', label: 'Classic Vegas', colors: 'bg-primary' },
  { id: 'neon', label: 'Neon Nights', colors: 'bg-[hsl(280,100%,60%)]' },
  { id: 'dark', label: 'Dark Red', colors: 'bg-casino-red' },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useCasino();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Change theme"
        >
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border-primary/30">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              theme === t.id && 'bg-primary/10'
            )}
          >
            <div className={cn('w-4 h-4 rounded-full', t.colors)} />
            <span>{t.label}</span>
            {theme === t.id && <Check className="w-4 h-4 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
