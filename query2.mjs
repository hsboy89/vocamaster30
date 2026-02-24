import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'sb_publishable_1vZZbBI374fW-wp3rtS3gg_qkJzEfwF';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking ALL users named 이예린...");
    const { data: users, error: uError } = await supabase.from('users').select('*').eq('student_name', '이예린');

    if (!users) {
        console.log('No users found', uError);
        return;
    }

    for (const user of users) {
        console.log(`Checking progress for user_id: ${user.id} at academy: ${user.academy_id}`);
        const { data: progress, error: pError } = await supabase.from('student_progress').select('*').eq('user_id', user.id);

        console.log(`Progress count for ${user.id}:`, progress?.length, pError);
        if (progress && progress.length > 0) {
            console.log('Progress items:', progress);
        }
    }
}

check().catch(console.error);
