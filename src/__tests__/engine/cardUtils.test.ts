import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  generateDeck,
  getCardById,
  generateId,
  mulberry32,
  generateDeckSeeded,
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

describe('mulberry32', () => {
  it('returns a function that produces numbers in [0, 1)', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 20; i++) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('produces the same sequence for the same seed', () => {
    const seq1 = Array.from({ length: 10 }, mulberry32(12345));
    const seq2 = Array.from({ length: 10 }, mulberry32(12345));
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const seq1 = Array.from({ length: 5 }, mulberry32(1));
    const seq2 = Array.from({ length: 5 }, mulberry32(2));
    expect(seq1).not.toEqual(seq2);
  });

  it('produces a uniform-ish distribution (no value > 0.999)', () => {
    const rng = mulberry32(999);
    const values = Array.from({ length: 1000 }, () => rng());
    expect(Math.max(...values)).toBeLessThan(1);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
  });
});

describe('generateDeckSeeded', () => {
  const emojis = ['🦊', '🐼', '🦁', '🐸'];

  it('creates correct number of cards', () => {
    expect(generateDeckSeeded(emojis, 42)).toHaveLength(emojis.length * 2);
  });

  it('every emoji appears exactly twice', () => {
    const deck = generateDeckSeeded(emojis, 42);
    for (const emoji of emojis) {
      expect(deck.filter((c) => c.emoji === emoji)).toHaveLength(2);
    }
  });

  it('produces the same order for the same seed', () => {
    const deck1 = generateDeckSeeded(emojis, 99);
    const deck2 = generateDeckSeeded(emojis, 99);
    expect(deck1.map((c) => c.emoji)).toEqual(deck2.map((c) => c.emoji));
  });

  it('produces different orders for different seeds', () => {
    const orders = new Set(
      [1, 2, 3, 4, 5].map((seed) =>
        generateDeckSeeded(emojis, seed)
          .map((c) => c.emoji)
          .join(','),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  it('each card has a unique id', () => {
    const deck = generateDeckSeeded(emojis, 42);
    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(deck.length);
  });

  it('paired cards share the same pairId', () => {
    const deck = generateDeckSeeded(emojis, 42);
    for (const emoji of emojis) {
      const pair = deck.filter((c) => c.emoji === emoji);
      expect(pair[0]?.pairId).toBe(pair[1]?.pairId);
    }
  });
});
