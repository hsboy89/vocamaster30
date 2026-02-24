-- 고재선 학생의 진행 상태 확인
SELECT
    sp.level,
    sp.day,
    sp.status,
    array_length(sp.memorized_words, 1) as memorized_count,
    sp.last_studied_at
FROM student_progress sp
JOIN users u ON u.id = sp.user_id
WHERE u.student_name = '고재선'
ORDER BY sp.level, sp.day;

-- 고재선 학생의 user_id 확인
SELECT id, student_name, academy_name, start_level
FROM users
WHERE student_name = '고재선';
