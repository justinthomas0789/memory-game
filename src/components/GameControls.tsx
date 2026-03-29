import Button from './ui/Button';
import type { CardTheme } from '../engine/constants';
import { CARD_THEMES } from '../engine/constants';

interface GameControlsProps {
  onNewGame: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onThemeChange: (theme: CardTheme) => void;
  currentTheme: CardTheme;
}

const THEME_LABELS: Record<CardTheme, string> = {
  animals: '🐾 Animals',
  space: '🚀 Space',
  food: '🍕 Food',
};

function GameControls({
  onNewGame,
  onToggleMute,
  isMuted,
  onThemeChange,
  currentTheme,
}: GameControlsProps) {
  const themes = Object.keys(CARD_THEMES) as CardTheme[];

  return (
    <div
      className="flex flex-col items-center gap-3"
      role="group"
      aria-label="Game controls"
    >
      {/* Theme selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => onThemeChange(theme)}
            className={[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
              currentTheme === theme
                ? 'bg-[var(--color-earth-dark)] text-[var(--color-cream)]'
                : 'bg-[var(--color-warm)] text-[var(--color-earth)] hover:bg-[var(--color-warm-dark)]',
            ].join(' ')}
            aria-pressed={currentTheme === theme}
            aria-label={`${THEME_LABELS[theme]} theme`}
          >
            {THEME_LABELS[theme]}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={onNewGame} aria-label="Start a new game">
          New Game
        </Button>

        <button
          type="button"
          onClick={onToggleMute}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-warm)] hover:bg-[var(--color-warm-dark)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          aria-pressed={isMuted}
        >
          <span role="img" aria-hidden="true">
            {isMuted ? '🔇' : '🔊'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default GameControls;
