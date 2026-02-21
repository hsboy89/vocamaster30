import { useState, useEffect, useCallback, useRef } from 'react';
import { Level, LEVEL_INFO, Word } from '../../../shared/types';
import { useQuiz } from '../../../shared/hooks';
import { QuizChoice, QuizSpelling } from '../components';
import { getWrongAnswersByLevel, savePromotionTestResult } from '../../../shared/services/storage';

interface PromotionTestPageProps {
    level: Level;
    onBack: () => void;
    onPass: () => void;  // 통과 시 콜백
    onFail: () => void;  // 불합격 시 콜백
}

const PROMOTION_TEST_QUESTIONS = 20;
const PASS_THRESHOLD = 90; // 90% 이상 통과

export function PromotionTestPage({ level, onBack, onPass, onFail }: PromotionTestPageProps) {
    const [testWords, setTestWords] = useState<Word[]>([]);
    const [isLoadingWords, setIsLoadingWords] = useState(true);
    const [quizType] = useState<'choice' | 'spelling'>('choice');
    const [hasStarted, setHasStarted] = useState(false);

    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        score,
        wrongWords,
        isComplete,
        checkAnswer,
        nextQuestion,
        startQuiz,
    } = useQuiz();

    const didSave = useRef(false);

    // 오답 단어 로드 및 20개 랜덤 선택
    useEffect(() => {
        const loadWords = async () => {
            setIsLoadingWords(true);
            try {
                const wrongAnswers = await getWrongAnswersByLevel(level);
                const allWords = wrongAnswers.map(wa => wa.word);

                // 셔플 후 20개 선택
                const shuffled = [...allWords].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, PROMOTION_TEST_QUESTIONS);

                if (selected.length === 0) {
                    // 오답이 없으면 자동 통과
                    await savePromotionTestResult(level, 100, true);
                    onPass();
                    return;
                }

                setTestWords(selected);
            } catch (error) {
                console.error('Failed to load wrong answers for promotion test:', error);
            }
            setIsLoadingWords(false);
        };
        loadWords();
    }, [level]);

    const handleStart = useCallback(() => {
        if (testWords.length > 0) {
            startQuiz(testWords, quizType);
            setHasStarted(true);
        }
    }, [testWords, quizType, startQuiz]);

    const handleAnswer = (answer: string, _isCorrect: boolean) => {
        checkAnswer(answer);
        nextQuestion();
    };

    // 테스트 완료 시 결과 저장
    useEffect(() => {
        if (isComplete && !didSave.current) {
            didSave.current = true;

            const saveResult = async () => {
                const correctCount = totalQuestions - wrongWords.length;
                const percentage = Math.round((correctCount / totalQuestions) * 100);
                const passed = percentage >= PASS_THRESHOLD;

                await savePromotionTestResult(level, percentage, passed);
            };

            saveResult();
        }
    }, [isComplete, level, totalQuestions, wrongWords]);

    const levelInfo = LEVEL_INFO[level];

    // 로딩 중
    if (isLoadingWords) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">오답 단어를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 시작 전 안내 화면
    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-gray-50 pb-8">
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>돌아가기</span>
                        </button>
                        <h1 className="font-semibold text-gray-900">진급 테스트</h1>
                        <div className="w-20" />
                    </div>
                </header>

                <div className="max-w-md mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <span className="text-6xl block mb-4">🎯</span>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            진급 테스트
                        </h2>
                        <p className="text-gray-500 mb-1">
                            {levelInfo.nameKo} 진급 테스트
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
                            오답 단어 중 {testWords.length}개로 테스트합니다
                        </p>

                        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
                            <h3 className="text-sm font-bold text-amber-700 mb-2">📋 테스트 안내</h3>
                            <ul className="text-xs text-amber-600 space-y-1">
                                <li>• 문제 수: {testWords.length}문제</li>
                                <li>• 통과 기준: 평균 {PASS_THRESHOLD}% 이상</li>
                                <li>• 통과 시: 다음 레벨로 진급 가능</li>
                                <li>• 불합격 시: 현재 레벨을 다시 학습해야 합니다</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleStart}
                            className="btn btn-primary w-full py-3 text-base"
                        >
                            🚀 테스트 시작
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 테스트 완료
    if (isComplete) {
        const correctCount = totalQuestions - wrongWords.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passed = percentage >= PASS_THRESHOLD;

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <span className="text-6xl block mb-4 animate-bounce">
                        {passed ? '🎉' : '😢'}
                    </span>
                    <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-500'}`}>
                        {passed ? '합격!' : '불합격'}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {levelInfo.nameKo} 진급 테스트
                    </p>

                    {/* 점수 */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <div className="flex justify-center items-baseline gap-2 mb-4">
                            <span className="text-5xl font-bold text-gray-900">{percentage}</span>
                            <span className="text-2xl text-gray-400">%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-green-500 font-semibold text-lg">{correctCount}문제</p>
                                <p className="text-gray-500">정답</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-red-500 font-semibold text-lg">{wrongWords.length}문제</p>
                                <p className="text-gray-500">오답</p>
                            </div>
                        </div>
                    </div>

                    {/* 결과 메시지 */}
                    <div className={`rounded-xl p-4 mb-6 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className={`text-sm font-semibold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                            {passed
                                ? '🎊 축하합니다! 다음 레벨로 진급할 수 있습니다.'
                                : '📚 아쉽지만, 현재 레벨을 다시 학습해주세요.'
                            }
                        </p>
                    </div>

                    <button
                        onClick={passed ? onPass : onFail}
                        className={`btn w-full py-3 text-base ${passed ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {passed ? '🚀 다음 레벨로' : '📖 다시 학습하기'}
                    </button>
                </div>
            </div>
        );
    }

    // 테스트 진행 중
    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                            🎯 진급 테스트
                        </span>
                    </div>
                    <div className="text-center">
                        <h1 className="font-semibold text-gray-900">
                            {levelInfo.nameKo}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {currentIndex + 1} / {totalQuestions}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-green-600 font-semibold">{score}점</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100">
                    <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </header>

            {/* Quiz Content */}
            <div className="max-w-xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg">
                    {currentQuestion && quizType === 'choice' && (
                        <QuizChoice
                            word={currentQuestion.word}
                            options={currentQuestion.options || []}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentQuestion && quizType === 'spelling' && (
                        <QuizSpelling
                            word={currentQuestion.word}
                            onAnswer={handleAnswer}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PromotionTestPage;
