import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '../lib/formatTime';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from './ui/Button';
import { STAR_THRESHOLDS } from '../engine/constants';
import type { Difficulty } from '../engine/constants';
import type { BestScore } from '../lib/storage';

interface CompletionOverlayProps {
  difficulty: Difficulty;
  isVisible: boolean;
  isTimeUp?: boolean;
  moves: number;
  elapsedSeconds: number;
  bestScore: BestScore | null;
  onPlayAgain: () => void;
  isDaily?: boolean;
  dayNumber?: number;
  twoPlayerScores?: [number, number];
}

export default function CompletionOverlay({
  isVisible,
  isTimeUp = false,
  moves,
  elapsedSeconds,
  bestScore,
  difficulty,
  onPlayAgain,
  isDaily = false,
  dayNumber = 0,
  twoPlayerScores,
}: CompletionOverlayProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const isTwoPlayer = twoPlayerScores !== undefined;
  const { three, two } = STAR_THRESHOLDS[difficulty];
  const stars = moves <= three ? 3 : moves <= two ? 2 : 1;

  // Two-player result
  const twoPlayerWinner =
    isTwoPlayer && twoPlayerScores
      ? twoPlayerScores[0] > twoPlayerScores[1]
        ? 1
        : twoPlayerScores[1] > twoPlayerScores[0]
          ? 2
          : 0 // tie
      : null;
  const isNewBest =
    !bestScore ||
    moves < bestScore.moves ||
    (moves === bestScore.moves && elapsedSeconds <= bestScore.seconds);

  const handleShare = useCallback(async () => {
    const starEmojis = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const text = [
      `Memory Game Daily #${dayNumber}`,
      `${starEmojis} | ${moves} moves | ${formatTime(elapsedSeconds)}`,
      window.location.origin,
    ].join('\n');

    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [stars, dayNumber, moves, elapsedSeconds]);

  useEffect(() => {
    if (!isVisible || isTwoPlayer) return;
    const end = Date.now() + 3000;
    const colors = [
      '#e8b86d',
      '#4a3728',
      '#2d6b45',
      '#c4956a',
      '#a0c878',
      '#f4c542',
      '#e05c2a',
      '#5b8dee',
      '#e84393',
      '#ffffff',
      '#ff6b6b',
      '#48dbfb',
      '#1dd1a1',
      '#feca57',
      '#a29bfe',
    ];
    (function frame() {
      confetti({
        particleCount: 14,
        angle: 90,
        spread: 80,
        origin: { x: 0.5, y: 0 },
        colors,
        scalar: 1.4,
        gravity: 1.5,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [isVisible, isTwoPlayer]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="completion-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(74, 55, 40, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('completion.ariaLabel')}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              delay: 0.1,
            }}
            className="w-full max-w-xs rounded-3xl bg-[var(--color-cream)] shadow-2xl p-8 flex flex-col items-center gap-5 border border-[var(--color-warm-dark)]/40"
          >
            {/* Winner heading */}
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 300,
                delay: 0.15,
              }}
              className="text-4xl font-bold text-[var(--color-earth-dark)] tracking-tight text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {isTwoPlayer
                ? twoPlayerWinner === 0
                  ? t('twoPlayer.tie')
                  : t('twoPlayer.playerWins', { player: twoPlayerWinner })
                : isTimeUp
                  ? t('completion.timeUp')
                  : isDaily
                    ? t('completion.dailyTitle', { day: dayNumber })
                    : t('completion.winner')}
            </motion.h2>

            {isTwoPlayer && twoPlayerScores ? (
              /* Two-player score breakdown */
              <div className="w-full flex justify-around py-3 rounded-2xl bg-[var(--color-warm-light)] border border-[var(--color-warm-dark)]/30">
                {([1, 2] as const).map((p) => (
                  <div key={p} className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold flex items-center gap-1">
                      <span aria-hidden="true">{p === 1 ? '🟡' : '🔵'}</span>
                      {t('completion.p' + p)}
                    </span>
                    <span
                      className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {twoPlayerScores[p - 1]}
                      <span className="text-xs font-normal text-[var(--color-earth)] ml-0.5">
                        {t('twoPlayer.pairs')}
                      </span>
                    </span>
                    {twoPlayerWinner === p && (
                      <span className="text-xs text-[var(--color-earth)]">
                        👑
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Stars */}
                <motion.div
                  className="flex gap-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.3,
                      },
                    },
                  }}
                  aria-label={t('completion.starsAriaLabel', { stars })}
                >
                  {[1, 2, 3].map((n) => (
                    <motion.span
                      key={n}
                      variants={{
                        hidden: { scale: 0, rotate: -30 },
                        visible: { scale: 1, rotate: 0 },
                      }}
                      transition={{
                        type: 'spring',
                        damping: 12,
                        stiffness: 400,
                      }}
                      className="text-4xl"
                      style={{
                        filter:
                          n <= stars ? 'none' : 'grayscale(1) opacity(0.3)',
                      }}
                      aria-hidden="true"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>

                {/* Subtitle */}
                <p className="text-sm text-[var(--color-earth)] -mt-2">
                  {isTimeUp
                    ? t('completion.timesUpSub')
                    : isNewBest
                      ? t('completion.newBest')
                      : t('completion.allMatched')}
                </p>

                {/* Stats */}
                <div className="w-full flex justify-around py-3 rounded-2xl bg-[var(--color-warm-light)] border border-[var(--color-warm-dark)]/30">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold">
                      {t('completion.moves')}
                    </span>
                    <span
                      className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {moves}
                    </span>
                  </div>
                  <div className="w-px bg-[var(--color-warm-dark)]/40" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold">
                      {t('completion.time')}
                    </span>
                    <span
                      className="text-2xl font-bold text-[var(--color-earth-dark)] tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {formatTime(elapsedSeconds)}
                    </span>
                  </div>
                </div>

                {/* Best score */}
                {bestScore && !isNewBest && (
                  <p className="text-xs text-[var(--color-earth)] text-center">
                    {t('completion.best')}{' '}
                    <span
                      style={{ fontFamily: 'var(--font-mono)' }}
                      className="font-semibold"
                    >
                      {t('completion.bestMoves', { moves: bestScore.moves })}
                    </span>
                    {' · '}
                    <span
                      style={{ fontFamily: 'var(--font-mono)' }}
                      className="font-semibold"
                    >
                      {formatTime(bestScore.seconds)}
                    </span>
                  </p>
                )}
              </>
            )}

            {/* Share (daily only) */}
            {isDaily && !isTimeUp && (
              <Button
                variant="primary"
                size="md"
                onClick={handleShare}
                className="w-full"
              >
                {copied ? t('completion.copied') : t('completion.shareButton')}
              </Button>
            )}

            {/* Play again */}
            <Button
              variant="primary"
              size="md"
              onClick={onPlayAgain}
              className="w-full"
            >
              {t('completion.playAgain')}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
