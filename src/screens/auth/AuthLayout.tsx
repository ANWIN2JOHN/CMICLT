import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { AuthBrand } from '../../components/AuthBrand';
import { useLocale } from '../../contexts/LocaleContext';

export function AuthLayout({ title, subtitle, back, onBack, children, footer }: {
  title?: string; subtitle?: string; back?: boolean; onBack?: () => void; children: ReactNode; footer?: ReactNode;
}) {
  const nav = useNavigate();
  const { t } = useLocale();
  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col overflow-y-auto bg-bg px-6 pb-[calc(24px+var(--safe-bottom))] pt-[calc(16px+var(--safe-top))]">
      <div className="flex min-h-[52px] shrink-0 items-center">
        {back && (
          <button aria-label={t('common.back')} onClick={onBack ?? (() => nav(-1))} className="press -ml-2 flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-card2">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center pt-2 pb-16">
        <AuthBrand className="mb-[26px]" />
        {title && <h1 className="text-center font-head text-[30px] font-bold leading-tight text-ink">{title}</h1>}
        {subtitle && <p className="mt-2 text-center text-[15px] leading-relaxed text-ink2">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="pt-6">{footer}</div>}
      </div>
    </div>
  );
}
