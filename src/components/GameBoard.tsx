import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from './Card/Card';
import {
  isCardFlipped,
  isCardMatched,
  isCardDisabled,
} from '../engine/selectors';
import type { Card as CardType, GameState } from '../engine/types';

const COLS = 4;

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
  const deckKey = cards[0]?.id ?? '';
  const gridRef = useRef<HTMLDivElement>(null);

  function getAnimateMatch(card: CardType): boolean {
    return (
      lastMatchResult === 'match' &&
      state.matchedCardIds.includes(card.id) &&
      state.matchedCardIds.slice(-2).includes(card.id)
    );
  }

  function getAnimateMismatch(card: CardType): boolean {
    return (
      lastMatchResult === 'mismatch' && state.flippedCardIds.includes(card.id)
    );
  }

  function handleGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      return;
    e.preventDefault();

    const grid = gridRef.current;
    if (!grid) return;

    const buttons = Array.from(
      grid.querySelectorAll<HTMLButtonElement>('button'),
    );
    const focused = document.activeElement;
    const currentIndex = buttons.indexOf(focused as HTMLButtonElement);
    if (currentIndex === -1) {
      buttons[0]?.focus();
      return;
    }

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight')
      nextIndex = Math.min(currentIndex + 1, buttons.length - 1);
    if (e.key === 'ArrowLeft') nextIndex = Math.max(currentIndex - 1, 0);
    if (e.key === 'ArrowDown')
      nextIndex = Math.min(currentIndex + COLS, buttons.length - 1);
    if (e.key === 'ArrowUp') nextIndex = Math.max(currentIndex - COLS, 0);

    buttons[nextIndex]?.focus();
  }

  return (
    <section
      aria-label="Game board"
      className="w-full rounded-2xl bg-[var(--color-warm-light)] p-3 shadow-sm border border-[var(--color-warm-dark)]/30"
    >
      <div
        ref={gridRef}
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        role="group"
        aria-label="Memory cards"
        onKeyDown={handleGridKeyDown}
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

export default memo(GameBoard);
