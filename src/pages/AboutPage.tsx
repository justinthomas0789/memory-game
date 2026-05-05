import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

function AboutPage() {
  usePageMeta({
    title: 'About — Memory Game by Justin Thomas',
    description:
      'Memory Game is a free browser-based card matching game built by Justin Thomas (thecodewalker). Learn about the project, its features, and how to get in touch.',
    canonical: 'https://memory-game.thecodewalker.dev/about',
    ogTitle: 'About — Memory Game by Justin Thomas',
    ogDescription:
      'Memory Game is a free browser-based card matching game built by Justin Thomas (thecodewalker). Learn about the project and get in touch.',
    ogUrl: 'https://memory-game.thecodewalker.dev/about',
  });

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-16">
      <article className="w-full max-w-lg flex flex-col gap-8">
        <header>
          <Link
            to="/"
            className="text-xs tracking-widest uppercase text-[var(--color-earth)] opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Memory Game
          </Link>
          <h1
            className="text-4xl font-bold tracking-tight text-[var(--color-earth-dark)] mt-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            About
          </h1>
        </header>

        <section aria-labelledby="about-project">
          <h2
            id="about-project"
            className="text-lg font-semibold text-[var(--color-earth-dark)] mb-3"
          >
            The Game
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Memory Game is a free, browser-based card matching game built by{' '}
            <strong>Justin Thomas</strong> (
            <a
              href="https://thecodewalker.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              thecodewalker
            </a>
            ). Flip emoji cards to find all matching pairs — no download, no
            account, no ads.
          </p>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed mt-3">
            Features include Classic, Time Attack, Daily Challenge, and
            Two-Player modes across five emoji themes (Animals, Space, Food,
            Sports, Nature), three difficulty levels, five unlockable
            achievements, dark mode, score sharing, and full offline support as
            a Progressive Web App.
          </p>
        </section>

        <section aria-labelledby="about-author">
          <h2
            id="about-author"
            className="text-lg font-semibold text-[var(--color-earth-dark)] mb-3"
          >
            The Developer
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Justin Thomas is a software developer who writes and ships
            open-source projects at{' '}
            <a
              href="https://thecodewalker.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              thecodewalker.dev
            </a>
            . This game was built with React, TypeScript, Tailwind CSS, Vite,
            and Framer Motion.
          </p>
        </section>

        <section aria-labelledby="about-contact">
          <h2
            id="about-contact"
            className="text-lg font-semibold text-[var(--color-earth-dark)] mb-3"
          >
            Contact
          </h2>
          <ul className="text-sm text-[var(--color-earth)] flex flex-col gap-2">
            <li>
              Website:{' '}
              <a
                href="https://thecodewalker.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                thecodewalker.dev
              </a>
            </li>
            <li>
              GitHub:{' '}
              <a
                href="https://github.com/justinthomas0789"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                github.com/justinthomas0789
              </a>
            </li>
            <li>
              Email:{' '}
              <a
                href="mailto:justinthomas0789@gmail.com"
                className="underline hover:opacity-70 transition-opacity"
              >
                justinthomas0789@gmail.com
              </a>
            </li>
          </ul>
        </section>

        <footer className="pt-4 border-t border-[var(--color-earth)] border-opacity-20">
          <Link
            to="/"
            className="text-sm text-[var(--color-earth)] underline hover:opacity-70 transition-opacity"
          >
            ← Play Memory Game
          </Link>
          {' · '}
          <Link
            to="/privacy"
            className="text-sm text-[var(--color-earth)] underline hover:opacity-70 transition-opacity"
          >
            Privacy Policy
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default AboutPage;
