import { CARD_THEMES } from '../engine/constants';
import type { CardTheme } from '../engine/constants';

const KEYS = {
  theme: 'memory-game-theme',
  bestScores: 'memory-game-best-scores',
} as const;

// --- Theme persistence ---

export function loadTheme(): CardTheme | null {
  try {
    const raw = localStorage.getItem(KEYS.theme);
    if (!raw) return null;
    return (Object.keys(CARD_THEMES) as CardTheme[]).includes(raw as CardTheme)
      ? (raw as CardTheme)
      : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: CardTheme): void {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    // private browsing — ignore
  }
}

// --- Best score per theme ---

export interface BestScore {
  moves: number;
  seconds: number;
}

type BestScoreMap = Partial<Record<CardTheme, BestScore>>;

function loadBestScores(): BestScoreMap {
  try {
    const raw = localStorage.getItem(KEYS.bestScores);
    if (!raw) return {};
    return JSON.parse(raw) as BestScoreMap;
  } catch {
    return {};
  }
}

function saveBestScores(scores: BestScoreMap): void {
  try {
    localStorage.setItem(KEYS.bestScores, JSON.stringify(scores));
  } catch {
    // private browsing — ignore
  }
}

export function getBestScore(theme: CardTheme): BestScore | null {
  return loadBestScores()[theme] ?? null;
}

/**
 * Saves score if it's better than the stored best.
 * "Better" = fewer moves; ties broken by time.
 * Returns true if a new best was set.
 */
export function maybeUpdateBestScore(
  theme: CardTheme,
  moves: number,
  seconds: number,
): boolean {
  const scores = loadBestScores();
  const current = scores[theme];
  const isNewBest =
    !current ||
    moves < current.moves ||
    (moves === current.moves && seconds < current.seconds);

  if (isNewBest) {
    scores[theme] = { moves, seconds };
    saveBestScores(scores);
  }
  return isNewBest;
}
