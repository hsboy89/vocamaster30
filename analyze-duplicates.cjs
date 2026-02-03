const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const outputPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db-cleaned.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levels = ['middle', 'high', 'advanced'];
const seenWords = new Set();
const duplicatesRemoved = [];

const cleanedData = { ...db.data };

levels.forEach(level => {
    const days = cleanedData[level] || [];
    days.forEach(day => {
        const originalWordCount = day.words.length;
        day.words = day.words.filter(word => {
            const wordText = word.word.toLowerCase().trim();
            if (seenWords.has(wordText)) {
                duplicatesRemoved.push({
                    word: word.word,
                    removedFrom: level,
                    day: day.day
                });
                return false;
            } else {
                seenWords.add(wordText);
                return true;
            }
        });
    });
});

db.data = cleanedData;
fs.writeFileSync(outputPath, JSON.stringify(db, null, 4), 'utf8');

console.log(`Total unique words: ${seenWords.size}`);
console.log(`Total duplicates removed: ${duplicatesRemoved.length}`);

if (duplicatesRemoved.length > 0) {
    console.log('\n--- Removed Duplicates Example ---');
    duplicatesRemoved.slice(0, 20).forEach(d => {
        console.log(`Removed "${d.word}" from ${d.removedFrom} Day ${d.day}`);
    });
}
console.log(`\nCleaned database saved to: ${outputPath}`);
