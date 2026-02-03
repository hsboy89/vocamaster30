const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levels = ['middle', 'high', 'advanced'];
const globalSeen = new Set();

levels.forEach(level => {
    const days = db.data[level] || [];
    const levelWords = new Set();
    let levelDupes = 0;
    let globalDupes = 0;

    days.forEach(day => {
        day.words.forEach(word => {
            const w = word.word.toLowerCase().trim();
            if (levelWords.has(w)) levelDupes++;
            if (globalSeen.has(w)) globalDupes++;
            levelWords.add(w);
            globalSeen.add(w);
        });
    });
    console.log(`Level: ${level}`);
    console.log(`  Total occurrences: ${days.reduce((acc, d) => acc + d.words.length, 0)}`);
    console.log(`  Unique in level: ${levelWords.size}`);
    console.log(`  Duplicates within level: ${levelDupes}`);
    console.log(`  Duplicates across previous levels: ${globalDupes}`);
});
