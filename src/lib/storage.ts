import { CARD_THEMES, DIFFICULTIES } from '../engine/constants';
import type { CardTheme, Difficulty } from '../engine/constants';

const KEYS = {
  theme: 'memory-game-theme',
  difficulty: 'memory-game-difficulty',
  darkMode: 'memory-game-dark-mode',
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

// --- Difficulty persistence ---

const VALID_DIFFICULTIES = Object.keys(DIFFICULTIES) as Difficulty[];

export function loadDifficulty(): Difficulty | null {
  try {
    const raw = localStorage.getItem(KEYS.difficulty);
    if (!raw) return null;
    return VALID_DIFFICULTIES.includes(raw as Difficulty)
      ? (raw as Difficulty)
      : null;
  } catch {
    return null;
  }
}

export function saveDifficulty(difficulty: Difficulty): void {
  try {
    localStorage.setItem(KEYS.difficulty, difficulty);
  } catch {
    // private browsing — ignore
  }
}

// --- Dark mode persistence ---

export function loadDarkMode(): boolean | null {
  try {
    const raw = localStorage.getItem(KEYS.darkMode);
    if (raw === null) return null;
    return raw === 'true';
  } catch {
    return null;
  }
}

export function saveDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(KEYS.darkMode, String(isDark));
  } catch {
    // private browsing — ignore
  }
}

// --- Best score per theme + difficulty ---

export interface BestScore {
  moves: number;
  seconds: number;
}

type BestScoreMap = Record<string, BestScore>;

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

export function getBestScore(
  theme: CardTheme,
  difficulty: Difficulty,
): BestScore | null {
  return loadBestScores()[`${theme}-${difficulty}`] ?? null;
}

/**
 * Saves score if it's better than the stored best.
 * "Better" = fewer moves; ties broken by time.
 * Returns true if a new best was set.
 */
export function maybeUpdateBestScore(
  theme: CardTheme,
  difficulty: Difficulty,
  moves: number,
  seconds: number,
): boolean {
  const key = `${theme}-${difficulty}`;
  const scores = loadBestScores();
  const current = scores[key];
  const isNewBest =
    !current ||
    moves < current.moves ||
    (moves === current.moves && seconds < current.seconds);

  if (isNewBest) {
    scores[key] = { moves, seconds };
    saveBestScores(scores);
  }
  return isNewBest;
}
