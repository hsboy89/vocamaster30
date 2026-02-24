-- Supabase RLS Enable Script
-- Run this in the Supabase SQL Editor to resolve the "RLS has not been enabled" warnings.

-- 1. Enable RLS on all mentioned tables
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrong_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_completions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid errors)
DO $$ 
BEGIN
    -- academies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'academies' AND policyname = 'Academy access policy') THEN
        DROP POLICY "Academy access policy" ON public.academies;
    END IF;
    -- users
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users access policy') THEN
        DROP POLICY "Users access policy" ON public.users;
    END IF;
    -- student_progress
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_progress' AND policyname = 'Progress access policy') THEN
        DROP POLICY "Progress access policy" ON public.student_progress;
    END IF;
    -- quiz_history
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_history' AND policyname = 'Quiz access policy') THEN
        DROP POLICY "Quiz access policy" ON public.quiz_history;
    END IF;
    -- wrong_answers
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wrong_answers' AND policyname = 'Wrong answers access policy') THEN
        DROP POLICY "Wrong answers access policy" ON public.wrong_answers;
    END IF;
    -- level_completions
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'level_completions' AND policyname = 'Level completions access policy') THEN
        DROP POLICY "Level completions access policy" ON public.level_completions;
    END IF;
END $$;

-- 3. Create basic "allow all" policies for development
-- Note: Replace these with strict user-id based policies before production
CREATE POLICY "Academy access policy" ON public.academies FOR ALL USING (true);
CREATE POLICY "Users access policy" ON public.users FOR ALL USING (true);
CREATE POLICY "Progress access policy" ON public.student_progress FOR ALL USING (true);
CREATE POLICY "Quiz access policy" ON public.quiz_history FOR ALL USING (true);
CREATE POLICY "Wrong answers access policy" ON public.wrong_answers FOR ALL USING (true);
CREATE POLICY "Level completions access policy" ON public.level_completions FOR ALL USING (true);

-- Done!
