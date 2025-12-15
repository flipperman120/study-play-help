import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { GameType } from '@/contexts/CasinoContext';

interface HelpModalProps {
  game: GameType;
}

const gameHelp: Record<GameType, { title: string; rules: string[]; payouts: string[] }> = {
  slots: {
    title: 'Slot Machine',
    rules: [
      'Click SPIN to start the reels',
      'Match symbols across the reels to win',
      'More matching symbols = bigger wins',
      'Adjust your bet before spinning'
    ],
    payouts: [
      '4 matching symbols: 10x bet',
      '3 matching symbols: 5x bet',
      '2 matching symbols: 2x bet'
    ]
  },
  blackjack: {
    title: 'Blackjack',
    rules: [
      'Get as close to 21 as possible without going over',
      'Face cards (J, Q, K) are worth 10',
      'Aces are worth 1 or 11',
      'Hit to get another card, Stand to keep your hand',
      'Double Down doubles your bet and gives one more card'
    ],
    payouts: [
      'Blackjack (21 with 2 cards): 3:2',
      'Regular win: 1:1',
      'Bust (over 21): lose bet'
    ]
  },
  poker: {
    title: 'Texas Hold\'em',
    rules: [
      'You and dealer each get 2 hole cards',
      '5 community cards are dealt on the table',
      'Make the best 5-card hand from any combination',
      'Bet, call, or fold based on your hand strength'
    ],
    payouts: [
      'Royal Flush: 250x',
      'Straight Flush: 50x',
      'Four of a Kind: 25x',
      'Full House: 9x',
      'Flush: 6x',
      'Straight: 4x',
      'Three of a Kind: 3x',
      'Two Pair: 2x',
      'Pair: 1x'
    ]
  },
  roulette: {
    title: 'European Roulette',
    rules: [
      'Place bets on numbers, colors, or groups',
      'The wheel has numbers 0-36',
      'Click multiple spots to place multiple bets',
      'Click SPIN when ready'
    ],
    payouts: [
      'Straight (single number): 35:1',
      'Dozen (1-12, 13-24, 25-36): 2:1',
      'Column: 2:1',
      'Red/Black, Odd/Even, High/Low: 1:1'
    ]
  }
};

const HelpModal = ({ game }: HelpModalProps) => {
  const [open, setOpen] = useState(false);
  const help = gameHelp[game];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-primary"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">
            How to Play {help.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-display text-foreground mb-2">Rules</h4>
            <ul className="space-y-1">
              {help.rules.map((rule, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-foreground mb-2">Payouts</h4>
            <ul className="space-y-1">
              {help.payouts.map((payout, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-casino-green">→</span>
                  {payout}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
