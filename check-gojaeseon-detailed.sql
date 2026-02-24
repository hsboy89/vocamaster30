-- 고재선 학생의 모든 진행 상태 상세 확인
SELECT
    u.id as user_id,
    u.student_name,
    u.academy_name,
    sp.level,
    sp.day,
    sp.status,
    array_length(sp.memorized_words, 1) as memorized_count,
    sp.last_studied_at
FROM users u
JOIN student_progress sp ON sp.user_id = u.id
WHERE u.student_name = '고재선'
ORDER BY sp.last_studied_at DESC;

-- 고재선 학생의 퀴즈 기록 확인
SELECT
    u.student_name,
    qh.level,
    qh.day,
    qh.quiz_type,
    qh.correct_answers,
    qh.total_questions,
    qh.completed_at
FROM users u
JOIN quiz_history qh ON qh.user_id = u.id
WHERE u.student_name = '고재선'
ORDER BY qh.completed_at DESC
LIMIT 20;

-- user_id가 여러 개 있는지 확인 (중복 계정)
SELECT id, student_name, academy_name, created_at
FROM users
WHERE student_name = '고재선';
