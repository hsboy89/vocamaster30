
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFna292dWVtbmppYWdtdnlvaHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTc4NDUsImV4cCI6MjA4NTU3Mzg0NX0.qrvHaaA8k9951827AkW5rxVVIAPRE4cAGgbZRujLRto';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
    console.log('Cleaning up duplicate Day 2 records for user: 고재선');

    // 1. Get User
    const { data: users } = await supabase.from('users').select('id').eq('student_name', '고재선');
    if (!users || users.length === 0) return;
    const userId = users[0].id;

    // 2. Get duplicates to delete (Keep the first one)
    const { data: quizzes } = await supabase
        .from('quiz_history')
        .select('id, completed_at')
        .eq('user_id', userId)
        .eq('day', 2)
        .order('completed_at', { ascending: false });

    if (!quizzes || quizzes.length <= 1) {
        console.log('No duplicates found or only 1 record exists.');
        return;
    }

    console.log(`Found ${quizzes.length} records. Keeping the first one.`);

    // Keep index 0, delete 1..n
    const toDelete = quizzes.slice(1).map(q => q.id);
    console.log(`Deleting ${toDelete.length} records...`);

    const { error } = await supabase
        .from('quiz_history')
        .delete()
        .in('id', toDelete);

    if (error) {
        console.error('Failed to delete:', error);
    } else {
        console.log('Cleanup successful.');
    }
}

cleanupDuplicates();
