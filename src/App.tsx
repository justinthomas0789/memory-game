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
import type { CardTheme } from './engine/constants';
import { DEFAULT_THEME } from './engine/constants';
import { loadTheme, saveTheme } from './lib/storage';

function App() {
  const { t } = useTranslation();
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
    announce(t('announcements.newGame'));
  }, [resetTimer, startNewGame, t, announce]);

  const handleThemeChange = useCallback(
    (newTheme: CardTheme) => {
      setTheme(newTheme);
      saveTheme(newTheme);
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
        elapsedSeconds={elapsedSeconds}
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
      <Suspense fallback={null}>
        <CompletionOverlay
          isVisible={isComplete}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          bestScore={bestScore}
          onPlayAgain={handleNewGame}
        />
      </Suspense>
    </GameLayout>
  );
}

export default App;
