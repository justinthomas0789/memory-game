import { useState, useCallback } from 'react';
import { loadUnlocked, checkAndUnlock } from '../lib/achievements';
import type { AchievementId, AchievementContext } from '../lib/achievements';

export interface AchievementToast {
  id: string; // unique toast instance id
  achievementId: AchievementId;
}

export function useAchievements() {
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(() =>
    loadUnlocked(),
  );

  const checkAchievements = useCallback((ctx: AchievementContext) => {
    const newIds = checkAndUnlock(ctx);
    if (newIds.length === 0) return;

    setUnlocked(loadUnlocked());
    setToasts((prev) => [
      ...prev,
      ...newIds.map((achievementId) => ({
        id: `${achievementId}-${Date.now()}`,
        achievementId,
      })),
    ]);
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  return { unlocked, toasts, checkAchievements, dismissToast };
}
