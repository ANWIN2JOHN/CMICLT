import { supabase } from '../lib/supabase';
import type { CmiExternalAdministration } from '../data/types';

export async function getCmiExternalAdministrations(category: 'COORDINATOR_ABROAD' | 'REGIONAL' | 'SUBREGIONAL'): Promise<CmiExternalAdministration[]> {
  const { data, error } = await supabase
    .from('cmi_external_administrations')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CmiExternalAdministration[];
}

export async function getKristuRajaSubRegionAdmin(): Promise<{ admin: CmiExternalAdministration, member: { name: string, phone: string | null, email: string | null, photo_url: string | null } | null }> {
  const { data: adminData, error: adminError } = await supabase
    .from('cmi_external_administrations')
    .select('*')
    .ilike('title', '%Christu Raja%Jammu%')
    .single();

  if (adminError) {
    throw adminError;
  }

  // Fetch Fr. Sujith from public.members dynamically using ilike
  const { data: memberData, error: memberError } = await supabase
    .from('members')
    .select('name, phone, email, photo_url')
    .ilike('name', '%Sujith%')
    .ilike('name', '%Varickamackal%')
    .is('archived_at', null)
    .limit(1)
    .maybeSingle();

  if (memberError) {
    throw memberError;
  }

  return { 
    admin: adminData as CmiExternalAdministration, 
    member: memberData 
  };
}
