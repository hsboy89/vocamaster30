import { Level, StudyStatus, LEVEL_INFO } from '../../../shared/types';
import { useProgress } from '../../../shared/hooks';

interface DayGridProps {
    level: Level;
    onDaySelect: (day: number) => void;
    onOpenWrongNote?: () => void;
    isGuest?: boolean;
    onLockedClick?: () => void;
}

export function DayGrid({ level, onDaySelect, onOpenWrongNote, isGuest = false, onLockedClick }: DayGridProps) {
    const { getStatus, getCompletionRate } = useProgress();
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const completionRate = getCompletionRate(level);



    const getStatusClass = (status: StudyStatus) => {
        switch (status) {
            case 'completed':
                return 'completed';
            case 'in-progress':
                return 'in-progress';
            default:
                return '';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Level Info */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {LEVEL_INFO[level].nameKo}
                </h2>
                <p className="text-gray-600 mb-4">{LEVEL_INFO[level].description}</p>

                {/* Quick Actions - Moved to top for better visibility */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <button
                        className="btn btn-primary flex-1 sm:flex-none py-3 px-6 text-base shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                            // 아직 완료하지 않은 가장 낮은 Day 찾기
                            for (let day = 1; day <= 30; day++) {
                                if (getStatus(level, day) !== 'completed') {
                                    onDaySelect(day);
                                    return;
                                }
                            }
                            onDaySelect(1);
                        }}
                    >
                        <span className="mr-2">🚀</span>
                        오늘의 학습 시작
                    </button>
                    <button
                        onClick={onOpenWrongNote}
                        className="btn btn-outline flex-1 sm:flex-none py-3 px-6 text-base"
                    >
                        <span className="mr-2">📝</span>
                        오답노트 복습
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full gradient-success transition-all duration-500 rounded-full"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    진도율: <span className="font-semibold text-green-600">{completionRate}%</span> 완료
                </p>
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {days.map((day) => {
                    const status = getStatus(level, day);
                    // Use the isGuest prop passed from parent

                    const isLocked = isGuest && day > 3;
                    const hasData = true;

                    return (
                        <button
                            key={day}
                            onClick={(e) => {
                                if (isLocked) {
                                    e.stopPropagation();
                                    // Trigger login modal logic - this needs to be handled by parent or a global event?
                                    // We'll update the component to accept a callback or use a custom event.
                                    // Actually, let's pass an `onLockedClick` prop.
                                    if (onLockedClick) onLockedClick();
                                    return;
                                }
                                hasData && onDaySelect(day)
                            }}
                            disabled={!hasData}
                            className={`day-card group relative overflow-hidden ${getStatusClass(status)} ${!hasData ? 'opacity-40 grayscale cursor-not-allowed' : ''} ${isLocked ? 'cursor-not-allowed' : ''}`}
                        >
                            {isLocked && (
                                <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="text-2xl">🔒</span>
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                                    'bg-slate-50 text-slate-400'
                                } ${isLocked ? 'blur-sm' : ''}`}>
                                {status === 'completed' ? '🎉' :
                                    status === 'in-progress' ? '🔥' :
                                        day}
                            </div>

                            <span className={`text-sm font-bold ${status === 'completed' ? 'text-emerald-700' :
                                status === 'in-progress' ? 'text-amber-700' :
                                    'text-slate-600'
                                } ${isLocked ? 'blur-[1px]' : ''}`}>
                                Day {day.toString().padStart(2, '0')}
                            </span>

                            {/* Status Badges */}
                            {status === 'completed' && !isLocked && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full mt-2 font-medium">
                                    완료함
                                </span>
                            )}
                            {status === 'in-progress' && !isLocked && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-2 font-medium">
                                    학습중
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default DayGrid;
