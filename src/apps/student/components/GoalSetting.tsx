import { useState, useEffect, useRef } from 'react';
import { GoalDuration, GOAL_OPTIONS, Level, LEVEL_INFO, StudyGoal, StudyPlan } from '../../../shared/types';
import { createStudyPlan } from '../../../shared/utils/study-planner';
import { getAllMemorizedWordIds, resetLevelProgress } from '../../../shared/services/storage';
import { useAuthStore } from '../../../stores';
import { useProgress } from '../../../shared/hooks';
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

export function GoalSetting({ level, onGoalChange }: GoalSettingProps) {
    const [goal, setGoal] = useState<StudyGoal | null>(null);
    const [isSettingGoal, setIsSettingGoal] = useState(false);
    const [isChoosingNextRound, setIsChoosingNextRound] = useState(false);
    const [dailyCount, setDailyCount] = useState<number>(30); // 기본 30단어
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pendingDuration, setPendingDuration] = useState<GoalDuration | null>(null); // 확인 팝업용
    const { user, updateUser } = useAuthStore();
    const { getStatus } = useProgress();

    const DAILY_OPTIONS = [30, 50, 70, 100];

    const lastNotifiedDuration = useRef<number | null | undefined>(undefined);

    useEffect(() => {
        const loadInfo = () => {
            const memorized = getAllMemorizedWordIds(level);
            const total = LEVEL_INFO[level].totalWords; // 혹은 data/index.ts의 getAllWords(level).length
            setTotalCount(total);
            setAvailableCount(Math.max(0, total - memorized.length));

            let stored = getStoredGoal();

            // DB에서 복구 시도 (로컬에 없거나, 로컬 정보가 현재 레벨과 다를 때 DB 정보 확인)
            if (!stored && user?.goalStartDate && user?.goalLevel === level) {
                stored = {
                    duration: (user.goalDuration as GoalDuration) || 30,
                    startDate: user.goalStartDate,
                    level: user.goalLevel as Level,
                    wordsPerDay: user.goalWordsPerDay || 30,
                };
                saveGoal(stored); // 로컬에도 저장
            }

            const notifyChange = (duration: number | null) => {
                if (lastNotifiedDuration.current !== duration) {
                    lastNotifiedDuration.current = duration;
                    onGoalChange?.(duration);
                }
            };

            if (stored && stored.level === level) {
                const remaining = getDaysRemaining(stored.startDate, stored.duration);
                if (remaining > 0) {
                    setGoal(stored);
                    notifyChange(stored.duration);
                } else {
                    clearGoal();
                    notifyChange(null);
                }
            } else {
                notifyChange(null);
            }
        };

        loadInfo();
        // 포커스 될 때 업데이트되면 좋겠지만, 일단 level 변경 시 수행
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level, user?.goalStartDate, user?.goalLevel, user?.goalDuration, user?.goalWordsPerDay]);

    // ------------------------------------------------------------------------
    // Effects
    // ------------------------------------------------------------------------

    // 디버깅: 렌더링 추적
    useEffect(() => {
        console.warn('🎯 GoalSetting: Rendered', { userGoal: user?.goalDuration, localGoal: goal?.duration });
    });

    // authStore와 local state(goal) 동기화 (새로고침/재진입 시) - 제거됨 (무한루프 원인)
    // useEffect(() => {
    //     if (goal && user && user.goalDuration !== goal.duration) {
    //         // updateUser({ goalDuration: goal.duration }); // Dangerous loop
    //     }
    // }, [goal, user]);

    const handleConfirmGoal = (duration: GoalDuration) => {
        // 선택 전 확인 팝업 표시
        setPendingDuration(duration);
    };

    const handleSetGoal = (duration: GoalDuration) => {
        setPendingDuration(null); // 팝업 닫기
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

        // Update local store immediately
        if (user) {
            updateUser({ goalDuration: duration });
        }

        // Sync to DB
        if (user) {
            supabase.from('users')
                .update({
                    goal_duration: duration,
                    goal_start_date: newGoal.startDate,
                    goal_level: level,
                    goal_words_per_day: plan.wordsPerDay,
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
        const goalOption = GOAL_OPTIONS.find(o => o.duration === goal.duration);

        // 실제 완료한 Day 수 체크 (날짜 기반이 아닌 실제 학습 완료 기준)
        let completedDayCount = 0;
        for (let d = 1; d <= goal.duration; d++) {
            if (getStatus(level, d) === 'completed') {
                completedDayCount++;
            }
        }
        const isAllCompleted = completedDayCount >= goal.duration;
        const progressPercent = Math.min(100, Math.round((completedDayCount / goal.duration) * 100));

        // 🎉 목표 완료 — 다음 학습 시작 버튼
        if (isAllCompleted) {
            const handleStartNextRound = (nextDuration: GoalDuration) => {
                setIsChoosingNextRound(false);
                const memorized = getAllMemorizedWordIds(level);

                // 기존 목표 클리어
                clearGoal();

                // 새 플랜 생성 (이미 외운 단어 제외)
                const plan = createStudyPlan(level, nextDuration, memorized, dailyCount);
                savePlan(plan);

                const newGoal: StudyGoal = {
                    duration: nextDuration,
                    startDate: new Date().toISOString(),
                    level,
                    wordsPerDay: plan.wordsPerDay,
                };
                saveGoal(newGoal);

                if (user) {
                    updateUser({ goalDuration: nextDuration });
                    supabase.from('users')
                        .update({
                            goal_duration: nextDuration,
                            goal_start_date: newGoal.startDate,
                            goal_level: level,
                            goal_words_per_day: plan.wordsPerDay,
                        })
                        .eq('id', user.id)
                        .then(({ error }) => {
                            if (error) console.error('Failed to sync next round goal to DB', error);
                        });
                }

                setGoal(newGoal);
                onGoalChange?.(nextDuration);
            };

            return (
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8 blur-xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🎉</span>
                                <div>
                                    <h3 className="font-bold text-lg text-white">
                                        {goalOption?.label} 목표 완료!
                                    </h3>
                                    <p className="text-white/90 text-sm font-medium">
                                        {completedDayCount}일 모두 학습 완료 · 남은 단어 {availableCount}개
                                    </p>
                                </div>
                            </div>

                            {/* 완료 Progress Bar */}
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
                                <div className="h-full bg-white rounded-full w-full" />
                            </div>

                            {availableCount > 0 ? (
                                !isChoosingNextRound ? (
                                    <button
                                        onClick={() => setIsChoosingNextRound(true)}
                                        className="w-full py-3 px-6 bg-white text-emerald-600 rounded-xl font-bold text-base hover:bg-emerald-50 hover:scale-[1.02] transition-all shadow-lg"
                                    >
                                        🚀 다음 학습 시작하기
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-white/90 text-sm font-medium text-center">다음 학습 기간을 선택하세요</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {GOAL_OPTIONS.map((option) => {
                                                const targetTotal = Math.min(availableCount, option.duration * dailyCount);
                                                if (targetTotal === 0) return null;
                                                return (
                                                    <button
                                                        key={option.duration}
                                                        onClick={() => handleStartNextRound(option.duration)}
                                                        className="py-2.5 px-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-center transition-all hover:scale-105 border border-white/20"
                                                    >
                                                        <p className="font-bold text-white text-sm">{option.label}</p>
                                                        <p className="text-white/70 text-[10px]">{targetTotal}단어</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setIsChoosingNextRound(false)}
                                            className="w-full text-white/60 hover:text-white/90 text-xs py-1 transition-colors"
                                        >
                                            취소
                                        </button>
                                    </div>
                                )
                            ) : (
                                <p className="text-white/90 text-sm text-center font-medium">
                                    🏆 이 레벨의 모든 단어를 학습했습니다!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

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
                                    <h3 className="font-bold text-lg text-white">
                                        {goalOption?.label} 목표 진행 중
                                    </h3>
                                    <p className="text-white/90 text-sm font-medium">
                                        하루 {goal.wordsPerDay}단어 · D-{daysRemaining}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-lg">{completedDayCount}/{goal.duration}</p>
                                <p className="text-white/70 text-[10px]">완료</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-700"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-white font-medium">
                            <span>{completedDayCount}일 완료</span>
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
                                        onClick={() => handleConfirmGoal(option.duration)}
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

            {/* 확인 팝업 */}
            {pendingDuration && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setPendingDuration(null)}>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-7 border border-white/10 animate-in fade-in zoom-in-95"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                학습 플랜을 시작할까요?
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                <p>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{pendingDuration}일 플랜</span>을 선택하면
                                </p>
                                <p>
                                    해당 플랜을 <span className="font-bold text-red-500">완료할 때까지</span> 다른 플랜으로
                                </p>
                                <p>변경할 수 없습니다.</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-6">
                            <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
                                💡 한 번 선택한 플랜은 끝까지 진행해야 합니다.
                                목표 달성 후 새로운 플랜을 선택할 수 있어요!
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPendingDuration(null)}
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold text-sm"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleSetGoal(pendingDuration)}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all font-bold text-sm shadow-lg shadow-blue-500/30"
                            >
                                시작하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GoalSetting;
