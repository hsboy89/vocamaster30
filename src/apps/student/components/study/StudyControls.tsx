
type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

interface StudyControlsProps {
    currentIndex: number;
    totalWords: number;
    hideMode: HideMode;
    autoSpeak: boolean;
    onHideModeChange: (mode: HideMode) => void;
    onAutoSpeakChange: (enabled: boolean) => void;
    onPrevious: () => void;
    onNext: () => void;
    onQuizStart: () => void;
}

export function StudyControls({
    currentIndex,
    totalWords,
    hideMode,
    autoSpeak,
    onHideModeChange,
    onAutoSpeakChange,
    onPrevious,
    onNext,
    onQuizStart,
}: StudyControlsProps) {
    const hideModes: { value: HideMode; label: string }[] = [
        { value: 'none', label: '전체 보기' },
        { value: 'word', label: '단어 가리기' },
        { value: 'meaning', label: '뜻 가리기' },
        { value: 'synonyms', label: '유의어/반의어 가리기' },
    ];

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalWords - 1;
    const progress = ((currentIndex + 1) / totalWords) * 100;

    return (
        <div
            className="rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />

            {/* Progress Section */}
            <div className="mb-10 relative z-10">
                <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Learning Progress</span>
                        <h3 className="text-sm font-medium text-slate-400">학습 진행도</h3>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{currentIndex + 1}</span>
                        <span className="text-sm font-bold text-slate-600">/ {totalWords}</span>
                    </div>
                </div>
                <div className="bg-slate-800/50 rounded-full h-3 p-0.5 border border-white/5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Navigation & Pagination */}
            <div className="flex flex-col items-center gap-8 mb-10 relative z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onPrevious}
                        disabled={isFirst}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isFirst
                            ? 'bg-slate-800/30 text-slate-700 border-transparent cursor-not-allowed'
                            : 'bg-slate-800/80 text-white border-white/10 hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-lg'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/40 rounded-2xl border border-white/5">
                        {Array.from({ length: Math.min(totalWords, 10) }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex % 10
                                    ? 'bg-blue-400 w-6 shadow-[0_0_10px_rgba(96,165,250,0.5)]'
                                    : 'bg-slate-700 w-1.5'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={onNext}
                        disabled={isLast}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isLast
                            ? 'bg-slate-800/30 text-slate-700 border-transparent cursor-not-allowed'
                            : 'bg-blue-600 text-white border-blue-400/30 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Auto Speak Toggle */}
                <button
                    onClick={() => onAutoSpeakChange(!autoSpeak)}
                    className={`group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 border ${autoSpeak
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-slate-800/50 text-slate-400 border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className={`p-1 rounded-lg transition-colors ${autoSpeak ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {autoSpeak ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            )}
                        </svg>
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                        자동 발음 {autoSpeak ? 'ON' : 'OFF'}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors duration-500 ${autoSpeak ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all duration-300 ${autoSpeak ? 'left-5' : 'left-1'}`} />
                    </div>
                </button>
            </div>

            {/* Filter Modes */}
            <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap justify-center gap-2">
                    {hideModes.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => onHideModeChange(mode.value)}
                            className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all duration-300 border uppercase tracking-widest ${hideMode === mode.value
                                ? 'bg-white text-slate-900 border-white shadow-xl scale-105'
                                : 'bg-slate-800/40 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                                }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* Main Action */}
                <div className="pt-4 flex justify-center">
                    <button
                        onClick={onQuizStart}
                        className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.4)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                        <div className="flex items-center gap-3 relative z-10">
                            <span className="text-2xl group-hover:rotate-12 transition-transform">📝</span>
                            <span>테스트 시작하기</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudyControls;

