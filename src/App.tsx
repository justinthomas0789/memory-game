import { useState, useEffect, useRef } from 'react';
import GameLayout from './components/GameLayout';
import GameBoard from './components/GameBoard';
import StatsBar from './components/StatsBar';
import GameControls from './components/GameControls';
import CompletionOverlay from './components/CompletionOverlay';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';
import { useSoundManager } from './hooks/useSoundManager';
import type { CardTheme } from './engine/constants';
import { DEFAULT_THEME } from './engine/constants';

function App() {
  const [theme, setTheme] = useState<CardTheme>(DEFAULT_THEME);
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
      // Brief gap so repeated identical messages re-trigger the live region
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

  // Sound and announcement on game completion
  useEffect(() => {
    if (isComplete) {
      playComplete();
      announce(`Congratulations! You finished in ${moves} moves.`);
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCardClick(cardId: string) {
    playFlip();
    flipCardById(cardId);
  }

  function handleNewGame() {
    resetTimer();
    startNewGame();
    announce('New game started.');
  }

  function handleThemeChange(newTheme: CardTheme) {
    setTheme(newTheme);
    resetTimer();
    // startNewGame is triggered by theme change via useMemoryGame re-init
  }

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
        onPlayAgain={handleNewGame}
      />
    </GameLayout>
  );
}

export default App;
