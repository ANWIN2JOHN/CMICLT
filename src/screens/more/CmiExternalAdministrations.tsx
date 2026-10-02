import { useNavigate } from 'react-router-dom';
import { Globe2, MapPinned, Network } from 'lucide-react';
import { AdministrationMenu, LeadershipScreen } from '../../components/patterns/AdministrationUI';

export function CmiExternalAdministrations() {
  const nav = useNavigate();

  const items = [
    { label: 'Coordinators Abroad', to: '/more/leadership/external-administrations/coordinators-abroad', icon: Globe2, description: 'CMI coordinators serving communities outside India.' },
    { label: 'Regionals', to: '/more/leadership/external-administrations/regionals', icon: MapPinned, description: 'Regional leadership and contact information.' },
    { label: 'Subregionals', to: '/more/leadership/external-administrations/subregionals', icon: Network, description: 'Subregional superiors and administrative contacts.' },
  ];

  return (
    <LeadershipScreen
      title="International Administration"
      description="Coordinators, regional superiors and subregional leadership serving CMI communities abroad."
    >
      <div className="pt-3">
        <AdministrationMenu items={items} onSelect={nav} />
      </div>
    </LeadershipScreen>
  );
}
