import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LogOut, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Avatar, Card, StatusChip } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
import { PasswordPanel } from '../auth/panels';
import { BottomSheet, Dialog, useToast } from '../../components/ui/overlays';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

export function Account() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const { notify } = useToast();
  const [pwOpen, setPwOpen] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const m = user?.member;

  return (
    <Screen back title={t('account.title')}>
      <div className="flex flex-col items-center pt-2 text-center">
        <Avatar name={user?.name ?? 'Member'} size={96} />
        <h1 className="mt-4 font-head text-[23px] font-semibold text-ink">{user?.name}</h1>
        <p className="mt-1 text-[15px] text-primary">{m?.role ?? (user?.role === 'superadmin' ? 'Super Administrator' : 'CMI Member')}</p>
        {m && <p className="text-[14px] text-ink2">{m.house}</p>}
        <StatusChip tone="success"><ShieldCheck size={13} /> {t('account.active')}</StatusChip>
      </div>

      {m && (
        <Card className="mt-6 divide-y divide-line p-0">
          <div className="flex items-center gap-3 px-4 py-3"><Phone size={17} className="text-ink2" /><span className="text-[15px] text-ink">{m.phone}</span></div>
          <div className="flex items-center gap-3 px-4 py-3"><Mail size={17} className="text-ink2" /><span className="truncate text-[15px] text-ink">{m.email}</span></div>
        </Card>
      )}

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wide text-ink2">{t('account.security')}</h2>
      <Card className="p-0">
        <button onClick={() => setPwOpen(true)} className="press flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-card2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emeraldl text-emerald"><KeyRound size={18} /></span>
          <span className="flex-1 text-[15px] font-medium text-ink">{t('account.changePassword')}</span>
        </button>
      </Card>

      <Button variant="outline" fullWidth className="mt-6 text-error" leftIcon={<LogOut size={18} />} onClick={() => setConfirmOut(true)}>{t('auth.signOut')}</Button>

      <BottomSheet open={pwOpen} onClose={() => setPwOpen(false)} title={t('account.changePassword')}>
        <div className="min-h-[380px]">
          <PasswordPanel submitLabel={t('common.save')} onSubmit={() => { setPwOpen(false); notify('Password updated'); }} />
        </div>
      </BottomSheet>
      <Dialog open={confirmOut} onClose={() => setConfirmOut(false)} title={t('auth.signOutConfirm')} body={t('auth.signOutBody')}
        confirmLabel={t('auth.signOut')} cancelLabel={t('common.cancel')} danger onConfirm={() => { signOut(); nav('/signin'); }} />
    </Screen>
  );
}
