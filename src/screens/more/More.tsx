import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, LogOut, Settings as SettingsIcon, Shield, Sparkles, UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar } from '../../components/ui/primitives';
import { Dialog } from '../../components/ui/overlays';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { MORE_CATEGORIES } from './MoreCategories';
import { displayName } from '../../components/patterns/cards';

function Chevron() {
  return (
    <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card2 text-ink2/70 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-goldink motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
        <ChevronRight size={16} strokeWidth={2} />
      </span>
    </span>
  );
}

interface MenuItem { icon: any; label: string; to: string; hint?: string; }

// More menu: grouped CMI Information categories, role-gated Administration, Account.
export function More() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [confirmOut, setConfirmOut] = useState(false);

  // CMI Information: grouped categories + the existing Vocation entry.
  const infoItems: MenuItem[] = [
    ...MORE_CATEGORIES.filter(c => c.slug !== 'leadership').map((c) => ({ icon: c.icon, label: c.title, to: `/more/${c.slug}`, hint: c.items.slice(0, 2).map((x) => x.label).join(' · ') })),
    { icon: Sparkles, label: 'Vocation', to: '/vocation' },
  ];
  const accountItems: MenuItem[] = [
    { icon: UserCircle, label: t('more.myAccount'), to: '/account' },
    { icon: SettingsIcon, label: t('more.settings'), to: '/settings' },
  ];

  const rowFocus = 'outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--c-ring)]';

  const Group = ({ label, items }: { label: string; items: MenuItem[] }) => (
    <section aria-label={label}>
      <h2 className="mb-3 flex items-center gap-2.5 px-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink2">
        <span aria-hidden className="h-px w-5 bg-gold" />{label}
      </h2>
      <Card className="overflow-hidden rounded-[20px] p-0">
        {items.map((it, i) => (
          <button key={it.to} onClick={() => nav(it.to)}
            className={`group press flex min-h-[68px] w-full items-center gap-3.5 py-2.5 pl-3.5 pr-2.5 text-left hover:bg-card2/60 active:bg-card2 ${rowFocus} ${i > 0 ? 'border-t border-line' : ''}`}>
            <span aria-hidden className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-emeraldl text-emerald"><it.icon size={21} strokeWidth={1.75} /></span>
            <span className="min-w-0 flex-1">
              <span className="block break-words text-[15.5px] font-semibold leading-snug tracking-[-0.005em] text-ink">{it.label}</span>
              {it.hint && <span className="mt-0.5 block truncate text-[13px] leading-snug text-ink2">{it.hint}</span>}
            </span>
            <Chevron />
          </button>
        ))}
      </Card>
    </section>
  );

  return (
    <Screen title={t('more.title')}>
      {user && (
        <Card onClick={() => nav('/account')} className={`group mb-7 flex min-h-[92px] items-center gap-4 rounded-[20px] py-3.5 pl-4 pr-2.5 ${rowFocus}`}>
          <span className="shrink-0 rounded-full p-[2px] ring-1 ring-[color-mix(in_srgb,var(--c-gold)_45%,var(--c-border))]">
            <Avatar name={user.name} size={60} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="break-words font-head text-[18px] font-semibold leading-snug text-ink">{displayName(user.name)}</p>
            <p className="mt-0.5 text-[13.5px] text-ink2">{user.role === 'superadmin' ? 'Super Administrator' : 'CMI Member'}</p>
          </div>
          <Chevron />
        </Card>
      )}

      <div className="space-y-7">
        <Group label="CMI Information" items={infoItems} />

        {user?.role === 'superadmin' && (
          <Group label={t('admin.title')} items={[{ icon: Shield, label: t('admin.title'), to: '/admin' }]} />
        )}

        <Group label="Account" items={accountItems} />

        <button onClick={() => setConfirmOut(true)}
          className={`press flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[20px] border border-line bg-card text-[15px] font-semibold text-error shadow-[var(--shadow-sm)] hover:border-[color-mix(in_srgb,var(--c-error)_35%,var(--c-border))] active:bg-card2 ${rowFocus}`}>
          <LogOut size={18} aria-hidden /> {t('auth.signOut')}
        </button>
      </div>

      <Dialog open={confirmOut} onClose={() => setConfirmOut(false)} title={t('auth.signOutConfirm')} body={t('auth.signOutBody')}
        confirmLabel={t('auth.signOut')} cancelLabel={t('common.cancel')} danger onConfirm={() => { signOut(); nav('/signin'); }} />
    </Screen>
  );
}
