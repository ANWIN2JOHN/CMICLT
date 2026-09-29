import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users2 } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card } from '../../components/ui/primitives';

export function DepartmentCouncils() {
  const nav = useNavigate();

  const items = [
    { label: 'Religious Life, Formation and Administration', to: '/more/leadership/department-councils/religious-life-formation-administration' },
    { label: 'Evangelization and Pastoral Ministry', to: '/more/leadership/department-councils/evangelization-pastoral-ministry' },
    { label: 'Education and Communication Media', to: '/more/leadership/department-councils/education-communication-media' },
    { label: 'Social Apostolate and Healthcare', to: '/more/leadership/department-councils/social-apostolate-healthcare' },
    { label: 'Finance and Agriculture', to: '/more/leadership/department-councils/finance-agriculture' },
  ];

  return (
    <Screen back title="Department Councils">
      <Card className="overflow-hidden p-0">
        {items.map((it, i) => (
          <button 
            key={it.label} 
            onClick={() => nav(it.to)}
            className={`press flex w-full items-center gap-3.5 px-4 py-4 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald">
              <Users2 size={20} />
            </span>
            <span className="flex-1 text-[15px] font-medium leading-snug text-ink">{it.label}</span>
            <ChevronRight size={18} className="shrink-0 text-ink2" />
          </button>
        ))}
      </Card>
    </Screen>
  );
}
