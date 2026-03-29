import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../../engine/gameReducer';
import {
  isCardFlipped,
  isCardMatched,
  isCardDisabled,
  getMatchProgress,
  isGameComplete,
  getFlippedCards,
  getMatchedPairsCount,
} from '../../engine/selectors';
import type { GameState } from '../../engine/types';

const TEST_EMOJIS = ['🦊', '🐼', '🦁', '🐸'];

describe('createInitialState', () => {
  it('creates state with correct number of cards', () => {
    const state = createInitialState(TEST_EMOJIS);
    expect(state.cards).toHaveLength(TEST_EMOJIS.length * 2);
  });

  it('status is ready', () => {
    expect(createInitialState(TEST_EMOJIS).status).toBe('ready');
  });

  it('no cards flipped or matched', () => {
    const state = createInitialState(TEST_EMOJIS);
    expect(state.flippedCardIds).toHaveLength(0);
    expect(state.matchedCardIds).toHaveLength(0);
  });

  it('moves is 0', () => {
    const state = createInitialState(TEST_EMOJIS);
    expect(state.moves).toBe(0);
  });
});

describe('FLIP_CARD', () => {
  it('flips a face-down card and status becomes first_pick', () => {
    const state = createInitialState(TEST_EMOJIS);
    const cardId = state.cards[0]!.id;
    const next = gameReducer(state, { type: 'FLIP_CARD', payload: { cardId } });
    expect(next.flippedCardIds).toContain(cardId);
    expect(next.status).toBe('first_pick');
  });

  it('second flip changes status to checking and increments moves', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!.id;
    const second = state.cards[1]!.id;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: second },
    });
    expect(s2.status).toBe('checking');
    expect(s2.moves).toBe(1);
    expect(s2.flippedCardIds).toHaveLength(2);
  });

  it('cannot flip an already-flipped card', () => {
    const state = createInitialState(TEST_EMOJIS);
    const cardId = state.cards[0]!.id;
    const s1 = gameReducer(state, { type: 'FLIP_CARD', payload: { cardId } });
    const s2 = gameReducer(s1, { type: 'FLIP_CARD', payload: { cardId } });
    expect(s2.flippedCardIds).toHaveLength(1);
  });

  it('cannot flip a third card when status is checking', () => {
    const state = createInitialState(TEST_EMOJIS);
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[0]!.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[1]!.id },
    });
    expect(s2.status).toBe('checking');
    const s3 = gameReducer(s2, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[2]!.id },
    });
    expect(s3.flippedCardIds).toHaveLength(2);
  });

  it('cannot flip when game is completed', () => {
    const state: GameState = {
      ...createInitialState(TEST_EMOJIS),
      status: 'completed',
    };
    const next = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[0]!.id },
    });
    expect(next.status).toBe('completed');
    expect(next.flippedCardIds).toHaveLength(0);
  });
});

describe('EVALUATE_MATCH — matching pair', () => {
  it('matching cards move to matchedCardIds and result is match', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const match = state.cards.find(
      (c) => c.pairId === first.pairId && c.id !== first.id,
    )!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: match.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    expect(s3.matchedCardIds).toContain(first.id);
    expect(s3.matchedCardIds).toContain(match.id);
    expect(s3.lastMatchResult).toBe('match');
    expect(s3.flippedCardIds).toHaveLength(0);
  });
});

describe('EVALUATE_MATCH — non-matching pair', () => {
  it('mismatch: result is mismatch', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const second = state.cards.find((c) => c.pairId !== first.pairId)!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: second.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    expect(s3.lastMatchResult).toBe('mismatch');
  });
});

describe('RESOLVE_MISMATCH', () => {
  it('clears flippedCardIds and status becomes ready', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const second = state.cards.find((c) => c.pairId !== first.pairId)!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: second.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    const s4 = gameReducer(s3, { type: 'RESOLVE_MISMATCH' });
    expect(s4.flippedCardIds).toHaveLength(0);
    expect(s4.status).toBe('ready');
  });
});

describe('Game completion', () => {
  it('status becomes completed when all pairs are matched', () => {
    let state = createInitialState(TEST_EMOJIS);
    const visited = new Set<string>();
    for (const card of state.cards) {
      if (visited.has(card.pairId)) continue;
      const pair = state.cards.find(
        (c) => c.pairId === card.pairId && c.id !== card.id,
      )!;
      state = gameReducer(state, {
        type: 'FLIP_CARD',
        payload: { cardId: card.id },
      });
      state = gameReducer(state, {
        type: 'FLIP_CARD',
        payload: { cardId: pair.id },
      });
      state = gameReducer(state, { type: 'EVALUATE_MATCH' });
      visited.add(card.pairId);
    }
    expect(state.status).toBe('completed');
  });
});

describe('START_GAME', () => {
  it('resets all counters and generates fresh deck', () => {
    let state = createInitialState(TEST_EMOJIS);
    state = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[0]!.id },
    });
    state = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[1]!.id },
    });
    const reset = gameReducer(state, {
      type: 'START_GAME',
      payload: { emojis: TEST_EMOJIS },
    });
    expect(reset.status).toBe('ready');
    expect(reset.moves).toBe(0);
    expect(reset.flippedCardIds).toHaveLength(0);
    expect(reset.matchedCardIds).toHaveLength(0);
    expect(reset.cards).toHaveLength(TEST_EMOJIS.length * 2);
  });
});

describe('Selectors', () => {
  it('isCardFlipped returns true only for flipped cards', () => {
    const state = createInitialState(TEST_EMOJIS);
    const cardId = state.cards[0]!.id;
    const s1 = gameReducer(state, { type: 'FLIP_CARD', payload: { cardId } });
    expect(isCardFlipped(s1, cardId)).toBe(true);
    expect(isCardFlipped(s1, state.cards[1]!.id)).toBe(false);
  });

  it('isCardMatched returns true after match', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const pair = state.cards.find(
      (c) => c.pairId === first.pairId && c.id !== first.id,
    )!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: pair.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    expect(isCardMatched(s3, first.id)).toBe(true);
    expect(isCardMatched(s3, pair.id)).toBe(true);
  });

  it('isCardDisabled is true during checking for unflipped cards', () => {
    const state = createInitialState(TEST_EMOJIS);
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[0]!.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: state.cards[1]!.id },
    });
    expect(s2.status).toBe('checking');
    expect(isCardDisabled(s2, state.cards[2]!.id)).toBe(true);
  });

  it('getMatchProgress returns correct ratio', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const pair = state.cards.find(
      (c) => c.pairId === first.pairId && c.id !== first.id,
    )!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: pair.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    expect(getMatchProgress(s3)).toBeCloseTo(0.25);
  });

  it('isGameComplete returns true only when completed', () => {
    const state = createInitialState(TEST_EMOJIS);
    expect(isGameComplete(state)).toBe(false);
    const completed: GameState = { ...state, status: 'completed' };
    expect(isGameComplete(completed)).toBe(true);
  });

  it('getFlippedCards returns the flipped card objects', () => {
    const state = createInitialState(TEST_EMOJIS);
    const cardId = state.cards[0]!.id;
    const s1 = gameReducer(state, { type: 'FLIP_CARD', payload: { cardId } });
    const flipped = getFlippedCards(s1);
    expect(flipped).toHaveLength(1);
    expect(flipped[0]!.id).toBe(cardId);
  });

  it('resets lastMatchResult to null on first flip of a new turn', () => {
    const state = createInitialState(TEST_EMOJIS);
    const a = state.cards[0]!;
    const b = state.cards.find((c) => c.pairId !== a.pairId)!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: a.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: b.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    const s4 = gameReducer(s3, { type: 'RESOLVE_MISMATCH' });
    expect(s4.lastMatchResult).toBe('mismatch');

    const s5 = gameReducer(s4, {
      type: 'FLIP_CARD',
      payload: { cardId: a.id },
    });
    expect(s5.lastMatchResult).toBeNull();
  });

  it('getMatchedPairsCount returns correct count', () => {
    const state = createInitialState(TEST_EMOJIS);
    const first = state.cards[0]!;
    const pair = state.cards.find(
      (c) => c.pairId === first.pairId && c.id !== first.id,
    )!;
    const s1 = gameReducer(state, {
      type: 'FLIP_CARD',
      payload: { cardId: first.id },
    });
    const s2 = gameReducer(s1, {
      type: 'FLIP_CARD',
      payload: { cardId: pair.id },
    });
    const s3 = gameReducer(s2, { type: 'EVALUATE_MATCH' });
    expect(getMatchedPairsCount(s3)).toBe(1);
  });
});
