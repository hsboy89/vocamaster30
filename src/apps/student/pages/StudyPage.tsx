import { useState, useEffect } from 'react';
import { Level, Word, QuizType, LEVEL_INFO } from '../../../shared/types';
import { getVocabulary } from '../../../shared/data';
import { useProgress } from '../../../shared/hooks';
import { StudyCard, StudyControls } from '../components';
import { useAuthStore } from '../../../stores';

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

    // Guest Locking Logic
    const { isGuest } = useAuthStore();
    const isLocked = isGuest && day >= 4;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-gray-50 pb-8">
                {/* Header (Visible) */}
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
                        <div className="w-20" />
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 py-6 relative">
                    {/* Blurred Content Preview */}
                    <div className="filter blur-md pointer-events-none select-none opacity-50">
                        <StudyCard
                            word={words[0]} // Show first word blurred
                            hideMode="none"
                            level={level}
                            day={day}
                        />
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 border border-white/20">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                                🔒
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                체험판이 종료되었습니다
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Day 4부터는 정식 등록 후<br />
                                학습하실 수 있습니다.
                            </p>
                            <button
                                onClick={() => {
                                    useAuthStore.getState().logout();
                                    // Redirect to login handled by App router when auth state clears
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <span>로그인 하러 가기</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

