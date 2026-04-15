import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGameTimerOptions {
  isRunning: boolean;
  countdownFrom?: number; // if set, enables countdown mode
  onExpire?: () => void; // called once when countdown reaches 0
}

interface UseGameTimerReturn {
  elapsedSeconds: number; // actual elapsed time (used for score recording)
  displaySeconds: number; // elapsed in classic, remaining in time-attack
  reset: () => void;
}

export function useGameTimer({
  isRunning,
  countdownFrom,
  onExpire,
}: UseGameTimerOptions): UseGameTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasExpiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    startTimeRef.current = Date.now() - elapsedSeconds * 1000;

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);

        // Fire onExpire exactly once when countdown reaches 0
        if (
          countdownFrom !== undefined &&
          elapsed >= countdownFrom &&
          !hasExpiredRef.current
        ) {
          hasExpiredRef.current = true;
          onExpireRef.current?.();
        }
      }
    }, 1000);

    return clearTimer;
    // elapsedSeconds intentionally excluded to avoid resetting on every tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setElapsedSeconds(0);
    startTimeRef.current = null;
    hasExpiredRef.current = false;
  }, []);

  const displaySeconds =
    countdownFrom !== undefined
      ? Math.max(0, countdownFrom - elapsedSeconds)
      : elapsedSeconds;

  return { elapsedSeconds, displaySeconds, reset };
}
