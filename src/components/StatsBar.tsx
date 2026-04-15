import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '../lib/formatTime';

interface StatsBarProps {
  moves: number;
  elapsedSeconds: number;
  progress: number;
  isCountdown?: boolean;
  isUrgent?: boolean;
}

function StatsBar({
  moves,
  elapsedSeconds,
  progress,
  isCountdown = false,
  isUrgent = false,
}: StatsBarProps) {
  const { t } = useTranslation();
  const progressPercent = Math.round(progress * 100);

  return (
    <div
      className="w-full flex flex-col gap-4 rounded-[var(--radius-panel)] bg-[var(--color-warm-light)] px-6 py-4 shadow-sm border border-[var(--color-warm-dark)]/30"
      role="region"
      aria-label={t('stats.ariaLabel')}
    >
      {/* Stats row */}
      <div className="flex items-center">
        {/* Moves */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth-dark)] font-semibold">
            {t('stats.moves')}
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

        {/* Timer */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth-dark)] font-semibold">
            {isCountdown ? t('stats.countdown') : t('stats.time')}
          </span>
          <span
            className={[
              'text-2xl font-bold tabular-nums leading-none transition-colors duration-300',
              isUrgent
                ? 'text-[var(--color-mismatch-dark)]'
                : 'text-[var(--color-earth-dark)]',
            ].join(' ')}
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
        aria-label={t('stats.progressAriaLabel', { percent: progressPercent })}
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
