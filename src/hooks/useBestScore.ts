import { useState, useCallback } from 'react';
import { getBestScore, maybeUpdateBestScore } from '../lib/storage';
import type { BestScore } from '../lib/storage';
import type { CardTheme } from '../engine/constants';

interface UseBestScoreReturn {
  bestScore: BestScore | null;
  submitScore: (moves: number, seconds: number) => boolean;
}

export function useBestScore(theme: CardTheme): UseBestScoreReturn {
  const [bestScore, setBestScore] = useState<BestScore | null>(() =>
    getBestScore(theme),
  );

  const submitScore = useCallback(
    (moves: number, seconds: number): boolean => {
      const isNewBest = maybeUpdateBestScore(theme, moves, seconds);
      if (isNewBest) {
        setBestScore({ moves, seconds });
      }
      return isNewBest;
    },
    [theme],
  );

  return { bestScore, submitScore };
}
