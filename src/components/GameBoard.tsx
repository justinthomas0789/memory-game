import Card from './Card/Card';
import type { Card as CardType } from '../engine/types';
import {
  isCardFlipped,
  isCardMatched,
  isCardDisabled,
} from '../engine/selectors';
import type { GameState } from '../engine/types';

interface GameBoardProps {
  state: GameState;
  onCardClick: (cardId: string) => void;
  lastMatchResult?: GameState['lastMatchResult'];
}

function GameBoard({ state, onCardClick, lastMatchResult }: GameBoardProps) {
  const { cards } = state;

  // First pick: the single flipped card while status is first_pick (no flip animation)
  function isFirstPick(card: CardType): boolean {
    return (
      state.status === 'first_pick' && state.flippedCardIds[0] === card.id
    );
  }

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
      className="w-full rounded-2xl bg-[var(--color-warm-light)] p-3 shadow-sm"
    >
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
        role="group"
        aria-label="Memory cards"
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={isCardFlipped(state, card.id)}
            isMatched={isCardMatched(state, card.id)}
            isDisabled={isCardDisabled(state, card.id)}
            isFirstPick={isFirstPick(card)}
            onClick={onCardClick}
            animateMatch={getAnimateMatch(card)}
            animateMismatch={getAnimateMismatch(card)}
          />
        ))}
      </div>
    </section>
  );
}

export default GameBoard;
