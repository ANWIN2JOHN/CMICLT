import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

export function OtpInput({ value, onChange, error }: {
  value: string; onChange: (v: string) => void; error?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');

  const setDigit = (i: number, d: string) => {
    const arr = value.padEnd(6, ' ').slice(0, 6).split('');
    arr[i] = d;
    onChange(arr.join('').replace(/\s/g, ''));
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i].trim() && i > 0) refs.current[i - 1]?.focus();
  };
  const onInput = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigit(i, d);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const onPaste = (e: ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text) { onChange(text); refs.current[Math.min(text.length, 5)]?.focus(); e.preventDefault(); }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={digits[i].trim()}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          className={cn(
            'h-14 w-full min-w-0 rounded-[14px] border bg-card text-center font-head text-[24px] font-semibold text-ink outline-none focus:border-primary',
            error ? 'border-error' : 'border-line',
          )}
        />
      ))}
    </div>
  );
}
