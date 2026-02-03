-- =====================================================
-- 학생 인적사항 확장을 위한 컬럼 추가
-- users 테이블에 학교, 전화번호, 학년, 목표 대학 컬럼을 추가합니다.
-- =====================================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS target_university TEXT;

-- 기존 데이터에 대한 인덱스 추가 (필요 시 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school);
CREATE INDEX IF NOT EXISTS idx_users_grade ON users(grade);
