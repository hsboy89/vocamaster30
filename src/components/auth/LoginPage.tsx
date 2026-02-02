import { useState } from 'react';
import { useAuthStore } from '../../stores';

type LoginTab = 'student' | 'admin';

export function LoginPage() {
    const [activeTab, setActiveTab] = useState<LoginTab>('student');
    const [academyName, setAcademyName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');

    const { login, adminLogin, isLoading, error, setError } = useAuthStore();

    const handleStudentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!academyName.trim() || !studentName.trim()) {
            setError('학원명과 이름을 모두 입력해주세요.');
            return;
        }

        await login({ academyName: academyName.trim(), studentName: studentName.trim() });
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!adminId.trim() || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        await adminLogin(adminId.trim(), password);
    };

    const handleTabChange = (tab: LoginTab) => {
        setActiveTab(tab);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations - slightly brightened for contrast */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />

            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">VocaMaster30</h1>
                    <p className="text-blue-100 text-sm">하루 10분, 완벽한 어휘 루틴</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => handleTabChange('student')}
                        className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${activeTab === 'student'
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            학생
                        </span>
                    </button>
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${activeTab === 'admin'
                            ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            관리자
                        </span>
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    {activeTab === 'student' ? (
                        <form onSubmit={handleStudentLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    학원명
                                </label>
                                <input
                                    type="text"
                                    value={academyName}
                                    onChange={(e) => setAcademyName(e.target.value)}
                                    placeholder="예: 서울영어학원"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="예: 김철수"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        로그인 중...
                                    </>
                                ) : (
                                    <>
                                        <span>학습 시작하기</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    value={adminId}
                                    onChange={(e) => setAdminId(e.target.value)}
                                    placeholder="admin"
                                    autoComplete="off"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        로그인 중...
                                    </>
                                ) : (
                                    <>
                                        <span>관리자 접속</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 text-center">
                    <p className="text-xs text-slate-500">
                        {activeTab === 'student'
                            ? '관리자가 등록한 학생만 로그인할 수 있습니다.'
                            : '관리자 계정이 필요하시면 담당자에게 문의하세요.'}
                    </p>
                </div>
            </div>
        </div>
    );

}

export default LoginPage;
