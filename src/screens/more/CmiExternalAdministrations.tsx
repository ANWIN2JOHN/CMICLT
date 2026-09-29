import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card } from '../../components/ui/primitives';

export function CmiExternalAdministrations() {
  const nav = useNavigate();

  const items = [
    { label: 'Coordinators Abroad', to: '/more/leadership/external-administrations/coordinators-abroad' },
    { label: 'Regionals', to: '/more/leadership/external-administrations/regionals' },
    { label: 'Subregionals', to: '/more/leadership/external-administrations/subregionals' },
  ];

  return (
    <Screen back title="Coordinators Abroad, Regionals and Subregionals">
      <Card className="overflow-hidden p-0">
        {items.map((it, i) => (
          <button 
            key={it.label} 
            onClick={() => nav(it.to)}
            className={`press flex w-full items-center gap-3.5 px-4 py-4 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald">
              <Users size={20} />
            </span>
            <span className="flex-1 text-[15px] font-medium leading-snug text-ink">{it.label}</span>
            <ChevronRight size={18} className="shrink-0 text-ink2" />
          </button>
        ))}
      </Card>
    </Screen>
  );
}
