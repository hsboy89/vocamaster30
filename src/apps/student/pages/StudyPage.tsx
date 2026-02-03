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
    const { isGuest } = useAuthStore();

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
    const isLocked = isGuest && day >= 4;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-[#020617] pb-12 selection:bg-blue-500/30">
                {/* Background Decorative Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full" />
                </div>

                {/* Header (Premium) */}
                <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="hidden sm:inline font-bold text-sm tracking-tight">돌아가기</span>
                        </button>
                        <div className="text-center">
                            <h1 className="font-black text-white tracking-tight">
                                {LEVEL_INFO[level].nameKo}
                            </h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Day {day.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="w-20" />
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
                    {/* Blurred Content Preview */}
                    <div className="filter blur-xl pointer-events-none select-none opacity-20 scale-95 transition-all duration-1000">
                        <StudyCard
                            word={words[0]} // Show first word blurred
                            hideMode="none"
                            level={level}
                            day={day}
                        />
                    </div>

                    {/* Lock Overlay (Premium Glass) */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 animate-fade-in-up">
                        <div
                            className="w-full max-w-sm p-10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
                            style={{
                                background: 'rgba(30, 41, 59, 0.7)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-500/20 blur-3xl rounded-full" />

                            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-2xl border border-white/10 transform -rotate-6">
                                🔒
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                                체험판 종료
                            </h2>
                            <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                                Day 4부터는 <span className="text-blue-400 font-bold">정식 등록</span> 후<br />
                                모든 학습 기능을 무제한으로<br />
                                이용하실 수 있습니다.
                            </p>
                            <button
                                onClick={() => {
                                    useAuthStore.getState().logout();
                                }}
                                className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                                <div className="flex items-center justify-center gap-2 relative z-10">
                                    <span>로그인 하러 가기</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] pb-12 selection:bg-blue-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="hidden sm:inline font-bold text-sm tracking-tight">돌아가기</span>
                    </button>
                    <div className="text-center group">
                        <h1 className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {LEVEL_INFO[level].nameKo}
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Day {day.toString().padStart(2, '0')}</p>
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 relative z-10">
                {/* Study Card */}
                <div className="animate-fade-in-up">
                    <StudyCard
                        word={currentWord}
                        hideMode={hideMode}
                        level={level}
                        day={day}
                        autoSpeak={autoSpeak}
                        onMemorized={handleMemorized}
                    />
                </div>

                {/* Controls */}
                <div className="animate-fade-in-up [animation-delay:200ms]">
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
        </div>
    );
}

export default StudyPage;

