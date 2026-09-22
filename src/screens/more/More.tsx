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

interface MenuItem { icon: any; label: string; to: string; }

// More menu: grouped CMI Information categories, role-gated Administration, Account.
export function More() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [confirmOut, setConfirmOut] = useState(false);

  // CMI Information: grouped categories + the existing Vocation entry.
  const infoItems: MenuItem[] = [
    ...MORE_CATEGORIES.map((c) => ({ icon: c.icon, label: c.title, to: `/more/${c.slug}` })),
    { icon: Sparkles, label: 'Vocation', to: '/vocation' },
  ];
  const accountItems: MenuItem[] = [
    { icon: UserCircle, label: t('more.myAccount'), to: '/account' },
    { icon: SettingsIcon, label: t('more.settings'), to: '/settings' },
  ];

  const Group = ({ label, items }: { label: string; items: MenuItem[] }) => (
    <div>
      <h2 className="mb-2 px-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink2">{label}</h2>
      <Card className="overflow-hidden p-0">
        {items.map((it, i) => (
          <button key={it.to} onClick={() => nav(it.to)}
            className={`press flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emeraldl text-emerald"><it.icon size={19} /></span>
            <span className="flex-1 text-[15px] font-medium text-ink">{it.label}</span>
            <ChevronRight size={18} className="text-ink2" />
          </button>
        ))}
      </Card>
    </div>
  );

  return (
    <Screen title={t('more.title')}>
      {user && (
        <Card onClick={() => nav('/account')} className="mb-5 flex items-center gap-3.5 p-4">
          <Avatar name={user.name} size={56} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink">{user.name}</p>
            <p className="truncate text-[13px] text-ink2">{user.role === 'superadmin' ? 'Super Administrator' : 'CMI Member'}</p>
          </div>
          <ChevronRight size={18} className="text-ink2" />
        </Card>
      )}

      <div className="space-y-5">
        <Group label="CMI Information" items={infoItems} />

        {user?.role === 'superadmin' && (
          <Group label={t('admin.title')} items={[{ icon: Shield, label: t('admin.title'), to: '/admin' }]} />
        )}

        <Group label="Account" items={accountItems} />

        <button onClick={() => setConfirmOut(true)}
          className="press flex w-full items-center justify-center gap-2 rounded-[var(--r-card)] border border-line bg-card py-3.5 text-[15px] font-medium text-error active:bg-card2">
          <LogOut size={18} /> {t('auth.signOut')}
        </button>
      </div>

      <Dialog open={confirmOut} onClose={() => setConfirmOut(false)} title={t('auth.signOutConfirm')} body={t('auth.signOutBody')}
        confirmLabel={t('auth.signOut')} cancelLabel={t('common.cancel')} danger onConfirm={() => { signOut(); nav('/signin'); }} />
    </Screen>
  );
}
