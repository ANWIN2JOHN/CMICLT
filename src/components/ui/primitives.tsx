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
        onClick && 'press w-full text-left hover:border-[color-mix(in_srgb,var(--c-primary)_28%,var(--c-border))] hover:shadow-[var(--shadow-md)] active:bg-card2',
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
    return <img src={src} alt="" width={size} height={size} className="shrink-0 rounded-full bg-card2 object-cover" style={{ width: size, height: size }} />;
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
        'press inline-flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-[var(--r-pill)] border px-4 text-[14px] font-medium',
        active ? 'border-primary bg-emeraldl text-emerald dark:text-ink' : 'border-line bg-card text-ink2 hover:border-[color-mix(in_srgb,var(--c-primary)_28%,var(--c-border))] hover:text-ink',
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
  success: 'bg-[color-mix(in_srgb,var(--c-success)_16%,transparent)] text-[color-mix(in_srgb,var(--c-success)_72%,black)] dark:text-success',
  warning: 'bg-[color-mix(in_srgb,var(--c-warning)_18%,transparent)] text-[color-mix(in_srgb,var(--c-warning)_72%,black)] dark:text-warning',
  error: 'bg-[color-mix(in_srgb,var(--c-error)_16%,transparent)] text-[color-mix(in_srgb,var(--c-error)_72%,black)] dark:text-error',
  gold: 'bg-goldl text-goldink',
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
      <h2 className="flex min-w-0 items-center gap-2.5 font-head text-[19px] font-semibold leading-snug text-ink">
        <span aria-hidden className="h-[3px] w-4 shrink-0 rounded-full bg-gold" />{title}
      </h2>
      {action && (
        <button onClick={onAction} className="press -mr-2 flex min-h-[44px] items-center rounded-full px-2 text-[14px] font-medium text-primary hover:bg-emeraldl">
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
