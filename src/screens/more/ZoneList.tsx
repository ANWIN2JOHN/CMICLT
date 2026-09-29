import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ChevronRight } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Skeleton } from '../../components/ui/primitives';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getZones, Zone } from '../../services/zoneService';

export function ZoneList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const rows = await getZones();
        if (!active) return;
        setData(rows);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(true);
        setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  if (error) {
    return (
      <Screen back title="Zones of St. Thomas Province">
        <ErrorState 
          title="Unable to load zones." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title="Zones of St. Thomas Province">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen back title="Zones of St. Thomas Province">
        <EmptyState title="No zones available." />
      </Screen>
    );
  }

  return (
    <Screen back title="Zones of St. Thomas Province">
      <Card className="overflow-hidden p-0">
        {data.map((zone, i) => (
          <button 
            key={zone.id} 
            onClick={() => navigate(`/more/leadership/zones/${zone.id}`)}
            className={`press flex w-full items-center gap-3.5 px-4 py-4 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald">
              <Map size={20} />
            </span>
            <span className="flex-1 text-[15px] font-medium leading-snug text-ink">{zone.name}</span>
            <ChevronRight size={18} className="shrink-0 text-ink2" />
          </button>
        ))}
      </Card>
    </Screen>
  );
}
