-- Check User ID for "고재선"
select id, student_name, academy_id from users where student_name = '고재선';

-- Check Quiz History for this user (recent 5)
select * from quiz_history 
where user_id in (select id from users where student_name = '고재선')
order by completed_at desc limit 5;

-- Check Student Progress for this user (recent 5)
select * from student_progress 
where user_id in (select id from users where student_name = '고재선')
order by last_studied_at desc limit 5;
