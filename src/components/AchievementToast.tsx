import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS } from '../lib/achievements';
import type { AchievementToast as AchievementToastType } from '../hooks/useAchievements';

interface AchievementToastListProps {
  toasts: AchievementToastType[];
  onDismiss: (id: string) => void;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: AchievementToastType;
  onDismiss: (id: string) => void;
}) {
  const { t } = useTranslation();
  const achievement = ACHIEVEMENTS[toast.achievementId];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-[var(--color-warm-dark)]/40 bg-[var(--color-cream)] cursor-pointer max-w-xs"
      onClick={() => onDismiss(toast.id)}
      role="status"
      aria-live="polite"
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {achievement.icon}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-earth)] font-semibold">
          {t('achievements.unlocked')}
        </span>
        <span className="text-sm font-bold text-[var(--color-earth-dark)] truncate">
          {t(achievement.nameKey)}
        </span>
      </div>
    </motion.div>
  );
}

export default function AchievementToastList({
  toasts,
  onDismiss,
}: AchievementToastListProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
