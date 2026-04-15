import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadTheme,
  saveTheme,
  getBestScore,
  maybeUpdateBestScore,
} from '../../lib/storage';

beforeEach(() => {
  localStorage.clear();
});

describe('loadTheme / saveTheme', () => {
  it('returns null when nothing is stored', () => {
    expect(loadTheme()).toBeNull();
  });

  it('returns the saved theme', () => {
    saveTheme('space');
    expect(loadTheme()).toBe('space');
  });

  it('overwrites the previous theme', () => {
    saveTheme('animals');
    saveTheme('food');
    expect(loadTheme()).toBe('food');
  });
});

describe('getBestScore / maybeUpdateBestScore', () => {
  it('returns null when no score stored', () => {
    expect(getBestScore('animals', 'medium')).toBeNull();
  });

  it('saves the first score as best', () => {
    maybeUpdateBestScore('animals', 'medium', 18, 60);
    expect(getBestScore('animals', 'medium')).toEqual({
      moves: 18,
      seconds: 60,
    });
  });

  it('replaces best when new score has fewer moves', () => {
    maybeUpdateBestScore('animals', 'medium', 20, 90);
    maybeUpdateBestScore('animals', 'medium', 16, 120);
    expect(getBestScore('animals', 'medium')).toEqual({
      moves: 16,
      seconds: 120,
    });
  });

  it('keeps existing best when new score has more moves', () => {
    maybeUpdateBestScore('animals', 'medium', 16, 60);
    maybeUpdateBestScore('animals', 'medium', 22, 40);
    expect(getBestScore('animals', 'medium')).toEqual({
      moves: 16,
      seconds: 60,
    });
  });

  it('breaks ties in moves by time', () => {
    maybeUpdateBestScore('animals', 'medium', 16, 80);
    maybeUpdateBestScore('animals', 'medium', 16, 60);
    expect(getBestScore('animals', 'medium')).toEqual({
      moves: 16,
      seconds: 60,
    });
  });

  it('returns true for a new best', () => {
    expect(maybeUpdateBestScore('animals', 'medium', 14, 50)).toBe(true);
  });

  it('returns false when score does not beat existing best', () => {
    maybeUpdateBestScore('animals', 'medium', 14, 50);
    expect(maybeUpdateBestScore('animals', 'medium', 20, 40)).toBe(false);
  });

  it('tracks scores independently per theme', () => {
    maybeUpdateBestScore('animals', 'medium', 16, 60);
    maybeUpdateBestScore('space', 'medium', 20, 90);
    expect(getBestScore('animals', 'medium')).toEqual({
      moves: 16,
      seconds: 60,
    });
    expect(getBestScore('space', 'medium')).toEqual({ moves: 20, seconds: 90 });
    expect(getBestScore('food', 'medium')).toBeNull();
  });
});
