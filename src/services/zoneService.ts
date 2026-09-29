import { supabase } from '../lib/supabase';

export interface Zone {
  id: string;
  name: string;
}

export interface ZoneAdministration {
  id: string;
  zone_id: string;
  lead_house_institution_id: string | null;
  coordinator_member_id: string | null;
  facilitator_member_id: string | null;
  created_at: string;
  updated_at: string;
  
  lead_house?: {
    id: string;
    name: string;
    photo_url: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
  };
  coordinator?: {
    id: string;
    name: string;
    photo_url: string | null;
    phone: string | null;
    email: string | null;
  };
  facilitator?: {
    id: string;
    name: string;
    photo_url: string | null;
    phone: string | null;
    email: string | null;
  };
}

export interface ZoneHouse {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
}

export async function getZones(): Promise<Zone[]> {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Zone[];
}

export async function getZoneById(id: string): Promise<Zone | null> {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Zone | null;
}

export async function getZoneAdministration(zoneId: string): Promise<ZoneAdministration | null> {
  const { data, error } = await supabase
    .from('zone_administrations')
    .select(`
      *,
      lead_house:institutions!lead_house_institution_id(id, name, photo_url, address, phone, email),
      coordinator:members!coordinator_member_id(id, name, photo_url, phone, email),
      facilitator:members!facilitator_member_id(id, name, photo_url, phone, email)
    `)
    .eq('zone_id', zoneId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ZoneAdministration | null;
}

export async function getZoneHouses(zoneId: string): Promise<ZoneHouse[]> {
  const { data, error } = await supabase
    .from('zone_institutions')
    .select(`
      display_order,
      institution:institutions!institution_id(id, name, address, phone, email)
    `)
    .eq('zone_id', zoneId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  
  const mapped = (data || []).map((row: any) => row.institution).filter(Boolean);
  return mapped as ZoneHouse[];
}
