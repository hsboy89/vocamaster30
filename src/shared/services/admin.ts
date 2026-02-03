import { supabase } from '../lib';
import { DbUser, dbUserToUser, User } from '../types';

// 전체 통계 타입
export interface DashboardStats {
    totalStudents: number;
    todayAttendance: {
        active: number;
        total: number;
    };
    totalMastery: number;
    atRiskCount: number;
    averageScore: number;
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
}

// Day별 진행률 타입
export interface DayProgress {
    day: number;
    completedCount: number;
    totalStudents: number;
    percentage: number;
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

        // 5. 평균 퀴즈 점수
        let quizQuery = supabase
            .from('quiz_history')
            .select('correct_answers, total_questions');

        if (academyId) {
            quizQuery = quizQuery.eq('academy_id', academyId);
        }

        const { data: quizData } = await quizQuery;

        let totalScore = 0;
        let quizCount = 0;
        quizData?.forEach(q => {
            if (q.total_questions > 0) {
                totalScore += (q.correct_answers / q.total_questions) * 100;
                quizCount++;
            }
        });
        const averageScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;

        return {
            totalStudents: totalCount,
            todayAttendance: {
                active: activeTodayCount,
                total: totalCount
            },
            totalMastery,
            atRiskCount: atRiskCount || 0,
            averageScore,
        };
    } catch (error) {
        console.error('Failed to get dashboard stats:', error);
        return {
            totalStudents: 0,
            todayAttendance: { active: 0, total: 0 },
            totalMastery: 0,
            atRiskCount: 0,
            averageScore: 0,
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
                    const total = quizzes.reduce((sum, q) =>
                        sum + (q.total_questions > 0 ? (q.correct_answers / q.total_questions) * 100 : 0), 0);
                    avgScore = Math.round(total / quizzes.length);
                }

                return {
                    id: user.id,
                    academyName: user.academy_name || 'Unknown',
                    studentName: user.student_name,
                    currentDay,
                    completedDays,
                    lastLoginAt: user.last_login_at || null,
                    averageScore: avgScore,
                };
            })
        );

        return studentList;
    } catch (error) {
        console.error('Failed to get student list:', error);
        return [];
    }
}

// Day별 진행률 조회 (전체 학생 대상)
export async function getDayProgressStats(level: string = 'middle', academyId?: string): Promise<DayProgress[]> {
    try {
        // 전체 학생 수
        let studentQuery = supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        if (academyId) {
            studentQuery = studentQuery.eq('academy_id', academyId);
        }

        const { count: totalStudents } = await studentQuery;

        // 완료된 진도 데이터
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
        for (let day = 1; day <= 30; day++) {
            const completedCount = dayStats[day] || 0;
            result.push({
                day,
                completedCount,
                totalStudents: totalStudents || 0,
                percentage: totalStudents ? Math.round((completedCount / totalStudents) * 100) : 0,
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

        const levels = ['middle', 'high', 'advanced'];
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
                ? Math.round((q.correct_answers / q.total_questions) * 100)
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


