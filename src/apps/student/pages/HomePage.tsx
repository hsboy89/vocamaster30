import { useState, useCallback } from 'react';
import { Level, Category, LEVEL_INFO, CATEGORIES, WrongAnswer } from '../../../shared/types';
import { DayGrid, CategoryGrid, GoalSetting } from '../components';
import { WrongAnswerNote } from '../../../shared/components';
import { useProgress } from '../../../shared/hooks';
import * as storage from '../../../shared/services/storage';
import { getCategoryWordCounts } from '../../../shared/data';

interface HomePageProps {
    level: Level;
    onDaySelect: (day: number) => void;
    onCategorySelect: (category: Category) => void;
    isGuest?: boolean;
    onLockedClick?: () => void;
}

export function HomePage({ level, onDaySelect, onCategorySelect, isGuest, onLockedClick }: HomePageProps) {
    const { getCompletionRate, getStatus } = useProgress();
    const [showWrongNote, setShowWrongNote] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
    const [goalDays, setGoalDays] = useState<number | null>(null);

    const handleOpenWrongNote = () => {
        const data = storage.getWrongAnswers();
        setWrongAnswers(data);
        setShowWrongNote(true);
    };

    const handleRefreshWrongNote = useCallback(() => {
        const data = storage.getWrongAnswers();
        setWrongAnswers(data);
    }, []);

    const handleCategorySelect = (category: Category) => {
        onCategorySelect(category);
    };

    const handleStartToday = () => {
        for (let day = 1; day <= 30; day++) {
            if (getStatus(level, day) !== 'completed') {
                onDaySelect(day);
                return;
            }
        }
        onDaySelect(1);
    };

    if (showWrongNote) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    <WrongAnswerNote
                        wrongAnswers={wrongAnswers}
                        onRefresh={handleRefreshWrongNote}
                        onClose={() => setShowWrongNote(false)}
                    />
                </div>
            </div>
        );
    }

    const completionRate = getCompletionRate(level);
    const levelInfo = LEVEL_INFO[level];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section — 간결한 레벨 요약 */}
            <section className="relative overflow-hidden bg-white pb-8 pt-8 sm:pt-12 border-b border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30 -z-10" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-50/60 blur-3xl" />

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold shadow-sm">
                                    {levelInfo.nameKo} 과정
                                </span>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-sm font-semibold shadow-sm">
                                    📖 총 {levelInfo.totalWords.toLocaleString()}단어
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                                하루 10분,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                                    완벽한 어휘 루틴
                                </span>
                            </h1>
                            <p className="text-base text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto md:mx-0">
                                {levelInfo.description}
                            </p>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <button
                                    onClick={handleStartToday}
                                    className="btn btn-primary py-3 px-6 text-base shadow-lg hover:shadow-xl transition-all"
                                >
                                    <span className="mr-2">🚀</span>
                                    오늘의 학습 시작
                                </button>
                                <button
                                    onClick={handleOpenWrongNote}
                                    className="btn btn-outline py-3 px-6 text-base"
                                >
                                    <span className="mr-2">📝</span>
                                    오답노트 복습
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4 md:gap-5 w-full md:w-auto justify-center">
                            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[90px] text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-2xl font-bold text-slate-800 mb-0.5">{CATEGORIES.length}</p>
                                <p className="text-xs font-medium text-slate-500">분야</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[90px] text-center transform hover:-translate-y-1 transition-transform duration-300 delay-75">
                                <p className="text-2xl font-bold text-blue-600 mb-0.5">{levelInfo.totalWords.toLocaleString()}</p>
                                <p className="text-xs font-medium text-slate-500">총 단어</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[90px] text-center transform hover:-translate-y-1 transition-transform duration-300 delay-150">
                                <p className="text-2xl font-bold text-emerald-500 mb-0.5">{completionRate}%</p>
                                <p className="text-xs font-medium text-slate-500">진도율</p>
                            </div>
                        </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-6">
                        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700 rounded-full"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 단기 목표 설정 */}
            <GoalSetting level={level} onGoalChange={(days) => setGoalDays(days)} />

            {/* 분야별 카테고리 그리드 */}
            <CategoryGrid
                level={level}
                onCategorySelect={handleCategorySelect}
                categoryWordCounts={getCategoryWordCounts(level)}
                isGuest={isGuest}
                onLockedClick={onLockedClick}
            />

            {/* 기존 30일 Day Grid (하단에 유지) */}
            <div className="border-t border-gray-100 mt-4">
                <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">📅 일별 학습</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {goalDays ? `${goalDays}일 목표 학습` : '30일 과정으로 체계적으로 학습하세요'}
                    </p>
                </div>
                <DayGrid
                    level={level}
                    onDaySelect={onDaySelect}
                    onOpenWrongNote={handleOpenWrongNote}
                    isGuest={isGuest}
                    onLockedClick={onLockedClick}
                    maxDays={goalDays || 30}
                />
            </div>
        </div>
    );
}

export default HomePage;
