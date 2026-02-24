import { Level, LEVEL_INFO } from '../../types';
import { useDarkMode } from '../../hooks';

interface HeaderProps {
    currentLevel: Level;
    onLevelChange: (level: Level) => void;
    userName?: string;
    academyName?: string;
    onLogout?: () => void;
    onLogin?: () => void;
}

export function Header({ currentLevel, onLevelChange, userName, academyName, onLogout, onLogin }: HeaderProps) {
    const levels: Level[] = ['middle_1', 'middle_2', 'high_1', 'high_2', 'csat'];
    const { isDark, toggle } = useDarkMode();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4">
                {/* Logo and User Info */}
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.location.href = '/'}
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                            <img
                                src="https://zvdqkxkgrgclecjhkqny.supabase.co/storage/v1/object/public/images/IMG_7060.png"
                                alt="Voca Master Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to emoji if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const fallback = document.createElement('span');
                                    fallback.className = 'text-white text-xl';
                                    fallback.textContent = '📚';
                                    e.currentTarget.parentElement?.classList.add('gradient-primary');
                                    e.currentTarget.parentElement?.appendChild(fallback);
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">The First Voca Master</h1>
                            <p className="text-xs text-gray-400 dark:text-slate-300 font-medium">하루 10분, 30일 완성</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* User Info or Guest Login */}
                        {userName ? (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-white/5 rounded-full border border-blue-100/50 dark:border-white/10 transition-all">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{academyName}</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{userName}</span>
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                            >
                                로그인
                            </button>
                        )}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggle}
                            className="dark-mode-toggle"
                            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                        >
                            {isDark ? (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Logout/Login Button - Only show logout icon if logged in to avoid duplicate buttons */}
                        {userName && onLogout && (
                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="로그아웃"
                                title="로그아웃"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <nav className="flex justify-center sm:justify-start gap-2 bg-slate-100/50 p-1.5 rounded-full backdrop-blur-sm overflow-x-auto">
                    {levels.map((level) => {
                        const info = LEVEL_INFO[level];
                        const isComingSoon = info.isComingSoon;

                        return (
                            <button
                                key={level}
                                onClick={() => {
                                    if (isComingSoon) {
                                        alert('준비중입니다.');
                                        return;
                                    }
                                    onLevelChange(level);
                                }}
                                className={`tab text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap ${currentLevel === level ? 'active' : ''
                                    } ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {info.nameKo}
                                {isComingSoon && <span className="ml-1 text-[10px] opacity-70">(준비중)</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}

export default Header;


