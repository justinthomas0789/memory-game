import type { CardTheme } from '../engine/constants';
import { CARD_THEMES } from '../engine/constants';

// --- Achievement definitions ---

export const ACHIEVEMENTS = {
  speedDemon: {
    id: 'speedDemon' as const,
    icon: '⚡',
    nameKey: 'achievements.speedDemon.name',
    descKey: 'achievements.speedDemon.desc',
  },
  perfectionist: {
    id: 'perfectionist' as const,
    icon: '💎',
    nameKey: 'achievements.perfectionist.name',
    descKey: 'achievements.perfectionist.desc',
  },
  explorer: {
    id: 'explorer' as const,
    icon: '🗺️',
    nameKey: 'achievements.explorer.name',
    descKey: 'achievements.explorer.desc',
  },
  hatTrick: {
    id: 'hatTrick' as const,
    icon: '🌟',
    nameKey: 'achievements.hatTrick.name',
    descKey: 'achievements.hatTrick.desc',
  },
  dailyPlayer: {
    id: 'dailyPlayer' as const,
    icon: '📅',
    nameKey: 'achievements.dailyPlayer.name',
    descKey: 'achievements.dailyPlayer.desc',
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;
export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];

// --- Storage ---

const KEYS = {
  unlocked: 'memory-game-achievements',
  themesPlayed: 'memory-game-themes-played',
} as const;

export function loadUnlocked(): Set<AchievementId> {
  try {
    const raw = localStorage.getItem(KEYS.unlocked);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as AchievementId[]);
  } catch {
    return new Set();
  }
}

function saveUnlocked(ids: Set<AchievementId>): void {
  try {
    localStorage.setItem(KEYS.unlocked, JSON.stringify([...ids]));
  } catch {
    // private browsing — ignore
  }
}

function loadThemesPlayed(): Set<CardTheme> {
  try {
    const raw = localStorage.getItem(KEYS.themesPlayed);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as CardTheme[]);
  } catch {
    return new Set();
  }
}

function saveThemesPlayed(themes: Set<CardTheme>): void {
  try {
    localStorage.setItem(KEYS.themesPlayed, JSON.stringify([...themes]));
  } catch {
    // private browsing — ignore
  }
}

// --- Check logic ---

export interface AchievementContext {
  elapsedSeconds: number;
  moves: number;
  totalPairs: number;
  theme: CardTheme;
  isDaily: boolean;
  stars: number;
}

/**
 * Checks which new achievements were unlocked by this game result.
 * Mutates localStorage and returns the newly-unlocked IDs.
 */
export function checkAndUnlock(ctx: AchievementContext): AchievementId[] {
  const unlocked = loadUnlocked();
  const newlyUnlocked: AchievementId[] = [];

  function tryUnlock(id: AchievementId) {
    if (!unlocked.has(id)) {
      unlocked.add(id);
      newlyUnlocked.push(id);
    }
  }

  // Speed Demon: complete in under 60 seconds
  if (ctx.elapsedSeconds < 60) tryUnlock('speedDemon');

  // Perfectionist: no mismatches (moves === totalPairs)
  if (ctx.moves === ctx.totalPairs) tryUnlock('perfectionist');

  // Hat Trick: 3 stars
  if (ctx.stars === 3) tryUnlock('hatTrick');

  // Daily Player: complete the daily challenge
  if (ctx.isDaily) tryUnlock('dailyPlayer');

  // Explorer: played all themes (update themes-played set first)
  const themes = loadThemesPlayed();
  themes.add(ctx.theme);
  saveThemesPlayed(themes);
  const allThemes = Object.keys(CARD_THEMES) as CardTheme[];
  if (allThemes.every((t) => themes.has(t))) tryUnlock('explorer');

  if (newlyUnlocked.length > 0) saveUnlocked(unlocked);
  return newlyUnlocked;
}
