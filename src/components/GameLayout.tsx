import type { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
}

function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <header className="text-center">
          <h1
            className="text-3xl font-bold text-[var(--color-earth-dark)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Memory Game
          </h1>
          <p
            className="text-sm mt-1 text-[var(--color-earth)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Find all matching pairs
          </p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default GameLayout;
