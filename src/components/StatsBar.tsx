import { memo } from 'react';

interface StatsBarProps {
  moves: number;
  elapsedSeconds: number;
  matchStreak: number;
  progress: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function StatsBar({ moves, elapsedSeconds, matchStreak, progress }: StatsBarProps) {
  const progressPercent = Math.round(progress * 100);

  return (
    <div
      className="w-full flex flex-col gap-2"
      role="region"
      aria-label="Game statistics"
    >
      {/* Stats row */}
      <div className="flex items-center justify-between px-1">
        {/* Moves */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span
            className="text-xs uppercase tracking-wide text-[var(--color-earth)] font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Moves
          </span>
          <span
            className="text-lg font-semibold text-[var(--color-earth-dark)] tabular-nums"
            style={{ fontFamily: 'var(--font-mono)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {moves}
          </span>
        </div>

        {/* Streak (center) */}
        <div className="flex flex-col items-center min-w-[60px]">
          {matchStreak >= 2 ? (
            <>
              <span className="text-xs uppercase tracking-wide text-[var(--color-streak-dark)] font-medium">
                Streak
              </span>
              <span
                className="text-lg font-semibold text-[var(--color-streak-dark)] tabular-nums"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-live="polite"
              >
                🔥 {matchStreak}
              </span>
            </>
          ) : (
            <span className="text-xs text-[var(--color-warm-dark)]">—</span>
          )}
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span
            className="text-xs uppercase tracking-wide text-[var(--color-earth)] font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Time
          </span>
          <span
            className="text-lg font-semibold text-[var(--color-earth-dark)] tabular-nums"
            style={{ fontFamily: 'var(--font-mono)' }}
            aria-live="off"
          >
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 rounded-full bg-[var(--color-warm-dark)] overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progressPercent}% complete`}
      >
        <div
          className="h-full rounded-full bg-[var(--color-match-dark)] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default memo(StatsBar);
