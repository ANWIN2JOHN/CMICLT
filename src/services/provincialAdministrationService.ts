import { supabase } from '../lib/supabase';
import type { ProvincialAdministration } from '../data/types';

export async function getProvincialAdministrations(): Promise<ProvincialAdministration[]> {
  const { data, error } = await supabase
    .from('provincial_administrations')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data as ProvincialAdministration[];
}
