import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores';
import { getRankingByLevel, RankingByLevelItem } from '../../../shared/services/admin';
import { LEVEL_INFO, Level, LEVEL_ORDER } from '../../../shared/types';

interface RankingDetailModalProps {
    initialLevel?: Level;
    onClose: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

// 레벨별 필터 탭
const LEVEL_TABS: { value: Level; label: string }[] = LEVEL_ORDER.map(l => ({
    value: l,
    label: LEVEL_INFO[l].nameKo
}));

export function RankingDetailModal({ initialLevel, onClose }: RankingDetailModalProps) {
    const { user } = useAuthStore();
    const [rankings, setRankings] = useState<RankingByLevelItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<Level>(initialLevel || 'middle_1');

    const academyId = user?.academyId;

    useEffect(() => {
        if (!academyId) return;
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await getRankingByLevel(academyId, selectedLevel, 10);
                setRankings(data);
            } catch (e) {
                console.error('Failed to load ranking:', e);
            }
            setIsLoading(false);
        };
        load();
    }, [selectedLevel, academyId]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden border border-white/10 animate-in fade-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <span className="text-white text-lg">🏆</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    레벨별 학습 랭킹
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    탭 완료 기준 · 평균 점수 순
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Level Filter Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {LEVEL_TABS.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setSelectedLevel(tab.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedLevel === tab.value
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rankings Table */}
                <div className="px-6 py-4 overflow-y-auto max-h-[55vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                        </div>
                    ) : rankings.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-4xl mb-3 block">📊</span>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">
                                아직 이 레벨을 완료한 학생이 없습니다
                            </p>
                            <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">
                                모든 Day를 완료하면 랭킹에 반영됩니다
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {rankings.map((item) => {
                                const isMe = user?.id === item.userId;
                                const isTop3 = item.rank <= 3;

                                return (
                                    <div
                                        key={item.userId}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMe
                                            ? 'bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-400/40'
                                            : isTop3
                                                ? 'bg-gradient-to-r from-amber-50/80 to-orange-50/50 dark:from-amber-500/5 dark:to-orange-500/5'
                                                : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {/* Rank */}
                                        <div className="w-8 text-center flex-shrink-0">
                                            {isTop3 ? (
                                                <span className="text-xl">{MEDALS[item.rank - 1]}</span>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-400 dark:text-slate-500">
                                                    {item.rank}
                                                </span>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-sm font-semibold truncate ${isMe
                                                    ? 'text-blue-700 dark:text-blue-400'
                                                    : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                    {item.studentName}
                                                </span>
                                                {isMe && (
                                                    <span className="text-[9px] bg-blue-200 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                                                        나
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${item.averageScore >= 90
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : item.averageScore >= 70
                                                        ? 'text-orange-600 dark:text-orange-400'
                                                        : 'text-gray-500 dark:text-slate-400'
                                                    }`}>
                                                    {Math.round(item.averageScore)}점
                                                </p>
                                                <p className="text-[10px] text-gray-400 dark:text-slate-500">평균 점수</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <p className="text-center text-[11px] text-gray-400 dark:text-slate-500">
                        📊 탭별 전체 학습 완료 기준 · 평균 점수 순
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RankingDetailModal;
