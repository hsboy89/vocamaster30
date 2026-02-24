const fs = require('fs');
const path = require('path');

const data = `=== Day 11 ===
principle | ˈprɪnsɪpl | 원칙, 원리, 주의 | rule, theory | exception | She has strong principles. | 강한 원칙이 있다. | The principle of equality applies. | 평등의 원칙이 적용된다.
component | kəmˈpoʊnənt | 구성 요소, 부품 | part, element | whole | Each component is essential. | 각 구성 요소가 필수적이다. | The device has many components. | 장치에 많은 부품이 있다.
restore | rɪˈstɔːr | 복원하다, 회복시키다 | repair, renew | damage, destroy | They restored the old building. | 오래된 건물을 복원했다. | Peace was restored. | 평화가 회복됐다.
authority | ɔːˈθɔːrɪti | 권위, 당국, 권한 | power, control | submission | She has the authority to decide. | 결정할 권한이 있다. | The authorities investigated the case. | 당국이 사건을 조사했다.
civil | ˈsɪvəl | 시민의, 민간의, 정중한 | civic, polite | military, rude | Civil rights must be protected. | 시민권이 보호되어야 한다. | She was always civil in discussions. | 토론에서 항상 정중했다.
regulate | ˈrɛɡjuleɪt | 규제하다, 조절하다 | control, manage | deregulate | The government regulates the industry. | 정부가 산업을 규제한다. | Temperature is regulated by the body. | 체온이 몸에 의해 조절된다.
labor | ˈleɪbər | 노동, 노동력, 노동하다 | work, effort | rest, leisure | Labor rights are important. | 노동권이 중요하다. | She went into labor early. | 조기에 진통이 왔다.
rural | ˈrʊrəl | 시골의, 농촌의 | country, agricultural | urban | She grew up in a rural area. | 시골 지역에서 자랐다. | Rural communities need support. | 농촌 지역사회가 지원이 필요하다.
urban | ˈɜːrbən | 도시의, 도회의 | city, metropolitan | rural | Urban areas are densely populated. | 도시 지역은 인구가 밀집되어 있다. | Urban development is rapid. | 도시 발전이 빠르다.
phenomenon | fɪˈnɑːmɪnən | 현상, 경이 | event, occurrence | - | Climate change is a global phenomenon. | 기후 변화는 세계적 현상이다. | It was a remarkable phenomenon. | 놀라운 현상이었다.
democratic | ˌdɛməˈkrætɪk | 민주적인, 민주주의의 | representative, free | authoritarian | The country has a democratic system. | 나라가 민주주의 체제이다. | Democratic values are essential. | 민주적 가치가 필수적이다.
revolution | ˌrɛvəˈluːʃən | 혁명, 회전 | uprising, rebellion | stability | The French Revolution changed history. | 프랑스 혁명이 역사를 바꿨다. | The digital revolution is ongoing. | 디지털 혁명이 진행 중이다.
liberty | ˈlɪbərti | 자유, 해방, 특권 | freedom, independence | slavery | Give me liberty or give me death. | 자유가 아니면 죽음을 달라. | We cherish our liberty. | 우리의 자유를 소중히 여긴다.
congress | ˈkɑːŋɡrɛs | 의회, 회의 | parliament, assembly | - | Congress passed the new law. | 의회가 새 법을 통과시켰다. | She attended the medical congress. | 의학 학회에 참석했다.
inequality | ˌɪnɪˈkwɑːləti | 불평등, 불균등 | disparity, imbalance | equality | Social inequality is increasing. | 사회적 불평등이 증가하고 있다. | Address gender inequality. | 성 불평등을 해결해라.
justice | ˈdʒʌstɪs | 정의, 재판 | fairness, equity | injustice | Justice must be served. | 정의가 실현되어야 한다. | She works in the justice system. | 사법 시스템에서 일한다.
treaty | ˈtriːti | 조약, 협약 | agreement, pact | - | They signed a peace treaty. | 평화 조약에 서명했다. | The treaty was violated. | 조약이 위반됐다.
democracy | dɪˈmɑːkrəsi | 민주주의, 민주 국가 | self-government, republic | dictatorship | Democracy is a form of government. | 민주주의는 정부의 한 형태이다. | She believes in democracy. | 민주주의를 믿는다.
constitution | ˌkɑːnstɪˈtuːʃən | 헌법, 체질 | charter, law | - | The constitution protects rights. | 헌법이 권리를 보호한다. | She has a strong constitution. | 체질이 강하다.
colonial | kəˈloʊniəl | 식민지의, 식민지 시대의 | imperial, settlement | - | Korea suffered during the colonial period. | 한국은 식민지 시대에 고통받았다. | Colonial architecture is distinctive. | 식민지 시대 건축이 특색 있다.
autonomy | ɔːˈtɑːnəmi | 자치, 자치권, 자율 | independence, self-rule | dependence | The region gained autonomy. | 지역이 자치권을 얻었다. | She values her autonomy. | 자율성을 소중히 여긴다.
regime | reɪˈʒiːm | 정권, 체제 | government, system | - | The regime was overthrown. | 정권이 전복되었다. | A new regime came to power. | 새 정권이 들어섰다.
monarchy | ˈmɑːnərki | 군주제, 왕정 | kingdom, royalty | republic | Britain has a constitutional monarchy. | 영국은 입헌 군주제이다. | The monarchy was abolished. | 왕정이 폐지되었다.
parliament | ˈpɑːrləmənt | 의회, 국회 | legislature, congress | - | Parliament voted on the bill. | 의회가 법안에 투표했다. | She was elected to parliament. | 의회에 선출되었다.
amendment | əˈmɛndmənt | 개정, 수정, 수정안 | revision, change | - | The amendment was approved. | 수정안이 승인되었다. | Make an amendment to the contract. | 계약서를 수정해라.
impose | ɪmˈpoʊz | 부과하다, 강요하다 | enforce, apply | remove, lift | The government imposed a new tax. | 정부가 새 세금을 부과했다. | She imposed strict rules. | 엄격한 규칙을 강요했다.
prohibition | ˌproʊɪˈbɪʃən | 금지, 금지령 | ban, restriction | permission | The prohibition of smoking is enforced. | 흡연 금지가 시행된다. | Alcohol prohibition was lifted. | 알코올 금지령이 해제됐다.
sovereignty | ˈsɑːvrɪnti | 주권, 통치권 | authority, dominion | submission | National sovereignty must be respected. | 국가 주권이 존중되어야 한다. | They defended their sovereignty. | 주권을 지켰다.
republic | rɪˈpʌblɪk | 공화국, 공화정 | democracy, commonwealth | monarchy | South Korea is a republic. | 대한민국은 공화국이다. | The republic was established. | 공화국이 수립되었다.
alliance | əˈlaɪəns | 동맹, 연합 | union, partnership | opposition | The two countries formed an alliance. | 두 나라가 동맹을 맺었다. | The alliance was beneficial. | 동맹이 유익했다.
dominate | ˈdɑːmɪneɪt | 지배하다, 우세하다 | control, rule | submit, yield | She dominated the competition. | 대회를 지배했다. | The company dominates the market. | 회사가 시장을 지배한다.
exploit | ɪkˈsplɔɪt | 착취하다, 이용하다, 위업 | use, take advantage of | protect | Don't exploit vulnerable people. | 취약한 사람을 착취하지 마. | His exploits were legendary. | 그의 위업은 전설적이었다.
census | ˈsɛnsəs | 인구 조사, 국세 조사 | count, survey | - | The census is conducted every ten years. | 인구 조사가 10년마다 실시된다. | The census data is available. | 인구 조사 데이터를 이용 가능하다.
migrate | ˈmaɪɡreɪt | 이주하다, 이동하다 | move, relocate | stay, remain | Birds migrate south in winter. | 새들이 겨울에 남쪽으로 이동한다. | Many people migrate for work. | 많은 사람이 일 때문에 이주한다.
ethnic | ˈɛθnɪk | 민족의, 인종의 | racial, cultural | - | She studies ethnic diversity. | 민족 다양성을 연구한다. | Ethnic minorities need protection. | 소수 민족이 보호가 필요하다.
on account of | ɑːn əˈkaʊnt ɑːv | ~때문에 | because of, due to | despite | She was absent on account of illness. | 병 때문에 결석했다. | On account of the rain, the event was canceled. | 비 때문에 행사가 취소되었다.
regardless of | rɪˈɡɑːrdlɪs ɑːv | ~에 상관없이 | irrespective of, despite | because of | She helps everyone regardless of age. | 나이에 상관없이 모두를 돕는다. | Regardless of the cost, we will proceed. | 비용에 상관없이 진행할 것이다.
in response to | ɪn rɪˈspɑːns tuː | ~에 대한 반응으로 | in reaction to, answering | despite | In response to the crisis, aid was sent. | 위기에 대응해 구호품이 보내졌다. | The policy was changed in response to demands. | 요구에 대한 반응으로 정책이 변했다.
=== Day 12 ===
phenomenon | fɪˈnɑːmɪnən | 현상, 사건 | event, occurrence | - | It's a natural phenomenon. | 자연 현상이다. | The phenomenon was studied closely. | 현상이 면밀히 연구되었다.
theory | ˈθɪəri | 이론, 학설, 추측 | hypothesis, principle | practice | Darwin's theory of evolution. | 다윈의 진화론. | In theory, it should work. | 이론적으로 작동해야 한다.
laboratory | ˈlæbrətɔːri | 실험실, 연구소 | lab, research center | - | She works in the laboratory. | 실험실에서 일한다. | The laboratory tests were conclusive. | 실험실 검사가 결론적이었다.
hypothesis | haɪˈpɑːθəsɪs | 가설, 추정 | theory, assumption | fact, proof | She tested her hypothesis. | 가설을 검증했다. | The hypothesis was rejected. | 가설이 기각되었다.
gravity | ˈɡrævɪti | 중력, 중대함 | force, seriousness | levity | Gravity pulls objects down. | 중력이 물체를 아래로 당긴다. | She understood the gravity of the situation. | 상황의 중대성을 이해했다.
radiation | ˌreɪdiˈeɪʃən | 방사선, 복사 | emission, rays | - | Radiation can be dangerous. | 방사선이 위험할 수 있다. | The sun emits radiation. | 태양이 방사선을 방출한다.
molecule | ˈmɑːlɪkjuːl | 분자 | particle, atom | - | Water is made of molecules. | 물은 분자로 이루어져 있다. | The molecule structure was analyzed. | 분자 구조를 분석했다.
species | ˈspiːʃiːz | 종, 유형 | type, kind | - | Many species are endangered. | 많은 종이 멸종 위기에 있다. | She studied a new species of bird. | 새로운 새 종을 연구했다.
experiment | ɪkˈspɛrɪmənt | 실험, 실험하다 | test, trial | theory | The experiment was successful. | 실험이 성공적이었다. | She experimented with new methods. | 새 방법으로 실험했다.
evidence | ˈɛvɪdəns | 증거, 근거 | proof, testimony | disproof | The evidence supports the theory. | 증거가 이론을 뒷받침한다. | There is no evidence of wrongdoing. | 잘못된 행동의 증거가 없다.
organism | ˈɔːrɡənɪzəm | 유기체, 생물 | creature, being | - | An amoeba is a single-celled organism. | 아메바는 단세포 유기체이다. | Every organism needs water. | 모든 유기체에 물이 필요하다.
oxygen | ˈɑːksɪdʒən | 산소 | air, O2 | - | Plants produce oxygen. | 식물이 산소를 생산한다. | Oxygen is essential for life. | 산소는 생명에 필수적이다.
carbon | ˈkɑːrbən | 탄소 | element, C | - | Carbon dioxide is a greenhouse gas. | 이산화탄소는 온실 가스이다. | Reduce your carbon footprint. | 탄소 발자국을 줄여라.
bacteria | bækˈtɪriə | 박테리아, 세균 | germs, microbes | - | Bacteria can cause disease. | 세균이 병을 일으킬 수 있다. | Some bacteria are beneficial. | 일부 세균은 유익하다.
virus | ˈvaɪrəs | 바이러스, 병독 | pathogen, infection | - | The virus spread quickly. | 바이러스가 빠르게 퍼졌다. | A computer virus damaged the files. | 컴퓨터 바이러스가 파일을 손상시켰다.
cell | sɛl | 세포, 전지, 독방 | unit, chamber | - | The human body has trillions of cells. | 인체에 수조 개의 세포가 있다. | She studied cell biology. | 세포 생물학을 공부했다.
protein | ˈproʊtiːn | 단백질 | nutrient, amino acid | - | Meat is high in protein. | 고기에 단백질이 풍부하다. | Protein helps build muscles. | 단백질이 근육 형성을 돕는다.
tissue | ˈtɪʃuː | 조직, 세포 조직, 티슈 | fabric, membrane | - | Muscle tissue was damaged. | 근육 조직이 손상되었다. | Pass me a tissue, please. | 티슈 좀 주세요.
gene | dʒiːn | 유전자 | DNA, chromosome | - | Genes carry hereditary information. | 유전자가 유전 정보를 전달한다. | His eye color is determined by genes. | 눈 색깔이 유전자에 의해 결정된다.
habitat | ˈhæbɪtæt | 서식지, 거주지 | environment, home | - | The habitat was destroyed. | 서식지가 파괴됐다. | This is a natural habitat for tigers. | 호랑이의 자연 서식지이다.
ecosystem | ˈiːkoʊsɪstəm | 생태계 | biome, environment | - | Pollution damages the ecosystem. | 오염이 생태계를 훼손한다. | The ecosystem is delicate. | 생태계가 섬세하다.
extinct | ɪkˈstɪŋkt | 멸종한, 사라진 | dead, vanished | alive, existing | Dinosaurs are extinct. | 공룡이 멸종했다. | Many species are becoming extinct. | 많은 종이 멸종하고 있다.
evolution | ˌɛvəˈluːʃən | 진화, 발달 | development, growth | regression | She studied the theory of evolution. | 진화론을 공부했다. | The evolution of technology is fascinating. | 기술의 진화가 매력적이다.
geology | dʒiˈɑːlədʒi | 지질학 | earth science | - | She studied geology at university. | 대학에서 지질학을 공부했다. | The geology of the area is unique. | 그 지역의 지질이 독특하다.
substance | ˈsʌbstəns | 물질, 성분, 본질 | matter, material | - | A toxic substance was found. | 독성 물질이 발견됐다. | What is this substance? | 이 물질이 무엇인가?
compound | ˈkɑːmpaʊnd | 화합물, 합성의, 결합하다 | mixture, blend | element | Water is a chemical compound. | 물은 화합물이다. | The compound was analyzed. | 화합물이 분석되었다.
dimension | dɪˈmɛnʃən | 차원, 치수, 규모 | measurement, aspect | - | Measure the dimensions of the room. | 방의 치수를 측정해라. | There are multiple dimensions to the problem. | 문제에 여러 차원이 있다.
formula | ˈfɔːrmjələ | 공식, 방법, 처방 | equation, recipe | - | She used the mathematical formula. | 수학 공식을 사용했다. | The formula for success is hard work. | 성공의 공식은 열심히 하는 것이다.
microscope | ˈmaɪkrəskoʊp | 현미경 | magnifier | telescope | She examined the cells under a microscope. | 현미경으로 세포를 관찰했다. | The microscope revealed tiny organisms. | 현미경이 미세 유기체를 보여줬다.
nucleus | ˈnuːkliəs | 핵, 원자핵, 세포핵 | core, center | - | The nucleus contains genetic material. | 핵에 유전 물질이 있다. | The atomic nucleus is very small. | 원자핵은 매우 작다.
equation | ɪˈkweɪʒən | 등식, 방정식 | formula, calculation | - | She solved the equation. | 방정식을 풀었다. | The equation was complex. | 방정식이 복잡했다.
rotate | roʊˈteɪt | 회전하다, 교대하다 | spin, turn | stop | The earth rotates on its axis. | 지구가 축을 중심으로 회전한다. | Farmers rotate crops. | 농부들이 작물을 교대 재배한다.
orbit | ˈɔːrbɪt | 궤도, 돌다 | circle, path | - | The Earth orbits the Sun. | 지구가 태양 주위를 돈다. | The satellite is in orbit. | 위성이 궤도에 있다.
frequency | ˈfriːkwənsi | 빈도, 주파수 | rate, occurrence | rarity | The frequency of accidents decreased. | 사고의 빈도가 감소했다. | Radio waves have different frequencies. | 전파에 다른 주파수가 있다.
particle | ˈpɑːrtɪkəl | 입자, 미립자 | fragment, speck | whole | Dust particles are tiny. | 먼지 입자가 아주 작다. | She studied subatomic particles. | 아원자 입자를 연구했다.
stem | stɛm | 줄기, 유래하다 | stalk, originate | - | The stem supports the flower. | 줄기가 꽃을 지탱한다. | The problem stems from lack of funding. | 문제가 자금 부족에서 유래한다.
stimulate | ˈstɪmjuleɪt | 자극하다, 격려하다 | encourage, motivate | discourage | Coffee stimulates the brain. | 커피가 뇌를 자극한다. | She stimulated the discussion. | 토론을 활성화했다.
be composed of | biː kəmˈpoʊzd ɑːv | ~으로 구성되다 | consist of, be made of | - | Water is composed of hydrogen and oxygen. | 물은 수소와 산소로 구성된다. | The team is composed of experts. | 팀이 전문가로 구성된다.
derive from | dɪˈraɪv frɑːm | ~에서 유래하다 | originate from, come from | - | The word derives from Latin. | 이 단어는 라틴어에서 유래한다. | She derives pleasure from reading. | 독서에서 즐거움을 얻는다.
result in | rɪˈzʌlt ɪn | ~을 초래하다, 야기하다 | lead to, cause | prevent | The delay resulted in failure. | 지연이 실패를 초래했다. | His efforts resulted in success. | 그의 노력이 성공을 가져왔다.
=== Day 13 ===
anxiety | æŋˈzaɪəti | 불안, 걱정, 근심 | worry, unease | calm, composure | She suffers from anxiety. | 불안에 시달린다. | The exam caused great anxiety. | 시험이 큰 불안을 일으켰다.
cognitive | ˈkɑːɡnɪtɪv | 인지의, 인식의 | mental, intellectual | - | Cognitive development is important for children. | 인지 발달이 아이에게 중요하다. | She studies cognitive psychology. | 인지 심리학을 공부한다.
consciousness | ˈkɑːnʃəsnɪs | 의식, 자각, 지각 | awareness, perception | unconsciousness | She lost consciousness briefly. | 잠시 의식을 잃었다. | Raise environmental consciousness. | 환경 의식을 높여라.
therapy | ˈθɛrəpi | 치료, 요법 | treatment, cure | - | She goes to therapy once a week. | 일주일에 한 번 치료를 받는다. | Physical therapy helped her recover. | 물리 치료가 회복을 도왔다.
disorder | dɪsˈɔːrdər | 장애, 질환, 혼란 | condition, illness | order, health | She was diagnosed with an eating disorder. | 섭식 장애 진단을 받았다. | Mental disorders need treatment. | 정신 장애는 치료가 필요하다.
psychology | saɪˈkɑːlədʒi | 심리학, 심리 | mental science | - | She majored in psychology. | 심리학을 전공했다. | Psychology helps us understand behavior. | 심리학은 행동을 이해하는 데 도움이 된다.
perception | pərˈsɛpʃən | 인식, 지각, 인지 | awareness, understanding | misunderstanding | Perception varies from person to person. | 인식은 사람마다 다르다. | Public perception has changed. | 대중의 인식이 변했다.
stimulus | ˈstɪmjələs | 자극, 자극제 | incentive, motivation | deterrent | The response to the stimulus was measured. | 자극에 대한 반응이 측정되었다. | Economic stimulus was provided. | 경제 자극책이 제공되었다.
instinct | ˈɪnstɪŋkt | 본능, 직감 | intuition, impulse | reason, logic | Survival is a basic instinct. | 생존은 기본 본능이다. | She followed her instinct. | 본능을 따랐다.
conscious | ˈkɑːnʃəs | 의식하는, 자각하는 | aware, alert | unconscious | She was conscious of being watched. | 누군가 지켜보는 것을 의식했다. | He made a conscious effort. | 의식적으로 노력했다.
curiosity | ˌkjʊriˈɑːsəti | 호기심, 궁금증 | inquisitiveness, interest | indifference | Curiosity drives learning. | 호기심이 학습을 유발한다. | Her curiosity led to discovery. | 호기심이 발견으로 이어졌다.
emotion | ɪˈmoʊʃən | 감정, 정서 | feeling, sentiment | apathy | She could not control her emotions. | 감정을 제어할 수 없었다. | Music evokes strong emotions. | 음악이 강한 감정을 불러일으킨다.
trait | treɪt | 특성, 특징 | characteristic, quality | - | Kindness is her best trait. | 친절함이 가장 좋은 특징이다. | Personality traits are inherited. | 성격 특성은 유전된다.
tendency | ˈtɛndənsi | 경향, 성향 | inclination, trend | - | She has a tendency to procrastinate. | 미루는 경향이 있다. | The tendency continued. | 경향이 계속됐다.
adolescent | ˌædəˈlɛsənt | 청소년, 사춘기의 | teenager, youth | adult | Adolescent behavior can be challenging. | 청소년의 행동이 어려울 수 있다. | She works with adolescents. | 청소년과 일한다.
rational | ˈræʃənəl | 이성적인, 합리적인 | logical, sensible | irrational | Make a rational decision. | 합리적 결정을 해라. | She is very rational. | 매우 이성적이다.
bias | ˈbaɪəs | 편견, 편향 | prejudice, favoritism | fairness, impartiality | Cultural bias can be harmful. | 문화적 편견이 해로울 수 있다. | The study showed a gender bias. | 연구가 성별 편향을 보여줬다.
empathy | ˈɛmpəθi | 공감, 감정이입 | compassion, understanding | apathy | She showed empathy for others. | 다른 사람에 대한 공감을 보여줬다. | Empathy is essential in counseling. | 상담에서 공감이 필수적이다.
subconscious | sʌbˈkɑːnʃəs | 잠재의식의, 잠재의식 | unconscious, hidden | conscious | The decision was subconscious. | 결정이 잠재의식적이었다. | Fears exist in the subconscious. | 두려움이 잠재의식에 존재한다.
temperament | ˈtɛmpərəmənt | 기질, 성미 | nature, disposition | - | She has a calm temperament. | 차분한 기질이 있다. | Temperament affects behavior. | 기질이 행동에 영향을 미친다.
behavior | bɪˈheɪvjər | 행동, 행위, 태도 | conduct, manner | - | His behavior was inappropriate. | 행동이 부적절했다. | Observe the animals' behavior. | 동물의 행동을 관찰해라.
depression | dɪˈprɛʃən | 우울증, 불경기 | sadness, recession | happiness, boom | She is being treated for depression. | 우울증 치료를 받고 있다. | The Great Depression affected millions. | 대공황이 수백만 명에 영향을 미쳤다.
intellectual | ˌɪntəˈlɛktʃuəl | 지적인, 지식인 | scholarly, academic | foolish | She is an intellectual person. | 지적인 사람이다. | Intellectual freedom is important. | 지적 자유가 중요하다.
diagnose | ˈdaɪəɡnoʊz | 진단하다 | identify, determine | misdiagnose | The doctor diagnosed the illness. | 의사가 질병을 진단했다. | She was diagnosed with flu. | 독감 진단을 받았다.
symptom | ˈsɪmptəm | 증상, 징후 | sign, indication | cure | The main symptom is fever. | 주요 증상은 열이다. | These are symptoms of the disease. | 이것이 질병의 증상이다.
fatigue | fəˈtiːɡ | 피로, 피로감 | tiredness, exhaustion | energy, vigor | Chronic fatigue is a common issue. | 만성 피로가 흔한 문제이다. | She suffered from mental fatigue. | 정신적 피로에 시달렸다.
addiction | əˈdɪkʃən | 중독, 탐닉 | dependence, obsession | freedom, sobriety | She overcame her addiction. | 중독을 극복했다. | Phone addiction is growing. | 핸드폰 중독이 증가하고 있다.
phobia | ˈfoʊbiə | 공포증, 혐오 | fear, dread | courage, confidence | She has a phobia of spiders. | 거미 공포증이 있다. | Many people have some type of phobia. | 많은 사람이 어떤 종류의 공포증이 있다.
hallucination | həˌluːsɪˈneɪʃən | 환각, 환영 | illusion, delusion | reality | He experienced hallucinations. | 환각을 경험했다. | The medicine caused hallucinations. | 약이 환각을 일으켰다.
meditation | ˌmɛdɪˈteɪʃən | 명상, 묵상 | contemplation, reflection | - | Meditation reduces stress. | 명상이 스트레스를 줄인다. | She practices meditation daily. | 매일 명상을 한다.
placebo | pləˈsiːboʊ | 위약, 플라시보 | dummy, inactive pill | medicine | The placebo had no real effect. | 위약은 실제 효과가 없었다. | The placebo effect is well-documented. | 플라시보 효과가 잘 기록되어 있다.
obsession | əbˈsɛʃən | 집착, 강박관념 | fixation, preoccupation | indifference | She has an obsession with cleanliness. | 청결에 대한 집착이 있다. | His obsession grew stronger. | 집착이 더 강해졌다.
trauma | ˈtraʊmə | 트라우마, 정신적 외상 | shock, injury | healing | She is recovering from trauma. | 트라우마에서 회복 중이다. | Childhood trauma can last a lifetime. | 유년기 트라우마가 평생 갈 수 있다.
suppress | səˈprɛs | 억누르다, 진압하다, 억제하다 | restrain, control | express, release | She suppressed her anger. | 분노를 억눌렀다. | The government suppressed the protest. | 정부가 시위를 진압했다.
rehabilitation | ˌriːhəˌbɪlɪˈteɪʃən | 재활, 복원 | recovery, restoration | - | She is in rehabilitation. | 재활 중이다. | The rehabilitation program was successful. | 재활 프로그램이 성공적이었다.
be associated with | biː əˈsoʊʃieɪtɪd wɪð | ~와 관련되다 | be connected with | - | Smoking is associated with cancer. | 흡연이 암과 관련된다. | Stress is associated with health problems. | 스트레스가 건강 문제와 관련된다.
suffer from | ˈsʌfər frɑːm | ~를 앓다, 시달리다 | be afflicted by | recover from | She suffers from headaches. | 두통에 시달린다. | He suffers from insomnia. | 불면증을 앓고 있다.
result from | rɪˈzʌlt frɑːm | ~에서 비롯되다 | stem from, arise from | cause | The problem resulted from neglect. | 문제가 방치에서 비롯됐다. | His success resulted from hard work. | 성공이 열심히 한 것에서 비롯됐다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 11-13 appended');
