import { useState, useEffect } from 'react';
import { GoalDuration, GOAL_OPTIONS, Level, LEVEL_INFO, StudyGoal, StudyPlan } from '../../../shared/types';
import { createStudyPlan } from '../../../shared/utils/study-planner';
import { getAllMemorizedWordIds, resetLevelProgress } from '../../../shared/services/storage';
import { useAuthStore } from '../../../stores';
import { supabase } from '../../../shared/lib';

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
    const [dailyCount, setDailyCount] = useState<number>(30); // 기본 30단어
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const { user } = useAuthStore();

    const DAILY_OPTIONS = [30, 50, 70, 100];

    useEffect(() => {
        const loadInfo = () => {
            const memorized = getAllMemorizedWordIds(level);
            const total = LEVEL_INFO[level].totalWords; // 혹은 data/index.ts의 getAllWords(level).length
            setTotalCount(total);
            setAvailableCount(Math.max(0, total - memorized.length));

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
        };

        loadInfo();
        // 포커스 될 때 업데이트되면 좋겠지만, 일단 level 변경 시 수행
    }, [level]);

    const handleSetGoal = (duration: GoalDuration) => {
        const memorized = getAllMemorizedWordIds(level);

        // 1. 단어 분배 플랜 생성 (이번 회차)
        const plan = createStudyPlan(level, duration, memorized, dailyCount);
        savePlan(plan);

        // 2. 목표 정보 저장
        const newGoal: StudyGoal = {
            duration,
            startDate: new Date().toISOString(),
            level,
            wordsPerDay: plan.wordsPerDay,
        };
        saveGoal(newGoal);

        // Sync to DB
        if (user) {
            supabase.from('users')
                .update({
                    goal_duration: duration,
                    // 필요 시 daily_word_count 등 추가 가능
                })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Failed to sync goal to DB', error);
                });
        }

        setGoal(newGoal);
        setIsSettingGoal(false);
        onGoalChange?.(duration);
    };

    const handleClearGoal = () => {
        clearGoal();
        setGoal(null);
        onGoalChange?.(null);
    };

    const handleResetProgress = async () => {
        if (confirm('모든 학습 기록이 초기화됩니다. 정말 다시 시작하시겠습니까?')) {
            await resetLevelProgress(level);
            // 새로고침하여 상태 반영
            window.location.reload();
        }
    };

    // 1회독 완료 축하 메시지
    if (availableCount === 0 && totalCount > 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 p-8 text-white shadow-xl text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />

                    <div className="relative z-10 space-y-6">
                        <div className="text-6xl mb-2">🏆</div>
                        <div>
                            <h3 className="text-3xl font-black mb-2">1회독 완료! 축하합니다!</h3>
                            <p className="text-white/90 text-lg">
                                {LEVEL_INFO[level].nameKo}의 모든 단어를 학습하셨습니다.
                            </p>
                        </div>

                        <button
                            onClick={handleResetProgress}
                            className="bg-white text-amber-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-amber-50 hover:scale-105 transition-all shadow-lg"
                        >
                            처음부터 다시 시작하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 목표가 설정되어 있을 때
    if (goal) {
        const daysRemaining = getDaysRemaining(goal.startDate, goal.duration);
        const daysElapsed = getDaysElapsed(goal.startDate);
        const progressPercent = Math.min(100, Math.round((daysElapsed / goal.duration) * 100));
        const goalOption = GOAL_OPTIONS.find(o => o.duration === goal.duration);

        return (
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white shadow-xl">
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

    // 목표 설정 UI
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
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-100 text-base group-hover:text-blue-400 transition-colors">맞춤 학습 플랜 만들기</h3>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">New</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                남은 <span className="text-white font-bold">{availableCount}</span>단어를 내 속도에 맞춰 계획해드려요
                            </p>
                        </div>
                    </div>
                </button>
            ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-800/90 backdrop-blur-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <span>🎯</span> 학습 플랜 설정
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                                남은 <span className="text-white font-bold">{availableCount}</span>단어 학습을 위한 계획을 세웁니다.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSettingGoal(false)}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step 1: 하루 목표량 선택 */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-300 block">하루 학습량 목표</label>
                        <div className="grid grid-cols-4 gap-2">
                            {DAILY_OPTIONS.map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setDailyCount(count)}
                                    className={`py-2 px-1 rounded-xl text-sm font-bold transition-all border ${dailyCount === count
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105'
                                        : 'bg-slate-700/50 text-slate-400 border-white/5 hover:bg-slate-700 hover:text-white'
                                        }`}
                                >
                                    {count}개
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Step 2: 기간 선택 */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-300 block">이번 회차 학습 기간</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {GOAL_OPTIONS.map((option) => {
                                // 예상 학습량 계산
                                const targetTotal = Math.min(availableCount, option.duration * dailyCount);

                                return (
                                    <button
                                        key={option.duration}
                                        onClick={() => handleSetGoal(option.duration)}
                                        className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        <p className="text-xl font-bold text-white group-hover:text-blue-400 mb-1 transition-colors">
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-slate-400 group-hover:text-slate-300 mb-2 transition-colors">
                                            총 {targetTotal}단어 예정
                                        </p>
                                        <p className="text-[10px] font-medium text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 px-2 py-0.5 rounded-full inline-block transition-colors">
                                            {option.duration * dailyCount >= availableCount ? '회독 가능' : '부분 학습'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GoalSetting;
