import { useEffect, useState } from 'react';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import {
  AdministrationMemberCard,
  AdministrationSectionHeading,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';
import { getCMIGeneralAdministration } from '../../services/cmiGeneralAdministrationService';
import type { CMIGeneralAdministration } from '../../data/types';

export function CMIGeneralAdministrationScreen() {
  const [data, setData] = useState<CMIGeneralAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows = await getCMIGeneralAdministration();
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
      <LeadershipScreen
      stacked title="CMI General Administration">
        <ErrorState 
          title="Unable to load administration data." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen
      stacked title="CMI General Administration">
        <div className="pt-3"><AdministrationSkeletons /></div>
      </LeadershipScreen>
    );
  }

  if (data.length === 0) {
    return (
      <LeadershipScreen
      stacked title="CMI General Administration">
        <EmptyState title="No general administration members available." />
      </LeadershipScreen>
    );
  }



  return (
    <LeadershipScreen
      stacked
      title="CMI General Administration"
      description="The Prior General and General Council serving the CMI congregation."
    >
      <div className="pt-1">
        <AdministrationSectionHeading badge title="General Council" detail="2026" />
        <div className="grid gap-3 md:grid-cols-2">
        {data.map((m) => (
          <AdministrationMemberCard
            key={m.id}
            name={m.member_name}
            role={m.designation}
            photo={m.photo_url || undefined}
            phones={(m.mobile_numbers || []).filter(Boolean)}
            emails={(m.email_addresses || []).filter(Boolean)}
            onPhone={handlePhoneTap}
          />
        ))}
        </div>
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </LeadershipScreen>
  );
}
