import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompletionOverlay from '../../components/CompletionOverlay';

// Suppress canvas-confetti in tests
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const BASE_PROPS = {
  isVisible: true,
  moves: 10,
  elapsedSeconds: 75,
  bestScore: null,
  difficulty: 'medium' as const,
  onPlayAgain: vi.fn(),
  theme: 'animals' as const,
  gameMode: 'classic' as const,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Ensure no navigator.share or clipboard by default
  Object.defineProperty(navigator, 'share', {
    value: undefined,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CompletionOverlay — visibility', () => {
  it('renders when isVisible is true', () => {
    render(<CompletionOverlay {...BASE_PROPS} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when isVisible is false', () => {
    render(<CompletionOverlay {...BASE_PROPS} isVisible={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('CompletionOverlay — classic game', () => {
  it('shows "Winner!" heading', () => {
    render(<CompletionOverlay {...BASE_PROPS} />);
    expect(screen.getByText('Winner!')).toBeInTheDocument();
  });

  it('shows move count', () => {
    render(<CompletionOverlay {...BASE_PROPS} moves={14} />);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('shows formatted time', () => {
    render(<CompletionOverlay {...BASE_PROPS} elapsedSeconds={125} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('shows "Play Again" button', () => {
    render(<CompletionOverlay {...BASE_PROPS} />);
    expect(
      screen.getByRole('button', { name: /play again/i }),
    ).toBeInTheDocument();
  });

  it('calls onPlayAgain when Play Again is clicked', () => {
    const onPlayAgain = vi.fn();
    render(<CompletionOverlay {...BASE_PROPS} onPlayAgain={onPlayAgain} />);
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });

  it('shows Share Result button for classic game', () => {
    render(<CompletionOverlay {...BASE_PROPS} />);
    expect(
      screen.getByRole('button', { name: /share result/i }),
    ).toBeInTheDocument();
  });
});

describe('CompletionOverlay — share functionality (clipboard fallback)', () => {
  it('copies result text to clipboard when navigator.share is unavailable', async () => {
    render(
      <CompletionOverlay {...BASE_PROPS} moves={10} elapsedSeconds={75} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /share result/i }));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledOnce();
    });
    const [text] = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>)
      .mock.calls[0] as [string];
    expect(text).toContain('Memory Game');
    expect(text).toContain('moves');
  });

  it('shows "Copied!" after clipboard write', async () => {
    vi.useFakeTimers();
    render(<CompletionOverlay {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: /share result/i }));
    await vi.runAllTimersAsync();
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('reverts to "Share Result" after 2 seconds', async () => {
    vi.useFakeTimers();
    render(<CompletionOverlay {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: /share result/i }));
    await vi.runAllTimersAsync();
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    vi.advanceTimersByTime(2100);
    await vi.runAllTimersAsync();
    expect(
      screen.getByRole('button', { name: /share result/i }),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('uses navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      writable: true,
      configurable: true,
    });
    render(<CompletionOverlay {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: /share result/i }));
    await waitFor(() => expect(shareMock).toHaveBeenCalledOnce());
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});

describe('CompletionOverlay — daily mode', () => {
  it('shows "Daily #N" heading', () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        isDaily={true}
        dayNumber={42}
        gameMode="daily"
      />,
    );
    expect(screen.getByText(/Daily #42/)).toBeInTheDocument();
  });

  it('share text includes "Daily #N"', async () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        isDaily={true}
        dayNumber={7}
        gameMode="daily"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /share result/i }));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledOnce(),
    );
    const [text] = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>)
      .mock.calls[0] as [string];
    expect(text).toContain('Daily #7');
  });
});

describe('CompletionOverlay — two-player mode', () => {
  it('shows player win message', () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        twoPlayerScores={[5, 3]}
        gameMode="two-player"
      />,
    );
    expect(screen.getByText(/Player 1 Wins!/)).toBeInTheDocument();
  });

  it('shows tie message when scores are equal', () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        twoPlayerScores={[4, 4]}
        gameMode="two-player"
      />,
    );
    expect(screen.getByText("It's a Tie!")).toBeInTheDocument();
  });

  it('does NOT show Share Result button in two-player mode', () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        twoPlayerScores={[5, 3]}
        gameMode="two-player"
      />,
    );
    expect(
      screen.queryByRole('button', { name: /share result/i }),
    ).not.toBeInTheDocument();
  });
});

describe('CompletionOverlay — time up', () => {
  it("shows Time's Up! heading", () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        isTimeUp={true}
        gameMode="time-attack"
      />,
    );
    expect(screen.getByText("Time's Up!")).toBeInTheDocument();
  });

  it('does not show Share Result when time is up', () => {
    render(<CompletionOverlay {...BASE_PROPS} isTimeUp={true} />);
    expect(
      screen.queryByRole('button', { name: /share result/i }),
    ).not.toBeInTheDocument();
  });
});

describe('CompletionOverlay — best score', () => {
  it('shows "New best!" when isNewBest', () => {
    render(<CompletionOverlay {...BASE_PROPS} bestScore={null} moves={10} />);
    expect(screen.getByText(/New best/)).toBeInTheDocument();
  });

  it('shows previous best when not a new best', () => {
    render(
      <CompletionOverlay
        {...BASE_PROPS}
        bestScore={{ moves: 8, seconds: 60 }}
        moves={12}
        elapsedSeconds={90}
      />,
    );
    expect(screen.getByText(/8 moves/)).toBeInTheDocument();
  });
});
