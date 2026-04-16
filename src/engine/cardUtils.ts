import type { Card } from './types';

let idCounter = 0;

export function generateId(): string {
  idCounter += 1;
  return `card-${idCounter}-${Date.now()}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    const swapTarget = result[j];
    if (temp !== undefined && swapTarget !== undefined) {
      result[i] = swapTarget;
      result[j] = temp;
    }
  }
  return result;
}

export function generateDeck(emojis: string[]): Card[] {
  const pairs: Card[] = emojis.flatMap((emoji) => {
    const pairId = `pair-${emoji}`;
    return [
      { id: generateId(), pairId, emoji },
      { id: generateId(), pairId, emoji },
    ];
  });
  return shuffleArray(pairs);
}

// mulberry32 PRNG seeded by a uint32
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDeckSeeded(emojis: string[], seed: number): Card[] {
  const rng = mulberry32(seed);
  const pairs: Card[] = emojis.flatMap((emoji) => {
    const pairId = `pair-${emoji}`;
    return [
      { id: generateId(), pairId, emoji },
      { id: generateId(), pairId, emoji },
    ];
  });
  // Fisher-Yates with seeded RNG
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = pairs[i];
    const swap = pairs[j];
    if (temp !== undefined && swap !== undefined) {
      pairs[i] = swap;
      pairs[j] = temp;
    }
  }
  return pairs;
}

export function getCardById(cards: Card[], id: string): Card | undefined {
  return cards.find((card) => card.id === id);
}
