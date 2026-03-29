import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface GameLayoutProps {
  children: ReactNode;
}

function GameLayout({ children }: GameLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-5">
      <div className="w-full max-w-md flex flex-col gap-7">
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
    </div>
  );
}

export default GameLayout;
