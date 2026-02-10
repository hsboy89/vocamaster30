import { Word, DayVocabulary, Level } from '../types';
import vocabularyDb from './vocabulary-db.json';

// Use data from JSON database
const db = vocabularyDb.data;

export function generateVocabularyData(level: Level, totalDays?: number): DayVocabulary[] {
    const levelData = db[level] || [];
    const days = totalDays || levelData.length || 30;

    return Array.from({ length: days }, (_, i) => {
        const dayNum = i + 1;
        const dayEntry = levelData.find(d => d.day === dayNum);

        let words: Word[] = [];

        if (dayEntry && dayEntry.words.length > 0) {
            words = dayEntry.words.map(w => ({
                ...w,
                examples: w.examples || [],
                isMemorized: false,
                category: (w as any).category || undefined,
            }));
        }

        return {
            level,
            day: dayNum,
            words
        };
    });
}
