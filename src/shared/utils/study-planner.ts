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

export function createStudyPlan(level: Level, duration: number): StudyPlan {
    const allWords = getAllWords(level);
    const shuffledWords = shuffle(allWords);

    // 마지막 날짜에 남은 단어가 너무 적으면 분배 로직 조정 필요할 수 있으나,
    // Math.ceil을 사용하면 앞쪽 날짜들이 꽉 차고 마지막 날짜가 조금 적거나 같아짐.
    // 1000단어 / 30일 = 33.33 -> 34단어씩.
    // 34 * 29 = 986. 나머지 14단어.
    // 이렇게 되면 분배는 되지만 마지막 날이 좀 적음. 
    // 사용자 요청은 "꽉 채워달라"는 것이었으므로 acceptable.

    const wordsPerDay = Math.ceil(allWords.length / duration);
    const schedule: Record<number, string[]> = {};

    for (let i = 0; i < duration; i++) {
        const day = i + 1;
        const start = i * wordsPerDay;
        const end = Math.min(start + wordsPerDay, allWords.length);
        const dayWords = shuffledWords.slice(start, end);

        if (dayWords.length > 0) {
            schedule[day] = dayWords.map(w => w.id);
        }
    }

    return {
        id: Date.now().toString(), // Simple ID generation
        level,
        wordsPerDay,
        schedule
    };
}
