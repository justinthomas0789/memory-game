import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
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
    </main>
  );
}

export default HomePage;
