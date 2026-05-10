import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tvlzkkrewfoksgdmccpr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bHpra3Jld2Zva3NnZG1jY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDczNjksImV4cCI6MjA5MjgyMzM2OX0.Uxoc4O_aaReAWjKgnNPXc28UuZwqHHrGX5NZoGija-s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: tutors } = await supabase.from('profiles').select('*').in('role', ['instructor', 'pending_instructor']);
  console.log("Tutors:", tutors?.map(t => ({ id: t.id, status: t.status, role: t.role })));

  if (tutors && tutors.length > 0) {
    const tutor = tutors[0];
    console.log(`Trying to update tutor ${tutor.id}...`);
    const { data, error } = await supabase.from('profiles').update({ status: 'active', role: 'instructor' }).eq('id', tutor.id).select();
    console.log("Update result:", { data, error });
  }
}

run();
