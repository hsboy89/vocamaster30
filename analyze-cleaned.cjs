const fs = require('fs');
const path = require('path');

const cleanedPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db-cleaned.json');
const db = JSON.parse(fs.readFileSync(cleanedPath, 'utf8'));

const levels = ['middle', 'high', 'advanced'];

levels.forEach(level => {
    const days = db.data[level] || [];
    let totalWords = 0;
    const daysWithWords = days.filter(d => d.words.length > 0).length;
    days.forEach(d => totalWords += d.words.length);
    console.log(`Level ${level}: ${totalWords} words across ${daysWithWords} days.`);
});
