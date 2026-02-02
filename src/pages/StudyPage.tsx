import { useState, useEffect } from 'react';
import { Level, Word, QuizType, LEVEL_INFO } from '../types';
import { getVocabulary } from '../data';
import { useProgress } from '../hooks';
import { StudyCard, StudyControls } from '../components';

type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

const AUTO_SPEAK_STORAGE_KEY = 'vocamaster-auto-speak';

interface StudyPageProps {
    level: Level;
    day: number;
    onBack: () => void;
    onQuizStart: (words: Word[], quizType: QuizType) => void;
}

export function StudyPage({ level, day, onBack, onQuizStart }: StudyPageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hideMode, setHideMode] = useState<HideMode>('none');
    const [words, setWords] = useState<Word[]>([]);
    const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
        const stored = localStorage.getItem(AUTO_SPEAK_STORAGE_KEY);
        return stored === 'true';
    });
    const { getStatus, setStatus, addMemorizedWord } = useProgress();

    // Save autoSpeak preference
    useEffect(() => {
        localStorage.setItem(AUTO_SPEAK_STORAGE_KEY, String(autoSpeak));
    }, [autoSpeak]);

    useEffect(() => {
        const vocab = getVocabulary(level, day);
        if (vocab) {
            setWords(vocab.words);
            const currentStatus = getStatus(level, day);
            if (currentStatus === 'not-started') {
                setStatus(level, day, 'in-progress');
            }
        }
    }, [level, day, setStatus, getStatus]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleMemorized = () => {
        addMemorizedWord(level, day, words[currentIndex].id, words.length);
    };

    const handleQuizStart = () => {
        onQuizStart(words, 'choice');
    };

    if (words.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">단어 데이터를 불러오는 중...</p>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">돌아가기</span>
                    </button>
                    <div className="text-center">
                        <h1 className="font-semibold text-gray-900">
                            {LEVEL_INFO[level].nameKo}
                        </h1>
                        <p className="text-sm text-gray-500">Day {day.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Study Card */}
                <StudyCard
                    word={currentWord}
                    hideMode={hideMode}
                    level={level}
                    day={day}
                    autoSpeak={autoSpeak}
                    onMemorized={handleMemorized}
                />

                {/* Controls */}
                <StudyControls
                    currentIndex={currentIndex}
                    totalWords={words.length}
                    hideMode={hideMode}
                    autoSpeak={autoSpeak}
                    onHideModeChange={setHideMode}
                    onAutoSpeakChange={setAutoSpeak}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onQuizStart={handleQuizStart}
                />
            </div>
        </div>
    );
}

export default StudyPage;

