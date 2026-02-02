-- =====================================================
-- VocaMaster30 Supabase Database Schema (SaaS Multi-Tenant)
-- 다중 학원 관리 플랫폼 - 학생/학원관리자/슈퍼관리자용
-- =====================================================

-- =====================================================
-- 0. ACADEMIES 테이블 - 학원(고객사) 정보 [신규]
-- 각 학원마다 고유한 코드와 설정을 가짐
-- =====================================================
CREATE TABLE IF NOT EXISTS academies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 학원 코드 (로그인 시 입력, 예: "seoul01", "busan_voca")
    academy_code TEXT NOT NULL UNIQUE,
    
    -- 학원 정식 명칭
    name TEXT NOT NULL,
    
    -- 학원별 UI/기능 설정 (JSON)
    -- dashboard_type: 어떤 대시보드 컴포넌트 사용할지
    -- theme: 브랜드 색상, 로고
    -- features: 활성화된 기능 목록
    -- enabled_levels: 사용할 학습 레벨
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
    
    -- 체험 종료일 (trial 상태인 경우)
    trial_ends_at TIMESTAMPTZ,
    
    -- 관리자 메모
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 1. USERS 테이블 - 사용자 정보 (학생/학원관리자/슈퍼관리자)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 소속 학원 (외래키)
    academy_id UUID REFERENCES academies(id) ON DELETE SET NULL,
    
    -- [호환용] 학원명 텍스트 (향후 제거 예정)
    academy_name TEXT,
    
    -- 사용자 이름
    student_name TEXT NOT NULL,
    
    -- 역할: student(학생), academy_admin(원장), super_admin(플랫폼관리자)
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'academy_admin', 'super_admin')),
    
    -- 로그인 ID (관리자용, 학생은 학원코드+이름으로 로그인)
    admin_id TEXT UNIQUE,
    
    -- 이메일 (알림용, 선택)
    email TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- 같은 학원 내에서 학생 이름은 고유
    UNIQUE(academy_id, student_name)
);

-- =====================================================
-- 2. STUDENT_PROGRESS 테이블 - 학습 진도
-- =====================================================
CREATE TABLE IF NOT EXISTS student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    academy_id UUID REFERENCES academies(id) ON DELETE SET NULL,  -- 빠른 학원별 조회용
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    memorized_words TEXT[] DEFAULT '{}',
    last_studied_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, level, day)
);

-- =====================================================
-- 3. QUIZ_HISTORY 테이블 - 퀴즈 결과
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    academy_id UUID REFERENCES academies(id) ON DELETE SET NULL,
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    quiz_type TEXT NOT NULL CHECK (quiz_type IN ('choice', 'matching', 'spelling')),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_word_ids TEXT[] DEFAULT '{}',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. WRONG_ANSWERS 테이블 - 오답노트
-- =====================================================
CREATE TABLE IF NOT EXISTS wrong_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    academy_id UUID REFERENCES academies(id) ON DELETE SET NULL,
    word_id TEXT NOT NULL,
    word_data JSONB NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    wrong_count INTEGER DEFAULT 1,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, word_id)
);

-- =====================================================
-- 5. 인덱스 추가 (성능 최적화)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_academies_code ON academies(academy_code);
CREATE INDEX IF NOT EXISTS idx_academies_status ON academies(status);

CREATE INDEX IF NOT EXISTS idx_users_academy_id ON users(academy_id);
CREATE INDEX IF NOT EXISTS idx_users_academy ON users(academy_name);  -- 호환용
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_progress_user ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_academy ON student_progress(academy_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON student_progress(level);

CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_academy ON quiz_history(academy_id);

CREATE INDEX IF NOT EXISTS idx_wrong_user ON wrong_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_academy ON wrong_answers(academy_id);

-- =====================================================
-- 6. Row Level Security (RLS) 정책
-- =====================================================

-- RLS 활성화
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrong_answers ENABLE ROW LEVEL SECURITY;

-- academies: 슈퍼관리자 전체 접근, 학원관리자 자기 학원만
CREATE POLICY "Academy access policy" ON academies
    FOR ALL USING (true);  -- 개발 단계: 전체 허용

-- users: 개발 단계 전체 허용
CREATE POLICY "Users access policy" ON users
    FOR ALL USING (true);

-- student_progress: 개발 단계 전체 허용
CREATE POLICY "Progress access policy" ON student_progress
    FOR ALL USING (true);

-- quiz_history: 개발 단계 전체 허용
CREATE POLICY "Quiz access policy" ON quiz_history
    FOR ALL USING (true);

-- wrong_answers: 개발 단계 전체 허용
CREATE POLICY "Wrong answers access policy" ON wrong_answers
    FOR ALL USING (true);

-- =====================================================
-- 7. 유틸리티 함수
-- =====================================================

-- 학원 설정 조회 함수
CREATE OR REPLACE FUNCTION get_academy_settings(p_academy_code TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN (SELECT settings FROM academies WHERE academy_code = p_academy_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. 초기 데이터 (슈퍼관리자 계정)
-- =====================================================
-- INSERT INTO users (student_name, role, admin_id)
-- VALUES ('슈퍼관리자', 'super_admin', 'admin');
