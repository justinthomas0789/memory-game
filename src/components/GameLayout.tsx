import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface GameLayoutProps {
  children: ReactNode;
}

function GameLayout({ children }: GameLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-5">
      <div className="w-full max-w-lg flex flex-col gap-7">
        <header className="text-center pt-2">
          <h1
            className="text-4xl font-bold tracking-tight text-[var(--color-earth-dark)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('game.title')}
          </h1>
          <p className="text-sm mt-1.5 text-[var(--color-earth)] tracking-wide">
            {t('game.subtitle')}
          </p>
        </header>
        <main className="flex flex-col gap-5">{children}</main>
      </div>
      <footer className="mt-10 pb-4 text-center text-xs text-[var(--color-earth)] opacity-60">
        Built by{' '}
        <a
          href="https://thecodewalker.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100 transition-opacity"
        >
          Justin Thomas
        </a>
        {' · '}
        <a
          href="https://github.com/justinthomas0789"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100 transition-opacity"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default GameLayout;
