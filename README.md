# Memory Game

A polished memory card matching game built with React 19, TypeScript, and Tailwind CSS 4.

## Features

- **3 card themes** — Animals, Space, Food (16 cards each)
- **3D flip animations** with Framer Motion stagger entrance on new game
- **Sound effects** — synthesized via Web Audio API (no audio files)
- **Stats tracking** — move counter, live timer, match streak
- **Best score** per theme persisted in localStorage
- **Completion overlay** with star rating (1–3 stars based on moves)
- **Accessible** — full ARIA labels, `aria-live` announcements, arrow key grid navigation, keyboard focus management
- **Reduced motion** support — disables all animations when OS preference is set

## Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Framework | React 19                          |
| Language  | TypeScript (strict)               |
| Bundler   | Vite 8                            |
| Styling   | Tailwind CSS 4                    |
| Animation | Framer Motion 12                  |
| Testing   | Vitest + Testing Library          |
| Linting   | ESLint 9 flat config + commitlint |

## Architecture

```
src/
  engine/       # Pure TS game logic (no React)
    types.ts    # GameState, GameAction, Card types
    gameReducer.ts  # State machine
    selectors.ts    # Derived state queries
    cardUtils.ts    # Deck generation + shuffle
  hooks/        # React bridge layer
    useMemoryGame.ts  # useReducer + timeout effects
    useGameTimer.ts   # Interval-based timer
    useSoundManager.ts  # Web Audio API synthesis
    useBestScore.ts     # localStorage best scores
  components/   # Presentational UI
  lib/          # Storage utilities
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage  # Coverage report
npm run lint         # Lint check
```
