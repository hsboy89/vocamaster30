-- DB에 저장된 레벨 값들과 제약조건을 확인하는 쿼리입니다.
-- 실행 결과를 알려주시면 그에 맞춰 복구 스크립트를 수정해 드리겠습니다.

-- 1. 현재 저장되어 있는 레벨 값들 확인
SELECT DISTINCT level FROM student_progress;

-- 2. 제약조건(허용된 값 목록) 확인
SELECT pg_get_constraintdef(oid) as check_definition
FROM pg_constraint 
WHERE conname = 'student_progress_level_check';
