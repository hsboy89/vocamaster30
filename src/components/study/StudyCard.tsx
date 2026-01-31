import { useState, useEffect } from 'react';
import { Word, Level } from '../../types';
import { useTTS } from '../../hooks';
import * as storage from '../../services/storage';

type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

interface StudyCardProps {
    word: Word;
    hideMode: HideMode;
    level?: Level;
    day?: number;
    onMemorized?: () => void;
}

export function StudyCard({ word, hideMode, level, day, onMemorized }: StudyCardProps) {
    const { speak } = useTTS();
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMemorized, setIsMemorized] = useState(false);
    const [visibleTranslations, setVisibleTranslations] = useState<Record<number, boolean>>({});

    // Load saved memorization state when word changes
    useEffect(() => {
        setIsFlipped(false);
        setVisibleTranslations({});

        // Check if this word was already memorized
        if (level && day) {
            const progress = storage.getProgress(level, day);
            if (progress && progress.memorizedWords.includes(word.id)) {
                setIsMemorized(true);
            } else {
                setIsMemorized(false);
            }
        } else {
            setIsMemorized(false);
        }
    }, [word.id, level, day]);

    const handleSpeak = () => {
        speak(word.word);
    };

    const handleMemorize = () => {
        setIsMemorized(!isMemorized);
        if (!isMemorized && onMemorized) {
            onMemorized();
        }
    };

    const shouldHide = (type: 'word' | 'meaning' | 'synonyms') => {
        return hideMode === type && !isFlipped;
    };

    return (
        <div
            className={`study-card p-6 sm:p-8 cursor-pointer transition-all duration-300 ${isMemorized ? 'ring-2 ring-green-400' : ''
                }`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {isMemorized && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full animate-fade-in">
                            암기 완료
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak();
                        }}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
                        title="발음 듣기"
                    >
                        <svg className="w-6 h-6 text-blue-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMemorize();
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${isMemorized
                            ? 'bg-green-100 text-green-600 ring-2 ring-green-400'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
                            }`}
                        title={isMemorized ? '암기 취소하려면 클릭' : '외웠으면 클릭!'}
                    >
                        <svg className="w-4 h-4" fill={isMemorized ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isMemorized ? '외웠어요!' : '외웠어요'}
                    </button>
                </div>
            </div>

            {/* Word */}
            <div className="text-center mb-6">
                <h2
                    className={`text-3xl sm:text-4xl font-bold mb-2 transition-all ${shouldHide('word') ? 'blur-lg select-none' : 'text-gray-900'
                        }`}
                >
                    {word.word}
                </h2>
                <p className="text-gray-500 text-lg">{word.pronunciation}</p>
            </div>

            {/* Meaning */}
            <div
                className={`text-center mb-6 p-4 bg-gray-50 rounded-xl transition-all ${shouldHide('meaning') ? 'blur-lg select-none' : ''
                    }`}
            >
                <p className="text-xl sm:text-2xl font-medium text-gray-800">
                    {word.meaning}
                </p>
            </div>

            {/* Synonyms & Antonyms */}
            <div
                className={`flex flex-wrap justify-center gap-2 mb-6 transition-all ${shouldHide('synonyms') ? 'blur-lg select-none' : ''
                    }`}
            >
                {word.synonyms.map((syn, index) => (
                    <span key={`syn-${index}`} className="tag-synonym">
                        📗 {syn}
                    </span>
                ))}
                {word.antonyms.map((ant, index) => (
                    <span key={`ant-${index}`} className="tag-antonym">
                        📙 {ant}
                    </span>
                ))}
            </div>

            {/* Examples with Click-to-Reveal Translation */}
            <div className="space-y-4">
                {word.examples && word.examples.map((ex, index) => (
                    <div key={index} className="bg-blue-50 rounded-xl p-4 transition-all hover:bg-blue-100/50">
                        <p className="text-gray-700 italic text-center mb-2 leading-relaxed">
                            <span className="text-blue-500 mr-2 font-noto">💬</span>
                            "{ex.sentence}"
                        </p>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setVisibleTranslations(prev => ({ ...prev, [index]: !prev[index] }));
                            }}
                            className={`text-center p-2 rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium ${visibleTranslations[index]
                                ? 'bg-white/80 text-blue-700'
                                : 'bg-gray-200/50 text-gray-400 select-none hover:bg-gray-200'
                                }`}
                        >
                            {visibleTranslations[index] ? ex.translation : '💡 해석을 보려면 클릭하세요'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Flip Hint */}
            {hideMode !== 'none' && (
                <p className="text-center text-gray-400 text-sm mt-4">
                    카드를 클릭하면 {isFlipped ? '가려집니다' : '보입니다'}
                </p>
            )}
        </div>
    );
}

export default StudyCard;
