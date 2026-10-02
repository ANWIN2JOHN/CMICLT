import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { EmptyState, ErrorState } from '../../components/ui/states';
import {
  AdministrationMenu,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';
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
      <LeadershipScreen title="Zones of St. Thomas Province">
        <ErrorState 
          title="Unable to load zones." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen title="Zones of St. Thomas Province">
        <div className="pt-3"><AdministrationSkeletons count={6} compact /></div>
      </LeadershipScreen>
    );
  }

  if (data.length === 0) {
    return (
      <LeadershipScreen title="Zones of St. Thomas Province">
        <EmptyState title="No zones available." />
      </LeadershipScreen>
    );
  }

  return (
    <LeadershipScreen
      title="Zones of St. Thomas Province"
      description="Browse zone leadership, lead houses and member institutions across the province."
    >
      <div className="pt-3">
        <AdministrationMenu
          items={data.map((zone) => ({
            label: zone.name,
            to: `/more/leadership/zones/${zone.id}`,
            icon: Map,
            description: 'View zone administration and houses',
          }))}
          onSelect={navigate}
        />
      </div>
    </LeadershipScreen>
  );
}
