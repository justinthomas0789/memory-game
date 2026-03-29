export interface Card {
  id: string;
  pairId: string;
  emoji: string;
}

export type GameStatus =
  | 'idle'
  | 'ready'
  | 'first_pick'
  | 'checking'
  | 'completed';

export interface GameState {
  status: GameStatus;
  cards: Card[];
  flippedCardIds: string[];
  matchedCardIds: string[];
  moves: number;
  matchStreak: number;
  lastMatchResult: 'match' | 'mismatch' | null;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { emojis: string[] } }
  | { type: 'FLIP_CARD'; payload: { cardId: string } }
  | { type: 'EVALUATE_MATCH' }
  | { type: 'RESOLVE_MISMATCH' };

export interface GameConfig {
  rows: number;
  cols: number;
  matchCheckDelay: number;
}
