/**
 * Vocabulary Generator Script
 * 
 * 레벨별 1000단어 (8개 분야 × 125단어) → vocabulary-db.json 생성
 * 실행: node scripts/generate-vocab.cjs
 */

const fs = require('fs');
const path = require('path');

// Import word data
const middleWords = require('./words-middle.cjs');
const highWords = require('./words-high.cjs');
const advancedWords = require('./words-advanced.cjs');

// Example sentence templates by category
const TEMPLATES = {
    society: [
        ["The concept of {word} is important in modern society.", "{word}의 개념은 현대 사회에서 중요하다."],
        ["We discussed {word} in our social studies class.", "우리는 사회 수업에서 {word}에 대해 토론했다."],
    ],
    economy: [
        ["{word} plays a key role in the economy.", "{word}은(는) 경제에서 핵심적인 역할을 한다."],
        ["Understanding {word} is essential for business.", "{word}을(를) 이해하는 것은 사업에 필수적이다."],
    ],
    nature: [
        ["{word} is closely related to the environment.", "{word}은(는) 환경과 밀접하게 관련되어 있다."],
        ["Scientists study {word} to understand nature better.", "과학자들은 자연을 더 잘 이해하기 위해 {word}을(를) 연구한다."],
    ],
    science: [
        ["The research on {word} led to new discoveries.", "{word}에 대한 연구가 새로운 발견으로 이어졌다."],
        ["{word} is an important concept in science.", "{word}은(는) 과학에서 중요한 개념이다."],
    ],
    culture: [
        ["{word} reflects the cultural values of the community.", "{word}은(는) 공동체의 문화적 가치를 반영한다."],
        ["We learned about {word} during the cultural festival.", "우리는 문화 축제 동안 {word}에 대해 배웠다."],
    ],
    education: [
        ["{word} is fundamental to quality education.", "{word}은(는) 양질의 교육에 기본적이다."],
        ["Students need to understand {word} for academic success.", "학생들은 학업 성공을 위해 {word}을(를) 이해해야 한다."],
    ],
    health: [
        ["{word} is essential for maintaining good health.", "{word}은(는) 건강을 유지하는 데 필수적이다."],
        ["Doctors recommend understanding {word} for better wellness.", "의사들은 더 나은 건강을 위해 {word}을(를) 이해할 것을 권장한다."],
    ],
    global: [
        ["{word} is a critical issue in international relations.", "{word}은(는) 국제 관계에서 중요한 문제이다."],
        ["The concept of {word} shapes global politics.", "{word}의 개념이 세계 정치를 형성한다."],
    ],
};

/**
 * Parse a compact word entry:
 * "word|meaning|/pronunciation/|synonym1,synonym2|antonym1,antonym2"
 */
function parseWord(entry, category, levelPrefix, index) {
    const parts = entry.split('|');
    const word = parts[0].trim();
    const meaning = parts[1].trim();
    const pronunciation = parts[2] ? parts[2].trim() : '';
    const synonyms = parts[3] ? parts[3].split(',').map(s => s.trim()).filter(Boolean) : [];
    const antonyms = parts[4] ? parts[4].split(',').map(s => s.trim()).filter(Boolean) : [];

    // Generate example sentences
    const templates = TEMPLATES[category] || TEMPLATES.society;
    const examples = templates.map(([en, ko]) => ({
        sentence: en.replace(/\{word\}/g, word.toLowerCase()),
        translation: ko.replace(/\{word\}/g, meaning.split(',')[0].trim()),
    }));

    const dayNum = Math.floor(index / 34) + 1; // ~34 words per day for 1000/30
    const wordIndex = (index % 34) + 1;
    const id = `${levelPrefix}${String(dayNum).padStart(2, '0')}-${String(wordIndex).padStart(3, '0')}`;

    return {
        id,
        word: word.charAt(0).toUpperCase() + word.slice(1),
        meaning,
        pronunciation,
        synonyms,
        antonyms,
        examples,
        category,
    };
}

function generateLevelData(wordsByCategory, levelPrefix) {
    // Flatten all words with category info
    const allWords = [];
    const categories = ['society', 'economy', 'nature', 'science', 'culture', 'education', 'health', 'global'];

    categories.forEach(cat => {
        const words = wordsByCategory[cat] || [];
        words.forEach((entry, idx) => {
            allWords.push({ entry, category: cat, globalIndex: allWords.length });
        });
    });

    // Shuffle words to mix categories across days
    // Use a seeded shuffle for consistency
    const shuffled = [...allWords];
    let seed = levelPrefix.charCodeAt(0);
    for (let i = shuffled.length - 1; i > 0; i--) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const j = seed % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Parse all words
    const parsedWords = shuffled.map((item, idx) =>
        parseWord(item.entry, item.category, levelPrefix, idx)
    );

    // Distribute into 30 days
    const totalDays = 30;
    const wordsPerDay = Math.ceil(parsedWords.length / totalDays);
    const days = [];

    for (let d = 0; d < totalDays; d++) {
        const dayWords = parsedWords.slice(d * wordsPerDay, (d + 1) * wordsPerDay);
        if (dayWords.length > 0) {
            // Re-assign IDs based on actual day
            dayWords.forEach((w, i) => {
                w.id = `${levelPrefix}${String(d + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`;
            });
            days.push({
                day: d + 1,
                words: dayWords,
            });
        }
    }

    return days;
}

// Check for duplicates across all levels
function checkDuplicates(middle, high, advanced) {
    const allSets = { middle: new Set(), high: new Set(), advanced: new Set() };
    const levels = { middle, high, advanced };
    const duplicates = [];

    for (const [levelName, wordsByCategory] of Object.entries(levels)) {
        for (const [cat, words] of Object.entries(wordsByCategory)) {
            for (const entry of words) {
                const word = entry.split('|')[0].trim().toLowerCase();
                if (allSets[levelName].has(word)) {
                    duplicates.push(`[${levelName}/${cat}] 레벨 내 중복: "${word}"`);
                }
                allSets[levelName].add(word);
            }
        }
    }

    // Cross-level duplicates
    const middleWords = allSets.middle;
    const highWords = allSets.high;
    const advancedWords = allSets.advanced;

    for (const w of highWords) {
        if (middleWords.has(w)) duplicates.push(`[middle↔high] 중복: "${w}"`);
    }
    for (const w of advancedWords) {
        if (middleWords.has(w)) duplicates.push(`[middle↔advanced] 중복: "${w}"`);
        if (highWords.has(w)) duplicates.push(`[high↔advanced] 중복: "${w}"`);
    }

    return duplicates;
}

// Main
function main() {
    console.log('📚 단어 데이터 생성 시작...\n');

    // Count words
    const countWords = (data) => Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`중등 필수: ${countWords(middleWords)}단어`);
    console.log(`고등 기초: ${countWords(highWords)}단어`);
    console.log(`수능 심화: ${countWords(advancedWords)}단어`);
    console.log('');

    // Check duplicates
    const dupes = checkDuplicates(middleWords, highWords, advancedWords);
    if (dupes.length > 0) {
        console.log(`⚠️ 중복 발견 (${dupes.length}건):`);
        dupes.forEach(d => console.log(`  - ${d}`));
        console.log('');
    } else {
        console.log('✅ 중복 없음!\n');
    }

    // Generate
    const data = {
        monthly_version: "2026-02",
        data: {
            middle: generateLevelData(middleWords, 'm'),
            high: generateLevelData(highWords, 'h'),
            advanced: generateLevelData(advancedWords, 'a'),
        }
    };

    // Write JSON
    const outputPath = path.join(__dirname, '..', 'src', 'shared', 'data', 'vocabulary-db.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

    // Summary
    const totalMiddle = data.data.middle.reduce((s, d) => s + d.words.length, 0);
    const totalHigh = data.data.high.reduce((s, d) => s + d.words.length, 0);
    const totalAdvanced = data.data.advanced.reduce((s, d) => s + d.words.length, 0);

    console.log(`✅ vocabulary-db.json 생성 완료!`);
    console.log(`   중등: ${totalMiddle}단어 (${data.data.middle.length}일)`);
    console.log(`   고등: ${totalHigh}단어 (${data.data.high.length}일)`);
    console.log(`   수능: ${totalAdvanced}단어 (${data.data.advanced.length}일)`);
    console.log(`   파일: ${outputPath}`);
}

main();
