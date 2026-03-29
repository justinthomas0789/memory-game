import { useCallback, useRef, useState } from 'react';

const MUTE_STORAGE_KEY = 'memory-game-muted';

function loadMutedState(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveMutedState(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch {
    // private browsing — ignore
  }
}

interface UseSoundManagerReturn {
  playFlip: () => void;
  playMatch: () => void;
  playMismatch: () => void;
  playComplete: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export function useSoundManager(): UseSoundManagerReturn {
  const [isMuted, setIsMuted] = useState<boolean>(loadMutedState);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = 'sine',
      gainPeak = 0.3,
      startTime?: number,
    ) => {
      if (isMuted) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + (startTime ?? 0));
        gainNode.gain.setValueAtTime(0, ctx.currentTime + (startTime ?? 0));
        gainNode.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + (startTime ?? 0) + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + (startTime ?? 0) + duration,
        );
        oscillator.start(ctx.currentTime + (startTime ?? 0));
        oscillator.stop(ctx.currentTime + (startTime ?? 0) + duration);
      } catch {
        // AudioContext error — silently skip
      }
    },
    [isMuted, getContext],
  );

  const playFlip = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.2);
  }, [playTone]);

  const playMatch = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.3);
    playTone(784, 0.2, 'sine', 0.3, 0.1);
  }, [playTone]);

  const playMismatch = useCallback(() => {
    playTone(200, 0.15, 'sine', 0.2);
  }, [playTone]);

  const playComplete = useCallback(() => {
    // C-E-G-C arpeggio
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      playTone(freq, 0.15, 'sine', 0.25, i * 0.12);
    });
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      saveMutedState(next);
      return next;
    });
  }, []);

  return { playFlip, playMatch, playMismatch, playComplete, isMuted, toggleMute };
}
