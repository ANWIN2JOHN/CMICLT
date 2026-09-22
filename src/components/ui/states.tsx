import type { ReactNode } from 'react';
import { CheckCircle2, Inbox, TriangleAlert } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({ icon, title, body, actionLabel, onAction }: {
  icon?: ReactNode; title: string; body?: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emeraldl text-emerald">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
      {body && <p className="mt-1.5 max-w-[280px] text-[15px] text-ink2">{body}</p>}
      {actionLabel && <Button variant="outline" className="mt-5" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

export function ErrorState({ title, body, onRetry, retryLabel = 'Try Again' }: {
  title: string; body?: string; onRetry?: () => void; retryLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--c-error)_14%,transparent)] text-error">
        <TriangleAlert size={28} />
      </div>
      <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
      {body && <p className="mt-1.5 max-w-[280px] text-[15px] text-ink2">{body}</p>}
      {onRetry && <Button variant="outline" className="mt-5" onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}

export function SuccessState({ title, body, actionLabel, onAction }: {
  title: string; body?: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="anim-scale-in mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emeraldl text-success">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="font-head text-[26px] font-semibold text-ink">{title}</h2>
      {body && <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-ink2">{body}</p>}
      {actionLabel && <Button className="mt-7" size="lg" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
