import { useState } from 'react';
import { Moon, Smartphone, Sun } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card } from '../../components/ui/primitives';
import { useTheme, type ThemePref } from '../../contexts/ThemeContext';
import { useLocale } from '../../contexts/LocaleContext';
import { cn } from '../../lib/cn';

export function Settings() {
  const { t } = useLocale();
  const { pref, setPref } = useTheme();
  const [notif, setNotif] = useState({ events: true, birthdays: true, feast: true, announcements: true });

  const themes: Array<{ id: ThemePref; label: string; icon: any }> = [
    { id: 'light', label: t('settings.light'), icon: Sun },
    { id: 'dark', label: t('settings.dark'), icon: Moon },
    { id: 'system', label: t('settings.system'), icon: Smartphone },
  ];
  const notifItems: Array<[keyof typeof notif, string]> = [
    ['events', t('settings.notif.events')], ['birthdays', t('settings.notif.birthdays')],
    ['feast', t('settings.notif.feast')], ['announcements', t('settings.notif.announcements')],
  ];

  return (
    <Screen back title={t('settings.title')}>
      <Group label={t('settings.appearance')}>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((th) => (
            <button key={th.id} onClick={() => setPref(th.id)}
              className={cn('press flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-[16px] border',
                pref === th.id ? 'border-primary bg-emeraldl text-emerald dark:text-ink' : 'border-line bg-card text-ink2')}>
              <th.icon size={22} />
              <span className="text-[13px] font-medium">{th.label}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group label={t('settings.notifications')}>
        <Card className="p-0">
          {notifItems.map(([k, label], i) => (
            <div key={k} className={cn('flex items-center justify-between px-4 py-3.5', i > 0 && 'border-t border-line')}>
              <span className="text-[15px] text-ink">{label}</span>
              <Toggle on={notif[k]} onToggle={() => setNotif((n) => ({ ...n, [k]: !n[k] }))} label={label} />
            </div>
          ))}
        </Card>
      </Group>
    </Screen>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink2">{label}</h2>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onToggle}
      className="flex h-11 w-12 shrink-0 items-center">
      <span className={cn('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-primary' : 'bg-line')}>
        <span className={cn('absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', on ? 'translate-x-5' : 'translate-x-0')} />
      </span>
    </button>
  );
}
