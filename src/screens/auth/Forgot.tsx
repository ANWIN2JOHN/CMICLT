import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { OtpPanel, PasswordPanel } from './panels';
import { TextInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SuccessState } from '../../components/ui/states';
import { useLocale } from '../../contexts/LocaleContext';

type Step = 'identify' | 'otp' | 'password' | 'done';

export function Forgot() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { identifier?: string } };
  const [identifier, setIdentifier] = useState(state?.identifier ?? '');
  const [step, setStep] = useState<Step>('identify');
  const [busy, setBusy] = useState(false);

  if (step === 'done') {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[520px] items-center bg-bg px-6">
        <SuccessState title="Password reset" body="Your password has been updated. Please sign in with your new password."
          actionLabel={t('auth.signIn')} onAction={() => nav('/signin', { replace: true })} />
      </div>
    );
  }
  if (step === 'otp') {
    return (
      <AuthLayout title={t('otp.title')} back onBack={() => setStep('identify')}>
        <OtpPanel contact={identifier} onChangeContact={() => setStep('identify')} onVerified={() => setStep('password')} />
      </AuthLayout>
    );
  }
  if (step === 'password') {
    return (
      <AuthLayout title={t('pw.create')} subtitle={t('pw.createSubtitle')} back onBack={() => setStep('otp')}>
        <PasswordPanel submitLabel={t('pw.reset')} onSubmit={() => setStep('done')} />
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title={t('forgot.title')} subtitle={t('forgot.subtitle')} back>
      <div className="flex flex-col gap-4">
        <TextInput label={t('auth.identifierLabel')} leftIcon={<Mail size={18} />} value={identifier}
          autoFocus placeholder={t('auth.identifierPlaceholder')} onChange={(e) => setIdentifier(e.target.value)} />
        <Button fullWidth size="lg" loading={busy} disabled={!identifier.trim()}
          onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); setStep('otp'); }, 700); }}>
          {t('common.continue')}
        </Button>
      </div>
    </AuthLayout>
  );
}
