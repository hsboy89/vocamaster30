import { Level, StudyPlan } from '../types';
import { getAllWords } from '../data';

// Fisher-Yates shuffle
export function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function createStudyPlan(
    level: Level,
    duration: number,
    memorizedWordIds: string[] = [],
    targetDailyCount?: number
): StudyPlan {
    const allWords = getAllWords(level);

    // 1. 이미 외운 단어 제외
    const availableWords = allWords.filter(w => !memorizedWordIds.includes(w.id));

    const shuffledWords = shuffle(availableWords);

    // 2. 이번 플랜의 목표 단어 수 계산
    let planWords: string[] = [];
    let wordsPerDay = 0;

    if (targetDailyCount) {
        // 목표량 * 기간 만큼만 할당 (단, 남은 단어 수보다 클 수 없음)
        const targetTotal = Math.min(availableWords.length, duration * targetDailyCount);
        planWords = shuffledWords.slice(0, targetTotal).map(w => w.id);
        wordsPerDay = targetDailyCount;
    } else {
        // 남은 단어 전체를 기간 내에 분배
        planWords = shuffledWords.map(w => w.id);
        wordsPerDay = Math.ceil(planWords.length / duration);
    }

    const schedule: Record<number, string[]> = {};

    for (let i = 0; i < duration; i++) {
        const day = i + 1;
        const start = i * wordsPerDay;
        // targetDailyCount 모드일 때도 slice 범위가 planWords 길이를 넘지 않으므로 안전
        const end = Math.min(start + wordsPerDay, planWords.length);
        const dayWordIds = planWords.slice(start, end);

        if (dayWordIds.length > 0) {
            schedule[day] = dayWordIds;
        }
    }

    return {
        id: Date.now().toString(),
        level,
        wordsPerDay,
        schedule
    };
}
