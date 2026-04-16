import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS, ACHIEVEMENT_IDS } from '../lib/achievements';
import type { AchievementId } from '../lib/achievements';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unlocked: Set<AchievementId>;
}

export default function AchievementsPanel({
  isOpen,
  onClose,
  unlocked,
}: AchievementsPanelProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="achievements-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(74, 55, 40, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('achievements.panelAriaLabel')}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="w-full max-w-sm rounded-3xl bg-[var(--color-cream)] shadow-2xl p-6 flex flex-col gap-5 border border-[var(--color-warm-dark)]/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2
                className="text-2xl font-bold text-[var(--color-earth-dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('achievements.title')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-earth)] hover:bg-[var(--color-warm)] transition-colors"
                aria-label={t('achievements.close')}
              >
                ✕
              </button>
            </div>

            {/* Progress */}
            <p className="text-sm text-[var(--color-earth)] -mt-2">
              {t('achievements.progress', {
                count: unlocked.size,
                total: ACHIEVEMENT_IDS.length,
              })}
            </p>

            {/* Badge grid */}
            <div className="flex flex-col gap-3">
              {ACHIEVEMENT_IDS.map((id) => {
                const achievement = ACHIEVEMENTS[id];
                const isUnlocked = unlocked.has(id);
                return (
                  <div
                    key={id}
                    className={[
                      'flex items-center gap-4 p-3 rounded-2xl border transition-all',
                      isUnlocked
                        ? 'bg-[var(--color-warm-light)] border-[var(--color-warm-dark)]/40'
                        : 'bg-[var(--color-warm-light)]/40 border-[var(--color-warm-dark)]/20 opacity-50',
                    ].join(' ')}
                  >
                    <span
                      className="text-3xl"
                      style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}
                      role="img"
                      aria-hidden="true"
                    >
                      {achievement.icon}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-bold text-[var(--color-earth-dark)]">
                        {t(achievement.nameKey)}
                      </span>
                      <span className="text-xs text-[var(--color-earth)]">
                        {isUnlocked
                          ? t('achievements.earned')
                          : t(achievement.descKey)}
                      </span>
                    </div>
                    {isUnlocked && (
                      <span className="ml-auto text-lg" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
