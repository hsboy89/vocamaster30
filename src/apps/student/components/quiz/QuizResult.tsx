import { QuizType, QuizResult as QuizResultType, Word } from '../../../../shared/types';

interface QuizResultProps {
    score: number;
    totalQuestions: number;
    wrongCount: number;
    quizType: QuizType;
    quizResult: QuizResultType;
    words: Word[];
    onRetry: () => void;
    onClose: () => void;
    onReviewWrong: () => void;
}

export function QuizResult({
    score,
    totalQuestions,
    wrongCount,
    quizType,
    onRetry,
    onClose,
    onReviewWrong,
}: QuizResultProps) {
    // 점수 자체가 100점 만점으로 계산되므로 score를 그대로 사용하거나 비율 계산
    const maxScore = totalQuestions * 5;
    const percentage = Math.round((score / maxScore) * 100);

    const getGrade = () => {
        if (percentage >= 90) return { emoji: '🏆', text: 'Excellent!', color: 'text-yellow-500' };
        if (percentage >= 70) return { emoji: '🎉', text: 'Good Job!', color: 'text-green-500' };
        if (percentage >= 50) return { emoji: '💪', text: 'Keep Going!', color: 'text-blue-500' };
        return { emoji: '📚', text: 'More Practice!', color: 'text-orange-500' };
    };

    const getQuizTypeName = () => {
        switch (quizType) {
            case 'choice': return '뜻 고르기';
            case 'spelling': return '스펠링 타이핑';
            case 'matching': return '유의어/반의어 매칭';
            default: return '퀴즈';
        }
    };

    const grade = getGrade();

    return (
        <div className="p-8 text-center">
            {/* Grade */}
            <div className="mb-8">
                <span className="text-6xl mb-4 block animate-bounce">{grade.emoji}</span>
                <h2 className={`text-3xl font-bold ${grade.color} mb-2`}>{grade.text}</h2>
                <p className="text-gray-500">{getQuizTypeName()} 완료</p>
            </div>

            {/* Score */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8 shadow-inner">
                <div className="flex justify-center items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black text-gray-900 tracking-tight">{percentage}</span>
                    <span className="text-2xl font-bold text-gray-400">점</span>
                </div>

                {/* Progress Ring */}
                <div className="relative inline-flex items-center justify-center w-40 h-40 mb-8">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-sm">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            className="text-gray-200 dark:text-gray-800"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${percentage * 4.4} 440`}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ${percentage >= 90 ? 'text-yellow-400' : percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-blue-500' : 'text-orange-500'
                                }`}
                            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center translate-y-1">
                        <span className="text-4xl font-black text-gray-900 leading-none">
                            {percentage}
                            <span className="text-xl ml-0.5 opacity-80">%</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Accuracy</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-transform hover:scale-105">
                        <p className="text-green-500 font-black text-2xl">{totalQuestions - wrongCount}</p>
                        <p className="text-gray-500 font-medium">정답</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-transform hover:scale-105">
                        <p className="text-red-500 font-black text-2xl">{wrongCount}</p>
                        <p className="text-gray-500 font-medium">오답</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                {wrongCount > 0 && (
                    <button onClick={onReviewWrong} className="btn btn-primary w-full">
                        <span className="mr-2">📝</span>
                        오답 복습하기 ({wrongCount}개)
                    </button>
                )}
                <button onClick={onRetry} className="btn border-2 border-slate-200 text-slate-700 hover:bg-slate-50 w-full py-4 text-lg font-bold">
                    <span className="mr-2">🔄</span>
                    다시 도전하기
                </button>
                <button onClick={onClose} className="btn bg-blue-600 text-white hover:bg-blue-700 w-full py-4 text-lg font-bold transition-all transform active:scale-95 shadow-xl shadow-blue-500/20">
                    <span className="mr-2">✅</span>
                    학습으로 돌아가기
                </button>
            </div>

            {/* Message */}
            {wrongCount > 0 && (
                <p className="text-sm text-gray-500 mt-6">
                    💡 오답 {wrongCount}개가 오답노트에 저장되었습니다.
                </p>
            )}
        </div>
    );
}

export default QuizResult;
