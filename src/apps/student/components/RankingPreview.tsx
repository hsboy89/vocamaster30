import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../stores';
import { getRankingByLevel, RankingByLevelItem } from '../../../shared/services/admin';
import { LEVEL_INFO, Level } from '../../../shared/types';
import { RankingDetailModal } from './RankingDetailModal';

const MEDALS = ['🥇', '🥈', '🥉'];

interface RankingPreviewProps {
    level: Level;
}

export function RankingPreview({ level }: RankingPreviewProps) {
    const { user } = useAuthStore();
    const [top3, setTop3] = useState<RankingByLevelItem[]>([]);
    const [showDetail, setShowDetail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);

    const academyId = user?.academyId;

    // 중복 호출 방지 ref
    const lastFetchKey = useRef<string>("");

    const loadRanking = useCallback(async (force = false) => {
        if (!academyId) return;
        if (isLoadingRef.current) return;

        const currentKey = `${academyId}-${level}`;
        if (!force && lastFetchKey.current === currentKey) return;

        isLoadingRef.current = true;
        setIsLoading(true);
        lastFetchKey.current = currentKey;

        try {
            const data = await getRankingByLevel(academyId, level, 3);
            setTop3(data);
        } catch (e) {
            console.error('❌ RankingPreview: Failed to load ranking:', e);
        } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, [academyId, level]);

    useEffect(() => {
        if (academyId) {
            loadRanking();
        }
    }, [academyId, level, loadRanking]);

    if (!user || !academyId) return null;

    const levelInfo = LEVEL_INFO[level];

    return (
        <>
            <button
                onClick={() => setShowDetail(true)}
                className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 p-4 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏆</span>
                        <h3 className="text-sm font-bold text-slate-800">레벨 랭킹</h3>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold">
                        {levelInfo.nameKo}
                    </span>
                </div>

                {/* Top 3 */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500" />
                    </div>
                ) : top3.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">
                        아직 이 레벨을 완료한 학생이 없습니다
                    </p>
                ) : (
                    <div className="space-y-2">
                        {top3.map((item, i) => (
                            <div
                                key={item.userId}
                                className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg ${i === 0
                                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100'
                                    : 'bg-slate-50/60'
                                    } ${user.id === item.userId ? 'ring-2 ring-blue-400/40' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{MEDALS[i]}</span>
                                    <span className={`text-sm font-semibold ${i === 0 ? 'text-amber-700' : 'text-slate-700'
                                        }`}>
                                        {item.studentName}
                                    </span>
                                    {user.id === item.userId && (
                                        <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">
                                            나
                                        </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`block text-xs font-bold ${i === 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                                        {Math.round(item.averageScore)}점
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 하단 */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400">탭 완료 기준 · 평균 점수 순</span>
                    <span className="text-[10px] text-blue-500 font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-1">
                        상세 보기
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </button>

            {/* Detail Modal */}
            {showDetail && createPortal(
                <RankingDetailModal
                    initialLevel={level}
                    onClose={() => setShowDetail(false)}
                />,
                document.body
            )}
        </>
    );
}

export default RankingPreview;
