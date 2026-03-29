import { useState, useEffect, useRef, useCallback } from 'react';
import GameLayout from './components/GameLayout';
import GameBoard from './components/GameBoard';
import StatsBar from './components/StatsBar';
import GameControls from './components/GameControls';
import CompletionOverlay from './components/CompletionOverlay';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';
import { useSoundManager } from './hooks/useSoundManager';
import { useBestScore } from './hooks/useBestScore';
import type { CardTheme } from './engine/constants';
import { DEFAULT_THEME } from './engine/constants';
import { loadTheme, saveTheme } from './lib/storage';

function App() {
  const [theme, setTheme] = useState<CardTheme>(
    () => loadTheme() ?? DEFAULT_THEME,
  );
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const announceClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    state,
    flipCardById,
    startNewGame,
    isComplete,
    progress,
    moves,
    matchStreak,
    lastMatchResult,
  } = useMemoryGame({ theme });

  const isTimerRunning =
    state.status !== 'idle' && state.status !== 'ready' && !isComplete;

  const { elapsedSeconds, reset: resetTimer } = useGameTimer(isTimerRunning);
  const { bestScore, submitScore } = useBestScore(theme);

  const {
    playFlip,
    playMatch,
    playMismatch,
    playComplete,
    isMuted,
    toggleMute,
  } = useSoundManager();

  function announce(message: string) {
    if (announceClearRef.current) clearTimeout(announceClearRef.current);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
      requestAnimationFrame(() => {
        if (liveRegionRef.current) liveRegionRef.current.textContent = message;
      });
      announceClearRef.current = setTimeout(() => {
        if (liveRegionRef.current) liveRegionRef.current.textContent = '';
      }, 2500);
    }
  }

  // Sound effects and announcements on match result changes
  useEffect(() => {
    if (lastMatchResult === 'match') {
      playMatch();
      const streakMsg = matchStreak >= 2 ? ` ${matchStreak} in a row!` : '';
      announce(`Match!${streakMsg}`);
    }
    if (lastMatchResult === 'mismatch') {
      playMismatch();
      announce('No match. Try again.');
    }
  }, [lastMatchResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sound, score submission, and announcement on game completion
  useEffect(() => {
    if (isComplete) {
      playComplete();
      const isNewBest = submitScore(moves, elapsedSeconds);
      const msg = isNewBest
        ? `New best! ${moves} moves in ${elapsedSeconds}s.`
        : `Congratulations! You finished in ${moves} moves.`;
      announce(msg);
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = useCallback(
    (cardId: string) => {
      playFlip();
      flipCardById(cardId);
    },
    [playFlip, flipCardById],
  );

  const handleNewGame = useCallback(() => {
    resetTimer();
    startNewGame();
    announce('New game started.');
  }, [resetTimer, startNewGame]);

  const handleThemeChange = useCallback(
    (newTheme: CardTheme) => {
      setTheme(newTheme);
      saveTheme(newTheme);
      resetTimer();
      // startNewGame is triggered by theme change via useMemoryGame re-init
    },
    [resetTimer],
  );

  return (
    <GameLayout>
      {/* Screen reader live region — updated via DOM ref to avoid setState-in-effect */}
      <div
        ref={liveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      <StatsBar
        moves={moves}
        elapsedSeconds={elapsedSeconds}
        matchStreak={matchStreak}
        progress={progress}
      />
      <GameBoard
        state={state}
        onCardClick={handleCardClick}
        lastMatchResult={lastMatchResult}
      />
      <GameControls
        onNewGame={handleNewGame}
        onToggleMute={toggleMute}
        isMuted={isMuted}
        onThemeChange={handleThemeChange}
        currentTheme={theme}
      />
      <CompletionOverlay
        isVisible={isComplete}
        moves={moves}
        elapsedSeconds={elapsedSeconds}
        bestScore={bestScore}
        onPlayAgain={handleNewGame}
      />
    </GameLayout>
  );
}

export default App;
