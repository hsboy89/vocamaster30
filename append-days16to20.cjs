const fs = require('fs');
const path = require('path');

const data = `=== Day 16 ===
mixture | ˈmɪkstʃər | 혼합물, 혼합 | blend, combination | pure substance | The cake is a mixture of flour and sugar. | 케이크는 밀가루와 설탕의 혼합물이다. | Add the mixture slowly. | 혼합물을 천천히 넣어라.
burst | bɜːrst | 터지다, 폭발, 파열 | explode, erupt | hold | The balloon burst. | 풍선이 터졌다. | She burst into laughter. | 웃음을 터뜨렸다.
method | ˈmɛθəd | 방법, 방식 | approach, technique | - | She used a new method. | 새로운 방법을 사용했다. | What is the best method? | 가장 좋은 방법은 무엇인가?
laboratory | ˈlæbrətɔːri | 실험실, 연구소 | lab, research center | - | She works in a laboratory. | 실험실에서 일한다. | The laboratory tests confirmed. | 실험실 테스트가 확인했다.
observation | ˌɑːbzərˈveɪʃən | 관찰, 관측, 소견 | watching, remark | - | Careful observation is important. | 주의 깊은 관찰이 중요하다. | She made an interesting observation. | 흥미로운 소견을 밝혔다.
toxic | ˈtɑːksɪk | 유독한, 해로운 | poisonous, harmful | harmless | Toxic waste pollutes the river. | 유독 폐기물이 강을 오염시킨다. | This chemical is toxic. | 이 화학물질은 유독하다.
vapor | ˈveɪpər | 증기, 수증기 | steam, mist | liquid | Water vapor rises from the lake. | 수증기가 호수에서 올라온다. | The vapor condensed on the glass. | 증기가 유리에 응결되었다.
gas | ɡæs | 기체, 가스, 가솔린 | fuel, fume | solid, liquid | Natural gas is used for heating. | 천연가스가 난방에 사용된다. | The room filled with gas. | 방이 가스로 가득 찼다.
fluid | ˈfluːɪd | 유체, 액체, 유동적인 | liquid, flowing | solid | Drink plenty of fluids. | 충분한 수분을 섭취해라. | The situation is fluid. | 상황이 유동적이다.
liquid | ˈl위드 | 액체, 액체의 | fluid, solution | solid | Pour the liquid carefully. | 액체를 조심히 부어라. | Water is a liquid. | 물은 액체이다.
solid | ˈsɑːlɪd | 고체, 단단한, 견고한 | firm, hard | liquid, hollow | Ice is solid water. | 얼음은 고체 상태의 물이다. | She has a solid foundation. | 견고한 기초가 있다.
metal | ˈmɛtəl | 금속 | iron, steel | nonmetal | Gold is a precious metal. | 금은 귀금속이다. | The gate is made of metal. | 문이 금속으로 만들어졌다.
extract | ɪkˈ스트랙트 | 추출하다, 발췌, 추출물 | remove, obtain | insert | She extracted the data. | 데이터를 추출했다. | Extract the juice from oranges. | 오렌지에서 즙을 추출해라.
hypothesis | haɪˈpɑːθɪsɪs | 가설, 추정 | theory, assumption | fact | The hypothesis was tested. | 가설이 검증되었다. | She formed a new hypothesis. | 새로운 가설을 세웠다.
gravity | ˈɡrævɪti | 중력, 심각성 | force, seriousness | levity | Gravity pulls things down. | 중력이 물체를 아래로 끈다. | She understood the gravity of the situation. | 상황의 심각성을 이해했다.
particle | ˈpɑːrtɪkəl | 입자, 미립자 | bit, fragment | whole | Dust particles floated in the air. | 먼지 입자가 공중에 떠다녔다. | Every particle of matter has mass. | 모든 입자에는 질량이 있다.
component | kəmˈpoʊnənt | 구성요소, 부품 | part, element | whole | The key component is missing. | 핵심 부품이 없다. | Each component is important. | 각 구성요소가 중요하다.
molecule | ˈmɑːlɪkjuːl | 분자 | atom, particle | - | Water molecules contain hydrogen. | 물 분자에 수소가 포함된다. | A molecule is made of atoms. | 분자는 원자로 이루어진다.
keep A from ~ing | kiːp frɑːm | A가 ~하지 못하게 하다 | prevent, stop | allow | The rain kept us from going out. | 비가 외출을 막았다. | Nothing can keep me from trying. | 아무것도 시도하는 것을 막을 수 없다.
habitat | ˈhæbɪtæt | 서식지, 거주지 | environment, home | - | The forest is their natural habitat. | 숲이 자연 서식지이다. | Habitat destruction threatens animals. | 서식지 파괴가 동물을 위협한다.
species | ˈspiːʃiːz | 종, 종류 | type, kind | - | Many species are endangered. | 많은 종이 멸종 위기에 있다. | This species is rare. | 이 종은 희귀하다.
mammal | ˈmæməl | 포유동물 | animal | - | Whales are mammals. | 고래는 포유동물이다. | Mammals feed their young milk. | 포유동물은 새끼에게 젖을 먹인다.
predator | ˈ프레데터 | 포식자, 약탈자 | hunter, carnivore | prey | Lions are top predators. | 사자는 최상위 포식자이다. | The predator chased its prey. | 포식자가 먹이를 쫓았다.
migrate | ˈmaɪɡreɪt | 이주하다, 이동하다 | move, relocate | settle | Birds migrate south in winter. | 새들이 겨울에 남쪽으로 이동한다. | People migrate for better opportunities. | 사람들이 더 나은 기회를 위해 이주한다.
survive | sərˈvaɪv | 살아남다, 생존하다 | endure, outlive | perish | She survived the earthquake. | 지진에서 살아남았다. | Only the strongest survive. | 가장 강한 자만 생존한다.
skeleton | ˈskɛlɪtn | 골격, 해골, 뼈대 | bones, framework | - | The skeleton was found in the cave. | 동굴에서 해골이 발견되었다. | She studied the human skeleton. | 인체 골격을 공부했다.
nerve | nɜːrv | 신경, 용기 | courage, guts | cowardice | She had the nerve to complain. | 불평할 용기가 있었다. | The nerve in her hand was damaged. | 손의 신경이 손상되었다.
stem | stɛm | 줄기, ~에서 비롯하다 | trunk, originate | - | Cut the flower at the stem. | 줄기에서 꽃을 잘라라. | The problem stems from lack of funding. | 문제가 자금 부족에서 비롯한다.
organism | ˈɔːrɡənɪzəm | 유기체, 생물 | creature, being | - | Bacteria are simple organisms. | 박테리아는 단순한 유기체이다. | Every organism needs water. | 모든 생물에게 물이 필요하다.
branch | bræntʃ | 가지, 분점, 분야 | limb, division | root, trunk | The bird sat on a branch. | 새가 나뭇가지에 앉았다. | The bank has many branches. | 은행에 많은 지점이 있다.
tissue | ˈtɪʃuː | 조직, 휴지 | material, cells | - | Muscle tissue repairs itself. | 근육 조직이 스스로 회복한다. | She used a tissue to wipe her tears. | 휴지로 눈물을 닦았다.
come up with | kʌm ʌp wɪð | ~을 생각해내다 | invent, devise | - | She came up with a great idea. | 좋은 아이디어를 생각해냈다. | They came up with a solution. | 해결책을 찾아냈다.
volcanic | vɑːlˈkænɪk | 화산의 | volcanic | - | The volcanic eruption destroyed the town. | 화산 폭발이 도시를 파괴했다. | Volcanic soil is very fertile. | 화산 토양은 매우 비옥하다.
vibrate | ˈvaɪbreɪt | 진동하다, 떨리다 | shake, tremble | still | The phone vibrated in her pocket. | 주머니에서 전화가 진동했다. | Sound waves make air vibrate. | 음파가 공기를 진동시킨다.
layer | ˈleɪər | 층, 겹 | coating, level | - | Apply a second layer of paint. | 페인트를 두 번째 층 바르라. | The cake has three layers. | 케이크가 3층이다.
temperature | ˈtɛmpərətʃər | 온도, 기온, 체온 | heat, degree | - | The temperature dropped to zero. | 온도가 영하로 떨어졌다. | Check your body temperature. | 체온을 확인해라.
glacier | ˈɡleɪʃər | 빙하 | ice sheet | - | The glacier is melting. | 빙하가 녹고 있다. | Glaciers shaped the landscape. | 빙하가 지형을 형성했다.
astronomy | əˈstrɑːnəmi | 천문학 | stargazing, astrophysics | - | She studies astronomy. | 천문학을 공부한다. | Astronomy reveals the universe. | 천문학이 우주를 밝힌다.
ray | reɪ | 광선, 빛줄기 | beam, light | darkness | Sunrays warmed the Earth. | 햇빛이 지구를 따뜻하게 했다. | A ray of hope appeared. | 한 줄기 희망이 나타났다.
consist of | kənˈsɪst ɑːv | ~으로 구성되다 | be made up of, comprise | - | The team consists of ten members. | 팀이 10명으로 구성되어 있다. | The meal consists of rice and soup. | 식사가 밥과 국으로 구성된다.

=== Day 17 ===
conquer | ˈkɑːŋkər | 정복하다, 극복하다 | defeat, overcome | surrender | He conquered his fear. | 두려움을 극복했다. | Alexander conquered many nations. | 알렉산더가 많은 나라를 정복했다.
heritage | ˈhɛrɪtɪdʒ | 유산, 전통 | legacy, tradition | - | Protect our cultural heritage. | 문화 유산을 보호해라. | The city is a world heritage site. | 도시가 세계 유산 지구이다.
artificial | ˌɑːrtɪˈfɪʃəl | 인공의, 인조의 | synthetic, man-made | natural | Artificial intelligence is growing. | 인공지능이 성장하고 있다. | She disliked artificial flowers. | 인조 꽃을 싫어했다.
conventional | kənˈvɛnʃənəl | 관습적인, 전통적인 | traditional, standard | unconventional | She took a conventional approach. | 전통적 접근법을 취했다. | Conventional wisdom says otherwise. | 통념은 다르게 말한다.
colonial | kəˈloʊniəl | 식민지의, 식민지 시대의 | imperial | independent | Korea experienced colonial rule. | 한국이 식민 통치를 경험했다. | The colonial era left its mark. | 식민지 시대가 흔적을 남겼다.
noble | ˈnoʊbl | 고귀한, 숭고한, 귀족 | honorable, dignified | ignoble | She has noble intentions. | 숭고한 의도가 있다. | He came from a noble family. | 귀족 가문 출신이다.
ascend | əˈsɛnd | 오르다, 올라가다 | rise, climb | descend | She ascended the mountain. | 산을 올랐다. | The balloon ascended into the sky. | 풍선이 하늘로 올라갔다.
empower | ɪmˈpa우어 | 권한을 부여하다, 힘을 주다 | enable, authorize | weaken | Education empowers people. | 교육이 사람들에게 힘을 준다. | She was empowered to make decisions. | 결정을 내릴 권한이 부여되었다.
be derived from | biː dɪˈraɪvd frɑːm | ~에서 유래하다 | originate from, come from | - | The word is derived from Latin. | 그 단어는 라틴어에서 유래한다. | Many medicines are derived from plants. | 많은 약이 식물에서 유래한다.
take into account | teɪk ˈɪntuː əˈkaʊnt | ~을 고려하다 | consider, factor in | ignore | Take all factors into account. | 모든 요소를 고려해라. | She took his feelings into account. | 그의 감정을 고려했다.
philosophy | fɪˈlɑːsəfi | 철학, 인생관 | thinking, ideology | - | She studied philosophy at university. | 대학에서 철학을 공부했다. | His philosophy of life is simple. | 그의 인생관은 단순하다.
profound | prəˈfaʊnd | 깊은, 심오한, 지대한 | deep, significant | superficial, shallow | She made a profound impact. | 지대한 영향을 미쳤다. | The book has profound meaning. | 책이 심오한 의미가 있다.
shallow | ˈʃæloʊ | 얕은, 피상적인 | superficial, thin | deep | The water is shallow here. | 여기 물이 얕다. | Don't be so shallow. | 그렇게 피상적이지 마.
oppose | əˈpoʊz | 반대하다, 대항하다 | resist, object | support | She opposed the decision. | 결정에 반대했다. | Many people opposed the law. | 많은 사람이 법에 반대했다.
spirit | ˈspɪrɪt | 정신, 영혼, 기분 | soul, mood | body | She has a strong spirit. | 강한 정신을 가졌다. | Team spirit is important. | 팀 정신이 중요하다.
ritual | ˈrɪtʃuəl | 의식, 절차, 의식의 | ceremony, custom | - | The ritual involves dancing. | 의식에 춤이 포함된다. | Morning coffee is her daily ritual. | 아침 커피가 그녀의 일상 의식이다.
substance | ˈsʌbstəns | 물질, 본질, 실체 | material, matter | - | This substance is toxic. | 이 물질은 유독하다. | His argument lacks substance. | 그의 논증에 실체가 없다.
prejudice | ˈprɛdʒʊdɪs | 편견, 선입견 | bias, discrimination | fairness | She fought against prejudice. | 편견에 맞서 싸웠다. | Don't let prejudice affect your decision. | 편견이 결정에 영향을 주지 않게 해라.
bias | ˈbaɪəs | 편견, 편향 | prejudice, partiality | fairness | The report showed bias. | 보고서가 편향을 보였다. | Avoid bias in your research. | 연구에서 편견을 피해라.
ultimate | ˈʌltɪmɪt | 궁극적인, 최고의, 최종의 | final, supreme | initial | Her ultimate goal is to become a doctor. | 궁극적 목표는 의사가 되는 것이다. | This is the ultimate challenge. | 이것이 최고의 도전이다.
absolute | ˈæbsəluːt | 절대적인, 완전한 | total, complete | relative | She has absolute power. | 절대적 권력이 있다. | There is no absolute truth. | 절대적 진실은 없다.
humanity | hjuːˈmænɪti | 인류, 인간성, 인도주의 | mankind, compassion | cruelty | She cares about humanity. | 인류를 걱정한다. | Crimes against humanity. | 인도주의에 반하는 범죄.
draft | dræft | 초안, 초고, 초안을 작성하다 | outline, plan | final version | She wrote the first draft. | 첫 번째 초안을 작성했다. | The draft was revised. | 초안이 수정되었다.
spell | spɛl | 철자를 쓰다, 주문, 기간 | write, enchantment | - | How do you spell your name? | 이름 철자가 어떻게 되나요? | A spell of good weather. | 좋은 날씨의 기간.
modify | ˈmɑːdɪfaɪ | 수정하다, 변경하다 | change, alter | maintain | She modified the plan. | 계획을 수정했다. | The design was modified. | 디자인이 변경되었다.
comic | ˈkɑːmɪk | 만화의, 희극의, 만화 | funny, humorous | tragic | She reads comic books. | 만화책을 읽는다. | The comic movie was hilarious. | 코미디 영화가 매우 재미있었다.
tragic | ˈtrædʒɪk | 비극적인, 비참한 | devastating, sad | comic, happy | It was a tragic accident. | 비극적 사고였다. | The story has a tragic ending. | 이야기가 비극적으로 끝난다.
simplify | ˈsɪmplɪfaɪ | 간소화하다, 단순화하다 | reduce, streamline | complicate | Simplify the process. | 과정을 간소화해라. | She simplified the instructions. | 지시를 단순화했다.
myth | mɪθ | 신화, 미신, 속설 | legend, fable | fact | Greek myths are fascinating. | 그리스 신화가 매력적이다. | That is a common myth. | 흔한 속설이다.
imply | ɪmˈplaɪ | 암시하다, 내포하다 | suggest, hint | state explicitly | Her words implied dissatisfaction. | 말이 불만을 암시했다. | What are you implying? | 무엇을 암시하는 거야?
context | ˈkɑːntɛkst | 맥락, 문맥, 상황 | background, setting | - | Read the word in context. | 문맥에서 단어를 읽어라. | The context is important. | 맥락이 중요하다.
inherent | ɪnˈhɪrənt | 내재적인, 고유한 | built-in, innate | external | Risk is inherent in business. | 위험은 사업에 내재되어 있다. | She has an inherent talent. | 선천적 재능이 있다.
outline | ˈaʊtlaɪn | 개요, 윤곽, 요약하다 | summary, sketch | detail | She outlined the plan. | 계획을 개략적으로 설명했다. | Write an outline first. | 먼저 개요를 써라.
translate | trænzˈleɪt | 번역하다, 해석하다 | interpret, convert | - | She translated the book into Korean. | 책을 한국어로 번역했다. | Translate the sentence. | 문장을 번역해라.
series | ˈsɪriːz | 연속, 시리즈 | sequence, chain | - | She watched the entire series. | 시리즈 전체를 봤다. | A series of events occurred. | 일련의 사건이 발생했다.
plot | plɑːt | 줄거리, 음모, 구획 | story, scheme | - | The plot was exciting. | 줄거리가 흥미진진했다. | They plotted against the king. | 왕에 대한 음모를 꾸몄다.
paradoxically | ˌpærəˈdɑːksɪkli | 역설적으로, 모순되게 | ironically, contradictorily | - | Paradoxically, more choice leads to less happiness. | 역설적으로 더 많은 선택이 행복을 줄인다. | Paradoxically, she became stronger. | 역설적으로 그녀는 더 강해졌다.
ironically | aɪˈrɑːnɪkli | 아이러니하게도, 역설적으로 | paradoxically, unexpectedly | - | Ironically, the fire station burned down. | 아이러니하게도 소방서가 불탔다. | Ironically, he failed the easy test. | 아이러니하게도 쉬운 시험을 떨어졌다.
metaphor | ˈmɛtəfɔːr | 은유, 비유 | analogy, symbol | - | Life is a journey is a metaphor. | 인생은 여행이다 는 은유이다. | She used a powerful metaphor. | 강력한 은유를 사용했다.
fiction | ˈfɪkʃən | 소설, 허구 | novel, fantasy | fact, nonfiction | She writes science fiction. | SF 소설을 쓴다. | The story is pure fiction. | 이야기가 순수한 허구이다.

=== Day 18 ===
creative | kriˈeɪtɪv | 창의적인, 창조적인 | imaginative, inventive | unimaginative | She is very creative. | 매우 창의적이다. | Creative thinking solves problems. | 창의적 사고가 문제를 해결한다.
abstract | ˈæbstrækt | 추상적인, 추상 | theoretical, conceptual | concrete | Abstract art is hard to understand. | 추상 미술은 이해하기 어렵다. | The concept is too abstract. | 개념이 너무 추상적이다.
concrete | ˈkɑːŋkriːt | 구체적인, 콘크리트 | specific, solid | abstract | Give a concrete example. | 구체적인 예를 들어라. | The floor is made of concrete. | 바닥이 콘크리트로 되어 있다.
masterpiece | ˈmæstərpiːs | 걸작, 명작 | classic, gem | failure | The painting is a masterpiece. | 그 그림은 걸작이다. | She created a musical masterpiece. | 음악 걸작을 만들었다.
polish | ˈpɑːlɪʃ | 닦다, 광을 내다, 다듬다 | shine, refine | roughen | Polish your shoes. | 신발을 닦아라. | She polished her essay. | 에세이를 다듬었다.
craft | kræft | 공예, 기술, 만들다 | skill, art | - | She learned the craft of pottery. | 도자기 공예를 배웠다. | He crafted a beautiful chair. | 아름다운 의자의 장인이다.
authentic | ɔːˈθɛntɪk | 진짜의, 정통의 | genuine, real | fake | This is an authentic antique. | 이것은 진짜 골동품이다. | Try authentic Korean food. | 정통 한국 음식을 먹어봐.
precious | ˈprɛʃəs | 귀중한, 소중한 | valuable, dear | worthless | Time is precious. | 시간은 소중하다. | She has a precious collection. | 소중한 컬렉션이 있다.
proportion | prəˈpɔːrʃən | 비율, 비례, 부분 | ratio, percentage | disproportion | A large proportion of students passed. | 많은 비율의 학생이 합격했다. | The body is in good proportion. | 몸의 비율이 좋다.
portrait | ˈpɔːr트리트 | 초상화, 인물 사진 | picture, painting | - | She painted a portrait. | 초상화를 그렸다. | The portrait hangs in the gallery. | 초상화가 갤러리에 걸려 있다.
play a role | pleɪ ə roʊl | 역할을 하다 | contribute, function | - | Technology plays a role in education. | 기술이 교육에 역할을 한다. | She plays a key role in the team. | 팀에서 핵심적 역할을 한다.
elaborate | ɪˈlæbərɪt | 정교한, 상세히 설명하다 | detailed, complex | simple | The plan was elaborate. | 계획이 정교했다. | Could you elaborate on that point? | 그 점을 상세히 설명해줄래?
external | ɪkˈstɜːrnəl | 외부의, 외적인 | outer, outside | internal | External factors affected the result. | 외부 요인이 결과에 영향을 미쳤다. | She showed no external signs of stress. | 외적으로 스트레스 징후를 보이지 않았다.
internal | ɪnˈtɜːrnəl | 내부의, 내적인 | inner, inside | external | Internal conflicts weakened the team. | 내부 갈등이 팀을 약화시켰다. | The company held an internal meeting. | 회사가 내부 회의를 열었다.
memorial | məˈmɔːriəl | 기념의, 추모의, 기념물 | monument, tribute | - | They built a war memorial. | 전쟁 기념물을 세웠다. | The memorial honors the soldiers. | 기념물이 군인들을 기린다.
differ | ˈdɪfər | 다르다, 의견이 다르다 | vary, disagree | agree, match | Opinions differ on this issue. | 이 문제에 의견이 다르다. | They differ in many ways. | 여러 면에서 다르다.
distinguish | dɪˈstɪŋɡwɪʃ | 구별하다, 구분하다 | differentiate, tell apart | confuse | She distinguished between the two. | 둘을 구별했다. | The mark distinguishes our brand. | 표시가 브랜드를 구분한다.
contrast | ˈkɑːntræ스트 | 대조, 대조하다 | comparison, difference | similarity | The contrast is striking. | 대조가 두드러진다. | She contrasted the two methods. | 두 방법을 대조했다.
architect | ˈɑːrkɪtɛkt | 건축가, 설계자 | designer, planner | - | She is a famous architect. | 유명한 건축가이다. | The architect designed the building. | 건축가가 건물을 설계했다.
institute | ˈɪnstɪtjuːt | 기관, 연구소, 설립하다 | organization, establish | dissolve | She works at a research institute. | 연구소에서 일한다. | They instituted new rules. | 새로운 규칙을 설립했다.
coordinate | koʊˈɔːrdɪneɪt | 조정하다, 협력하다, 좌표 | organize, synchronize | disorganize | She coordinated the event. | 행사를 조정했다. | Coordinate with your team. | 팀과 협력해라.
collapse | kəˈlæps | 붕괴하다, 쓰러지다, 붕괴 | fall, crash | rise | The building collapsed. | 건물이 붕괴했다. | The economy is on the verge of collapse. | 경제가 붕괴 직전이다.
amuse | əˈmjuːz | 즐겁게 하다, 재미있게 하다 | entertain, delight | bore | The clown amused the children. | 광대가 아이들을 즐겁게 했다. | She was amused by the joke. | 농담에 재미있어했다.
entertain | ˌɛntərˈteɪn | 즐겁게 하다, 대접하다, 품다 | amuse, host | bore | She entertained the guests. | 손님을 대접했다. | The show entertained thousands. | 쇼가 수천 명을 즐겁게 했다.
compose | kəmˈpoʊz | 작곡하다, 작성하다, 구성하다 | create, write | decompose | She composed a beautiful song. | 아름다운 곡을 작곡했다. | The team is composed of experts. | 팀이 전문가로 구성되었다.
orchestra | ˈɔːrkɪstrə | 오케스트라, 관현악단 | band, ensemble | - | She plays in an orchestra. | 오케스트라에서 연주한다. | The orchestra performed beautifully. | 오케스트라가 아름답게 연주했다.
rehearse | rɪˈhɜːrs | 리허설하다, 연습하다 | practice, prepare | - | They rehearsed for the play. | 연극을 위해 리허설했다. | Rehearse your speech beforehand. | 미리 연설을 연습해라.
popularity | ˌpɑːpjuˈlærɪti | 인기, 대중성 | fame, appeal | unpopularity | Her popularity is growing. | 인기가 높아지고 있다. | The song gained popularity. | 노래가 인기를 얻었다.
perform | pərˈfɔːrm | 수행하다, 공연하다 | execute, act | fail | She performed the surgery. | 수술을 수행했다. | The band performed live. | 밴드가 라이브 공연을 했다.
impressive | ɪmˈprɛsɪv | 인상적인, 감명 깊은 | remarkable, striking | unimpressive | Her performance was impressive. | 그녀의 공연이 인상적이었다. | The view was impressive. | 경치가 감명 깊었다.
flash | flæʃ | 번쩍이다, 섬광 | spark, gleam | darkness | Lightning flashed across the sky. | 번개가 하늘을 가로질러 번쩍였다. | A flash of inspiration hit her. | 영감이 번쩍 떠올랐다.
harmonize | ˈhɑːrmənaɪz | 조화시키다, 화음을 넣다 | balance, blend | clash | She harmonized the colors. | 색상을 조화시켰다. | Their voices harmonize perfectly. | 목소리가 완벽하게 어울린다.
encounter | ɪnˈkaʊntər | 마주치다, 만남 | meet, face | avoid | She encountered a problem. | 문제에 마주쳤다. | It was an unexpected encounter. | 예상치 못한 만남이었다.
socialize | ˈsoʊʃəlaɪz | 사교하다, 어울리다 | mingle, interact | isolate | She likes to socialize with friends. | 친구들과 어울리기를 좋아한다. | Children learn to socialize at school. | 아이들이 학교에서 사교를 배운다.
imaginative | ɪˈmædʒɪnətɪv | 상상력이 풍부한 | creative, inventive | unimaginative | She tells imaginative stories. | 상상력 풍부한 이야기를 한다. | Children are very imaginative. | 아이들은 상상력이 풍부하다.
magical | ˈmædʒɪkəl | 마법의, 신비로운 | enchanting, wonderful | ordinary | It was a magical experience. | 마법 같은 경험이었다. | The sunset was magical. | 석양이 신비로웠다.
theme | θiːm | 주제, 테마 | topic, subject | - | The main theme of the novel. | 소설의 주요 주제. | The party had a beach theme. | 파티가 해변 테마였다.
entrance | ˈɛntrəns | 입구, 입장, 등장 | entry, doorway | exit | The entrance is on the left. | 입구가 왼쪽에 있다. | She made a dramatic entrance. | 극적으로 등장했다.
classical | ˈklæsɪkəl | 고전의, 클래식의 | traditional, classic | modern | She listens to classical music. | 클래식 음악을 듣는다. | Classical literature is timeless. | 고전 문학은 영원하다.
be associated with | biː əˈsoʊʃieɪtɪd wɪð | ~와 관련되다 | be connected with, relate to | - | Stress is associated with illness. | 스트레스가 질병과 관련된다. | The brand is associated with quality. | 브랜드가 품질과 관련된다.

=== Day 19 ===
electronic | ˌɪlɛkˈtrɑːnɪk | 전자의, 전자 기기의 | digital, computerized | analog | She bought electronic devices. | 전자 기기를 구입했다. | Electronic music is popular. | 전자 음악이 인기이다.
multiply | ˈmʌltɪplaɪ | 곱하다, 증가시키다 | increase, grow | divide | Multiply 5 by 3. | 5에 3을 곱해라. | Problems multiplied quickly. | 문제가 빠르게 늘어났다.
upload | ˈʌploʊd | 업로드하다, 올리다 | post, share | download | She uploaded the photo. | 사진을 업로드했다. | Upload the file to the server. | 서버에 파일을 올려라.
download | ˈdaʊnloʊd | 다운로드하다, 내려받다 | save, get | upload | Download the app for free. | 앱을 무료로 다운로드해라. | She downloaded the music. | 음악을 다운로드했다.
virtual | ˈvɜːrtʃuəl | 가상의, 사실상의 | simulated, digital | real, actual | She attended a virtual meeting. | 가상 회의에 참석했다. | Virtual reality is amazing. | 가상 현실이 놀랍다.
activate | ˈæktɪveɪt | 활성화하다, 작동시키다 | start, trigger | deactivate | Activate your account online. | 온라인으로 계정을 활성화해라. | Press the button to activate it. | 버튼을 눌러 작동시켜라.
nuclear | ˈnuːkliər | 핵의, 원자력의 | atomic | - | Nuclear energy is powerful. | 원자력 에너지는 강력하다. | The nuclear plant was shut down. | 원전이 가동 중지되었다.
install | ɪnˈstɔːl | 설치하다, 설비하다 | set up, place | remove, uninstall | She installed the software. | 소프트웨어를 설치했다. | Install the new update. | 새 업데이트를 설치해라.
maximize | ˈmæksɪmaɪz | 극대화하다 | increase, optimize | minimize | Maximize your productivity. | 생산성을 극대화해라. | She maximized her profits. | 이익을 극대화했다.
minimize | ˈmɪnɪmaɪz | 최소화하다 | reduce, decrease | maximize | Minimize the risk of error. | 오류 위험을 최소화해라. | She minimized her expenses. | 지출을 최소화했다.
circuit | ˈsɜːrkɪt | 회로, 순환 | loop, path | - | She built an electric circuit. | 전기 회로를 만들었다. | The circuit was broken. | 회로가 끊겼다.
sort | sɔːrt | 분류하다, 종류 | classify, type | mix | Sort the files by date. | 날짜별로 파일을 분류해라. | What sort of music do you like? | 어떤 종류의 음악을 좋아하나?
automatic | ˌɔːtəˈmætɪk | 자동의, 자동적인 | self-operating, mechanical | manual | The door is automatic. | 문이 자동이다. | She drives an automatic car. | 자동 기어 차를 운전한다.
manual | ˈmænjuəl | 수동의, 설명서 | by hand, guidebook | automatic | Read the instruction manual. | 사용 설명서를 읽어라. | Manual labor is hard work. | 육체 노동은 힘든 일이다.
visual | ˈvɪʒuəl | 시각적인, 시각의 | optical, graphic | auditory | She learns through visual aids. | 시각 자료를 통해 배운다. | The visual effects were stunning. | 시각 효과가 놀라웠다.
recharge | ˌriːˈtʃɑːrdʒ | 재충전하다 | refuel, refresh | drain | Recharge your phone battery. | 폰 배터리를 충전해라. | She needs time to recharge. | 재충전할 시간이 필요하다.
numerous | ˈnuːmərəs | 수많은, 다수의 | many, countless | few | She received numerous awards. | 수많은 상을 받았다. | There are numerous options. | 다수의 선택지가 있다.
statistics | stəˈtɪstɪks | 통계, 통계학 | data, figures | - | Statistics show an increase. | 통계가 증가를 보여준다. | She studied statistics. | 통계학을 공부했다.
angle | ˈæŋɡəl | 각도, 관점, 시각 | degree, perspective | - | Measure the angle carefully. | 각도를 주의 깊게 측정해라. | Look at it from a different angle. | 다른 관점에서 봐라.
equation | ɪˈkweɪʒən | 방정식, 등식 | formula, expression | - | Solve the equation. | 방정식을 풀어라. | The equation is complex. | 방정식이 복잡하다.
ride | raɪd | 타다, 타기, 승차 | travel, drive | walk | She rides a bicycle. | 자전거를 탄다. | The ride was smooth. | 승차감이 좋았다.
crash | kræʃ | 충동하다, 추락, 고장 | collide, smash | - | The plane crashed into the mountain. | 비행기가 산에 추락했다. | The computer crashed. | 컴퓨터가 고장났다.
rush | rʌʃ | 서두르다, 돌진, 혼잡 | hurry, dash | wait | She rushed to the station. | 역으로 서둘렀다. | Don't rush your decision. | 결정을 서두르지 마.
bump | bʌmp | 부딪히다, 충돌, 혹 | hit, knock | - | She bumped into a wall. | 벽에 부딪혔다. | There was a bump on the road. | 도로에 혹이 있었다.
aircraft | ˈɛrkræft | 항공기, 비행기 | airplane, plane | - | The aircraft landed safely. | 항공기가 안전하게 착륙했다. | Military aircraft flew overhead. | 군용기가 상공을 날았다.
vessel | ˈvɛsəl | 배, 선박, 그릇, 혈관 | ship, container | - | The vessel sailed across the ocean. | 선박이 대양을 가로질렀다. | Blood flows through vessels. | 혈액이 혈관을 통해 흐른다.
satellite | ˈsætəlaɪt | 위성, 인공위성 | moon, orbiter | - | The satellite orbits the Earth. | 위성이 지구를 돈다. | Satellite TV is available. | 위성 TV를 이용할 수 있다.
mechanical | mɪˈkænɪkəl | 기계의, 기계적인 | automatic, machine | manual | She has mechanical skills. | 기계적 기술이 있다. | Mechanical failure caused the crash. | 기계 고장이 추락을 야기했다.
portable | ˈpɔːrtəbl | 휴대용의, 이동 가능한 | mobile, lightweight | fixed, stationary | She uses a portable speaker. | 휴대용 스피커를 사용한다. | Portable devices are convenient. | 휴대용 기기가 편리하다.
device | dɪˈvaɪs | 장치, 기기 | gadget, tool | - | She invented a useful device. | 유용한 장치를 발명했다. | Electronic devices are everywhere. | 전자 기기가 어디에나 있다.
capacity | kəˈpæsɪti | 수용력, 용량, 능력 | volume, ability | inability | The stadium has a capacity of 50000. | 경기장 수용 인원이 5만 명이다. | Work at full capacity. | 최대 용량으로 작업해라.
tune | tjuːn | 곡, 선율, 조율하다 | melody, song | - | She hummed a happy tune. | 행복한 곡을 흥얼거렸다. | Tune the guitar before playing. | 연주 전에 기타를 조율해라.
convert | kənˈvɜːrt | 전환하다, 변환하다, 개종시키다 | change, transform | maintain | She converted dollars to won. | 달러를 원으로 환전했다. | Convert the file to PDF. | 파일을 PDF로 변환해라.
detect | dɪˈtɛkt | 발견하다, 감지하다 | find, discover | miss | The sensor detected gas. | 센서가 가스를 감지했다. | She detected a pattern. | 패턴을 발견했다.
transform | trænsˈfɔːrm | 변형시키다, 변환하다 | change, convert | preserve | Technology transformed society. | 기술이 사회를 변형시켰다. | She transformed the room. | 방을 탈바꿈시켰다.
access | ˈæksɛs | 접근, 접속, 이용하다 | entry, admission | restriction | She has access to the database. | 데이터베이스 접근 권한이 있다. | Access is restricted. | 접근이 제한되어 있다.
be supposed to | biː səˈpoʊzd tuː | ~하기로 되어있다, ~해야 한다 | be expected to, should | - | She is supposed to arrive at 3. | 3시에 도착하기로 되어 있다. | You are supposed to wear a uniform. | 교복을 입어야 한다.
be likely to | biː ˈlaɪkli tuː | ~할 것 같다 | be expected to, probably will | be unlikely to | It is likely to rain tomorrow. | 내일 비가 올 것 같다. | She is likely to succeed. | 성공할 것 같다.
in spite of | ɪn spaɪt ɑːv | ~에도 불구하고 | despite, regardless of | because of | She went in spite of the rain. | 비에도 불구하고 갔다. | In spite of the difficulties, she succeeded. | 어려움에도 불구하고 성공했다.
neither A nor B | ˈniːðər ... nɔːr | A도 B도 아닌 | not A and not B | both A and B | Neither she nor he was invited. | 그녀도 그도 초대받지 못했다. | It was neither hot nor cold. | 덥지도 춥지도 않았다.

=== Day 20 ===
physical | ˈfɪzɪkəl | 신체적인, 물리적인 | bodily, tangible | mental, spiritual | Physical exercise improves health. | 신체 운동이 건강을 개선한다. | She passed the physical exam. | 신체검사를 통과했다.
opponent | əˈpoʊnənt | 상대방, 적 | rival, competitor | ally | She defeated her opponent. | 상대를 이겼다. | Her opponent was very strong. | 상대가 매우 강했다.
target | ˈtɑːrɡɪt | 목표, 대상, 표적 | goal, aim | - | She hit the target perfectly. | 목표를 정확히 맞혔다. | The company met its sales target. | 회사가 판매 목표를 달성했다.
posture | ˈpɑːstʃər | 자세, 태도 | stance, position | - | Maintain good posture. | 좋은 자세를 유지해라. | Her posture improved with exercise. | 운동으로 자세가 좋아졌다.
track | træk | 추적하다, 궤도, 경주로 | follow, trail | lose | She tracked the package online. | 온라인으로 택배를 추적했다. | The train runs on the track. | 기차가 철로 위를 달린다.
row | roʊ | 줄, 열, 노를 젓다 | line, queue | - | They sat in the front row. | 앞줄에 앉았다. | She rowed the boat across the lake. | 호수를 가로질러 배를 저었다.
stretch | strɛtʃ | 뻗다, 늘이다, 스트레칭 | extend, spread | compress | She stretched before exercising. | 운동 전에 스트레칭했다. | Stretch your arms above your head. | 머리 위로 팔을 뻗어라.
extreme | ɪkˈstriːm | 극단적인, 극적인 | drastic, severe | moderate | She lives in extreme conditions. | 극한 조건에서 산다. | Avoid extreme measures. | 극단적 수단을 피해라.
flexible | ˈflɛksəbl | 유연한, 융통성 있는 | adaptable, elastic | rigid, stiff | She has a flexible schedule. | 유연한 일정이 있다. | Be flexible in your approach. | 접근 방식에 유연해라.
muscle | ˈmʌsəl | 근육, 힘 | strength, power | weakness | She exercises her muscles daily. | 매일 근육 운동을 한다. | He pulled a muscle. | 근육을 삐었다.
surgery | ˈsɜːrdʒəri | 수술, 외과 | operation, procedure | - | She had heart surgery. | 심장 수술을 받았다. | The surgery was successful. | 수술이 성공적이었다.
cure | kjʊr | 치료하다, 치료법 | heal, remedy | worsen | There is no cure for the cold. | 감기 치료법은 없다. | Scientists are searching for a cure. | 과학자들이 치료법을 찾고 있다.
heal | hiːl | 치유하다, 나다 | recover, mend | harm, wound | The wound healed quickly. | 상처가 빨리 나았다. | Time heals all wounds. | 시간이 모든 상처를 치유한다.
symptom | ˈsɪmptəm | 증상, 징후 | sign, indication | - | What are the symptoms? | 증상이 무엇인가? | A cough is a common symptom. | 기침이 흔한 증상이다.
immune | ɪˈmjuːn | 면역의, 영향 받지 않는 | resistant, protected | vulnerable | She is immune to the virus. | 바이러스에 면역이 있다. | Strengthen your immune system. | 면역 체계를 강화해라.
therapy | ˈθɛrəpi | 치료, 요법 | treatment, healing | - | She attends physical therapy. | 물리 치료를 받는다. | Music therapy helps patients. | 음악 치료가 환자를 돕는다.
faint | feɪnt | 희미한, 기절하다, 기절 | dim, pass out | strong, bright | She fainted from the heat. | 더위로 기절했다. | A faint light was visible. | 희미한 빛이 보였다.
stroke | stroʊk | 뇌졸중, 타격, 쓰다듬다 | blow, pet | - | He suffered a stroke. | 뇌졸중을 겪었다. | She stroked the cat gently. | 고양이를 부드럽게 쓰다듬었다.
breath | brɛθ | 숨, 호흡 | air, respiration | - | Take a deep breath. | 심호흡해라. | She was out of breath. | 숨이 가빴다.
bleed | bliːd | 피가 나다, 출혈하다 | hemorrhage | clot | The wound was bleeding. | 상처에서 피가 났다. | Her nose started to bleed. | 코에서 피가 나기 시작했다.
diagnose | ˌ다이애그노즈 | 진단하다, 판정하다 | identify, detect | - | The doctor diagnosed the disease. | 의사가 질병을 진단했다. | She was diagnosed with flu. | 독감으로 진단되었다.
prescribe | prɪˈskraɪb | 처방하다, 규정하다 | recommend, order | - | The doctor prescribed medicine. | 의사가 약을 처방했다. | She was prescribed rest. | 휴식이 처방되었다.
chronic | ˈkrɑːnɪk | 만성적인, 오래된 | persistent, long-term | acute | She has chronic back pain. | 만성 요통이 있다. | Chronic diseases need ongoing care. | 만성 질환은 지속 관리가 필요하다.
obesity | oʊˈbiːsəti | 비만 | overweight, fatness | thinness | Obesity increases health risks. | 비만이 건강 위험을 높인다. | Childhood obesity is a concern. | 아동 비만이 걱정이다.
pregnant | ˈ프레그넌트 | 임신한 | expecting | - | She is five months pregnant. | 임신 5개월이다. | Pregnant women need extra care. | 임산부는 추가 관리가 필요하다.
contagious | kənˈteɪdʒəs | 전염성의, 전파되는 | infectious, spreading | noninfectious | The disease is highly contagious. | 질병이 매우 전염성이 강하다. | Laughter is contagious. | 웃음은 전염된다.
organ | ˈɔːrɡən | 장기, 기관, 오르간 | body part, instrument | - | The heart is a vital organ. | 심장은 필수적인 장기이다. | She donated an organ. | 장기를 기증했다.
dose | doʊs | 복용량, 투여량 | amount, portion | - | Take the correct dose. | 정확한 복용량을 먹어라. | She increased the dose. | 복용량을 늘렸다.
disabled | dɪsˈeɪbld | 장애가 있는 | handicapped, impaired | able-bodied | Parking for disabled drivers. | 장애인 운전자용 주차장. | She helps disabled children. | 장애 아동을 돕는다.
well-being | ˌwɛl ˈbiːɪŋ | 안녕, 행복, 복지 | welfare, health | suffering | Exercise improves well-being. | 운동이 안녕을 개선한다. | Mental well-being matters. | 정신적 안녕이 중요하다.
nourish | ˈnɜːrɪʃ | 양분을 주다, 먹여 기르다 | feed, sustain | starve | Good food nourishes the body. | 좋은 음식이 몸에 양분을 준다. | She nourished her children well. | 아이들을 잘 먹여 길렀다.
by means of | baɪ miːnz ɑːv | ~을 통해, ~에 의해 | through, using | without | She communicated by means of email. | 이메일을 통해 소통했다. | Travel by means of public transport. | 대중교통을 통해 이동해라.
as opposed to | æz əˈpoʊzd tuː | ~와 대조적으로, ~가 아니라 | in contrast to, rather than | similar to | She prefers tea as opposed to coffee. | 커피가 아니라 차를 선호한다. | Quality as opposed to quantity. | 양이 아닌 질.
conform to | kənˈfɔːrm tuː | ~을 따르다, 순응하다 | comply with, follow | rebel against | She conformed to the rules. | 규칙을 따랐다. | Everyone should conform to the law. | 모두가 법을 따라야 한다.
on behalf of | ɑːn bɪˈhæf ɑːv | ~을 대신하여, 대표하여 | for, representing | - | She spoke on behalf of the team. | 팀을 대표해 발언했다. | I signed on behalf of the company. | 회사를 대신하여 서명했다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 16-20 appended');
