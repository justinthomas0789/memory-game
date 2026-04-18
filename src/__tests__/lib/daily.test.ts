import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getDayNumber,
  getDailyDateString,
  getDailyConfig,
} from '../../lib/daily';
import { CARD_THEMES } from '../../engine/constants';

const EPOCH_MS = new Date('2025-01-01').getTime();
const MS_PER_DAY = 86_400_000;

afterEach(() => {
  vi.useRealTimers();
});

describe('getDayNumber', () => {
  it('returns 0 on the epoch date (2025-01-01)', () => {
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    expect(getDayNumber()).toBe(0);
  });

  it('returns 1 on 2025-01-02', () => {
    vi.setSystemTime(new Date('2025-01-02T00:00:00Z'));
    expect(getDayNumber()).toBe(1);
  });

  it('returns a positive integer for any date after the epoch', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    const day = getDayNumber();
    expect(day).toBeGreaterThan(0);
    expect(Number.isInteger(day)).toBe(true);
  });

  it('increments exactly once per day', () => {
    vi.setSystemTime(EPOCH_MS + MS_PER_DAY * 100);
    expect(getDayNumber()).toBe(100);
  });
});

describe('getDailyDateString', () => {
  it('returns a YYYY-MM-DD string', () => {
    vi.setSystemTime(new Date('2026-04-18T15:30:00Z'));
    const str = getDailyDateString();
    expect(str).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns the current UTC date', () => {
    vi.setSystemTime(new Date('2026-04-18T00:00:00Z'));
    expect(getDailyDateString()).toBe('2026-04-18');
  });
});

describe('getDailyConfig', () => {
  it('returns difficulty always medium', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    expect(getDailyConfig().difficulty).toBe('medium');
  });

  it('returns a valid theme from CARD_THEMES', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    const { theme } = getDailyConfig();
    expect(Object.keys(CARD_THEMES)).toContain(theme);
  });

  it('returns a non-zero seed', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    expect(getDailyConfig().seed).toBeGreaterThan(0);
  });

  it('returns the same config for the same date regardless of time-of-day', () => {
    vi.setSystemTime(new Date('2026-04-18T06:00:00Z'));
    const morning = getDailyConfig();

    vi.setSystemTime(new Date('2026-04-18T23:59:00Z'));
    const evening = getDailyConfig();

    expect(morning.seed).toBe(evening.seed);
    expect(morning.theme).toBe(evening.theme);
    expect(morning.dayNumber).toBe(evening.dayNumber);
  });

  it('returns different seeds for different dates', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    const day1 = getDailyConfig();

    vi.setSystemTime(new Date('2026-04-19T10:00:00Z'));
    const day2 = getDailyConfig();

    expect(day1.seed).not.toBe(day2.seed);
  });

  it('cycles through all themes and wraps around', () => {
    const totalThemes = Object.keys(CARD_THEMES).length;
    const themes = new Set<string>();

    for (let i = 0; i < totalThemes; i++) {
      vi.setSystemTime(EPOCH_MS + MS_PER_DAY * i);
      themes.add(getDailyConfig().theme);
    }

    expect(themes.size).toBe(totalThemes);
  });

  it('dateString matches the active day', () => {
    vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
    expect(getDailyConfig().dateString).toBe('2026-04-18');
  });
});
