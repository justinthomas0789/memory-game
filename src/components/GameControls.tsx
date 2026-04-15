import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import type { CardTheme, Difficulty } from '../engine/constants';
import { CARD_THEMES, DIFFICULTIES } from '../engine/constants';

interface GameControlsProps {
  onNewGame: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onThemeChange: (theme: CardTheme) => void;
  currentTheme: CardTheme;
  onDifficultyChange: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  onToggleDarkMode: () => void;
  isDark: boolean;
}

function GameControls({
  onNewGame,
  onToggleMute,
  isMuted,
  onThemeChange,
  currentTheme,
  onDifficultyChange,
  currentDifficulty,
  onToggleDarkMode,
  isDark,
}: GameControlsProps) {
  const { t } = useTranslation();
  const themes = Object.keys(CARD_THEMES) as CardTheme[];
  const difficulties = Object.keys(DIFFICULTIES) as Difficulty[];

  return (
    <div
      className="flex flex-col items-center gap-4 pb-4"
      role="group"
      aria-label={t('controls.gameControlsAriaLabel')}
    >
      {/* Theme selector */}
      <div className="flex gap-2.5 flex-wrap justify-center">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => onThemeChange(theme)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border',
              currentTheme === theme
                ? 'bg-[var(--color-earth-dark)] text-[var(--color-cream)] border-[var(--color-earth-dark)] shadow-sm'
                : 'bg-transparent text-[var(--color-earth)] border-[var(--color-warm-dark)] hover:bg-[var(--color-warm)] hover:border-[var(--color-earth)]',
            ].join(' ')}
            aria-pressed={currentTheme === theme}
            aria-label={t('controls.themeAriaLabel', {
              theme: t(`controls.themes.${theme}`),
            })}
          >
            {t(`controls.themes.${theme}`)}
          </button>
        ))}
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            onClick={() => onDifficultyChange(difficulty)}
            className={[
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border',
              currentDifficulty === difficulty
                ? 'bg-[var(--color-earth-dark)] text-[var(--color-cream)] border-[var(--color-earth-dark)] shadow-sm'
                : 'bg-transparent text-[var(--color-earth)] border-[var(--color-warm-dark)] hover:bg-[var(--color-warm)] hover:border-[var(--color-earth)]',
            ].join(' ')}
            aria-pressed={currentDifficulty === difficulty}
            aria-label={t(`controls.difficultyAriaLabel`, {
              difficulty: t(`controls.difficulties.${difficulty}`),
            })}
          >
            {t(`controls.difficulties.${difficulty}`)}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={onNewGame}
          aria-label={t('controls.newGameAriaLabel')}
        >
          {t('controls.newGame')}
        </Button>

        <button
          type="button"
          onClick={onToggleMute}
          className="w-11 h-11 rounded-xl flex items-center justify-center border border-[var(--color-warm-dark)] bg-[var(--color-warm-light)] hover:bg-[var(--color-warm)] hover:border-[var(--color-earth)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
          aria-label={isMuted ? t('controls.unmute') : t('controls.mute')}
          aria-pressed={isMuted}
        >
          <span role="img" aria-hidden="true" className="text-base">
            {isMuted ? '🔇' : '🔊'}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="w-11 h-11 rounded-xl flex items-center justify-center border border-[var(--color-warm-dark)] bg-[var(--color-warm-light)] hover:bg-[var(--color-warm)] hover:border-[var(--color-earth)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
          aria-label={isDark ? t('controls.lightMode') : t('controls.darkMode')}
          aria-pressed={isDark}
        >
          <span role="img" aria-hidden="true" className="text-base">
            {isDark ? '☀️' : '🌙'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(GameControls);
