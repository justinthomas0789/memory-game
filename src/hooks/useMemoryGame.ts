import { useReducer, useCallback, useEffect, useRef } from 'react';
import { gameReducer, createInitialState } from '../engine/gameReducer';
import {
  flipCard,
  evaluateMatch,
  resolveMismatch,
  startGame,
} from '../engine/actions';
import {
  isGameComplete,
  getMatchProgress,
  getMatchedPairsCount,
} from '../engine/selectors';
import {
  DEFAULT_CONFIG,
  CARD_THEMES,
  DEFAULT_THEME,
} from '../engine/constants';
import type { CardTheme } from '../engine/constants';
import type { GameState } from '../engine/types';

interface UseMemoryGameOptions {
  theme?: CardTheme;
}

interface UseMemoryGameReturn {
  state: GameState;
  flipCardById: (cardId: string) => void;
  startNewGame: () => void;
  isComplete: boolean;
  progress: number;
  moves: number;
  matchStreak: number;
  lastMatchResult: GameState['lastMatchResult'];
  matchedPairsCount: number;
  totalPairs: number;
}

export function useMemoryGame(
  options: UseMemoryGameOptions = {},
): UseMemoryGameReturn {
  const theme = options.theme ?? DEFAULT_THEME;
  const emojis = [...CARD_THEMES[theme]];

  const [state, dispatch] = useReducer(gameReducer, emojis, createInitialState);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Restart game when theme changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch(startGame(theme));
  }, [theme]);

  // When status becomes 'checking', schedule EVALUATE_MATCH after delay
  useEffect(() => {
    if (state.status !== 'checking') return;

    timeoutRef.current = setTimeout(() => {
      dispatch(evaluateMatch());
    }, DEFAULT_CONFIG.matchCheckDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.status, state.flippedCardIds]);

  // After EVALUATE_MATCH, resolve mismatch (cards are still shown face-up)
  useEffect(() => {
    if (
      state.lastMatchResult === 'mismatch' &&
      state.flippedCardIds.length === 2
    ) {
      timeoutRef.current = setTimeout(() => {
        dispatch(resolveMismatch());
      }, DEFAULT_CONFIG.matchCheckDelay / 2);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [state.lastMatchResult, state.flippedCardIds.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flipCardById = useCallback((cardId: string) => {
    dispatch(flipCard(cardId));
  }, []);

  const startNewGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch(startGame(theme));
  }, [theme]);

  return {
    state,
    flipCardById,
    startNewGame,
    isComplete: isGameComplete(state),
    progress: getMatchProgress(state),
    moves: state.moves,
    matchStreak: state.matchStreak,
    lastMatchResult: state.lastMatchResult,
    matchedPairsCount: getMatchedPairsCount(state),
    totalPairs: emojis.length,
  };
}
