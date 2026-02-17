-- 퀴즈 기록이 왜 저장이 안 되는지 확인하는 진단 스크립트입니다.

-- 1. quiz_history 테이블에 남아있는 제약조건 확인
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'quiz_history'::regclass;

-- 2. 선생님(고재선)의 최근 퀴즈 기록 확인
SELECT level, day, correct_answers, total_questions, completed_at
FROM quiz_history
WHERE user_id = (SELECT id FROM users WHERE student_name = '고재선')
ORDER BY completed_at DESC;
