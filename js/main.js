const SUPABASE_URL = 'https://txyqlirnzascwzgbilpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXFsaXJuemFzY3d6Z2JpbHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzkwNzQsImV4cCI6MjA3ODI1NTA3NH0.gN2RCZoTpeADgkRY7ct97QdCPf5IePstcBzi-VgWHLc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Nepal Time
const nepalOffset = 5.75 * 60 * 60 * 1000;
function nepalNow() { return new Date(Date.now() + nepalOffset); }

// Generate 10-digit Voter ID
async function generateVoterId() {
  for (let i = 0; i < 100; i++) {
    const id = String(Math.floor(1000000000 + Math.random() * 9000000000));
    const { data } = await supabase.from('voters').select('voter_id').eq('voter_id', id);
    if (!data || data.length === 0) return id;
  }
  return 'TEMP' + Date.now();
}

// Upload photo
async function uploadPhoto(file, folder = 'profiles') {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('photos').upload(`${folder}/${fileName}`, file);
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(`${folder}/${fileName}`);
  return data.publicUrl;
}

function getElectionId() {
  return new URLSearchParams(window.location.search).get('id');
}
