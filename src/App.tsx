import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from 'react';
import { useTranslation } from 'react-i18next';
import GameLayout from './components/GameLayout';
import GameBoard from './components/GameBoard';
import StatsBar from './components/StatsBar';
import GameControls from './components/GameControls';
const CompletionOverlay = lazy(() => import('./components/CompletionOverlay'));
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';
import { useSoundManager } from './hooks/useSoundManager';
import { useBestScore } from './hooks/useBestScore';
import type { CardTheme, Difficulty, GameMode } from './engine/constants';
import {
  DEFAULT_THEME,
  DEFAULT_DIFFICULTY,
  DEFAULT_GAME_MODE,
  TIME_ATTACK_DURATIONS,
} from './engine/constants';
import { getDailyConfig } from './lib/daily';
import {
  loadTheme,
  saveTheme,
  loadDifficulty,
  saveDifficulty,
  loadDarkMode,
  saveDarkMode,
  loadGameMode,
  saveGameMode,
} from './lib/storage';

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<CardTheme>(
    () => loadTheme() ?? DEFAULT_THEME,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => loadDifficulty() ?? DEFAULT_DIFFICULTY,
  );
  const [isDark, setIsDark] = useState<boolean>(
    () =>
      loadDarkMode() ??
      window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  // Apply / remove data-theme on <html> whenever isDark changes
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light',
    );
  }, [isDark]);

  const [gameMode, setGameMode] = useState<GameMode>(
    () => loadGameMode() ?? DEFAULT_GAME_MODE,
  );
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dailyConfig = getDailyConfig();
  const isDaily = gameMode === 'daily';
  const effectiveTheme = isDaily ? dailyConfig.theme : theme;
  const effectiveDifficulty = isDaily ? dailyConfig.difficulty : difficulty;
  const effectiveSeed = isDaily ? dailyConfig.seed : undefined;

  const liveRegionRef = useRef<HTMLDivElement>(null);
  const announceClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    state,
    flipCardById,
    startNewGame,
    isComplete,
    progress,
    moves,
    lastMatchResult,
    cols,
  } = useMemoryGame({
    theme: effectiveTheme,
    difficulty: effectiveDifficulty,
    seed: effectiveSeed,
  });

  const isGameInProgress =
    state.status !== 'idle' &&
    state.status !== 'ready' &&
    !isComplete &&
    !isTimeUp;
  const isTimerRunning = isGameInProgress && !isPaused;
  const isTimeAttack = gameMode === 'time-attack';
  const countdownFrom = isTimeAttack
    ? TIME_ATTACK_DURATIONS[effectiveDifficulty]
    : undefined;

  const {
    elapsedSeconds,
    displaySeconds,
    reset: resetTimer,
  } = useGameTimer({
    isRunning: isTimerRunning,
    countdownFrom,
    onExpire: isTimeAttack ? () => setIsTimeUp(true) : undefined,
  });
  const { bestScore, submitScore } = useBestScore(
    effectiveTheme,
    effectiveDifficulty,
  );

  const {
    playFlip,
    playMatch,
    playMismatch,
    playComplete,
    isMuted,
    toggleMute,
  } = useSoundManager();

  const announce = useCallback((message: string) => {
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
  }, []);

  // Sound effects and announcements on match result changes
  useEffect(() => {
    if (lastMatchResult === 'match') {
      playMatch();
      announce(t('announcements.match'));
    }
    if (lastMatchResult === 'mismatch') {
      playMismatch();
      announce(t('announcements.noMatch'));
    }
  }, [lastMatchResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sound, score submission, and announcement on game completion
  useEffect(() => {
    if (isComplete) {
      playComplete();
      const isNewBest = submitScore(moves, elapsedSeconds);
      const msg = isNewBest
        ? t('announcements.newBest', { moves, seconds: elapsedSeconds })
        : t('announcements.finished', { moves });
      announce(msg);
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // Announce time up
  useEffect(() => {
    if (isTimeUp) {
      announce(t('announcements.timeUp'));
    }
  }, [isTimeUp]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isPaused) return;
      playFlip();
      flipCardById(cardId);
    },
    [isPaused, playFlip, flipCardById],
  );

  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => {
      announce(t(prev ? 'announcements.resumed' : 'announcements.paused'));
      return !prev;
    });
  }, [announce, t]);

  const handleNewGame = useCallback(() => {
    setIsPaused(false);
    setIsTimeUp(false);
    resetTimer();
    startNewGame();
    announce(t('announcements.newGame'));
  }, [resetTimer, startNewGame, t, announce]);

  const handleThemeChange = useCallback(
    (newTheme: CardTheme) => {
      setTheme(newTheme);
      saveTheme(newTheme);
      setIsPaused(false);
      resetTimer();
    },
    [resetTimer],
  );

  const handleGameModeChange = useCallback(
    (newMode: GameMode) => {
      setGameMode(newMode);
      saveGameMode(newMode);
      setIsTimeUp(false);
      resetTimer();
      startNewGame();
    },
    [resetTimer, startNewGame],
  );

  const handleToggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      saveDarkMode(!prev);
      return !prev;
    });
  }, []);

  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficulty(newDifficulty);
      saveDifficulty(newDifficulty);
      setIsPaused(false);
      resetTimer();
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
        elapsedSeconds={displaySeconds}
        progress={progress}
        isCountdown={isTimeAttack}
        isUrgent={isTimeAttack && displaySeconds <= 10}
      />
      <GameBoard
        state={state}
        onCardClick={handleCardClick}
        lastMatchResult={lastMatchResult}
        cols={cols}
        isPaused={isPaused}
      />
      <GameControls
        onNewGame={handleNewGame}
        onToggleMute={toggleMute}
        isMuted={isMuted}
        onThemeChange={handleThemeChange}
        currentTheme={theme}
        onDifficultyChange={handleDifficultyChange}
        currentDifficulty={difficulty}
        onToggleDarkMode={handleToggleDarkMode}
        isDark={isDark}
        onGameModeChange={handleGameModeChange}
        currentGameMode={gameMode}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        isGameInProgress={isGameInProgress}
      />
      <Suspense fallback={null}>
        <CompletionOverlay
          isVisible={isComplete || isTimeUp}
          isTimeUp={isTimeUp}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          bestScore={bestScore}
          difficulty={effectiveDifficulty}
          onPlayAgain={handleNewGame}
          isDaily={isDaily}
          dayNumber={dailyConfig.dayNumber}
        />
      </Suspense>
    </GameLayout>
  );
}

export default App;
