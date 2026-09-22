import { cn } from '../lib/cn';
import emblem from '../assets/cmi-emblem.png';

/**
 * Shared authentication branding — the official CMI emblem above the
 * province name. Centered; used across every auth screen via AuthLayout.
 */
export function AuthBrand({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <img
        src={emblem}
        alt="CMI St Thomas Province Kozhikode emblem"
        className="h-[152px] w-auto object-contain"
      />
      <p className="mt-3 font-head text-[19px] font-semibold tracking-[0.12em] text-ink">
        CMI ST THOMAS PROVINCE
      </p>
      <p className="mt-1 text-[13px] font-medium tracking-[0.32em] text-ink2">
        KOZHIKODE
      </p>
    </div>
  );
}
