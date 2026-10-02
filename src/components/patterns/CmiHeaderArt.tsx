import { useId } from 'react';

/**
 * Faint CMI line ornament for page headers: flowing emerald curves, thin gold arcs,
 * a leaf sprig and a church-gable outline, kept to the edges so titles stay clean.
 * `tone="onDark"` is for emerald hero surfaces.
 */
export default function CmiHeaderArt({ tone = 'light', className = '' }: { tone?: 'light' | 'onDark'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const line = tone === 'onDark' ? '#ffffff' : 'var(--c-primary)';
  const glow = tone === 'onDark' ? 'rgba(255,255,255,0.10)' : 'var(--c-emerald-light)';
  return (
    <svg aria-hidden viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" fill="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <radialGradient id={`g${id}`} cx="50%" cy="10%" r="65%">
          <stop offset="0" stopColor={glow} stopOpacity="0.9" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="170" fill={`url(#g${id})`} />
      <g stroke={line} strokeOpacity={tone === 'onDark' ? 0.09 : 0.12} strokeWidth="1.2">
        <path d="M-20 120 C 40 70, 80 150, 140 96" />
        <path d="M-20 140 C 50 96, 90 168, 150 120" />
        <path d="M420 34 C 360 70, 330 10, 268 52" />
        <path d="M420 58 C 350 92, 320 34, 262 78" />
      </g>
      <g stroke="var(--c-gold)" strokeOpacity="0.3" strokeWidth="1">
        <path d="M330 170 A 92 92 0 0 1 422 78" />
        <path d="M-22 22 A 70 70 0 0 0 48 -48" />
      </g>
      {/* church gable + cross, very faint */}
      <g stroke={line} strokeOpacity={tone === 'onDark' ? 0.08 : 0.09} strokeWidth="1" strokeLinejoin="round">
        <path d="M288 170 V 128 L 306 110 L 324 128 V 170" />
        <path d="M306 110 V 96 M 300 101 H 312" />
        <path d="M300 170 V 148 a 6 6 0 0 1 12 0 V 170" />
      </g>
      <g stroke={line} strokeOpacity={tone === 'onDark' ? 0.1 : 0.14} strokeWidth="1" strokeLinecap="round">
        <path d="M352 150 C 360 128, 372 116, 392 108" />
        <path d="M364 128 c -10 -2 -16 -10 -14 -20 c 10 2 16 10 14 20 Z" />
        <path d="M378 116 c -4 -10 0 -19 9 -23 c 4 10 0 19 -9 23 Z" />
        <path d="M360 140 c 2 -10 10 -15 20 -14 c -2 10 -10 15 -20 14 Z" />
      </g>
    </svg>
  );
}
