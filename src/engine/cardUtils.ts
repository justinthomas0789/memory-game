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

export function getCardById(
  cards: Card[],
  id: string,
): Card | undefined {
  return cards.find((card) => card.id === id);
}
