-- DB에 저장된 레벨 제약조건(Level Check Constraint)을 완화하는 스크립트입니다.
-- 기존 제약조건(middle, high, advanced)을 삭제하여 코드에서 사용하는 middle_1, middle_2 등의 새로운 값이 저장될 수 있도록 합니다.

-- 1. student_progress 테이블
ALTER TABLE student_progress DROP CONSTRAINT IF EXISTS student_progress_level_check;

-- 2. quiz_history 테이블 (존재하는 경우)
ALTER TABLE quiz_history DROP CONSTRAINT IF EXISTS quiz_history_level_check;

-- 3. wrong_answers 테이블 (존재하는 경우)
ALTER TABLE wrong_answers DROP CONSTRAINT IF EXISTS wrong_answers_level_check;

-- 이 스크립트를 먼저 실행하신 후, 'fix-gojaeseon-progress.sql'을 다시 실행해주세요.
