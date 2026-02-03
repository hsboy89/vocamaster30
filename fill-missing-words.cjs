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

const levelAdditions = {
    middle: {
        7: [
            createWord("m07-01", "Kindness", "친절, 다정함", "/ˈkaɪndnəs/", "Thank you for your kindness.", "친절에 감사드립니다.", "A small act of kindness can change someone's day.", "작은 친절이 누군가의 하루를 바꿀 수 있다.", ["generosity", "benevolence"], ["cruelty"]),
            createWord("m07-02", "Magic", "마법", "/ˈmædʒɪk/", "The magician performed some amazing magic.", "마술사가 몇 가지 놀라운 마술을 선보였다.", "There's a touch of magic in the air tonight.", "오늘 밤 공기 중에 마법 같은 기운이 있다.", ["sorcery", "wizardry"], []),
            createWord("m07-03", "Nation", "국가, 국민", "/ˈneɪʃn/", "The whole nation celebrated the independence day.", "온 나라가 독립기념일을 축하했다.", "Leaders from many nations gathered for the summit.", "많은 나라의 지도자들이 정상회담을 위해 모였다.", ["country", "state"], []),
            createWord("m07-04", "Object", "물체, 대상", "/ˈɒbdʒɪkt/", "There was a strange object in the sky.", "하늘에 이상한 물체가 있었다.", "The object of the game is to score points.", "이 게임의 목적은 점수를 내는 것이다.", ["item", "target"], []),
            createWord("m07-05", "Peace", "평화", "/piːs/", "We all hope for world peace.", "우리 모두는 세계 평화를 희망한다.", "I enjoy the peace and quiet of the countryside.", "나는 시골의 평화와 정적을 즐긴다.", ["tranquility", "calm"], ["war", "conflict"]),
            createWord("m07-06", "Quiet", "조용한", "/ˈkwaɪət/", "Please be quiet in the library.", "도서관에서는 조용히 해주세요.", "It was a quiet evening at home.", "집에서의 조용한 저녁이었다.", ["silent", "still"], ["noisy", "loud"]),
            createWord("m07-07", "Respect", "존중, 존경하다", "/rɪˈspekt/", "We must show respect for our elders.", "우리는 어른들에 대한 존중을 보여야 한다.", "I respect your decision.", "나는 당신의 결정을 존중한다.", ["esteem", "honor"], ["disrespect", "scorn"]),
            createWord("m07-08", "Support", "지원, 지지하다", "/səˈpɔːrt/", "My family supported me during the difficult times.", "우리 가족은 힘들 때 나를 지원해주었다.", "The bridge is supported by steel cables.", "그 다리는 강철 케이블로 지탱된다.", ["help", "assist"], ["oppose", "hinder"]),
            createWord("m07-09", "Traffic", "교통", "/ˈtræfɪk/", "There was heavy traffic on the highway.", "고속도로에 교통 체증이 심했다.", "Air traffic controllers direct the planes.", "항공 교통 관제사들이 비행기를 안내한다.", ["vehicles", "transport"], []),
            createWord("m07-10", "Village", "마을", "/ˈvɪlɪdʒ/", "He grew up in a small mountain village.", "그는 작은 산골 마을에서 자랐다.", "The village is known for its beautiful scenery.", "그 마을은 아름다운 경치로 유명하다.", ["hamlet", "town"], ["city"])
        ]
    },
    high: {
        3: [
            createWord("h03-01", "Accurate", "정확한", "/ˈækjərət/", "Is this clock accurate?", "이 시계는 정확한가요?", "The journalist provided an accurate report of the event.", "기자는 사건에 대해 정확한 보도를 제공했다.", ["precise", "exact"], ["inaccurate", "wrong"]),
            createWord("h03-02", "Brief", "잠시의, 간결한", "/briːf/", "It was a brief meeting.", "그것은 짧은 회의였다.", "Can you give me a brief summary?", "내게 간결한 요약을 해줄 수 있니?", ["short", "concise"], ["long", "lengthy"]),
            createWord("h03-03", "Component", "구성 요소", "/kəmˈpoʊnənt/", "Nitrogen is a key component of the air.", "질소는 공기의 핵심 구성 요소이다.", "The computer consists of many complex components.", "컴퓨터는 많은 복잡한 부품들로 구성되어 있다.", ["element", "part"], ["whole"]),
            createWord("h03-04", "Distribute", "배포하다, 유통시키다", "/dɪˈstrɪbjuːt/", "They distributed food to the refugees.", "그들은 난민들에게 음식을 나누어 주었다.", "The company distributes its products worldwide.", "그 회사는 제품을 전 세계에 유통시킨다.", ["disperse", "allocate"], ["collect", "gather"]),
            createWord("h03-05", "Emphasize", "강조하다", "/ˈemfəsaɪz/", "The teacher emphasized the importance of hard work.", "선생님은 노력의 중요성을 강조하셨다.", "Her dress emphasized her slim figure.", "그녀의 드레스는 날씬한 몸매를 강조해 주었다.", ["stress", "highlight"], ["understate", "ignore"]),
            createWord("h03-06", "Feature", "특징, 기능", "/ˈfiːtʃər/", "The new phone has many advanced features.", "새 휴대폰은 많은 고급 기능들을 가지고 있다.", "A lake is a major feature of the park.", "호수는 그 공원의 주요 특징이다.", ["characteristic", "attribute"], []),
            createWord("h03-07", "Global", "세계적인, 지구의", "/ˈɡloʊbl/", "Climate change is a global problem.", "기후 변화는 세계적인 문제이다.", "We live in a global economy.", "우리는 글로벌 경제 시대에 살고 있다.", ["worldwide", "international"], ["local", "regional"]),
            createWord("h03-08", "Hygiene", "위생", "/ˈhaɪdʒiːn/", "Good personal hygiene is essential for health.", "좋은 개인 위생은 건강에 필수적이다.", "Hospital hygiene must be strictly maintained.", "병원의 위생은 엄격하게 유지되어야 한다.", ["cleanliness", "sanitation"], ["filth", "dirt"]),
            createWord("h03-09", "Internal", "내부의", "/ɪnˈtɜːrnl/", "The computer has an internal hard drive.", "컴퓨터에는 내장 하드 드라이브가 있다.", "Peace of mind is more important than internal beauty.", "마음의 평화는 내면의 아름다움보다 더 중요하다.", ["inner", "inside"], ["external", "outer"]),
            createWord("h03-10", "Logical", "논리적인", "/ˈlɒdʒɪkl/", "The conclusion was logical based on the evidence.", "증거에 기반한 그 결론은 논리적이었다.", "She gave a logical explanation for her absence.", "그녀는 결석에 대해 논리적인 설명을 했다.", ["rational", "reasonable"], ["illogical", "irrational"])
        ]
    },
    advanced: {
        3: [
            createWord("a03-01", "Acquire", "습득하다, 얻다", "/əˈkwaɪər/", "She acquired a large fortune from her uncle.", "그녀는 삼촌으로부터 많은 재산을 물려받았다.", "It takes time to acquire a native-like accent.", "원어민 같은 억양을 습득하는 데는 시간이 걸린다.", ["gain", "obtain"], ["lose", "forfeit"]),
            createWord("a03-02", "Belligerent", "호전적인", "/bəˈlɪdʒərənt/", "He was fired for his belligerent attitude toward customers.", "그는 고객에 대한 호전적인 태도 때문에 해고되었다.", "The belligerent nations finally signed a peace treaty.", "교전 중인 국가들은 마침내 평화 조약에 서명했다.", ["aggressive", "hostile"], ["peaceable", "friendly"]),
            createWord("a03-03", "Conspicuous", "눈에 잘 띄는", "/kənˈspɪkjuəs/", "The bird has a conspicuous red head.", "그 새는 눈에 띄는 빨간 머리를 가지고 있다.", "He felt conspicuous in his bright green suit.", "그는 밝은 초록색 정장을 입고 눈에 띈다고 느꼈다.", ["noticeable", "obvious"], ["inconspicuous", "unnoticeable"]),
            createWord("a03-04", "Deleterious", "유해한", "/ˌdelɪˈtɪəriəs/", "Smoking has deleterious effects on health.", "흡연은 건강에 해로운 영향을 미친다.", "The chemical has a deleterious impact on the environment.", "그 화학 물질은 환경에 유해한 영향을 준다.", ["harmful", "detrimental"], ["beneficial", "helpful"]),
            createWord("a03-05", "Ephemeral", "수명이 짧은, 덧없는", "/ɪˈfemərəl/", "Fame is often ephemeral.", "명성은 흔히 덧없다.", "The beauty of a sunset is ephemeral.", "일몰의 아름다움은 일시적이다.", ["transitory", "fleeting"], ["permanent", "eternal"]),
            createWord("a03-06", "Fastidious", "세심한, 까다로운", "/fæˈstɪdiəs/", "She is very fastidious about her appearance.", "그녀는 외모에 대해 매우 세심하다.", "He is a fastidious worker who never makes mistakes.", "그는 절대 실수를 하지 않는 꼼꼼한 직원이다.", ["meticulous", "exacting"], ["careless", "lax"]),
            createWord("a03-07", "Garrulous", "말이 많은", "/ˈɡærələs/", "The garrulous neighbor kept talking for hours.", "수다스러운 이웃은 몇 시간 동안 계속 말을 했다.", "He became garrulous after drinking a few glasses of wine.", "그는 와인 몇 잔을 마신 뒤 수다스러워졌다.", ["talkative", "loquacious"], ["laconic", "reticent"]),
            createWord("a03-08", "Hierarchy", "계급제, 계층", "/ˈhaɪərɑːrki/", "The company has a rigid hierarchy.", "그 회사는 엄격한 위계 질서를 가지고 있다.", "There is a hierarchy of needs in human psychology.", "인간 심리학에는 욕구의 위계가 있다.", ["ranking", "order"], []),
            createWord("a03-09", "Inevitable", "피할 수 없는", "/ɪnˈevɪtəbl/", "Change is an inevitable part of life.", "변화는 삶의 피할 수 없는 부분이다.", "The conflict was inevitable given their differences.", "그들의 차이를 고려할 때 갈등은 피할 수 없었다.", ["unavoidable", "certain"], ["preventable", "avoidable"]),
            createWord("a03-10", "Juxtapose", "병치하다 (대조를 위해 옆에 놓다)", "/ˌdʒʌkstəˈpoʊz/", "The exhibition juxtaposes the work of two very different artists.", "그 전시회는 매우 다른 두 예술가의 작품을 나란히 놓는다.", "Dreams often juxtapose unrelated images.", "꿈은 흔히 관련 없는 이미지들을 병치시킨다.", ["collocate", "compare"], [])
        ]
    }
};

// Apply new words
Object.keys(levelAdditions).forEach(level => {
    Object.keys(levelAdditions[level]).forEach(day => {
        const dayNum = parseInt(day);
        let dayObj = db.data[level].find(d => d.day === dayNum);
        if (dayObj) {
            dayObj.words = [...dayObj.words, ...levelAdditions[level][day]];
        } else {
            db.data[level].push({
                day: dayNum,
                words: levelAdditions[level][day]
            });
        }
    });
});

// Sort days to be sure
Object.keys(db.data).forEach(level => {
    db.data[level].sort((a, b) => a.day - b.day);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log('Successfully added more unique words for Middle Day 7, High Day 3, and Advanced Day 3!');
