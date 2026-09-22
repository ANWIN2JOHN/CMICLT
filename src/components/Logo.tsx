import { cn } from '../lib/cn';

/** CMICLT mark — a subtle cross within a flame/leaf, emerald + gold. Not ornate. */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect width="48" height="48" rx="13" fill="var(--c-emerald)" />
      <path d="M24 9c-5.2 4.6-9 9.8-9 16.4C15 32.9 19 38 24 40c5-2 9-7.1 9-14.6C33 18.8 29.2 13.6 24 9Z" fill="var(--c-emerald-2)" />
      <rect x="22.4" y="15" width="3.2" height="18" rx="1.6" fill="var(--c-gold)" />
      <rect x="18.5" y="20.4" width="11" height="3.2" rx="1.6" fill="var(--c-gold)" />
    </svg>
  );
}

export function LogoLockup({ compact, invert }: { compact?: boolean; invert?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 40} />
      <div className={cn('leading-tight', invert ? 'text-white' : 'text-ink')}>
        <p className={cn('font-head font-bold tracking-tight', compact ? 'text-[17px]' : 'text-[20px]')}>CMICLT</p>
        {!compact && (
          <p className={cn('text-[11px]', invert ? 'text-white/70' : 'text-ink2')}>St. Thomas Province Calicut</p>
        )}
      </div>
    </div>
  );
}
