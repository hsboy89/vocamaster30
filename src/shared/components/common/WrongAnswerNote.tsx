import { WrongAnswer } from '../../types';
import { useTTS } from '../../hooks';
import { removeWrongAnswer } from '../../services/storage';

interface WrongAnswerNoteProps {
    wrongAnswers: WrongAnswer[];
    onRefresh: () => void;
    onClose: () => void;
}

export function WrongAnswerNote({ wrongAnswers, onRefresh, onClose }: WrongAnswerNoteProps) {
    const { speak } = useTTS();

    const handleRemove = async (wordId: string) => {
        await removeWrongAnswer(wordId);
        onRefresh();
    };

    if (wrongAnswers.length === 0) {
        return (
            <div className="p-8 text-center">
                <span className="text-6xl mb-4 block">🎉</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">오답이 없습니다!</h2>
                <p className="text-gray-500 mb-6">모든 단어를 완벽하게 학습했어요.</p>
                <button onClick={onClose} className="btn btn-primary">
                    학습 계속하기
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">📝 오답노트</h2>
                    <p className="text-sm text-gray-500">{wrongAnswers.length}개의 단어</p>
                </div>
                <button onClick={onClose} className="btn btn-outline">
                    닫기
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {wrongAnswers.map((item) => (
                    <div
                        key={item.word.id}
                        className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {item.word.word}
                                </h3>
                                <button
                                    onClick={() => speak(item.word.word)}
                                    className="p-1 rounded-full hover:bg-blue-50"
                                >
                                    🔊
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                    {item.wrongCount}회 오답
                                </span>
                                <button
                                    onClick={() => handleRemove(item.word.id)}
                                    className="text-gray-400 hover:text-red-500"
                                    title="삭제"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-2">{item.word.pronunciation}</p>
                        <p className="text-gray-800 mb-3">{item.word.meaning}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {item.word.synonyms.map((syn, i) => (
                                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {syn}
                                </span>
                            ))}
                            {item.word.antonyms.map((ant, i) => (
                                <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                    {ant}
                                </span>
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 italic">
                            "{item.word.examples && item.word.examples[0] ? item.word.examples[0].sentence : ''}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WrongAnswerNote;
