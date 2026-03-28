import type { GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  rows: 4,
  cols: 4,
  matchCheckDelay: 800,
} as const;

export const CARD_THEMES = {
  animals: ['🦊', '🐼', '🦁', '🐸', '🐙', '🦋', '🐢', '🦉'],
  space: ['🚀', '🌍', '🌙', '⭐', '🪐', '☄️', '👾', '🛸'],
  food: ['🍕', '🍣', '🍩', '🍉', '🌮', '🧁', '🍜', '🫐'],
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export const DEFAULT_THEME: CardTheme = 'animals';

export const EMOJI_NAMES: Record<string, string> = {
  '🦊': 'Fox',
  '🐼': 'Panda',
  '🦁': 'Lion',
  '🐸': 'Frog',
  '🐙': 'Octopus',
  '🦋': 'Butterfly',
  '🐢': 'Turtle',
  '🦉': 'Owl',
  '🚀': 'Rocket',
  '🌍': 'Earth',
  '🌙': 'Moon',
  '⭐': 'Star',
  '🪐': 'Planet',
  '☄️': 'Comet',
  '👾': 'Alien',
  '🛸': 'UFO',
  '🍕': 'Pizza',
  '🍣': 'Sushi',
  '🍩': 'Donut',
  '🍉': 'Watermelon',
  '🌮': 'Taco',
  '🧁': 'Cupcake',
  '🍜': 'Noodles',
  '🫐': 'Blueberry',
};
