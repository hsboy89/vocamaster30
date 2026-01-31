import { readFile, writeFile } from 'fs/promises';

const dbPath = 'd:/SideProject/vocamaster30/src/data/vocabulary-db.json';

const improvedDay1Middle = [
    {
        "id": "m01-01",
        "word": "Achievement",
        "meaning": "성취",
        "pronunciation": "/əˈtʃiːvmənt/",
        "examples": [
            { "sentence": "Winning the prize was a great achievement.", "translation": "그 상을 받은 것은 정말 위대한 성취였습니다." },
            { "sentence": "She felt a sense of achievement after finishing the project.", "translation": "그녀는 프로젝트를 마친 후 성취감을 느꼈습니다." }
        ],
        "synonyms": ["success", "attainment"],
        "antonyms": ["failure"]
    },
    {
        "id": "m01-02",
        "word": "Benefit",
        "meaning": "이익, 혜택",
        "pronunciation": "/ˈbenɪfɪt/",
        "examples": [
            { "sentence": "There are many health benefits of eating vegetables.", "translation": "채소를 먹는 것에는 많은 건강상의 이점이 있습니다." },
            { "sentence": "The new law will benefit many people.", "translation": "이 새로운 법은 많은 사람들에게 혜택을 줄 것입니다." }
        ],
        "synonyms": ["advantage", "profit"],
        "antonyms": ["disadvantage", "harm"]
    },
    {
        "id": "m01-03",
        "word": "Celebrate",
        "meaning": "축하하다",
        "pronunciation": "/ˈselɪbreɪt/",
        "examples": [
            { "sentence": "They held a party to celebrate their anniversary.", "translation": "그들은 기념일을 축하하기 위해 파티를 열었습니다." },
            { "sentence": "How do you plan to celebrate your birthday?", "translation": "생일을 어떻게 축하할 계획인가요?" }
        ],
        "synonyms": ["rejoice", "commemorate"],
        "antonyms": ["mourn"]
    },
    {
        "id": "m01-04",
        "word": "Deliver",
        "meaning": "배달하다",
        "pronunciation": "/dɪˈlɪvər/",
        "examples": [
            { "sentence": "The package was delivered this morning.", "translation": "그 택배는 오늘 아침에 배달되었습니다." },
            { "sentence": "Does this store deliver on Sundays?", "translation": "이 가게는 일요일에도 배달을 하나요?" }
        ],
        "synonyms": ["transport", "hand over"],
        "antonyms": ["receive", "keep"]
    },
    {
        "id": "m01-05",
        "word": "Establish",
        "meaning": "설립하다",
        "pronunciation": "/ɪˈstæblɪʃ/",
        "examples": [
            { "sentence": "The company was established in 1995.", "translation": "그 회사는 1995년에 설립되었습니다." },
            { "sentence": "He worked hard to establish his own law firm.", "translation": "그는 자신의 법률 사무소를 설립하기 위해 열심히 일했습니다." }
        ],
        "synonyms": ["found", "set up"],
        "antonyms": ["destroy", "abolish"]
    },
    {
        "id": "m01-06",
        "word": "Flexible",
        "meaning": "유연한",
        "pronunciation": "/ˈfleksəbl/",
        "examples": [
            { "sentence": "A rubber band is very flexible.", "translation": "고무줄은 매우 유연합니다." },
            { "sentence": "My working hours are quite flexible.", "translation": "제 근무 시간은 꽤 유연한 편입니다." }
        ],
        "synonyms": ["elastic", "adaptable"],
        "antonyms": ["rigid", "stiff"]
    },
    {
        "id": "m01-07",
        "word": "Generate",
        "meaning": "발생시키다",
        "pronunciation": "/ˈdʒenəreɪt/",
        "examples": [
            { "sentence": "The wind turbines generate clean electricity.", "translation": "풍력 터빈은 깨끗한 전기를 생산합니다." },
            { "sentence": "The advertisement generated a lot of interest.", "translation": "그 광고는 많은 관심을 불러일으켰습니다." }
        ],
        "synonyms": ["produce", "create"],
        "antonyms": ["consume", "destroy"]
    },
    {
        "id": "m01-08",
        "word": "Knowledge",
        "meaning": "지식",
        "pronunciation": "/ˈnɒlɪdʒ/",
        "examples": [
            { "sentence": "She has extensive knowledge of world history.", "translation": "그녀는 세계사에 대해 해박한 지식을 가지고 있습니다." },
            { "sentence": "Reading books is a great way to gain knowledge.", "translation": "독서는 지식을 얻는 좋은 방법입니다." }
        ],
        "synonyms": ["understanding", "wisdom"],
        "antonyms": ["ignorance"]
    },
    {
        "id": "m01-09",
        "word": "Maximize",
        "meaning": "최대화하다",
        "pronunciation": "/ˈmæksɪmaɪz/",
        "examples": [
            { "sentence": "We need to maximize our resources.", "translation": "우리는 자원을 최대화해야 합니다." },
            { "sentence": "The goal is to maximize the speed of the software.", "translation": "목표는 소프트웨어의 속도를 최대화하는 것입니다." }
        ],
        "synonyms": ["increase", "optimize"],
        "antonyms": ["minimize"]
    },
    {
        "id": "m01-10",
        "word": "Natural",
        "meaning": "자연스러운, 타고난",
        "pronunciation": "/ˈnætʃrəl/",
        "examples": [
            { "sentence": "It is natural for parents to love their children.", "translation": "부모가 자녀를 사랑하는 것은 자연스러운 일입니다." },
            { "sentence": "She is a natural actress.", "translation": "그녀는 타고난 배우입니다." }
        ],
        "synonyms": ["normal", "innate"],
        "antonyms": ["artificial", "unnatural"]
    }
];

async function update() {
    const data = await readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    // Update Middle School Day 1
    const day1Middle = db.data.middle.find(d => d.day === 1);
    if (day1Middle) {
        day1Middle.words = improvedDay1Middle;
    }

    await writeFile(dbPath, JSON.stringify(db, null, 4), 'utf8');
    console.log('Update complete!');
}

update();
