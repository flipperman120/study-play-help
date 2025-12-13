import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Hand, { CardType } from './Hand';
import BetSelector from '@/components/casino/BetSelector';
import { useCasino } from '@/contexts/CasinoContext';
import { soundManager } from '@/utils/sounds';
import { cn } from '@/lib/utils';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

type GameState = 'betting' | 'playing' | 'dealer-turn' | 'finished';

const createDeck = (): CardType[] => {
  const deck: CardType[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const getCardValue = (card: CardType): number => {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
};

const calculateScore = (cards: CardType[]): number => {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.value === 'A') aces++;
    score += getCardValue(card);
  }

  // Adjust for aces
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};

const BlackjackGame = () => {
  const { chips, addChips, removeChips } = useCasino();
  const [bet, setBet] = useState(50);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [message, setMessage] = useState('');

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  const dealerVisibleScore =
    gameState === 'playing' && dealerHand.length > 0
      ? getCardValue(dealerHand[1])
      : dealerScore;

  const drawCard = useCallback((): CardType | undefined => {
    setDeck((prev) => {
      if (prev.length === 0) return createDeck();
      return prev;
    });
    const card = deck[0];
    setDeck((prev) => prev.slice(1));
    return card;
  }, [deck]);

  const dealCards = () => {
    if (!removeChips(bet)) return;

    soundManager.buttonClick();
    const newDeck = createDeck();
    
    const playerCards = [newDeck[0], newDeck[2]];
    const dealerCards = [newDeck[1], newDeck[3]];

    setDeck(newDeck.slice(4));
    setPlayerHand([]);
    setDealerHand([]);
    setMessage('');

    // Animate dealing
    setTimeout(() => {
      soundManager.cardDeal();
      setPlayerHand([playerCards[0]]);
    }, 200);
    setTimeout(() => {
      soundManager.cardDeal();
      setDealerHand([dealerCards[0]]);
    }, 400);
    setTimeout(() => {
      soundManager.cardDeal();
      setPlayerHand([playerCards[0], playerCards[1]]);
    }, 600);
    setTimeout(() => {
      soundManager.cardDeal();
      setDealerHand([dealerCards[0], dealerCards[1]]);
      setGameState('playing');

      // Check for blackjack
      const pScore = calculateScore(playerCards);
      if (pScore === 21) {
        setGameState('dealer-turn');
      }
    }, 800);
  };

  const hit = () => {
    soundManager.cardDeal();
    const card = deck[0];
    setDeck((prev) => prev.slice(1));
    setPlayerHand((prev) => [...prev, card]);
  };

  const stand = () => {
    soundManager.buttonClick();
    setGameState('dealer-turn');
  };

  const doubleDown = () => {
    if (chips >= bet) {
      removeChips(bet);
      setBet((prev) => prev * 2);
      soundManager.chipPlace();
      hit();
      setTimeout(() => {
        setGameState('dealer-turn');
      }, 500);
    }
  };

  // Check for player bust
  useEffect(() => {
    if (gameState === 'playing' && playerScore > 21) {
      soundManager.bust();
      setMessage('BUST!');
      setGameState('finished');
    }
  }, [playerScore, gameState]);

  // Dealer's turn
  useEffect(() => {
    if (gameState === 'dealer-turn') {
      const playDealer = async () => {
        let currentHand = [...dealerHand];
        let currentDeck = [...deck];

        const dealerPlay = () => {
          const score = calculateScore(currentHand);
          if (score < 17) {
            soundManager.cardDeal();
            const card = currentDeck[0];
            currentDeck = currentDeck.slice(1);
            currentHand = [...currentHand, card];
            setDealerHand(currentHand);
            setDeck(currentDeck);
            setTimeout(dealerPlay, 700);
          } else {
            // Determine winner
            const finalDealerScore = calculateScore(currentHand);
            const finalPlayerScore = playerScore;

            setTimeout(() => {
              if (finalDealerScore > 21) {
                setMessage('DEALER BUSTS! YOU WIN!');
                soundManager.win();
                addChips(bet * 2);
              } else if (finalPlayerScore === 21 && playerHand.length === 2 && finalDealerScore !== 21) {
                setMessage('BLACKJACK!');
                soundManager.blackjack();
                addChips(bet * 2.5);
              } else if (finalPlayerScore > finalDealerScore) {
                setMessage('YOU WIN!');
                soundManager.win();
                addChips(bet * 2);
              } else if (finalPlayerScore < finalDealerScore) {
                setMessage('DEALER WINS');
                soundManager.lose();
              } else {
                setMessage('PUSH');
                addChips(bet);
              }
              setGameState('finished');
            }, 300);
          }
        };

        setTimeout(dealerPlay, 500);
      };

      playDealer();
    }
  }, [gameState]);

  const newGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setMessage('');
    setGameState('betting');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Table */}
      <div className="w-full max-w-lg felt-texture rounded-2xl p-6 sm:p-8 border-4 border-casino-gold-dark shadow-2xl">
        {/* Dealer's Hand */}
        <div className="mb-8">
          <Hand
            cards={dealerHand}
            hideFirst={gameState === 'playing'}
            label="Dealer"
            score={gameState === 'playing' ? '?' : dealerHand.length > 0 ? dealerScore : undefined}
          />
        </div>

        {/* Message */}
        <div className="h-16 flex items-center justify-center my-4">
          {message && (
            <div
              className={cn(
                'text-2xl sm:text-3xl font-display vegas-text-glow animate-bounce-win',
                message.includes('WIN') || message === 'BLACKJACK!'
                  ? 'text-primary'
                  : message === 'PUSH'
                  ? 'text-muted-foreground'
                  : 'text-destructive'
              )}
            >
              {message}
            </div>
          )}
        </div>

        {/* Player's Hand */}
        <div className="mt-8">
          <Hand cards={playerHand} label="Your Hand" score={playerHand.length > 0 ? playerScore : undefined} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {gameState === 'betting' && (
          <>
            <BetSelector bet={bet} onBetChange={setBet} />
            <Button
              size="lg"
              onClick={dealCards}
              disabled={chips < bet}
              className="w-full max-w-[200px] h-14 text-xl font-display gold-gradient text-primary-foreground hover:opacity-90 transition-all vegas-glow"
            >
              DEAL
            </Button>
          </>
        )}

        {gameState === 'playing' && (
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={hit}
              className="min-w-[100px] bg-casino-green hover:bg-casino-green-light text-foreground"
            >
              HIT
            </Button>
            <Button
              size="lg"
              onClick={stand}
              variant="outline"
              className="min-w-[100px] border-primary/50 hover:bg-primary/10"
            >
              STAND
            </Button>
            <Button
              size="lg"
              onClick={doubleDown}
              disabled={chips < bet}
              className="min-w-[100px] bg-secondary hover:bg-casino-red-light text-secondary-foreground"
            >
              DOUBLE
            </Button>
          </div>
        )}

        {gameState === 'finished' && (
          <Button
            size="lg"
            onClick={newGame}
            className="w-full max-w-[200px] h-14 text-xl font-display gold-gradient text-primary-foreground hover:opacity-90 transition-all vegas-glow"
          >
            NEW GAME
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;
