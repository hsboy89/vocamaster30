import { readFile, writeFile } from 'fs/promises';

const dbPath = 'd:/SideProject/vocamaster30/src/data/vocabulary-db.json';

const overrides = {
    middle: {
        1: [
            { "id": "m01-01", "word": "Achievement", "meaning": "성취", "pronunciation": "/əˈtʃiːvmənt/", "examples": [{ "sentence": "Winning the prize was a great achievement.", "translation": "그 상을 받은 것은 정말 위대한 성취였습니다." }, { "sentence": "She felt a sense of achievement after finishing the project.", "translation": "그녀는 프로젝트를 마친 후 성취감을 느꼈습니다." }], "synonyms": ["success"], "antonyms": ["failure"] },
            { "id": "m01-02", "word": "Benefit", "meaning": "이익, 혜택", "pronunciation": "/ˈbenɪfɪt/", "examples": [{ "sentence": "There are many health benefits of eating vegetables.", "translation": "채소를 먹는 것에는 많은 건강상의 이점이 있습니다." }, { "sentence": "The new law will benefit many people.", "translation": "이 새로운 법은 많은 사람들에게 혜택을 줄 것입니다." }], "synonyms": ["advantage"], "antonyms": ["harm"] },
            { "id": "m01-03", "word": "Celebrate", "meaning": "축하하다", "pronunciation": "/ˈselɪbreɪt/", "examples": [{ "sentence": "They held a party to celebrate their anniversary.", "translation": "그들은 기념일을 축하하기 위해 파티를 열었습니다." }, { "sentence": "How do you plan to celebrate your birthday?", "translation": "생일을 어떻게 축하할 계획인가요?" }], "synonyms": ["rejoice"], "antonyms": ["mourn"] },
            { "id": "m01-04", "word": "Deliver", "meaning": "배달하다", "pronunciation": "/dɪˈlɪvər/", "examples": [{ "sentence": "The package was delivered this morning.", "translation": "그 택배는 오늘 아침에 배달되었습니다." }, { "sentence": "Does this store deliver on Sundays?", "translation": "이 가게는 일요일에도 배달을 하나요?" }], "synonyms": ["transport"], "antonyms": ["keep"] },
            { "id": "m01-05", "word": "Establish", "meaning": "설립하다", "pronunciation": "/ɪˈstæblɪʃ/", "examples": [{ "sentence": "The company was established in 1995.", "translation": "그 회사는 1995년에 설립되었습니다." }, { "sentence": "He worked hard to establish his own law firm.", "translation": "그는 자신의 법률 사무소를 설립하기 위해 열심히 일했습니다." }], "synonyms": ["found"], "antonyms": ["destroy"] },
            { "id": "m01-06", "word": "Flexible", "meaning": "유연한", "pronunciation": "/ˈfleksəbl/", "examples": [{ "sentence": "A rubber band is very flexible.", "translation": "고무줄은 매우 유연합니다." }, { "sentence": "My working hours are quite flexible.", "translation": "제 근무 시간은 꽤 유연한 편입니다." }], "synonyms": ["elastic"], "antonyms": ["rigid"] },
            { "id": "m01-07", "word": "Generate", "meaning": "발생시키다", "pronunciation": "/ˈdʒenəreɪt/", "examples": [{ "sentence": "The wind turbines generate clean electricity.", "translation": "풍력 터빈은 깨끗한 전기를 생산합니다." }, { "sentence": "The advertisement generated a lot of interest.", "translation": "그 광고는 많은 관심을 불러일으켰습니다." }], "synonyms": ["produce"], "antonyms": ["consume"] },
            { "id": "m01-08", "word": "Knowledge", "meaning": "지식", "pronunciation": "/ˈnɒlɪdʒ/", "examples": [{ "sentence": "She has extensive knowledge of world history.", "translation": "그녀는 세계사에 대해 해박한 지식을 가지고 있습니다." }, { "sentence": "Reading books is a great way to gain knowledge.", "translation": "독서는 지식을 얻는 좋은 방법입니다." }], "synonyms": ["understanding"], "antonyms": ["ignorance"] },
            { "id": "m01-09", "word": "Maximize", "meaning": "최대화하다", "pronunciation": "/ˈmæksɪmaɪz/", "examples": [{ "sentence": "We need to maximize our resources.", "translation": "우리는 자원을 최대화해야 합니다." }, { "sentence": "The goal is to maximize the speed of the software.", "translation": "목표는 소프트웨어의 속도를 최대화하는 것입니다." }], "synonyms": ["increase"], "antonyms": ["minimize"] },
            { "id": "m01-10", "word": "Natural", "meaning": "자연스러운", "pronunciation": "/ˈnætʃrəl/", "examples": [{ "sentence": "It is natural for parents to love their children.", "translation": "부모가 자녀를 사랑하는 것은 자연스러운 일입니다." }, { "sentence": "She is a natural actress.", "translation": "그녀는 타고난 배우입니다." }], "synonyms": ["normal"], "antonyms": ["artificial"] }
        ],
        2: [
            { "id": "m02-01", "word": "Observe", "meaning": "관찰하다", "pronunciation": "/əbˈzɜːrv/", "examples": [{ "sentence": "Scientists observe the behavior of animals.", "translation": "과학자들은 동물의 행동을 관찰합니다." }, { "sentence": "Please observe the rules of the library.", "translation": "도서관의 규칙을 준수해 주세요." }], "synonyms": ["watch"], "antonyms": ["ignore"] },
            { "id": "m02-02", "word": "Participate", "meaning": "참여하다", "pronunciation": "/pɑːrˈtɪsɪpeɪt/", "examples": [{ "sentence": "Everyone should participate in the meeting.", "translation": "모두가 회의에 참여해야 합니다." }, { "sentence": "She likes to participate in school activities.", "translation": "그녀는 학교 활동에 참여하는 것을 좋아합니다." }], "synonyms": ["join"], "antonyms": ["withdraw"] },
            { "id": "m02-03", "word": "Quality", "meaning": "품질", "pronunciation": "/ˈkwɑːləti/", "examples": [{ "sentence": "This product is made of high quality materials.", "translation": "이 제품은 고품질의 재료로 만들어졌습니다." }, { "sentence": "We focus on the quality of our service.", "translation": "우리는 서비스의 품질에 집중합니다." }], "synonyms": ["standard"], "antonyms": ["inferiority"] },
            { "id": "m02-04", "word": "Resource", "meaning": "자원", "pronunciation": "/ˈriːsɔːrs/", "examples": [{ "sentence": "Water is a precious natural resource.", "translation": "물은 소중한 천연 자원입니다." }, { "sentence": "The internet is a great resource for learning.", "translation": "인터넷은 학습을 위한 훌륭한 자원입니다." }], "synonyms": ["asset"], "antonyms": ["drain"] },
            { "id": "m02-05", "word": "Structure", "meaning": "구조", "pronunciation": "/ˈstrʌktʃər/", "examples": [{ "sentence": "The structure of the building is very strong.", "translation": "건물의 구조가 매우 튼튼합니다." }, { "sentence": "We need to understand the structure of the atom.", "translation": "우리는 원자의 구조를 이해해야 합니다." }], "synonyms": ["organization"], "antonyms": ["disorder"] }
        ]
    },
    high: {
        1: [
            { "id": "h01-01", "word": "Abandon", "meaning": "버리다, 포기하다", "pronunciation": "/əˈbændən/", "examples": [{ "sentence": "The sailors had to abandon the sinking ship.", "translation": "선원들은 가라앉는 배를 버려야 했습니다." }, { "sentence": "He decided to abandon his plan.", "translation": "그는 자신의 계획을 포기하기로 결정했습니다." }], "synonyms": ["desert"], "antonyms": ["remain"] },
            { "id": "h01-02", "word": "Bargain", "meaning": "흥정하다, 싼 물건", "pronunciation": "/ˈbɑːrɡən/", "examples": [{ "sentence": "She managed to bargain for a lower price.", "translation": "그녀는 더 낮은 가격을 위해 흥정하는 데 성공했습니다." }, { "sentence": "This shirt was a real bargain.", "translation": "이 셔츠는 정말 싸게 잘 샀어요." }], "synonyms": ["negotiate"], "antonyms": ["rip-off"] }
        ]
    },
    advanced: {
        1: [
            { "id": "a01-01", "word": "Aesthetic", "meaning": "심미적인", "pronunciation": "/esˈθetɪk/", "examples": [{ "sentence": "The building has a unique aesthetic appeal.", "translation": "그 건물은 독특한 심미적 매력을 가지고 있습니다." }, { "sentence": "She considers the aesthetic value of the art.", "translation": "그녀는 예술의 미적 가치를 고려합니다." }], "synonyms": ["artistic"], "antonyms": ["unattractive"] },
            { "id": "a01-02", "word": "Benevolent", "meaning": "자애로운", "pronunciation": "/bəˈnevələnt/", "examples": [{ "sentence": "The benevolent leader donated money to the poor.", "translation": "자애로운 지도자는 가난한 사람들에게 돈을 기부했습니다." }, { "sentence": "His benevolent smile made everyone feel safe.", "translation": "그의 자애로운 미소는 모두를 안전하게 느끼게 했습니다." }], "synonyms": ["kind"], "antonyms": ["malevolent"] }
        ]
    }
};

async function update() {
    const data = await readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    const levels = ['middle', 'high', 'advanced'];

    levels.forEach(level => {
        if (db.data[level] && overrides[level]) {
            db.data[level].forEach(day => {
                if (overrides[level][day.day]) {
                    // Replace or update words for the day
                    const overrideWords = overrides[level][day.day];
                    day.words = day.words.map(originalWord => {
                        const override = overrideWords.find(o => o.id === originalWord.id || o.word === originalWord.word);
                        return override || originalWord;
                    });
                }

                // For words that still have placeholder translations, improve them slightly
                day.words.forEach(word => {
                    if (word.examples) {
                        word.examples.forEach((ex, idx) => {
                            if (ex.translation.includes('와 관련된 예문입니다') || ex.translation.includes('또 다른 예문입니다')) {
                                // Try to provide a more natural generic if specific isn't available
                                if (idx === 0) {
                                    ex.translation = `[예문 1] ${word.meaning}의 실제 사용 예시입니다.`;
                                } else {
                                    ex.translation = `[예문 2] ${word.word}를 사용한 또 다른 문장입니다.`;
                                }
                            }
                        });
                    }
                });
            });
        }
    });

    await writeFile(dbPath, JSON.stringify(db, null, 4), 'utf8');
    console.log('Update complete!');
}

update();
