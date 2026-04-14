import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card as CardType } from '../../engine/types';
import { EMOJI_NAMES } from '../../engine/constants';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  isMatched: boolean;
  isDisabled: boolean;
  onClick: (cardId: string) => void;
  animateMatch?: boolean;
  animateMismatch?: boolean;
}

function Card({
  card,
  isFlipped,
  isMatched,
  isDisabled,
  onClick,
  animateMatch = false,
  animateMismatch = false,
}: CardProps) {
  const { t } = useTranslation();
  const isRevealed = isFlipped || isMatched;
  const emojiName = EMOJI_NAMES[card.emoji] ?? t('card.fallbackName');

  let ariaLabel: string;
  if (isMatched) {
    ariaLabel = t('card.matched', { name: emojiName });
  } else if (isFlipped) {
    ariaLabel = t('card.faceUp', { name: emojiName });
  } else {
    ariaLabel = t('card.faceDown');
  }

  const cardClass = [
    styles.card,
    isRevealed ? styles.cardFlipped : '',
    isMatched ? styles.cardMatched : '',
    animateMatch ? styles.matchPulse : '',
    animateMismatch ? styles.mismatchShake : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerClass = [
    styles.cardContainer,
    isDisabled ? styles.cardDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleClick() {
    if (!isDisabled) onClick(card.id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled) onClick(card.id);
    }
  }

  return (
    <button
      className={containerClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={isRevealed}
      type="button"
    >
      <div className={cardClass}>
        {/* Face-down side */}
        <div className={styles.cardFront} aria-hidden="true">
          <img
            src="/assets/images/rocket.svg"
            alt=""
            className={styles.cardPattern}
          />
        </div>
        {/* Face-up side */}
        <div className={styles.cardBack} aria-hidden="true">
          <span role="img" aria-hidden="true">
            {card.emoji}
          </span>
        </div>
      </div>
    </button>
  );
}

function areEqual(prev: CardProps, next: CardProps): boolean {
  return (
    prev.card.id === next.card.id &&
    prev.isFlipped === next.isFlipped &&
    prev.isMatched === next.isMatched &&
    prev.isDisabled === next.isDisabled &&
    prev.animateMatch === next.animateMatch &&
    prev.animateMismatch === next.animateMismatch
  );
}

export default memo(Card, areEqual);
