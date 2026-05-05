import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ_ITEMS = [
  {
    q: 'How do I play Memory Game?',
    a: 'Click any face-down card to flip it, then click a second card. If both show the same emoji they stay face-up as a matched pair. If they differ, both flip back. Match all pairs to win.',
  },
  {
    q: 'Is Memory Game free?',
    a: 'Yes — completely free, no account, no download, no ads.',
  },
  {
    q: 'What game modes are available?',
    a: 'Classic (match all pairs, earn up to 3 stars), Time Attack (race the clock), Daily Challenge (one shared puzzle every day), and Two-Player (take turns on the same screen).',
  },
  {
    q: 'How does the Daily Challenge work?',
    a: 'A new puzzle is generated every day. All players worldwide get the same card layout and theme so you can compare scores. A new challenge unlocks at midnight.',
  },
  {
    q: 'Can I play offline?',
    a: 'Yes. Memory Game is a Progressive Web App (PWA). Install it to your home screen after the first visit and it works without an internet connection.',
  },
  {
    q: 'What difficulty levels are there?',
    a: 'Easy (small grid, fewer pairs), Medium (standard grid), and Hard (larger grid, more pairs).',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-10">
      <main className="flex-1 flex flex-col items-center justify-center w-full">
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

        {/* SEO: game description — crawlable, brand-disambiguated */}
        <section
          aria-label="About this game"
          className="mt-12 max-w-lg w-full text-center"
        >
          <p
            className="text-sm text-[var(--color-earth)] leading-relaxed"
            id="game-description"
          >
            Memory Game by <strong>Justin Thomas</strong> — a free browser-based
            card matching game. Flip emoji cards to find all matching pairs
            across <strong>Animals</strong>, <strong>Space</strong>,{' '}
            <strong>Food</strong>, <strong>Sports</strong>, and{' '}
            <strong>Nature</strong> themes. Play <strong>Classic</strong>,{' '}
            <strong>Time Attack</strong>, or <strong>Daily Challenge</strong> —
            no download, no account.
          </p>
        </section>

        {/* AEO: visible FAQ accordion */}
        <section
          aria-labelledby="faq-heading"
          className="mt-10 max-w-lg w-full"
        >
          <h2
            id="faq-heading"
            className="text-xs tracking-widest uppercase text-[var(--color-earth)] opacity-60 text-center mb-4"
          >
            Frequently Asked Questions
          </h2>
          <dl className="flex flex-col gap-2">
            {FAQ_ITEMS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-lg border border-[var(--color-earth)] border-opacity-20 overflow-hidden"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--color-earth-dark)] flex items-center justify-between gap-2 select-none hover:bg-[var(--color-earth)] hover:bg-opacity-5 transition-colors">
                  <dt>{q}</dt>
                  <span
                    className="shrink-0 text-[var(--color-earth)] opacity-50 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </summary>
                <dd className="px-4 pb-3 pt-1 text-sm text-[var(--color-earth)] leading-relaxed border-t border-[var(--color-earth)] border-opacity-10">
                  {a}
                </dd>
              </details>
            ))}
          </dl>
        </section>
      </main>

      <footer className="mt-10 text-center text-xs text-[var(--color-earth)] opacity-60 flex flex-wrap justify-center gap-x-3 gap-y-1">
        <span>
          Built by{' '}
          <a
            href="https://thecodewalker.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-100 transition-opacity"
          >
            Justin Thomas
          </a>
        </span>
        <span aria-hidden="true">·</span>
        <a
          href="https://github.com/justinthomas0789"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100 transition-opacity"
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <Link
          to="/about"
          className="underline hover:opacity-100 transition-opacity"
        >
          About
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          to="/privacy"
          className="underline hover:opacity-100 transition-opacity"
        >
          Privacy
        </Link>
      </footer>
    </div>
  );
}

export default HomePage;
