import type { GameState, Card } from './types';

export function isCardFlipped(state: GameState, cardId: string): boolean {
  return state.flippedCardIds.includes(cardId);
}

export function isCardMatched(state: GameState, cardId: string): boolean {
  return state.matchedCardIds.includes(cardId);
}

export function isCardDisabled(state: GameState, cardId: string): boolean {
  return (
    isCardFlipped(state, cardId) ||
    isCardMatched(state, cardId) ||
    state.status === 'checking' ||
    state.status === 'completed'
  );
}

export function getMatchProgress(state: GameState): number {
  if (state.cards.length === 0) return 0;
  return state.matchedCardIds.length / state.cards.length;
}

export function isGameComplete(state: GameState): boolean {
  return state.status === 'completed';
}

export function getFlippedCards(state: GameState): Card[] {
  return state.cards.filter((card) =>
    state.flippedCardIds.includes(card.id),
  );
}

export function getMatchedPairsCount(state: GameState): number {
  return state.matchedCardIds.length / 2;
}
