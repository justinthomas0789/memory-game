import { generateDeck } from './cardUtils';
import type { GameState, GameAction } from './types';

export function createInitialState(emojis: string[]): GameState {
  return {
    status: 'ready',
    cards: generateDeck(emojis),
    flippedCardIds: [],
    matchedCardIds: [],
    moves: 0,
    matchStreak: 0,
    lastMatchResult: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
    case 'RESET_GAME':
      return createInitialState(action.payload.emojis);

    case 'FLIP_CARD': {
      const { cardId } = action.payload;

      // Ignore flips during checking or completion
      if (state.status === 'checking' || state.status === 'completed') {
        return state;
      }

      // Ignore if already flipped or matched
      if (
        state.flippedCardIds.includes(cardId) ||
        state.matchedCardIds.includes(cardId)
      ) {
        return state;
      }

      // First card flip
      if (state.flippedCardIds.length === 0) {
        return {
          ...state,
          status: 'first_pick',
          flippedCardIds: [cardId],
        };
      }

      // Second card flip — lock input, increment moves
      if (state.flippedCardIds.length === 1) {
        return {
          ...state,
          status: 'checking',
          flippedCardIds: [...state.flippedCardIds, cardId],
          moves: state.moves + 1,
        };
      }

      return state;
    }

    case 'EVALUATE_MATCH': {
      if (state.status !== 'checking') return state;

      const [firstId, secondId] = state.flippedCardIds;
      const firstCard = state.cards.find((c) => c.id === firstId);
      const secondCard = state.cards.find((c) => c.id === secondId);

      if (!firstCard || !secondCard) return state;

      const isMatch = firstCard.pairId === secondCard.pairId;

      if (isMatch) {
        const newMatchedCardIds = [
          ...state.matchedCardIds,
          firstCard.id,
          secondCard.id,
        ];
        const allMatched = newMatchedCardIds.length === state.cards.length;

        return {
          ...state,
          status: allMatched ? 'completed' : 'ready',
          flippedCardIds: [],
          matchedCardIds: newMatchedCardIds,
          matchStreak: state.matchStreak + 1,
          lastMatchResult: 'match',
        };
      }

      // Mismatch — keep flipped visible, caller dispatches RESOLVE_MISMATCH after delay
      return {
        ...state,
        lastMatchResult: 'mismatch',
      };
    }

    case 'RESOLVE_MATCH':
      return {
        ...state,
        flippedCardIds: [],
        status: state.status === 'completed' ? 'completed' : 'ready',
      };

    case 'RESOLVE_MISMATCH':
      return {
        ...state,
        status: 'ready',
        flippedCardIds: [],
        matchStreak: 0,
        lastMatchResult: 'mismatch',
      };

    default:
      return state;
  }
}
