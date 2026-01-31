// Vocabulary Types

export type Level = 'middle' | 'high' | 'advanced';
export type StudyStatus = 'not-started' | 'in-progress' | 'completed';
export type QuizType = 'choice' | 'matching' | 'spelling';

export interface Example {
    sentence: string;
    translation: string;
}

export interface Word {
    id: string;
    word: string;
    meaning: string;
    pronunciation: string;
    synonyms: string[];
    antonyms: string[];
    examples: Example[];
    isMemorized: boolean;
}

export interface DayVocabulary {
    level: Level;
    day: number;
    words: Word[];
}

export interface UserProgress {
    level: Level;
    day: number;
    status: StudyStatus;
    memorizedWords: string[]; // word IDs
    lastStudied?: string; // ISO date string
}

export interface WrongAnswer {
    word: Word;
    level: Level;
    day: number;
    wrongCount: number;
    addedAt: string; // ISO date string
}

export interface QuizResult {
    quizType: QuizType;
    level: Level;
    day: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongWordIds: string[];
    completedAt: string; // ISO date string
}

export interface LevelInfo {
    id: Level;
    name: string;
    nameKo: string;
    description: string;
    totalDays: number;
    wordsPerDay: number;
}

export const LEVEL_INFO: Record<Level, LevelInfo> = {
    middle: {
        id: 'middle',
        name: 'Middle School',
        nameKo: '중등 필수',
        description: '교과서 필수 어휘 및 기초 회화 단어',
        totalDays: 30,
        wordsPerDay: 30,
    },
    high: {
        id: 'high',
        name: 'High School',
        nameKo: '고등 기초',
        description: '내신 대비 및 수능 기초 어휘',
        totalDays: 30,
        wordsPerDay: 30,
    },
    advanced: {
        id: 'advanced',
        name: 'Advanced',
        nameKo: '수능 심화',
        description: '수능 빈출 어휘 및 심화 유의어/반의어',
        totalDays: 30,
        wordsPerDay: 30,
    },
};
