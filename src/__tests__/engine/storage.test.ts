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
    expect(getBestScore('animals')).toBeNull();
  });

  it('saves the first score as best', () => {
    maybeUpdateBestScore('animals', 18, 60);
    expect(getBestScore('animals')).toEqual({ moves: 18, seconds: 60 });
  });

  it('replaces best when new score has fewer moves', () => {
    maybeUpdateBestScore('animals', 20, 90);
    maybeUpdateBestScore('animals', 16, 120);
    expect(getBestScore('animals')).toEqual({ moves: 16, seconds: 120 });
  });

  it('keeps existing best when new score has more moves', () => {
    maybeUpdateBestScore('animals', 16, 60);
    maybeUpdateBestScore('animals', 22, 40);
    expect(getBestScore('animals')).toEqual({ moves: 16, seconds: 60 });
  });

  it('breaks ties in moves by time', () => {
    maybeUpdateBestScore('animals', 16, 80);
    maybeUpdateBestScore('animals', 16, 60);
    expect(getBestScore('animals')).toEqual({ moves: 16, seconds: 60 });
  });

  it('returns true for a new best', () => {
    expect(maybeUpdateBestScore('animals', 14, 50)).toBe(true);
  });

  it('returns false when score does not beat existing best', () => {
    maybeUpdateBestScore('animals', 14, 50);
    expect(maybeUpdateBestScore('animals', 20, 40)).toBe(false);
  });

  it('tracks scores independently per theme', () => {
    maybeUpdateBestScore('animals', 16, 60);
    maybeUpdateBestScore('space', 20, 90);
    expect(getBestScore('animals')).toEqual({ moves: 16, seconds: 60 });
    expect(getBestScore('space')).toEqual({ moves: 20, seconds: 90 });
    expect(getBestScore('food')).toBeNull();
  });
});
