import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { OtpInput } from '../../components/ui/OtpInput';
import { PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLocale } from '../../contexts/LocaleContext';
import { cn } from '../../lib/cn';

/* Reusable OTP panel — shared by sign-in second factor, activation and password reset. */
export function OtpPanel({ contact, onVerified, onChangeContact }: {
  contact: string; onVerified: () => void; onChangeContact: () => void;
}) {
  const { t } = useLocale();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'invalid' | 'expired'>('idle');
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const verify = () => {
    if (seconds <= 0) { setStatus('expired'); return; }
    setStatus('verifying');
    setTimeout(() => {
      if (code === '123456') onVerified();
      else setStatus('invalid');
    }, 800);
  };

  const resend = () => { setSeconds(30); setStatus('idle'); setCode(''); };

  return (
    <div className="flex h-full flex-col">
      <p className="text-[15px] text-ink2">
        {t('otp.subtitle')} <span className="font-medium text-ink">{contact}</span>
      </p>
      <div className="mt-6">
        <OtpInput value={code} onChange={(v) => { setCode(v); setStatus('idle'); }} error={status === 'invalid' || status === 'expired'} />
        {status === 'invalid' && <p role="alert" className="mt-3 text-[13px] text-error">{t('otp.invalid')}</p>}
        {status === 'expired' && <p role="alert" className="mt-3 text-[13px] text-error">{t('otp.expired')}</p>}
      </div>
      <div className="mt-5 flex items-center justify-between">
        {seconds > 0 ? (
          <span className="text-[14px] text-ink2">{t('otp.resendIn')} {seconds}s</span>
        ) : (
          <button className="press min-h-[44px] text-[14px] font-medium text-primary" onClick={resend}>
            {t('otp.resend')}
          </button>
        )}
        <button className="press min-h-[44px] text-[14px] font-medium text-ink2" onClick={onChangeContact}>{t('otp.change')}</button>
      </div>
      <div className="mt-auto pt-8">
        <Button fullWidth size="lg" loading={status === 'verifying'} disabled={code.length < 6} onClick={verify}>
          {t('otp.verify')}
        </Button>
      </div>
    </div>
  );
}

/* Reusable password creation panel with live strength + requirements */
export function PasswordPanel({ submitLabel, onSubmit }: { submitLabel: string; onSubmit: () => void }) {
  const { t } = useLocale();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

  const reqs = useMemo(() => ({
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    match: pw.length > 0 && pw === confirm,
  }), [pw, confirm]);

  const score = [reqs.len, reqs.upper, reqs.number, /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const strength = [t('pw.weak'), t('pw.weak'), t('pw.fair'), t('pw.good'), t('pw.strong')][score];
  const strengthColor = ['bg-error', 'bg-error', 'bg-warning', 'bg-emerald2', 'bg-success'][score];
  const canSubmit = reqs.len && reqs.upper && reqs.number && reqs.match;

  return (
    <div className="flex h-full flex-col gap-4">
      <PasswordInput label={t('auth.newPassword')} value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      {pw && (
        <div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink2">{t('pw.strength')}</span>
            <span className="font-medium text-ink">{strength}</span>
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < score ? strengthColor : 'bg-card2')} />
            ))}
          </div>
        </div>
      )}
      <PasswordInput label={t('auth.confirmPassword')} value={confirm} onChange={(e) => setConfirm(e.target.value)}
        error={confirm && !reqs.match ? t('pw.mismatch') : undefined} />
      <ul className="grid gap-2">
        {([['len', 'pw.req.len'], ['upper', 'pw.req.upper'], ['number', 'pw.req.number'], ['match', 'pw.req.match']] as const).map(([k, label]) => {
          const ok = reqs[k];
          return (
            <li key={k} className="flex items-center gap-2 text-[13px]">
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full', ok ? 'bg-success text-white' : 'bg-card2 text-ink2')}>
                {ok ? <Check size={13} /> : <X size={13} />}
              </span>
              <span className={ok ? 'text-ink' : 'text-ink2'}>{t(label)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" disabled={!canSubmit} onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
}
