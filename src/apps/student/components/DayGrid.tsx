import { Level, StudyStatus } from '../../../shared/types';
import { useProgress } from '../../../shared/hooks';

interface DayGridProps {
    level: Level;
    onDaySelect: (day: number) => void;
    onOpenWrongNote?: () => void;
    isGuest?: boolean;
    onLockedClick?: () => void;
}

export function DayGrid({ level, onDaySelect, isGuest = false, onLockedClick }: DayGridProps) {
    const { getStatus } = useProgress();
    const days = Array.from({ length: 30 }, (_, i) => i + 1);



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
