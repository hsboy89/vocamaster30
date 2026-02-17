-- =====================================================
-- 기존 데이터 academy_id 백필 (Backfill)
-- student_progress, quiz_history, wrong_answers 테이블에서
-- academy_id가 NULL인 레코드를 users 테이블의 academy_id로 업데이트
-- =====================================================

-- 1. student_progress 테이블
UPDATE student_progress sp
SET academy_id = u.academy_id
FROM users u
WHERE sp.user_id = u.id
  AND sp.academy_id IS NULL
  AND u.academy_id IS NOT NULL;

-- 2. quiz_history 테이블
UPDATE quiz_history qh
SET academy_id = u.academy_id
FROM users u
WHERE qh.user_id = u.id
  AND qh.academy_id IS NULL
  AND u.academy_id IS NOT NULL;

-- 3. wrong_answers 테이블
UPDATE wrong_answers wa
SET academy_id = u.academy_id
FROM users u
WHERE wa.user_id = u.id
  AND wa.academy_id IS NULL
  AND u.academy_id IS NOT NULL;
