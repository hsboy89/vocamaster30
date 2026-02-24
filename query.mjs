import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'sb_publishable_1vZZbBI374fW-wp3rtS3gg_qkJzEfwF';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking users...");
    const { data: users, error: uError } = await supabase.from('users').select('*').eq('student_name', '이예린');
    console.log('User:', users?.length > 0 ? users[0] : 'Not Found', uError);

    if (users && users.length > 0) {
        const userId = users[0].id;
        console.log(`Checking progress for user_id: ${userId}`);
        const { data: progress, error: pError } = await supabase.from('student_progress').select('*').eq('user_id', userId);
        console.log('Progress count:', progress?.length, pError);
        if (progress && progress.length > 0) {
            console.log('First progress item:', progress[0]);
        }
    }
}

check().catch(console.error);
