import type { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
}

function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-5">
      <div className="w-full max-w-md flex flex-col gap-7">
        <header className="text-center pt-2">
          <h1
            className="text-4xl font-bold tracking-tight text-[var(--color-earth-dark)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Memory
          </h1>
          <p className="text-sm mt-1.5 text-[var(--color-earth)] tracking-wide">
            Find all matching pairs
          </p>
        </header>
        <main className="flex flex-col gap-5">{children}</main>
      </div>
    </div>
  );
}

export default GameLayout;
