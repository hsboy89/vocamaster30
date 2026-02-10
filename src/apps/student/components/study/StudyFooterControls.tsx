type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

interface StudyFooterControlsProps {
    hideMode: HideMode;
    autoSpeak: boolean;
    onHideModeChange: (mode: HideMode) => void;
    onAutoSpeakChange: (enabled: boolean) => void;
    onQuizStart: () => void;
}

export function StudyFooterControls({
    hideMode,
    autoSpeak,
    onHideModeChange,
    onAutoSpeakChange,
    onQuizStart,
}: StudyFooterControlsProps) {
    const hideModes: { value: HideMode; label: string }[] = [
        { value: 'none', label: '전체 보기' },
        { value: 'word', label: '단어 가리기' },
        { value: 'meaning', label: '뜻 가리기' },
        { value: 'synonyms', label: '유의어/반의어 가리기' },
    ];

    return (
        <div
            className="rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden space-y-8"
            style={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Auto Speak & Options Row */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                    {/* Auto Speak Toggle */}
                    <button
                        onClick={() => onAutoSpeakChange(!autoSpeak)}
                        className={`group flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300 border ${autoSpeak
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
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
                        <span className="text-sm font-bold tracking-tight">자동 발음</span>
                    </button>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-8 bg-white/10" />

                    {/* Filter Modes - Responsive Grid on Mobile */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {hideModes.map((mode) => (
                            <button
                                key={mode.value}
                                onClick={() => onHideModeChange(mode.value)}
                                className={`px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-300 border uppercase tracking-widest ${hideMode === mode.value
                                    ? 'bg-white text-slate-900 border-white shadow-lg scale-105'
                                    : 'bg-slate-800/40 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                                    }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Action */}
                <button
                    onClick={onQuizStart}
                    className="w-full sm:w-auto group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.4)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                    <div className="flex items-center justify-center gap-3 relative z-10">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">📝</span>
                        <span>테스트 시작하기</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
