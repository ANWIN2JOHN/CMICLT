import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle, ChevronDown, Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '../../lib/cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
}

const control =
  'w-full min-h-[52px] rounded-[var(--r-input)] bg-card border px-4 text-[16px] text-ink placeholder:text-ink2/70 outline-none transition-colors focus:border-primary';

export function TextInput({ label, error, hint, leftIcon, className, id, ...rest }: FieldProps) {
  const fid = id || rest.name;
  return (
    <label className="block" htmlFor={fid}>
      {label && <span className="mb-1.5 block text-[14px] font-medium text-ink">{label}</span>}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2">{leftIcon}</span>
        )}
        <input
          id={fid}
          className={cn(control, leftIcon ? 'pl-11' : undefined, error ? 'border-error' : 'border-line', className)}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-error">
          <AlertCircle size={14} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-ink2">{hint}</span>
      ) : null}
    </label>
  );
}

export function PasswordInput({ label, error, hint, className, id, ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const fid = id || rest.name;
  return (
    <label className="block" htmlFor={fid}>
      {label && <span className="mb-1.5 block text-[14px] font-medium text-ink">{label}</span>}
      <div className="relative">
        <input
          id={fid}
          type={show ? 'text' : 'password'}
          className={cn(control, 'pr-12', error ? 'border-error' : 'border-line', className)}
          aria-invalid={!!error}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink2 active:bg-card2"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-error">
          <AlertCircle size={14} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-ink2">{hint}</span>
      ) : null}
    </label>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}
export function SelectField({ label, error, hint, options, className, id, ...rest }: SelectProps) {
  const fid = id || rest.name;
  return (
    <label className="block" htmlFor={fid}>
      {label && <span className="mb-1.5 block text-[14px] font-medium text-ink">{label}</span>}
      <div className="relative">
        <select
          id={fid}
          className={cn(control, 'appearance-none pr-11', error ? 'border-error' : 'border-line', className)}
          aria-invalid={!!error}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink2" />
      </div>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-error">
          <AlertCircle size={14} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-ink2">{hint}</span>
      ) : null}
    </label>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export function TextArea({ label, error, hint, className, id, rows = 4, ...rest }: TextAreaProps) {
  const fid = id || rest.name;
  return (
    <label className="block" htmlFor={fid}>
      {label && <span className="mb-1.5 block text-[14px] font-medium text-ink">{label}</span>}
      <textarea
        id={fid}
        rows={rows}
        className={cn(
          'w-full min-h-[52px] rounded-[var(--r-input)] bg-card border px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-ink2/70 outline-none transition-colors focus:border-primary',
          error ? 'border-error' : 'border-line',
          className,
        )}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-error">
          <AlertCircle size={14} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-ink2">{hint}</span>
      ) : null}
    </label>
  );
}

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}
export function SearchField({ className, value, onClear, ...rest }: SearchProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search size={19} className="pointer-events-none absolute left-3.5 text-ink2" />
      <input
        type="search"
        value={value}
        className="w-full min-h-[52px] rounded-[var(--r-pill)] bg-card border border-line pl-11 pr-4 text-[16px] text-ink placeholder:text-ink2/70 outline-none focus:border-primary"
        {...rest}
      />
    </div>
  );
}
