// Synonym/Antonym Hide Mode Implementation
type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

interface StudyControlsProps {
    currentIndex: number;
    totalWords: number;
    hideMode: HideMode;
    onHideModeChange: (mode: HideMode) => void;
    onPrevious: () => void;
    onNext: () => void;
    onQuizStart: () => void;
}

export function StudyControls({
    currentIndex,
    totalWords,
    hideMode,
    onHideModeChange,
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
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">학습 진도</span>
                    <span className="text-sm font-semibold text-gray-700">
                        {currentIndex + 1} / {totalWords}
                    </span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={onPrevious}
                    disabled={isFirst}
                    className={`p-3 rounded-full transition-all ${isFirst
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalWords, 10) }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex % 10 ? 'bg-blue-500 w-4' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={isLast}
                    className={`p-3 rounded-full transition-all ${isLast
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Hide Mode */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {hideModes.map((mode) => (
                    <button
                        key={mode.value}
                        onClick={() => onHideModeChange(mode.value)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${hideMode === mode.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center">
                <button onClick={onQuizStart} className="btn btn-primary px-8">
                    <span className="mr-2">📝</span>
                    퀴즈 풀기
                </button>
            </div>
        </div>
    );
}

export default StudyControls;
