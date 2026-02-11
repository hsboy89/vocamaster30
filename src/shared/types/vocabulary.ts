// Vocabulary Types

export type Level = 'middle_1' | 'middle_2' | 'high_1' | 'high_2' | 'csat';
export type StudyStatus = 'not-started' | 'in-progress' | 'completed';
export type QuizType = 'choice' | 'matching' | 'spelling';
export type Category = 'society' | 'economy' | 'nature' | 'science' | 'culture' | 'education' | 'health' | 'global';

export interface CategoryInfo {
    id: Category;
    nameKo: string;
    icon: string;
    color: string;       // tailwind bg color
    textColor: string;   // tailwind text color
    gradientFrom: string;
    gradientTo: string;
}

export const CATEGORIES: Category[] = ['society', 'economy', 'nature', 'science', 'culture', 'education', 'health', 'global'];

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
    society: { id: 'society', nameKo: '사회', icon: '🏛️', color: 'bg-indigo-50', textColor: 'text-indigo-600', gradientFrom: 'from-indigo-500', gradientTo: 'to-indigo-600' },
    economy: { id: 'economy', nameKo: '경제', icon: '💰', color: 'bg-amber-50', textColor: 'text-amber-600', gradientFrom: 'from-amber-500', gradientTo: 'to-amber-600' },
    nature: { id: 'nature', nameKo: '자연·환경', icon: '🌿', color: 'bg-emerald-50', textColor: 'text-emerald-600', gradientFrom: 'from-emerald-500', gradientTo: 'to-emerald-600' },
    science: { id: 'science', nameKo: '과학·기술', icon: '🔬', color: 'bg-cyan-50', textColor: 'text-cyan-600', gradientFrom: 'from-cyan-500', gradientTo: 'to-cyan-600' },
    culture: { id: 'culture', nameKo: '문화·예술', icon: '🎨', color: 'bg-pink-50', textColor: 'text-pink-600', gradientFrom: 'from-pink-500', gradientTo: 'to-pink-600' },
    education: { id: 'education', nameKo: '교육·학문', icon: '📚', color: 'bg-violet-50', textColor: 'text-violet-600', gradientFrom: 'from-violet-500', gradientTo: 'to-violet-600' },
    health: { id: 'health', nameKo: '건강·의학', icon: '🏥', color: 'bg-rose-50', textColor: 'text-rose-600', gradientFrom: 'from-rose-500', gradientTo: 'to-rose-600' },
    global: { id: 'global', nameKo: '국제·정치', icon: '🌍', color: 'bg-sky-50', textColor: 'text-sky-600', gradientFrom: 'from-sky-500', gradientTo: 'to-sky-600' },
};

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
    category?: Category;
}

export interface DayVocabulary {
    level: Level;
    day: number;
    words: Word[];
    category?: Category;
}

export interface UserProgress {
    level: Level;
    day: number;
    status: StudyStatus;
    memorizedWords: string[]; // word IDs
    lastStudied?: string; // ISO date string
    category?: Category;
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
    totalWords: number;
}

// 단기 목표 옵션
export type GoalDuration = 5 | 7 | 10 | 14 | 30;

export interface StudyGoal {
    duration: GoalDuration;
    startDate: string; // ISO date
    level: Level;
    category?: Category;
    wordsPerDay: number;
}

export const GOAL_OPTIONS: { duration: GoalDuration; label: string; description: string }[] = [
    { duration: 5, label: '5일', description: '빠른 집중 학습' },
    { duration: 7, label: '7일', description: '1주 완성' },
    { duration: 10, label: '10일', description: '탄탄한 기초' },
    { duration: 14, label: '14일', description: '심화 마스터' },
    { duration: 30, label: '30일', description: '전체 완성' },
];

export interface StudyPlan {
    id: string;
    level: Level;
    wordsPerDay: number;
    schedule: Record<number, string[]>; // day -> list of word IDs
}

export const LEVEL_INFO: Record<Level, LevelInfo> = {
    middle_1: {
        id: 'middle_1',
        name: 'Middle School 1',
        nameKo: '중등 필수',
        description: '교과서 필수 어휘 및 기초 회화 단어',
        totalDays: 30,
        wordsPerDay: 30,
        totalWords: 900,
    },
    middle_2: {
        id: 'middle_2',
        name: 'Middle School 2',
        nameKo: '중등 심화',
        description: '중등 고난도 어휘 및 예비 고등 단어',
        totalDays: 30,
        wordsPerDay: 30,
        totalWords: 900,
    },
    high_1: {
        id: 'high_1',
        name: 'High School 1',
        nameKo: '고등 필수',
        description: '고등 내신 및 수능 기초 어휘',
        totalDays: 30,
        wordsPerDay: 40,
        totalWords: 1200,
    },
    high_2: {
        id: 'high_2',
        name: 'High School 2',
        nameKo: '고등 심화',
        description: '고난도 독해 및 심화 어휘',
        totalDays: 30,
        wordsPerDay: 40,
        totalWords: 1200,
    },
    csat: {
        id: 'csat',
        name: 'CSAT',
        nameKo: '수능 빈출',
        description: '수능 기출 및 빈출 심화 어휘',
        totalDays: 30,
        wordsPerDay: 50,
        totalWords: 1500,
    },
};
