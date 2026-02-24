const fs = require('fs');
const path = require('path');

const data = `=== Day 14 ===
narrative | ˈnærətɪv | 이야기, 서사, 서술 | story, account | - | She wrote a compelling narrative. | 설득력 있는 이야기를 썼다. | The narrative was gripping. | 서사가 흡입력이 있었다.
perspective | pərˈspɛktɪv | 관점, 시각, 원근법 | viewpoint, angle | - | Literature offers new perspectives. | 문학이 새로운 관점을 제공한다. | She told the story from her perspective. | 자신의 관점에서 이야기를 했다.
civilization | ˌsɪvɪləˈzeɪʃən | 문명, 문화 | culture, society | barbarism | Ancient civilizations fascinate her. | 고대 문명에 매력을 느낀다. | Modern civilization depends on technology. | 현대 문명은 기술에 의존한다.
heritage | ˈhɛrɪtɪdʒ | 유산, 전통 | legacy, tradition | - | Korea has a rich cultural heritage. | 한국은 풍부한 문화 유산이 있다. | Protect our heritage. | 유산을 보호해라.
myth | mɪθ | 신화, 근거 없는 믿음 | legend, fable | fact, reality | Greek myths are fascinating. | 그리스 신화가 매력적이다. | It is a myth that we only use 10% of our brain. | 뇌의 10%만 사용한다는 것은 근거 없는 믿음이다.
legend | ˈlɛdʒənd | 전설, 전설적 인물 | myth, tale | fact | He is a legend in sports. | 스포츠에서 전설이다. | The legend has been passed down for centuries. | 전설이 수세기 동안 전해졌다.
masterpiece | ˈmæstərpiːs | 걸작, 명작 | magnum opus, classic | failure | The painting is a masterpiece. | 그 그림이 걸작이다. | She created a literary masterpiece. | 문학적 걸작을 만들었다.
genre | ˈʒɑːnrə | 장르, 유형 | type, category | - | What genre of music do you like? | 어떤 장르의 음악을 좋아하나? | The novel belongs to the mystery genre. | 소설이 미스터리 장르에 속한다.
biography | baɪˈɑːɡrəfi | 전기, 일대기 | life story, memoir | fiction | She read a biography of Einstein. | 아인슈타인 전기를 읽었다. | The biography was very detailed. | 전기가 매우 상세했다.
theme | θiːm | 주제, 테마 | topic, subject | - | The main theme is love. | 주요 주제가 사랑이다. | The theme of the essay is justice. | 에세이의 주제가 정의이다.
literature | ˈlɪtərətʃər | 문학, 문헌 | writing, books | - | She studies English literature. | 영문학을 공부한다. | There is extensive literature on the topic. | 그 주제에 대한 문헌이 많다.
philosophy | fɪˈlɑːsəfi | 철학, 인생관 | thought, ideology | - | She studied Eastern philosophy. | 동양 철학을 공부했다. | His philosophy of life is simple. | 그의 인생관이 단순하다.
aesthetic | ɛsˈθɛtɪk | 미적인, 심미적인, 미학 | artistic, visual | ugly | The aesthetic appeal was undeniable. | 미적 매력이 부인할 수 없었다. | She has an aesthetic sense. | 미적 감각이 있다.
metaphor | ˈmɛtəfɔːr | 은유, 비유 | figure of speech, analogy | literal | Life is a journey is a common metaphor. | '인생은 여행이다'가 흔한 은유이다. | She used a powerful metaphor. | 강력한 은유를 사용했다.
irony | ˈaɪrəni | 역설, 아이러니, 반어법 | sarcasm, paradox | sincerity | The irony of the situation was clear. | 상황의 아이러니가 분명했다. | She spoke with irony. | 아이러니하게 말했다.
analogy | əˈnælədʒi | 유추, 유사 | comparison, similarity | difference | She drew an analogy between life and a game. | 인생과 게임 사이의 유추를 했다. | The analogy is helpful. | 유추가 도움이 된다.
controversy | ˈkɑːntrəvɜːrsi | 논란, 논쟁 | debate, dispute | agreement | The book caused controversy. | 책이 논란을 일으켰다. | The controversy continues. | 논란이 계속된다.
satire | ˈsætaɪər | 풍자, 풍자 작품 | mockery, parody | praise | The movie is a satire of politics. | 영화가 정치 풍자이다. | Satire can be very effective. | 풍자가 매우 효과적일 수 있다.
abstract | ˈæbstrækt | 추상적인, 요약, 추상화 | theoretical, summary | concrete | The concept is too abstract. | 개념이 너무 추상적이다. | She likes abstract art. | 추상 미술을 좋아한다.
concrete | ˈkɑːnkriːt | 구체적인, 콘크리트 | specific, solid | abstract, vague | Give me a concrete example. | 구체적인 예를 들어라. | The floor is made of concrete. | 바닥이 콘크리트로 되어 있다.
prose | proʊz | 산문, 일반 문장 | text, writing | verse, poetry | She writes beautiful prose. | 아름다운 산문을 쓴다. | The novel is written in prose. | 소설이 산문으로 쓰였다.
verse | vɜːrs | 시, 운문 | poetry, stanza | prose | She memorized a verse from the poem. | 시에서 한 절을 외웠다. | He writes in free verse. | 자유시로 쓴다.
rhetoric | ˈrɛtərɪk | 수사학, 미사여구 | eloquence, persuasion | - | She studied the art of rhetoric. | 수사학을 공부했다. | Political rhetoric can be misleading. | 정치적 미사여구가 오해를 불러일으킬 수 있다.
symbolism | ˈsɪmbəlɪzəm | 상징주의, 상징성 | representation, imagery | realism | The novel is full of symbolism. | 소설에 상징이 가득하다. | She studied symbolism in art. | 미술에서 상징주의를 공부했다.
portrait | ˈpɔːrtrɪt | 초상화, 인물 묘사 | painting, depiction | - | She painted his portrait. | 그의 초상화를 그렸다. | The book is a portrait of 19th century life. | 책이 19세기 삶의 인물 묘사이다.
sculpture | ˈskʌlptʃər | 조각, 조각품 | statue, carving | - | The museum has ancient sculptures. | 박물관에 고대 조각이 있다. | She creates modern sculpture. | 현대 조각을 만든다.
archaeology | ˌɑːrkiˈɑːlədʒi | 고고학 | antiquities, excavation | - | She studies archaeology. | 고고학을 공부한다. | The archaeology site was excavated. | 고고학 발굴지가 발굴되었다.
artifact | ˈɑːrtɪfækt | 유물, 공예품 | relic, antique | - | The museum displays ancient artifacts. | 박물관이 고대 유물을 전시한다. | The artifact was priceless. | 유물이 값을 매길 수 없었다.
medieval | ˌmɛdiˈiːvəl | 중세의 | middle-age, feudal | modern | She studied medieval history. | 중세사를 공부했다. | The castle is a medieval structure. | 성이 중세 건축물이다.
renaissance | ˌrɛnəˈsɑːns | 르네상스, 부활, 부흥 | revival, rebirth | decline | The Renaissance began in Italy. | 르네상스가 이탈리아에서 시작됐다. | There was a renaissance in music. | 음악에 부흥이 있었다.
cathedral | kəˈθiːdrəl | 대성당 | church, basilica | - | The cathedral is stunning. | 대성당이 아름답다. | They visited the ancient cathedral. | 고대 대성당을 방문했다.
manuscript | ˈmænjuskrɪpt | 원고, 필사본 | document, script | - | She submitted her manuscript. | 원고를 제출했다. | The ancient manuscript was preserved. | 고대 필사본이 보존되었다.
chronicle | ˈkrɑːnɪkəl | 연대기, 기록하다 | record, history | - | The chronicle describes ancient events. | 연대기가 고대 사건을 묘사한다. | She chronicled her travels. | 여행을 기록했다.
folklore | ˈfoʊklɔːr | 민속, 민간전승 | tradition, legend | - | Korean folklore is rich and varied. | 한국 민속이 풍부하고 다양하다. | She studied folklore in college. | 대학에서 민속학을 공부했다.
dynasty | ˈdaɪnəsti | 왕조, 시대 | reign, era | - | The Joseon Dynasty lasted 500 years. | 조선 왕조가 500년 지속됐다. | The dynasty fell. | 왕조가 몰락했다.
monument | ˈmɑːnjumənt | 기념물, 기념비 | memorial, landmark | - | They built a monument. | 기념비를 세웠다. | The monument honors the soldiers. | 기념비가 군인을 기린다.
indigenous | ɪnˈdɪdʒənəs | 토착의, 원주민의 | native, aboriginal | foreign | Protect indigenous cultures. | 토착 문화를 보호해라. | The plant is indigenous to Korea. | 식물이 한국 토착이다.
be dedicated to | biː ˈdɛdɪkeɪtɪd tuː | ~에 전념하다, 바쳐지다 | be devoted to, committed to | - | She is dedicated to her career. | 직업에 전념한다. | The museum is dedicated to modern art. | 박물관이 현대 미술에 전념한다.
in contrast with | ɪn ˈkɑːntræst wɪð | ~와 대조적으로 | compared with, as opposed to | similar to | In contrast with the past, life is easier now. | 과거와 대조적으로 삶이 더 쉬워졌다. | In contrast with her sister, she is quiet. | 언니와 대조적으로 그녀는 조용하다.
have an effect on | hæv ən ɪˈfɛkt ɑːn | ~에 영향을 미치다 | influence, affect | - | Music has an effect on mood. | 음악이 기분에 영향을 미친다. | Technology has an effect on society. | 기술이 사회에 영향을 미친다.
=== Day 15 ===
algorithm | ˈælɡərɪðəm | 알고리즘, 연산 방법 | formula, process | - | The algorithm sorts data efficiently. | 알고리즘이 데이터를 효율적으로 정렬한다. | She developed a new algorithm. | 새 알고리즘을 개발했다.
artificial | ˌɑːrtɪˈfɪʃəl | 인공적인, 인조의 | synthetic, man-made | natural | Artificial intelligence is advancing. | 인공 지능이 발전하고 있다. | The flowers are artificial. | 꽃이 인조이다.
database | ˈdeɪtəbeɪs | 데이터베이스, 자료 저장소 | records, archive | - | The database stores customer information. | 데이터베이스가 고객 정보를 저장한다. | Access the company database. | 회사 데이터베이스에 접근해라.
digital | ˈdɪdʒɪtəl | 디지털의, 전자의 | electronic, computerized | analog | We live in a digital age. | 디지털 시대에 살고 있다. | She has a digital camera. | 디지털 카메라가 있다.
innovation | ˌɪnəˈveɪʃən | 혁신, 새로운 것 | invention, creation | tradition | Innovation drives economic growth. | 혁신이 경제 성장을 주도한다. | The company is known for innovation. | 회사가 혁신으로 유명하다.
automation | ˌɔːtəˈmeɪʃən | 자동화, 자동 조작 | mechanization | manual labor | Automation has changed manufacturing. | 자동화가 제조업을 바꿨다. | Jobs were lost due to automation. | 자동화로 일자리가 줄었다.
virtual | ˈvɜːrtʃuəl | 가상의, 사실상의 | simulated, digital | real, actual | She attended a virtual meeting. | 가상 회의에 참석했다. | Virtual reality is becoming popular. | 가상 현실이 인기를 얻고 있다.
obsolete | ˌɑːbsəˈliːt | 구식의, 쓸모없는 | outdated, old-fashioned | modern, current | The technology became obsolete. | 기술이 구식이 됐다. | Some words become obsolete over time. | 시간이 지나면 구식이 되는 단어도 있다.
device | dɪˈvaɪs | 기기, 장치, 방법 | gadget, tool | - | She uses a mobile device. | 모바일 기기를 사용한다. | The device is easy to use. | 장치가 쓰기 쉽다.
platform | ˈplætfɔːrm | 플랫폼, 무대 | stage, base | - | She launched an online platform. | 온라인 플랫폼을 만들었다. | The train arrived at the platform. | 기차가 플랫폼에 도착했다.
satellite | ˈsætəlaɪt | 위성, 인공위성 | orbiter | - | The satellite orbits the Earth. | 위성이 지구를 돈다. | She watches satellite TV. | 위성 TV를 시청한다.
network | ˈnɛtwɜːrk | 네트워크, 통신망 | system, web | isolation | The network crashed. | 네트워크가 다운됐다. | She has a wide professional network. | 넓은 전문 네트워크가 있다.
bandwidth | ˈbændwɪdθ | 대역폭, 처리 능력 | capacity, range | - | The bandwidth is limited. | 대역폭이 제한적이다. | Increase the bandwidth for faster speed. | 더 빠른 속도를 위해 대역폭을 늘려라.
encrypt | ɪnˈkrɪpt | 암호화하다, 코드화하다 | encode, cipher | decrypt | Encrypt your data for safety. | 안전을 위해 데이터를 암호화해라. | The message was encrypted. | 메시지가 암호화되었다.
interface | ˈɪntərfeɪs | 인터페이스, 접점 | connection, link | - | The user interface is friendly. | 사용자 인터페이스가 친화적이다. | She designed the interface. | 인터페이스를 설계했다.
hardware | ˈhɑːrdwɛr | 하드웨어, 장비 | equipment, machinery | software | The hardware needs an upgrade. | 하드웨어가 업그레이드가 필요하다. | She studies computer hardware. | 컴퓨터 하드웨어를 공부한다.
software | ˈsɔːftwɛr | 소프트웨어, 프로그램 | program, application | hardware | She developed the software. | 소프트웨어를 개발했다. | Update the software regularly. | 소프트웨어를 정기적으로 업데이트해라.
browse | braʊz | 둘러보다, 검색하다 | explore, search | - | She browsed the internet. | 인터넷을 검색했다. | He browsed through the magazine. | 잡지를 둘러봤다.
malware | ˈmælwɛr | 악성 소프트웨어, 맬웨어 | virus, spyware | - | The malware corrupted the files. | 맬웨어가 파일을 손상시켰다. | Protect your system from malware. | 맬웨어로부터 시스템을 보호해라.
capacity | kəˈpæsəti | 용량, 능력, 수용력 | volume, ability | inability | The stadium has a capacity of 50,000. | 경기장 수용 인원이 5만 명이다. | She has the capacity to lead. | 리더십 역량이 있다.
simulate | ˈsɪmjuleɪt | 모의실험하다, 시뮬레이션하다 | imitate, mimic | - | The program simulates real conditions. | 프로그램이 실제 조건을 시뮬레이션한다. | They simulated the experiment. | 실험을 모의실험했다.
autonomous | ɔːˈtɑːnəməs | 자율적인, 자치의 | independent, self-governing | dependent | Autonomous cars are being tested. | 자율 주행 차가 테스트 중이다. | The region became autonomous. | 지역이 자치 지역이 됐다.
data | ˈdeɪtə | 데이터, 자료, 정보 | information, facts | - | Collect and analyze the data. | 데이터를 수집하고 분석해라. | The data shows positive trends. | 데이터가 긍정적 추세를 보여준다.
prototype | ˈproʊtətaɪp | 시제품, 원형 | model, sample | final product | She built a prototype. | 시제품을 만들었다. | The prototype was tested. | 시제품이 테스트되었다.
compatible | kəmˈpætɪbl | 호환되는, 양립할 수 있는 | consistent, harmonious | incompatible | The software is compatible with Mac. | 소프트웨어가 맥과 호환된다. | They are compatible personalities. | 양립 가능한 성격이다.
pixel | ˈpɪksəl | 픽셀, 화소 | dot, point | - | The image has millions of pixels. | 이미지에 수백만 픽셀이 있다. | Higher pixel count means better quality. | 더 높은 화소가 더 좋은 품질을 의미한다.
sensor | ˈsɛnsər | 센서, 감지기 | detector, probe | - | The sensor detects motion. | 센서가 움직임을 감지한다. | Temperature sensors are built in. | 온도 센서가 내장되어 있다.
circuit | ˈsɜːrkɪt | 회로, 순환 | loop, path | - | The electric circuit was broken. | 전기 회로가 끊겼다. | She studied electrical circuits. | 전기 회로를 공부했다.
configure | kənˈfɪɡjər | 구성하다, 설정하다 | set up, arrange | - | She configured the system settings. | 시스템 설정을 구성했다. | Configure the network properly. | 네트워크를 제대로 설정해라.
integrate | ˈɪntɪɡreɪt | 통합하다, 합치다 | combine, merge | separate, divide | She integrated the two systems. | 두 시스템을 통합했다. | The school integrates technology into learning. | 학교가 기술을 학습에 통합한다.
gadget | ˈɡædʒɪt | 기기, 도구 | device, tool | - | She bought a new gadget. | 새 기기를 샀다. | Electronic gadgets are popular. | 전자 기기가 인기이다.
optimize | ˈɑːptɪmaɪz | 최적화하다 | improve, enhance | worsen | She optimized the code. | 코드를 최적화했다. | Optimize the website for mobile. | 모바일용으로 웹사이트를 최적화해라.
transmit | trænzˈmɪt | 전송하다, 전달하다 | send, broadcast | receive | The radio transmits signals. | 라디오가 신호를 전송한다. | Data is transmitted via Wi-Fi. | 데이터가 와이파이로 전송된다.
retrieve | rɪˈtriːv | 회수하다, 검색하다 | recover, fetch | lose | She retrieved the lost data. | 잃어버린 데이터를 회수했다. | Retrieve the file from the server. | 서버에서 파일을 검색해라.
render | ˈrɛndər | 렌더링하다, 만들다, 표현하다 | produce, generate | - | The software renders 3D images. | 소프트웨어가 3D 이미지를 렌더링한다. | The heat rendered the area uninhabitable. | 열이 지역을 사람이 살 수 없게 만들었다.
debug | diːˈbʌɡ | 디버그하다, 오류를 수정하다 | fix, troubleshoot | break | She debugged the program. | 프로그램을 디버그했다. | Debugging takes patience. | 디버깅에는 인내가 필요하다.
keep up with | kiːp ʌp wɪð | ~을 따라가다, 뒤지지 않다 | stay current, match | fall behind | It's hard to keep up with technology. | 기술을 따라가기가 어렵다. | She keeps up with the latest trends. | 최신 트렌드를 따라간다.
break down | breɪk daʊn | 고장나다, 분해하다, 무너지다 | fail, decompose | repair | The car broke down on the highway. | 고속도로에서 차가 고장났다. | She broke down the problem into steps. | 문제를 단계로 나누었다.
be made up of | biː meɪd ʌp ɑːv | ~으로 구성되다 | consist of, comprise | - | The team is made up of ten members. | 팀이 10명으로 구성된다. | Water is made up of hydrogen and oxygen. | 물은 수소와 산소로 구성된다.
`;

fs.appendFileSync(path.join(__dirname, 'high1-raw-data.txt'), data, 'utf-8');
console.log('Days 14-15 appended');
