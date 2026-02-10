import { Level, StudyStatus, UserProgress, WrongAnswer, Word, QuizResult } from '../types';
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
            .single();

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
            .single();

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
// Legacy API Compatibility (for existing code)
// =====================================================

export function getProgress(level: Level, day: number): UserProgress | null {
    return getProgressLocal(level, day);
}

export function getAllProgress(): UserProgress[] {
    return getAllProgressLocal();
}

export function setProgress(level: Level, day: number, status: StudyStatus, memorizedWords: string[] = []): void {
    setProgressLocal(level, day, status, memorizedWords);
    // Also sync to cloud asynchronously
    setProgressToCloud(level, day, status, memorizedWords);
}

export function getProgressByLevel(level: Level): UserProgress[] {
    return getAllProgressLocal().filter((p) => p.level === level);
}

export function calculateCompletionRate(level: Level): number {
    const progress = getProgressByLevel(level);
    const completed = progress.filter((p) => p.status === 'completed').length;
    return Math.round((completed / 30) * 100);
}

export function getAllMemorizedWordIds(level: Level): string[] {
    const progress = getProgressByLevel(level);
    return progress.flatMap(p => p.memorizedWords || []);
}

export async function resetLevelProgress(level: Level): Promise<void> {
    const userId = getUserId();

    // 1. Local Reset
    try {
        const allProgress = getAllProgressLocal();
        const filtered = allProgress.filter(p => p.level !== level);
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(filtered));

        // Settings 등 다른 정보는 유지. Plan은 GoalSetting에서 별도 처리.
    } catch (e) {
        console.error("Failed to reset local progress", e);
    }

    // 2. Cloud Reset (Soft Delete or Hard Delete)
    if (userId) {
        try {
            await supabase
                .from('student_progress')
                .delete()
                .eq('user_id', userId)
                .eq('level', level);
        } catch (e) {
            console.error("Failed to reset cloud progress", e);
        }
    }
}

export function getWrongAnswers(): WrongAnswer[] {
    return getWrongAnswersLocal();
}

export function addWrongAnswer(word: Word, level: Level, day: number): void {
    addWrongAnswerLocal(word, level, day);
    // Also sync to cloud asynchronously
    addWrongAnswerToCloud(word, level, day);
}

export function removeWrongAnswer(wordId: string): void {
    removeWrongAnswerLocal(wordId);
    // Also sync to cloud asynchronously
    removeWrongAnswerFromCloud(wordId);
}

export function clearWrongAnswers(): void {
    localStorage.removeItem(STORAGE_KEYS.WRONG_ANSWERS);
}

export function getQuizResults(): QuizResult[] {
    return getQuizResultsLocal();
}

export function saveQuizResult(result: QuizResult): void {
    saveQuizResultLocal(result);
    // Also sync to cloud asynchronously
    saveQuizResultToCloud(result);
}

// Settings (local only)
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
