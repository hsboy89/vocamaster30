import { useState, useEffect } from 'react';
import { Word, Level } from '../../../../shared/types';
import { useTTS } from '../../../../shared/hooks';
import * as storage from '../../../../shared/services/storage';

type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

interface StudyCardProps {
    word: Word;
    hideMode: HideMode;
    level?: Level;
    day?: number;
    autoSpeak?: boolean;
    onMemorized?: () => void;
}

export function StudyCard({ word, hideMode, level, day, autoSpeak = false, onMemorized }: StudyCardProps) {
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

    // Auto speak when word changes - simple and direct approach
    useEffect(() => {
        // Only speak if autoSpeak is ON
        if (!autoSpeak) return;

        // Speak the current word with a delay for TTS initialization
        const timer = setTimeout(() => {
            speak(word.word);
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [word.id, autoSpeak]); // Trigger on word change or autoSpeak toggle

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
            className={`study-card p-6 sm:p-10 cursor-pointer transition-all duration-500 relative overflow-hidden group/card ${isMemorized
                ? 'ring-2 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                }`}
            style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Gloss Highlight */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2">
                    {isMemorized && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 animate-fade-in shadow-lg shadow-emerald-500/10">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            암기 완료
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak();
                        }}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all duration-300 border border-blue-500/20 group/speak"
                        title="발음 듣기"
                    >
                        <svg className="w-6 h-6 transform group-hover/speak:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMemorize();
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border shadow-lg ${isMemorized
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-300 border-white/10 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <svg className="w-4 h-4" fill={isMemorized ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {isMemorized ? '외웠어요!' : '외웠어요'}
                    </button>
                </div>
            </div>

            {/* Word Section */}
            <div className="text-center mb-8 relative z-10">
                <h2
                    className={`text-4xl sm:text-6xl font-black mb-3 tracking-tight transition-all duration-700 ${shouldHide('word') ? 'blur-2xl opacity-20 select-none scale-90' : 'text-white'
                        }`}
                >
                    {word.word}
                </h2>
                <div className={`flex items-center justify-center gap-2 text-slate-400 font-medium ${shouldHide('word') ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-blue-400/60">[</span>
                    <p className="text-lg tracking-wider">{word.pronunciation}</p>
                    <span className="text-blue-400/60">]</span>
                </div>
            </div>

            {/* Meaning Section - HIGH CONTRAST FIX */}
            <div
                className={`text-center mb-10 p-6 rounded-2xl transition-all duration-700 relative overflow-hidden group/meaning ${shouldHide('meaning') ? 'blur-2xl opacity-10 select-none' : ''
                    }`}
                style={{
                    background: 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40" />
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {word.meaning}
                </p>
            </div>

            {/* Synonyms & Antonyms */}
            <div
                className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 ${shouldHide('synonyms') ? 'blur-2xl opacity-10 select-none' : ''
                    }`}
            >
                {word.synonyms.map((syn, index) => (
                    <span key={`syn-${index}`} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold border border-blue-500/20 shadow-sm transition-all hover:bg-blue-500/20">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {syn}
                    </span>
                ))}
                {word.antonyms.map((ant, index) => (
                    <span key={`ant-${index}`} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 text-rose-300 text-sm font-bold border border-rose-500/20 shadow-sm transition-all hover:bg-rose-500/20">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                        {ant}
                    </span>
                ))}
            </div>

            {/* Examples Section - PREMIUM DARK VERSION */}
            <div className="space-y-4 relative z-10">
                {word.examples && word.examples.map((ex, index) => (
                    <div key={index} className="group/ex bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                            <span className="mt-1 text-blue-400 flex-shrink-0 opacity-50 group-hover/ex:opacity-100 transition-opacity">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </span>
                            <p className="text-slate-300 italic mb-3 leading-relaxed text-lg group-hover/ex:text-white transition-colors">
                                "{ex.sentence}"
                            </p>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setVisibleTranslations(prev => ({ ...prev, [index]: !prev[index] }));
                            }}
                            className={`w-full text-center py-3 rounded-xl cursor-pointer transition-all duration-500 text-sm font-bold border ${visibleTranslations[index]
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-slate-800/40 text-slate-500 border-white/5 hover:bg-slate-800 hover:text-slate-400 hover:border-white/10'
                                }`}
                        >
                            {visibleTranslations[index] ? ex.translation : '💡 해석을 보려면 클릭하세요'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Flip Hint */}
            {hideMode !== 'none' && (
                <div className="text-center mt-8 relative z-10">
                    <p className="text-slate-500 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        카드를 클릭하면 {isFlipped ? '가려집니다' : '보입니다'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default StudyCard;
