const fs = require('fs');
const path = require('path');

const data = `=== Day 26 ===
enterprise | ˈɛntərpraɪz | 기업, 사업, 모험심 | business, venture | - | She runs a small enterprise. | 작은 기업을 운영한다. | The enterprise was successful. | 사업이 성공적이었다.
revenue | ˈrɛvənjuː | 수입, 세입, 매출 | income, earnings | expense | The company's revenue increased. | 회사 매출이 증가했다. | Government revenue comes from taxes. | 정부 세입이 세금에서 나온다.
transaction | trænˈzækʃən | 거래, 처리 | deal, exchange | - | She completed the transaction. | 거래를 완료했다. | Online transactions are convenient. | 온라인 거래가 편리하다.
tariff | ˈtærɪf | 관세, 요금표 | duty, tax | - | The government raised tariffs. | 정부가 관세를 올렸다. | Tariffs affect trade. | 관세가 무역에 영향을 미친다.
deficit | ˈdɛfɪsɪt | 적자, 부족 | shortage, loss | surplus | The country has a trade deficit. | 나라에 무역 적자가 있다. | The budget deficit grew. | 재정 적자가 커졌다.
surplus | ˈsɜːrpləs | 잉여, 과잉, 흑자 | excess, extra | deficit | There is a food surplus. | 식량 잉여가 있다. | The country has a trade surplus. | 무역 흑자가 있다.
recession | rɪˈsɛʃən | 불경기, 경기 침체 | downturn, slump | boom | The economy is in recession. | 경제가 불경기이다. | The recession affected everyone. | 불경기가 모두에게 영향을 미쳤다.
inflation | ɪnˈfleɪʃən | 인플레이션, 물가 상승 | price rise | deflation | Inflation is increasing. | 인플레이션이 증가하고 있다. | Inflation erodes purchasing power. | 인플레이션이 구매력을 약화시킨다.
currency | ˈkɜːrənsi | 통화, 화폐 | money, cash | - | The local currency is the won. | 현지 통화가 원화이다. | Currency exchange rates fluctuate. | 통화 환율이 변동한다.
bankruptcy | ˈbæŋkrʌptsi | 파산, 도산 | insolvency, failure | prosperity | The company filed for bankruptcy. | 회사가 파산 신청을 했다. | Bankruptcy destroyed his business. | 파산이 사업을 망쳤다.
monopoly | məˈnɑːpəli | 독점, 전매 | control, dominance | competition | The company has a monopoly. | 회사가 독점을 가지고 있다. | Break the monopoly. | 독점을 깨라.
dividend | ˈdɪvɪdɛnd | 배당금, 이익 | payout, share | - | She received dividends. | 배당금을 받았다. | The company paid a dividend. | 회사가 배당금을 지급했다.
speculate | ˈ스펙큘레이트 | 투기하다, 추측하다 | guess, gamble | know | He speculated in real estate. | 부동산에 투기했다. | Don't speculate about the future. | 미래를 추측하지 마.
audit | ˈɔːdɪt | 감사하다, 감사 | inspect, examine | - | The company was audited. | 회사가 감사를 받았다. | An annual audit is required. | 연간 감사가 필요하다.
subsidiary | səbˈsɪdiɛri | 자회사, 보조의 | branch, affiliate | parent company | The subsidiary operates independently. | 자회사가 독립적으로 운영된다. | She works at a subsidiary. | 자회사에서 일한다.
quota | ˈkwoʊtə | 할당량, 쿼터 | limit, share | - | The import quota was set. | 수입 할당량이 설정되었다. | She met her sales quota. | 판매 할당량을 달성했다.
accumulate | əˈkjuːmjuleɪt | 축적하다, 모으다 | gather, collect | spend, disperse | She accumulated wealth over time. | 시간이 지남에 따라 부를 축적했다. | Dust accumulates on the shelf. | 선반에 먼지가 쌓인다.
fluctuate | ˈ플럭츄에이트 | 변동하다, 오르내리다 | vary, change | stabilize | Prices fluctuate daily. | 가격이 매일 변동한다. | The temperature fluctuates. | 온도가 오르내린다.
offset | ˈɑːfsɛt | 상쇄하다, 벌충하다 | balance, compensate | - | Gains offset the losses. | 이점이 손실을 상쇄했다. | She offset expenses with income. | 수입으로 지출을 상쇄했다.
thrift | θrɪft | 절약, 검소 | frugality, saving | waste | Thrift is a good habit. | 절약은 좋은 습관이다. | She shops at thrift stores. | 중고품 가게에서 쇼핑한다.
liquidate | ˈlɪkwɪdeɪt | 청산하다, 정리하다 | sell off, settle | invest | The company liquidated its assets. | 회사가 자산을 청산했다. | She liquidated her investments. | 투자를 정리했다.
lucrative | ˈluːkrətɪv | 수익성이 높은 | profitable, rewarding | unprofitable | It was a lucrative deal. | 수익성이 높은 거래였다. | She found a lucrative career. | 수익성 있는 직업을 찾았다.
amount to | əˈmaʊnt tuː | 총 ~이 되다, ~에 이르다 | total, equal | - | The bill amounted to $500. | 청구서가 500달러가 되었다. | His savings amounted to a lot. | 저축이 상당한 양에 달했다.
at the expense of | æt ðə ɪkˈspɛns ɑːv | ~을 희생하고, ~의 비용으로 | at the cost of | - | She succeeded at the expense of her health. | 건강을 희생하고 성공했다. | Don't grow at the expense of quality. | 품질을 희생하고 성장하지 마.

=== Day 27 ===
nutrition | njuːˈtrɪʃən | 영양, 영양 섭취 | nourishment, diet | malnutrition | Good nutrition keeps you healthy. | 좋은 영양이 건강을 유지한다. | She studied nutrition. | 영양학을 공부했다.
metabolism | mɪˈtæbəlɪzəm | 신진대사, 대사 | body process | - | Exercise boosts metabolism. | 운동이 신진대사를 높인다. | Her metabolism is fast. | 신진대사가 빠르다.
digest | daɪˈdʒɛst | 소화하다, 이해하다 | absorb, process | - | She couldn't digest the meal. | 식사를 소화할 수 없었다. | Digest the information slowly. | 정보를 천천히 소화해라.
calories | ˈkæləriːz | 칼로리, 열량 | energy, joules | - | Watch your calorie intake. | 칼로리 섭취를 주의해라. | She burns calories by running. | 달리기로 칼로리를 태운다.
protein | ˈproʊtiːn | 단백질 | nutrient | - | Eat enough protein. | 충분한 단백질을 먹어라. | Protein builds muscle. | 단백질이 근육을 만든다.
vitamin | ˈvaɪtəmɪn | 비타민 | nutrient, supplement | - | She takes vitamin C daily. | 매일 비타민 C를 먹는다. | Vitamins are essential for health. | 비타민이 건강에 필수이다.
mineral | ˈmɪnərəl | 광물, 무기질 | element, nutrient | - | Iron is an important mineral. | 철분은 중요한 무기질이다. | Mineral water is popular. | 미네랄 워터가 인기이다.
fiber | ˈfaɪbər | 섬유, 섬유질 | thread, roughage | - | Eat foods rich in fiber. | 섬유질이 풍부한 음식을 먹어라. | Optical fiber carries data. | 광섬유가 데이터를 전달한다.
edible | ˈɛdɪbl | 먹을 수 있는, 식용의 | eatable, safe to eat | inedible | These berries are edible. | 이 열매는 먹을 수 있다. | Not all mushrooms are edible. | 모든 버섯이 식용은 아니다.
allergen | ˈælərdʒən | 알레르기 유발 물질 | irritant | - | Check for allergens in food. | 음식에서 알레르기 유발 물질을 확인해라. | Peanuts are a common allergen. | 땅콩은 흔한 알레르기 유발 물질이다.

=== Day 28 ===
hemisphere | ˈhɛmɪsfɪr | 반구 | half | - | Korea is in the northern hemisphere. | 한국은 북반구에 있다. | The southern hemisphere has opposite seasons. | 남반구는 계절이 반대이다.
latitude | ˈlætɪtuːd | 위도, 자유 | parallel | longitude | Seoul is at 37 degrees latitude. | 서울은 위도 37도에 있다. | The latitude affects the climate. | 위도가 기후에 영향을 미친다.
longitude | ˈlɑːndʒɪtuːd | 경도 | meridian | latitude | She measured the longitude. | 경도를 측정했다. | Longitude runs north-south. | 경도가 남북으로 이어진다.
altitude | ˈæltɪtuːd | 고도, 해발 | height, elevation | depth | The plane flew at high altitude. | 비행기가 높은 고도에서 날았다. | The altitude affects breathing. | 고도가 호흡에 영향을 미친다.
terrain | təˈreɪn | 지형, 지대 | landscape, ground | - | The terrain is mountainous. | 지형이 산악이다. | The vehicle handles rough terrain. | 차량이 거친 지형을 잘 다룬다.
peninsula | pəˈnɪnsələ | 반도 | cape | island | Korea is a peninsula. | 한국은 반도이다. | The peninsula is surrounded by water. | 반도가 물로 둘러싸여 있다.
continent | ˈkɑːntɪnənt | 대륙 | mainland | island | Asia is the largest continent. | 아시아가 가장 큰 대륙이다. | She traveled across the continent. | 대륙을 가로질러 여행했다.
offshore | ˈɔːfʃɔːr | 연안의, 근해의, 해외의 | coastal, overseas | onshore | Offshore drilling is risky. | 연안 시추가 위험하다. | She works at an offshore company. | 해외 회사에서 일한다.
navigate | ˈnævɪɡeɪt | 항해하다, 길을 찾다 | steer, guide | - | She navigated through the city. | 도시를 누볐다. | Use GPS to navigate. | GPS를 사용해 길을 찾아라.
expedition | ˌɛkspɪˈdɪʃən | 탐험, 원정 | journey, exploration | - | They went on an expedition. | 탐험을 떠났다. | The expedition reached the summit. | 원정대가 정상에 도달했다.

=== Day 29 ===
ethnic | ˈɛθnɪk | 민족의, 인종의 | racial, cultural | - | Ethnic diversity enriches society. | 민족 다양성이 사회를 풍요롭게 한다. | She studied ethnic cuisines. | 민족 요리를 공부했다.
council | ˈkaʊnsəl | 의회, 위원회 | committee, board | - | The city council met today. | 시의회가 오늘 만났다. | She was elected to the council. | 의회에 선출되었다.
counsel | ˈkaʊnsəl | 상담하다, 조언, 변호사 | advise, guide | - | She counseled troubled youth. | 어려운 청소년을 상담했다. | Seek legal counsel. | 법률 자문을 구해라.
hospitality | ˌhɑːspɪˈtæləti | 환대, 접대 | welcome, friendliness | hostility | Korean hospitality is famous. | 한국의 환대는 유명하다. | She works in the hospitality industry. | 접객업에서 일한다.
hostility | hɑːˈ스틸러티 | 적대감, 적의 | aggression, animosity | friendliness | She faced hostility at work. | 직장에서 적대감에 직면했다. | The hostility between them grew. | 사이의 적대감이 커졌다.
constant | ˈkɑːnstənt | 끊임없는, 불변의 | continuous, steady | variable | She faces constant pressure. | 끊임없는 압박에 직면한다. | The speed remained constant. | 속도가 일정하게 유지되었다.
consistent | kənˈsɪstənt | 일관된, 한결같은 | steady, uniform | inconsistent | She was consistent in her work. | 일에 일관됐다. | Consistent effort pays off. | 일관된 노력은 보상받는다.
interpret | ɪnˈtɜːrprɪt | 통역하다, 해석하다 | translate, explain | misinterpret | She interpreted the speech. | 연설을 통역했다. | How do you interpret this data? | 이 데이터를 어떻게 해석하나?
interrupt | ˌɪntəˈrʌpt | 방해하다, 중단시키다 | disturb, cut in | continue | Don't interrupt while I'm speaking. | 말하는 중에 방해하지 마. | The meeting was interrupted. | 회의가 중단되었다.
moral | ˈmɔːrəl | 도덕의, 교훈 | ethical, lesson | immoral | She has high moral standards. | 높은 도덕 기준이 있다. | The moral of the story is clear. | 이야기의 교훈이 명확하다.

=== Day 30 ===
precede | prɪˈsiːd | 선행하다, 앞서다 | come before | follow | Spring precedes summer. | 봄이 여름 앞에 온다. | The speech preceded the ceremony. | 연설이 의식에 앞서 행해졌다.
proceed | prəˈsiːd | 진행하다, 나아가다 | continue, advance | stop | She proceeded with the plan. | 계획을 진행했다. | Please proceed to Gate 5. | 5번 게이트로 진행하십시오.
desert | ˈdɛzərt | 사막, 버리다 | wasteland, abandon | oasis | The Sahara is a vast desert. | 사하라는 광대한 사막이다. | He deserted his family. | 가족을 버렸다.
dessert | dɪˈzɜːrt | 후식, 디저트 | sweet, pudding | appetizer | She ordered chocolate dessert. | 초콜릿 디저트를 주문했다. | What is for dessert? | 디저트가 무엇인가?
addition | əˈdɪʃən | 추가, 덧셈 | extra, supplement | subtraction | In addition, she speaks French. | 또한 불어를 한다. | The addition of a new wing. | 새로운 건물 동의 추가.
addiction | əˈdɪkʃən | 중독, 탐닉 | dependency, obsession | recovery | Phone addiction is growing. | 폰 중독이 증가하고 있다. | He overcame his addiction. | 중독을 극복했다.
substitute | ˈsʌbstɪtuːt | 대체하다, 대용품 | replace, alternative | original | She substituted honey for sugar. | 설탕 대신 꿀로 대체했다. | He played as a substitute. | 대체 선수로 출전했다.
constitute | ˈkɑːnstɪtuːt | 구성하다, ~이 되다 | compose, form | - | Women constitute 50% of the population. | 여성이 인구의 50%를 구성한다. | This constitutes a violation. | 이것은 위반에 해당한다.
affect | əˈfɛkt | 영향을 미치다, 감동시키다 | influence, impact | - | Climate change affects everyone. | 기후 변화가 모두에게 영향을 미친다. | She was deeply affected. | 깊이 감동받았다.
effect | ɪˈfɛkt | 효과, 결과, 영향 | result, consequence | cause | The medicine had no effect. | 약의 효과가 없었다. | Side effects are common. | 부작용이 흔하다.
mediate | ˈmiːdieɪt | 중재하다, 조정하다 | negotiate, arbitrate | - | She mediated the dispute. | 분쟁을 중재했다. | A third party mediated between them. | 제3자가 중재했다.
meditate | ˈmɛdɪteɪt | 명상하다, 숙고하다 | reflect, contemplate | act | She meditates every morning. | 매일 아침 명상한다. | Meditate on your future goals. | 미래 목표를 숙고해라.
simultaneously | ˌsaɪməlˈteɪniəsli | 동시에 | at the same time, concurrently | separately | She can do two tasks simultaneously. | 두 가지 일을 동시에 할 수 있다. | The events occurred simultaneously. | 사건들이 동시에 발생했다.
spontaneously | spɑːnˈteɪniəsli | 자발적으로, 즉흥적으로 | naturally, impulsively | deliberately | She acted spontaneously. | 즉흥적으로 행동했다. | The audience spontaneously applauded. | 관객이 자발적으로 박수를 쳤다.
comparative | kəmˈpærətɪv | 비교의, 상대적인 | relative, corresponding | absolute | She took a comparative study. | 비교 연구를 했다. | English comparative grammar. | 영어 비교 문법.
competitive | kəmˈpɛtɪtɪv | 경쟁적인, 경쟁력 있는 | ambitious, aggressive | cooperative | The market is very competitive. | 시장이 매우 경쟁적이다. | She is highly competitive. | 매우 경쟁심이 강하다.
be engaged in | biː ɪnˈɡeɪdʒd ɪn | ~에 종사하다, 참여하다 | be involved in | withdraw from | She is engaged in research. | 연구에 종사한다. | He is engaged in charity work. | 자선 활동에 참여한다.
be engaged to | biː ɪnˈɡeɪdʒd tuː | ~와 약혼하다 | be betrothed to | - | She is engaged to her boyfriend. | 남자친구와 약혼했다. | They got engaged last month. | 지난달에 약혼했다.
make up | meɪk ʌp | 구성하다, 화해하다, 화장하다 | compose, reconcile | break up | Women make up 40% of the team. | 여성이 팀의 40%를 구성한다. | They made up after the fight. | 싸운 후 화해했다.
make up for | meɪk ʌp fɔːr | ~을 보상하다, 벌충하다 | compensate for | - | She made up for lost time. | 잃어버린 시간을 보상했다. | Nothing can make up for the loss. | 아무것도 그 손실을 벌충할 수 없다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 26-30 appended');
