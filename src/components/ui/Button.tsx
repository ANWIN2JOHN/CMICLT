import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base =
  'press inline-flex items-center justify-center gap-2 font-medium rounded-[var(--r-input)] select-none disabled:opacity-45 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-onprimary shadow-[var(--shadow-sm)] hover:bg-primary-strong active:bg-primary-strong',
  secondary: 'bg-emeraldl text-emerald dark:text-ink border border-line hover:border-[color-mix(in_srgb,var(--c-primary)_30%,var(--c-border))] active:bg-card2',
  outline: 'border border-line text-ink bg-card hover:bg-card2 active:bg-card2',
  text: 'text-primary bg-transparent hover:bg-emeraldl active:bg-emeraldl',
  danger: 'bg-error text-white hover:brightness-95 active:brightness-90 dark:bg-[color-mix(in_srgb,var(--c-error)_78%,black)]',
};

const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-4 text-[15px]',
  lg: 'min-h-[52px] px-5 text-[16px]',
};

export function Button({
  variant = 'primary', size = 'md', loading, fullWidth, leftIcon, rightIcon, className, children, disabled, ...rest
}: Props) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}
export function IconButton({ label, className, children, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'press inline-flex items-center justify-center rounded-full text-ink min-h-[44px] min-w-[44px] hover:bg-card2 active:bg-card2',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
