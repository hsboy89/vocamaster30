const fs = require('fs');
const path = require('path');

// Read raw data file
const rawData = fs.readFileSync(path.join(__dirname, 'high1-raw-data.txt'), 'utf-8');

const lines = rawData.split('\n');
const days = [];
let currentDay = null;
let currentWords = [];
let wordIndex = 0;

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for day header
    const dayMatch = trimmed.match(/^=== Day (\d+) ===$/);
    if (dayMatch) {
        if (currentDay !== null && currentWords.length > 0) {
            days.push({ day: currentDay, words: currentWords });
        }
        currentDay = parseInt(dayMatch[1]);
        currentWords = [];
        wordIndex = 0;
        continue;
    }

    // Parse word line: word | pronunciation | meaning | synonyms | antonyms | ex1_en | ex1_ko | ex2_en | ex2_ko
    const parts = trimmed.split(' | ');
    if (parts.length < 9) continue;

    wordIndex++;
    const dayStr = String(currentDay).padStart(2, '0');
    const wordStr = String(wordIndex).padStart(3, '0');

    const word = parts[0].trim();
    const pronunciation = parts[1].trim();
    const meaning = parts[2].trim();

    const synonymsRaw = parts[3].trim();
    const synonyms = synonymsRaw === '-' ? [] : synonymsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const antonymsRaw = parts[4].trim();
    const antonyms = antonymsRaw === '-' ? [] : antonymsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const examples = [];
    if (parts[5] && parts[6]) {
        examples.push({ sentence: parts[5].trim(), translation: parts[6].trim() });
    }
    if (parts[7] && parts[8]) {
        examples.push({ sentence: parts[7].trim(), translation: parts[8].trim() });
    }

    currentWords.push({
        id: `h${dayStr}-${wordStr}`,
        word: word,
        meaning: meaning,
        pronunciation: pronunciation,
        synonyms: synonyms,
        antonyms: antonyms,
        examples: examples
    });
}

// Push last day
if (currentDay !== null && currentWords.length > 0) {
    days.push({ day: currentDay, words: currentWords });
}

// Stats
console.log(`Parsed ${days.length} days`);
let totalWords = 0;
for (const d of days) {
    console.log(`  Day ${d.day}: ${d.words.length} words`);
    totalWords += d.words.length;
}
console.log(`Total words: ${totalWords}`);

// Now merge into vocabulary-db.json
const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

db.data.high_1 = days;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('\nSuccessfully wrote high_1 data to vocabulary-db.json');
