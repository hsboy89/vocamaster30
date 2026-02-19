
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFna292dWVtbmppYWdtdnlvaHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTc4NDUsImV4cCI6MjA4NTU3Mzg0NX0.qrvHaaA8k9951827AkW5rxVVIAPRE4cAGgbZRujLRto';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDay2() {
    console.log('Checking Day 2 data for user: 고재선');

    // 1. Get User
    const { data: users } = await supabase.from('users').select('id').eq('student_name', '고재선');
    if (!users || users.length === 0) return;
    const userId = users[0].id;

    // 2. Check Student Progress for Day 2
    const { data: progress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('day', 2);

    console.log('Student Progress for Day 2:', progress);

    // 3. Check Quiz History for Day 2
    const { data: quizzes } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', userId)
        .eq('day', 2);

    console.log('Quiz History for Day 2:', quizzes);
}

checkDay2();
