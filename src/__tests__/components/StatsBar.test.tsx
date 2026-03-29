import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsBar from '../../components/StatsBar';

describe('StatsBar', () => {
  it('renders move count', () => {
    render(<StatsBar moves={7} elapsedSeconds={42} progress={0.5} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('formats elapsed seconds as MM:SS', () => {
    render(<StatsBar moves={0} elapsedSeconds={125} progress={0} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('renders a progressbar with correct value', () => {
    render(<StatsBar moves={0} elapsedSeconds={0} progress={0.75} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });
});
