import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { OtpPanel } from './panels';
import { TextInput, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth, type LookupResult } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

type Step = 'identify' | 'password' | 'otp' | 'blocked';

export function SignIn() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { lookup, signIn, completeSignIn } = useAuth();

  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidIdentifier = (v: string) => {
    const s = v.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    const isPhone = /^[+]?[\d][\d\s-]{6,}$/.test(s);
    return isEmail || isPhone;
  };

  const onContinue = async () => {
    if (!identifier.trim()) return;
    if (!isValidIdentifier(identifier)) {
      setResult(null);
      setError(t('auth.identifierInvalid'));
      return;
    }
    setBusy(true); setError(null);
    const r = await lookup(identifier);
    setBusy(false); setResult(r);
    if (r.path === 'active') setStep('password');
    else if (r.path === 'activate') nav('/activate', { state: { identifier, name: r.name } });
    else if (r.path === 'locked') { setError(t('auth.accountLocked')); setStep('blocked'); }
    else if (r.path === 'inactive') { setError(t('auth.inactive')); setStep('blocked'); }
    else setError(t('auth.notFound'));
  };

  const onSignIn = async () => {
    setBusy(true); setError(null);
    const res = await signIn(identifier, password);
    setBusy(false);
    if (!res.ok) { setError('The password you entered is incorrect. Please try again.'); return; }
    if (res.needsOtp) setStep('otp');
    else { completeSignIn(identifier); nav('/home', { replace: true }); }
  };

  // ----- Blocked (locked / inactive) -----
  if (step === 'blocked') {
    const isLocked = result?.path === 'locked';
    return (
      <AuthLayout subtitle={t('auth.signInSubtitle')}>
        <div className="rounded-[var(--r-card)] border border-line bg-card p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--c-error)_14%,transparent)] text-error"><Lock size={22} /></div>
          <h2 className="font-head text-[19px] font-semibold text-ink">{error}</h2>
          <p className="mt-1.5 text-[14px] text-ink2">{isLocked ? t('auth.accountLockedHelp') : t('auth.inactiveHelp')}</p>
        </div>
        <Button variant="outline" fullWidth className="mt-5" onClick={() => { setStep('identify'); setResult(null); setError(null); }}>{t('common.back')}</Button>
      </AuthLayout>
    );
  }

  // ----- OTP (admin second factor) -----
  if (step === 'otp') {
    return (
      <AuthLayout title={t('otp.title')} back onBack={() => setStep('password')}>
        <OtpPanel contact={identifier} onChangeContact={() => setStep('identify')}
          onVerified={() => { completeSignIn(identifier); nav('/home', { replace: true }); }} />
      </AuthLayout>
    );
  }

  // ----- Progressive: identify then password -----
  return (
    <AuthLayout
      title={step === 'password' ? t('auth.welcomeBack') : undefined}
      subtitle={step === 'password' ? result && 'name' in result ? result.name : '' : t('auth.continueHint')}
    >
      {step === 'identify' && (
        <div className="flex flex-col gap-4">
          <TextInput
            label={t('auth.identifierLabel')}
            leftIcon={<Mail size={18} />}
            placeholder={t('auth.identifierPlaceholder')}
            value={identifier}
            inputMode="email"
            autoFocus
            onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && onContinue()}
            error={error ? ' ' : undefined}
          />
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-[14px] bg-[color-mix(in_srgb,var(--c-error)_10%,transparent)] p-3 text-[13px] text-error">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span>{error}</span>
            </div>
          )}
          <Button fullWidth size="lg" loading={busy} disabled={!identifier.trim()} onClick={onContinue}>{t('common.continue')}</Button>
        </div>
      )}

      {step === 'password' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-[14px] bg-card2 px-3.5 py-3 text-[14px] text-ink">
            <Mail size={16} className="text-ink2" />
            <span className="truncate">{identifier}</span>
            <button className="press ml-auto text-[13px] font-medium text-primary" onClick={() => { setStep('identify'); setPassword(''); setError(null); }}>Change</button>
          </div>
          <PasswordInput label={t('auth.password')} value={password} autoFocus
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && onSignIn()}
            error={error ?? undefined} />
          <button className="press -mt-1 self-start text-[14px] font-medium text-primary" onClick={() => nav('/forgot', { state: { identifier } })}>
            {t('auth.forgot')}
          </button>
          <Button fullWidth size="lg" loading={busy} disabled={!password} onClick={onSignIn}>{t('auth.signIn')}</Button>
        </div>
      )}
    </AuthLayout>
  );
}
