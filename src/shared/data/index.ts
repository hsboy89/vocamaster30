import { DayVocabulary, Level } from '../types';
import { generateVocabularyData } from './vocabulary-generator';

// 모든 레벨의 30일치 데이터 생성
export const allVocabulary: Record<Level, DayVocabulary[]> = {
    middle: generateVocabularyData('middle', 30),
    high: generateVocabularyData('high', 30),
    advanced: generateVocabularyData('advanced', 30),
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
