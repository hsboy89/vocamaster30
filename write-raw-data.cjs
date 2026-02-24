// Script to write remaining days to high1-raw-data.txt
const fs = require('fs');
const path = require('path');

const remainingDays = `=== Day 4 ===
circumstance | ˈsɜːrkəmstæns | 환경, 상황, 형편 | condition, situation | - | Under no circumstances should you lie. | 어떤 상황에서도 거짓말하면 안 된다. | The circumstances were beyond her control. | 상황이 그녀의 통제를 벗어났다.
environment | ɪnˈvaɪrənmənt | (자연, 주변의) 환경 | surroundings, nature | - | Protect the environment. | 환경을 보호해라. | A clean environment is essential. | 깨끗한 환경이 필수적이다.
active | ˈæktɪv | 활동적인, 적극적인, 활발한 | energetic, dynamic | passive, inactive | She leads an active lifestyle. | 활동적인 생활을 한다. | He is active in politics. | 정치에 적극적이다.
community | kəˈmjuːnəti | 지역사회, 공동체 | society, neighborhood | - | The community came together. | 지역사회가 하나로 뭉쳤다. | She volunteers in her community. | 지역사회에서 봉사한다.
necessity | nəˈsɛsəti | 필요, 필수품 | need, requirement | luxury | Water is a basic necessity. | 물은 기본 필수품이다. | Necessity is the mother of invention. | 필요는 발명의 어머니이다.
effort | ˈɛfərt | 노력, 수고, 결과 | attempt, endeavor | laziness | She made a great effort. | 대단한 노력을 했다. | The effort was worthwhile. | 노력의 가치가 있었다.
participation | pɑːrˌtɪsɪˈpeɪʃən | 참가, 참여 | involvement, engagement | exclusion | Active participation is required. | 적극적인 참여가 필요하다. | Participation increased this year. | 올해 참여율이 증가했다.
regular | ˈrɛɡjələr | 규칙적인, 정기적인, 단골손님 | routine, consistent | irregular | She exercises on a regular basis. | 규칙적으로 운동한다. | He is a regular customer. | 단골손님이다.
development | dɪˈvɛləpmənt | 발전, 성장, 개발 | growth, progress | decline | Economic development is important. | 경제 발전이 중요하다. | The new development changed the area. | 새 개발이 지역을 바꿨다.
progress | ˈprɑːɡrɛs | 진전, 진보하다, 전진하다 | advance, improvement | regression | She made great progress. | 큰 진전을 이루었다. | The project is progressing well. | 프로젝트가 잘 진행되고 있다.
permit | pərˈmɪt | 허락하다 | allow, authorize | forbid, prohibit | Smoking is not permitted here. | 여기서 흡연이 허가되지 않는다. | She was permitted to leave early. | 일찍 퇴근이 허가되었다.
forbid | fɔːrˈbɪd | 금지하다 | prohibit, ban | permit, allow | The law forbids discrimination. | 법이 차별을 금지한다. | She forbade him from going. | 그가 가는 것을 금지했다.
emission | ɪˈmɪʃən | 배출, 방출, 배출물 | discharge, release | absorption | Carbon emissions must be reduced. | 탄소 배출을 줄여야 한다. | The factory controls its emissions. | 공장이 배출물을 관리한다.
perspective | pərˈspɛktɪv | 관점, 시각, 원근법 | viewpoint, outlook | - | Try to see it from her perspective. | 그녀의 관점에서 보려고 해봐. | Gain a new perspective on life. | 삶에 대한 새로운 시각을 갖다.
conservative | kənˈsɜːrvətɪv | 보수적인, 보수주의의 | traditional, conventional | liberal, progressive | She has conservative views. | 보수적인 견해를 가졌다. | The estimate was conservative. | 추정치가 보수적이었다.
entire | ɪnˈtaɪər | 전체의, 완전한 | whole, complete | partial | She read the entire book. | 책을 통째로 읽었다. | The entire class passed the test. | 학급 전체가 시험에 합격했다.
measure | ˈmɛʒər | 측정하다, 재다, 측정, 조치 | gauge, assess | - | Measure the length of the room. | 방의 길이를 재라. | They took measures to prevent crime. | 범죄 예방 조치를 취했다.
maintain | meɪnˈteɪn | 유지하다, 지지하다, 부양하다 | preserve, sustain | neglect, abandon | She maintains a healthy diet. | 건강한 식단을 유지한다. | Maintain a positive attitude. | 긍정적인 태도를 유지해라.
support | səˈpɔːrt | 지지하다, 지원하다, 부양하다 | back, assist | oppose, undermine | I support your decision. | 결정을 지지한다. | She supports her family alone. | 혼자서 가족을 부양한다.
prevent | prɪˈvɛnt | 막다, 예방하다 | stop, block | allow, enable | Vaccines prevent diseases. | 백신이 질병을 예방한다. | She prevented the accident. | 사고를 막았다.
occur | əˈkɜːr | 발생하다, 일어나다, 생각나다 | happen, take place | - | The accident occurred at night. | 사고가 밤에 발생했다. | An idea occurred to her. | 아이디어가 떠올랐다.
passion | ˈpæʃən | 열정, 격정 | enthusiasm, zeal | apathy, indifference | She has a passion for music. | 음악에 열정이 있다. | Follow your passion. | 열정을 따라가라.
determine | dɪˈtɜːrmɪn | 결정하다, 밝혀내다 | decide, resolve | hesitate | She determined to succeed. | 성공하기로 결심했다. | Scientists determined the cause. | 과학자들이 원인을 밝혀냈다.
influence | ˈɪnfluəns | 영향, 영향을 주다 | impact, affect | - | Music influences our mood. | 음악이 기분에 영향을 미친다. | He has great influence on the team. | 팀에 큰 영향력이 있다.
impact | ˈɪmpækt | 영향, 충격, 영향을 주다 | effect, consequence | - | The decision had a major impact. | 그 결정은 큰 영향을 미쳤다. | Climate change impacts everyone. | 기후 변화가 모두에게 영향을 미친다.
immediate | ɪˈmiːdiət | 즉각적인, 직접의 | instant, direct | delayed, gradual | She took immediate action. | 즉각적인 조치를 취했다. | The immediate area was evacuated. | 직접적인 주변 지역이 대피되었다.
military | ˈmɪlɪtɛri | 군대, 군대의 | armed forces, army | civilian | He served in the military. | 군대에서 복무했다. | Military spending increased. | 군사 지출이 증가했다.
ancient | ˈeɪnʃənt | 고대의, 옛날의 | old, antique | modern, contemporary | She studied ancient history. | 고대사를 공부했다. | The ancient ruins are beautiful. | 고대 유적이 아름답다.
emphasize | ˈɛmfəsaɪz | 강조하다, 두드러지게 하다 | stress, highlight | downplay | She emphasized the importance of education. | 교육의 중요성을 강조했다. | He emphasized his point clearly. | 요점을 분명하게 강조했다.
preference | ˈprɛfərəns | 선호, 선호하는 것 | choice, liking | dislike, aversion | She has a preference for tea. | 차를 선호한다. | State your preference clearly. | 선호를 명확히 말해라.
respect | rɪˈspɛkt | 존경하다, 존경, 측면 | admire, honor | disrespect | She respects her teacher. | 선생님을 존경한다. | In this respect, he is right. | 이 측면에서 그가 옳다.
concern | kənˈsɜːrn | 염려, 관심사, 관련되다 | worry, interest | indifference | She expressed concern for his health. | 그의 건강에 대한 걱정을 표했다. | This issue concerns all of us. | 이 문제는 우리 모두에게 관련된다.
forecast | ˈfɔːrkæst | 예측하다, 예보하다, 예측 | predict, project | - | The weather forecast says rain. | 일기 예보가 비를 예보한다. | She forecasted economic growth. | 경제 성장을 예측했다.
predict | prɪˈdɪkt | 예측하다, 예언하다 | forecast, foresee | - | Scientists predict global warming. | 과학자들이 지구 온난화를 예측한다. | Nobody could predict the outcome. | 아무도 결과를 예측하지 못했다.
tendency | ˈtɛndənsi | 경향, 추세, 성향 | trend, inclination | - | She has a tendency to worry. | 걱정하는 경향이 있다. | There is a tendency toward automation. | 자동화 추세가 있다.
function | ˈfʌŋkʃən | 기능, 행사, 작용하다 | role, purpose | malfunction | What is the function of this tool? | 이 도구의 기능은 무엇인가? | The machine functions well. | 기계가 잘 작동한다.
significant | sɪɡˈnɪfɪkənt | 중요한, 의미 있는, 상당한 | important, major | insignificant, trivial | She made a significant contribution. | 중요한 기여를 했다. | There was a significant increase. | 상당한 증가가 있었다.
due to | djuː tuː | ~때문에, ~에 기인하는 | because of, owing to | despite | The flight was delayed due to fog. | 안개 때문에 비행기가 지연되었다. | Due to rain, the game was canceled. | 비 때문에 경기가 취소되었다.
be aware of | biː əˈwɛr ɑːv | ~을 인식하다, 알다, 깨닫다 | know, recognize | be ignorant of | Be aware of the risks. | 위험을 인식해라. | She wasn't aware of the problem. | 문제를 인식하지 못했다.
provide A with B | prəˈvaɪd wɪð | A에게 B를 제공하다 | supply, furnish | deprive | The school provides students with textbooks. | 학교가 학생에게 교과서를 제공한다. | She provided us with useful information. | 유용한 정보를 제공해줬다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), remainingDays, 'utf-8');
console.log('Day 4 appended successfully');
