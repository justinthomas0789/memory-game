import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../../components/Card/Card';
import type { Card as CardType } from '../../engine/types';

const mockCard: CardType = {
  id: 'card-1',
  pairId: 'pair-1',
  emoji: '🦊',
};

describe('Card', () => {
  it('renders face-down when not flipped', () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={false}
        onClick={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Card, face down');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows emoji name in aria-label when flipped', () => {
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={false}
        isDisabled={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Fox, face up',
    );
  });

  it('shows matched label when matched', () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={true}
        isDisabled={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Fox, matched',
    );
  });

  it('calls onClick with card id when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={false}
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith('card-1');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={true}
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled when isDisabled is true', () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={true}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick on Enter key press', () => {
    const handleClick = vi.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={false}
        onClick={handleClick}
      />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith('card-1');
  });

  it('calls onClick on Space key press', () => {
    const handleClick = vi.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        isDisabled={false}
        onClick={handleClick}
      />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(handleClick).toHaveBeenCalledWith('card-1');
  });
});
