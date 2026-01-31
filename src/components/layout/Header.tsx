import { Level, LEVEL_INFO } from '../../types';

interface HeaderProps {
    currentLevel: Level;
    onLevelChange: (level: Level) => void;
}

export function Header({ currentLevel, onLevelChange }: HeaderProps) {
    const levels: Level[] = ['middle', 'high', 'advanced'];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4">
                {/* Logo */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <span className="text-white text-xl">📚</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Voca Master 30</h1>
                            <p className="text-xs text-gray-500">하루 10분, 30일 완성</p>
                        </div>
                    </div>
                </div>

                {/* Level Tabs */}
                <nav className="flex justify-center sm:justify-start gap-2 bg-slate-100/50 p-1.5 rounded-full backdrop-blur-sm inline-flex">
                    {levels.map((level) => (
                        <button
                            key={level}
                            onClick={() => onLevelChange(level)}
                            className={`tab text-sm sm:text-base ${currentLevel === level ? 'active' : ''
                                }`}
                        >
                            <span className="hidden sm:inline">{LEVEL_INFO[level].nameKo}</span>
                            <span className="sm:hidden">
                                {level === 'middle' ? '중등' : level === 'high' ? '고등' : '수능'}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;
