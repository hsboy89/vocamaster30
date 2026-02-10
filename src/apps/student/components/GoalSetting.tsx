import { useState, useEffect } from 'react';
import { GoalDuration, GOAL_OPTIONS, Level, LEVEL_INFO, StudyGoal, StudyPlan } from '../../../shared/types';
import { createStudyPlan } from '../../../shared/utils/study-planner';

const GOAL_STORAGE_KEY = 'vocamaster-study-goal';
const PLAN_STORAGE_KEY = 'vocamaster-study-plan';

interface GoalSettingProps {
    level: Level;
    onGoalChange?: (days: number | null) => void;
}

function getStoredGoal(): StudyGoal | null {
    try {
        const stored = localStorage.getItem(GOAL_STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

function saveGoal(goal: StudyGoal) {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goal));
}

function savePlan(plan: StudyPlan) {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

function clearGoal() {
    localStorage.removeItem(GOAL_STORAGE_KEY);
    localStorage.removeItem(PLAN_STORAGE_KEY);
}

function getDaysRemaining(startDate: string, duration: GoalDuration): number {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function getDaysElapsed(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    return Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export function GoalSetting({ level, onGoalChange }: GoalSettingProps) {
    const [goal, setGoal] = useState<StudyGoal | null>(null);
    const [isSettingGoal, setIsSettingGoal] = useState(false);

    useEffect(() => {
        const stored = getStoredGoal();
        if (stored && stored.level === level) {
            const remaining = getDaysRemaining(stored.startDate, stored.duration);
            if (remaining > 0) {
                setGoal(stored);
                onGoalChange?.(stored.duration);
            } else {
                clearGoal();
                onGoalChange?.(null);
            }
        } else {
            onGoalChange?.(null);
        }
    }, [level]);

    const handleSetGoal = (duration: GoalDuration) => {
        const levelInfo = LEVEL_INFO[level];
        // 1. 단어 분배 플랜 생성
        const plan = createStudyPlan(level, duration);
        savePlan(plan);

        // 2. 목표 정보 저장
        const newGoal: StudyGoal = {
            duration,
            startDate: new Date().toISOString(),
            level,
            wordsPerDay: plan.wordsPerDay, // 플랜에서 계산된 값 사용
        };
        saveGoal(newGoal);

        setGoal(newGoal);
        setIsSettingGoal(false);
        onGoalChange?.(duration);
    };

    const handleClearGoal = () => {
        clearGoal();
        setGoal(null);
        onGoalChange?.(null);
    };

    // 목표가 설정되어 있을 때
    if (goal) {
        const daysRemaining = getDaysRemaining(goal.startDate, goal.duration);
        const daysElapsed = getDaysElapsed(goal.startDate);
        const progressPercent = Math.min(100, Math.round((daysElapsed / goal.duration) * 100));
        const goalOption = GOAL_OPTIONS.find(o => o.duration === goal.duration);

        return (
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white shadow-xl">
                    {/* 배경 장식 */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8 blur-xl" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {goalOption?.label} 목표 진행 중
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        하루 {goal.wordsPerDay}단어 · D-{daysRemaining}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearGoal}
                                className="text-white/60 hover:text-white/90 text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-all"
                            >
                                초기화
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-700"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-white/70">
                            <span>{daysElapsed}일 경과</span>
                            <span>{progressPercent}% 달성</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 목표 설정 UI (다크 모드 스타일 적용)
    return (
        <div className="max-w-6xl mx-auto px-4 py-4">
            {!isSettingGoal ? (
                <button
                    onClick={() => setIsSettingGoal(true)}
                    className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-500/50 p-6 text-center transition-all duration-300 hover:bg-white/5"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                        <div>
                            <h3 className="font-bold text-gray-100 text-base group-hover:text-blue-400 transition-colors">단기 목표 설정하기</h3>
                            <p className="text-sm text-gray-400">5일~30일 단기 집중 학습 목표를 세워보세요</p>
                        </div>
                    </div>
                </button>
            ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-800/90 backdrop-blur-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <span>🎯</span> 학습 기간을 선택하세요
                        </h3>
                        <button
                            onClick={() => setIsSettingGoal(false)}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {GOAL_OPTIONS.map((option) => {
                            const wordsPerDay = Math.ceil(LEVEL_INFO[level].totalWords / option.duration);
                            return (
                                <button
                                    key={option.duration}
                                    onClick={() => handleSetGoal(option.duration)}
                                    className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <p className="text-2xl font-bold text-white group-hover:text-blue-400 mb-1 transition-colors">
                                        {option.label}
                                    </p>
                                    <p className="text-xs text-slate-400 group-hover:text-slate-300 mb-2 transition-colors">{option.description}</p>
                                    <p className="text-[11px] font-medium text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 px-2 py-0.5 rounded-full inline-block transition-colors">
                                        하루 {wordsPerDay}단어
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GoalSetting;
