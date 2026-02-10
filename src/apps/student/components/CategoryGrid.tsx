import { Category, CATEGORIES, CATEGORY_INFO, Level, LEVEL_INFO } from '../../../shared/types';

interface CategoryGridProps {
    level: Level;
    onCategorySelect: (category: Category) => void;
    getCategoryProgress?: (category: Category) => number; // 0-100
    categoryWordCounts?: Record<string, number>;
}

export function CategoryGrid({ level, onCategorySelect, getCategoryProgress, categoryWordCounts }: CategoryGridProps) {
    const levelInfo = LEVEL_INFO[level];
    const defaultPerCat = Math.floor(levelInfo.totalWords / CATEGORIES.length);

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

                    return (
                        <button
                            key={catId}
                            onClick={() => onCategorySelect(catId)}
                            className={`group relative overflow-hidden rounded-2xl border border-gray-100 ${cat.color} p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 active:scale-[0.98]`}
                        >
                            {/* Progress Bar Background */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
                                <div
                                    className={`h-full bg-gradient-to-r ${cat.gradientFrom} ${cat.gradientTo} transition-all duration-500`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Icon */}
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {cat.icon}
                            </div>

                            {/* Category Name */}
                            <h3 className={`font-bold text-base ${cat.textColor} mb-1`}>
                                {cat.nameKo}
                            </h3>

                            {/* Word Count */}
                            <p className="text-xs text-gray-500">
                                {wordCount}단어
                            </p>

                            {/* Progress */}
                            {progress > 0 && (
                                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color} ${cat.textColor}`}>
                                    {progress}% 완료
                                </span>
                            )}

                            {/* Hover Arrow */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className={`w-5 h-5 ${cat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryGrid;
