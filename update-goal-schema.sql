-- Add columns for Study Goal persistence
-- 이 스크립트를 Supabase SQL Editor에서 실행해주세요.

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS goal_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS goal_level TEXT,
ADD COLUMN IF NOT EXISTS goal_words_per_day INTEGER;

-- 기존 goal_duration은 이미 존재할 수 있으므로 확인
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'goal_duration') THEN
        ALTER TABLE users ADD COLUMN goal_duration INTEGER;
    END IF;
END $$;

-- 코멘트 추가 (선택사항)
COMMENT ON COLUMN users.goal_start_date IS '학습 목표 시작일 (D-Day 계산용)';
COMMENT ON COLUMN users.goal_level IS '학습 목표 설정 당시의 레벨';
COMMENT ON COLUMN users.goal_words_per_day IS '학습 목표 설정 당시의 일일 단어 수';
