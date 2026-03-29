import { motion } from 'framer-motion';
import Card from './Card/Card';
import {
  isCardFlipped,
  isCardMatched,
  isCardDisabled,
} from '../engine/selectors';
import type { Card as CardType, GameState } from '../engine/types';

interface GameBoardProps {
  state: GameState;
  onCardClick: (cardId: string) => void;
  lastMatchResult?: GameState['lastMatchResult'];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      type: 'spring',
      damping: 18,
      stiffness: 280,
    },
  }),
};

function GameBoard({ state, onCardClick, lastMatchResult }: GameBoardProps) {
  const { cards } = state;
  // The first card's ID changes when a new deck is dealt — use it to key the animations
  const deckKey = cards[0]?.id ?? '';

  function getAnimateMatch(card: CardType): boolean {
    return (
      lastMatchResult === 'match' &&
      state.matchedCardIds.includes(card.id) &&
      // Only animate the most recently matched pair (last 2 in matchedCardIds)
      state.matchedCardIds.slice(-2).includes(card.id)
    );
  }

  function getAnimateMismatch(card: CardType): boolean {
    return (
      lastMatchResult === 'mismatch' && state.flippedCardIds.includes(card.id)
    );
  }

  return (
    <section
      aria-label="Game board"
      className="w-full rounded-2xl bg-[var(--color-warm-light)] p-3 shadow-sm border border-[var(--color-warm-dark)]/30"
    >
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        role="group"
        aria-label="Memory cards"
      >
        {cards.map((card, i) => (
          <motion.div
            key={`${deckKey}-${card.id}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              card={card}
              isFlipped={isCardFlipped(state, card.id)}
              isMatched={isCardMatched(state, card.id)}
              isDisabled={isCardDisabled(state, card.id)}
              onClick={onCardClick}
              animateMatch={getAnimateMatch(card)}
              animateMismatch={getAnimateMismatch(card)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default GameBoard;
