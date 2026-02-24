const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'src', 'shared', 'data', 'vocabulary-db.json');

function parseRawData(rawText) {
    const days = [];
    const sections = rawText.split(/=== Day (\d+) ===/);

    for (let i = 1; i < sections.length; i += 2) {
        const dayNum = parseInt(sections[i]);
        const content = sections[i + 1].trim();
        const lines = content.split('\n').filter(line => line.trim().includes('|'));

        const words = lines.map((line, idx) => {
            const parts = line.split('|').map(p => p.trim());
            // 형식: 단어 | 발음 | 뜻 | 유의어 | 반의어 | 예문1(EN) | 예문1(KO) | 예문2(EN) | 예문2(KO)
            const word = parts[0];
            const pronunciation = parts[1] || '';
            const meaning = parts[2] || '';
            const synonyms = parts[3] ? parts[3].split(',').map(s => s.trim()).filter(s => s && s !== '-') : [];
            const antonyms = parts[4] ? parts[4].split(',').map(s => s.trim()).filter(s => s && s !== '-') : [];

            const examples = [];
            if (parts[5] && parts[6]) {
                examples.push({ sentence: parts[5], translation: parts[6] });
            }
            if (parts[7] && parts[8]) {
                examples.push({ sentence: parts[7], translation: parts[8] });
            }

            const id = `c${String(dayNum).padStart(2, '0')}-${String(idx + 1).padStart(3, '0')}`;

            return {
                id,
                word: word.charAt(0).toUpperCase() + word.slice(1),
                meaning,
                pronunciation,
                synonyms,
                antonyms,
                examples,
                category: "csat" // 기본값
            };
        });

        days.push({
            day: dayNum,
            words: words
        });
    }

    return days;
}

function updateDB(newCsatDays) {
    if (!fs.existsSync(DB_PATH)) {
        console.error('DB 파일을 찾을 수 없습니다:', DB_PATH);
        return;
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // 기존 csat 데이터 유지하면서 새로운 데이터로 교체/추가
    const csatMap = new Map();
    (db.data.csat || []).forEach(d => csatMap.set(d.day, d));

    newCsatDays.forEach(d => {
        csatMap.set(d.day, d);
    });

    // Day 순서대로 정렬
    db.data.csat = Array.from(csatMap.values()).sort((a, b) => a.day - b.day);

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log(`성공: CSAT 데이터 ${newCsatDays.length}일분 업데이트 완료.`);
}

// 명령행 인자로 원본 파일 경로를 받아서 처리할 수 있게 함
const rawFilePath = process.argv[2];
if (rawFilePath) {
    const rawText = fs.readFileSync(rawFilePath, 'utf8');
    const parsed = parseRawData(rawText);
    updateDB(parsed);
} else {
    console.log('사용법: node scripts/recover-csat-full.cjs <raw_data_file>');
}
