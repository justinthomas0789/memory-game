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

function StatsBar({
  moves,
  elapsedSeconds,
  matchStreak,
  progress,
}: StatsBarProps) {
  const progressPercent = Math.round(progress * 100);

  return (
    <div
      className="w-full flex flex-col gap-4 rounded-[var(--radius-panel)] bg-[var(--color-warm-light)] px-6 py-4 shadow-sm border border-[var(--color-warm-dark)]/30"
      role="region"
      aria-label="Game statistics"
    >
      {/* Stats row */}
      <div className="flex items-center">
        {/* Moves */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold">
            Moves
          </span>
          <span
            className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums leading-none"
            style={{ fontFamily: 'var(--font-mono)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {moves}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-[var(--color-warm-dark)]/40" />

        {/* Streak (center) */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {matchStreak >= 2 ? (
            <>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-streak-dark)] font-semibold">
                Streak
              </span>
              <span
                className="text-2xl font-bold text-[var(--color-streak-dark)] tabular-nums leading-none"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-live="polite"
              >
                🔥{matchStreak}
              </span>
            </>
          ) : (
            <span className="text-xl text-[var(--color-warm-dark)] leading-none mt-auto">
              ·
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-[var(--color-warm-dark)]/40" />

        {/* Timer */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold">
            Time
          </span>
          <span
            className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums leading-none"
            style={{ fontFamily: 'var(--font-mono)' }}
            aria-live="off"
          >
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full bg-[var(--color-warm-dark)]/40 overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progressPercent}% complete`}
      >
        <div
          className="h-full rounded-full bg-[var(--color-match-dark)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default memo(StatsBar);
