import { useState, useCallback, useEffect } from 'react';
import { getBestScore, maybeUpdateBestScore } from '../lib/storage';
import type { BestScore } from '../lib/storage';
import type { CardTheme, Difficulty } from '../engine/constants';

interface UseBestScoreReturn {
  bestScore: BestScore | null;
  submitScore: (moves: number, seconds: number) => boolean;
}

export function useBestScore(
  theme: CardTheme,
  difficulty: Difficulty,
): UseBestScoreReturn {
  const [bestScore, setBestScore] = useState<BestScore | null>(() =>
    getBestScore(theme, difficulty),
  );

  // Reload best score when theme or difficulty changes
  useEffect(() => {
    setBestScore(getBestScore(theme, difficulty));
  }, [theme, difficulty]);

  const submitScore = useCallback(
    (moves: number, seconds: number): boolean => {
      const isNewBest = maybeUpdateBestScore(theme, difficulty, moves, seconds);
      if (isNewBest) {
        setBestScore({ moves, seconds });
      }
      return isNewBest;
    },
    [theme, difficulty],
  );

  return { bestScore, submitScore };
}
