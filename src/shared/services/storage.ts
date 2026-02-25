import { Level, StudyStatus, UserProgress, WrongAnswer, Word, QuizResult, LevelCompletion } from '../types';
import { supabase } from '../lib';
import { useAuthStore } from '../../stores';

const STORAGE_KEYS = {
    PROGRESS: 'vocamaster_progress',
    WRONG_ANSWERS: 'vocamaster_wrong_answers',
    QUIZ_RESULTS: 'vocamaster_quiz_results',
    SETTINGS: 'vocamaster_settings',
};

// Helper: Get current user ID
function getUserId(): string | null {
    const { user } = useAuthStore.getState();
    return user?.id || null;
}

// Helper: Get current user's academy ID
function getAcademyId(): string | null {
    const { user } = useAuthStore.getState();
    return user?.academyId || null;
}

// =====================================================
// Progress Management (Supabase + Local Fallback)
// =====================================================

export async function getProgressFromCloud(level: Level, day: number): Promise<UserProgress | null> {
    const userId = getUserId();
    if (!userId) return getProgressLocal(level, day);

    try {
        const { data, error } = await supabase
            .from('student_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('level', level)
            .eq('day', day)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Failed to get progress from cloud:', error);
            return getProgressLocal(level, day);
        }

        if (!data) return null;

        return {
            level: data.level,
            day: data.day,
            status: data.status,
            memorizedWords: data.memorized_words || [],
            lastStudied: data.last_studied_at,
        };
    } catch (error) {
        console.error('Failed to get progress:', error);
        return getProgressLocal(level, day);
    }
}

export async function getAllProgressFromCloud(): Promise<UserProgress[]> {
    const userId = getUserId();
    if (!userId) return getAllProgressLocal();

    try {
        const { data, error } = await supabase
            .from('student_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Failed to get all progress from cloud:', error);
            return getAllProgressLocal();
        }

        return (data || []).map(item => ({
            level: item.level,
            day: item.day,
            status: item.status,
            memorizedWords: item.memorized_words || [],
            lastStudied: item.last_studied_at,
        }));
    } catch (error) {
        console.error('Failed to get all progress:', error);
        return getAllProgressLocal();
    }
}

export async function setProgressToCloud(
    level: Level,
    day: number,
    status: StudyStatus,
    memorizedWords: string[] = []
): Promise<void> {
    const userId = getUserId();

    // Always save locally first
    setProgressLocal(level, day, status, memorizedWords);

    if (!userId) return;

    try {
        const { error } = await supabase
            .from('student_progress')
            .upsert({
                user_id: userId,
                academy_id: getAcademyId(),
                level,
                day,
                status,
                memorized_words: memorizedWords,
                last_studied_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,level,day'
            });

        if (error) {
            console.error('Failed to save progress to cloud:', error);
        }
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

// =====================================================
// Wrong Answers Management (Supabase + Local Fallback)
// =====================================================

export async function getWrongAnswersFromCloud(): Promise<WrongAnswer[]> {
    const userId = getUserId();
    if (!userId) return getWrongAnswersLocal();

    try {
        const { data, error } = await supabase
            .from('wrong_answers')
            .select('*')
            .eq('user_id', userId)
            .order('wrong_count', { ascending: false });

        if (error) {
            console.error('Failed to get wrong answers from cloud:', error);
            return getWrongAnswersLocal();
        }

        return (data || []).map(item => ({
            word: item.word_data as Word,
            level: item.level,
            day: item.day,
            wrongCount: item.wrong_count,
            addedAt: item.added_at,
        }));
    } catch (error) {
        console.error('Failed to get wrong answers:', error);
        return getWrongAnswersLocal();
    }
}

export async function addWrongAnswerToCloud(word: Word, level: Level, day: number): Promise<void> {
    const userId = getUserId();

    // Always save locally first
    addWrongAnswerLocal(word, level, day);

    if (!userId) return;

    try {
        // Check if already exists
        const { data: existing } = await supabase
            .from('wrong_answers')
            .select('wrong_count')
            .eq('user_id', userId)
            .eq('word_id', word.id)
            .maybeSingle();

        if (existing) {
            // Update wrong count
            await supabase
                .from('wrong_answers')
                .update({ wrong_count: existing.wrong_count + 1 })
                .eq('user_id', userId)
                .eq('word_id', word.id);
        } else {
            // Insert new
            await supabase
                .from('wrong_answers')
                .insert({
                    user_id: userId,
                    academy_id: getAcademyId(),
                    word_id: word.id,
                    word_data: word,
                    level,
                    day,
                    wrong_count: 1,
                });
        }
    } catch (error) {
        console.error('Failed to save wrong answer:', error);
    }
}

export async function removeWrongAnswerFromCloud(wordId: string): Promise<void> {
    const userId = getUserId();

    // Always remove locally first
    removeWrongAnswerLocal(wordId);

    if (!userId) return;

    try {
        await supabase
            .from('wrong_answers')
            .delete()
            .eq('user_id', userId)
            .eq('word_id', wordId);
    } catch (error) {
        console.error('Failed to remove wrong answer:', error);
    }
}

// =====================================================
// Quiz Results Management (Supabase + Local Fallback)
// =====================================================

export async function getQuizResultsFromCloud(): Promise<QuizResult[]> {
    const userId = getUserId();
    if (!userId) return getQuizResultsLocal();

    try {
        const { data, error } = await supabase
            .from('quiz_history')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (error) {
            console.error('Failed to get quiz results from cloud:', error);
            return getQuizResultsLocal();
        }

        return (data || []).map(item => ({
            quizType: item.quiz_type,
            level: item.level,
            day: item.day,
            totalQuestions: item.total_questions,
            correctAnswers: item.correct_answers,
            wrongWordIds: item.wrong_word_ids || [],
            completedAt: item.completed_at,
        }));
    } catch (error) {
        console.error('Failed to get quiz results:', error);
        return getQuizResultsLocal();
    }
}

export async function saveQuizResultToCloud(result: QuizResult): Promise<void> {
    const userId = getUserId();

    // Always save locally first
    saveQuizResultLocal(result);

    if (!userId) return;

    try {
        await supabase
            .from('quiz_history')
            .insert({
                user_id: userId,
                academy_id: getAcademyId(),
                quiz_type: result.quizType,
                level: result.level,
                day: result.day,
                total_questions: result.totalQuestions,
                correct_answers: result.correctAnswers,
                wrong_word_ids: result.wrongWordIds,
                completed_at: result.completedAt,
            });
    } catch (error) {
        console.error('Failed to save quiz result:', error);
    }
}

export async function syncLocalQuizResultsToCloud(): Promise<void> {
    const userId = getUserId();
    if (!userId) return;

    const localResults = getQuizResultsLocal();
    if (localResults.length === 0) return;

    try {
        const cloudResults = await getQuizResultsFromCloud();

        // 중복 체크: completedAt, quizType, level, day가 모두 같은 경우 이미 저장된 것으로 간주
        const newResults = localResults.filter(local => {
            return !cloudResults.some(cloud =>
                cloud.completedAt === local.completedAt &&
                cloud.quizType === local.quizType &&
                cloud.level === local.level &&
                cloud.day === local.day
            );
        });

        if (newResults.length === 0) return;

        console.log(`Syncing ${newResults.length} quiz results to cloud...`);

        // 병렬로 저장
        await Promise.all(newResults.map(result => saveQuizResultToCloud(result)));
        console.log('Quiz results synced successfully.');
    } catch (error) {
        console.error('Failed to sync quiz results:', error);
    }
}

// =====================================================
// Local Storage Functions (Fallback / Offline)
// =====================================================

function getProgressLocal(level: Level, day: number): UserProgress | null {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        if (!data) return null;

        const allProgress: UserProgress[] = JSON.parse(data);
        return allProgress.find((p) => p.level === level && p.day === day) || null;
    } catch {
        return null;
    }
}

function getAllProgressLocal(): UserProgress[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function setProgressLocal(level: Level, day: number, status: StudyStatus, memorizedWords: string[] = []): void {
    try {
        const allProgress = getAllProgressLocal();
        const existingIndex = allProgress.findIndex((p) => p.level === level && p.day === day);

        const newProgress: UserProgress = {
            level,
            day,
            status,
            memorizedWords,
            lastStudied: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            allProgress[existingIndex] = newProgress;
        } else {
            allProgress.push(newProgress);
        }

        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
        console.error('Failed to save progress locally:', error);
    }
}

function getWrongAnswersLocal(): WrongAnswer[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function addWrongAnswerLocal(word: Word, level: Level, day: number): void {
    try {
        const wrongAnswers = getWrongAnswersLocal();
        const existingIndex = wrongAnswers.findIndex((w) => w.word.id === word.id);

        if (existingIndex >= 0) {
            wrongAnswers[existingIndex].wrongCount += 1;
        } else {
            wrongAnswers.push({
                word,
                level,
                day,
                wrongCount: 1,
                addedAt: new Date().toISOString(),
            });
        }

        localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(wrongAnswers));
    } catch (error) {
        console.error('Failed to save wrong answer locally:', error);
    }
}

function removeWrongAnswerLocal(wordId: string): void {
    try {
        const wrongAnswers = getWrongAnswersLocal();
        const filtered = wrongAnswers.filter((w) => w.word.id !== wordId);
        localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to remove wrong answer locally:', error);
    }
}

function getQuizResultsLocal(): QuizResult[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveQuizResultLocal(result: QuizResult): void {
    try {
        const results = getQuizResultsLocal();
        results.push(result);
        localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
    } catch (error) {
        console.error('Failed to save quiz result locally:', error);
    }
}

// =====================================================
// Public API — DB-first for registered, localStorage for guests
// =====================================================

// --- Progress ---

export async function getProgress(level: Level, day: number): Promise<UserProgress | null> {
    const userId = getUserId();
    if (userId) {
        return getProgressFromCloud(level, day);
    }
    return getProgressLocal(level, day);
}

export async function getAllProgress(): Promise<UserProgress[]> {
    const userId = getUserId();
    if (userId) {
        return getAllProgressFromCloud();
    }
    return getAllProgressLocal();
}

export async function setProgress(level: Level, day: number, status: StudyStatus, memorizedWords: string[] = []): Promise<void> {
    const userId = getUserId();
    if (userId) {
        await setProgressToCloud(level, day, status, memorizedWords);
    } else {
        setProgressLocal(level, day, status, memorizedWords);
    }
}

export async function getProgressByLevel(level: Level): Promise<UserProgress[]> {
    const allProgress = await getAllProgress();
    return allProgress.filter((p) => p.level === level);
}

export async function calculateCompletionRate(level: Level): Promise<number> {
    const progress = await getProgressByLevel(level);
    const completed = progress.filter((p) => p.status === 'completed').length;
    return Math.round((completed / 30) * 100);
}

export async function getAllMemorizedWordIds(level: Level): Promise<string[]> {
    const progress = await getProgressByLevel(level);
    return progress.flatMap(p => p.memorizedWords || []);
}

export async function resetLevelProgress(level: Level): Promise<void> {
    const userId = getUserId();

    if (userId) {
        // Cloud Reset
        try {
            await supabase
                .from('student_progress')
                .delete()
                .eq('user_id', userId)
                .eq('level', level);
        } catch (e) {
            console.error("Failed to reset cloud progress", e);
        }
    } else {
        // Local Reset
        try {
            const allProgress = getAllProgressLocal();
            const filtered = allProgress.filter(p => p.level !== level);
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(filtered));
        } catch (e) {
            console.error("Failed to reset local progress", e);
        }
    }
}

// --- Wrong Answers ---

export async function getWrongAnswers(): Promise<WrongAnswer[]> {
    const userId = getUserId();
    if (userId) {
        return getWrongAnswersFromCloud();
    }
    return getWrongAnswersLocal();
}

export async function addWrongAnswer(word: Word, level: Level, day: number): Promise<void> {
    const userId = getUserId();
    if (userId) {
        await addWrongAnswerToCloud(word, level, day);
    } else {
        addWrongAnswerLocal(word, level, day);
    }
}

export async function removeWrongAnswer(wordId: string): Promise<void> {
    const userId = getUserId();
    if (userId) {
        await removeWrongAnswerFromCloud(wordId);
    } else {
        removeWrongAnswerLocal(wordId);
    }
}

export function clearWrongAnswers(): void {
    localStorage.removeItem(STORAGE_KEYS.WRONG_ANSWERS);
}

// --- Quiz Results ---

export async function getQuizResults(): Promise<QuizResult[]> {
    const userId = getUserId();
    if (userId) {
        return getQuizResultsFromCloud();
    }
    return getQuizResultsLocal();
}

export async function saveQuizResult(result: QuizResult): Promise<void> {
    const userId = getUserId();
    if (userId) {
        await saveQuizResultToCloud(result);
    } else {
        saveQuizResultLocal(result);
    }
}

// --- Settings (local only, per-device) ---
export interface Settings {
    hideMode: 'none' | 'word' | 'meaning' | 'synonyms';
    soundEnabled: boolean;
    darkMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    hideMode: 'none',
    soundEnabled: true,
    darkMode: false,
};

export function getSettings(): Settings {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings: Partial<Settings>): void {
    try {
        const current = getSettings();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

export function clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
    });
}

// =====================================================
// Level Completion & Promotion Test
// =====================================================

export interface LevelCompletionResult {
    averageScore: number;
    totalQuizzes: number;
    passed: boolean; // avg >= 90
    needsPromotionTest: boolean; // avg < 90
    attemptNumber: number;
    isRankingEligible: boolean;
}

/**
 * 레벨의 모든 Day가 완료되었는지 확인하고, 완료 시 level_completions에 기록
 */
export async function checkAndCompleteLevelIfDone(level: Level): Promise<LevelCompletionResult | null> {
    const userId = getUserId();
    const academyId = getAcademyId();
    if (!userId) return null;

    try {
        // 1. 해당 레벨의 모든 Day 완료 여부 확인
        const { data: progressData } = await supabase
            .from('student_progress')
            .select('day, status')
            .eq('user_id', userId)
            .eq('level', level);

        if (!progressData) return null;

        const completedDays = new Set(
            progressData.filter(p => p.status === 'completed').map(p => p.day)
        );

        // 해당 레벨의 총 Day 수 가져오기 (사용자의 목표 기간)
        const { data: userData } = await supabase
            .from('users')
            .select('goal_duration')
            .eq('id', userId)
            .single();

        const totalDays = userData?.goal_duration || 30;

        // 모든 Day가 완료되지 않았으면 null 반환
        for (let d = 1; d <= totalDays; d++) {
            if (!completedDays.has(d)) return null;
        }

        // 2. 이 레벨의 퀴즈 평균 점수 계산
        const { data: quizzes } = await supabase
            .from('quiz_history')
            .select('correct_answers, total_questions')
            .eq('user_id', userId)
            .eq('level', level);

        let totalScore = 0;
        let quizCount = 0;
        quizzes?.forEach(q => {
            if (q.total_questions > 0) {
                let correctCount = q.correct_answers;
                if (correctCount > q.total_questions) {
                    correctCount = Math.round(correctCount / 5);
                }
                correctCount = Math.min(correctCount, q.total_questions);
                totalScore += (correctCount / q.total_questions) * 100;
                quizCount++;
            }
        });

        const averageScore = quizCount > 0 ? Math.round((totalScore / quizCount) * 100) / 100 : 0;
        const passed = averageScore >= 90;

        // 3. 이 레벨의 기존 완료 횟수 확인 (attempt_number 결정)
        const { data: existingCompletions } = await supabase
            .from('level_completions')
            .select('attempt_number, is_ranking_eligible')
            .eq('user_id', userId)
            .eq('level', level)
            .order('attempt_number', { ascending: false });

        const lastAttempt = existingCompletions?.[0]?.attempt_number || 0;
        const attemptNumber = lastAttempt + 1;

        // 4. 랭킹 자격 결정
        // 재학습(2회차 이상)이면, 이전에 top 3에 들지 않았을 때만 랭킹 포함
        let isRankingEligible = true;
        if (attemptNumber > 1) {
            // 이전 완료에서 랭킹 3등 안에 들었는지 확인
            const wasTop3 = await checkIfWasTop3(userId, level, academyId);
            isRankingEligible = !wasTop3;
        }

        // 5. level_completions에 저장
        await supabase
            .from('level_completions')
            .upsert({
                user_id: userId,
                academy_id: academyId,
                level,
                average_score: averageScore,
                total_quizzes: quizCount,
                passed,
                promotion_test_taken: false,
                promotion_test_score: null,
                attempt_number: attemptNumber,
                is_ranking_eligible: isRankingEligible,
                completed_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,level,attempt_number'
            });

        return {
            averageScore,
            totalQuizzes: quizCount,
            passed,
            needsPromotionTest: !passed,
            attemptNumber,
            isRankingEligible,
        };
    } catch (error) {
        console.error('Failed to check level completion:', error);
        return null;
    }
}

/**
 * 특정 레벨의 오답 단어 조회 (진급 테스트용)
 */
export async function getWrongAnswersByLevel(level: Level): Promise<WrongAnswer[]> {
    const userId = getUserId();
    if (!userId) return [];

    try {
        const { data, error } = await supabase
            .from('wrong_answers')
            .select('*')
            .eq('user_id', userId)
            .eq('level', level)
            .order('wrong_count', { ascending: false });

        if (error) {
            console.error('Failed to get wrong answers by level:', error);
            return [];
        }

        return (data || []).map(item => ({
            word: item.word_data as Word,
            level: item.level,
            day: item.day,
            wrongCount: item.wrong_count,
            addedAt: item.added_at,
        }));
    } catch (error) {
        console.error('Failed to get wrong answers by level:', error);
        return [];
    }
}

/**
 * 진급 테스트 결과 저장
 */
export async function savePromotionTestResult(
    level: Level,
    score: number,
    passed: boolean
): Promise<void> {
    const userId = getUserId();
    if (!userId) return;

    try {
        // 가장 최근 완료 기록의 attempt_number 조회
        const { data: latest } = await supabase
            .from('level_completions')
            .select('attempt_number')
            .eq('user_id', userId)
            .eq('level', level)
            .order('attempt_number', { ascending: false })
            .limit(1);

        const attemptNumber = latest?.[0]?.attempt_number || 1;

        await supabase
            .from('level_completions')
            .update({
                promotion_test_taken: true,
                promotion_test_score: score,
                passed: passed,
            })
            .eq('user_id', userId)
            .eq('level', level)
            .eq('attempt_number', attemptNumber);
    } catch (error) {
        console.error('Failed to save promotion test result:', error);
    }
}

/**
 * 사용자의 레벨 완료 기록 조회
 */
export async function getLevelCompletions(level?: Level): Promise<LevelCompletion[]> {
    const userId = getUserId();
    if (!userId) return [];

    try {
        let query = supabase
            .from('level_completions')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (level) {
            query = query.eq('level', level);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to get level completions:', error);
            return [];
        }

        return (data || []).map(item => ({
            userId: item.user_id,
            level: item.level,
            averageScore: parseFloat(item.average_score),
            totalQuizzes: item.total_quizzes,
            passed: item.passed,
            promotionTestTaken: item.promotion_test_taken,
            promotionTestScore: item.promotion_test_score ? parseFloat(item.promotion_test_score) : undefined,
            attemptNumber: item.attempt_number,
            isRankingEligible: item.is_ranking_eligible,
            completedAt: item.completed_at,
        }));
    } catch (error) {
        console.error('Failed to get level completions:', error);
        return [];
    }
}

/**
 * 특정 레벨이 접근 가능한지 확인
 * - 관리자가 설정한 start_level부터 접근 가능
 * - 이전 레벨을 통과(passed=true)해야 다음 레벨 접근 가능
 */
export async function isLevelUnlocked(level: Level): Promise<boolean> {
    const userId = getUserId();
    if (!userId) return true; // 게스트는 모두 접근 가능

    const levelOrder: Level[] = ['middle_1', 'middle_2', 'high_2', 'high_1', 'csat_basic', 'csat', 'csat_advanced'];
    const levelIndex = levelOrder.indexOf(level);

    try {
        // 사용자의 start_level 확인
        const { data: userData } = await supabase
            .from('users')
            .select('start_level')
            .eq('id', userId)
            .single();

        const startLevel = (userData?.start_level || 'middle_1') as Level;
        const startIndex = levelOrder.indexOf(startLevel);

        // start_level보다 낮은 레벨은 항상 접근 불가
        if (levelIndex < startIndex) return false;

        // start_level과 동일하면 항상 접근 가능
        if (levelIndex === startIndex) return true;

        // start_level보다 높은 레벨은 이전 레벨이 통과되었는지 확인
        const prevLevel = levelOrder[levelIndex - 1];

        const { data: prevCompletion } = await supabase
            .from('level_completions')
            .select('passed')
            .eq('user_id', userId)
            .eq('level', prevLevel)
            .eq('passed', true)
            .limit(1);

        return (prevCompletion && prevCompletion.length > 0) || false;
    } catch (error) {
        console.error('Failed to check level unlock:', error);
        return true; // 에러 시 접근 허용 (안전)
    }
}

/**
 * 이전에 해당 레벨에서 top 3에 들었는지 확인
 */
async function checkIfWasTop3(userId: string, level: Level, academyId: string | null): Promise<boolean> {
    if (!academyId) return false;

    try {
        // 해당 레벨의 모든 랭킹 자격 있는 완료 기록 조회
        const { data: allCompletions } = await supabase
            .from('level_completions')
            .select('user_id, average_score')
            .eq('academy_id', academyId)
            .eq('level', level)
            .eq('is_ranking_eligible', true)
            .order('average_score', { ascending: false });

        if (!allCompletions || allCompletions.length === 0) return false;

        // 상위 3명에 해당 유저가 있는지 확인
        const top3UserIds = allCompletions.slice(0, 3).map(c => c.user_id);
        return top3UserIds.includes(userId);
    } catch (error) {
        console.error('Failed to check top 3:', error);
        return false;
    }
}

