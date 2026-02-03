import { useState, useEffect, useRef, useCallback } from 'react';
import { Word } from '../../../../shared/types';

interface QuizChoiceProps {
    word: Word;
    options: string[];
    onAnswer: (answer: string, isCorrect: boolean) => void;
}

const TIMER_DURATION = 10; // 10초

export function QuizChoice({ word, options, onAnswer }: QuizChoiceProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [isTimeout, setIsTimeout] = useState(false);
    const timerRef = useRef<number | null>(null);

    // 타이머 정리 함수
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // 시간 초과 처리
    const handleTimeout = useCallback(() => {
        clearTimer();
        setIsTimeout(true);
        setShowResult(true);
        playWrongSound();

        setTimeout(() => {
            onAnswer("", false); // 오답으로 처리
        }, 1500);
    }, [clearTimer, onAnswer]);

    // 타이머 시작/리셋
    useEffect(() => {
        setSelectedOption(null);
        setShowResult(false);
        setTimeLeft(TIMER_DURATION);
        setIsTimeout(false);
        clearTimer();

        timerRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearTimer();
    }, [word.id, clearTimer]);

    // 시간이 0이 되면 타임아웃 처리
    useEffect(() => {
        if (timeLeft === 0 && !showResult) {
            handleTimeout();
        }
    }, [timeLeft, showResult, handleTimeout]);

    const handleSelect = (option: string) => {
        if (showResult) return;

        clearTimer(); // 답변 선택 시 타이머 중지
        setSelectedOption(option);
        setShowResult(true);

        const isCorrect = option === word.meaning;

        // 사운드 피드백
        if (isCorrect) {
            playCorrectSound();
        } else {
            playWrongSound();
        }

        setTimeout(() => {
            onAnswer(option, isCorrect);
        }, 1500);
    };

    const playCorrectSound = () => {
        try {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch {
            // Audio not supported
        }
    };

    const playWrongSound = () => {
        try {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.type = 'sawtooth';

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch {
            // Audio not supported
        }
    };

    const getOptionClass = (option: string) => {
        if (!showResult) {
            return selectedOption === option ? 'border-blue-500 bg-blue-50' : '';
        }

        if (option === word.meaning) {
            return 'correct';
        }

        if (selectedOption === option || isTimeout) {
            return 'incorrect';
        }

        return 'opacity-50';
    };

    // 타이머 프로그레스 계산
    const timerProgress = (timeLeft / TIMER_DURATION) * 100;
    const circumference = 2 * Math.PI * 24; // 반지름 24의 원 둘레
    const strokeDashoffset = circumference - (timerProgress / 100) * circumference;
    const timerColorClass = timeLeft <= 3 ? 'danger' : timeLeft <= 5 ? 'warning' : '';

    return (
        <div className="p-6">
            {/* Timer */}
            {!showResult && (
                <div className="flex justify-center mb-4">
                    <div className="quiz-timer">
                        <svg className="quiz-timer-circle" width="60" height="60">
                            <circle className="quiz-timer-bg" cx="30" cy="30" r="24" />
                            <circle
                                className={`quiz-timer-progress ${timerColorClass}`}
                                cx="30"
                                cy="30"
                                r="24"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <span className={`quiz-timer-text ${timerColorClass}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>
            )}

            {/* Question */}
            <div className="text-center mb-8">
                <p className="text-gray-500 mb-2">다음 단어의 뜻을 고르세요</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {word.word}
                </h2>
                <p className="text-gray-400">{word.pronunciation}</p>
            </div>

            {/* Options */}
            <div className="grid gap-3">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)}
                        disabled={showResult}
                        className={`quiz-option text-left ${getOptionClass(option)} ${showResult ? 'cursor-default' : ''
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 mr-3 font-semibold">
                            {index + 1}
                        </span>
                        <span className="flex-1">{option}</span>

                        {showResult && option === word.meaning && (
                            <span className="text-green-500 text-xl">✓</span>
                        )}
                        {showResult && selectedOption === option && option !== word.meaning && (
                            <span className="text-red-500 text-xl">✗</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Result Message */}
            {showResult && (
                <div className={`mt-6 p-4 rounded-xl text-center animate-fade-in ${selectedOption === word.meaning
                    ? 'bg-green-100 text-green-800'
                    : isTimeout
                        ? 'quiz-timeout-message'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {selectedOption === word.meaning ? (
                        <p className="font-semibold">🎉 정답입니다!</p>
                    ) : isTimeout ? (
                        <p className="font-semibold">
                            ⏰ 시간 초과! 정답: <span className="underline">{word.meaning}</span>
                        </p>
                    ) : (
                        <p className="font-semibold">
                            😅 틀렸습니다. 정답: <span className="underline">{word.meaning}</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuizChoice;
