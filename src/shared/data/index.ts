import { DayVocabulary, Level, Category, Word } from '../types';
import { generateVocabularyData } from './vocabulary-generator';

// 모든 레벨의 30일치 데이터 생성
export const allVocabulary: Record<Level, DayVocabulary[]> = {
    middle_1: generateVocabularyData('middle_1'),
    middle_2: generateVocabularyData('middle_2'),
    high_1: generateVocabularyData('high_1'),
    high_2: generateVocabularyData('high_2'),
    csat: generateVocabularyData('csat'),
};

export function getVocabulary(level: Level, day: number): DayVocabulary | undefined {
    return allVocabulary[level].find((vocab) => vocab.day === day);
}

export function getDaysList(level: Level): number[] {
    return allVocabulary[level].map((vocab) => vocab.day);
}

export function getTotalDays(level: Level): number {
    return allVocabulary[level].length;
}

/** 특정 레벨 + 카테고리의 모든 단어를 반환 */
export function getCategoryWords(level: Level, category: Category): Word[] {
    const words: Word[] = [];
    allVocabulary[level].forEach(dayVocab => {
        dayVocab.words.forEach(w => {
            if ((w as any).category === category) {
                words.push(w);
            }
        });
    });
    return words;
}

/** 특정 레벨의 각 카테고리별 단어 수를 반환 */
export function getCategoryWordCounts(level: Level): Record<string, number> {
    const counts: Record<string, number> = {};
    allVocabulary[level].forEach(dayVocab => {
        dayVocab.words.forEach(w => {
            const cat = (w as any).category || 'unknown';
            counts[cat] = (counts[cat] || 0) + 1;
        });
    });
    return counts;
    return counts;
}

/** 특정 레벨의 전체 단어를 반환 */
export function getAllWords(level: Level): Word[] {
    return allVocabulary[level].flatMap(vocab => vocab.words);
}

/** ID 목록에 해당하는 단어 객체들을 반환 */
export function getWordsByIds(level: Level, ids: string[]): Word[] {
    const allWords = getAllWords(level);
    const wordMap = new Map(allWords.map(w => [w.id, w]));
    return ids.map(id => wordMap.get(id)).filter((w): w is Word => w !== undefined);
}
