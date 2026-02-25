import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const [key, ...val] = line.split('=');
    if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
    return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
    try {
        const { data: academies, error: err1 } = await supabase.from('academies').select('*').order('created_at', { ascending: false });
        console.log('Academies count:', academies ? academies.length : 0);
        if (err1) { console.error('Error1:', err1); return; }

        if (academies && academies.length > 0) {
            console.log('First academy:', academies[0]);
        }

        const promises = academies.map(a => supabase.from('users').select('*', { count: 'exact', head: true }).eq('academy_id', a.id).eq('role', 'student'));
        const results = await Promise.all(promises);
        console.log('Count queries finished successfully.', results.length);
    } catch (e) {
        console.error('Exception:', e);
    }
}
test();
