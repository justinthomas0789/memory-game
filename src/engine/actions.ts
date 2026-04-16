import type { GameAction } from './types';
import type { CardTheme, Difficulty } from './constants';
import { CARD_THEMES, DIFFICULTIES } from './constants';

export function startGame(
  theme: CardTheme,
  difficulty: Difficulty,
  seed?: number,
): GameAction {
  const { pairs } = DIFFICULTIES[difficulty];
  return {
    type: 'START_GAME',
    payload: { emojis: [...CARD_THEMES[theme]].slice(0, pairs), seed },
  };
}

export function flipCard(cardId: string): GameAction {
  return { type: 'FLIP_CARD', payload: { cardId } };
}

export function evaluateMatch(): GameAction {
  return { type: 'EVALUATE_MATCH' };
}

export function resolveMismatch(): GameAction {
  return { type: 'RESOLVE_MISMATCH' };
}
