import { useState, useEffect, useRef } from 'react';
import { Word } from '../../types';

interface QuizSpellingProps {
    word: Word;
    onAnswer: (answer: string, isCorrect: boolean) => void;
}

export function QuizSpelling({ word, onAnswer }: QuizSpellingProps) {
    const [input, setInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInput('');
        setShowResult(false);
        setIsCorrect(false);
        setShowHint(false);
        inputRef.current?.focus();
    }, [word.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showResult) return;

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

    return (
        <div className="p-6">
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
                <div className={`mt-6 p-6 rounded-xl text-center animate-fade-in ${isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {isCorrect ? (
                        <div>
                            <p className="text-green-800 font-semibold text-xl mb-2">🎉 정답입니다!</p>
                            <p className="text-green-700">{word.word}</p>
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
