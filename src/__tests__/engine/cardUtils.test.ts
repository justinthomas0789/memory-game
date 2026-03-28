import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  generateDeck,
  getCardById,
  generateId,
} from '../../engine/cardUtils';

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique ids on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('shuffleArray', () => {
  it('returns a new array (not the same reference)', () => {
    const original = [1, 2, 3, 4];
    const shuffled = shuffleArray(original);
    expect(shuffled).not.toBe(original);
  });

  it('returns an array with the same length', () => {
    const original = [1, 2, 3, 4, 5];
    expect(shuffleArray(original)).toHaveLength(5);
  });

  it('returns an array with the same elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled.sort()).toEqual([...original].sort());
  });

  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it('produces different orders across multiple shuffles', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8];
    const results = new Set(
      Array.from({ length: 20 }, () => shuffleArray(original).join(',')),
    );
    // With 8 elements, 20 shuffles should almost certainly produce >1 unique order
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('generateDeck', () => {
  const emojis = ['🦊', '🐼', '🦁', '🐸'];

  it('creates correct number of cards (emojis.length * 2)', () => {
    const deck = generateDeck(emojis);
    expect(deck).toHaveLength(emojis.length * 2);
  });

  it('every card has a unique id', () => {
    const deck = generateDeck(emojis);
    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(deck.length);
  });

  it('every emoji appears exactly twice', () => {
    const deck = generateDeck(emojis);
    for (const emoji of emojis) {
      const count = deck.filter((c) => c.emoji === emoji).length;
      expect(count).toBe(2);
    }
  });

  it('cards with same emoji share the same pairId', () => {
    const deck = generateDeck(emojis);
    for (const emoji of emojis) {
      const pair = deck.filter((c) => c.emoji === emoji);
      expect(pair[0]?.pairId).toBe(pair[1]?.pairId);
    }
  });

  it('cards with different emojis have different pairIds', () => {
    const deck = generateDeck(emojis);
    const pairIds = emojis.map(
      (emoji) => deck.find((c) => c.emoji === emoji)?.pairId,
    );
    const uniquePairIds = new Set(pairIds);
    expect(uniquePairIds.size).toBe(emojis.length);
  });
});

describe('getCardById', () => {
  const deck = generateDeck(['🦊', '🐼']);

  it('returns correct card for valid id', () => {
    const firstCard = deck[0];
    if (!firstCard) throw new Error('deck is empty');
    const found = getCardById(deck, firstCard.id);
    expect(found).toBe(firstCard);
  });

  it('returns undefined for non-existent id', () => {
    expect(getCardById(deck, 'nonexistent-id')).toBeUndefined();
  });
});
