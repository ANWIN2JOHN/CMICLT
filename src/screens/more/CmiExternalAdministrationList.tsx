import { useEffect, useState } from 'react';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import {
  AdministrationMemberCard,
  AdministrationSectionHeading,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';
import { getCmiExternalAdministrations } from '../../services/cmiExternalAdministrationService';
import type { CmiExternalAdministration } from '../../data/types';

interface CmiExternalAdministrationListProps {
  category: 'COORDINATOR_ABROAD' | 'REGIONAL' | 'SUBREGIONAL';
  title: string;
}

export function CmiExternalAdministrationList({ category, title }: CmiExternalAdministrationListProps) {
  const [data, setData] = useState<CmiExternalAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const rows = await getCmiExternalAdministrations(category);
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
  }, [category]);

  if (error) {
    return (
      <LeadershipScreen title={title}>
        <ErrorState 
          title="Unable to load data." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen title={title}>
        <div className="pt-3"><AdministrationSkeletons /></div>
      </LeadershipScreen>
    );
  }

  if (data.length === 0) {
    return (
      <LeadershipScreen title={title}>
        <EmptyState title="No records available." />
      </LeadershipScreen>
    );
  }



  return (
    <LeadershipScreen title={title} description={`Directory and contact information for CMI ${title.toLowerCase()}.`}>
      <div className="pt-3">
        <AdministrationSectionHeading title={title} detail={`${data.length} ${data.length === 1 ? 'record' : 'records'}`} />
        <div className="grid gap-3 md:grid-cols-2">
        {data.map((m) => {
          const primaryName = m.member_name || m.title;
          const showTitle = m.member_name && m.title && m.title !== m.designation;

          return (
            <AdministrationMemberCard
              key={m.id}
              name={primaryName}
              role={[m.designation, showTitle ? m.title : null].filter(Boolean).join(' · ')}
              phones={(m.mobile_numbers || []).filter(Boolean)}
              emails={(m.email_addresses || []).filter(Boolean)}
              address={m.address}
              onPhone={handlePhoneTap}
            />
          );
        })}
        </div>
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </LeadershipScreen>
  );
}
