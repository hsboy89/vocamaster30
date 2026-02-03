const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levels = ['middle', 'high', 'advanced'];

levels.forEach(level => {
    const days = db.data[level] || [];
    const levelWords = new Set();
    console.log(`\n--- Level: ${level} ---`);
    days.forEach(day => {
        const dayWords = day.words.map(w => w.word.toLowerCase().trim());
        const newWords = dayWords.filter(w => !levelWords.has(w));
        console.log(`Day ${day.day}: ${dayWords.length} words, ${newWords.length} are new to this level`);
        dayWords.forEach(w => levelWords.add(w));
    });
    console.log(`Total unique words in ${level}: ${levelWords.size}`);
});
