import type { GameAction } from './types';
import type { CardTheme } from './constants';
import { CARD_THEMES } from './constants';

export function startGame(theme: CardTheme): GameAction {
  return { type: 'START_GAME', payload: { emojis: [...CARD_THEMES[theme]] } };
}

export function flipCard(cardId: string): GameAction {
  return { type: 'FLIP_CARD', payload: { cardId } };
}

export function evaluateMatch(): GameAction {
  return { type: 'EVALUATE_MATCH' };
}

export function resolveMatch(): GameAction {
  return { type: 'RESOLVE_MATCH' };
}

export function resolveMismatch(): GameAction {
  return { type: 'RESOLVE_MISMATCH' };
}

export function resetGame(theme: CardTheme): GameAction {
  return { type: 'RESET_GAME', payload: { emojis: [...CARD_THEMES[theme]] } };
}
