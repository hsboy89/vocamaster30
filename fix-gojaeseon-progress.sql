-- 고재선 학생의 Day 1, Day 2 학습 기록을 강제로 '완료' 처리하는 스크립트
-- 랭킹 집계 시 누락된 'Last Studied At' 정보를 갱신하여 이번 달 랭킹에 포함되도록 합니다.

DO $$
DECLARE
    target_user_id uuid;
    target_academy_id uuid;
BEGIN
    -- 1. 이름으로 사용자 찾기
    SELECT id, academy_id INTO target_user_id, target_academy_id
    FROM users
    WHERE student_name = '고재선'
    LIMIT 1;

    -- 2. 사용자가 존재하면 업데이트 수행
    IF target_user_id IS NOT NULL THEN
        
        -- Day 1: 이미 존재하면 status와 날짜만 업데이트, 없으면 신규 삽입
        INSERT INTO student_progress (user_id, academy_id, level, day, status, last_studied_at, memorized_words)
        VALUES (target_user_id, target_academy_id, 'middle_1', 1, 'completed', NOW(), '{}')
        ON CONFLICT (user_id, level, day) 
        DO UPDATE SET 
            status = 'completed', 
            last_studied_at = NOW(); -- 현재 시간으로 갱신하여 이달의 랭킹에 포함됨

        -- Day 2: 동일하게 처리
        INSERT INTO student_progress (user_id, academy_id, level, day, status, last_studied_at, memorized_words)
        VALUES (target_user_id, target_academy_id, 'middle_1', 2, 'completed', NOW(), '{}')
        ON CONFLICT (user_id, level, day) 
        DO UPDATE SET 
            status = 'completed', 
            last_studied_at = NOW();

    END IF;
END $$;
