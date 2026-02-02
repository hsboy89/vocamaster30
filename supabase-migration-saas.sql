-- =====================================================
-- VocaMaster30 Multi-Tenant SaaS Migration Script
-- 기존 단일 학원 구조 → 다중 학원 플랫폼 구조로 전환
-- =====================================================
-- ⚠️ 주의: 이 스크립트는 기존 데이터를 보존하면서 구조를 확장합니다.
-- Supabase SQL Editor에서 순서대로 실행하세요.

-- =====================================================
-- STEP 1: academies 테이블 신설
-- 각 학원(고객사)을 관리하는 최상위 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS academies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 학원 식별 코드 (로그인 시 입력, URL 경로에도 사용 가능)
    academy_code TEXT NOT NULL UNIQUE,
    
    -- 학원 정식 명칭
    name TEXT NOT NULL,
    
    -- 학원별 UI/기능 설정 (JSON)
    -- dashboard_type: 'default' | 'advanced' | 'simple'
    -- theme: { primary: '#색상코드', logo_url: '...' }
    -- features: ['ranking', 'assignment', 'tts_auto', 'wrong_note'] 등
    -- enabled_levels: ['middle', 'high', 'advanced'] 사용할 레벨
    settings JSONB DEFAULT '{
        "dashboard_type": "default",
        "theme": {
            "primary": "#3b82f6",
            "logo_url": null
        },
        "features": ["basic_stats", "wrong_note"],
        "enabled_levels": ["middle", "high", "advanced"]
    }'::jsonb,
    
    -- 학원 상태 (active: 정상, suspended: 정지, trial: 체험)
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    
    -- 체험 기간 종료일 (trial인 경우)
    trial_ends_at TIMESTAMPTZ,
    
    -- 메모 (슈퍼관리자용)
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학원 코드로 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_academies_code ON academies(academy_code);
CREATE INDEX IF NOT EXISTS idx_academies_status ON academies(status);

-- =====================================================
-- STEP 2: users 테이블 확장
-- academy_id 외래키 추가, role 확장
-- =====================================================

-- 2-1. academy_id 컬럼 추가 (NULL 허용 - 기존 데이터 호환)
ALTER TABLE users ADD COLUMN IF NOT EXISTS academy_id UUID REFERENCES academies(id) ON DELETE SET NULL;

-- 2-2. role 체크 제약조건 업데이트 (super_admin, academy_admin 추가)
-- 기존 제약조건 삭제 후 재생성
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('student', 'admin', 'academy_admin', 'super_admin'));

-- 2-3. academy_id 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_academy_id ON users(academy_id);

-- =====================================================
-- STEP 3: 학습 데이터 테이블에 academy_id 추가
-- 조회 성능 최적화 및 RLS 적용을 위해
-- =====================================================

-- student_progress에 academy_id 추가
ALTER TABLE student_progress ADD COLUMN IF NOT EXISTS academy_id UUID REFERENCES academies(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_progress_academy ON student_progress(academy_id);

-- quiz_history에 academy_id 추가
ALTER TABLE quiz_history ADD COLUMN IF NOT EXISTS academy_id UUID REFERENCES academies(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quiz_academy ON quiz_history(academy_id);

-- wrong_answers에 academy_id 추가
ALTER TABLE wrong_answers ADD COLUMN IF NOT EXISTS academy_id UUID REFERENCES academies(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_wrong_academy ON wrong_answers(academy_id);

-- =====================================================
-- STEP 4: 기존 데이터 마이그레이션
-- 현재 academy_name 기반 데이터를 academies 테이블로 이전
-- =====================================================

-- 4-1. 기존에 있는 academy_name들을 academies 테이블로 이전
-- (관리자 계정 제외)
INSERT INTO academies (academy_code, name, status)
SELECT DISTINCT 
    LOWER(REPLACE(academy_name, ' ', '_')) AS academy_code,
    academy_name AS name,
    'active' AS status
FROM users 
WHERE role = 'student' 
  AND academy_name IS NOT NULL
  AND academy_name != '관리자'
ON CONFLICT (academy_code) DO NOTHING;

-- 4-2. users 테이블의 academy_id 업데이트
UPDATE users u
SET academy_id = a.id
FROM academies a
WHERE LOWER(REPLACE(u.academy_name, ' ', '_')) = a.academy_code
  AND u.role = 'student';

-- 4-3. 학습 데이터의 academy_id 업데이트
UPDATE student_progress sp
SET academy_id = u.academy_id
FROM users u
WHERE sp.user_id = u.id AND sp.academy_id IS NULL;

UPDATE quiz_history qh
SET academy_id = u.academy_id
FROM users u
WHERE qh.user_id = u.id AND qh.academy_id IS NULL;

UPDATE wrong_answers wa
SET academy_id = u.academy_id
FROM users u
WHERE wa.user_id = u.id AND wa.academy_id IS NULL;

-- 4-4. 슈퍼 관리자 역할 부여 (기존 admin을 super_admin으로)
UPDATE users SET role = 'super_admin' WHERE role = 'admin';

-- =====================================================
-- STEP 5: RLS 정책 업데이트
-- 학원별 데이터 격리 적용
-- =====================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow all access to progress" ON student_progress;
DROP POLICY IF EXISTS "Allow all access to quiz" ON quiz_history;
DROP POLICY IF EXISTS "Allow all access to wrong_answers" ON wrong_answers;

-- academies 테이블 RLS
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;

-- 슈퍼관리자는 모든 학원 조회 가능
CREATE POLICY "Super admin can view all academies" ON academies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
        OR true  -- 임시: 인증 없이도 조회 가능 (개발용)
    );

CREATE POLICY "Super admin can manage academies" ON academies
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
        OR true  -- 임시: 개발용
    );

-- users 테이블 RLS (학원별 격리)
CREATE POLICY "Users view policy" ON users
    FOR SELECT USING (true);  -- 개발 단계에서는 열어둠

CREATE POLICY "Users insert policy" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users update policy" ON users
    FOR UPDATE USING (true);

-- student_progress RLS
CREATE POLICY "Progress access policy" ON student_progress
    FOR ALL USING (true);  -- 개발 단계

-- quiz_history RLS
CREATE POLICY "Quiz access policy" ON quiz_history
    FOR ALL USING (true);  -- 개발 단계

-- wrong_answers RLS
CREATE POLICY "Wrong answers access policy" ON wrong_answers
    FOR ALL USING (true);  -- 개발 단계

-- =====================================================
-- STEP 6: 유틸리티 함수 (Optional)
-- =====================================================

-- 학원 설정 조회 함수
CREATE OR REPLACE FUNCTION get_academy_settings(p_academy_code TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN (SELECT settings FROM academies WHERE academy_code = p_academy_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- academy_id로 학원 코드 조회
CREATE OR REPLACE FUNCTION get_academy_code(p_academy_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT academy_code FROM academies WHERE id = p_academy_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 완료! 
-- 이제 프론트엔드에서 로그인 시 academy_code를 받아
-- 해당 학원의 settings를 불러와 UI를 동적으로 렌더링하면 됩니다.
-- =====================================================
