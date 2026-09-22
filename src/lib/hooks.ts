import { useEffect, useState } from 'react';

/** Breakpoint tiers — mobile & tablet ONLY. No desktop tier exists by design. */
export type Tier = 'mobile' | 'tabletPortrait' | 'tabletLandscape';

export function useBreakpoint(): { tier: Tier; isTablet: boolean; width: number } {
  const get = () => (typeof window === 'undefined' ? 390 : window.innerWidth);
  const [width, setWidth] = useState(get);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  let tier: Tier = 'mobile';
  if (width >= 768 && width < 1024) tier = 'tabletPortrait';
  else if (width >= 1024) tier = 'tabletLandscape';

  return { tier, isTablet: width >= 768, width };
}

/** Locks body scroll while a modal / sheet is open. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
