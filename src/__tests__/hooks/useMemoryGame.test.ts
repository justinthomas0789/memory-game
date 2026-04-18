import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMemoryGame } from '../../hooks/useMemoryGame';

describe('useMemoryGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initial state is ready with correct card count', () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));
    expect(result.current.state.status).toBe('ready');
    expect(result.current.state.cards).toHaveLength(16);
    expect(result.current.moves).toBe(0);
  });

  it('flipCardById flips a card and updates state', () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));
    const cardId = result.current.state.cards[0]!.id;

    act(() => {
      result.current.flipCardById(cardId);
    });

    expect(result.current.state.flippedCardIds).toContain(cardId);
    expect(result.current.state.status).toBe('first_pick');
  });

  it('two matching cards are resolved as matched after delay', async () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));
    const first = result.current.state.cards[0]!;
    const match = result.current.state.cards.find(
      (c) => c.pairId === first.pairId && c.id !== first.id,
    )!;

    act(() => {
      result.current.flipCardById(first.id);
    });
    act(() => {
      result.current.flipCardById(match.id);
    });

    expect(result.current.state.status).toBe('checking');

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.state.matchedCardIds).toContain(first.id);
    expect(result.current.state.matchedCardIds).toContain(match.id);
    expect(result.current.state.lastMatchResult).toBe('match');
  });

  it('two non-matching cards are resolved as mismatched after delay', async () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));
    const first = result.current.state.cards[0]!;
    const nonMatch = result.current.state.cards.find(
      (c) => c.pairId !== first.pairId,
    )!;

    act(() => {
      result.current.flipCardById(first.id);
    });
    act(() => {
      result.current.flipCardById(nonMatch.id);
    });

    expect(result.current.state.status).toBe('checking');

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.state.lastMatchResult).toBe('mismatch');

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.state.flippedCardIds).toHaveLength(0);
    expect(result.current.state.status).toBe('ready');
  });

  it('cannot flip more than 2 cards simultaneously', () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));

    act(() => {
      result.current.flipCardById(result.current.state.cards[0]!.id);
    });
    act(() => {
      result.current.flipCardById(result.current.state.cards[1]!.id);
    });
    act(() => {
      result.current.flipCardById(result.current.state.cards[2]!.id);
    });

    expect(result.current.state.flippedCardIds).toHaveLength(2);
  });

  it('moves counter increments after each pair attempt', () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));

    act(() => {
      result.current.flipCardById(result.current.state.cards[0]!.id);
    });
    act(() => {
      result.current.flipCardById(result.current.state.cards[1]!.id);
    });

    expect(result.current.moves).toBe(1);
  });

  it('startNewGame resets the game with fresh cards', async () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));

    act(() => {
      result.current.flipCardById(result.current.state.cards[0]!.id);
    });
    act(() => {
      result.current.flipCardById(result.current.state.cards[1]!.id);
    });

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.moves).toBe(0);
    expect(result.current.state.flippedCardIds).toHaveLength(0);
    expect(result.current.state.matchedCardIds).toHaveLength(0);
    expect(result.current.state.status).toBe('ready');
  });

  it('matchedPairsCount and totalPairs are correct', () => {
    const { result } = renderHook(() => useMemoryGame({ theme: 'animals' }));
    expect(result.current.matchedPairsCount).toBe(0);
    expect(result.current.totalPairs).toBe(8);
  });

  it('seed option produces a deterministic card order', () => {
    const { result: r1 } = renderHook(() =>
      useMemoryGame({ theme: 'animals', seed: 12345 }),
    );
    const { result: r2 } = renderHook(() =>
      useMemoryGame({ theme: 'animals', seed: 12345 }),
    );
    const order1 = r1.current.state.cards.map((c) => c.emoji).join(',');
    const order2 = r2.current.state.cards.map((c) => c.emoji).join(',');
    expect(order1).toBe(order2);
  });

  it('different seeds produce different card orders', () => {
    const orders = new Set(
      [1, 2, 3, 4, 5].map((seed) => {
        const { result } = renderHook(() =>
          useMemoryGame({ theme: 'animals', seed }),
        );
        return result.current.state.cards.map((c) => c.emoji).join(',');
      }),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});
