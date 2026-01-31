import { useState, useEffect, useCallback } from 'react';
import { Word, Level, QuizType, LEVEL_INFO } from '../types';
import { useQuiz } from '../hooks';
import { QuizChoice, QuizSpelling, QuizResult } from '../components';

interface QuizPageProps {
    level: Level;
    day: number;
    words: Word[];
    initialQuizType: QuizType;
    onBack: () => void;
}

export function QuizPage({ level, day, words, initialQuizType, onBack }: QuizPageProps) {
    const [quizType, setQuizType] = useState<QuizType>(initialQuizType);
    const [isStarted, setIsStarted] = useState(false);

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
        resetQuiz,
        saveResult,
    } = useQuiz();

    const handleStart = useCallback((type: QuizType) => {
        setQuizType(type);
        startQuiz(words, type);
        setIsStarted(true);
    }, [words, startQuiz]);

    useEffect(() => {
        if (initialQuizType && words.length > 0) {
            handleStart(initialQuizType);
        }
    }, [initialQuizType, words, handleStart]);

    const handleAnswer = (answer: string, _isCorrect: boolean) => {
        checkAnswer(answer);
        nextQuestion();
    };

    const handleRetry = () => {
        resetQuiz();
        handleStart(quizType);
    };

    const handleReviewWrong = () => {
        if (wrongWords.length > 0) {
            resetQuiz();
            startQuiz(wrongWords, quizType);
            setIsStarted(true);
        }
    };

    const handleClose = () => {
        saveResult(level, day);
        onBack();
    };

    // Quiz Type Selection
    if (!isStarted) {
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
                        <h1 className="font-semibold text-gray-900">퀴즈 선택</h1>
                        <div className="w-20" />
                    </div>
                </header>

                <div className="max-w-md mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 유형 선택</h2>
                        <p className="text-gray-500">
                            {LEVEL_INFO[level].nameKo} Day {day} ({words.length}단어)
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleStart('choice')}
                            className="w-full p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">📝</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                        뜻 고르기
                                    </h3>
                                    <p className="text-sm text-gray-500">4지선다 객관식 퀴즈</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleStart('spelling')}
                            className="w-full p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">⌨️</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                        스펠링 타이핑
                                    </h3>
                                    <p className="text-sm text-gray-500">뜻을 보고 영단어 입력</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Complete
    if (isComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <QuizResult
                        score={score}
                        totalQuestions={totalQuestions}
                        wrongCount={wrongWords.length}
                        quizType={quizType}
                        onRetry={handleRetry}
                        onClose={handleClose}
                        onReviewWrong={handleReviewWrong}
                    />
                </div>
            </div>
        );
    }

    // Quiz In Progress
    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={handleClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <h1 className="font-semibold text-gray-900">
                            {quizType === 'choice' ? '뜻 고르기' : '스펠링 타이핑'}
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
                        className="h-full bg-blue-500 transition-all duration-300"
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

export default QuizPage;
