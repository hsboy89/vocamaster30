-- 1. Users 테이블 RLS 정책 수정 (UPDATE 허용) (필요시)
-- Supabase 대시보드에서 'users' 테이블 RLS 정책에 "UPDATE for users based on id"가 있는지 확인하세요. 없으면 추가:
-- CREATE POLICY "Enable update for users based on id" ON "public"."users" AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. 이미 등록된 유저의 goal_duration 강제 설정 (고재선 학생)
UPDATE public.users 
SET goal_duration = 5 
WHERE student_name = '고재선' AND (goal_duration IS NULL OR goal_duration = 0);

-- 3. academy_id 누락 데이터 보정 (안전장치)
UPDATE public.student_progress sp
SET academy_id = u.academy_id
FROM public.users u
WHERE sp.user_id = u.id 
  AND sp.academy_id IS NULL;

-- 4. quiz_history 누락 데이터 보정
UPDATE public.quiz_history qh
SET academy_id = u.academy_id
FROM public.users u
WHERE qh.user_id = u.id 
  AND qh.academy_id IS NULL;
