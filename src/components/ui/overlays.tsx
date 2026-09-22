import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useLockBodyScroll } from '../../lib/hooks';
import { Button } from './Button';

/* ---------------- Bottom Sheet (mobile) / centered panel (tablet) ---------------- */
export function BottomSheet({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode;
}) {
  useLockBodyScroll(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/45 anim-fade-up" onClick={onClose} />
      <div className="anim-sheet-up relative flex max-h-[88vh] w-full flex-col rounded-t-[var(--r-card)] bg-card md:mx-4 md:max-w-[520px] md:rounded-[var(--r-card)]">
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-line md:hidden" />
        {title && (
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            <h2 className="text-[19px] font-semibold text-ink">{title}</h2>
            <button aria-label="Close" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full text-ink2 active:bg-card2">
              <X size={22} />
            </button>
          </div>
        )}
        <div className={cn('flex-1 overflow-y-auto px-5', footer ? 'pb-4' : 'pb-[calc(16px+var(--safe-bottom))]')}>{children}</div>
        {footer && <div className="border-t border-line px-5 py-3 pb-[calc(12px+var(--safe-bottom))]">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Dialog (confirmations) ---------------- */
export function Dialog({ open, onClose, title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, onConfirm }: {
  open: boolean; onClose: () => void; title: string; body?: ReactNode;
  confirmLabel?: string; cancelLabel?: string; danger?: boolean; onConfirm: () => void;
}) {
  useLockBodyScroll(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="anim-scale-in relative w-full max-w-[400px] rounded-[var(--r-card)] bg-card p-6 shadow-[var(--shadow-lg)]">
        <h2 className="text-[19px] font-semibold text-ink">{title}</h2>
        {body && <div className="mt-2 text-[15px] leading-relaxed text-ink2">{body}</div>}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Toast ---------------- */
type Toast = { id: number; msg: string; tone: 'success' | 'error' };
const ToastCtx = createContext<{ notify: (msg: string, tone?: 'success' | 'error') => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((msg: string, tone: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+var(--safe-bottom))] z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div key={t.id} className={cn(
            'anim-fade-up pointer-events-auto flex items-center gap-2.5 rounded-[var(--r-pill)] px-4 py-3 text-[15px] font-medium text-white shadow-[var(--shadow-lg)]',
            t.tone === 'success' ? 'bg-emeraldd' : 'bg-error',
          )}>
            <CheckCircle2 size={18} /> {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast within ToastProvider');
  return ctx;
}
