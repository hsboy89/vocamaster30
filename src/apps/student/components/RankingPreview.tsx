import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../stores';
import { getRankingByGoalPlan, RankingItem } from '../../../shared/services/admin';
import { RankingDetailModal } from './RankingDetailModal';

const MEDALS = ['🥇', '🥈', '🥉'];

export function RankingPreview() {
    const { user } = useAuthStore();
    const [top3, setTop3] = useState<RankingItem[]>([]);
    const [showDetail, setShowDetail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);

    const currentMonth = new Date().getMonth() + 1;

    // 안정적인 primitive 값만 의존성으로 사용
    const academyId = user?.academyId;
    const goalDuration = user?.goalDuration;

    // 중복 호출 방지 ref
    const lastFetchKey = useRef<string>("");

    const loadRanking = useCallback(async (force = false) => {
        console.warn(`🔄 RankingPreview: loadRanking called (force=${force}, academyId=${academyId})`);
        if (!academyId) return;
        // 이미 로딩 중이면 스킵
        if (isLoadingRef.current) {
            console.warn('⚠️ RankingPreview: Already loading, skipped');
            return;
        }

        // 동일한 조건으로 이미 조회했으면 스킵 (강제 새로고침 제외)
        const currentKey = `${academyId}-${goalDuration || 'all'}`;
        if (!force && lastFetchKey.current === currentKey) {
            console.warn('⚠️ RankingPreview: Same parameters, skipped');
            return;
        }

        isLoadingRef.current = true;
        setIsLoading(true);
        lastFetchKey.current = currentKey;

        try {
            console.warn('🚀 RankingPreview: Fetching data from API...');
            const data = await getRankingByGoalPlan(academyId, goalDuration || undefined, 3);
            console.warn('✅ RankingPreview: Data fetched', data);
            setTop3(data);
        } catch (e) {
            console.error('❌ RankingPreview: Failed into load ranking:', e);
            // 에러 시 키 초기화하여 재시도 허용할지 결정 (여기선 루프 방지를 위해 유지)
        } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, [academyId, goalDuration]);

    useEffect(() => {
        console.warn('🔄 RankingPreview: Main effect triggered (loadRanking)');
        // 컴포넌트 마운트/업데이트 시 데이터 로드
        if (academyId) {
            loadRanking();
        }
    }, [academyId, loadRanking]);

    // 페이지 포커스 시 자동 새로고침 (디바운스 적용)
    // 페이지 포커스/가시성 변경 시 자동 새로고침 -> 제거됨 (무한 루프 원인 의심)
    /*
    useEffect(() => {
        console.warn('🔄 RankingPreview: Focus/Visibility effect triggered');
        const handleRefresh = () => {
            // 마지막 갱신으로부터 10초 미만이면 스킵 (무한 루프 방지)
            const now = Date.now();
            const lastTime = parseInt(sessionStorage.getItem('last_ranking_fetch') || '0');
            console.warn(`🔄 RankingPreview: Refresh attempt due to focus/visibility. Time diff: ${now - lastTime}ms`);

            if (now - lastTime < 10000) {
                console.warn('⚠️ RankingPreview: Throttled refresh (too frequent)');
                return;
            }

            if (academyId && !isLoadingRef.current) {
                console.warn('✅ RankingPreview: Promoting refresh');
                loadRanking(true);
                sessionStorage.setItem('last_ranking_fetch', now.toString());
            } else {
                console.warn('❌ RankingPreview: Skipped refresh (missing academyId or loading)');
            }
        };

        window.addEventListener('focus', handleRefresh);
        document.addEventListener('visibilitychange', handleRefresh);

        return () => {
            window.removeEventListener('focus', handleRefresh);
            document.removeEventListener('visibilitychange', handleRefresh);
        };
    }, [academyId, loadRanking]);
    */

    // 게스트는 숨김 (학원 미소속이어도 일단 렌더링 시도하되, API 호출에서 방어)
    if (!user) {
        console.warn('⛔ RankingPreview: Hidden (No user)');
        return null;
    }
    // academyId가 없어도 렌더링 자체는 하되 데이터 로드가 안될 뿐임 (에러 메시지 표시 가능)
    // 기존: if (!user?.academyId) return null; 

    // 안전장치: academyId가 없으면 빈 상태 반환
    if (!academyId) {
        console.warn('⛔ RankingPreview: Hidden (No academyId)');
        return null;
    }

    console.warn('👀 RankingPreview: Rendered');

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
                        <h3 className="text-sm font-bold text-slate-800">이달의 랭킹</h3>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold">
                        {currentMonth}월
                    </span>
                </div>

                {/* Top 3 */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500" />
                    </div>
                ) : top3.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">
                        아직 랭킹 데이터가 없습니다
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
                                        {item.completedDays}일
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {Math.round(item.averageScore)}점
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 하단 */}
                <div className="flex items-center justify-end mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-blue-500 font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-1">
                        상세 보기
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </button>

            {/* Detail Modal — createPortal로 body에 렌더링하여 z-index 문제 해결 */}
            {showDetail && createPortal(
                <RankingDetailModal
                    onClose={() => setShowDetail(false)}
                />,
                document.body
            )}
        </>
    );
}

export default RankingPreview;
