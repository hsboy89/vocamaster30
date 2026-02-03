import { useState, useCallback } from 'react';
import { Level, LEVEL_INFO, WrongAnswer } from '../../../shared/types';
import { DayGrid } from '../components';
import { WrongAnswerNote } from '../../../shared/components';
import { useProgress } from '../../../shared/hooks';
import * as storage from '../../../shared/services/storage';

interface HomePageProps {
    level: Level;
    onDaySelect: (day: number) => void;
    isGuest?: boolean;
    onLockedClick?: () => void;
}

export function HomePage({ level, onDaySelect, isGuest, onLockedClick }: HomePageProps) {
    const { getCompletionRate } = useProgress();
    const [showWrongNote, setShowWrongNote] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

    const handleOpenWrongNote = () => {
        const data = storage.getWrongAnswers();
        // 현재 레벨에 맞는 오답만 필터링하거나 전체 보여주거나 선택.
        // 여기서는 전체를 보여주되, 레벨 필터링이 필요하다면 추가 가능.
        // 사용자가 '오답들은 정리됬다고 하는데' 라고 했으므로 전체 혹은 현재 레벨 필터링.
        // 데이터 구조상 level 정보가 있으므로 필터링 가능. 일단 전체 로드.
        setWrongAnswers(data);
        setShowWrongNote(true);
    };

    const handleRefreshWrongNote = useCallback(() => {
        const data = storage.getWrongAnswers();
        setWrongAnswers(data);
    }, []);

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white pb-12 pt-8 sm:pt-16 lg:pb-16 border-b border-slate-100">
                {/* ... (Hero content skipped for brevity, keeping original structure) ... */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30 -z-10" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-50/60 blur-3xl" />

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold shadow-sm">
                                    {LEVEL_INFO[level].nameKo} 과정
                                </span>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold shadow-sm">
                                    ✨ 30일마다 단어 업데이트
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-200 mb-6 leading-tight tracking-tight">
                                하루 10분,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                                    완벽한 어휘 루틴
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                                {LEVEL_INFO[level].description}
                                <br className="hidden sm:block" />
                                매일 10분 투자로 30일 뒤 달라진 실력을 경험하세요.
                            </p>
                        </div>

                        <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-center">
                            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[100px] text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-bold text-slate-800 mb-1">30</p>
                                <p className="text-sm font-medium text-slate-500">총 일수</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[100px] text-center transform hover:-translate-y-1 transition-transform duration-300 delay-75">
                                <p className="text-3xl font-bold text-blue-600 mb-1">{LEVEL_INFO[level].wordsPerDay}</p>
                                <p className="text-sm font-medium text-slate-500">일일 단어</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60 flex-1 md:flex-none min-w-[100px] text-center transform hover:-translate-y-1 transition-transform duration-300 delay-150">
                                <p className="text-3xl font-bold text-emerald-500 mb-1">{getCompletionRate(level)}%</p>
                                <p className="text-sm font-medium text-slate-500">완료율</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Day Grid */}
            <DayGrid
                level={level}
                onDaySelect={onDaySelect}
                onOpenWrongNote={handleOpenWrongNote}
                isGuest={isGuest}
                onLockedClick={onLockedClick}
            />
        </div>
    );
}

export default HomePage;
