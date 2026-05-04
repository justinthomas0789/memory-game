import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-10">
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h1
              className="text-5xl font-bold tracking-tight text-[var(--color-earth-dark)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('home.title')}
            </h1>
            <p className="text-sm mt-2 text-[var(--color-earth)] tracking-wide">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => navigate('/play')}
              aria-label={t('home.play')}
              className="rounded-full bg-[var(--color-earth-dark)] border-[6px] border-white flex items-center justify-center p-10 shadow-[0_0_27px_1px_rgba(0,0,0,0.45)] scale-110 hover:scale-125 active:scale-105 transition-transform duration-300 ease-[cubic-bezier(0,1.2,0.8,1.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-dark)]"
            >
              <img
                src="/assets/images/rocket.svg"
                alt=""
                className="w-10 h-10 brightness-0 invert -rotate-45"
              />
            </button>
            <p className="text-sm tracking-widest uppercase text-[var(--color-earth)] font-medium">
              {t('home.play')}
            </p>
          </div>
        </div>

        {/* SEO-visible content: game description and modes */}
        <section
          aria-label="About this game"
          className="mt-12 max-w-lg w-full text-center"
        >
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            A free browser-based memory card matching game. Flip cards to find
            all emoji pairs across <strong>Animals</strong>,{' '}
            <strong>Space</strong>, <strong>Food</strong>,{' '}
            <strong>Sports</strong>, and <strong>Nature</strong> themes. Play{' '}
            <strong>Classic</strong>, <strong>Time Attack</strong>, or{' '}
            <strong>Daily Challenge</strong> mode — no download, no account.
          </p>
        </section>
      </main>

      <footer className="mt-8 text-center text-xs text-[var(--color-earth)] opacity-60">
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

export default HomePage;
