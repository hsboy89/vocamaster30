import { Word, DayVocabulary, Level } from '../types';
import vocabularyDb from './vocabulary-db.json';

// Use data from JSON database
const db = vocabularyDb.data;

export function generateVocabularyData(level: Level, totalDays: number = 30): DayVocabulary[] {
    const levelData = db[level] || [];

    return Array.from({ length: totalDays }, (_, i) => {
        const dayNum = i + 1;
        const dayEntry = levelData.find(d => d.day === dayNum);

        let words: Word[] = [];

        if (dayEntry && dayEntry.words.length > 0) {
            // Map JSON words to internal Word type
            words = dayEntry.words.map(w => ({
                ...w,
                examples: w.examples || [], // Ensure examples property exists
                isMemorized: false
            }));
        }

        return {
            level,
            day: dayNum,
            words
        };
    });
}
