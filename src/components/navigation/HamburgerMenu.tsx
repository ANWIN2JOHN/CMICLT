import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users2, Users, Landmark, Calendar, GraduationCap, Cross, MoreHorizontal } from 'lucide-react';
import { isMoreSection } from '../../layouts/nav-items';
import { useLocale } from '../../contexts/LocaleContext';
import { cn } from '../../lib/cn';
import { useLockBodyScroll } from '../../lib/hooks';

const hamburgerNav = [
  { to: '/home', labelKey: 'nav.home' as const, icon: Home, match: (p: string) => p === '/home' },
  { to: '/more/leadership', labelKey: 'nav.administration' as const, icon: Users2, match: (p: string) => p.startsWith('/more/leadership') },
  { to: '/members', labelKey: 'nav.members' as const, icon: Users, match: (p: string) => p.startsWith('/members') },
  { to: '/institutions', labelKey: 'nav.institutions' as const, icon: Landmark, match: (p: string) => p.startsWith('/institutions') },
  { to: '/events', labelKey: 'nav.events' as const, icon: Calendar, match: (p: string) => p.startsWith('/events') },
  { to: '/more/formation', labelKey: 'nav.formation' as const, icon: GraduationCap, match: (p: string) => p === '/more/formation' },
  { to: '/more/formation/0', labelKey: 'nav.scholastics' as const, icon: GraduationCap, match: (p: string) => p === '/more/formation/0' },
  { to: '/more/formation/6', labelKey: 'nav.departed' as const, icon: Cross, match: (p: string) => p === '/more/formation/6' },
  { to: '/more', labelKey: 'nav.more' as const, icon: MoreHorizontal, match: (p: string) => {
    if (p.startsWith('/more/leadership') || p.startsWith('/more/formation')) return false;
    return p.startsWith('/more') || isMoreSection(p);
  }},
];

export function HamburgerMenu({ inverted = false }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLocale();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    // Close on navigation
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button 
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)} 
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
          inverted ? "text-white active:bg-white/10" : "text-ink active:bg-card2",
        )}
      >
        <Menu size={24} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/45" style={{ animation: 'cmi-fade-up 320ms ease both' }} onClick={() => setOpen(false)} aria-hidden="true" />
          
          <div className="anim-slide-right relative flex h-full w-[280px] max-w-[80vw] flex-col bg-card shadow-[var(--shadow-xl)] pt-[var(--safe-top)] pb-[var(--safe-bottom)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-head text-[18px] font-semibold text-ink">Menu</span>
              <button 
                aria-label="Close navigation menu" 
                onClick={() => setOpen(false)} 
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink2 active:bg-card2 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <X size={22} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-2 px-3">
              <ul className="flex flex-col gap-1">
                {hamburgerNav.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'press flex min-h-[48px] items-center gap-3 rounded-[12px] px-3 transition-colors',
                          active ? 'bg-emeraldl text-primary' : 'text-ink2 active:bg-card2'
                        )}
                      >
                        <item.icon size={22} strokeWidth={active ? 2.4 : 2} />
                        <span className={cn('text-[15px]', active && 'font-semibold')}>{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
