/**
 * Build vocabulary JSON from individual level word files.
 * Usage: node scripts/build-vocab.cjs
 * 
 * This script reads words-middle.cjs, words-high.cjs, words-advanced.cjs
 * and produces vocabulary-db.json
 */
const fs = require('fs');
const path = require('path');

const CATEGORIES = ['society', 'economy', 'nature', 'science', 'culture', 'education', 'health', 'global'];
const TEMPLATES = {
    society: ["The concept of {w} is important in modern society.", "We discussed {w} in our social studies class."],
    economy: ["{w} plays a key role in the economy.", "Understanding {w} is essential for business."],
    nature: ["{w} is closely related to the environment.", "Scientists study {w} to understand nature better."],
    science: ["The research on {w} led to new discoveries.", "{w} is an important concept in science."],
    culture: ["{w} reflects the cultural values of the community.", "We learned about {w} during the cultural festival."],
    education: ["{w} is fundamental to quality education.", "Students need to understand {w} for academic success."],
    health: ["{w} is essential for maintaining good health.", "Doctors recommend understanding {w} for better wellness."],
    global: ["{w} is a critical issue in international relations.", "The concept of {w} shapes global politics."],
};
const KO_TEMPLATES = {
    society: ["{m}의 개념은 현대 사회에서 중요하다.", "우리는 사회 수업에서 {m}에 대해 토론했다."],
    economy: ["{m}은(는) 경제에서 핵심적인 역할을 한다.", "{m}을(를) 이해하는 것은 사업에 필수적이다."],
    nature: ["{m}은(는) 환경과 밀접하게 관련되어 있다.", "과학자들은 자연을 더 잘 이해하기 위해 {m}을(를) 연구한다."],
    science: ["{m}에 대한 연구가 새로운 발견으로 이어졌다.", "{m}은(는) 과학에서 중요한 개념이다."],
    culture: ["{m}은(는) 공동체의 문화적 가치를 반영한다.", "우리는 문화 축제 동안 {m}에 대해 배웠다."],
    education: ["{m}은(는) 양질의 교육에 기본적이다.", "학생들은 학업 성공을 위해 {m}을(를) 이해해야 한다."],
    health: ["{m}은(는) 건강을 유지하는 데 필수적이다.", "의사들은 더 나은 건강을 위해 {m}을(를) 이해할 것을 권장한다."],
    global: ["{m}은(는) 국제 관계에서 중요한 문제이다.", "{m}의 개념이 세계 정치를 형성한다."],
};

function parseEntry(entry, cat, prefix, idx) {
    const p = entry.split('|');
    const word = p[0].trim();
    const meaning = p[1] ? p[1].trim() : '';
    const pron = p[2] ? p[2].trim() : '';
    const syns = p[3] ? p[3].split(',').map(s => s.trim()).filter(Boolean) : [];
    const ants = p[4] ? p[4].split(',').map(s => s.trim()).filter(Boolean) : [];
    const tEn = TEMPLATES[cat] || TEMPLATES.society;
    const tKo = KO_TEMPLATES[cat] || KO_TEMPLATES.society;
    const m0 = meaning.split(',')[0].trim();
    return {
        id: '', word: word.charAt(0).toUpperCase() + word.slice(1),
        meaning, pronunciation: pron, synonyms: syns, antonyms: ants, category: cat,
        examples: [{ sentence: tEn[0].replace(/\{w\}/g, word.toLowerCase()), translation: tKo[0].replace(/\{m\}/g, m0) },
        { sentence: tEn[1].replace(/\{w\}/g, word.toLowerCase()), translation: tKo[1].replace(/\{m\}/g, m0) }],
    };
}

function buildLevel(wordsByCat, prefix) {
    const all = [];
    CATEGORIES.forEach(cat => {
        (wordsByCat[cat] || []).forEach(e => all.push({ entry: e, cat }));
    });
    // Seeded shuffle
    let seed = prefix.charCodeAt(0) * 31;
    for (let i = all.length - 1; i > 0; i--) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const j = seed % (i + 1);
        [all[i], all[j]] = [all[j], all[i]];
    }
    const parsed = all.map((item, i) => parseEntry(item.entry, item.cat, prefix, i));
    const days = [], perDay = Math.ceil(parsed.length / 30);
    for (let d = 0; d < 30; d++) {
        const dw = parsed.slice(d * perDay, (d + 1) * perDay);
        dw.forEach((w, i) => { w.id = `${prefix}${String(d + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`; });
        if (dw.length) days.push({ day: d + 1, words: dw });
    }
    return days;
}

function countWords(data) { return Object.values(data).reduce((s, a) => s + a.length, 0); }

function checkDupes(m, h, a) {
    const sets = { m: new Set(), h: new Set(), a: new Set() };
    const levels = { m, h, a };
    const dupes = [];
    for (const [k, wbc] of Object.entries(levels)) {
        for (const [cat, words] of Object.entries(wbc)) {
            for (const e of words) {
                const w = e.split('|')[0].trim().toLowerCase();
                if (sets[k].has(w)) dupes.push(`[${k}/${cat}] 중복: "${w}"`);
                sets[k].add(w);
            }
        }
    }
    for (const w of sets.h) if (sets.m.has(w)) dupes.push(`[m↔h] "${w}"`);
    for (const w of sets.a) {
        if (sets.m.has(w)) dupes.push(`[m↔a] "${w}"`);
        if (sets.h.has(w)) dupes.push(`[h↔a] "${w}"`);
    }
    return dupes;
}

// Load word data - each file exports an object with category keys
let middle, high, advanced;
try { middle = require('./words-middle.cjs'); } catch (e) { console.error('words-middle.cjs 로드 실패:', e.message); process.exit(1); }
try { high = require('./words-high.cjs'); } catch (e) { console.error('words-high.cjs 로드 실패:', e.message); process.exit(1); }
try { advanced = require('./words-advanced.cjs'); } catch (e) { console.error('words-advanced.cjs 로드 실패:', e.message); process.exit(1); }

console.log('📚 단어 데이터 생성 시작...\n');
console.log(`중등: ${countWords(middle)}단어 | 고등: ${countWords(high)}단어 | 수능: ${countWords(advanced)}단어\n`);

const dupes = checkDupes(middle, high, advanced);
if (dupes.length) { console.log(`⚠️ 중복 ${dupes.length}건:\n${dupes.slice(0, 20).join('\n')}\n`); }
else { console.log('✅ 중복 없음!\n'); }

const result = {
    monthly_version: "2026-02",
    data: {
        middle: buildLevel(middle, 'm'),
        high: buildLevel(high, 'h'),
        advanced: buildLevel(advanced, 'a'),
    }
};

const out = path.join(__dirname, '..', 'src', 'shared', 'data', 'vocabulary-db.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2), 'utf-8');

const count = (lvl) => lvl.reduce((s, d) => s + d.words.length, 0);
console.log(`✅ 생성 완료!`);
console.log(`  중등: ${count(result.data.middle)}단어 (${result.data.middle.length}일)`);
console.log(`  고등: ${count(result.data.high)}단어 (${result.data.high.length}일)`);
console.log(`  수능: ${count(result.data.advanced)}단어 (${result.data.advanced.length}일)`);
console.log(`  파일: ${out}`);
