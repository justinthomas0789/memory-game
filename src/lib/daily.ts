import type { CardTheme, Difficulty } from '../engine/constants';
import { CARD_THEMES } from '../engine/constants';

const EPOCH = new Date('2025-01-01').getTime();
const MS_PER_DAY = 86_400_000;

export function getDayNumber(): number {
  return Math.floor((Date.now() - EPOCH) / MS_PER_DAY);
}

export function getDailyDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

export interface DailyConfig {
  dayNumber: number;
  dateString: string;
  theme: CardTheme;
  difficulty: Difficulty;
  seed: number;
}

export function getDailyConfig(): DailyConfig {
  const dateString = getDailyDateString();
  const dayNumber = getDayNumber();
  const seed = hashString(dateString);

  const themes = Object.keys(CARD_THEMES) as CardTheme[];
  const theme = themes[dayNumber % themes.length]!;
  const difficulty: Difficulty = 'medium';

  return { dayNumber, dateString, theme, difficulty, seed };
}
