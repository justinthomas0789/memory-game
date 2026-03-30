# Memory Game

A vibe-coded browser-based memory card matching game built with React 19, TypeScript, and Tailwind CSS 4.

**Live demo:** https://memory-game-tau-eight.vercel.app/

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

## Overview

The game presents 16 face-down cards (8 matched pairs) on a 4×4 grid. The player flips two cards per turn; matching pairs stay face-up and a mismatch briefly shows both cards before flipping them back. The game ends when all 8 pairs are matched.

**Game flow:**

1. Player arrives at `/` (home) and clicks **Play**
2. `/play` loads with a shuffled deck for the active theme
3. Each card flip triggers state transitions: `ready → first_pick → checking → ready/completed`
4. A completion overlay appears with a star rating and the option to play again or change theme

**Three card themes** ship out of the box: Animals, Space, and Food (all emoji-based, no image assets needed for the cards themselves). Theme selection persists across sessions via `localStorage`.

---

## Architecture

The codebase is split into three layers with strict one-way data flow:

```
src/
  engine/             # Pure TypeScript — zero React imports
    types.ts          # GameState, GameAction, Card types
    gameReducer.ts    # Explicit state machine (useReducer target)
    actions.ts        # Action creator functions
    selectors.ts      # Pure derived-state queries
    cardUtils.ts      # Deck generation and Fisher-Yates shuffle
    constants.ts      # Themes, emoji sets, timing config

  hooks/              # React bridge — connects engine to UI
    useMemoryGame.ts  # Dispatches actions, schedules timeouts
    useGameTimer.ts   # Interval-based elapsed timer
    useSoundManager.ts  # Web Audio API sound synthesis
    useBestScore.ts   # Per-theme best score in localStorage

  components/         # Presentational — receives props, emits events
    Card/             # 3D flip card with match/mismatch animations
    GameBoard.tsx     # Card grid with keyboard navigation
    StatsBar.tsx      # Move counter and timer display
    GameControls.tsx  # Theme selector and new game button
    CompletionOverlay.tsx  # End-game modal (lazy-loaded)
    GameLayout.tsx    # Page shell

  pages/
    HomePage.tsx      # Landing page with Play button

  lib/
    storage.ts        # localStorage helpers (theme, best score)
    formatTime.ts     # Shared mm:ss formatter

  i18n/
    index.ts          # i18next bootstrap
    locales/en.json   # All UI strings (English only)
```

**The engine layer has no React dependency.** All game logic (`gameReducer`, selectors, `cardUtils`) is plain TypeScript and fully unit-tested without a DOM or React test renderer. This separation means the game logic can be tested cheaply and the UI layer stays thin.

---

## Key Decisions

### State machine via `useReducer`

Game state is managed as an explicit finite state machine with named statuses (`ready`, `first_pick`, `checking`, `completed`). This makes impossible states unrepresentable — e.g. you cannot flip a third card while `status === 'checking'`. The reducer handles all transitions deterministically; side effects (timeouts) live in `useEffect` inside the hook layer.

### Engine / hook / UI separation

Rather than scattering game logic across components, the engine is a pure module that could be extracted and run in Node.js or a Web Worker without changes. The hook layer owns timing and browser APIs; components are purely presentational.

### Framer Motion — lazy-loaded for CompletionOverlay only

The completion overlay uses Framer Motion for its spring entrance and `AnimatePresence` exit animation. However, Framer Motion is large (~46 KB gzipped), so it is code-split into a separate async chunk via `React.lazy()` and only loaded after the initial render. The card entrance stagger was intentionally replaced with a native CSS `@keyframes` animation to keep Framer Motion entirely out of the critical path.

### Synthesized sound via Web Audio API

All sound effects (flip, match, mismatch, completion fanfare) are generated programmatically with `OscillatorNode` and `GainNode`. This avoids shipping any audio files and keeps the bundle clean. Mute state persists in `localStorage`.

### i18n from the start

All user-facing strings — including ARIA labels — are managed through `react-i18next`. Even though only English is shipped, this means adding another locale is a single JSON file and a language selector, with zero component changes required.

### CSS custom properties for theming

All colors, radii, and font families are `--css-variables` defined in `app.css`. Component styles reference only these variables, not raw hex values (except inside the variable definitions themselves). This makes a future dark mode a one-block override.

### Best score persistence

Best scores are stored per theme in `localStorage` (keyed by theme name). Only `moves` and `seconds` are stored — no dates, no history. If `localStorage` is unavailable (e.g. private browsing), the game degrades silently; no errors surface to the user.

---

## Assumptions

- **Desktop-first but responsive**: The layout is centered with a max-width constraint. Cards are sized relative to the container with `aspect-ratio: 1/1`, so the game renders reasonably on mobile, but the primary design target is a desktop browser.
- **Single language**: Only English is implemented. The i18n infrastructure is in place for future locales.
- **8 pairs (4×4 grid)**: The grid is hardcoded to 4 columns and one theme's emoji set (8 emojis × 2 = 16 cards). Changing this would require updates to `constants.ts` and `gameReducer` star-rating thresholds.
- **Modern browsers only**: The game uses `AudioContext`, CSS `aspect-ratio`, `backface-visibility`, and ES2023 syntax. No polyfills are included.
- **No backend**: All state is local. There is no persistence beyond `localStorage` and no multiplayer or leaderboard.

---

## Trade-offs and Limitations

| Area                         | Decision                                                       | Trade-off                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Framer Motion**            | Kept for `AnimatePresence` exit animation in CompletionOverlay | Adds ~46 KB gzipped to the async chunk; purely CSS exit animations would require keeping the element mounted and managing timing manually |
| **Google Fonts**             | Loaded asynchronously (non-render-blocking `rel="preload"`)    | A brief FOUT (flash of unstyled text) is visible before fonts load; self-hosting would eliminate this entirely but adds build complexity  |
| **Sound synthesis**          | Web Audio API oscillators only                                 | Synthesized tones are functional but not as satisfying as recorded audio; some older Android browsers have limited `AudioContext` support |
| **4×4 fixed grid**           | Hardcoded column count                                         | Makes adding a difficulty setting (e.g. 6×6) non-trivial — would require a dynamic COLS constant and new emoji sets                       |
| **Single theme at a time**   | One theme = one deck                                           | No mixed-theme mode; trivial to add but not in scope                                                                                      |
| **No server-side rendering** | Pure SPA (Vite + React Router)                                 | Slightly worse cold-start SEO; acceptable for a game                                                                                      |
| **localStorage best score**  | Per-theme, moves + time only                                   | No cross-device sync; data is lost if the user clears site storage                                                                        |
