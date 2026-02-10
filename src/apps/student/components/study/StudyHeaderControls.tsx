

interface StudyHeaderControlsProps {
    currentIndex: number;
    totalWords: number;
    onPrevious: () => void;
    onNext: () => void;
}

export function StudyHeaderControls({
    currentIndex,
    totalWords,
    onPrevious,
    onNext,
}: StudyHeaderControlsProps) {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalWords - 1;
    const progress = ((currentIndex + 1) / totalWords) * 100;

    return (
        <div className="w-full space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
                    <span className="text-white">{currentIndex + 1}</span> / {totalWords}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={onPrevious}
                    disabled={isFirst}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isFirst
                        ? 'bg-slate-800/30 text-slate-700 border-transparent cursor-not-allowed'
                        : 'bg-slate-800/80 text-white border-white/10 hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-lg'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden">
                    {/* PC에서는 10개, 모바일에서는 5개만 보여주는 식으로 반응형 처리? 
                        여기서는 간단히 10개로 제한 */}
                    {Array.from({ length: Math.min(totalWords, 10) }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex % 10
                                ? 'bg-blue-400 w-4 shadow-[0_0_8px_rgba(96,165,250,0.5)]'
                                : 'bg-slate-700 w-1.5'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={isLast}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isLast
                        ? 'bg-slate-800/30 text-slate-700 border-transparent cursor-not-allowed'
                        : 'bg-blue-600 text-white border-blue-400/30 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
