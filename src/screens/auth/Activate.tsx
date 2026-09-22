import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { OtpPanel, PasswordPanel } from './panels';
import { Button } from '../../components/ui/Button';
import { SuccessState } from '../../components/ui/states';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

type Step = 'intro' | 'otp' | 'password' | 'done';

export function Activate() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { activate } = useAuth();
  const { state } = useLocation() as { state?: { identifier: string; name: string } };
  const identifier = state?.identifier ?? '';
  const name = state?.name ?? 'Member';
  const [step, setStep] = useState<Step>('intro');

  if (step === 'done') {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[520px] items-center bg-bg px-6">
        <SuccessState
          title="Account activated"
          body={`Welcome to CMICLT, ${name}. Your account is ready.`}
          actionLabel="Enter CMICLT"
          onAction={() => { activate(identifier); nav('/home', { replace: true }); }}
        />
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <AuthLayout title={t('otp.title')} back onBack={() => setStep('intro')}>
        <OtpPanel contact={identifier} onChangeContact={() => setStep('intro')} onVerified={() => setStep('password')} />
      </AuthLayout>
    );
  }

  if (step === 'password') {
    return (
      <AuthLayout title={t('pw.create')} subtitle={t('pw.createSubtitle')} back onBack={() => setStep('otp')}>
        <PasswordPanel submitLabel={t('pw.complete')} onSubmit={() => setStep('done')} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.activateTitle')} subtitle={t('auth.activateSubtitle')} back>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 rounded-[var(--r-card)] border border-line bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emeraldl text-success"><BadgeCheck size={26} /></div>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{name}</p>
            <p className="truncate text-[13px] text-ink2">{identifier}</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-ink2">
          We’ll send a verification code to confirm it’s you, then you can create a password to finish setting up your account.
        </p>
        <div className="mt-auto pt-8">
          <Button fullWidth size="lg" onClick={() => setStep('otp')}>{t('common.continue')}</Button>
        </div>
      </div>
    </AuthLayout>
  );
}
