import { useState, useCallback } from 'react';
import { useCasino } from '@/contexts/CasinoContext';
import BetSelector from '@/components/casino/BetSelector';
import Card from '@/components/blackjack/Card';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/utils/sounds';
import { cn } from '@/lib/utils';

interface CardType {
  suit: string;
  value: string;
  numValue: number;
}

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = [
  { value: '2', numValue: 2 },
  { value: '3', numValue: 3 },
  { value: '4', numValue: 4 },
  { value: '5', numValue: 5 },
  { value: '6', numValue: 6 },
  { value: '7', numValue: 7 },
  { value: '8', numValue: 8 },
  { value: '9', numValue: 9 },
  { value: '10', numValue: 10 },
  { value: 'J', numValue: 11 },
  { value: 'Q', numValue: 12 },
  { value: 'K', numValue: 13 },
  { value: 'A', numValue: 14 },
];

type GamePhase = 'betting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'result';

const HAND_RANKINGS = [
  { name: 'Royal Flush', multiplier: 250 },
  { name: 'Straight Flush', multiplier: 50 },
  { name: 'Four of a Kind', multiplier: 25 },
  { name: 'Full House', multiplier: 9 },
  { name: 'Flush', multiplier: 6 },
  { name: 'Straight', multiplier: 4 },
  { name: 'Three of a Kind', multiplier: 3 },
  { name: 'Two Pair', multiplier: 2 },
  { name: 'Pair of Jacks+', multiplier: 1 },
];

const createDeck = (): CardType[] => {
  const deck: CardType[] = [];
  for (const suit of SUITS) {
    for (const { value, numValue } of VALUES) {
      deck.push({ suit, value, numValue });
    }
  }
  return deck;
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const evaluateHand = (cards: CardType[]): { rank: number; name: string; multiplier: number } => {
  const sortedCards = [...cards].sort((a, b) => b.numValue - a.numValue);
  
  // Get all 5-card combinations
  const combinations: CardType[][] = [];
  for (let i = 0; i < cards.length - 4; i++) {
    for (let j = i + 1; j < cards.length - 3; j++) {
      for (let k = j + 1; k < cards.length - 2; k++) {
        for (let l = k + 1; l < cards.length - 1; l++) {
          for (let m = l + 1; m < cards.length; m++) {
            combinations.push([cards[i], cards[j], cards[k], cards[l], cards[m]]);
          }
        }
      }
    }
  }

  let bestHand = { rank: 10, name: 'High Card', multiplier: 0 };

  for (const combo of combinations) {
    const hand = evaluateFiveCards(combo);
    if (hand.rank < bestHand.rank) {
      bestHand = hand;
    }
  }

  return bestHand;
};

const evaluateFiveCards = (cards: CardType[]): { rank: number; name: string; multiplier: number } => {
  const sorted = [...cards].sort((a, b) => b.numValue - a.numValue);
  const values = sorted.map(c => c.numValue);
  const suits = sorted.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = values.every((v, i) => i === 0 || values[i - 1] - v === 1) ||
    (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2);

  const valueCounts: Record<number, number> = {};
  values.forEach(v => { valueCounts[v] = (valueCounts[v] || 0) + 1; });
  const counts = Object.values(valueCounts).sort((a, b) => b - a);

  // Royal Flush
  if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
    return { rank: 1, name: 'Royal Flush', multiplier: 250 };
  }
  // Straight Flush
  if (isFlush && isStraight) {
    return { rank: 2, name: 'Straight Flush', multiplier: 50 };
  }
  // Four of a Kind
  if (counts[0] === 4) {
    return { rank: 3, name: 'Four of a Kind', multiplier: 25 };
  }
  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 4, name: 'Full House', multiplier: 9 };
  }
  // Flush
  if (isFlush) {
    return { rank: 5, name: 'Flush', multiplier: 6 };
  }
  // Straight
  if (isStraight) {
    return { rank: 6, name: 'Straight', multiplier: 4 };
  }
  // Three of a Kind
  if (counts[0] === 3) {
    return { rank: 7, name: 'Three of a Kind', multiplier: 3 };
  }
  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: 8, name: 'Two Pair', multiplier: 2 };
  }
  // Pair (Jacks or Better)
  if (counts[0] === 2) {
    const pairValue = Object.entries(valueCounts).find(([_, count]) => count === 2)?.[0];
    if (pairValue && parseInt(pairValue) >= 11) {
      return { rank: 9, name: 'Pair of Jacks+', multiplier: 1 };
    }
  }

  return { rank: 10, name: 'High Card', multiplier: 0 };
};

const PokerGame = () => {
  const { chips, addChips, removeChips, recordGame } = useCasino();
  const [bet, setBet] = useState(25);
  const [phase, setPhase] = useState<GamePhase>('betting');
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [communityCards, setCommunityCards] = useState<CardType[]>([]);
  const [dealerCards, setDealerCards] = useState<CardType[]>([]);
  const [totalBet, setTotalBet] = useState(0);
  const [result, setResult] = useState<{ message: string; won: boolean; winnings: number } | null>(null);
  const [playerHand, setPlayerHand] = useState<{ name: string; multiplier: number } | null>(null);
  const [dealerHand, setDealerHand] = useState<{ name: string; multiplier: number } | null>(null);

  const dealCards = useCallback(() => {
    if (!removeChips(bet)) return;
    
    soundManager.chipPlace();
    setTotalBet(bet);
    
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    
    // Deal 2 cards to player and dealer
    const pCards = [newDeck[0], newDeck[1]];
    const dCards = [newDeck[2], newDeck[3]];
    
    setPlayerCards(pCards);
    setDealerCards(dCards);
    setCommunityCards([]);
    setResult(null);
    setPlayerHand(null);
    setDealerHand(null);
    setPhase('preflop');
    
    setTimeout(() => soundManager.cardDeal(), 100);
    setTimeout(() => soundManager.cardDeal(), 300);
  }, [bet, removeChips]);

  const dealFlop = useCallback(() => {
    if (!removeChips(bet)) return;
    
    soundManager.chipPlace();
    setTotalBet(prev => prev + bet);
    
    const flopCards = [deck[4], deck[5], deck[6]];
    setCommunityCards(flopCards);
    setPhase('flop');
    
    setTimeout(() => soundManager.cardDeal(), 100);
    setTimeout(() => soundManager.cardDeal(), 200);
    setTimeout(() => soundManager.cardDeal(), 300);
  }, [bet, deck, removeChips]);

  const dealTurn = useCallback(() => {
    setCommunityCards(prev => [...prev, deck[7]]);
    setPhase('turn');
    soundManager.cardDeal();
  }, [deck]);

  const dealRiver = useCallback(() => {
    setCommunityCards(prev => [...prev, deck[8]]);
    setPhase('river');
    soundManager.cardDeal();
  }, [deck]);

  const showdown = useCallback(() => {
    setPhase('showdown');
    soundManager.cardFlip();
    
    setTimeout(() => {
      const allPlayerCards = [...playerCards, ...communityCards];
      const allDealerCards = [...dealerCards, ...communityCards];
      
      const pHand = evaluateHand(allPlayerCards);
      const dHand = evaluateHand(allDealerCards);
      
      setPlayerHand({ name: pHand.name, multiplier: pHand.multiplier });
      setDealerHand({ name: dHand.name, multiplier: dHand.multiplier });
      
      let resultMsg = '';
      let won = false;
      let winnings = 0;
      
      if (pHand.rank < dHand.rank) {
        // Player wins
        winnings = totalBet * 2;
        if (pHand.multiplier > 0) {
          winnings = totalBet + (totalBet * pHand.multiplier);
        }
        addChips(winnings);
        resultMsg = `You win with ${pHand.name}!`;
        won = true;
        soundManager.win();
        recordGame('poker', true, winnings - totalBet);
      } else if (dHand.rank < pHand.rank) {
        // Dealer wins
        resultMsg = `Dealer wins with ${dHand.name}`;
        soundManager.lose();
        recordGame('poker', false, -totalBet);
      } else {
        // Tie - push
        addChips(totalBet);
        winnings = totalBet;
        resultMsg = 'Push - tie game!';
        recordGame('poker', false, 0);
      }
      
      setResult({ message: resultMsg, won, winnings });
      setPhase('result');
    }, 500);
  }, [playerCards, dealerCards, communityCards, totalBet, addChips, recordGame]);

  const fold = useCallback(() => {
    soundManager.lose();
    recordGame('poker', false, -totalBet);
    setResult({ message: 'You folded', won: false, winnings: 0 });
    setPhase('result');
  }, [totalBet, recordGame]);

  const newGame = useCallback(() => {
    setPhase('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setCommunityCards([]);
    setResult(null);
    setPlayerHand(null);
    setDealerHand(null);
    setTotalBet(0);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pot Display */}
      {totalBet > 0 && (
        <div className="bg-card border border-primary/30 rounded-xl px-6 py-3">
          <span className="text-muted-foreground mr-2">Pot:</span>
          <span className="text-2xl font-display text-primary">{totalBet}</span>
        </div>
      )}

      {/* Poker Table */}
      <div className="relative w-full max-w-3xl bg-casino-felt rounded-[100px] border-8 border-casino-wood p-8 shadow-2xl min-h-[400px]">
        {/* Dealer Area */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">Dealer</p>
          <div className="flex justify-center gap-2">
            {dealerCards.length > 0 ? (
              dealerCards.map((card, i) => (
                <Card
                  key={i}
                  suit={card.suit}
                  value={card.value}
                  hidden={phase !== 'showdown' && phase !== 'result'}
                  className="animate-fade-in"
                />
              ))
            ) : (
              <div className="h-24 sm:h-28 flex items-center">
                <span className="text-muted-foreground/50">Waiting...</span>
              </div>
            )}
          </div>
          {dealerHand && (
            <p className="mt-2 text-primary font-semibold animate-fade-in">{dealerHand.name}</p>
          )}
        </div>

        {/* Community Cards */}
        <div className="text-center my-8">
          <div className="flex justify-center gap-2 min-h-[112px] items-center">
            {communityCards.length > 0 ? (
              communityCards.map((card, i) => (
                <Card
                  key={i}
                  suit={card.suit}
                  value={card.value}
                  className="animate-fade-in"
                />
              ))
            ) : (
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-primary/20"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Player Area */}
        <div className="text-center mt-6">
          <div className="flex justify-center gap-2">
            {playerCards.length > 0 ? (
              playerCards.map((card, i) => (
                <Card
                  key={i}
                  suit={card.suit}
                  value={card.value}
                  className="animate-fade-in"
                />
              ))
            ) : (
              <div className="h-24 sm:h-28 flex items-center">
                <span className="text-muted-foreground/50">Place your bet to start</span>
              </div>
            )}
          </div>
          {playerHand && (
            <p className="mt-2 text-primary font-semibold animate-fade-in">{playerHand.name}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">Your Hand</p>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={cn(
            'text-center p-6 rounded-xl border-2 animate-scale-in',
            result.won
              ? 'bg-casino-green/20 border-casino-green text-casino-green'
              : 'bg-casino-red/20 border-casino-red text-casino-red'
          )}
        >
          <p className="text-2xl font-display mb-2">{result.message}</p>
          {result.winnings > 0 && (
            <p className="text-lg">+{result.winnings} chips</p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        {phase === 'betting' && (
          <>
            <BetSelector bet={bet} onBetChange={setBet} maxBet={Math.min(chips, 500)} />
            <Button
              onClick={dealCards}
              disabled={chips < bet}
              className="gold-gradient text-primary-foreground font-display text-lg px-8 py-6"
            >
              Deal Cards
            </Button>
          </>
        )}

        {phase === 'preflop' && (
          <div className="flex gap-4">
            <Button
              onClick={dealFlop}
              disabled={chips < bet}
              className="gold-gradient text-primary-foreground font-display px-6 py-4"
            >
              Call ({bet})
            </Button>
            <Button
              onClick={fold}
              variant="outline"
              className="border-casino-red text-casino-red hover:bg-casino-red/20 px-6 py-4"
            >
              Fold
            </Button>
          </div>
        )}

        {phase === 'flop' && (
          <div className="flex gap-4">
            <Button
              onClick={dealTurn}
              className="gold-gradient text-primary-foreground font-display px-6 py-4"
            >
              Check
            </Button>
            <Button
              onClick={fold}
              variant="outline"
              className="border-casino-red text-casino-red hover:bg-casino-red/20 px-6 py-4"
            >
              Fold
            </Button>
          </div>
        )}

        {phase === 'turn' && (
          <div className="flex gap-4">
            <Button
              onClick={dealRiver}
              className="gold-gradient text-primary-foreground font-display px-6 py-4"
            >
              Check
            </Button>
            <Button
              onClick={fold}
              variant="outline"
              className="border-casino-red text-casino-red hover:bg-casino-red/20 px-6 py-4"
            >
              Fold
            </Button>
          </div>
        )}

        {phase === 'river' && (
          <div className="flex gap-4">
            <Button
              onClick={showdown}
              className="gold-gradient text-primary-foreground font-display px-6 py-4"
            >
              Showdown
            </Button>
            <Button
              onClick={fold}
              variant="outline"
              className="border-casino-red text-casino-red hover:bg-casino-red/20 px-6 py-4"
            >
              Fold
            </Button>
          </div>
        )}

        {phase === 'result' && (
          <Button
            onClick={newGame}
            className="gold-gradient text-primary-foreground font-display text-lg px-8 py-6"
          >
            New Hand
          </Button>
        )}
      </div>

      {/* Hand Rankings Reference */}
      <div className="w-full max-w-md bg-card/50 border border-primary/20 rounded-xl p-4 mt-4">
        <h3 className="text-center font-display text-primary mb-3">Hand Rankings</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {HAND_RANKINGS.map(({ name, multiplier }) => (
            <div key={name} className="flex justify-between text-muted-foreground">
              <span>{name}</span>
              <span className="text-primary">{multiplier}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokerGame;
