const fs = require('fs');
const path = require('path');

const data = `=== Day 9 ===
available | əˈveɪləbl | 이용 가능한, 유효한 | accessible, obtainable | unavailable | The room is available now. | 방이 이용 가능하다. | She is available for a meeting. | 회의에 참석 가능하다.
shelter | ˈʃɛltər | 보호소, 피난처, 보호하다 | refuge, haven | exposure | They found shelter from the rain. | 비를 피할 곳을 찾았다. | The shelter houses homeless people. | 보호소가 노숙자를 수용한다.
benefit | ˈbɛnɪfɪt | 이익, 혜택, 이롭다 | advantage, profit | disadvantage | The benefits of exercise are clear. | 운동의 이점은 분명하다. | She benefits from the program. | 프로그램에서 혜택을 받는다.
complex | ˈkɑːmplɛks | 복잡한, 복합의 | complicated, intricate | simple | The issue is complex. | 문제가 복잡하다. | She lives in an apartment complex. | 아파트 단지에 산다.
annual | ˈænjuəl | 연간의, 1년의 | yearly | - | The annual report was published. | 연간 보고서가 발표되었다. | The annual meeting is in May. | 연례 회의가 5월에 있다.
agriculture | ˈæɡrɪkʌltʃər | 농업, 농경 | farming, cultivation | - | Agriculture is the main industry. | 농업이 주요 산업이다. | Modern agriculture uses technology. | 현대 농업은 기술을 사용한다.
continent | ˈkɑːntɪnənt | 대륙 | landmass | island | Africa is a large continent. | 아프리카는 큰 대륙이다. | She has traveled to every continent. | 모든 대륙을 여행했다.
population | ˌpɑːpjuˈleɪʃən | 인구, 주민 | inhabitants, residents | - | The population is growing. | 인구가 증가하고 있다. | The city has a large population. | 도시의 인구가 많다.
expand | ɪkˈspænd | 확대하다, 팽창하다 | grow, enlarge | shrink, contract | The company expanded its business. | 회사가 사업을 확대했다. | Metal expands when heated. | 금속이 열을 받으면 팽창한다.
extend | ɪkˈstɛnd | 연장하다, 확대하다, 뻗다 | stretch, prolong | shorten, reduce | She extended the deadline. | 마감을 연장했다. | Extend your hand. | 손을 뻗어라.
contract | ˈkɑːntrækt | 수축하다, 계약, 계약하다 | agreement, shrink | expand | Metal contracts when cooled. | 금속이 냉각되면 수축한다. | She signed a contract. | 계약서에 서명했다.
severe | sɪˈvɪr | 심각한, 극심한, 엄격한 | serious, harsh | mild, gentle | The injury was severe. | 부상이 심각했다. | Severe weather is expected. | 악천후가 예상된다.
crop | krɑːp | 농작물, 수확량, 자르다 | harvest, produce | - | The crop failed this year. | 올해 농작물이 실패했다. | Rice is the main crop. | 쌀이 주요 농작물이다.
severe | sɪˈvɪr | 심한, 엄격한 | harsh, intense | mild, gentle | The penalty was severe. | 처벌이 엄격했다. | Severe drought affected crops. | 심한 가뭄이 농작물에 영향을 미쳤다.
generous | ˈdʒɛnərəs | 관대한, 후한 | kind, charitable | stingy, selfish | She is very generous. | 매우 관대하다. | He left a generous tip. | 후한 팁을 남겼다.
genuine | ˈdʒɛnjuɪn | 진짜의, 진실한 | real, authentic | fake, false | Is this a genuine product? | 정품인가요? | She has a genuine smile. | 진실한 미소를 가졌다.
atmosphere | ˈætməsfɪr | 분위기, 대기 | mood, air | - | The restaurant has a nice atmosphere. | 레스토랑 분위기가 좋다. | Earth's atmosphere protects us. | 지구 대기가 우리를 보호한다.
liberty | ˈlɪbərti | 자유, 해방 | freedom, independence | captivity | Liberty is a basic right. | 자유는 기본 권리이다. | The statue symbolizes liberty. | 동상이 자유를 상징한다.
poverty | ˈpɑːvərti | 가난, 빈곤 | hardship, need | wealth, prosperity | Poverty is a global problem. | 빈곤은 세계적 문제이다. | She grew up in poverty. | 가난 속에서 자랐다.
wealth | wɛlθ | 부, 재산, 풍부 | riches, fortune | poverty | He accumulated great wealth. | 큰 부를 축적했다. | Health is greater than wealth. | 건강이 부보다 중요하다.
apparent | əˈpærənt | 명백한, 외견상의 | obvious, evident | hidden, unclear | It is apparent that she was upset. | 그녀가 화난 것이 분명했다. | The problem was immediately apparent. | 문제가 즉시 분명해졌다.
annual | ˈænjuəl | 해마다의, 연간의 | yearly | monthly | The annual budget was approved. | 연간 예산이 승인되었다. | We attend the annual festival. | 연례 축제에 참석한다.
fund | fʌnd | 기금, 자금, 자금을 대다 | capital, finance | - | The fund supports education. | 기금이 교육을 지원한다. | She funded the research. | 연구에 자금을 지원했다.
conservation | ˌkɑːnsərˈveɪʃən | 보전, 보호 | preservation, protection | destruction | Wildlife conservation is important. | 야생 동물 보전이 중요하다. | Conservation efforts have been successful. | 보전 노력이 성공적이었다.
fossil | ˈfɑːsəl | 화석, 구식의 | remains, relic | modern | They discovered a dinosaur fossil. | 공룡 화석을 발견했다. | Fossil fuels cause pollution. | 화석 연료가 오염을 일으킨다.
drought | draʊt | 가뭄, 건조기 | dry spell | flood | The drought lasted for months. | 가뭄이 몇 달 지속됐다. | Drought destroyed the crops. | 가뭄으로 농작물이 망했다.
colony | ˈkɑːləni | 식민지, 군락 | settlement, territory | - | Korea was once a colony of Japan. | 한국은 한때 일본의 식민지였다. | An ant colony can be huge. | 개미 군락은 거대할 수 있다.
decline | dɪˈklaɪn | 감소하다, 거절하다, 쇠퇴 | decrease, refuse | increase, accept | She declined the invitation. | 초대를 거절했다. | Sales declined sharply. | 매출이 급감했다.
domestic | dəˈmɛstɪk | 국내의, 가정의 | internal, household | foreign | Domestic tourism is growing. | 국내 관광이 증가하고 있다. | She enjoys domestic life. | 가정 생활을 즐긴다.
analyze | ˈænəlaɪz | 분석하다, 검토하다 | examine, study | ignore | She analyzed the data carefully. | 데이터를 신중히 분석했다. | Analyze the results of the survey. | 설문 결과를 분석해라.
debate | dɪˈbeɪt | 논쟁하다, 토론, 논의 | argue, discuss | agree | They debated the policy change. | 정책 변화를 논의했다. | The debate was lively. | 토론이 활발했다.
ethnic | ˈɛθnɪk | 민족의, 인종의 | racial, cultural | - | Korea is an ethnically diverse country. | 한국은 민족적으로 다양한 나라이다. | Ethnic food is popular. | 민족 음식이 인기이다.
adapt | əˈdæpt | 적응하다, 각색하다 | adjust, modify | resist | She adapted to the new culture. | 새로운 문화에 적응했다. | The book was adapted into a film. | 책이 영화로 각색되었다.
adopt | əˈdɑːpt | 채택하다, 입양하다 | embrace, choose | reject | They adopted a new policy. | 새 정책을 채택했다. | She adopted a child. | 아이를 입양했다.
harvest | ˈhɑːrvɪst | 수확하다, 수확(물) | gather, crop | plant, sow | Farmers harvest rice in autumn. | 농부들이 가을에 쌀을 수확한다. | The harvest was plentiful. | 수확이 풍부했다.
budget | ˈbʌdʒɪt | 예산, 예산의 | funds, financial plan | - | The budget was approved. | 예산이 승인되었다. | She planned her budget carefully. | 예산을 신중하게 계획했다.
at the expense of | æt ðə ɪkˈspɛns ɑːv | ~을 희생하면서, ~의 대가로 | at the cost of | - | He succeeded at the expense of his health. | 건강을 희생하면서 성공했다. | Don't achieve goals at the expense of others. | 남을 희생시키며 목표를 달성하지 마라.
come up with | kʌm ʌp wɪð | ~을 생각해내다 | devise, invent | - | She came up with a great idea. | 훌륭한 아이디어를 생각해냈다. | Can you come up with a solution? | 해결책을 생각해낼 수 있니?
on behalf of | ɑːn bɪˈhæf ɑːv | ~을 대신하여 | representing, for | - | She spoke on behalf of the team. | 팀을 대신해 발언했다. | He signed on behalf of the company. | 회사를 대신해 서명했다.
=== Day 10 ===
attempt | əˈtɛmpt | 시도하다, 시도, 기도 | try, effort | success | She attempted to climb the mountain. | 산을 오르려고 시도했다. | The attempt failed. | 시도가 실패했다.
struggle | ˈstrʌɡəl | 분투하다, 노력, 투쟁 | fight, battle | surrender | She struggled with the math problem. | 수학 문제로 고전했다. | Life is a constant struggle. | 삶은 끊임없는 투쟁이다.
threaten | ˈθrɛtən | 위협하다, 협박하다 | menace, intimidate | protect, reassure | The storm threatened the coast. | 폭풍이 해안을 위협했다. | She did not threaten anyone. | 아무도 위협하지 않았다.
prejudice | ˈprɛdʒʊdɪs | 편견, 선입관 | bias, discrimination | fairness, impartiality | We must fight against prejudice. | 편견에 맞서야 한다. | Prejudice leads to injustice. | 편견이 불의로 이어진다.
discrimination | dɪˌskrɪmɪˈneɪʃən | 차별, 식별 | bias, prejudice | equality, fairness | Racial discrimination is illegal. | 인종 차별은 불법이다. | Fight against discrimination. | 차별에 맞서 싸워라.
guarantee | ˌɡærənˈtiː | 보증하다, 보장, 보증서 | assure, promise | - | We guarantee quality. | 품질을 보장한다. | The product comes with a guarantee. | 제품에 보증서가 있다.
absolutely | ˌæbsəˈluːtli | 절대적으로, 확실히, 완전히 | completely, definitely | partially | She is absolutely right. | 그녀가 절대적으로 옳다. | I absolutely agree with you. | 전적으로 동의한다.
domestic | dəˈmɛstɪk | 가정의, 국내의, 국산의 | household, internal | foreign, international | Domestic sales increased. | 국내 판매가 증가했다. | She helps with domestic work. | 가사일을 돕는다.
demonstrate | ˈdɛmənstreɪt | 시연하다, 증명하다 | show, prove | disprove | She demonstrated the technique. | 기술을 시연했다. | The experiment demonstrated the theory. | 실험이 이론을 증명했다.
evolution | ˌɛvəˈluːʃən | 진화, 발전, 전개 | development, progression | regression | The theory of evolution is widely accepted. | 진화론은 널리 받아들여진다. | The evolution of technology is fast. | 기술의 발전이 빠르다.
gene | dʒiːn | 유전자 | DNA, hereditary unit | - | Genes determine many traits. | 유전자가 많은 특성을 결정한다. | She studied gene therapy. | 유전자 치료를 공부했다.
debate | dɪˈbeɪt | 논쟁, 토론하다 | argue, discuss | agree | The debate was about tax reform. | 토론이 세금 개혁에 관한 것이었다. | They will debate the issue. | 그 문제를 토론할 것이다.
proportion | prəˈpɔːrʃən | 비율, 부분, 균형 | ratio, share | disproportion | A large proportion of students passed. | 학생의 많은 비율이 통과했다. | The proportions are balanced. | 비율이 균형이 잡혔다.
compromise | ˈkɑːmprəmaɪz | 타협하다, 타협, 절충 | agree, settle | disagree | They compromised on the price. | 가격에 타협했다. | Compromise is necessary in relationships. | 관계에서 타협이 필요하다.
conflict | ˈkɑːnflɪkt | 갈등, 충돌, 분쟁 | clash, dispute | peace, harmony | The conflict lasted for years. | 분쟁이 수년간 지속되었다. | They resolved the conflict. | 갈등을 해결했다.
ethnic | ˈɛθnɪk | 민족적인, 인종적인 | racial, cultural | - | Ethnic diversity enriches society. | 민족적 다양성이 사회를 풍요롭게 한다. | She studies ethnic cultures. | 민족 문화를 연구한다.
reform | rɪˈfɔːrm | 개혁하다, 개혁, 개선 | improve, amend | worsen | The government reformed the tax system. | 정부가 세금 체계를 개혁했다. | Education reform is needed. | 교육 개혁이 필요하다.
poverty | ˈpɑːvərti | 가난, 빈곤 | need, deprivation | wealth | Poverty affects millions. | 빈곤이 수백만 명에 영향을 미친다. | She escaped from poverty. | 빈곤에서 벗어났다.
statistics | stəˈtɪstɪks | 통계, 통계학 | data, figures | - | Statistics show a decline. | 통계가 감소를 보여준다. | She studies statistics at university. | 대학에서 통계학을 공부한다.
stability | stəˈbɪləti | 안정성, 안정 | steadiness, firmness | instability | Economic stability is important. | 경제 안정이 중요하다. | The country regained stability. | 나라가 안정을 되찾았다.
controversy | ˈkɑːntrəvɜːrsi | 논란, 논쟁 | debate, dispute | agreement | The decision caused controversy. | 그 결정이 논란을 일으켰다. | The controversy was settled. | 논란이 해결되었다.
immigrant | ˈɪmɪɡrənt | 이민자, 이주민 | migrant, newcomer | native, citizen | She is an immigrant from Vietnam. | 베트남에서 온 이민자이다. | The city has many immigrants. | 도시에 많은 이민자가 있다.
refugee | ˌrɛfjuˈdʒiː | 난민, 피난민 | exile, displaced person | native | Millions of refugees need help. | 수백만 난민이 도움이 필요하다. | She works with refugees. | 난민들과 일한다.
strategy | ˈstrætədʒi | 전략, 계획 | plan, tactic | - | She developed a new strategy. | 새로운 전략을 개발했다. | The strategy proved effective. | 전략이 효과적이었다.
perspective | pərˈspɛktɪv | 관점, 시각 | viewpoint, outlook | - | See it from a different perspective. | 다른 관점에서 봐. | She has a unique perspective. | 독특한 관점이 있다.
legislation | ˌlɛdʒɪsˈleɪʃən | 법률, 입법, 법률 제정 | law, regulation | - | New legislation was passed. | 새로운 법률이 통과되었다. | She supports the legislation. | 그 법률을 지지한다.
discipline | ˈdɪsɪplɪn | 훈련, 규율, 학문 | training, control | disorder | Self-discipline is important. | 자기 훈련이 중요하다. | She studies several disciplines. | 여러 학문을 공부한다.
institution | ˌɪnstɪˈtuːʃən | 기관, 제도, 시설 | organization, establishment | - | She works at a research institution. | 연구 기관에서 일한다. | Marriage is an important institution. | 결혼은 중요한 제도이다.
infrastructure | ˈɪnfrəˌstrʌktʃər | 사회 기반 시설, 인프라 | facilities, systems | - | The infrastructure needs improvement. | 인프라가 개선이 필요하다. | They invested in infrastructure. | 인프라에 투자했다.
inequality | ˌɪnɪˈkwɑːləti | 불평등, 불균등 | disparity, imbalance | equality | Income inequality is growing. | 소득 불평등이 증가하고 있다. | Fight against inequality. | 불평등에 맞서 싸워라.
transition | trænˈzɪʃən | 변화, 전환, 이행 | change, shift | stability | The transition was smooth. | 전환이 순조로웠다. | She is in a period of transition. | 전환기에 있다.
advocate | ˈædvəkeɪt | 옹호하다, 옹호자, 지지자 | support, champion | oppose | She advocates for human rights. | 인권을 옹호한다. | He is an advocate for change. | 변화의 지지자이다.
welfare | ˈwɛlfɛr | 복지, 행복, 번영 | well-being, benefit | suffering | The welfare system was reformed. | 복지 제도가 개혁되었다. | Child welfare is a priority. | 아동 복지가 최우선이다.
govern | ˈɡʌvərn | 통치하다, 지배하다 | rule, manage | submit, obey | She governs the country wisely. | 나라를 현명하게 통치한다. | Rules govern behavior. | 규칙이 행동을 지배한다.
agenda | əˈdʒɛndə | 의제, 안건, 일정 | schedule, program | - | Climate change is on the agenda. | 기후 변화가 의제에 있다. | What's on today's agenda? | 오늘 안건이 뭐야?
sustainable | səˈsteɪnəbl | 지속 가능한, 견딜 수 있는 | viable, enduring | unsustainable | Sustainable development is necessary. | 지속 가능한 개발이 필요하다. | She promotes sustainable living. | 지속 가능한 생활을 촉진한다.
call for | kɑːl fɔːr | ~을 요구하다 | demand, require | reject | She called for action. | 행동을 요구했다. | The report calls for reform. | 보고서가 개혁을 요구한다.
stand for | stænd fɔːr | ~을 상징하다, 대표하다 | represent, mean | oppose | The flag stands for freedom. | 깃발이 자유를 상징한다. | What does this acronym stand for? | 이 약어가 무엇을 의미하나?
in terms of | ɪn tɜːrmz ɑːv | ~의 측면에서, ~에 관하여 | regarding, concerning | - | In terms of cost, it is affordable. | 비용 측면에서 부담 가능하다. | In terms of quality, it is the best. | 품질 측면에서 최고이다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 9-10 appended');
