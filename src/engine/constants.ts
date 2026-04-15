import type { GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  rows: 4,
  cols: 4,
  matchCheckDelay: 800,
} as const;

export const CARD_THEMES = {
  animals: ['🦊', '🐼', '🦁', '🐸', '🐙', '🦋', '🐢', '🦉', '🐨', '🦩'],
  space: ['🚀', '🌍', '🌙', '⭐', '🪐', '☄️', '👾', '🛸', '🔭', '🌠'],
  food: ['🍕', '🍣', '🍩', '🍉', '🌮', '🧁', '🍜', '🫐', '🍔', '🍦'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🥊', '🏆'],
  nature: ['🌸', '🌻', '🌈', '🍄', '🌊', '🔥', '❄️', '🌴', '🌵', '🍀'],
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export const DEFAULT_THEME: CardTheme = 'animals';

export const DIFFICULTIES = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 4, pairs: 8 },
  hard: { rows: 5, cols: 4, pairs: 10 },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export const STAR_THRESHOLDS: Record<
  Difficulty,
  { three: number; two: number }
> = {
  easy: { three: 10, two: 14 },
  medium: { three: 16, two: 24 },
  hard: { three: 24, two: 36 },
};

export const EMOJI_NAMES: Record<string, string> = {
  '🦊': 'Fox',
  '🐼': 'Panda',
  '🦁': 'Lion',
  '🐸': 'Frog',
  '🐙': 'Octopus',
  '🦋': 'Butterfly',
  '🐢': 'Turtle',
  '🦉': 'Owl',
  '🐨': 'Koala',
  '🦩': 'Flamingo',
  '🚀': 'Rocket',
  '🌍': 'Earth',
  '🌙': 'Moon',
  '⭐': 'Star',
  '🪐': 'Planet',
  '☄️': 'Comet',
  '👾': 'Alien',
  '🛸': 'UFO',
  '🔭': 'Telescope',
  '🌠': 'Shooting Star',
  '🍕': 'Pizza',
  '🍣': 'Sushi',
  '🍩': 'Donut',
  '🍉': 'Watermelon',
  '🌮': 'Taco',
  '🧁': 'Cupcake',
  '🍜': 'Noodles',
  '🫐': 'Blueberry',
  '🍔': 'Hamburger',
  '🍦': 'Ice Cream',
  '⚽': 'Soccer',
  '🏀': 'Basketball',
  '🏈': 'Football',
  '⚾': 'Baseball',
  '🎾': 'Tennis',
  '🏐': 'Volleyball',
  '🎱': 'Billiards',
  '🏓': 'Ping Pong',
  '🥊': 'Boxing Glove',
  '🏆': 'Trophy',
  '🌸': 'Cherry Blossom',
  '🌻': 'Sunflower',
  '🌈': 'Rainbow',
  '🍄': 'Mushroom',
  '🌊': 'Wave',
  '🔥': 'Fire',
  '❄️': 'Snowflake',
  '🌴': 'Palm Tree',
  '🌵': 'Cactus',
  '🍀': 'Four Leaf Clover',
};
