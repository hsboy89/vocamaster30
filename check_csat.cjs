const fs = require('fs');
const db = JSON.parse(fs.readFileSync('src/shared/data/vocabulary-db.json', 'utf8'));

if (!db.data || !db.data.csat) {
    console.error('No csat data found');
    process.exit(1);
}

let totalWords = 0;
const counts = {};
const missingDays = [];
const emptyDays = [];

db.data.csat.forEach(dayData => {
    const day = dayData.day;
    const wordCount = dayData.words ? dayData.words.length : 0;

    counts[day] = wordCount;
    totalWords += wordCount;

    if (wordCount === 0) {
        emptyDays.push(day);
    }
});

for (let i = 1; i <= 45; i++) {
    if (counts[i] === undefined) {
        missingDays.push(i);
    }
}

console.log('Total CSAT words:', totalWords);
console.log('Counts per day:', counts);
if (missingDays.length > 0) console.log('Missing days (no entry):', missingDays);
if (emptyDays.length > 0) console.log('Empty days (0 words):', emptyDays);
