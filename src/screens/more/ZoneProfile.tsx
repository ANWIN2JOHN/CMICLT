import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Building, ChevronRight, UserRound } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { BottomSheet } from '../../components/ui/overlays';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getZoneById, getZoneAdministration, getZoneHouses, Zone, ZoneAdministration, ZoneHouse } from '../../services/zoneService';

export function ZoneProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [zone, setZone] = useState<Zone | null>(null);
  const [admin, setAdmin] = useState<ZoneAdministration | null>(null);
  const [houses, setHouses] = useState<ZoneHouse[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contactPhone, setContactPhone] = useState<{ number: string; name: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        
        const zoneData = await getZoneById(id as string);
        if (!active) return;
        setZone(zoneData);
        
        if (zoneData) {
          const [adminData, housesData] = await Promise.all([
            getZoneAdministration(zoneData.id),
            getZoneHouses(zoneData.id)
          ]);
          if (!active) return;
          setAdmin(adminData);
          setHouses(housesData);
        }
        
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
  }, [id]);

  if (error) {
    return (
      <Screen back title="Zone Details">
        <ErrorState 
          title="Unable to load zone data." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title="Zone Details">
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </Screen>
    );
  }

  if (!zone) {
    return (
      <Screen back title="Zone Details">
        <EmptyState title="Zone not found." />
      </Screen>
    );
  }

  const handlePhoneTap = (number: string, name: string) => {
    setContactPhone({ number, name });
  };

  const handleCall = () => {
    if (contactPhone) {
      window.location.href = `tel:${contactPhone.number.replace(/[\\s()\\-]/g, '')}`;
      setContactPhone(null);
    }
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      const cleanNumber = contactPhone.number.replace(/[\\s()\\-]/g, '');
      window.location.href = `https://wa.me/${cleanNumber}`;
      setContactPhone(null);
    }
  };
  
  const renderContactButtons = (phone: string | null, email: string | null, name: string) => {
    const phones = phone ? phone.split(',').map(p => p.trim()).filter(Boolean) : [];
    const emails = email ? email.split(',').map(e => e.trim()).filter(Boolean) : [];
    
    if (phones.length === 0 && emails.length === 0) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {phones.map((p, i) => (
          <button 
            key={`phone-${i}`} 
            onClick={(e) => {
              e.stopPropagation();
              handlePhoneTap(p, name);
            }}
            className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
            aria-label={`Call ${name} at ${p}`}
          >
            <Phone size={15} className="shrink-0" />
            <span className="text-[14px]">{p}</span>
          </button>
        ))}
        
        {emails.map((e, i) => (
          <a 
            key={`email-${i}`} 
            href={`mailto:${e}`}
            onClick={(ev) => ev.stopPropagation()}
            className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
            aria-label={`Email ${name} at ${e}`}
          >
            <Mail size={15} className="shrink-0" />
            <span className="text-[14px] break-all">{e}</span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <Screen back title={zone.name}>
      <div className="space-y-4">
        
        {/* Administration Section */}
        {admin && (
          <div>
            <h2 className="mb-2 px-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink2">Administration</h2>
            <div className="space-y-3">
              
              {/* Lead House */}
              {admin.lead_house && (
                <Card 
                  className="p-4" 
                  as="button"
                  onClick={() => navigate(`/institutions/${admin.lead_house!.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={admin.lead_house.name} src={admin.lead_house.photo_url || undefined} size={64} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink text-[16px]">{admin.lead_house.name}</h3>
                      <p className="text-primary font-medium text-[13px]">Lead House</p>
                      
                      {admin.lead_house.address && (
                        <p className="text-ink2 text-[13px] mt-1.5 whitespace-pre-line">{admin.lead_house.address}</p>
                      )}
                      
                      {renderContactButtons(admin.lead_house.phone, admin.lead_house.email, admin.lead_house.name)}
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Coordinator */}
              {admin.coordinator && (
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={admin.coordinator.name} src={admin.coordinator.photo_url || undefined} size={64} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink text-[16px]">{admin.coordinator.name}</h3>
                      <p className="text-primary font-medium text-[13px]">Coordinator</p>
                      {renderContactButtons(admin.coordinator.phone, admin.coordinator.email, admin.coordinator.name)}
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Facilitator */}
              {admin.facilitator && (
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={admin.facilitator.name} src={admin.facilitator.photo_url || undefined} size={64} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink text-[16px]">{admin.facilitator.name}</h3>
                      <p className="text-primary font-medium text-[13px]">Facilitator</p>
                      {renderContactButtons(admin.facilitator.phone, admin.facilitator.email, admin.facilitator.name)}
                    </div>
                  </div>
                </Card>
              )}
              
            </div>
          </div>
        )}

        {/* Houses Section */}
        <div>
          <h2 className="mb-2 px-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink2">Houses</h2>
          {houses.length > 0 ? (
            <Card className="overflow-hidden p-0">
              {houses.map((house, i) => (
                <button 
                  key={house.id} 
                  onClick={() => navigate(`/institutions/${house.id}`)}
                  className={`press flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                    <Building size={16} />
                  </span>
                  <span className="flex-1 text-[15px] font-medium text-ink">{house.name}</span>
                  <ChevronRight size={18} className="shrink-0 text-ink2" />
                </button>
              ))}
            </Card>
          ) : (
            <EmptyState title="No houses found in this zone." />
          )}
        </div>
        
      </div>

      <BottomSheet 
        open={contactPhone !== null} 
        onClose={() => setContactPhone(null)}
        title={contactPhone ? contactPhone.name : ''}
      >
        <div className="space-y-3 pt-2">
          <Button fullWidth onClick={handleCall}>
            Call
          </Button>
          <Button fullWidth variant="outline" onClick={handleWhatsApp}>
            WhatsApp
          </Button>
          <Button fullWidth variant="outline" onClick={() => setContactPhone(null)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
