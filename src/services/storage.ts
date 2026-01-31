import { Level, StudyStatus, UserProgress, WrongAnswer, Word, QuizResult } from '../types';

const STORAGE_KEYS = {
    PROGRESS: 'vocamaster_progress',
    WRONG_ANSWERS: 'vocamaster_wrong_answers',
    QUIZ_RESULTS: 'vocamaster_quiz_results',
    SETTINGS: 'vocamaster_settings',
};

// Progress Management
export function getProgress(level: Level, day: number): UserProgress | null {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        if (!data) return null;

        const allProgress: UserProgress[] = JSON.parse(data);
        return allProgress.find((p) => p.level === level && p.day === day) || null;
    } catch {
        return null;
    }
}

export function getAllProgress(): UserProgress[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function setProgress(level: Level, day: number, status: StudyStatus, memorizedWords: string[] = []): void {
    try {
        const allProgress = getAllProgress();
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
        console.error('Failed to save progress:', error);
    }
}

export function getProgressByLevel(level: Level): UserProgress[] {
    return getAllProgress().filter((p) => p.level === level);
}

export function calculateCompletionRate(level: Level): number {
    const progress = getProgressByLevel(level);
    const completed = progress.filter((p) => p.status === 'completed').length;
    return Math.round((completed / 30) * 100);
}

// Wrong Answers Management
export function getWrongAnswers(): WrongAnswer[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addWrongAnswer(word: Word, level: Level, day: number): void {
    try {
        const wrongAnswers = getWrongAnswers();
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
        console.error('Failed to save wrong answer:', error);
    }
}

export function removeWrongAnswer(wordId: string): void {
    try {
        const wrongAnswers = getWrongAnswers();
        const filtered = wrongAnswers.filter((w) => w.word.id !== wordId);
        localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to remove wrong answer:', error);
    }
}

export function clearWrongAnswers(): void {
    localStorage.removeItem(STORAGE_KEYS.WRONG_ANSWERS);
}

// Quiz Results Management
export function getQuizResults(): QuizResult[] {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveQuizResult(result: QuizResult): void {
    try {
        const results = getQuizResults();
        results.push(result);
        localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
    } catch (error) {
        console.error('Failed to save quiz result:', error);
    }
}

// Settings
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

// Clear all data
export function clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
    });
}
