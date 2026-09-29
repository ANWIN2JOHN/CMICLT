import { supabase } from '../lib/supabase';
import type { CMIGeneralAdministration } from '../data/types';

export async function getCMIGeneralAdministration(): Promise<CMIGeneralAdministration[]> {
  const { data, error } = await supabase
    .from('cmi_general_administration')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CMIGeneralAdministration[];
}
