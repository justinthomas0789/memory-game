import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy — Memory Game',
    description:
      'Privacy policy for Memory Game (memory-game.thecodewalker.dev). Learn how we use Google Analytics and what data is collected.',
    canonical: 'https://memory-game.thecodewalker.dev/privacy',
    ogTitle: 'Privacy Policy — Memory Game',
    ogDescription:
      'Privacy policy for Memory Game. Learn how we use Google Analytics and what data is collected.',
    ogUrl: 'https://memory-game.thecodewalker.dev/privacy',
  });

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-16">
      <article className="w-full max-w-lg flex flex-col gap-6">
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
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--color-earth)] opacity-60 mt-2">
            Last updated: May 5, 2026
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Overview
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Memory Game (<strong>memory-game.thecodewalker.dev</strong>) is a
            free, browser-based game with no user accounts and no server-side
            data storage. This policy explains what limited data is collected
            and how it is used.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Analytics (Google Analytics 4)
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            This site uses <strong>Google Analytics 4 (GA4)</strong> to
            understand how visitors use the game. GA4 collects anonymised data
            including:
          </p>
          <ul className="text-sm text-[var(--color-earth)] leading-relaxed list-disc list-inside flex flex-col gap-1 pl-2">
            <li>Pages visited and time spent</li>
            <li>General geographic region (country / city level)</li>
            <li>Browser type and device category</li>
            <li>Referral source (how you found the site)</li>
          </ul>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            No personally identifiable information (name, email, IP address) is
            stored or shared. Google Analytics data is processed by Google LLC
            under their{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Local Storage
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Game preferences (theme, difficulty, game mode, dark mode, best
            scores, and unlocked achievements) are saved to your browser's{' '}
            <strong>localStorage</strong>. This data never leaves your device
            and is not transmitted anywhere.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Cookies
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Google Analytics sets cookies to distinguish sessions and measure
            returning visitors. No other cookies are used by this site. You can
            opt out of Google Analytics tracking via the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Third-Party Services
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            This site is hosted on{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              Vercel
            </a>
            , which may collect standard server logs (IP address, request
            headers) as part of its infrastructure. Vercel's data processing is
            governed by their privacy policy.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-earth-dark)]">
            Contact
          </h2>
          <p className="text-sm text-[var(--color-earth)] leading-relaxed">
            Questions about this policy? Email{' '}
            <a
              href="mailto:justinthomas0789@gmail.com"
              className="underline hover:opacity-70 transition-opacity"
            >
              justinthomas0789@gmail.com
            </a>
            .
          </p>
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
            to="/about"
            className="text-sm text-[var(--color-earth)] underline hover:opacity-70 transition-opacity"
          >
            About
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default PrivacyPage;
