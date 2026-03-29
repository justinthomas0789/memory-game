import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-earth-dark)] text-[var(--color-cream)] hover:bg-[var(--color-earth)] active:scale-95',
  secondary:
    'border-2 border-[var(--color-earth-dark)] text-[var(--color-earth-dark)] hover:bg-[var(--color-warm)] active:scale-95',
  ghost:
    'text-[var(--color-earth)] hover:text-[var(--color-earth-dark)] hover:bg-[var(--color-warm)] active:scale-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
};

function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] disabled:opacity-40 disabled:cursor-not-allowed';

  const classes = [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
