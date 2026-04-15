import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './Card/Card';
import {
  isCardFlipped,
  isCardMatched,
  isCardDisabled,
} from '../engine/selectors';
import type { Card as CardType, GameState } from '../engine/types';

interface GameBoardProps {
  cols?: number;
  state: GameState;
  onCardClick: (cardId: string) => void;
  lastMatchResult?: GameState['lastMatchResult'];
}

function GameBoard({
  state,
  onCardClick,
  lastMatchResult,
  cols = 4,
}: GameBoardProps) {
  const { t } = useTranslation();
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
      nextIndex = Math.min(currentIndex + cols, buttons.length - 1);
    if (e.key === 'ArrowUp') nextIndex = Math.max(currentIndex - cols, 0);

    buttons[nextIndex]?.focus();
  }

  return (
    <section
      aria-label={t('board.ariaLabel')}
      className="w-full rounded-[var(--radius-panel)] bg-[var(--color-warm-light)] p-4 shadow-sm border border-[var(--color-warm-dark)]/30"
    >
      <div
        ref={gridRef}
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        role="group"
        aria-label={t('board.cardsAriaLabel')}
        onKeyDown={handleGridKeyDown}
      >
        {cards.map((card, i) => (
          <div
            key={`${deckKey}-${card.id}`}
            className="card-entrance"
            style={{ '--card-delay': `${i * 0.04}s` } as React.CSSProperties}
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(GameBoard);
