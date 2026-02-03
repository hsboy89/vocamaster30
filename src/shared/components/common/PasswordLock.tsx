import { useState, useEffect } from 'react';

interface PasswordLockProps {
    children: React.ReactNode;
}

export function PasswordLock({ children }: PasswordLockProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const authSet = sessionStorage.getItem('voca_auth');
        if (authSet === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === 'first1234') {
            sessionStorage.setItem('voca_auth', 'true');
            setIsUnlocking(true);
            setError('');
            // 애니메이션 후 완전 인증 상태로 전환
            setTimeout(() => {
                setIsAuthenticated(true);
            }, 600);
        } else {
            setError('비밀번호가 올바르지 않습니다.');
            setPassword('');
        }
    };

    // 이미 인증된 상태면 children만 렌더링
    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen">
            {/* 블러 처리된 배경 콘텐츠 - 살짝만 흐리게 */}
            <div
                className={`transition-all duration-600 ${isUnlocking
                        ? 'animate-unblur'
                        : 'blur-[3px] brightness-100'
                    }`}
                style={{ pointerEvents: 'none' }}
            >
                {children}
            </div>

            {/* 오버레이 + 모달 (잠금 해제 시 페이드 아웃) */}
            {!isUnlocking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 반투명 오버레이 - 더 투명하게 */}
                    <div className="absolute inset-0 bg-slate-900/30" />

                    {/* 비밀번호 모달 */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up">
                        <div className="mb-6">
                            <span className="text-6xl mb-4 block">🔒</span>
                            <h2 className="text-2xl font-bold text-gray-900">수강생 전용</h2>
                            <p className="text-gray-500 mt-2">
                                접근 권한이 필요합니다.<br />
                                부여받은 비밀번호를 입력해주세요.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호 입력"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-center text-lg"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium animate-shake">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <span>접속하기</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
