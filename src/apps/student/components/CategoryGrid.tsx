import { Category, CATEGORIES, CATEGORY_INFO, Level, LEVEL_INFO } from '../../../shared/types';

interface CategoryGridProps {
    level: Level;
    onCategorySelect: (category: Category) => void;
    getCategoryProgress?: (category: Category) => number; // 0-100
    categoryWordCounts?: Record<string, number>;
    isGuest?: boolean;
    onLockedClick?: () => void;
}

export function CategoryGrid({ level, onCategorySelect, getCategoryProgress, categoryWordCounts, isGuest = false, onLockedClick }: CategoryGridProps) {
    const levelInfo = LEVEL_INFO[level];
    const defaultPerCat = Math.floor(levelInfo.totalWords / CATEGORIES.length);

    // 무료로 공개할 카테고리 (사회, 경제)
    const FREE_CATEGORIES = ['society', 'economy'];

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">📂 분야별 학습</h2>
                <p className="text-sm text-gray-500">
                    총 <span className="font-semibold text-blue-600">{levelInfo.totalWords.toLocaleString()}</span>개 단어 · 8개 분야
                </p>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {CATEGORIES.map((catId) => {
                    const cat = CATEGORY_INFO[catId];
                    const progress = getCategoryProgress ? getCategoryProgress(catId) : 0;
                    const wordCount = categoryWordCounts?.[catId] || defaultPerCat;

                    const isLocked = isGuest && !FREE_CATEGORIES.includes(catId);

                    return (
                        <button
                            key={catId}
                            onClick={(e) => {
                                if (isLocked) {
                                    e.stopPropagation();
                                    onLockedClick?.();
                                    return;
                                }
                                onCategorySelect(catId);
                            }}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left p-5
                                ${isLocked
                                    ? 'border-white/5 bg-slate-800/40 opacity-60 cursor-not-allowed'
                                    : `border-gray-100 ${cat.color} hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 active:scale-[0.98]`
                                }`}
                        >
                            {/* Locked Overlay */}
                            {isLocked && (
                                <div className="absolute inset-0 z-10 bg-[#020617]/40 backdrop-blur-[1px] flex items-center justify-center">
                                    <div className="bg-slate-800/80 p-2 rounded-full shadow-lg border border-white/10">
                                        <span className="text-xl">🔒</span>
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar Background */}
                            {!isLocked && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
                                    <div
                                        className={`h-full bg-gradient-to-r ${cat.gradientFrom} ${cat.gradientTo} transition-all duration-500`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`text-3xl mb-3 transition-transform duration-300 ${!isLocked && 'group-hover:scale-110'} ${isLocked && 'grayscale opacity-30 invert'}`}>
                                {cat.icon}
                            </div>

                            {/* Category Name */}
                            <h3 className={`font-bold text-base mb-1 ${isLocked ? 'text-slate-500' : cat.textColor}`}>
                                {cat.nameKo}
                            </h3>

                            {/* Word Count */}
                            <p className={`text-xs ${isLocked ? 'text-slate-600' : 'text-gray-500'}`}>
                                {wordCount}단어
                            </p>

                            {/* Progress */}
                            {progress > 0 && !isLocked && (
                                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color} ${cat.textColor}`}>
                                    {progress}% 완료
                                </span>
                            )}

                            {/* Hover Arrow */}
                            {!isLocked && (
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className={`w-5 h-5 ${cat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryGrid;
