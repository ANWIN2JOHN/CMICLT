import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { en, type TranslationKey } from '../i18n/en';

/**
 * CMICLT is an English-only application. This context provides the single string
 * lookup used across every screen; there is no language switching.
 */
type LocaleCtx = {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>) => {
    let str: string = en[key] || (key as string);
    if (vars) for (const k of Object.keys(vars)) str = str.replace(`{${k}}`, String(vars[k]));
    return str;
  }, []);

  const value = useMemo(() => ({ t }), [t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
