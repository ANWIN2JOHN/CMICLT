import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

/** Admin screens run mobile/tablet only — the same tokens, cards and sheets as the member app. */
export function AdminScreen({ title, back, right, children, exit }: {
  title: string; back?: boolean; right?: ReactNode; children: ReactNode; exit?: boolean;
}) {
  const nav = useNavigate();
  const { t } = useLocale();
  return (
    <div className="anim-fade-up mx-auto min-h-dvh max-w-[880px] bg-bg pb-[calc(24px+var(--safe-bottom))]">
      <header className="sticky top-0 z-30 flex items-center gap-1 border-b border-line bg-bg/90 px-2 pb-2.5 pt-[calc(10px+var(--safe-top))] backdrop-blur md:px-4">
        {back && (
          <button aria-label={t('common.back')} onClick={() => nav(-1)} className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-card2"><ChevronLeft size={24} /></button>
        )}
        <h1 className={`flex-1 truncate font-head text-[20px] font-semibold text-ink ${!back ? 'pl-3' : ''}`}>{title}</h1>
        {right}
        {exit && (
          <button aria-label="Exit admin" onClick={() => nav('/home')} className="flex h-11 w-11 items-center justify-center rounded-full text-ink2 active:bg-card2"><X size={22} /></button>
        )}
      </header>
      <div className="px-4 py-4 md:px-6">{children}</div>
    </div>
  );
}
