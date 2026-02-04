import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores';
import { Academy } from '../../types';

type LoginTab = 'student' | 'admin';

interface LoginPageProps {
    initialTab?: LoginTab;
    onSuccess?: () => void;
    isEmbedded?: boolean;
    hideAdminTab?: boolean;
    hideStudentTab?: boolean;
    useSimplifiedAdminLogin?: boolean;
}

export function LoginPage({
    initialTab = 'student',
    onSuccess,
    isEmbedded = false,
    hideAdminTab = false,
    hideStudentTab = false,
    useSimplifiedAdminLogin = false
}: LoginPageProps) {
    const [activeTab, setActiveTab] = useState<LoginTab>(initialTab);
    const [academyCode, setAcademyCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');

    // 학원 정보 조회를 위한 상태
    const [currentAcademy, setCurrentAcademy] = useState<Academy | null>(null);

    const { login, adminLogin, fetchAcademy, isLoading, error, setError } = useAuthStore();

    // 테마 색상 동적 적용
    const primaryColor = currentAcademy?.settings?.theme?.primary || '#2563eb'; // 기본 blue-600

    useEffect(() => {
        // 학원 코드가 입력되면 정보 조회 (디바운싱 적용 가능, 여기선 간단히 blur나 버튼 등의 트리거 없이 입력 길이 체크 또는 별도 로직)
        // 실제로는 사용자가 입력을 마치고 포커스를 옮길 때(onBlur)나 3글자 이상일 때 조회하는 것이 좋음
        // 여기서는 UX 단순화를 위해 onBlur에서 처리하도록 input에 핸들러 추가 예정
    }, [academyCode]);

    const handleAcademyCodeBlur = async (val?: string) => {
        const codeToFetch = (val || academyCode).trim();
        if (codeToFetch.length >= 2) {
            const academy = await fetchAcademy(codeToFetch);
            if (academy) {
                setCurrentAcademy(academy);
                // 학원별 테마 적용 (CSS 변수 활용 가능)
                document.documentElement.style.setProperty('--primary-color', academy.settings.theme.primary);
            } else {
                setCurrentAcademy(null);
            }
        }
    };

    const handleStudentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!academyCode.trim() || !studentName.trim()) {
            setError('학원 코드와 이름을 모두 입력해주세요.');
            return;
        }

        const result = await login({ academyCode: academyCode.trim(), studentName: studentName.trim() });
        if (result && onSuccess) {
            onSuccess();
        }
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!adminId.trim() || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        // 슈퍼 관리자인 경우 academyCode가 없을 수 있음
        const result = await adminLogin({
            academyCode: useSimplifiedAdminLogin ? adminId.trim() : academyCode.trim(),
            adminId: adminId.trim(),
            password
        });
        if (result && onSuccess) {
            onSuccess();
        }
    };

    const handleTabChange = (tab: LoginTab) => {
        setActiveTab(tab);
        setError(null);
    };

    const containerClasses = isEmbedded
        ? "w-full"
        : "min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500";

    return (
        <div className={containerClasses}>
            {/* Background decorations - dynamic color based on academy theme (Only for non-embedded) */}
            {!isEmbedded && (
                <>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 transition-colors duration-500"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
                </>
            )}

            <div className={`relative bg-slate-900/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full overflow-hidden ${!isEmbedded ? 'max-w-md' : ''}`}>
                {/* Header */}
                <div
                    className="p-8 text-center transition-all duration-500"
                    style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${activeTab === 'admin' ? '#10b981' : primaryColor})`
                    }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {currentAcademy ? currentAcademy.name : 'VocaMaster30'}
                    </h1>
                    <p className="text-white/80 text-sm">
                        {currentAcademy ? '학생 관리 대시보드' : '하루 10분, 완벽한 어휘 루틴'}
                    </p>
                </div>

                {/* Tabs */}
                {(!hideAdminTab && !hideStudentTab) && (
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => handleTabChange('student')}
                            className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${activeTab === 'student'
                                ? 'text-white border-b-2 bg-white/5'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                            style={{ borderColor: activeTab === 'student' ? primaryColor : 'transparent' }}
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
                )}

                {/* Form Content */}
                <div className="p-8">
                    {activeTab === 'student' ? (
                        <form onSubmit={handleStudentLogin} className="space-y-5">
                            {!useSimplifiedAdminLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        발급 코드
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={academyCode}
                                            onChange={(e) => setAcademyCode(e.target.value)}
                                            onBlur={() => handleAcademyCodeBlur()}
                                            placeholder="예: seoul01"
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:ring-2 transition-all outline-none"
                                            style={{
                                                borderColor: currentAcademy ? primaryColor : 'rgba(255,255,255,0.1)',
                                                ['--tw-ring-color' as any]: primaryColor
                                            }}
                                            disabled={isLoading}
                                        />
                                        {currentAcademy && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {currentAcademy && (
                                        <p className="text-xs text-emerald-400 mt-1 ml-1">
                                            ✨ {currentAcademy.name}에 오신 것을 환영합니다!
                                        </p>
                                    )}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="예: 김철수"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:ring-2 transition-all outline-none"
                                    style={{ ['--tw-ring-color' as any]: primaryColor }}
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
                                className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: `0 10px 15px -3px ${primaryColor}40`
                                }}
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
                                    {useSimplifiedAdminLogin ? '학원 코드 (ID)' : '관리자 아이디'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={adminId}
                                        onChange={(e) => setAdminId(e.target.value)}
                                        onBlur={() => useSimplifiedAdminLogin && handleAcademyCodeBlur(adminId)}
                                        placeholder={useSimplifiedAdminLogin ? "학원 코드를 입력하세요" : "admin"}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                        disabled={isLoading}
                                    />
                                    {useSimplifiedAdminLogin && currentAcademy && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {useSimplifiedAdminLogin && currentAcademy && (
                                    <p className="text-xs text-emerald-400 mt-1 ml-1">
                                        ✨ {currentAcademy.name} 관리자님 안녕하세요!
                                    </p>
                                )}
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
                            ? '발급받은 코드를 입력하여 로그인하세요.'
                            : '서비스 관리자 및 학원장 전용 로그인입니다.'}
                    </p>
                </div>
            </div>
        </div >
    );
}

export default LoginPage;
