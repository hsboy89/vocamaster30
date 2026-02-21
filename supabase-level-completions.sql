-- =====================================================
-- level_completions 테이블: 탭(레벨)별 학습 완료 기록
-- 랭킹 산정의 기준이 되는 핵심 테이블
-- =====================================================

CREATE TABLE level_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academy_id UUID REFERENCES academies(id),
  level TEXT NOT NULL,                              -- 'middle_1', 'middle_2', 'high_1', 'high_2', 'csat'
  average_score NUMERIC(5,2) NOT NULL,              -- 레벨 전체 퀴즈 평균 점수 (%)
  total_quizzes INTEGER NOT NULL,                   -- 총 퀴즈 횟수
  passed BOOLEAN NOT NULL DEFAULT false,            -- true if avg ≥ 90% 또는 진급테스트 통과
  promotion_test_taken BOOLEAN DEFAULT false,       -- 진급 테스트 치렀는지 여부
  promotion_test_score NUMERIC(5,2),                -- 진급 테스트 점수 (%)
  attempt_number INTEGER NOT NULL DEFAULT 1,        -- 몇 회차 학습인지 (1회, 2회, ...)
  is_ranking_eligible BOOLEAN NOT NULL DEFAULT true, -- 랭킹 산정 대상 여부 (재학습 시 제외 가능)
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 유니크 제약: 같은 유저가 같은 레벨을 같은 회차로 중복 완료 불가
ALTER TABLE level_completions ADD CONSTRAINT uq_level_completions_user_level_attempt 
  UNIQUE(user_id, level, attempt_number);

-- 인덱스
CREATE INDEX idx_level_completions_academy ON level_completions(academy_id);
CREATE INDEX idx_level_completions_level ON level_completions(level);
CREATE INDEX idx_level_completions_user ON level_completions(user_id);
CREATE INDEX idx_level_completions_ranking ON level_completions(academy_id, level, is_ranking_eligible);

-- RLS (Row Level Security) - 필요 시 활성화
-- ALTER TABLE level_completions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- users 테이블에 시작 레벨 (접근 권한) 컬럼 추가
-- 관리자가 학생 등록 시 설정 (중학생: middle_1, 고등학생: high_1 등)
-- =====================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS start_level TEXT DEFAULT 'middle_1';

-- 기존 학생들은 middle_1부터 시작하도록 기본값 설정
UPDATE users SET start_level = 'middle_1' WHERE start_level IS NULL AND role = 'student';
