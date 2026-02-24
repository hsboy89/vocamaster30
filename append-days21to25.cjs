const fs = require('fs');
const path = require('path');

const data = `=== Day 21 ===
fascinate | ˈfæsɪneɪt | 매혹하다, 매료시키다 | captivate, charm | bore | The story fascinated her. | 이야기가 그녀를 매혹했다. | He was fascinated by science. | 과학에 매료되었다.
obsess | əbˈsɛs | 집착하다, 사로잡히다 | fixate, preoccupy | ignore | She is obsessed with fashion. | 패션에 집착한다. | He obsesses over every detail. | 모든 세부사항에 집착한다.
insult | ɪnˈsʌlt | 모욕하다, 모욕 | offend, abuse | compliment | She was insulted by his words. | 그의 말에 모욕당했다. | Don't insult anyone. | 아무에게도 모욕하지 마.
envy | ˈɛnvi | 부러워하다, 시기, 부러움 | jealousy, covet | admiration | She envied her friend's success. | 친구의 성공을 부러워했다. | Envy is a negative emotion. | 시기는 부정적 감정이다.
gratitude | ˈɡrætɪtuːd | 감사, 고마움 | thankfulness, appreciation | ingratitude | She expressed her gratitude. | 감사를 표현했다. | Show gratitude to your parents. | 부모님께 감사를 표해라.
hostile | ˈhɑːstaɪl | 적대적인, 적의 있는 | aggressive, unfriendly | friendly | The crowd became hostile. | 군중이 적대적이 되었다. | She received a hostile reaction. | 적대적 반응을 받았다.
soothe | suːð | 달래다, 진정시키다 | calm, comfort | agitate | She soothed the crying baby. | 우는 아기를 달랬다. | Music soothes the soul. | 음악이 영혼을 달래준다.
overwhelm | ˌoʊvərˈwɛlm | 압도하다, 제압하다 | overpower, crush | underwhelm | She was overwhelmed with work. | 일에 압도당했다. | The team overwhelmed their opponents. | 팀이 상대를 제압했다.
distress | dɪˈstrɛs | 고통, 괴로움, 괴롭히다 | suffering, anguish | comfort | She was in great distress. | 큰 고통 속에 있었다. | The news caused distress. | 소식이 고통을 안겼다.
greed | ɡriːd | 탐욕, 욕심 | avarice, selfishness | generosity | Greed leads to corruption. | 탐욕이 부패로 이어진다. | His greed destroyed his career. | 그의 탐욕이 경력을 망쳤다.
dignity | ˈdɪɡnɪti | 존엄, 품위 | honor, respect | shame | She maintained her dignity. | 품위를 지켰다. | Treat everyone with dignity. | 모두를 존엄하게 대해라.
absurd | əbˈsɜːrd | 어처구니없는, 터무니없는 | ridiculous, silly | reasonable | The suggestion was absurd. | 제안이 터무니없었다. | It is absurd to think that. | 그것을 생각하는 것은 어처구니없다.
crave | kreɪv | 갈망하다, 간절히 원하다 | desire, long for | dislike | She craves chocolate. | 초콜릿을 갈망한다. | He craves attention. | 관심을 갈망한다.
mourn | mɔːrn | 애도하다, 슬퍼하다 | grieve, lament | celebrate | She mourned her grandmother. | 할머니를 애도했다. | The nation mourned the loss. | 나라가 그 손실을 슬퍼했다.
vulnerable | ˈvʌlnərəbl | 취약한, 연약한 | exposed, weak | protected, strong | Children are vulnerable. | 아이들은 취약하다. | The system is vulnerable to attack. | 시스템이 공격에 취약하다.
stubborn | ˈstʌbərn | 고집 센, 완고한 | obstinate, persistent | flexible | She is very stubborn. | 매우 고집이 세다. | His stubborn attitude caused problems. | 완고한 태도가 문제를 일으켰다.
selfish | ˈsɛlfɪʃ | 이기적인 | self-centered, greedy | selfless | Don't be so selfish. | 그렇게 이기적이지 마. | Selfish behavior harms others. | 이기적 행동이 다른 사람을 해친다.
dread | drɛd | 두려워하다, 공포 | fear, terror | anticipate | She dreads public speaking. | 대중 연설을 두려워한다. | The exam fills students with dread. | 시험이 학생들을 공포로 채운다.
terrify | ˈtɛrɪfaɪ | 겁에 질리게 하다 | frighten, scare | comfort | The thunder terrified the child. | 천둥이 아이를 겁에 질리게 했다. | She was terrified of spiders. | 거미를 무서워했다.
sentiment | ˈsɛntɪmənt | 감정, 정서, 의견 | feeling, emotion | reason | Public sentiment changed. | 여론이 바뀌었다. | She expressed her sentiments. | 감정을 표현했다.
contempt | kənˈtɛmpt | 경멸, 멸시 | scorn, disdain | respect | She looked at him with contempt. | 그를 경멸의 눈으로 봤다. | He was held in contempt. | 경멸당했다.
affection | əˈfɛkʃən | 애정, 호감 | love, fondness | hatred | She showed affection to her children. | 자녀에게 애정을 보였다. | He has deep affection for her. | 그녀에 대한 깊은 애정이 있다.
indignant | ɪnˈdɪɡnənt | 분개한, 분노한 | angry, outraged | pleased | She was indignant at the injustice. | 불의에 분개했다. | He gave an indignant response. | 분노한 반응을 보였다.
dull | dʌl | 지루한, 둔한, 칙칙한 | boring, dim | exciting, bright | The lecture was very dull. | 강의가 매우 지루했다. | The knife is dull. | 칼이 무디다.
gratify | ˈɡrætɪfaɪ | 만족시키다, 기쁘게 하다 | satisfy, please | disappoint | She was gratified by the result. | 결과에 만족했다. | His success gratified his parents. | 성공이 부모를 기쁘게 했다.
outlook | ˈaʊtlʊk | 견해, 전망, 시각 | perspective, view | - | She has a positive outlook on life. | 긍정적 인생관이 있다. | The economic outlook is uncertain. | 경제 전망이 불확실하다.
long for | lɔːŋ fɔːr | ~을 갈망하다 | yearn for, crave | dread | She longed for home. | 집을 그리워했다. | He longed for peace. | 평화를 갈망했다.
get over | ɡɛt ˈoʊvər | ~을 극복하다, 낫다 | overcome, recover | succumb to | She got over her illness. | 병에서 나았다. | Get over your fear. | 두려움을 극복해라.
make fun of | meɪk fʌn ɑːv | ~을 놀리다, 비웃다 | tease, mock | praise | Don't make fun of others. | 다른 사람을 놀리지 마. | They made fun of his accent. | 그의 억양을 놀렸다.
be fed up with | biː fɛd ʌp wɪð | ~에 질리다, 신물 나다 | be tired of, be sick of | enjoy | She is fed up with the noise. | 소음에 질렸다. | I'm fed up with waiting. | 기다리다 지쳤다.

=== Day 22 ===
acquire | əˈkwaɪər | 얻다, 습득하다, 인수하다 | gain, obtain | lose | She acquired new skills. | 새로운 기술을 습득했다. | The company acquired a rival. | 회사가 경쟁사를 인수했다.
perceive | pərˈsiːv | 인식하다, 감지하다 | notice, sense | overlook | She perceived a change. | 변화를 감지했다. | It depends on how you perceive it. | 어떻게 인식하느냐에 달렸다.
prospect | ˈprɑːspɛkt | 전망, 가능성, 예상 | outlook, opportunity | - | The job prospects are good. | 취업 전망이 좋다. | She has excellent prospects. | 전망이 훌륭하다.
ambition | æmˈbɪʃən | 야망, 포부, 야심 | aspiration, goal | apathy | She has great ambition. | 큰 야망이 있다. | His ambition drove him forward. | 야망이 그를 앞으로 이끌었다.
virtue | ˈvɜːrtʃuː | 미덕, 장점, 덕 | goodness, merit | vice | Patience is a virtue. | 인내는 미덕이다. | She values the virtue of honesty. | 정직의 미덕을 중시한다.
vice | vaɪs | 악덕, 악습, 부 | sin, flaw | virtue | Gambling is a common vice. | 도박은 흔한 악습이다. | She is the vice president. | 부회장이다.
conscience | ˈkɑːnʃəns | 양심, 도의심 | morals, ethics | - | She has a guilty conscience. | 양심의 가책이 있다. | Follow your conscience. | 양심을 따라라.
prestige | prɛˈstiːʒ | 명성, 위신 | reputation, status | disgrace | The school has great prestige. | 학교가 큰 명성이 있다. | He valued prestige over money. | 돈보다 명성을 중시했다.
diligent | ˈdɪlɪdʒənt | 부지런한, 근면한 | hardworking, industrious | lazy | She is a diligent student. | 부지런한 학생이다. | Diligent work pays off. | 부지런한 노력은 보상받는다.
attain | əˈteɪn | 달성하다, 성취하다 | achieve, reach | fail | She attained her goal. | 목표를 달성했다. | He attained success through effort. | 노력으로 성공을 달성했다.
ambiguous | æmˈbɪɡjuəs | 모호한, 애매한 | vague, unclear | clear, definite | His answer was ambiguous. | 그의 대답이 모호했다. | Avoid ambiguous expressions. | 모호한 표현을 피해라.
integrity | ɪnˈtɛɡrɪti | 진실성, 정직, 완전성 | honesty, principle | corruption | She is a person of integrity. | 진실성이 있는 사람이다. | Integrity is valued in business. | 정직이 사업에서 중시된다.
vague | veɪɡ | 모호한, 막연한 | unclear, ambiguous | clear, precise | She gave a vague answer. | 모호한 대답을 했다. | The plan is still vague. | 계획이 아직 막연하다.
oblige | əˈblaɪdʒ | 의무를 지우다, ~해주다 | require, compel | excuse | She felt obliged to help. | 도와야 할 의무감을 느꼈다. | I would be much obliged. | 감사하겠습니다.
prone to | proʊn tuː | ~하기 쉬운, ~하는 경향이 있는 | likely to, inclined to | resistant to | She is prone to allergies. | 알레르기에 걸리기 쉽다. | He is prone to making mistakes. | 실수를 저지르기 쉽다.
attribute A to B | əˈtrɪbjuːt tuː | A를 B의 탓으로 돌리다 | assign, credit | - | She attributed her success to hard work. | 성공을 노력의 덕분으로 돌렸다. | He attributed the failure to bad luck. | 실패를 불운 탓으로 돌렸다.
consent | kənˈsɛnt | 동의하다, 동의 | agree, approve | refuse | She gave her consent. | 동의를 했다. | Consent is required for surgery. | 수술에는 동의가 필요하다.
deliberate | dɪˈlɪbərɪt | 고의의, 신중한, 숙고하다 | intentional, careful | accidental | It was a deliberate act. | 고의적 행위였다. | She acted in a deliberate manner. | 신중하게 행동했다.
deviate | ˈdiːvieɪt | 벗어나다, 이탈하다 | stray, depart | conform | She deviated from the original plan. | 원래 계획에서 벗어났다. | Don't deviate from the topic. | 주제에서 벗어나지 마.
suppress | səˈ프레스 | 억누르다, 진압하다 | restrain, stifle | express | She suppressed her anger. | 분노를 억눌렀다. | The government suppressed the revolt. | 정부가 반란을 진압했다.
stimulate | ˈstɪmjuleɪt | 자극하다, 촉진하다 | encourage, boost | discourage | Exercise stimulates the brain. | 운동이 뇌를 자극한다. | She stimulated discussion. | 토론을 촉진했다.
thrive | θraɪv | 번성하다, 잘 자라다 | flourish, prosper | decline | Children thrive with love. | 아이들이 사랑으로 잘 자란다. | The business thrived. | 사업이 번성했다.
bewilder | bɪˈwɪldər | 당혹시키다, 어리뚱절하게 하다 | confuse, puzzle | clarify | The complex rules bewildered her. | 복잡한 규칙이 당혹시켰다. | He was bewildered by the result. | 결과에 어리둥절했다.
cling to | klɪŋ tuː | ~에 달라붙다, 집착하다 | hold on to, stick to | let go of | She clung to her mother. | 엄마에게 달라붙었다. | He clings to old traditions. | 오래된 전통에 집착한다.
look down on | lʊk daʊn ɑːn | ~을 깔보다, 무시하다 | despise, scorn | look up to | Don't look down on others. | 다른 사람을 깔보지 마. | She never looks down on anyone. | 아무도 깔보지 않는다.
be accustomed to | biː əˈkʌstəmd tuː | ~에 익숙하다 | be used to, be familiar with | be unfamiliar with | She is accustomed to hard work. | 힘든 일에 익숙하다. | He is accustomed to the cold. | 추위에 익숙하다.
regardless of | rɪˈɡɑːrdlɪs ɑːv | ~에 상관없이 | despite, irrespective of | because of | Try regardless of the result. | 결과에 상관없이 시도해라. | She is loved regardless of everything. | 모든 것에 상관없이 사랑받는다.
give in | ɡɪv ɪn | 항복하다, 굴복하다 | surrender, yield | resist | She refused to give in. | 항복하기를 거부했다. | Don't give in to pressure. | 압력에 굴복하지 마.
come across | kʌm əˈkrɔːs | 우연히 만나다, ~을 발견하다 | encounter, find | - | She came across an old letter. | 오래된 편지를 우연히 발견했다. | He comes across as very friendly. | 매우 친근해 보인다.
as a matter of fact | æz ə ˈmætər ɑːv fækt | 사실은, 실제로 | actually, in fact | - | As a matter of fact, I agree. | 사실 나도 동의한다. | As a matter of fact, she is right. | 실제로 그녀가 맞다.

=== Day 23 ===
archaeology | ˌɑːrkiˈɑːlədʒi | 고고학 | excavation study | - | She studies archaeology. | 고고학을 공부한다. | Archaeology reveals ancient cultures. | 고고학이 고대 문화를 밝힌다.
anthropology | ˌænθrəˈpɑːlədʒi | 인류학 | study of humans | - | She majored in anthropology. | 인류학을 전공했다. | Anthropology examines human cultures. | 인류학이 인간 문화를 연구한다.
geology | dʒiˈɑːlədʒi | 지질학 | earth science | - | She studied geology in university. | 대학에서 지질학을 공부했다. | Geology explains rock formations. | 지질학이 암석 형성을 설명한다.
psychology | saɪˈkɑːlədʒi | 심리학, 심리 | mental science | - | She studied psychology. | 심리학을 공부했다. | Psychology helps understand behavior. | 심리학이 행동 이해를 돕는다.
agriculture | ˈæɡrɪkʌltʃər | 농업, 농경 | farming, cultivation | industry | Agriculture is the main industry. | 농업이 주요 산업이다. | Sustainable agriculture is important. | 지속 가능한 농업이 중요하다.
commerce | ˈkɑːmɜːrs | 상업, 통상, 무역 | trade, business | - | E-commerce is growing rapidly. | 전자상거래가 빠르게 성장하고 있다. | Commerce between the two countries. | 두 나라 간의 무역.
geography | dʒiˈ아ɡrəfi | 지리학, 지형 | topography, terrain | - | She teaches geography. | 지리학을 가르친다. | Korea's geography is mountainous. | 한국의 지형은 산이 많다.
ecology | ɪˈkɑːlədʒi | 생태학, 생태 | ecosystem | - | She studies ecology. | 생태학을 공부한다. | Ecology studies living systems. | 생태학이 생명 체계를 연구한다.
semester | sɪˈmɛstər | 학기 | term, session | - | The semester begins in March. | 학기가 3월에 시작한다. | She took six courses this semester. | 이번 학기에 6과목을 들었다.
diploma | dɪˈploʊmə | 학위증, 졸업장 | degree, certificate | - | She received her diploma. | 졸업장을 받았다. | A high school diploma is required. | 고등학교 졸업장이 필요하다.
curriculum | kəˈrɪkjuləm | 교과과정, 교육과정 | syllabus, program | - | The curriculum was revised. | 교과과정이 개정되었다. | She designed the new curriculum. | 새 교육과정을 설계했다.
scholarship | ˈskɑːlərʃɪp | 장학금, 학문 | grant, fellowship | - | She won a scholarship. | 장학금을 받았다. | The scholarship covers tuition. | 장학금이 등록금을 지원한다.
tutor | ˈtuːtər | 과외교사, 가르치다 | teacher, instructor | student | She hired a math tutor. | 수학 과외 선생을 고용했다. | He tutors students after school. | 방과 후 학생을 가르친다.
faculty | ˈfækəlti | 학부, 교수진, 능력 | staff, professors | students | The entire faculty attended. | 전 교수진이 참석했다. | She joined the university faculty. | 대학 교수진에 합류했다.
discipline | ˈdɪsɪplɪn | 훈련, 규율, 학문 분야 | training, control | chaos | Discipline is key to success. | 규율이 성공의 열쇠이다. | She studies several disciplines. | 여러 학문 분야를 공부한다.
literacy | ˈlɪtərəsi | 문해력, 읽고 쓰기 능력 | reading ability | illiteracy | Improve digital literacy. | 디지털 문해력을 향상시켜라. | Literacy rates are rising globally. | 전 세계적으로 문해율이 높아지고 있다.
dissertation | ˌdɪsərˈteɪʃən | 학위 논문 | thesis, paper | - | She wrote her doctoral dissertation. | 박사 학위 논문을 썼다. | The dissertation was excellent. | 학위 논문이 훌륭했다.
extracurricular | ˌɛkstrəkəˈrɪkjələr | 과외의, 교과외의 | activities, clubs | academic | She does extracurricular activities. | 과외 활동을 한다. | Extracurricular sports are popular. | 과외 스포츠가 인기이다.
comprehend | ˌkɑːmprɪˈhɛnd | 이해하다, 파악하다 | understand, grasp | misunderstand | She couldn't comprehend the theory. | 이론을 이해할 수 없었다. | The text is hard to comprehend. | 텍스트가 이해하기 어렵다.
fluent | ˈ플루언트 | 유창한, 유려한 | proficient, eloquent | stuttering | She is fluent in English. | 영어가 유창하다. | He speaks fluent Korean. | 한국어를 유창하게 한다.
rote | roʊt | 암기, 기계적인 반복 | memorization | understanding | She learned by rote. | 암기로 배웠다. | Rote learning has limitations. | 암기 학습에는 한계가 있다.
assign | əˈsaɪn | 배정하다, 할당하다 | allocate, designate | withdraw | The teacher assigned homework. | 선생님이 숙제를 내줬다. | She was assigned a new task. | 새 과제를 배정받았다.
bachelor | ˈbætʃələr | 학사, 미혼 남성 | graduate, single | - | She earned her bachelor's degree. | 학사 학위를 받았다. | He is still a bachelor. | 아직 미혼이다.
oral | ˈɔːrəl | 구두의, 구술의 | spoken, verbal | written | She passed the oral exam. | 구술 시험을 통과했다. | Oral communication skills are important. | 구두 의사소통 기술이 중요하다.
conference | ˈkɑːnfərəns | 회의, 학회 | meeting, seminar | - | She attended an international conference. | 국제 학회에 참석했다. | The conference starts next week. | 학회가 다음 주에 시작한다.
session | ˈsɛʃən | 회기, 수업, 기간 | meeting, class | recess | The training session lasted two hours. | 교육 시간이 2시간 지속되었다. | She attended every session. | 모든 수업에 참석했다.
enrich | ɪnˈrɪtʃ | 풍요롭게 하다, 풍부하게 하다 | enhance, improve | diminish | Travel enriches your life. | 여행이 삶을 풍요롭게 한다. | The program enriches learning. | 프로그램이 학습을 풍부하게 한다.
academic | ˌækəˈdɛmɪk | 학문의, 학교의, 학자 | scholarly, educational | practical | She has an academic career. | 학자 경력이 있다. | Academic performance improved. | 학업 성적이 향상되었다.
hypothesis | haɪˈpɑːθɪsɪs | 가설 | theory, assumption | fact | She tested her hypothesis. | 가설을 검증했다. | The hypothesis proved correct. | 가설이 옳은 것으로 증명됐다.
institution | ˌɪnstɪˈtuːʃən | 기관, 제도, 시설 | organization, establishment | - | She works at a financial institution. | 금융 기관에서 일한다. | Educational institutions play a vital role. | 교육 기관이 중요한 역할을 한다.
acquaint | əˈkweɪnt | 알게 하다, 익숙하게 하다 | familiarize, introduce | estrange | She acquainted herself with the rules. | 규칙에 익숙해졌다. | Let me acquaint you with our system. | 시스템을 알려드리겠습니다.
figure | ˈfɪɡjər | 숫자, 인물, 체형, 모습 | number, person | - | She is a public figure. | 공인이다. | The figure shows a steady increase. | 수치가 꾸준한 증가를 보여준다.
intellect | ˈɪntəlɛkt | 지성, 지력, 지식인 | mind, intelligence | ignorance | She is a person of great intellect. | 큰 지성의 소유자이다. | Intellect alone is not enough. | 지성만으로는 충분하지 않다.
on the other hand | ɑːn ðə ˈʌðər hænd | 반면에, 한편으로는 | conversely, however | - | On the other hand, it might work. | 반면에 효과가 있을 수 있다. | She is shy; on the other hand, she is bright. | 수줍지만 반면에 밝다.
by all means | baɪ ɔːl miːnz | 물론, 반드시, 어떻게든 | certainly, absolutely | by no means | By all means, go ahead. | 물론, 하세요. | Achieve your goal by all means. | 어떻게든 목표를 달성해라.
face to face | feɪs tuː feɪs | 직접 대면하여 | in person | remotely | They met face to face. | 직접 만났다. | Discuss it face to face. | 직접 대면해서 논의해라.
side by side | saɪd baɪ saɪd | 나란히, 함께 | together, alongside | separately | They walked side by side. | 나란히 걸었다. | We worked side by side. | 함께 일했다.
not to mention | nɑːt tuː ˈmɛnʃən | ~은 말할 것도 없이 | let alone, besides | - | She speaks Korean, not to mention English. | 영어는 말할 것도 없이 한국어를 한다. | She is smart, not to mention hardworking. | 근면한 것은 말할 것도 없이 똑똑하다.
to be frank | tuː biː fræŋk | 솔직히 말하면 | honestly, to be honest | - | To be frank, I disagree. | 솔직히 말하면 동의하지 않는다. | To be frank, it was a bad idea. | 솔직히 말하면 나쁜 생각이었다.
as far as | æz fɑːr æz | ~하는 한, ~까지 | to the extent that | - | As far as I know, she is fine. | 내가 아는 한 그녀는 괜찮다. | As far as possible, be on time. | 가능한 한 제시간에 와라.

=== Day 24 ===
appetite | ˈæpɪtaɪt | 식욕, 욕구 | hunger, desire | aversion | She has a good appetite. | 식욕이 좋다. | He lost his appetite after the news. | 소식 후 식욕을 잃었다.
grain | ɡreɪn | 곡물, 낟알 | cereal, seed | - | Rice is an important grain. | 쌀은 중요한 곡물이다. | She planted grain in the field. | 밭에 곡물을 심었다.
cultivate | ˈkʌltɪveɪt | 경작하다, 재배하다, 기르다 | grow, develop | neglect | She cultivated vegetables. | 채소를 재배했다. | Cultivate good habits. | 좋은 습관을 기르라.
harvest | ˈhɑːrvɪst | 수확하다, 수확 | crop, gather | plant, sow | They harvested wheat in autumn. | 가을에 밀을 수확했다. | The harvest was plentiful. | 수확이 풍성했다.
fertile | ˈfɜːrtaɪl | 비옥한, 다산의 | productive, rich | barren | The soil is very fertile. | 토양이 매우 비옥하다. | She has a fertile imagination. | 풍부한 상상력이 있다.
drought | draʊt | 가뭄, 한발 | dry spell | flood | The drought destroyed the crops. | 가뭄이 작물을 파괴했다. | Drought affects millions of people. | 가뭄이 수백만 명에 영향을 미친다.
irrigation | ˌɪrɪˈɡeɪʃən | 관개, 관수 | watering | drainage | Irrigation systems help farming. | 관개 시스템이 농업을 돕는다. | She designed an irrigation plan. | 관개 계획을 설계했다.
livestock | ˈlaɪvstɑːk | 가축 | cattle, animals | - | She raises livestock. | 가축을 기른다. | Livestock farming is common. | 축산업이 흔하다.
pasture | ˈpæstʃər | 목초지, 방목하다 | meadow, grassland | - | Cows graze on the pasture. | 소가 목초지에서 풀을 뜯는다. | The pasture was green and wide. | 목초지가 푸르고 넓었다.
famine | ˈfæmɪn | 기근, 대기근 | starvation, hunger | plenty | The famine killed millions. | 기근으로 수백만 명이 죽었다. | Famine is a global concern. | 기근이 세계적 관심사이다.
pesticide | ˈpɛstɪsaɪd | 살충제, 농약 | insecticide | - | Reduce the use of pesticides. | 농약 사용을 줄여라. | Organic food avoids pesticides. | 유기농 식품은 농약을 피한다.
staple | ˈsteɪpl | 주요한, 주식, 필수품 | basic, essential | luxury | Rice is a staple food. | 쌀이 주식이다. | Bread is a staple in Europe. | 빵이 유럽의 주식이다.
plow | plaʊ | 쟁기질하다, 쟁기 | till, cultivate | - | She plowed the field. | 밭을 갈았다. | The farmer used a plow. | 농부가 쟁기를 사용했다.
vegetation | ˌvɛdʒɪˈteɪʃən | 초목, 식물 | plants, greenery | bare land | The forest has dense vegetation. | 숲에 빽빽한 초목이 있다. | Vegetation covers the hillside. | 초목이 언덕을 덮고 있다.
yield | jiːld | 산출하다, 양보하다, 수확량 | produce, give way | resist | The farm yielded a good crop. | 농장이 좋은 수확을 냈다. | Yield to oncoming traffic. | 다가오는 차량에 양보해라.
nourish | ˈnɜːrɪʃ | 영양을 주다, 양육하다 | feed, sustain | starve | Healthy food nourishes the body. | 건강한 음식이 몸에 영양을 준다. | She nourished her children well. | 아이들을 잘 양육했다.
dietary | ˈdaɪɪtɛri | 식이의, 음식물의 | nutritional, food | - | Follow a healthy dietary plan. | 건강한 식이 계획을 따라라. | Dietary habits affect health. | 식습관이 건강에 영향을 미친다.
abundant | əˈbʌndənt | 풍부한, 많은 | plentiful, ample | scarce | Natural resources are abundant here. | 여기 천연자원이 풍부하다. | She has abundant energy. | 에너지가 넘친다.
barren | ˈbærən | 척박한, 불모의 | infertile, sterile | fertile | The land is barren. | 땅이 척박하다. | Nothing grows in this barren desert. | 이 불모의 사막에서는 아무것도 자라지 않는다.
decay | dɪˈkeɪ | 썩다, 부패하다, 부패 | rot, decompose | grow | The food started to decay. | 음식이 썩기 시작했다. | Tooth decay is preventable. | 충치는 예방 가능하다.
stale | steɪl | 상한, 신선하지 않은, 진부한 | old, outdated | fresh | The bread went stale. | 빵이 상했다. | Stale ideas need updating. | 진부한 아이디어는 갱신이 필요하다.
thirst | θɜːrst | 갈증, 갈망 | dehydration, craving | satisfaction | She quenched her thirst. | 갈증을 해소했다. | A thirst for knowledge. | 지식에 대한 갈망.
contaminate | kənˈtæmɪneɪt | 오염시키다 | pollute, infect | purify | Chemicals contaminated the water. | 화학물질이 물을 오염시켰다. | Don't contaminate the food. | 음식을 오염시키지 마.
brew | bruː | 양조하다, 끓이다, 양조주 | ferment, make | - | She brewed a cup of tea. | 차 한 잔을 끓였다. | The company brews craft beer. | 회사가 수제 맥주를 양조한다.
raw | rɔː | 날것의, 원래의, 가공되지 않은 | uncooked, natural | cooked, processed | She eats raw fish. | 날생선을 먹는다. | Raw materials are imported. | 원자재가 수입된다.
feast | fiːst | 잔치, 만찬, 진수성찬 | banquet, celebration | famine | They held a grand feast. | 성대한 잔치를 열었다. | It was a feast for the eyes. | 눈이 즐거운 광경이었다.
ingredient | ɪnˈɡriːdiənt | 재료, 성분 | component, element | - | Fresh ingredients make better food. | 신선한 재료가 더 좋은 음식을 만든다. | List all ingredients. | 모든 재료를 나열해라.
ripe | raɪp | 익은, 무르익은 | mature, ready | unripe | The fruit is ripe. | 과일이 익었다. | The time is ripe for change. | 변화의 시기가 무르익었다.
sow | soʊ | 씨를 뿌리다, 파종하다 | plant, seed | reap | She sowed seeds in spring. | 봄에 씨를 뿌렸다. | You reap what you sow. | 뿌린 대로 거둔다.
be used to ~ing | biː juːzd tuː | ~하는 것에 익숙하다 | be accustomed to | - | She is used to waking up early. | 일찍 일어나는 것에 익숙하다. | He is used to cold weather. | 추운 날씨에 익숙하다.
a number of | ə ˈnʌmbər ɑːv | 다수의, 여러 개의 | several, many | few | A number of students participated. | 다수의 학생이 참가했다. | She visited a number of countries. | 여러 나라를 방문했다.
above all | əˈbʌv ɔːl | 무엇보다도 | most importantly | - | Above all, be kind. | 무엇보다도 친절해라. | Above all, safety comes first. | 무엇보다도 안전이 우선이다.
keep in mind | kiːp ɪn maɪnd | ~을 명심하다 | remember, consider | forget | Keep in mind the deadline. | 마감일을 명심해라. | Keep this advice in mind. | 이 충고를 명심해라.
once in a while | wʌns ɪn ə waɪl | 때때로, 가끔 | occasionally, sometimes | always, never | She visits once in a while. | 가끔 방문한다. | We eat out once in a while. | 가끔 외식한다.
now that | naʊ ðæt | ~이므로, ~이니까 | since, because | - | Now that you are here, let's start. | 와 있으니 시작하자. | Now that I think about it, you're right. | 생각해보니 네가 맞다.

=== Day 25 ===
ecosystem | ˈiːkoʊsɪstəm | 생태계 | environment, habitat | - | The ecosystem is fragile. | 생태계가 취약하다. | Protect the marine ecosystem. | 해양 생태계를 보호해라.
deforestation | ˌdiːfɔːrɪˈsteɪʃən | 산림 벌채, 삼림 파괴 | logging, clearing | reforestation | Deforestation destroys habitats. | 산림 벌채가 서식지를 파괴한다. | Stop deforestation now. | 지금 삼림 파괴를 멈춰라.
extinction | ɪkˈstɪŋkʃən | 멸종, 소멸 | disappearance, dying out | survival | Many species face extinction. | 많은 종이 멸종 위기에 있다. | Prevent the extinction of wildlife. | 야생동물의 멸종을 방지해라.
conservation | ˌkɑːnsərˈveɪʃən | 보존, 보호 | preservation, protection | destruction | Wildlife conservation is urgent. | 야생동물 보호가 시급하다. | Energy conservation saves money. | 에너지 절약이 돈을 아낀다.
pollute | pəˈluːt | 오염시키다, 더럽히다 | contaminate, dirty | clean, purify | Factories pollute the air. | 공장이 공기를 오염시킨다. | Don't pollute the ocean. | 바다를 오염시키지 마.
renewable | rɪˈnuːəbl | 재생 가능한, 갱신 가능한 | sustainable, green | nonrenewable | Use renewable energy sources. | 재생 에너지원을 사용해라. | Solar power is renewable. | 태양 에너지는 재생 가능하다.
greenhouse | ˈɡriːnhaʊs | 온실, 온실의 | hothouse | - | The greenhouse effect warms the Earth. | 온실 효과가 지구를 따뜻하게 한다. | She grows plants in a greenhouse. | 온실에서 식물을 기른다.
ozone | ˈoʊzoʊn | 오존 | - | - | The ozone layer protects us. | 오존층이 우리를 보호한다. | Ozone depletion is a concern. | 오존 파괴가 걱정이다.
recycle | ˌriːˈsaɪkəl | 재활용하다 | reuse, repurpose | waste | Recycle plastic bottles. | 플라스틱 병을 재활용해라. | Recycling reduces waste. | 재활용이 쓰레기를 줄인다.
erosion | ɪˈroʊʒən | 침식, 부식 | wearing away, decay | buildup | Soil erosion damages farmland. | 토양 침식이 농지를 손상시킨다. | Water causes erosion. | 물이 침식을 일으킨다.
dump | dʌmp | 버리다, 쓰레기장 | dispose, discard | keep | Don't dump trash here. | 여기에 쓰레기를 버리지 마. | The dump was full. | 쓰레기장이 가득 찼다.
fossil | ˈfɑːsəl | 화석, 화석의 | remains, relic | - | They found a dinosaur fossil. | 공룡 화석을 발견했다. | Fossil fuels cause pollution. | 화석 연료가 오염을 일으킨다.
contaminate | kənˈtæmɪneɪt | 오염시키다 | pollute, infect | purify | Oil contaminated the river. | 기름이 강을 오염시켰다. | Contaminated water is dangerous. | 오염된 물은 위험하다.
exhaust | ɪɡˈzɔːst | 소모하다, 배기가스 | deplete, fume | replenish | She exhausted all resources. | 모든 자원을 소모했다. | Car exhaust pollutes the air. | 자동차 배기가스가 공기를 오염시킨다.
dispose of | dɪˈspoʊz ɑːv | ~을 처분하다, 버리다 | discard, throw away | keep | Dispose of waste properly. | 쓰레기를 올바르게 처분해라. | She disposed of old furniture. | 오래된 가구를 처분했다.
radiate | ˈreɪdieɪt | 발산하다, 방사하다 | emit, spread | absorb | The sun radiates heat. | 태양이 열을 발산한다. | She radiates confidence. | 자신감을 발산한다.
diminish | dɪˈmɪnɪʃ | 줄다, 감소하다, 축소하다 | decrease, reduce | increase | Her influence has diminished. | 그녀의 영향력이 줄었다. | The supply diminished rapidly. | 공급이 빠르게 감소했다.
deteriorate | dɪˈtɪriəreɪt | 악화하다, 쇠퇴하다 | worsen, decline | improve | Her health deteriorated. | 건강이 악화되었다. | The situation continued to deteriorate. | 상황이 계속 악화되었다.
catastrophe | kəˈtæstrəfi | 대재앙, 참사 | disaster, calamity | blessing | The flood was a catastrophe. | 홍수가 대재앙이었다. | We must prevent a climate catastrophe. | 기후 재앙을 막아야 한다.
deplete | dɪˈpliːt | 고갈시키다, 소모하다 | exhaust, drain | replenish | Natural resources are being depleted. | 천연자원이 고갈되고 있다. | The ozone layer is depleted. | 오존층이 고갈되고 있다.
sustainability | səˌsteɪnəˈ비리티 | 지속 가능성 | durability, viability | unsustainability | Sustainability is key for the future. | 지속 가능성이 미래의 열쇠이다. | Focus on environmental sustainability. | 환경적 지속 가능성에 집중해라.
abundance | əˈbʌndəns | 풍부, 다량 | plenty, wealth | scarcity | There is an abundance of water. | 물이 풍부하다. | Nature shows an abundance of life. | 자연이 생명의 풍요를 보여준다.
to a certain extent | tuː ə ˈsɜːrtən ɪkˈstɛnt | 어느 정도까지는 | partially, somewhat | completely | To a certain extent, he is right. | 어느 정도 그가 맞다. | I agree to a certain extent. | 어느 정도 동의한다.
so as to | soʊ æz tuː | ~하기 위해 | in order to | - | She studied hard so as to pass. | 합격하기 위해 열심히 공부했다. | He left early so as to avoid traffic. | 교통 체증을 피하기 위해 일찍 떠났다.
aside from | əˈsaɪd frɑːm | ~을 제외하고, ~외에도 | besides, apart from | - | Aside from English, she speaks French. | 영어 외에 불어도 한다. | Aside from that, everything is fine. | 그것을 제외하면 다 괜찮다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 21-25 appended');
