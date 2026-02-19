import { useState, useEffect } from 'react';
import { Level, Word, QuizType, Category, LEVEL_INFO, CATEGORY_INFO, StudyPlan } from '../../../shared/types';
import { getVocabulary, getCategoryWords, getWordsByIds } from '../../../shared/data';
import { shuffle } from '../../../shared/utils/study-planner';
import { useProgress } from '../../../shared/hooks';
import { StudyCard, StudyHeaderControls, StudyFooterControls } from '../components';
import { useAuthStore } from '../../../stores';
import * as storage from '../../../shared/services/storage';
import { generateDayVocaPDF } from '../../../shared/services/pdfGenerator';

type HideMode = 'none' | 'word' | 'meaning' | 'synonyms';

const AUTO_SPEAK_STORAGE_KEY = 'vocamaster-auto-speak';
const PLAN_STORAGE_KEY = 'vocamaster-study-plan';

interface StudyPageProps {
    level: Level;
    day: number;
    category?: Category | null;
    onBack: () => void;
    onQuizStart: (words: Word[], quizType: QuizType) => void;
}

export function StudyPage({ level, day, category, onBack, onQuizStart }: StudyPageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hideMode, setHideMode] = useState<HideMode>('none');
    const [words, setWords] = useState<Word[]>([]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
        const stored = localStorage.getItem(AUTO_SPEAK_STORAGE_KEY);
        return stored === 'true';
    });
    const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

    // ... (existing state)

    const handleDownloadPdf = async (mode: 'study' | 'test') => {
        if (words.length === 0) return;

        setIsPdfMenuOpen(false); // Close menu
        setIsGeneratingPdf(true);
        try {
            await generateDayVocaPDF(level, day, words, category, mode);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('PDF 생성 중 오류가 발생했습니다.');
        }
        setIsGeneratingPdf(false);
    };
    const [memorizedWordIds, setMemorizedWordIds] = useState<Set<string>>(new Set());
    const { getStatus, setStatus, addMemorizedWord, removeMemorizedWord } = useProgress();
    const { isGuest } = useAuthStore();
    const [isPlanMode, setIsPlanMode] = useState(false); // 플랜 모드 여부

    // Save autoSpeak preference
    useEffect(() => {
        localStorage.setItem(AUTO_SPEAK_STORAGE_KEY, String(autoSpeak));
    }, [autoSpeak]);



    useEffect(() => {
        let loadedWords: Word[] = [];
        let isUsingPlan = false;

        if (category) {
            // 카테고리 모드: 해당 분야 전체 단어
            loadedWords = getCategoryWords(level, category);
        } else {
            // 일별 모드
            // 1. 단기 목표 플랜 확인
            try {
                const storedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
                if (storedPlan) {
                    const plan: StudyPlan = JSON.parse(storedPlan);
                    // 현재 레벨과 플랜 레벨이 같고, 해당 Day에 할당된 단어가 있는지 확인
                    if (plan.level === level && plan.schedule[day]) {
                        const wordIds = plan.schedule[day];
                        loadedWords = getWordsByIds(level, wordIds);
                        isUsingPlan = true;
                    }
                }
            } catch (e) {
                console.error("Failed to load study plan", e);
            }

            // 2. 플랜이 없거나 실패했으면 기본 로직 사용
            if (!isUsingPlan) {
                const vocab = getVocabulary(level, day);
                if (vocab) loadedWords = vocab.words;
            }
        }

        setIsPlanMode(isUsingPlan);

        if (loadedWords.length > 0) {
            setWords(loadedWords);
            if (!category) {
                const currentStatus = getStatus(level, day);
                if (currentStatus === 'not-started') {
                    setStatus(level, day, 'in-progress');
                }

                // 암기한 단어 ID 목록 비동기 로드
                (async () => {
                    const progress = await storage.getProgress(level, day);
                    if (progress) {
                        setMemorizedWordIds(new Set(progress.memorizedWords));
                    } else {
                        setMemorizedWordIds(new Set());
                    }
                })();
            } else {
                setMemorizedWordIds(new Set());
            }
        }
    }, [level, day, category, setStatus, getStatus]);

    // Handlers
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = async () => {
        if (currentIndex < words.length - 1) {
            // "Next(>)" = Confidence. Automatically mark current word as memorized.
            const currentWordId = words[currentIndex].id;
            if (!memorizedWordIds.has(currentWordId)) {
                await addMemorizedWord(level, day, currentWordId, words.length);
                setMemorizedWordIds(prev => new Set(Array.from(prev).concat(currentWordId)));
            }
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleMemorized = async () => {
        const currentWordId = words[currentIndex].id;
        if (memorizedWordIds.has(currentWordId)) {
            await removeMemorizedWord(level, day, currentWordId);
            setMemorizedWordIds(prev => {
                const next = new Set(prev);
                next.delete(currentWordId);
                return next;
            });
        } else {
            await addMemorizedWord(level, day, currentWordId, words.length);
            setMemorizedWordIds(prev => new Set(Array.from(prev).concat(currentWordId)));
        }
    };

    const handleQuizStart = () => {
        onQuizStart(shuffle(words), 'choice');
    };

    const handleStudyComplete = async () => {
        // 학습완료 버튼 클릭 시 Day를 완료 처리하고 홈으로 돌아감
        await setStatus(level, day, 'completed');
        onBack();
    };



    // Derived state
    if (words.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">단어 데이터를 불러오는 중...</p>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    // Guest Locking Logic
    const isLocked = isGuest && day >= 4;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-[#020617] pb-12 selection:bg-blue-500/30">
                {/* Background Decorative Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full" />
                </div>

                {/* Header (Premium) */}
                <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="hidden sm:inline font-bold text-sm tracking-tight">돌아가기</span>
                        </button>
                        <div className="text-center">
                            <h1 className="font-black text-white tracking-tight">
                                {LEVEL_INFO[level].nameKo}
                            </h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {category ? CATEGORY_INFO[category].nameKo : `Day ${day.toString().padStart(2, '0')}`}
                            </p>
                        </div>
                        <div className="w-20" />
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
                    {/* Blurred Content Preview */}
                    <div className="filter blur-xl pointer-events-none select-none opacity-20 scale-95 transition-all duration-1000">
                        <StudyCard
                            word={words[0]} // Show first word blurred
                            hideMode="none"
                            isMemorized={false}
                        />
                    </div>

                    {/* Lock Overlay (Premium Glass) */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 animate-fade-in-up">
                        <div
                            className="w-full max-w-sm p-10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
                            style={{
                                background: 'rgba(30, 41, 59, 0.7)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-500/20 blur-3xl rounded-full" />

                            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-2xl border border-white/10 transform -rotate-6">
                                🔒
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                                체험판 종료
                            </h2>
                            <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                                Day 4부터는 <span className="text-blue-400 font-bold">정식 등록</span> 후<br />
                                모든 학습 기능을 무제한으로<br />
                                이용하실 수 있습니다.
                            </p>
                            <button
                                onClick={() => {
                                    useAuthStore.getState().logout();
                                }}
                                className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                                <div className="flex items-center justify-center gap-2 relative z-10">
                                    <span>로그인 하러 가기</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#020617] pb-12 selection:bg-blue-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="hidden sm:inline font-bold text-sm tracking-tight">돌아가기</span>
                    </button>

                    <div className="text-center group flex-1 mx-4">
                        <h1 className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {LEVEL_INFO[level].nameKo}
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                            <div className="flex flex-col items-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    {category ? CATEGORY_INFO[category].nameKo : `Day ${day.toString().padStart(2, '0')}`}
                                </p>
                                {isPlanMode && !category && (
                                    <span className="text-[10px] text-blue-400 font-bold tracking-tight bg-blue-500/10 px-2 py-0.5 rounded-full mt-1">
                                        ✨ 스마트 코스
                                    </span>
                                )}
                            </div>
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                            title="자료 다운로드"
                        >
                            <span className="hidden sm:inline font-bold text-sm tracking-tight">
                                자료 다운로드
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isPdfMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsPdfMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50 animate-fade-in-up">
                                    <button
                                        onClick={() => handleDownloadPdf('study')}
                                        disabled={isGeneratingPdf}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="text-lg">📖</span>
                                        <span className="font-bold text-sm">단어 암기장</span>
                                        {isGeneratingPdf && <span className="text-xs animate-pulse">...</span>}
                                    </button>
                                    <div className="h-px bg-slate-700" />
                                    <button
                                        onClick={() => handleDownloadPdf('test')}
                                        disabled={isGeneratingPdf}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="text-lg">✍️</span>
                                        <span className="font-bold text-sm">단어 시험지</span>
                                        {isGeneratingPdf && <span className="text-xs animate-pulse">...</span>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 relative z-10">
                {/* Header Controls (Progress & Nav) - Moved to top for better UX */}
                <div className="animate-fade-in-up">
                    <StudyHeaderControls
                        currentIndex={currentIndex}
                        totalWords={words.length}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                    />
                </div>

                {/* Study Card */}
                <div className="animate-fade-in-up [animation-delay:100ms]">
                    <StudyCard
                        word={currentWord}
                        hideMode={hideMode}
                        autoSpeak={autoSpeak}
                        isMemorized={memorizedWordIds.has(currentWord.id)}
                        onMemorized={handleMemorized}
                    />
                </div>

                {/* Footer Controls (Options & Quiz) */}
                <div className="animate-fade-in-up [animation-delay:200ms]">
                    <StudyFooterControls
                        hideMode={hideMode}
                        autoSpeak={autoSpeak}
                        onHideModeChange={setHideMode}
                        onAutoSpeakChange={setAutoSpeak}
                        onQuizStart={handleQuizStart}
                        onStudyComplete={!category ? handleStudyComplete : undefined}
                        isLastWord={currentIndex === words.length - 1}
                    />
                </div>
            </div>
        </div>
    );
}

export default StudyPage;

