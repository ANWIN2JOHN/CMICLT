import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getKristuRajaSubRegionAdmin } from '../../services/cmiExternalAdministrationService';
import type { CmiExternalAdministration } from '../../data/types';

export function KristuRajaSubRegion() {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    admin: CmiExternalAdministration;
    member: { name: string; phone: string | null; email: string | null; photo_url: string | null } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const result = await getKristuRajaSubRegionAdmin();
        if (!active) return;
        setData(result);
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
      <Screen back title="Kristu Raja Sub-Region">
        <ErrorState 
          title="Unable to load administration data." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title="Kristu Raja Sub-Region">
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen back title="Kristu Raja Sub-Region">
        <EmptyState title="No records available." />
      </Screen>
    );
  }



  const { admin, member } = data;
  
  // Use member data dynamically fetched, fallback to admin data if member isn't found
  const displayName = member?.name || admin.member_name || 'Fr Sujith Varickamackal CMI';
  const designation = admin.designation || 'Sub-Regional Superior';
  const photoUrl = member?.photo_url || undefined;
  
  // Combine phones and emails from both records if needed, preferring member
  const rawPhone = member?.phone || (admin.mobile_numbers.length > 0 ? admin.mobile_numbers.join(',') : null);
  const rawEmail = member?.email || (admin.email_addresses.length > 0 ? admin.email_addresses.join(',') : null);

  const phones = rawPhone ? rawPhone.split(',').map(p => p.trim()).filter(Boolean) : [];
  const emails = rawEmail ? rawEmail.split(',').map(e => e.trim()).filter(Boolean) : [];

  const missionCenters = [
    { name: 'Yesupal Ashram, Jammu', id: '65887fb1-db16-58de-a8a7-72c846b8fd7f' },
    { name: 'Christ Niwas, Nowshera', id: '49ed41eb-75c8-53ee-926a-9c787d9691b5' },
    { name: "St. Mary's CMI House, Lamberi", id: '087b1995-d401-5093-a5c0-96bb5af3c1df' },
    { name: 'Christ Ashram, Sunderbani', id: 'ff7346dc-d6a5-5d36-ac60-e5b048ef0c21' },
    { name: 'Chavara Bhavan, Rajouri', id: '4a3046ec-1d39-5535-bb62-4e19bcfd25db' },
    { name: 'St. Ignatius Ashram, Poonch', id: 'a5ba5fab-2b1d-5594-851e-01685439209a' },
  ];

  return (
    <Screen back title="Kristu Raja Sub-Region, Jammu-Kashmir">
      <div className="space-y-4">
        
        {/* Introductory Card */}
        <Card className="p-4">
          <p className="text-[14px] leading-relaxed text-ink2">
            In 1989, Bishop Hippolitus (Bishop of Jammu-Kashmir) entrusted Poonch and Rajouri Districts of Jammu-Kashmir state to St. Thomas province for mission work. The CMI fathers, together with the CMC sisters and Nazareth sisters of Thalassery, began the mission work in 1989. There are now six centers in the mission: Jammu, Nowshera, Lamberi, Sunderbani, Rajouri and Poonch.
          </p>
        </Card>

        {/* Mission Centers Section */}
        <div>
          <h2 className="mb-2 px-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink2">Mission Centers</h2>
          <Card className="overflow-hidden p-0">
            {missionCenters.map((center, i) => (
              <button 
                key={center.id} 
                onClick={() => navigate(`/institutions/${center.id}`)}
                className={`press flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                  <MapPin size={16} />
                </span>
                <span className="flex-1 text-[15px] font-medium text-ink">{center.name}</span>
                <ChevronRight size={18} className="shrink-0 text-ink2" />
              </button>
            ))}
          </Card>
        </div>

        {/* Administration Section */}
        <div>
          <h2 className="mb-2 px-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink2">Administration</h2>
          <Card className="p-4">
            <div className="flex items-start gap-4">
              <Avatar name={displayName} src={photoUrl} size={64} />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-ink text-[16px]">{displayName}</h3>
                <p className="text-primary font-medium text-[13px]">{designation}</p>
                
                {admin.address && (
                  <p className="text-ink2 text-[13px] mt-1.5 whitespace-pre-line">{admin.address}</p>
                )}
                
                <div className="mt-3 space-y-2">
                  {phones.map((phone, i) => (
                    <button 
                      key={`phone-${i}`} 
                      onClick={() => handlePhoneTap(phone, displayName)}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
                      aria-label={`Call ${displayName} at ${phone}`}
                    >
                      <Phone size={15} className="shrink-0" />
                      <span className="text-[14px]">{phone}</span>
                    </button>
                  ))}
                  
                  {emails.map((email, i) => (
                    <a 
                      key={`email-${i}`} 
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
                      aria-label={`Email ${displayName} at ${email}`}
                    >
                      <Mail size={15} className="shrink-0" />
                      <span className="text-[14px] break-all">{email}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
        
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </Screen>
  );
}
