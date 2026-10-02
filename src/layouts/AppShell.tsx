import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, LogOut, PanelLeftClose, PanelLeftOpen, Shield } from 'lucide-react';
import { primaryNav } from './nav-items';
import { useBreakpoint } from '../lib/hooks';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { LogoLockup, LogoMark } from '../components/Logo';
import { Avatar } from '../components/ui/primitives';
import { Dialog } from '../components/ui/overlays';
import { HamburgerMenu } from '../components/navigation/HamburgerMenu';
import { cn } from '../lib/cn';
import CmiHeaderArt from '../components/patterns/CmiHeaderArt';

/** Contextual back control: sits below the menu row, never beside the hamburger. */
export function BackButton({ onClick, onDark = false }: { onClick: () => void; onDark?: boolean }) {
  return (
    <button type="button" aria-label="Back" onClick={onClick}
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border outline-none transition-transform duration-150 active:scale-95 focus-visible:ring-[3px] focus-visible:ring-[var(--c-ring)] motion-reduce:transition-none',
        onDark ? 'border-white/20 bg-white/10 text-white hover:bg-white/15' : 'border-[color-mix(in_srgb,var(--c-primary)_18%,var(--c-border))] bg-card text-primary shadow-[0_4px_14px_-6px_rgba(8,72,59,0.3)] hover:bg-emeraldl',
      )}>
      <ArrowLeft size={19} />
    </button>
  );
}

export function AppShell() {
  const { isTablet, tier } = useBreakpoint();
  return isTablet ? <TabletShell expandDefault={tier === 'tabletLandscape'} /> : <MobileShell />;
}

/* ---------------- Mobile: bottom tab bar ---------------- */
function MobileShell() {
  const { t } = useLocale();
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  // Reserve exactly the fixed nav's rendered height (incl. safe-area padding and
  // user font scaling) so the last item on every screen scrolls clear of it.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const root = document.documentElement;
    const sync = () => root.style.setProperty('--bottom-nav-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { ro.disconnect(); root.style.removeProperty('--bottom-nav-h'); };
  }, []);
  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col bg-bg">
      <main className="flex-1 pb-[calc(var(--bottom-nav-h,calc(96px+var(--safe-bottom)))+20px)] [scroll-padding-bottom:calc(var(--bottom-nav-h,96px)+20px)]">
        <Outlet />
      </main>
      <nav
        ref={navRef}
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] px-4 pb-[calc(12px+var(--safe-bottom))]"
      >
        <div className="flex items-center justify-around gap-0.5 rounded-[28px] border border-line bg-card/95 px-1.5 py-2 min-[400px]:gap-1 min-[400px]:px-2 shadow-[var(--shadow-lg)] backdrop-blur">
          {primaryNav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className="press group flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-[20px]"
              >
                <span
                  className={cn(
                    'flex h-9 w-11 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-emeraldl' : 'bg-transparent group-hover:bg-card2',
                  )}
                >
                  <item.icon size={22} className={active ? 'text-emerald' : 'text-ink2'} strokeWidth={active ? 2.2 : 1.9} />
                </span>
                <span className={cn('whitespace-nowrap text-[10.5px] leading-none tracking-[-0.01em] min-[400px]:text-[11px] min-[400px]:tracking-normal', active ? 'font-semibold text-emerald' : 'text-ink2')}>
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ---------------- Tablet: collapsible navigation rail ---------------- */
function TabletShell({ expandDefault }: { expandDefault: boolean }) {
  const { t } = useLocale();
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [expanded, setExpanded] = useState(expandDefault);
  const [confirmOut, setConfirmOut] = useState(false);

  return (
    <div className="flex min-h-dvh bg-bg">
      <nav
        aria-label="Primary"
        className={cn(
          'sticky top-0 flex h-dvh shrink-0 flex-col overflow-y-auto border-r border-line bg-card px-3 pb-[calc(16px+var(--safe-bottom))] pt-[calc(16px+var(--safe-top))] transition-[width] duration-200',
          expanded ? 'w-[248px]' : 'w-[84px]',
        )}
      >
        <div className={cn('mb-6 flex items-center px-1', expanded ? 'justify-between' : 'justify-center')}>
          {expanded ? <LogoLockup compact /> : <LogoMark size={34} />}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {primaryNav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                title={t(item.labelKey)}
                className={cn(
                  'press flex min-h-[52px] items-center gap-3 rounded-[14px] px-3',
                  expanded ? '' : 'justify-center',
                  active ? 'bg-emeraldl text-primary' : 'text-ink2 hover:bg-card2 hover:text-ink active:bg-card2',
                )}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.9} />
                {expanded && <span className={cn('text-[15px]', active && 'font-semibold')}>{t(item.labelKey)}</span>}
              </Link>
            );
          })}

          {user?.role === 'superadmin' && (
            <Link
              to="/admin"
              title={t('nav.admin')}
              className={cn(
                'press mt-1 flex min-h-[52px] items-center gap-3 rounded-[14px] px-3',
                expanded ? '' : 'justify-center',
                pathname.startsWith('/admin') ? 'bg-goldl text-goldink' : 'text-ink2 hover:bg-card2 hover:text-ink active:bg-card2',
              )}
            >
              <Shield size={22} />
              {expanded && <span className="text-[15px]">{t('nav.admin')}</span>}
            </Link>
          )}
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
          className="press mb-2 flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] text-ink2 hover:bg-card2 hover:text-ink active:bg-card2"
        >
          {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {user && (
          <div className={cn('flex items-center gap-2.5 rounded-[14px] p-2', expanded ? 'bg-card2' : 'justify-center')}>
            <button onClick={() => nav('/account')} aria-label={t('account.title')} className="flex min-h-11 min-w-11 items-center justify-center rounded-full"><Avatar name={user.name} size={38} /></button>
            {expanded && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{user.name}</p>
                <p className="truncate text-[11px] text-ink2">{user.role === 'superadmin' ? 'Super Administrator' : 'CMI Member'}</p>
              </div>
            )}
            {expanded && (
              <button aria-label={t('auth.signOut')} onClick={() => setConfirmOut(true)} className="flex h-11 w-11 items-center justify-center rounded-full text-ink2 hover:bg-card hover:text-error active:bg-card"><LogOut size={18} /></button>
            )}
          </div>
        )}
      </nav>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1100px]">
          <Outlet />
        </div>
      </main>

      <Dialog
        open={confirmOut} onClose={() => setConfirmOut(false)}
        title={t('auth.signOutConfirm')} body={t('auth.signOutBody')}
        confirmLabel={t('auth.signOut')} cancelLabel={t('common.cancel')} danger
        onConfirm={() => { signOut(); nav('/signin'); }}
      />
    </div>
  );
}

/* ---------------- Screen scaffold (shared header + scroll body) ---------------- */
export function Screen({ title, back, right, children, hero, sectionLabel, description, sectionIcon, stacked }: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  children?: React.ReactNode;
  hero?: boolean;
  sectionLabel?: string;
  description?: string;
  sectionIcon?: React.ReactNode;
  /** Opt-in: header holds only the menu button; eyebrow + title move into the hero below the safe area. */
  stacked?: boolean;
}) {
  const nav = useNavigate();
  const hasSectionHeader = Boolean(sectionLabel);
  return (
    <div className="anim-fade-up min-h-full">
      {hasSectionHeader && (
        <header className="sticky top-0 z-30 flex items-center bg-emeraldd px-2 pb-1.5 pt-[calc(8px+var(--safe-top))] text-white md:px-4">
          <HamburgerMenu inverted />
          <div className="flex-1" />
          {right}
        </header>
      )}
      {(title || back) && !hero && !hasSectionHeader && (
        <header className="relative z-20 overflow-hidden border-b border-[color-mix(in_srgb,var(--c-gold)_38%,var(--c-border))] bg-bg pb-5 pt-[calc(8px+var(--safe-top))] shadow-[0_6px_18px_-14px_rgba(8,72,59,0.35)]">
          <CmiHeaderArt />
          <div className="relative flex h-12 items-center gap-1 px-2 md:px-4 [&>button:first-child]:text-primary dark:[&>button:first-child]:text-[#cdeee0]">
            <HamburgerMenu />
            <div className="flex-1" />
            {right}
          </div>
          <div className="relative mx-auto mt-2 flex w-full max-w-[880px] items-center gap-3 px-4 md:px-6">
            {back && <BackButton onClick={() => nav(-1)} />}
            <div className="min-w-0 flex-1">
              <h1 className="break-words font-head text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[28px]">{title}</h1>
              <span aria-hidden className="mt-2 block h-[2px] w-7 rounded-full bg-gold" />
            </div>
          </div>
        </header>
      )}
      {hasSectionHeader && (
        <div className="relative overflow-hidden bg-emeraldd px-4 pb-8 pt-4 text-white md:px-8 md:pb-10 md:pt-5">
          <CmiHeaderArt tone="onDark" />
          <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-3 -top-9 h-28 w-28 rounded-full border border-gold/30" />
          {
            <div className="relative mx-auto mb-6 w-full max-w-[880px] pl-1">
              {back && <div className="mb-4"><BackButton onDark onClick={() => nav(-1)} /></div>}
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">{sectionLabel}</p>
              <h1 className="mt-1.5 break-words font-head text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-white md:text-[30px]">{title}</h1>
            </div>
          }
          <div className={cn('relative mx-auto flex w-full max-w-[880px] items-start gap-4 border-t border-white/10 pt-5')}>
            {sectionIcon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/15 bg-white/10 text-gold shadow-[var(--shadow-sm)]">
                {sectionIcon}
              </div>
            )}
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">CMI Directory</p>
              <p className="mt-1 max-w-[620px] text-[14px] leading-relaxed text-white/72 md:text-[15px]">{description}</p>
            </div>
          </div>
        </div>
      )}
      <div className={cn(
        'mx-auto w-full max-w-[880px] px-4 md:px-6',
        hasSectionHeader ? 'pb-5 pt-5' : 'py-4',
      )}>{children}</div>
    </div>
  );
}
