import { useState, useEffect, useRef, useCallback } from 'react';
import { Word } from '../../types';

interface QuizSpellingProps {
    word: Word;
    onAnswer: (answer: string, isCorrect: boolean) => void;
}

const TIMER_DURATION = 10; // 10초

export function QuizSpelling({ word, onAnswer }: QuizSpellingProps) {
    const [input, setInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [isTimeout, setIsTimeout] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<number | null>(null);

    // 타이머 정리 함수
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // 오답 사운드
    const playWrongSound = useCallback(() => {
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
    }, []);

    // 시간 초과 처리
    const handleTimeout = useCallback(() => {
        clearTimer();
        setIsTimeout(true);
        setShowResult(true);
        setIsCorrect(false);
        playWrongSound();

        setTimeout(() => {
            onAnswer("", false); // 오답으로 처리
        }, 2000);
    }, [clearTimer, onAnswer, playWrongSound]);

    // 타이머 시작/리셋
    useEffect(() => {
        setInput('');
        setShowResult(false);
        setIsCorrect(false);
        setShowHint(false);
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

        inputRef.current?.focus();

        return () => clearTimer();
    }, [word.id, clearTimer]);

    // 시간이 0이 되면 타임아웃 처리
    useEffect(() => {
        if (timeLeft === 0 && !showResult) {
            handleTimeout();
        }
    }, [timeLeft, showResult, handleTimeout]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showResult) return;

        clearTimer(); // 답변 제출 시 타이머 중지
        const correct = input.toLowerCase().trim() === word.word.toLowerCase();
        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(() => {
            onAnswer(input, correct);
        }, 2000);
    };

    const getHint = () => {
        const firstLetter = word.word[0];
        const rest = word.word.slice(1).replace(/[a-zA-Z]/g, '_');
        return firstLetter + rest;
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
                <p className="text-gray-500 mb-2">다음 뜻에 해당하는 영단어를 입력하세요</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {word.meaning}
                </h2>

                {showHint && (
                    <p className="text-blue-500 font-mono text-xl animate-fade-in">
                        힌트: {getHint()}
                    </p>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="relative mb-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={showResult}
                        placeholder="영단어 입력..."
                        className={`w-full px-6 py-4 text-xl text-center border-2 rounded-xl outline-none transition-all ${showResult
                            ? isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                            : 'border-gray-200 focus:border-blue-500'
                            }`}
                        autoComplete="off"
                        autoCapitalize="off"
                    />
                </div>

                <div className="flex gap-3">
                    {!showResult && (
                        <>
                            <button
                                type="button"
                                onClick={() => setShowHint(true)}
                                disabled={showHint}
                                className="btn btn-outline flex-1"
                            >
                                💡 힌트
                            </button>
                            <button type="submit" className="btn btn-primary flex-1">
                                확인
                            </button>
                        </>
                    )}
                </div>
            </form>

            {/* Result */}
            {showResult && (
                <div className={`mt-6 p-6 rounded-xl text-center animate-fade-in ${isCorrect
                    ? 'bg-green-100'
                    : isTimeout
                        ? 'quiz-timeout-message'
                        : 'bg-red-100'
                    }`}>
                    {isCorrect ? (
                        <div>
                            <p className="text-green-800 font-semibold text-xl mb-2">🎉 정답입니다!</p>
                            <p className="text-green-700">{word.word}</p>
                        </div>
                    ) : isTimeout ? (
                        <div>
                            <p className="text-red-800 font-semibold text-xl mb-2">⏰ 시간 초과!</p>
                            <p className="text-red-700">
                                정답: <span className="font-bold">{word.word}</span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-red-800 font-semibold text-xl mb-2">😅 틀렸습니다</p>
                            <p className="text-red-700">
                                정답: <span className="font-bold">{word.word}</span>
                            </p>
                            <p className="text-red-600 text-sm mt-1">
                                입력: <span className="line-through">{input}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pronunciation */}
            <div className="text-center mt-6 text-gray-400">
                <p>발음: {word.pronunciation}</p>
            </div>
        </div>
    );
}

export default QuizSpelling;
