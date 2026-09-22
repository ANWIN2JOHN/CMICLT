import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, PanelLeftClose, PanelLeftOpen, Shield } from 'lucide-react';
import { primaryNav } from './nav-items';
import { useBreakpoint } from '../lib/hooks';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { LogoLockup, LogoMark } from '../components/Logo';
import { Avatar } from '../components/ui/primitives';
import { Dialog } from '../components/ui/overlays';
import { cn } from '../lib/cn';

export function AppShell() {
  const { isTablet, tier } = useBreakpoint();
  return isTablet ? <TabletShell expandDefault={tier === 'tabletLandscape'} /> : <MobileShell />;
}

/* ---------------- Mobile: bottom tab bar ---------------- */
function MobileShell() {
  const { t } = useLocale();
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col bg-bg">
      <main className="flex-1 pb-[calc(104px+var(--safe-bottom))]">
        <Outlet />
      </main>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] px-4 pb-[calc(12px+var(--safe-bottom))]"
      >
        <div className="flex items-center justify-around gap-1 rounded-[30px] border border-line bg-card/95 px-2.5 py-2.5 shadow-[var(--shadow-lg)] backdrop-blur">
          {primaryNav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className="press flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    'flex h-9 w-11 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-emeraldl' : 'bg-transparent',
                  )}
                >
                  <item.icon size={22} className={active ? 'text-emerald' : 'text-ink2'} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={cn('text-[10.5px] leading-none', active ? 'font-semibold text-emerald' : 'text-ink2')}>
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
                  active ? 'bg-emeraldl text-primary' : 'text-ink2 active:bg-card2',
                )}
              >
                <item.icon size={23} strokeWidth={active ? 2.4 : 2} />
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
                pathname.startsWith('/admin') ? 'bg-goldl text-gold' : 'text-ink2 active:bg-card2',
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
          className="press mb-2 flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] text-ink2 active:bg-card2"
        >
          {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {user && (
          <div className={cn('flex items-center gap-2.5 rounded-[14px] p-2', expanded ? 'bg-card2' : 'justify-center')}>
            <button onClick={() => nav('/account')} aria-label={t('account.title')}><Avatar name={user.name} size={38} /></button>
            {expanded && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{user.name}</p>
                <p className="truncate text-[11px] text-ink2">{user.role === 'superadmin' ? 'Super Administrator' : 'CMI Member'}</p>
              </div>
            )}
            {expanded && (
              <button aria-label={t('auth.signOut')} onClick={() => setConfirmOut(true)} className="flex h-11 w-11 items-center justify-center rounded-full text-ink2 active:bg-card"><LogOut size={18} /></button>
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
export function Screen({ title, back, right, children, hero }: {
  title?: string; back?: boolean; right?: React.ReactNode; children?: React.ReactNode; hero?: boolean;
}) {
  const nav = useNavigate();
  return (
    <div className="anim-fade-up min-h-full">
      {(title || back) && !hero && (
        <header className="sticky top-0 z-30 flex items-center gap-1 border-b border-line bg-bg/90 px-2 pb-2.5 pt-[calc(10px+var(--safe-top))] backdrop-blur md:px-4">
          {back && (
            <button aria-label="Back" onClick={() => nav(-1)} className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-card2">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className={cn('flex-1 truncate font-head text-[20px] font-semibold text-ink', !back && 'pl-3')}>{title}</h1>
          {right}
        </header>
      )}
      <div className="mx-auto w-full max-w-[880px] px-4 py-4 md:px-6">{children}</div>
    </div>
  );
}
