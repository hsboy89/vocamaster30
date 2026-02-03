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
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-center items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-gray-900">{percentage}</span>
                    <span className="text-2xl text-gray-400">점</span>
                </div>

                {/* Progress Ring */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${percentage * 3.52} 352`}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-blue-500' : 'text-orange-500'
                                }`}
                        />
                    </svg>
                    <span className="absolute text-2xl font-bold text-gray-800">{percentage}%</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                        <p className="text-green-500 font-semibold text-lg">{score}문제</p>
                        <p className="text-gray-500">정답 ({totalQuestions}문제 중)</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                        <p className="text-red-500 font-semibold text-lg">{wrongCount}문제</p>
                        <p className="text-gray-500">오답</p>
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
                <button onClick={onRetry} className="btn btn-outline w-full">
                    <span className="mr-2">🔄</span>
                    다시 도전하기
                </button>
                <button onClick={onClose} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 w-full">
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
