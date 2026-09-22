import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* ---------------- Card ---------------- */
export function Card({ className, children, onClick, as = 'div' }: {
  className?: string; children: ReactNode; onClick?: () => void; as?: 'div' | 'button';
}) {
  const Comp: any = onClick ? 'button' : as;
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'rounded-[var(--r-card)] bg-card border border-line shadow-[var(--shadow-sm)]',
        onClick && 'press w-full text-left active:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/* ---------------- Avatar ---------------- */
const avatarColors = ['bg-emerald', 'bg-emerald2', 'bg-emeraldd', 'bg-primary', 'bg-primary-strong'];
export function Avatar({ name, src, size = 48 }: { name: string; src?: string; size?: number }) {
  const initials = name.replace(/^Fr\.\s*/, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const color = avatarColors[name.length % avatarColors.length];
  if (src) {
    return <img src={src} alt="" width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white', color)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* ---------------- Chips ---------------- */
export function FilterChip({ active, children, onClick, count }: {
  active?: boolean; children: ReactNode; onClick?: () => void; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'press inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-[var(--r-pill)] border px-4 text-[14px] font-medium',
        active ? 'border-primary bg-emeraldl text-emerald dark:text-ink' : 'border-line bg-card text-ink2',
      )}
    >
      {children}
      {count ? <span className="rounded-full bg-primary px-1.5 text-[12px] text-onprimary">{count}</span> : null}
    </button>
  );
}

type Tone = 'neutral' | 'success' | 'warning' | 'error' | 'gold' | 'primary';
const toneMap: Record<Tone, string> = {
  neutral: 'bg-card2 text-ink2',
  success: 'bg-[color-mix(in_srgb,var(--c-success)_16%,transparent)] text-success',
  warning: 'bg-[color-mix(in_srgb,var(--c-warning)_18%,transparent)] text-warning',
  error: 'bg-[color-mix(in_srgb,var(--c-error)_16%,transparent)] text-error',
  gold: 'bg-goldl text-gold',
  primary: 'bg-emeraldl text-emerald dark:text-ink',
};
export function StatusChip({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-[var(--r-pill)] px-2.5 py-1 text-[12px] font-semibold', toneMap[tone])}>
      {children}
    </span>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[19px] font-semibold text-ink">{title}</h2>
      {action && (
        <button onClick={onAction} className="press text-[14px] font-medium text-primary min-h-[44px] flex items-center">
          {action}
        </button>
      )}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-[12px] bg-card2', className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent [animation:cmi-shimmer_1.4s_infinite] dark:via-white/5" />
    </div>
  );
}
