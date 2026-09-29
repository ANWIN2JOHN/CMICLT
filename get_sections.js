import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/(?:VITE_SUPABASE_ANON_KEY|VITE_SUPABASE_PUBLISHABLE_KEY)=(.+)/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
  const { data, error } = await supabase.from('directory_import_institutions').select('section').limit(100);
  if (error) console.error(error);
  const sections = [...new Set(data?.map(d => d.section))];
  console.log("Sections:", sections);
}
run();
