import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TwoPlayerBarProps {
  currentPlayer: 1 | 2;
  scores: [number, number];
  totalPairs: number;
}

function PlayerCard({
  player,
  score,
  isCurrent,
  totalPairs,
}: {
  player: 1 | 2;
  score: number;
  isCurrent: boolean;
  totalPairs: number;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      animate={isCurrent ? { scale: 1.03 } : { scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={[
        'flex-1 flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl border transition-all duration-200',
        isCurrent
          ? 'bg-[var(--color-warm)] border-[var(--color-earth)] shadow-sm'
          : 'bg-[var(--color-warm-light)] border-[var(--color-warm-dark)]/40 opacity-70',
      ].join(' ')}
      role="status"
      aria-label={t('twoPlayer.playerScore', { player, score })}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base" role="img" aria-hidden="true">
          {player === 1 ? '🟡' : '🔵'}
        </span>
        <span className="text-xs font-semibold text-[var(--color-earth)]">
          {t('twoPlayer.player', { n: player })}
        </span>
        {isCurrent && (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-earth)]"
            aria-label={t('twoPlayer.yourTurn')}
          />
        )}
      </div>
      <span
        className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {score}
        <span className="text-xs font-normal text-[var(--color-earth)] ml-0.5">
          /{totalPairs}
        </span>
      </span>
    </motion.div>
  );
}

function TwoPlayerBar({
  currentPlayer,
  scores,
  totalPairs,
}: TwoPlayerBarProps) {
  return (
    <div className="flex gap-3 w-full">
      <PlayerCard
        player={1}
        score={scores[0]}
        isCurrent={currentPlayer === 1}
        totalPairs={totalPairs}
      />
      <PlayerCard
        player={2}
        score={scores[1]}
        isCurrent={currentPlayer === 2}
        totalPairs={totalPairs}
      />
    </div>
  );
}

export default memo(TwoPlayerBar);
