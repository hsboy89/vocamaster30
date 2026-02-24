-- 고재선 학생의 최근 퀴즈 기록 확인
SELECT
    qh.id,
    qh.user_id,
    u.student_name,
    u.academy_id,
    qh.academy_id as quiz_academy_id,
    qh.quiz_type,
    qh.level,
    qh.day,
    qh.correct_answers,
    qh.total_questions,
    ROUND((qh.correct_answers::decimal / qh.total_questions) * 100, 2) as score,
    qh.completed_at,
    qh.created_at
FROM quiz_history qh
JOIN users u ON qh.user_id = u.id
WHERE u.student_name = '고재선'
ORDER BY qh.completed_at DESC
LIMIT 10;

-- 이번 달 모든 퀴즈 데이터 확인
SELECT
    qh.id,
    u.student_name,
    u.academy_id,
    qh.academy_id as quiz_academy_id,
    qh.correct_answers,
    qh.total_questions,
    ROUND((qh.correct_answers::decimal / qh.total_questions) * 100, 2) as score,
    qh.completed_at
FROM quiz_history qh
JOIN users u ON qh.user_id = u.id
WHERE qh.completed_at >= DATE_TRUNC('month', CURRENT_DATE)
ORDER BY qh.completed_at DESC;

-- 이번 달 학생별 평균 점수 (관리자 대시보드 로직 재현)
SELECT
    u.student_name,
    u.academy_id,
    COUNT(*) as quiz_count,
    AVG(ROUND((qh.correct_answers::decimal / qh.total_questions) * 100, 2)) as avg_score,
    CASE
        WHEN AVG(ROUND((qh.correct_answers::decimal / qh.total_questions) * 100, 2)) >= 90 THEN '우수'
        WHEN AVG(ROUND((qh.correct_answers::decimal / qh.total_questions) * 100, 2)) >= 70 THEN '보통'
        ELSE '미달'
    END as grade
FROM quiz_history qh
JOIN users u ON qh.user_id = u.id
WHERE qh.completed_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND qh.total_questions > 0
GROUP BY u.id, u.student_name, u.academy_id
ORDER BY avg_score DESC;
