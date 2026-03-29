import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGameTimerReturn {
  elapsedSeconds: number;
  reset: () => void;
}

export function useGameTimer(isRunning: boolean): UseGameTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
  }, []);

  return { elapsedSeconds, reset };
}
