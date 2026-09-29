import { Home, Landmark, MoreHorizontal, Users, Users2 } from 'lucide-react';
import type { TranslationKey } from '../i18n/en';

export interface NavItem {
  to: string;
  labelKey: TranslationKey;
  icon: typeof Home;
  match: (path: string) => boolean;
}

export const primaryNav: NavItem[] = [
  { to: '/home', labelKey: 'nav.home', icon: Home, match: (p) => p === '/home' },
  { to: '/more/leadership', labelKey: 'nav.administration', icon: Users2, match: (p) => p.startsWith('/more/leadership') },
  { to: '/members', labelKey: 'nav.members', icon: Users, match: (p) => p.startsWith('/members') },
  { to: '/institutions', labelKey: 'nav.institutions', icon: Landmark, match: (p) => p.startsWith('/institutions') },
  { to: '/more', labelKey: 'nav.more', icon: MoreHorizontal, match: (p) => (p.startsWith('/more') && !p.startsWith('/more/leadership')) || isMoreSection(p) },
];

const moreSections = ['/province', '/about', '/administration', '/news', '/gallery', '/vocation', '/chavarul', '/contact', '/account', '/settings'];
export function isMoreSection(p: string) {
  return moreSections.some((s) => p.startsWith(s));
}
