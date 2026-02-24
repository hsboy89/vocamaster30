import { supabase } from '../lib';
import { DbUser, dbUserToUser, User, Level, LEVEL_INFO } from '../types';

// 전체 통계 타입
export interface DashboardStats {
    totalStudents: number;
    todayAttendance: {
        active: number;
        total: number;
    };
    totalMastery: number;
    atRiskCount: number;
    quizDistribution: {
        quizStudents: number;   // 이번 달 퀴즈 응시 학생 수
        totalStudents: number;  // 전체 학생 수
        excellentCount: number; // 90점 이상 학생 수
        averageCount: number;   // 70~89점 학생 수
        belowCount: number;     // 70점 미만 학생 수
        excellentPct: number;   // 90점 이상 비율 (%)
        averagePct: number;     // 70~89점 비율 (%)
        belowPct: number;       // 70점 미만 비율 (%)
    };
}

export interface WrongWordStat {
    word: string;
    meaning: string;
    wrongCount: number;
}

// 학생 목록 아이템 타입
export interface StudentListItem {
    id: string;
    academyName: string;
    studentName: string;
    currentDay: number;      // 가장 최근에 학습한 Day
    completedDays: number;   // 완료한 Day 수
    lastLoginAt: string | null;
    averageScore: number;
    goalDuration?: number;   // 목표 기간 (일)
    totalDays?: number;      // 총 학습 일수 (목표 기간 or 30)
}

// Day별 진행률 타입
export interface DayProgress {
    day: number;
    completedCount: number;
    totalStudents: number;
    percentage: number;
}

// 일별 활성 학생 수 타입
export interface DailyActiveUsers {
    date: string;           // YYYY-MM-DD
    activeUsers: number;    // 해당 날짜에 학습한 고유 학생 수
}

// 학생 활동 히트맵 타입
export interface StudentActivityHeatmap {
    userId: string;
    studentName: string;
    activities: {
        date: string;       // YYYY-MM-DD
        count: number;      // 해당 날짜의 학습 활동 수 (완료한 Day 수)
    }[];
}

// 오늘의 학습 현황 상세 타입
export interface TodayStudyDetails {
    activeStudents: number;     // 오늘 학습한 학생 수
    completedDays: number;      // 오늘 완료된 Day 수
    memorizedWords: number;     // 오늘 암기된 단어 수
}

// 학생 상세 정보 타입
export interface StudentDetail {
    user: User;
    progressByLevel: {
        level: string;
        completedDays: number;
        totalDays: number;
    }[];
    recentQuizzes: {
        day: number;
        level: string;
        quizType: string;
        score: number;
        completedAt: string;
    }[];
    topWrongWords: {
        word: string;
        meaning: string;
        wrongCount: number;
    }[];
}

// 전체 통계 조회
export async function getDashboardStats(academyId?: string): Promise<DashboardStats> {
    try {
        // 1. 전체 학생 수
        let query = supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }

        const { count: totalStudents } = await query;

        const totalCount = totalStudents || 0;

        // 2. 오늘의 학습 성실도 (오늘 공부한 고유 학생 수)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 학습 기록 테이블도 academy_id로 필터링 (조인 필요 없음, 컬럼 추가됨)
        let progressQuery = supabase
            .from('student_progress')
            .select('user_id')
            .gte('last_studied_at', today.toISOString());

        if (academyId) {
            progressQuery = progressQuery.eq('academy_id', academyId);
        }

        const { data: todayActivity } = await progressQuery;

        // 고유 학생 수 계산
        const activeTodaySet = new Set(todayActivity?.map(a => a.user_id));
        const activeTodayCount = activeTodaySet.size;

        // 3. 누적 암기 단어 합계
        let masteryQuery = supabase
            .from('student_progress')
            .select('memorized_words');

        if (academyId) {
            masteryQuery = masteryQuery.eq('academy_id', academyId);
        }

        const { data: progressData } = await masteryQuery;

        const totalMastery = progressData?.reduce((sum, p) =>
            sum + (p.memorized_words?.length || 0), 0) || 0;

        // 4. 중단 위험 학생 수 (3일 이상 미접속)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        let riskQuery = supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .lt('last_login_at', threeDaysAgo.toISOString());

        if (academyId) {
            riskQuery = riskQuery.eq('academy_id', academyId);
        }

        const { count: atRiskCount } = await riskQuery;

        // 5. 이번 달 퀴즈 — 학생별 평균 점수 기준 3단계 분포
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        let quizQuery = supabase
            .from('quiz_history')
            .select('user_id, correct_answers, total_questions')
            .gte('completed_at', monthStart.toISOString());

        if (academyId) {
            quizQuery = quizQuery.eq('academy_id', academyId);
        }

        const { data: quizData } = await quizQuery;

        console.log('[DEBUG] 이번 달 퀴즈 데이터:', {
            monthStart: monthStart.toISOString(),
            quizCount: quizData?.length || 0,
            academyId
        });

        // 학생별 점수 합산
        const studentScores = new Map<string, { total: number; count: number }>();
        quizData?.forEach(q => {
            // 0점 퀴즈 제외 (학습 중도 이탈 세션)
            // 실제로 0점을 맞는 경우보다 퀴즈를 시작하고 포기한 경우가 훨씬 많음
            if (q.total_questions > 0 && q.correct_answers > 0) {
                let correctCount = q.correct_answers;
                // 레거시 데이터 보정
                if (correctCount > q.total_questions) {
                    correctCount = Math.round(correctCount / 5);
                }
                correctCount = Math.min(correctCount, q.total_questions);
                const score = (correctCount / q.total_questions) * 100;

                const existing = studentScores.get(q.user_id) || { total: 0, count: 0 };
                studentScores.set(q.user_id, {
                    total: existing.total + score,
                    count: existing.count + 1,
                });

                console.log('[DEBUG] 퀴즈 점수 계산:', {
                    user_id: q.user_id,
                    correctCount,
                    total: q.total_questions,
                    score,
                    avg: (existing.total + score) / (existing.count + 1)
                });
            }
        });

        // 학생별 평균으로 3단계 분류
        let excellentCount = 0;
        let averageCount = 0;
        let belowCount = 0;
        const quizStudents = studentScores.size;

        studentScores.forEach(({ total, count }, userId) => {
            const avg = total / count;
            const grade = avg >= 90 ? '우수' : avg >= 70 ? '보통' : '미달';
            console.log('[DEBUG] 학생 평균 점수:', { userId, avg, grade });

            if (avg >= 90) excellentCount++;
            else if (avg >= 70) averageCount++;
            else belowCount++;
        });

        console.log('[DEBUG] 퀴즈 분포:', {
            quizStudents: studentScores.size,
            excellentCount,
            averageCount,
            belowCount
        });

        const quizDistribution = {
            quizStudents,
            totalStudents: totalCount,
            excellentCount,
            averageCount,
            belowCount,
            excellentPct: quizStudents > 0 ? Math.round((excellentCount / quizStudents) * 100) : 0,
            averagePct: quizStudents > 0 ? Math.round((averageCount / quizStudents) * 100) : 0,
            belowPct: quizStudents > 0 ? Math.round((belowCount / quizStudents) * 100) : 0,
        };

        return {
            totalStudents: totalCount,
            todayAttendance: {
                active: activeTodayCount,
                total: totalCount
            },
            totalMastery,
            atRiskCount: atRiskCount || 0,
            quizDistribution,
        };
    } catch (error) {
        console.error('Failed to get dashboard stats:', error);
        return {
            totalStudents: 0,
            todayAttendance: { active: 0, total: 0 },
            totalMastery: 0,
            atRiskCount: 0,
            quizDistribution: { quizStudents: 0, totalStudents: 0, excellentCount: 0, averageCount: 0, belowCount: 0, excellentPct: 0, averagePct: 0, belowPct: 0 },
        };
    }
}

// 중단 위험 학생 목록 조회
export async function getAtRiskStudents(academyId?: string): Promise<StudentListItem[]> {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        let query = supabase
            .from('users')
            .select('*')
            .eq('role', 'student')
            .lt('last_login_at', threeDaysAgo.toISOString())
            .order('last_login_at', { ascending: true });

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }

        const { data: users, error } = await query;

        if (error || !users) return [];

        return Promise.all(
            users.map(async (user) => {
                const { data: progress } = await supabase
                    .from('student_progress')
                    .select('day, status')
                    .eq('user_id', user.id);

                const completedDays = progress?.filter(p => p.status === 'completed').length || 0;
                const currentDay = progress?.reduce((max, p) => Math.max(max, p.day), 0) || 0;

                return {
                    id: user.id,
                    academyName: user.academy_name || 'Unknown',
                    studentName: user.student_name,
                    currentDay,
                    completedDays,
                    lastLoginAt: user.last_login_at || null,
                    averageScore: 0, // 상세 페이지에서 확인
                };
            })
        );
    } catch (error) {
        console.error('Failed to get at-risk students:', error);
        return [];
    }
}

// 학원 전체 오답 Top 10 조회
export async function getGlobalTopWrongWords(academyId?: string): Promise<WrongWordStat[]> {
    try {
        let query = supabase
            .from('wrong_answers')
            .select('word_data, wrong_count')
            .order('wrong_count', { ascending: false });

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }

        const { data: wrongAnswers, error } = await query.limit(50); // 충분한 데이터를 가져와서 합산

        if (error || !wrongAnswers) return [];

        // 동일한 단어들 합산 (여러 학생이 틀린 경우)
        const wordMap = new Map<string, { meaning: string, count: number }>();

        wrongAnswers.forEach(w => {
            if (!w.word_data) return;
            const word = w.word_data.word;
            const meaning = w.word_data.meaning;
            const existing = wordMap.get(word);

            if (existing) {
                wordMap.set(word, { meaning, count: existing.count + w.wrong_count });
            } else {
                wordMap.set(word, { meaning, count: w.wrong_count });
            }
        });

        return Array.from(wordMap.entries())
            .map(([word, data]) => ({
                word,
                meaning: data.meaning,
                wrongCount: data.count
            }))
            .sort((a, b) => b.wrongCount - a.wrongCount)
            .slice(0, 10);
    } catch (error) {
        console.error('Failed to get global top wrong words:', error);
        return [];
    }
}

// 학생 목록 조회
export async function getStudentList(academyId?: string): Promise<StudentListItem[]> {
    try {
        // 모든 학생 조회
        let query = supabase
            .from('users')
            .select('*')
            .eq('role', 'student')
            .order('last_login_at', { ascending: false });

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }

        const { data: users, error } = await query;

        if (error) throw error;
        if (!users) return [];

        // 각 학생의 진도 및 점수 데이터 조회
        const studentList: StudentListItem[] = await Promise.all(
            users.map(async (user: DbUser) => {
                // 진도 데이터
                const { data: progress } = await supabase
                    .from('student_progress')
                    .select('day, status')
                    .eq('user_id', user.id);

                const completedDays = progress?.filter(p => p.status === 'completed').length || 0;
                const currentDay = progress?.reduce((max, p) => Math.max(max, p.day), 0) || 0;

                // 퀴즈 점수
                const { data: quizzes } = await supabase
                    .from('quiz_history')
                    .select('correct_answers, total_questions')
                    .eq('user_id', user.id);

                let avgScore = 0;
                if (quizzes && quizzes.length > 0) {
                    // 0점 퀴즈 제외 (학습 중도 이탈 세션)
                    const validQuizzes = quizzes.filter(q => q.total_questions > 0 && q.correct_answers > 0);

                    if (validQuizzes.length > 0) {
                        const total = validQuizzes.reduce((sum, q) => {
                            let correctCount = q.correct_answers;
                            // 과거 데이터 보정: 정답 수가 전체 문제 수보다 크면 점수(5배수)로 저장된 것으로 간주
                            if (correctCount > q.total_questions) {
                                correctCount = Math.round(correctCount / 5);
                            }
                            let score = (correctCount / q.total_questions) * 100;
                            return sum + score;
                        }, 0);
                        avgScore = Math.round(total / validQuizzes.length);
                    }
                }

                return {
                    id: user.id,
                    academyName: user.academy_name || 'Unknown',
                    studentName: user.student_name,
                    currentDay,
                    completedDays,
                    lastLoginAt: user.last_login_at || null,
                    averageScore: avgScore,
                    goalDuration: user.goal_duration,
                    totalDays: user.goal_duration || 30 // 총 학습 일수 추가
                };
            })
        );

        return studentList;
    } catch (error) {
        console.error('Failed to get student list:', error);
        return [];
    }
}

// 일별 활성 학생 수 조회 (최근 30일)
export async function getDailyActiveUsers(academyId?: string, days: number = 30): Promise<DailyActiveUsers[]> {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        // 해당 기간의 학습 기록 조회
        let query = supabase
            .from('student_progress')
            .select('user_id, last_studied_at')
            .gte('last_studied_at', startDate.toISOString());

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }

        const { data: progressData } = await query;

        // 날짜별로 고유 학생 수 집계
        const dailyMap = new Map<string, Set<string>>();

        // 먼저 모든 날짜를 0으로 초기화
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dailyMap.set(dateStr, new Set());
        }

        // 실제 활동 데이터 채우기
        progressData?.forEach(p => {
            if (p.last_studied_at) {
                const dateStr = p.last_studied_at.split('T')[0];
                if (dailyMap.has(dateStr)) {
                    dailyMap.get(dateStr)!.add(p.user_id);
                }
            }
        });

        // 결과 생성
        const result: DailyActiveUsers[] = [];
        dailyMap.forEach((userSet, date) => {
            result.push({
                date,
                activeUsers: userSet.size
            });
        });

        // 날짜순 정렬
        result.sort((a, b) => a.date.localeCompare(b.date));

        return result;
    } catch (error) {
        console.error('Failed to get daily active users:', error);
        return [];
    }
}

// 오늘의 학습 현황 상세 조회
export async function getTodayStudyDetails(academyId?: string): Promise<TodayStudyDetails> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. 오늘 학습한 고유 학생 수
        let activeQuery = supabase
            .from('student_progress')
            .select('user_id')
            .gte('last_studied_at', today.toISOString());

        if (academyId) {
            activeQuery = activeQuery.eq('academy_id', academyId);
        }

        const { data: activeData } = await activeQuery;
        const activeStudents = new Set(activeData?.map(a => a.user_id)).size;

        // 2. 오늘 완료된 Day 수
        let completedQuery = supabase
            .from('student_progress')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'completed')
            .gte('last_studied_at', today.toISOString());

        if (academyId) {
            completedQuery = completedQuery.eq('academy_id', academyId);
        }

        const { count: completedDays } = await completedQuery;

        // 3. 오늘 암기된 단어 수
        let wordsQuery = supabase
            .from('student_progress')
            .select('memorized_words')
            .gte('last_studied_at', today.toISOString());

        if (academyId) {
            wordsQuery = wordsQuery.eq('academy_id', academyId);
        }

        const { data: wordsData } = await wordsQuery;
        const memorizedWords = wordsData?.reduce((sum, p) =>
            sum + (p.memorized_words?.length || 0), 0) || 0;

        return {
            activeStudents,
            completedDays: completedDays || 0,
            memorizedWords
        };
    } catch (error) {
        console.error('Failed to get today study details:', error);
        return {
            activeStudents: 0,
            completedDays: 0,
            memorizedWords: 0
        };
    }
}

// 학생 활동 히트맵 조회 (최근 30일)
export async function getStudentActivityHeatmap(academyId?: string, days: number = 30): Promise<StudentActivityHeatmap[]> {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        // 1. 학생 목록 조회
        let userQuery = supabase
            .from('users')
            .select('id, student_name')
            .eq('role', 'student')
            .order('student_name');

        if (academyId) {
            userQuery = userQuery.eq('academy_id', academyId);
        }

        const { data: users } = await userQuery;
        if (!users || users.length === 0) return [];

        const userIds = users.map(u => u.id);

        // 2. 해당 기간의 학습 기록 조회
        let progressQuery = supabase
            .from('student_progress')
            .select('user_id, day, status, last_studied_at')
            .gte('last_studied_at', startDate.toISOString())
            .in('user_id', userIds);

        if (academyId) {
            progressQuery = progressQuery.eq('academy_id', academyId);
        }

        const { data: progressData } = await progressQuery;

        // 3. 학생별 날짜별 활동 집계
        const result: StudentActivityHeatmap[] = users.map(user => {
            const userProgress = progressData?.filter(p => p.user_id === user.id) || [];

            // 날짜별로 완료한 Day 수 집계
            const dateMap = new Map<string, number>();
            userProgress.forEach(p => {
                if (p.last_studied_at && p.status === 'completed') {
                    const dateStr = p.last_studied_at.split('T')[0];
                    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
                }
            });

            const activities = Array.from(dateMap.entries()).map(([date, count]) => ({
                date,
                count
            }));

            return {
                userId: user.id,
                studentName: user.student_name,
                activities
            };
        });

        // 활동이 있는 학생만 반환 (최근 30일 내 활동이 있는 경우)
        return result.filter(student => student.activities.length > 0);
    } catch (error) {
        console.error('Failed to get student activity heatmap:', error);
        return [];
    }
}

// Day별 진행률 조회 (전체 학생 대상)
export async function getDayProgressStats(level: string = 'middle_1', academyId?: string): Promise<DayProgress[]> {
    try {
        // 1. 해당 레벨에 진도가 있는 고유 학생 수 조회 (진축도 계산의 분모)
        let activeStudentsQuery = supabase
            .from('student_progress')
            .select('user_id')
            .eq('level', level);

        if (academyId) {
            activeStudentsQuery = activeStudentsQuery.eq('academy_id', academyId);
        }

        const { data: activeStudentsData } = await activeStudentsQuery;
        const activeUserIds = new Set(activeStudentsData?.map(s => s.user_id));
        const effectiveTotalStudents = activeUserIds.size || 1; // 0으로 나누기 방지

        // 2. 전체 학생 목록 대신 LEVEL_INFO의 totalDays 사용
        const maxDays = LEVEL_INFO[level as Level]?.totalDays || 30;

        // 3. 완료된 진도 데이터
        let progressQuery = supabase
            .from('student_progress')
            .select('day, status')
            .eq('level', level)
            .eq('status', 'completed');

        if (academyId) {
            progressQuery = progressQuery.eq('academy_id', academyId);
        }

        const { data: progress } = await progressQuery;

        const dayStats: Record<number, number> = {};
        progress?.forEach(p => {
            dayStats[p.day] = (dayStats[p.day] || 0) + 1;
        });

        const result: DayProgress[] = [];
        for (let day = 1; day <= maxDays; day++) {
            const completedCount = dayStats[day] || 0;
            result.push({
                day,
                completedCount,
                totalStudents: effectiveTotalStudents,
                percentage: Math.min(100, Math.round((completedCount / effectiveTotalStudents) * 100)),
            });
        }

        return result;
    } catch (error) {
        console.error('Failed to get day progress stats:', error);
        return [];
    }
}

// 학생 상세 정보 조회
export async function getStudentDetail(userId: string): Promise<StudentDetail | null> {
    try {
        // 사용자 정보
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !userData) return null;

        const user = dbUserToUser(userData as DbUser);

        // 레벨별 진도
        const { data: progress } = await supabase
            .from('student_progress')
            .select('level, status')
            .eq('user_id', userId);

        const levels = ['middle_1', 'middle_2', 'high_1', 'high_2', 'csat'];
        const progressByLevel = levels.map(level => {
            const levelProgress = progress?.filter(p => p.level === level) || [];
            const completedDays = levelProgress.filter(p => p.status === 'completed').length;
            return {
                level,
                completedDays,
                totalDays: 30,
            };
        });

        // 최근 퀴즈 결과
        const { data: quizzes } = await supabase
            .from('quiz_history')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false })
            .limit(10);

        const recentQuizzes = quizzes?.map(q => ({
            day: q.day,
            level: q.level,
            quizType: q.quiz_type,
            score: q.total_questions > 0
                ? Math.round((
                    (q.correct_answers > q.total_questions ? Math.round(q.correct_answers / 5) : q.correct_answers)
                    / q.total_questions
                ) * 100)
                : 0,
            completedAt: q.completed_at,
        })) || [];

        // 자주 틀리는 단어
        const { data: wrongAnswers } = await supabase
            .from('wrong_answers')
            .select('word_data, wrong_count')
            .eq('user_id', userId)
            .order('wrong_count', { ascending: false })
            .limit(5);

        const topWrongWords = wrongAnswers?.map(w => ({
            word: w.word_data?.word || '',
            meaning: w.word_data?.meaning || '',
            wrongCount: w.wrong_count,
        })) || [];

        return {
            user,
            progressByLevel,
            recentQuizzes,
            topWrongWords,
        };
    } catch (error) {
        console.error('Failed to get student detail:', error);
        return null;
    }
}

// =====================================================
// 학생 관리 (CRUD) 기능
// =====================================================

export interface CreateStudentInput {
    academyId?: string;       // 신규
    academyName?: string;     // [호환용] 슈퍼관리자용 or 기존
    studentName: string;
    school?: string;
    phone?: string;
    grade?: string;
    targetUniversity?: string;
    parentPhone?: string;
    password?: string; // 신규: 초기 비밀번호
}

// 학생 등록
export async function createStudent(input: CreateStudentInput): Promise<{ success: boolean; error?: string; student?: User }> {
    try {
        if (!input.academyId && !input.academyName) {
            return { success: false, error: '학원 정보가 필요합니다.' };
        }

        // academyId가 있지만 academyName이 없으면 조회
        let academyName = input.academyName;
        if (input.academyId && !academyName) {
            const { data: academy } = await supabase
                .from('academies')
                .select('name')
                .eq('id', input.academyId)
                .single();

            if (academy) {
                academyName = academy.name;
            }
        }

        // 중복 체크 쿼리
        let checkQuery = supabase.from('users').select('id');

        if (input.academyId) {
            checkQuery = checkQuery.eq('academy_id', input.academyId);
        } else {
            // academyId가 없을 때만 이름으로 체크 (기존)
            checkQuery = checkQuery.eq('academy_name', academyName!);
        }

        const { data: existing } = await checkQuery.eq('student_name', input.studentName).maybeSingle();

        if (existing) {
            return { success: false, error: '해당 학원에 이미 등록된 학생입니다.' };
        }

        // 새 학생 등록
        const { data: newStudent, error } = await supabase
            .from('users')
            .insert({
                academy_id: input.academyId,
                academy_name: academyName, // 조회된 이름 또는 입력된 이름
                student_name: input.studentName,
                role: 'student',
                school: input.school,
                phone: input.phone,
                grade: input.grade,
                target_university: input.targetUniversity,
                parent_phone: input.parentPhone,
                password_hash: input.password, // 평문 저장 (추후 해시 적용 권장)
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create student:', error);
            return { success: false, error: '학생 등록에 실패했습니다.' };
        }

        return {
            success: true,
            student: dbUserToUser(newStudent as DbUser)
        };
    } catch (error) {
        console.error('Failed to create student:', error);
        return { success: false, error: '학생 등록에 실패했습니다.' };
    }
}

// 학생 삭제
export async function deleteStudent(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)
            .eq('role', 'student'); // 관리자는 삭제 불가

        if (error) {
            console.error('Failed to delete student:', error);
            return { success: false, error: '학생 삭제에 실패했습니다.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to delete student:', error);
        return { success: false, error: '학생 삭제에 실패했습니다.' };
    }
}

// 학생 정보 수정
export async function updateStudent(
    userId: string,
    input: Partial<CreateStudentInput>
): Promise<{ success: boolean; error?: string }> {
    try {
        const updateData: Record<string, string> = {};
        if (input.academyName) updateData.academy_name = input.academyName;
        if (input.studentName) updateData.student_name = input.studentName;
        if (input.academyId) updateData.academy_id = input.academyId;
        if (input.school) updateData.school = input.school;
        if (input.phone) updateData.phone = input.phone;
        if (input.grade) updateData.grade = input.grade;
        if (input.targetUniversity) updateData.target_university = input.targetUniversity;
        if (input.parentPhone) updateData.parent_phone = input.parentPhone;
        if (input.password) updateData.password_hash = input.password;

        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .eq('role', 'student');

        if (error) {
            console.error('Failed to update student:', error);
            return { success: false, error: '학생 정보 수정에 실패했습니다.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to update student:', error);
        return { success: false, error: '학생 정보 수정에 실패했습니다.' };
    }
}

// 학생 존재 여부 확인 (로그인용)
export async function checkStudentExists(
    academyName: string,
    studentName: string
): Promise<{ exists: boolean; user?: User }> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('academy_name', academyName)
            .eq('student_name', studentName)
            .eq('role', 'student')
            .single();

        if (error || !data) {
            return { exists: false };
        }

        return {
            exists: true,
            user: dbUserToUser(data as DbUser)
        };
    } catch (error) {
        return { exists: false };
    }
}

// =====================================================
// 랭킹 시스템 (월별 자동 초기화)
// =====================================================

export interface RankingItem {
    rank: number;
    userId: string;
    studentName: string;
    completedDays: number;   // 이번 달 완료한 Day 수
    averageScore: number;    // 평균 퀴즈 점수
    goalDuration?: number;   // 학습 플랜 기간
}

// 맞춤 플랜별 랭킹 조회 (이번 달)
export async function getRankingByGoalPlan(
    academyId?: string,
    goalDuration?: number,      // null/undefined = 전체
    limit: number = 10
): Promise<RankingItem[]> {
    try {
        // 이번 달 시작일
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartISO = monthStart.toISOString();

        // 1. 학생 목록 조회
        let userQuery = supabase
            .from('users')
            .select('id, student_name, goal_duration')
            .eq('role', 'student');

        if (academyId) {
            userQuery = userQuery.eq('academy_id', academyId);
        }
        if (goalDuration) {
            userQuery = userQuery.eq('goal_duration', goalDuration);
        }

        const { data: users, error: userError } = await userQuery;
        if (userError || !users || users.length === 0) return [];

        const userIds = users.map(u => u.id);

        // 2. 퀴즈 이력 조회 (평균 점수용)
        const { data: quizzes } = await supabase
            .from('quiz_history')
            .select('user_id, correct_answers, total_questions')
            .gte('completed_at', monthStartISO)
            .in('user_id', userIds);

        const scoreMap = new Map<string, { total: number; count: number }>();
        quizzes?.forEach(q => {
            // total_questions가 0이거나, abandoned 세션(correct_answers=0)은 제외하여 데이터 오염 방지
            // (학생이 실력이 없어서 0점 맞을 확률보다 학습 중도 이탈로 0점이 나올 확률이 압도적으로 높은 구조적 문제 해결)
            if (q.total_questions > 0 && q.correct_answers > 0) {
                let correctCount = q.correct_answers;

                // 레거시 데이터 호환: 이전에 score(=correctCount*5)가 correct_answers로 저장된 경우
                if (correctCount > q.total_questions) {
                    correctCount = Math.round(correctCount / 5);
                }
                // 최대값 제한 (정답 수가 총 문제 수를 초과 불가)
                correctCount = Math.min(correctCount, q.total_questions);

                const score = (correctCount / q.total_questions) * 100;

                const existing = scoreMap.get(q.user_id) || { total: 0, count: 0 };
                scoreMap.set(q.user_id, {
                    total: existing.total + score,
                    count: existing.count + 1,
                });
            }
        });

        // 3. 학습 진도 조회 (완료 Day 집계용)
        const { data: progress } = await supabase
            .from('student_progress')
            .select('user_id, day')
            .eq('status', 'completed')
            .gte('last_studied_at', monthStartISO)
            .in('user_id', userIds);

        const completedMap = new Map<string, Set<number>>();
        progress?.forEach(p => {
            const userDays = completedMap.get(p.user_id) || new Set();
            userDays.add(p.day);
            completedMap.set(p.user_id, userDays);
        });

        // 4. 랭킹 데이터 생성 (학습 활동이 있는 학생만 포함)
        const rankings: RankingItem[] = users
            .filter(user => completedMap.has(user.id) || scoreMap.has(user.id))
            .map(user => {
                const completedDays = completedMap.get(user.id)?.size || 0;
                const scoreData = scoreMap.get(user.id);
                const averageScore = scoreData ? Math.round(scoreData.total / scoreData.count) : 0;

                return {
                    rank: 0,
                    userId: user.id,
                    studentName: user.student_name,
                    completedDays,
                    averageScore,
                    goalDuration: user.goal_duration,
                };
            });

        // 4. 정렬: 완료 Day 내림차순 → 평균점수 내림차순 → 이름 오름차순
        rankings.sort((a, b) => {
            if (b.completedDays !== a.completedDays) return b.completedDays - a.completedDays;
            if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
            return a.studentName.localeCompare(b.studentName);
        });

        // 6. 순위 부여 및 제한
        return rankings.slice(0, limit).map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    } catch (error) {
        console.error('Failed to get ranking:', error);
        return [];
    }
}

// =====================================================
// 레벨별 랭킹 시스템 (탭 완료 기반)
// =====================================================

export interface RankingByLevelItem {
    rank: number;
    userId: string;
    studentName: string;
    level: string;
    averageScore: number;       // 레벨 전체 퀴즈 평균 점수
    attemptNumber: number;
    completedAt: string;
}

/**
 * 레벨(탭)별 랭킹 조회 — level_completions 테이블 기반
 * - 해당 레벨을 완료한 학생만 포함
 * - is_ranking_eligible = true인 학생만
 * - 평균 점수 내림차순 정렬
 */
export async function getRankingByLevel(
    academyId?: string,
    level?: string,             // 'middle_1', 'middle_2', etc.
    limit: number = 10
): Promise<RankingByLevelItem[]> {
    try {
        // 1. level_completions에서 랭킹 자격자 조회
        let query = supabase
            .from('level_completions')
            .select('user_id, level, average_score, attempt_number, completed_at, is_ranking_eligible')
            .eq('is_ranking_eligible', true);

        if (academyId) {
            query = query.eq('academy_id', academyId);
        }
        if (level) {
            query = query.eq('level', level);
        }

        query = query.order('average_score', { ascending: false });

        const { data: completions, error: compError } = await query;
        if (compError || !completions || completions.length === 0) return [];

        // 2. 같은 유저의 여러 attempt 중 가장 높은 점수만 사용
        const bestByUser = new Map<string, typeof completions[0]>();
        completions.forEach(c => {
            const existing = bestByUser.get(c.user_id);
            if (!existing || c.average_score > existing.average_score) {
                bestByUser.set(c.user_id, c);
            }
        });

        const uniqueCompletions = Array.from(bestByUser.values());

        // 3. 학생 이름 조회
        const userIds = uniqueCompletions.map(c => c.user_id);
        const { data: users } = await supabase
            .from('users')
            .select('id, student_name')
            .in('id', userIds);

        const nameMap = new Map<string, string>();
        users?.forEach(u => nameMap.set(u.id, u.student_name));

        // 4. 랭킹 데이터 생성 및 정렬
        const rankings: RankingByLevelItem[] = uniqueCompletions
            .map(c => ({
                rank: 0,
                userId: c.user_id,
                studentName: nameMap.get(c.user_id) || '(알 수 없음)',
                level: c.level,
                averageScore: parseFloat(c.average_score),
                attemptNumber: c.attempt_number,
                completedAt: c.completed_at,
            }))
            .sort((a, b) => {
                if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
                return a.studentName.localeCompare(b.studentName);
            });

        // 5. 순위 부여 및 제한
        return rankings.slice(0, limit).map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    } catch (error) {
        console.error('Failed to get ranking by level:', error);
        return [];
    }
}
