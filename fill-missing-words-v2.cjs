const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function createWord(id, word, meaning, pronunciation, ex1, tr1, ex2, tr2, synonyms, antonyms) {
    return {
        id, word, meaning, pronunciation,
        examples: [
            { sentence: ex1, translation: tr1 },
            { sentence: ex2, translation: tr2 }
        ],
        synonyms: synonyms || [],
        antonyms: antonyms || []
    };
}

const additions = {
    high: {
        4: [
            createWord("h04-01", "Acquire", "취득하다, 배우다", "/əˈkwaɪər/", "The company acquired a smaller rival.", "그 회사는 더 작은 경쟁사를 인수했다.", "He acquired a taste for spicy food.", "그는 매운 음식에 맛을 들였다.", ["obtain", "gain"], ["lose", "forfeit"]),
            createWord("h04-02", "Constitute", "구성하다, ~이 되다", "/ˈkɒnstɪtjuːt/", "Twelve months constitute a year.", "12개월이 1년을 구성한다.", "This act constitutes a serious crime.", "이 행위는 심각한 범죄가 된다.", ["compose", "form"], []),
            createWord("h04-03", "Expose", "노출시키다, 드러내다", "/ɪkˈspoʊz/", "Don't expose your skin to direct sunlight for too long.", "피부를 직사광선에 너무 오래 노출시키지 마세요.", "The report exposed the corruption in the government.", "그 보고서는 정부의 부패를 폭로했다.", ["reveal", "uncover"], ["hide", "cover"]),
            createWord("h04-04", "Indicate", "나타내다, 가리키다", "/ˈɪndɪkeɪt/", "Research indicates that exercise improves brain function.", "연구는 운동이 뇌 기능을 향상시킨다는 점을 나타낸다.", "He indicated the direction with his hand.", "그는 손으로 방향을 가리켰다.", ["show", "suggest"], []),
            createWord("h04-05", "Mechanism", "기제, 구조", "/ˈmekənɪzəm/", "The clock's mechanism is very delicate.", "시계의 기계 장치는 매우 정교하다.", "The body has a mechanism to fight infections.", "신체는 감염과 싸우는 기제를 가지고 있다.", ["mechanism", "system"], []),
            createWord("h04-06", "Objective", "객관적인, 목표", "/əbˈdʒektɪv/", "We need an objective opinion.", "우리는 객관적인 의견이 필요하다.", "The main objective of the plan is to save money.", "그 계획의 주요 목표는 돈을 아끼는 것이다.", ["impartial", "goal"], ["subjective", "biased"]),
            createWord("h04-07", "Precise", "정확한, 정밀한", "/prɪˈsaɪs/", "The measurements must be precise.", "측정값은 정확해야 한다.", "Can you be more precise about the location?", "위치에 대해 좀 더 정확하게 말해줄 수 있니?", ["exact", "accurate"], ["vague", "imprecise"]),
            createWord("h04-08", "Relevant", "관련된, 적절한", "/ˈreləvənt/", "Please provide all relevant documents.", "모든 관련 서류를 제출해 주세요.", "The topic is not relevant to our discussion.", "그 주제는 우리 토론과 관련이 없다.", ["related", "applicable"], ["irrelevant"]),
            createWord("h04-09", "Specific", "특정한, 구체적인", "/spəˈsɪfɪk/", "Do you have a specific time in mind?", "염두에 둔 특정한 시간이 있나요?", "You need to be more specific in your request.", "요청하실 때 좀 더 구체적이어야 합니다.", ["particular", "definite"], ["general", "vague"]),
            createWord("h04-10", "Utility", "유용성, 공익사업", "/juːˈtɪləti/", "The utility of this tool is limited.", "이 도구의 유용성은 제한적이다.", "Gas and water are essential utilities.", "가스와 수도는 필수 공공서비스이다.", ["usefulness", "service"], [])
        ]
    },
    advanced: {
        4: [
            createWord("a04-01", "Abstain", "기권하다, 자제하다", "/əbˈsteɪn/", "He decided to abstain from voting.", "그는 투표에서 기권하기로 결정했다.", "You should abstain from alcohol for a few days.", "며칠 동안 술을 자제해야 합니다.", ["refrain", "desist"], ["indulge"]),
            createWord("a04-02", "Capricious", "변덕스러운", "/kəˈprɪʃəs/", "The weather in this region is very capricious.", "이 지역의 날씨는 매우 변덕스럽다.", "She is known for her capricious behavior.", "그녀는 변덕스러운 행동으로 알려져 있다.", ["fickle", "volatile"], ["steady", "consistent"]),
            createWord("a04-03", "Dichotomy", "이분법", "/daɪˈkɒtəmi/", "There is a strict dichotomy between right and wrong in his mind.", "그의 마음속에는 옳고 그름 사이의 엄격한 이분법이 있다.", "The book explores the dichotomy between nature and nurture.", "그 책은 천성과 양육 사이의 이분법을 탐구한다.", ["division", "split"], []),
            createWord("a04-04", "Exacerbate", "악화시키다", "/ɪɡˈzæsərbeɪt/", "Scratching will only exacerbate the itch.", "긁는 것은 가려움증을 악화시킬 뿐이다.", "The new policy exacerbated the existing tensions.", "새 정책은 기존의 긴장을 악화시켰다.", ["worsen", "aggravate"], ["alleviate", "improve"]),
            createWord("a04-05", "Frugal", "검소한, 절약하는", "/ˈfruːɡl/", "He lives a frugal life to save money.", "그는 돈을 아끼기 위해 검소하게 산다.", "A frugal meal of bread and cheese was served.", "빵과 치즈로 된 소박한 식사가 제공되었다.", ["thrifty", "economical"], ["extravagant", "wasteful"]),
            createWord("a04-06", "Gregarious", "사교적인", "/ɡrɪˈɡeəriəs/", "Dolphins are gregarious animals.", "돌고래는 무리지어 사는 사교적인 동물이다.", "She has a gregarious personality and makes friends easily.", "그녀는 사교적인 성격이라 친구를 쉽게 사귄다.", ["sociable", "outgoing"], ["solitary", "unsociable"]),
            createWord("a04-07", "Hypothetical", "가정의, 가설의", "/ˌhaɪpəˈθetɪkl/", "Let's consider a hypothetical situation.", "가상의 상황을 고려해 봅시다.", "His argument is based on purely hypothetical evidence.", "그의 주장은 순전히 가설적인 증거에 기반하고 있다.", ["theoretical", "supposed"], ["actual", "real"]),
            createWord("a04-08", "Incorrigible", "고집불통의, 구제 불능의", "/ɪnˈkɒrɪdʒəbl/", "He is an incorrigible liar.", "그는 구제 불능의 거짓말쟁이다.", "The boy's behavior was incorrigible.", "그 소년의 행동은 교정할 수 없는 수준이었다.", ["unreformed", "hopeless"], ["repentant", "manageable"]),
            createWord("a04-09", "Loquacious", "수다스러운", "/ləˈkweɪʃəs/", "The loquacious host kept the guests entertained.", "수다스러운 호스트가 손님들을 즐겁게 해주었다.", "She becomes loquacious when she's nervous.", "그녀는 긴장하면 말이 많아진다.", ["talkative", "garrulous"], ["silent", "taciturn"]),
            createWord("a04-10", "Mitigate", "완화시키다", "/ˈmɪtɪɡeɪt/", "The government is taking steps to mitigate the poverty.", "정부는 빈곤을 완화하기 위한 조치를 취하고 있다.", "Regular exercise can mitigate the risks of heart disease.", "규칙적인 운동은 심장 질환의 위험을 완화할 수 있다.", ["alleviate", "lessen"], ["aggravate", "intensify"])
        ]
    }
};

// Apply new words
Object.keys(additions).forEach(level => {
    Object.keys(additions[level]).forEach(day => {
        const dayNum = parseInt(day);
        let dayObj = db.data[level].find(d => d.day === dayNum);
        if (dayObj) {
            dayObj.words = [...dayObj.words, ...additions[level][day]];
        } else {
            db.data[level].push({
                day: dayNum,
                words: additions[level][day]
            });
        }
    });
});

Object.keys(db.data).forEach(level => {
    db.data[level].sort((a, b) => a.day - b.day);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log('Successfully filled High Day 4 and Advanced Day 4 with unique content!');
