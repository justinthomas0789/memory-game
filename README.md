# Memory Game

A browser-based memory card matching game built with React 19, TypeScript, and Tailwind CSS 4.

**Live demo:** https://memory-game.thecodewalker.dev/

---

## Setup and Run

**Prerequisites:** Node 20+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser. The home page has a Play button that navigates to the game at `/play`.

### All scripts

```bash
npm run dev            # Development server (Vite HMR)
npm run build          # Production build (outputs to dist/)
npm run preview        # Serve the production build locally
npm test               # Run tests in watch mode
npm run test:run       # Run tests once (CI)
npm run test:coverage  # Coverage report
npm run lint           # ESLint check
npm run format         # Prettier format
```

---

## Features

| #   | Feature               | Description                                                                                           |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | **Classic mode**      | 4×4 grid, 8 pairs, star rating (1–3 ⭐) based on move count                                           |
| 2   | **Time Attack**       | Classic rules with a countdown timer; game ends when time runs out                                    |
| 3   | **Multiple themes**   | Animals, Space, Food, Sports, Nature — emoji-based, no image assets                                   |
| 4   | **Difficulty levels** | Easy / Medium / Hard adjust card count and star thresholds                                            |
| 5   | **Pause**             | Pause/resume via toolbar button; board is obscured while paused                                       |
| 6   | **Daily Challenge**   | One fixed puzzle per day, seeded by date (deterministic shuffle); always Medium                       |
| 7   | **Achievements**      | 5 badges (Speed Demon, Perfectionist, Explorer, Hat Trick, Daily Player); persisted in `localStorage` |
| 8   | **Two-Player local**  | Shared screen; turns alternate on mismatch, same player keeps turn on match                           |
| 9   | **PWA**               | Service worker + web manifest; works offline; installable to home screen                              |
| 10  | **Share Score**       | Web Share API / clipboard share on every game completion                                              |

---

## Overview

The game presents face-down cards on a grid. The player flips two cards per turn; matching pairs stay face-up and a mismatch briefly shows both cards before flipping them back. The game ends when all pairs are matched.

**Game flow:**

1. Player arrives at `/` (home) and clicks **Play**
2. `/play` loads with a shuffled deck for the active theme and mode
3. Each card flip triggers state transitions: `ready → first_pick → checking → ready/completed`
4. A completion overlay appears with a star rating, stats, and options to share or play again

---

## Architecture

```
src/
  engine/             # Pure TypeScript — zero React imports
    types.ts          # GameState, GameAction, Card types
    gameReducer.ts    # Explicit state machine (useReducer target)
    actions.ts        # Action creator functions
    selectors.ts      # Pure derived-state queries
    cardUtils.ts      # Deck generation; Fisher-Yates (random + seeded)
    constants.ts      # Themes, emoji sets, difficulty thresholds, game modes

  hooks/              # React bridge — connects engine to UI
    useMemoryGame.ts  # Dispatches actions, schedules timeouts
    useGameTimer.ts   # Interval-based elapsed/countdown timer
    useSoundManager.ts  # Web Audio API sound synthesis
    useBestScore.ts   # Per-theme best score in localStorage
    useAchievements.ts  # Achievement state, toast queue, unlock logic

  components/         # Presentational — receives props, emits events
    Card/             # 3D flip card with match/mismatch animations
    GameBoard.tsx     # Card grid with keyboard navigation; pause overlay
    StatsBar.tsx      # Move counter and timer display
    GameControls.tsx  # Theme/difficulty/mode selectors, pause, achievements
    CompletionOverlay.tsx  # End-game modal with stars, stats, share (lazy-loaded)
    TwoPlayerBar.tsx  # Current-player indicator and pair scores (lazy-loaded)
    AchievementsPanel.tsx  # Modal showing all 5 badges (lazy-loaded)
    AchievementToast.tsx   # Slide-up unlock notification (lazy-loaded)
    GameLayout.tsx    # Page shell

  pages/
    HomePage.tsx      # Landing page with Play button

  lib/
    storage.ts        # localStorage helpers (theme, best score)
    formatTime.ts     # Shared mm:ss formatter
    achievements.ts   # Achievement definitions, unlock logic, localStorage I/O
    daily.ts          # Daily config: date → seed (FNV-1a hash), theme cycle

  i18n/
    index.ts          # i18next bootstrap
    locales/en.json   # All UI strings (English only)

  __tests__/          # Vitest + Testing Library
    engine/           # Pure unit tests (gameReducer, cardUtils, storage)
    lib/              # Unit tests (daily, achievements)
    hooks/            # Hook integration tests (useMemoryGame)
    components/       # Component tests (Card, StatsBar, CompletionOverlay)

public/
  og-image.png        # 1200×630 Open Graph image (generated by scripts/)
  sitemap.xml         # XML sitemap listing / and /play
  robots.txt          # Crawl rules + Sitemap reference
  pwa-192x192.png     # PWA / Apple touch icon
  pwa-512x512.png     # PWA splash / maskable icon

scripts/
  generate-og-image.js   # Node.js PNG generator for og-image (no canvas deps)
  generate-pwa-icons.js  # Node.js PNG generator for PWA icons
```

**The engine layer has no React dependency.** All game logic (`gameReducer`, selectors, `cardUtils`) is plain TypeScript and fully unit-tested without a DOM or React test renderer.

---

## Key Decisions

### State machine via `useReducer`

Game state is managed as an explicit finite state machine with named statuses (`ready`, `first_pick`, `checking`, `completed`). This makes impossible states unrepresentable — e.g. you cannot flip a third card while `status === 'checking'`. The reducer handles all transitions deterministically; side effects (timeouts) live in `useEffect` inside the hook layer.

### Seeded PRNG for Daily Challenge

The daily puzzle uses a mulberry32 PRNG seeded by the FNV-1a hash of the current date string (`YYYY-MM-DD`). This guarantees every player worldwide sees the same card layout for a given day, with no server required.

### Engine / hook / UI separation

Rather than scattering game logic across components, the engine is a pure module that could be extracted and run in Node.js or a Web Worker without changes. The hook layer owns timing and browser APIs; components are purely presentational.

### Framer Motion — lazy-loaded, off the critical path

The completion overlay, achievement panel, and toast use Framer Motion for animations. Framer Motion (~40 KB gzipped) is split into a separate async chunk and never blocks the initial render. Card entrance animations use native CSS `@keyframes` instead, keeping Framer Motion entirely out of the critical path.

### Code splitting and prefetch

`vite.config.ts` uses a function-form `manualChunks` to split `vendor-react`, `vendor-motion`, `vendor-router`, and `vendor-i18n` into separate chunks. The main app chunk is ~30 KB. `CompletionOverlay` and `AchievementsPanel` are prefetched 1.5 s after initial paint to break the critical request chain without blocking first paint.

### Synthesized sound via Web Audio API

All sound effects are generated programmatically with `OscillatorNode` and `GainNode`. This avoids shipping any audio files. Mute state persists in `localStorage`.

### PWA / offline play

`vite-plugin-pwa` generates a service worker using Workbox's `generateSW` strategy. It precaches all static assets (~710 KB) so the game works fully offline. The web manifest enables install-to-homescreen on mobile.

### Share Score

The completion overlay uses the Web Share API (`navigator.share`) when available, with a clipboard copy fallback. Share text includes stars, move count, time, theme, and difficulty — or `Daily #N` for the daily challenge. Two-player results are not shareable (scores are local).

### i18n from the start

All user-facing strings — including ARIA labels — are managed through `react-i18next`. Only English is shipped, but adding another locale requires only a single JSON file.

### SEO and structured data

`index.html` includes a full SEO stack: keyword-rich `<title>` and `<meta description>`, Open Graph and Twitter Card tags, a JSON-LD `WebApplication` schema (name, featureList, free offer, author), a `<noscript>` fallback with H1/H2 content for crawlers, canonical URL, and a `sitemap.xml` referenced from `robots.txt`. Google Analytics is deferred to the `window load` event so it never blocks the initial render or inflates TBT.

### CSS custom properties for theming

All colors, radii, and font families are `--css-variables` defined in `app.css`. Component styles reference only these variables, not raw hex values. Dark mode is a one-block CSS override.

---

## Assumptions

- **Desktop-first but responsive**: Cards are sized with `aspect-ratio: 1/1`; the layout renders reasonably on mobile.
- **Single language**: Only English is implemented. The i18n infrastructure is in place for future locales.
- **Modern browsers only**: Uses `AudioContext`, CSS `aspect-ratio`, `backface-visibility`, and ES2023 syntax. No polyfills included.
- **No backend**: All state is local (`localStorage`). No multiplayer sync or leaderboard.

---

## Trade-offs and Limitations

| Area                         | Decision                                       | Trade-off                                                                                                  |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Framer Motion**            | Lazy-loaded async chunk                        | Adds ~40 KB gzipped to the async chunk; purely CSS exit animations would be lighter but harder to maintain |
| **Google Fonts**             | Non-render-blocking `rel="preload"`            | Brief FOUT before fonts load; self-hosting would eliminate this                                            |
| **Sound synthesis**          | Web Audio API oscillators only                 | Functional but not as rich as recorded audio; limited support on some older Android browsers               |
| **Fixed grid**               | Card count varies by difficulty, columns fixed | Adding an arbitrary N×M grid would require a dynamic COLS constant and new emoji sets                      |
| **No server-side rendering** | Pure SPA (Vite + React Router)                 | Slightly worse cold-start SEO; acceptable for a game                                                       |
| **localStorage only**        | Per-theme best scores, achievements            | No cross-device sync; data lost if user clears site storage                                                |
| **Daily puzzle**             | Client-side determinism via seeded PRNG        | No server validation; a player could theoretically reverse the seed, but there's nothing to gain           |
