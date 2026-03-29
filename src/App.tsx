import { useState, useEffect } from 'react';
import GameLayout from './components/GameLayout';
import GameBoard from './components/GameBoard';
import StatsBar from './components/StatsBar';
import GameControls from './components/GameControls';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';
import { useSoundManager } from './hooks/useSoundManager';
import type { CardTheme } from './engine/constants';
import { DEFAULT_THEME } from './engine/constants';

function App() {
  const [theme, setTheme] = useState<CardTheme>(DEFAULT_THEME);

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
    state.status !== 'idle' &&
    state.status !== 'ready' &&
    !isComplete;

  const { elapsedSeconds, reset: resetTimer } = useGameTimer(isTimerRunning);

  const {
    playFlip,
    playMatch,
    playMismatch,
    playComplete,
    isMuted,
    toggleMute,
  } = useSoundManager();

  // Sound effects on match result changes
  useEffect(() => {
    if (lastMatchResult === 'match') playMatch();
    if (lastMatchResult === 'mismatch') playMismatch();
  }, [lastMatchResult, playMatch, playMismatch]);

  // Sound on game completion
  useEffect(() => {
    if (isComplete) playComplete();
  }, [isComplete, playComplete]);

  function handleCardClick(cardId: string) {
    playFlip();
    flipCardById(cardId);
  }

  function handleNewGame() {
    resetTimer();
    startNewGame();
  }

  function handleThemeChange(newTheme: CardTheme) {
    setTheme(newTheme);
    resetTimer();
    // startNewGame is triggered by theme change via useMemoryGame re-init
  }

  return (
    <GameLayout>
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
    </GameLayout>
  );
}

export default App;
