// This script writes ALL the raw data for Days 5-15 and then runs the parser
const fs = require('fs');
const path = require('path');

const day5to8 = `=== Day 5 ===
apologize | əˈpɑːlədʒaɪz | 사과하다 | say sorry, express regret | - | She apologized for being late. | 늦은 것에 대해 사과했다. | He should apologize to her. | 그녀에게 사과해야 한다.
confuse | kənˈfjuːz | 혼동하다, 혼란시키다 | bewilder, puzzle | clarify | The instructions confused me. | 설명서가 나를 혼란시켰다. | Don't confuse the two words. | 두 단어를 혼동하지 마.
disorder | dɪsˈɔːrdər | 무질서, 혼란, 장애 | chaos, confusion | order | The room was in disorder. | 방이 어질러져 있었다. | She suffers from a sleep disorder. | 수면 장애를 앓고 있다.
gather | ˈɡæðər | 모이다, 모으다 | collect, assemble | scatter, disperse | Students gathered in the hall. | 학생들이 강당에 모였다. | She gathered information for the report. | 보고서를 위해 정보를 수집했다.
recommend | ˌrɛkəˈmɛnd | 권장하다, 추천하다 | suggest, advise | discourage | I recommend this book. | 이 책을 추천한다. | The doctor recommended rest. | 의사가 휴식을 권했다.
suppose | səˈpoʊz | 가정하다, 추정하다 | assume, presume | know, prove | I suppose you are right. | 네가 맞는 것 같다. | She is supposed to arrive at noon. | 정오에 도착할 예정이다.
accident | ˈæksɪdənt | 사고, 재난, 우연 | crash, mishap | intent | A car accident happened nearby. | 근처에서 자동차 사고가 났다. | She found the information by accident. | 우연히 그 정보를 알게 되었다.
adjust | əˈdʒʌst | 조정하다, 조절하다 | modify, adapt | fix, leave | Adjust the volume, please. | 볼륨을 조절해 주세요. | She adjusted to the new environment. | 새 환경에 적응했다.
aspect | ˈæspɛkt | 측면, 양상, 관점 | angle, facet | whole | Consider every aspect of the problem. | 문제의 모든 측면을 고려해라. | This aspect is often overlooked. | 이 측면은 종종 간과된다.
purchase | ˈpɜːrtʃɪs | 구입하다, 구입, 구입품 | buy, acquire | sell | She purchased a new laptop. | 새 노트북을 구입했다. | The purchase was worth it. | 그 구입은 가치가 있었다.
purpose | ˈpɜːrpəs | 목적, 의도, 결심 | aim, goal | aimlessness | What is the purpose of your visit? | 방문 목적이 무엇입니까? | She did it on purpose. | 일부러 그랬다.
organize | ˈɔːrɡənaɪz | 조직하다, 준비하다, 정리하다 | arrange, coordinate | disorganize | She organized the event. | 행사를 준비했다. | Organize your desk. | 책상을 정리해라.
arrange | əˈreɪndʒ | 정리(배열)하다, 준비하다 | organize, set up | mess up | She arranged the flowers beautifully. | 꽃을 아름답게 배열했다. | They arranged a meeting. | 회의를 준비했다.
communicate | kəˈmjuːnɪkeɪt | 의사소통하다, 전달하다 | convey, express | conceal | She communicates clearly. | 명확하게 전달한다. | We communicate via email. | 이메일로 소통한다.
represent | ˌrɛprɪˈzɛnt | 대표하다, 나타내다, 대변하다 | symbolize, stand for | misrepresent | She represents the school. | 학교를 대표한다. | The flag represents the nation. | 국기가 나라를 나타낸다.
treatment | ˈtriːtmənt | 치료(법), 대우, 처리 | therapy, care | neglect | She received medical treatment. | 의료 치료를 받았다. | The treatment was effective. | 치료가 효과적이었다.
approach | əˈproʊtʃ | 접근하다, 접근 | method, way | retreat | We approached the building slowly. | 건물에 천천히 접근했다. | Try a different approach. | 다른 접근법을 시도해라.
claim | kleɪm | 주장하다, 요구하다, 청구 | assert, demand | deny | She claimed that she was innocent. | 무죄라고 주장했다. | He filed an insurance claim. | 보험 청구를 했다.
disappoint | ˌdɪsəˈpɔɪnt | 실망시키다, 낙담시키다 | let down, frustrate | satisfy, please | The result disappointed everyone. | 결과가 모두를 실망시켰다. | Don't disappoint your parents. | 부모님을 실망시키지 마.
observe | əbˈzɜːrv | 관찰하다, 지키다, 목격하다 | watch, notice | ignore | She observed the stars carefully. | 별을 주의 깊게 관찰했다. | Observe the safety rules. | 안전 규칙을 지켜라.
compare | kəmˈpɛr | 비교하다 | contrast, liken | - | Compare the prices before buying. | 구매 전 가격을 비교해라. | She compared the two products. | 두 제품을 비교했다.
alarm | əˈlɑːrm | 경보, 놀라게 하다 | alert, frighten | calm, soothe | The fire alarm went off. | 화재 경보가 울렸다. | The news alarmed everyone. | 그 뉴스가 모두를 놀라게 했다.
exist | ɪɡˈzɪst | 존재하다 | live, be | vanish, perish | Dinosaurs no longer exist. | 공룡은 더 이상 존재하지 않는다. | Do aliens exist? | 외계인이 존재할까?
attract | əˈtrækt | 끌다, 매력을 느끼게 하다 | draw, lure | repel | The museum attracts many tourists. | 박물관이 많은 관광객을 끌어들인다. | She was attracted to the idea. | 그 아이디어에 끌렸다.
crucial | ˈkruːʃəl | 중요한, 결정적인 | critical, vital | trivial, minor | This is a crucial decision. | 이것은 중대한 결정이다. | Practice is crucial for improvement. | 연습이 향상에 중요하다.
display | dɪˈspleɪ | 전시하다, 보여주다, 전시 | show, exhibit | hide, conceal | The museum displays ancient art. | 박물관이 고대 미술을 전시한다. | She displayed her talent. | 재능을 보여줬다.
exhibit | ɪɡˈzɪbɪt | 전시하다, 보이다, 전시품 | display, show | conceal | The gallery exhibits modern art. | 갤러리에서 현대 미술을 전시한다. | She exhibited great courage. | 큰 용기를 보여줬다.
describe | dɪˈskraɪb | 묘사하다, 설명하다 | depict, explain | - | Describe what happened. | 무슨 일이 있었는지 묘사해라. | She described the scene vividly. | 장면을 생생하게 묘사했다.
reward | rɪˈwɔːrd | 보상, 보답하다 | prize, compensate | punish, penalize | Hard work deserves a reward. | 열심히 한 것은 보상받을 만하다. | She was rewarded for her honesty. | 정직함에 대해 보상받았다.
motivate | ˈmoʊtɪveɪt | 동기를 부여하다 | inspire, encourage | demotivate | Good leaders motivate their teams. | 좋은 리더는 팀에 동기를 부여한다. | She was motivated to succeed. | 성공하려는 동기가 있었다.
general | ˈdʒɛnərəl | 일반적인, 전반적인 | common, overall | specific | In general, she is kind. | 일반적으로 그녀는 친절하다. | The general opinion was positive. | 전반적인 의견이 긍정적이었다.
universal | ˌjuːnɪˈvɜːrsəl | 보편적인, 전 세계의 | worldwide, global | local, particular | Education is a universal right. | 교육은 보편적인 권리이다. | Music is a universal language. | 음악은 보편적 언어이다.
specific | spəˈsɪfɪk | 특정한, 구체적인 | particular, precise | general, vague | Give a specific example. | 구체적인 예를 들어라. | She has specific requirements. | 구체적인 요구 사항이 있다.
fee | fiː | 요금, 수수료 | charge, cost | - | The entrance fee is $10. | 입장료가 10달러이다. | She paid the registration fee. | 등록 수수료를 냈다.
demand | dɪˈmænd | 요구하다, 수요, 요구 | require, request | supply | She demanded an explanation. | 설명을 요구했다. | Demand for oil is rising. | 석유 수요가 증가하고 있다.
handle | ˈhændəl | 다루다, 처리하다, 손잡이 | manage, deal with | mishandle | She handled the situation well. | 상황을 잘 처리했다. | Turn the door handle. | 문 손잡이를 돌려라.
manage | ˈmænɪdʒ | 관리하다, 해내다 | run, handle | fail | She manages a large team. | 큰 팀을 관리한다. | I managed to finish on time. | 제 시간에 끝낼 수 있었다.
refer to | rɪˈfɜːr tuː | ~을 참조하다, 언급하다 | mention, cite | ignore | She referred to the dictionary. | 사전을 참조했다. | He referred to his notes. | 메모를 참고했다.
take on | teɪk ɑːn | ~을 떠맡다, 고용하다 | undertake, accept | reject | She took on the new project. | 새 프로젝트를 맡았다. | The company took on more workers. | 회사가 더 많은 직원을 고용했다.
pay attention to | peɪ əˈtɛnʃən tuː | ~에 주의하다 | focus on, heed | ignore, neglect | Pay attention to the details. | 세부 사항에 주의해라. | She paid attention to his words. | 그의 말에 주의를 기울였다.
=== Day 6 ===
category | ˈkætɪɡɔːri | 범주, 부문 | class, group | - | The book falls into this category. | 이 책은 이 범주에 해당한다. | There are several categories to choose from. | 선택할 수 있는 범주가 여러 개 있다.
except | ɪkˈsɛpt | ~을 제외하고, 제외하다 | besides, excluding | including | Everyone came except John. | 존을 제외하고 모두 왔다. | She works every day except Sunday. | 일요일을 제외하고 매일 일한다.
discuss | dɪˈskʌs | 토론하다, 논의하다 | debate, talk about | ignore | They discussed the plan. | 계획을 논의했다. | Let us discuss this later. | 나중에 이것을 논의하자.
debate | dɪˈbeɪt | 토론하다, 숙고하다, 토론 | discuss, argue | agree | They debated the issue for hours. | 몇 시간 동안 그 문제를 토론했다. | The debate was very heated. | 토론이 매우 열띠었다.
judgment | ˈdʒʌdʒmənt | 판단, 판결, 의견 | decision, verdict | - | She made a good judgment. | 좋은 판단을 했다. | Trust your own judgment. | 자기 판단을 믿어라.
consume | kənˈsuːm | 소비하다, 섭취하다 | use, eat | produce, save | She consumes too much sugar. | 설탕을 너무 많이 섭취한다. | Americans consume a lot of energy. | 미국인은 많은 에너지를 소비한다.
alive | əˈlaɪv | 살아 있는 | living, existing | dead | She is still alive. | 아직 살아 있다. | He felt alive after the run. | 달리기 후 살아있음을 느꼈다.
valuable | ˈvæljuəbl | 소중한, 값비싼 | precious, priceless | worthless | Time is the most valuable resource. | 시간이 가장 소중한 자원이다. | She gave valuable advice. | 귀중한 조언을 했다.
complain | kəmˈpleɪn | 불평하다, 호소하다 | grumble, protest | praise | She complained about the noise. | 소음에 대해 불평했다. | Stop complaining and start working. | 불평 그만하고 일 시작해.
replace | rɪˈpleɪs | 대체하다, 교체하다 | substitute, swap | keep | She replaced the broken window. | 깨진 창문을 교체했다. | No one can replace her. | 아무도 그녀를 대체할 수 없다.
norm | nɔːrm | 표준, 기준, 규범 | standard, rule | exception | Working from home is the new norm. | 재택근무가 새로운 규범이다. | Society has its own norms. | 사회에는 자체적인 규범이 있다.
standard | ˈstændərd | 표준, 기준, 규범, 일반적인 | criterion, benchmark | exception | The product meets high standards. | 제품이 높은 기준을 충족한다. | Standard procedures must be followed. | 표준 절차를 따라야 한다.
advertise | ˈædvərtaɪz | 광고하다, 알리다 | promote, market | conceal | The company advertises on TV. | 회사가 TV에 광고한다. | She advertised the event online. | 온라인으로 행사를 광고했다.
awareness | əˈwɛrnɪs | 의식, 인식 | consciousness, understanding | ignorance | Public awareness has increased. | 대중 인식이 높아졌다. | Raise awareness about climate change. | 기후 변화에 대한 인식을 높여라.
concept | ˈkɑːnsɛpt | 개념, 생각 | idea, notion | reality | The concept is easy to understand. | 개념이 이해하기 쉽다. | She introduced a new concept. | 새로운 개념을 도입했다.
respond | rɪˈspɑːnd | 반응하다, 응답하다 | reply, react | ignore | She responded to the email quickly. | 이메일에 빠르게 응답했다. | How did he respond to the news? | 소식에 어떻게 반응했나?
credit | ˈkrɛdɪt | 신용, 입금, 학점, 신용하다 | recognition, trust | debt | She paid by credit card. | 신용카드로 결제했다. | Give credit where it is due. | 공로가 있는 곳에 인정을 해라.
poison | ˈpɔɪzən | 독, 독을 넣다, 해치다 | toxin, venom | antidote | The snake has deadly poison. | 뱀에 치명적인 독이 있다. | Pollution poisons the water. | 오염이 물을 오염시킨다.
indicate | ˈɪndɪkeɪt | 나타내다, 가리키다, 암시하다 | show, suggest | conceal | The sign indicates danger. | 표지판이 위험을 나타낸다. | Studies indicate improvement. | 연구가 개선을 보여준다.
chemical | ˈkɛmɪkəl | 화학의, 화학 물질 | synthetic, compound | natural | Avoid harmful chemicals. | 해로운 화학 물질을 피해라. | Chemical reactions produce heat. | 화학 반응이 열을 발생시킨다.
primary | ˈpraɪmɛri | 주요한, 기본적인, 초등의 | main, chief | secondary | The primary goal is safety. | 주요 목표는 안전이다. | She attends primary school. | 초등학교에 다닌다.
essential | ɪˈsɛnʃəl | 필수적인, 본질적인 | vital, necessary | optional, unnecessary | Sleep is essential for health. | 수면은 건강에 필수적이다. | Bring only the essential items. | 필수 물품만 가져와라.
opinion | əˈpɪnjən | 의견, 견해 | view, belief | fact | In my opinion, she is right. | 내 의견으로는 그녀가 맞다. | Everyone has a different opinion. | 모두 다른 의견을 가지고 있다.
efficient | ɪˈfɪʃənt | 효율적인, 능률적인 | effective, productive | inefficient, wasteful | The new system is more efficient. | 새 시스템이 더 효율적이다. | She is an efficient worker. | 그녀는 능률적인 직원이다.
welfare | ˈwɛlfɛr | 복지, 안녕, 행복 | well-being, benefit | harm | The government provides welfare programs. | 정부가 복지 프로그램을 제공한다. | Child welfare is a priority. | 아동 복지가 우선이다.
eliminate | ɪˈlɪmɪneɪt | 제거하다, 없애다 | remove, eradicate | add, include | Eliminate unnecessary expenses. | 불필요한 비용을 제거해라. | The team was eliminated. | 팀이 탈락했다.
locate | loʊˈkeɪt | 위치를 찾다, ~에 위치하다 | find, situate | lose | Can you locate it on the map? | 지도에서 찾을 수 있니? | The store is located downtown. | 가게가 시내에 위치해 있다.
invention | ɪnˈvɛnʃən | 발명, 발명품 | creation, innovation | - | The invention changed the world. | 그 발명이 세상을 바꿨다. | Necessity is the mother of invention. | 필요는 발명의 어머니이다.
ideal | aɪˈdiːəl | 이상적인, 이상 | perfect, optimal | imperfect | This is the ideal solution. | 이상적인 해결책이다. | She has high ideals. | 높은 이상을 가지고 있다.
realistic | ˌriːəˈlɪstɪk | 현실적인, 사실적인 | practical, sensible | unrealistic | Be more realistic. | 더 현실적이어라. | The painting is very realistic. | 그림이 매우 사실적이다.
conclude | kənˈkluːd | 결론짓다, 끝내다 | finish, determine | begin, open | She concluded the speech. | 연설을 마무리했다. | I concluded that he was wrong. | 그가 틀렸다고 결론지었다.
struggle | ˈstrʌɡəl | 투쟁하다, 고군분투, 투쟁 | fight, battle | surrender | She struggled to stay awake. | 깨어 있으려고 고군분투했다. | The struggle for equality continues. | 평등을 위한 투쟁이 계속된다.
unique | juːˈniːk | 독특한, 유일한 | distinctive, one-of-a-kind | common, ordinary | Every person is unique. | 모든 사람은 독특하다. | She has a unique style. | 독특한 스타일이 있다.
proper | ˈprɑːpər | 적절한, 올바른, 제대로 된 | appropriate, correct | improper, wrong | Use proper grammar. | 올바른 문법을 사용해라. | She wore proper attire. | 적절한 복장을 착용했다.
appropriate | əˈproʊpriət | 적절한, 적합한 | suitable, fitting | inappropriate | Wear appropriate clothing. | 적절한 옷을 입어라. | That comment was not appropriate. | 그 발언은 적절하지 않았다.
supplement | ˈsʌplɪmənt | 보충하다, 보충제, 부록 | addition, extra | - | She takes vitamin supplements. | 비타민 보충제를 먹는다. | He supplemented his income. | 수입을 보충했다.
trial | ˈtraɪəl | 재판, 시험, 시련 | test, hearing | - | The trial lasted three weeks. | 재판이 3주간 지속되었다. | She faced many trials in life. | 인생에서 많은 시련을 겪었다.
infant | ˈɪnfənt | 유아, 갓난아이 | baby, newborn | adult | The infant slept peacefully. | 유아가 평화롭게 잤다. | Infant mortality has decreased. | 유아 사망률이 감소했다.
run out of | rʌn aʊt ɑːv | ~을 다 써버리다 | exhaust, deplete | stock up | We ran out of milk. | 우유가 다 떨어졌다. | She ran out of time. | 시간이 다 되었다.
can afford to do | kæn əˈfɔːrd tuː duː | ~할 여유가 있다 | be able to | cannot afford | She can afford to travel abroad. | 해외여행 할 여유가 있다. | We cannot afford to waste time. | 시간을 낭비할 여유가 없다.
=== Day 7 ===
protest | ˈproʊtɛst | 항의하다, 항의, 시위 | object, demonstrate | support | They protested against the decision. | 결정에 항의했다. | The protest attracted thousands. | 시위에 수천 명이 모였다.
organic | ɔːrˈɡænɪk | 유기적인, 유기농의 | natural, biological | synthetic | She buys organic vegetables. | 유기농 채소를 산다. | Organic farming is growing. | 유기 농업이 성장하고 있다.
brilliant | ˈbrɪljənt | 뛰어난, 눈부신 | outstanding, genius | dull, mediocre | She had a brilliant idea. | 뛰어난 아이디어가 있었다. | The sunrise was brilliant. | 일출이 눈부셨다.
finance | ˈfaɪnæns | 재정, 자금, 자금을 대다 | funding, money | - | She studied finance at university. | 대학에서 재무를 공부했다. | The project is financed by the government. | 프로젝트가 정부에 의해 자금 지원된다.
incredible | ɪnˈkrɛdəbl | 놀라운, 믿기 어려운 | amazing, unbelievable | ordinary, credible | The view was incredible. | 경치가 놀라웠다. | She has incredible talent. | 놀라운 재능이 있다.
interest | ˈɪntrɪst | 흥미, 관심, 이자 | curiosity, concern | boredom | She has an interest in science. | 과학에 관심이 있다. | The interest rate is low. | 이자율이 낮다.
rare | rɛr | 드문, 희귀한 | uncommon, scarce | common, frequent | This is a rare species. | 희귀한 종이다. | Such opportunities are rare. | 그런 기회는 드물다.
employ | ɪmˈplɔɪ | 고용하다, 사용하다 | hire, use | fire, dismiss | The company employs 500 people. | 회사가 500명을 고용한다. | She employed a new strategy. | 새 전략을 사용했다.
hire | ˈhaɪər | 고용하다, 임대하다 | employ, recruit | fire, dismiss | They hired a new manager. | 새 매니저를 고용했다. | She hired a car for the trip. | 여행을 위해 차를 빌렸다.
define | dɪˈfaɪn | 정의하다, 규정하다 | describe, explain | confuse | Define the term clearly. | 용어를 명확히 정의해라. | Success is hard to define. | 성공은 정의하기 어렵다.
donate | doʊˈneɪt | 기부하다, 기증하다 | give, contribute | take, keep | She donated blood. | 헌혈했다. | He donated money to charity. | 자선단체에 돈을 기부했다.
average | ˈævərɪdʒ | 평균, 보통의 | typical, mean | exceptional | The average score was 75. | 평균 점수가 75였다. | She is an average student. | 보통 학생이다.
gender | ˈdʒɛndər | 성별, 성 | sex | - | Gender equality is important. | 성 평등이 중요하다. | The survey asked about gender. | 설문이 성별을 물었다.
invest | ɪnˈvɛst | 투자하다, 쏟다 | fund, spend | withdraw | She invested in stocks. | 주식에 투자했다. | Invest time in learning. | 배움에 시간을 투자해라.
previous | ˈpriːviəs | 이전의, 앞의 | former, prior | next, following | She had a previous appointment. | 이전 약속이 있었다. | The previous owner sold it. | 이전 소유자가 팔았다.
worth | wɜːrθ | ~의 가치가 있는, 가치 | value, merit | worthlessness | The painting is worth millions. | 그림이 수백만의 가치가 있다. | It's worth a try. | 시도해볼 가치가 있다.
alternative | ɔːlˈtɜːrnətɪv | 대안, 대체의 | option, substitute | - | We need an alternative plan. | 대안이 필요하다. | Alternative energy sources are important. | 대체 에너지원이 중요하다.
factor | ˈfæktər | 요인, 요소 | element, cause | - | Cost is an important factor. | 비용이 중요한 요인이다. | Many factors affect health. | 많은 요인이 건강에 영향을 미친다.
element | ˈɛlɪmənt | 요소, 원소, 성분 | component, part | whole | Water is a key element of life. | 물이 생명의 핵심 요소이다. | The elements of the periodic table. | 주기율표의 원소들.
deadly | ˈdɛdli | 치명적인, 치사의 | fatal, lethal | harmless | The snake has a deadly bite. | 뱀이 치명적인 물림이 있다. | The disease can be deadly. | 질병이 치명적일 수 있다.
firm | fɜːrm | 단단한, 확고한, 회사 | solid, company | soft, weak | She stood firm on her decision. | 결정에 확고했다. | She works at a law firm. | 법률 회사에서 일한다.
independence | ˌɪndɪˈpɛndəns | 독립, 자주 | freedom, autonomy | dependence | Korea gained independence in 1945. | 한국이 1945년에 독립했다. | She values her independence. | 독립을 소중히 여긴다.
occasion | əˈkeɪʒən | 경우, 행사, 때 | event, ceremony | - | A birthday is a special occasion. | 생일은 특별한 행사이다. | On this occasion, we celebrate. | 이 기회에 축하한다.
publish | ˈpʌblɪʃ | 출판하다, 발표하다 | print, release | suppress | She published a new book. | 새 책을 출판했다. | The results were published online. | 결과가 온라인에 발표되었다.
appearance | əˈpɪrəns | 외모, 출현, 등장 | look, presence | disappearance | Don't judge by appearance. | 외모로 판단하지 마라. | She made a brief appearance. | 잠깐 등장했다.
appoint | əˈpɔɪnt | 임명하다, 지정하다 | assign, designate | dismiss | She was appointed as director. | 이사로 임명되었다. | He was appointed to the committee. | 위원회에 임명되었다.
blend | blɛnd | 섞다, 혼합하다, 혼합 | mix, combine | separate | Blend the ingredients together. | 재료를 함께 섞어라. | The colors blend beautifully. | 색상이 아름답게 어우러진다.
barrier | ˈbæriər | 장벽, 방해물 | obstacle, wall | opening | Language can be a barrier. | 언어가 장벽이 될 수 있다. | Break down barriers. | 장벽을 허물어라.
obstacle | ˈɑːbstəkəl | 장애물, 방해 | hindrance, barrier | aid, help | She overcame every obstacle. | 모든 장애물을 극복했다. | Lack of money is a major obstacle. | 돈 부족이 주요 장애물이다.
detect | dɪˈtɛkt | 감지하다, 발견하다 | find, discover | miss, overlook | The sensor detected movement. | 센서가 움직임을 감지했다. | She detected a flaw in the plan. | 계획의 결함을 발견했다.
education | ˌɛdʒuˈkeɪʃən | 교육, 학력 | learning, schooling | ignorance | Education is the key to success. | 교육이 성공의 열쇠이다. | She received a good education. | 좋은 교육을 받았다.
enormous | ɪˈnɔːrməs | 거대한, 막대한 | huge, massive | tiny, small | The building is enormous. | 건물이 거대하다. | She made an enormous effort. | 막대한 노력을 했다.
vast | væst | 광대한, 방대한 | huge, extensive | small, narrow | The desert is vast. | 사막이 광대하다. | She has vast knowledge. | 방대한 지식이 있다.
tiny | ˈtaɪni | 아주 작은, 극소의 | small, miniature | huge, enormous | The baby's hands are tiny. | 아기의 손이 아주 작다. | She lives in a tiny apartment. | 아주 작은 아파트에 산다.
ordinary | ˈɔːrdɪnɛri | 보통의, 평범한 | normal, average | extraordinary | It was just an ordinary day. | 그냥 평범한 날이었다. | She is no ordinary student. | 보통 학생이 아니다.
application | ˌæplɪˈkeɪʃən | 신청서, 응용, 적용 | request, use | - | She submitted her application. | 지원서를 제출했다. | Download the mobile application. | 모바일 앱을 다운로드해라.
reasonable | ˈriːzənəbl | 합리적인, 타당한 | fair, sensible | unreasonable | The price is reasonable. | 가격이 합리적이다. | She made a reasonable decision. | 합리적인 결정을 했다.
abandon | əˈbændən | 버리다, 포기하다 | desert, forsake | keep, retain | They abandoned the sinking ship. | 침몰하는 배를 버렸다. | She abandoned her old habits. | 오래된 습관을 버렸다.
get used to | ɡɛt juːzd tuː | ~에 익숙해지다 | become accustomed to | - | She got used to the cold weather. | 추운 날씨에 익숙해졌다. | You will get used to it. | 익숙해질 거야.
figure out | ˈfɪɡjər aʊt | 알아내다, 이해하다 | discover, solve | misunderstand | She figured out the answer. | 답을 알아냈다. | I can not figure out the problem. | 문제를 이해할 수 없다.
=== Day 8 ===
accurate | ˈækjərɪt | 정확한, 정밀한 | precise, exact | inaccurate | The data is accurate. | 데이터가 정확하다. | She gave an accurate description. | 정확한 묘사를 했다.
precise | prɪˈsaɪs | 정확한, 정밀한, 꼼꼼한 | exact, specific | vague, imprecise | Give me the precise time. | 정확한 시간을 알려줘. | Her instructions were precise. | 지시가 정확했다.
estimate | ˈɛstɪmeɪt | 추정하다, 견적, 추정치 | guess, calculate | - | She estimated the cost at $1000. | 비용을 1000달러로 추정했다. | The estimate was too low. | 추정치가 너무 낮았다.
compete | kəmˈpiːt | 경쟁하다, 겨루다 | contend, rival | cooperate | Companies compete for customers. | 회사들이 고객을 위해 경쟁한다. | She competed in the Olympics. | 올림픽에 출전했다.
submit | səbˈmɪt | 제출하다, 굴복하다 | present, surrender | resist, withhold | Submit your report by Friday. | 금요일까지 보고서를 제출해라. | She submitted to the rules. | 규칙에 따랐다.
grab | ɡræb | 붙잡다, 움켜쥐다 | seize, snatch | release | She grabbed her bag and left. | 가방을 움켜쥐고 떠났다. | He grabbed the opportunity. | 기회를 잡았다.
theory | ˈθɪəri | 이론, 학설 | hypothesis, concept | practice | The theory was proven correct. | 이론이 올바른 것으로 증명됐다. | In theory, it should work. | 이론적으로 작동해야 한다.
document | ˈdɑːkjumənt | 문서, 서류, 기록하다 | record, file | - | She signed the document. | 문서에 서명했다. | Document your progress. | 진행 상황을 기록해라.
enable | ɪˈneɪbl | 가능하게 하다, 할 수 있게하다 | allow, empower | prevent, disable | Technology enables remote work. | 기술이 원격 근무를 가능하게 한다. | The grant enabled her research. | 보조금이 그녀의 연구를 가능하게 했다.
avoid | əˈvɔɪd | 피하다, 회피하다 | evade, prevent | confront, face | Avoid fatty foods. | 지방이 많은 음식을 피해라. | She avoided the question. | 질문을 피했다.
escape | ɪˈskeɪp | 탈출하다, 도망치다, 탈출 | flee, run away | capture | He escaped from prison. | 감옥에서 탈출했다. | There is no escape. | 탈출구가 없다.
innovate | ˈɪnəveɪt | 혁신하다, 새로운 것을 도입하다 | create, pioneer | stagnate | Companies must innovate to survive. | 회사는 생존하기 위해 혁신해야 한다. | She innovated the entire system. | 전체 시스템을 혁신했다.
insight | ˈɪnsaɪt | 통찰력, 이해 | understanding, perception | ignorance | She has great insight into human behavior. | 인간 행동에 대한 통찰력이 있다. | The book offers valuable insights. | 책이 귀중한 통찰을 제공한다.
insurance | ɪnˈʃʊrəns | 보험 | coverage, protection | risk | She bought health insurance. | 건강 보험에 가입했다. | Car insurance is mandatory. | 자동차 보험은 의무이다.
infection | ɪnˈfɛkʃən | 감염, 전염 | disease, contamination | health | The wound got an infection. | 상처에 감염이 생겼다. | Prevent the spread of infection. | 감염 확산을 방지해라.
vehicle | ˈviːɪkəl | 차량, 탈 것, 수단 | car, transport | - | She parked her vehicle. | 차를 주차했다. | Electric vehicles are popular. | 전기차가 인기이다.
belong | bɪˈlɔːŋ | 속하다, ~의 것이다 | be part of | - | This book belongs to me. | 이 책은 내 것이다. | She belongs to the swimming club. | 수영 동아리에 속해 있다.
celebrate | ˈsɛlɪbreɪt | 축하하다, 기념하다 | honor, commemorate | mourn | They celebrated her birthday. | 생일을 축하했다. | Korea celebrates Independence Day. | 한국은 광복절을 기념한다.
demonstrate | ˈdɛmənstreɪt | 보여주다, 시위하다, 증명하다 | show, prove | disprove | She demonstrated how it works. | 작동 방법을 보여줬다. | Citizens demonstrated against the law. | 시민들이 법에 반대 시위했다.
disaster | dɪˈzæstər | 재난, 재해, 참사 | catastrophe, calamity | blessing | The earthquake was a major disaster. | 지진이 대재앙이었다. | Natural disasters are increasing. | 자연재해가 증가하고 있다.
economic | ˌiːkəˈnɑːmɪk | 경제의, 경제적인 | financial, fiscal | - | Economic growth slowed down. | 경제 성장이 둔화되었다. | The economic situation is stable. | 경제 상황이 안정적이다.
household | ˈhaʊshoʊld | 가정, 가구, 가정의 | family, home | - | The average household income rose. | 평균 가구 소득이 올랐다. | Household chores take time. | 집안일이 시간이 걸린다.
assign | əˈsaɪn | 배정하다, 할당하다, 부여하다 | allocate, designate | withdraw | The teacher assigned homework. | 선생님이 숙제를 부여했다. | She was assigned to Team A. | A팀에 배정되었다.
transfer | ˈtrænsfɜːr | 이전하다, 옮기다, 전학 | move, shift | keep | She transferred to a new school. | 새 학교로 전학했다. | Transfer the money to my account. | 내 계좌로 돈을 이체해라.
preserve | prɪˈzɜːrv | 보존하다, 보호하다 | protect, conserve | destroy | We must preserve the environment. | 환경을 보존해야 한다. | She preserved the old traditions. | 오래된 전통을 보존했다.
opposite | ˈɑːpəzɪt | 반대의, 맞은편의, 반대 | contrary, reverse | same, identical | They have opposite views. | 반대 견해를 가지고 있다. | She sat on the opposite side. | 맞은편에 앉았다.
satisfaction | ˌsætɪsˈfækʃən | 만족, 충족 | contentment, pleasure | dissatisfaction | She expressed great satisfaction. | 큰 만족을 표했다. | Customer satisfaction is our priority. | 고객 만족이 우선이다.
comfort | ˈkʌmfərt | 편안함, 안위, 위로하다 | ease, relief | discomfort | She found comfort in music. | 음악에서 위안을 찾았다. | The sofa provides great comfort. | 소파가 큰 편안함을 준다.
ease | iːz | 편안함, 용이함, 완화하다 | comfort, simplicity | difficulty | She moved with ease. | 편하게 움직였다. | The medicine eased her pain. | 약이 통증을 완화했다.
motion | ˈmoʊʃən | 움직임, 동작, 동의 | movement, gesture | stillness | The motion of the waves is calming. | 파도의 움직임이 평온하다. | She made a motion to approve. | 승인 동의를 했다.
operation | ˌɑːpəˈreɪʃən | 작동, 수술, 운영 | function, surgery | - | The operation was successful. | 수술이 성공적이었다. | The machine is in operation. | 기계가 작동 중이다.
blame | bleɪm | 비난하다, 탓하다, 탓 | accuse, fault | praise | Don't blame me. | 나를 탓하지 마. | She blamed him for the mistake. | 실수를 그 탓으로 돌렸다.
refreshing | rɪˈfrɛʃɪŋ | 상쾌한, 신선한 | invigorating, cool | tiring, dull | The cool breeze was refreshing. | 시원한 바람이 상쾌했다. | She offered a refreshing perspective. | 신선한 관점을 제시했다.
trend | trɛnd | 추세, 경향, 유행 | tendency, fashion | - | The trend is toward automation. | 추세가 자동화를 향하고 있다. | Fashion trends change quickly. | 패션 유행이 빠르게 바뀐다.
journal | ˈdʒɜːrnəl | 일지, 학술지, 저널 | diary, periodical | - | She writes in her journal daily. | 매일 일지를 쓴다. | The article was published in a journal. | 기사가 학술지에 발표되었다.
private | ˈpraɪvɪt | 사적인, 비공개의 | personal, confidential | public | This is a private matter. | 사적인 문제이다. | She attends a private school. | 사립학교에 다닌다.
sentence | ˈsɛntəns | 문장, 형벌, 판결하다 | phrase, punishment | pardon | Write a complete sentence. | 완전한 문장을 써라. | He was sentenced to five years. | 5년형을 선고받았다.
majority | məˈdʒɔːrɪti | 다수, 대다수 | most, bulk | minority | The majority agreed with the plan. | 다수가 계획에 동의했다. | The majority of students passed. | 대다수의 학생이 합격했다.
dozens of | ˈdʌzənz ɑːv | 수십 개의, 많은 | many, numerous | few | She received dozens of emails. | 수십 통의 이메일을 받았다. | Dozens of people attended. | 수십 명이 참석했다.
rather than | ˈræðər ðæn | ~보다는, ~대신에 | instead of | - | She chose tea rather than coffee. | 커피보다 차를 선택했다. | Walk rather than drive. | 운전하기보다 걸어라.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), day5to8, 'utf-8');
console.log('Days 5-8 appended');
