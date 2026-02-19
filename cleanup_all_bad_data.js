
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFna292dWVtbmppYWdtdnlvaHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTc4NDUsImV4cCI6MjA4NTU3Mzg0NX0.qrvHaaA8k9951827AkW5rxVVIAPRE4cAGgbZRujLRto';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deepCleanup() {
    console.log('Deep cleaning bad quiz data for user: 고재선');

    // 1. Get User
    const { data: users } = await supabase.from('users').select('id').eq('student_name', '고재선');
    if (!users || users.length === 0) return;
    const userId = users[0].id;

    // 2. Delete ALL records for Day 10 (0/10 scores) - appearing as spam
    console.log('Deleting all Day 10 records...');
    await supabase.from('quiz_history').delete().eq('user_id', userId).eq('day', 10);

    // 3. Delete Day 1 records with low scores if active spam (optional, but let's check first)
    // Actually, let's just keep the BEST record for each Day.
    // Logic: Group by Day, keep max score, delete others.

    // Get all history
    const { data: allHistory } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', userId)
        .order('correct_answers', { ascending: false }); // Best first

    if (!allHistory) return;

    const bestByDay = new Map();
    const toDelete = [];

    allHistory.forEach(h => {
        if (!bestByDay.has(h.day)) {
            bestByDay.set(h.day, h.id);
        } else {
            toDelete.push(h.id);
        }
    });

    console.log(`Found ${toDelete.length} suboptimal/duplicate records to clean up.`);

    if (toDelete.length > 0) {
        // Delete in chunks if needed, but 100 is fine
        const { error } = await supabase
            .from('quiz_history')
            .delete()
            .in('id', toDelete);

        if (error) console.error('Delete error:', error);
        else console.log('Cleanup complete. Kept only best score for each Day.');
    }
}

deepCleanup();
