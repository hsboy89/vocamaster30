-- VocaMaster30 Supabase Database Schema
-- 학생/관리자용 어휘 학습 관리 시스템

-- =====================================================
-- 1. USERS 테이블 - 사용자 정보 (학생/관리자)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    academy_name TEXT NOT NULL,          -- 학원명 (예: "서울학원")
    student_name TEXT NOT NULL,          -- 학생 이름 (예: "김철수")
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    admin_id TEXT UNIQUE,                 -- 관리자용 ID (학생은 NULL)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- 학원명 + 학생이름 조합은 고유해야 함
    UNIQUE(academy_name, student_name)
);

-- =====================================================
-- 2. STUDENT_PROGRESS 테이블 - 학습 진도
-- =====================================================
CREATE TABLE IF NOT EXISTS student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    memorized_words TEXT[] DEFAULT '{}',  -- 외운 단어 ID 배열
    last_studied_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 같은 사용자, 같은 레벨, 같은 Day는 하나만 존재
    UNIQUE(user_id, level, day)
);

-- =====================================================
-- 3. QUIZ_HISTORY 테이블 - 퀴즈 결과
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    quiz_type TEXT NOT NULL CHECK (quiz_type IN ('choice', 'matching', 'spelling')),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_word_ids TEXT[] DEFAULT '{}',   -- 틀린 단어 ID 배열
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. WRONG_ANSWERS 테이블 - 오답노트
-- =====================================================
CREATE TABLE IF NOT EXISTS wrong_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,                -- 단어 ID
    word_data JSONB NOT NULL,             -- 단어 전체 데이터 (word, meaning 등)
    level TEXT NOT NULL CHECK (level IN ('middle', 'high', 'advanced')),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    wrong_count INTEGER DEFAULT 1,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 같은 사용자, 같은 단어는 하나만 존재
    UNIQUE(user_id, word_id)
);

-- =====================================================
-- 5. 인덱스 추가 (성능 최적화)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_academy ON users(academy_name);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_progress_user ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON student_progress(level);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_user ON wrong_answers(user_id);

-- =====================================================
-- 6. 관리자 계정 생성 (초기 설정용)
-- =====================================================
-- 관리자 계정을 수동으로 생성하거나 아래 쿼리 사용
-- INSERT INTO users (academy_name, student_name, role, email)
-- VALUES ('관리자', '선생님', 'admin', 'admin@vocamaster.com');

-- =====================================================
-- 7. Row Level Security (RLS) 정책
-- =====================================================

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrong_answers ENABLE ROW LEVEL SECURITY;

-- users 테이블: 모든 사용자가 자신의 데이터만 조회/수정 가능
-- 관리자는 모든 데이터 조회 가능
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);

-- student_progress 테이블: 모든 사용자가 접근 가능 (간단한 권한)
CREATE POLICY "Allow all access to progress" ON student_progress
    FOR ALL USING (true);

-- quiz_history 테이블: 모든 사용자가 접근 가능
CREATE POLICY "Allow all access to quiz" ON quiz_history
    FOR ALL USING (true);

-- wrong_answers 테이블: 모든 사용자가 접근 가능
CREATE POLICY "Allow all access to wrong_answers" ON wrong_answers
    FOR ALL USING (true);
