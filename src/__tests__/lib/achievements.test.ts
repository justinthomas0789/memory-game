import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkAndUnlock,
  loadUnlocked,
  ACHIEVEMENT_IDS,
} from '../../lib/achievements';
import type { AchievementContext } from '../../lib/achievements';
import { CARD_THEMES } from '../../engine/constants';

const BASE_CTX: AchievementContext = {
  elapsedSeconds: 90,
  moves: 10,
  totalPairs: 8,
  theme: 'animals',
  isDaily: false,
  stars: 2,
};

beforeEach(() => {
  localStorage.clear();
});

describe('checkAndUnlock — speedDemon', () => {
  it('unlocks when elapsed < 60s', () => {
    const result = checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 59 });
    expect(result).toContain('speedDemon');
  });

  it('does not unlock when elapsed === 60s', () => {
    const result = checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 60 });
    expect(result).not.toContain('speedDemon');
  });

  it('does not unlock when elapsed > 60s', () => {
    const result = checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 120 });
    expect(result).not.toContain('speedDemon');
  });

  it('does not unlock a second time if already earned', () => {
    checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 30 });
    const second = checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 30 });
    expect(second).not.toContain('speedDemon');
  });
});

describe('checkAndUnlock — perfectionist', () => {
  it('unlocks when moves === totalPairs', () => {
    const result = checkAndUnlock({ ...BASE_CTX, moves: 8, totalPairs: 8 });
    expect(result).toContain('perfectionist');
  });

  it('does not unlock when moves > totalPairs', () => {
    const result = checkAndUnlock({ ...BASE_CTX, moves: 9, totalPairs: 8 });
    expect(result).not.toContain('perfectionist');
  });
});

describe('checkAndUnlock — hatTrick', () => {
  it('unlocks when stars === 3', () => {
    const result = checkAndUnlock({ ...BASE_CTX, stars: 3 });
    expect(result).toContain('hatTrick');
  });

  it('does not unlock for 2 stars', () => {
    const result = checkAndUnlock({ ...BASE_CTX, stars: 2 });
    expect(result).not.toContain('hatTrick');
  });
});

describe('checkAndUnlock — dailyPlayer', () => {
  it('unlocks when isDaily is true', () => {
    const result = checkAndUnlock({ ...BASE_CTX, isDaily: true });
    expect(result).toContain('dailyPlayer');
  });

  it('does not unlock for non-daily games', () => {
    const result = checkAndUnlock({ ...BASE_CTX, isDaily: false });
    expect(result).not.toContain('dailyPlayer');
  });
});

describe('checkAndUnlock — explorer', () => {
  it('unlocks after playing all themes', () => {
    const themes = Object.keys(
      CARD_THEMES,
    ) as (typeof CARD_THEMES extends Record<infer K, unknown> ? K : never)[];
    let last: string[] = [];
    for (const theme of themes) {
      last = checkAndUnlock({ ...BASE_CTX, theme });
    }
    expect(last).toContain('explorer');
  });

  it('does not unlock if not all themes played', () => {
    const result = checkAndUnlock({ ...BASE_CTX, theme: 'animals' });
    expect(result).not.toContain('explorer');
  });
});

describe('loadUnlocked', () => {
  it('returns empty set when nothing stored', () => {
    expect(loadUnlocked().size).toBe(0);
  });

  it('persists unlocked achievements across calls', () => {
    checkAndUnlock({ ...BASE_CTX, elapsedSeconds: 30 });
    const loaded = loadUnlocked();
    expect(loaded.has('speedDemon')).toBe(true);
  });
});

describe('ACHIEVEMENT_IDS', () => {
  it('contains all 5 achievement keys', () => {
    expect(ACHIEVEMENT_IDS).toHaveLength(5);
    expect(ACHIEVEMENT_IDS).toContain('speedDemon');
    expect(ACHIEVEMENT_IDS).toContain('perfectionist');
    expect(ACHIEVEMENT_IDS).toContain('explorer');
    expect(ACHIEVEMENT_IDS).toContain('hatTrick');
    expect(ACHIEVEMENT_IDS).toContain('dailyPlayer');
  });
});

describe('multiple achievements in one game', () => {
  it('can unlock several achievements simultaneously', () => {
    const result = checkAndUnlock({
      elapsedSeconds: 45,
      moves: 8,
      totalPairs: 8,
      theme: 'animals',
      isDaily: true,
      stars: 3,
    });
    expect(result).toContain('speedDemon');
    expect(result).toContain('perfectionist');
    expect(result).toContain('hatTrick');
    expect(result).toContain('dailyPlayer');
  });
});
