
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agkovuemnjiagmvyohtb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFna292dWVtbmppYWdtdnlvaHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTc4NDUsImV4cCI6MjA4NTU3Mzg0NX0.qrvHaaA8k9951827AkW5rxVVIAPRE4cAGgbZRujLRto';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking data for user: 고재선');

    // 1. Get User
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('student_name', '고재선');

    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }

    if (!users || users.length === 0) {
        console.log('User not found!');
        return;
    }

    const user = users[0];
    console.log('User found:', { id: user.id, name: user.student_name, academy_id: user.academy_id });

    // 2. Get Quiz History
    const { data: quizzes, error: quizError } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

    if (quizError) {
        console.error('Error fetching quizzes:', quizError);
    } else {
        console.log(`Found ${quizzes.length} quiz records:`);
        quizzes.forEach(q => {
            console.log(`- Day ${q.day} (${q.quiz_type}): Score=${q.correct_answers}/${q.total_questions}, CompletedAt=${q.completed_at}`);
        });
    }

    // 3. Get Student Progress
    const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_studied_at', { ascending: false });

    if (progressError) {
        console.error('Error fetching progress:', progressError);
    } else {
        console.log(`Found ${progress.length} progress records:`);
        progress.forEach(p => {
            console.log(`- Level ${p.level} Day ${p.day}: Status=${p.status}, Words=${p.memorized_words?.length}, LastStudied=${p.last_studied_at}`);
        });
    }

    // 4. Calculate Ranking Metrics (Month Start)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    console.log('Month Start:', monthStart);

    const monthQuizzes = quizzes.filter(q => q.completed_at >= monthStart);
    const monthProgress = progress.filter(p => p.status === 'completed' && p.last_studied_at >= monthStart);

    console.log('--- Ranking Metrics Calculation ---');
    console.log(`Completed Days (This Month): ${monthProgress.length}`);

    // Calculate Average Score
    let totalScore = 0;
    let quizCount = 0;
    monthQuizzes.forEach(q => {
        if (q.total_questions > 0) {
            let correct = q.correct_answers;
            // The logic from admin.ts: if (correct > total) correct = round(correct/5)
            if (correct > q.total_questions) {
                correct = Math.round(correct / 5);
            }
            const score = (correct / q.total_questions) * 100;
            totalScore += score;
            quizCount++;
            console.log(`  > Day ${q.day} Score Contribution: ${score}% (Correct: ${q.correct_answers}/${q.total_questions})`);
        }
    });

    const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
    console.log(`Average Score: ${avgScore}`);
}

checkData();
