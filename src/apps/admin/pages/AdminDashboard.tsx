import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Level } from '../../../shared/types';
import { useAuthStore } from '../../../stores';
import { useDarkMode } from '../../../shared/hooks';
import {
    getDashboardStats,
    getStudentList,
    getDayProgressStats,
    getAtRiskStudents,
    getGlobalTopWrongWords,
    createStudent,
    deleteStudent,
    DashboardStats,
    StudentListItem,
    DayProgress,
    WrongWordStat
} from '../../../shared/services/admin';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDark, toggle: toggleDarkMode } = useDarkMode();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [students, setStudents] = useState<StudentListItem[]>([]);
    const [dayProgress, setDayProgress] = useState<DayProgress[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<Level>('middle_1');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Default to false to show UI structure in background mode
    const [topWrongWords, setTopWrongWords] = useState<WrongWordStat[]>([]);
    const [atRiskIds, setAtRiskIds] = useState<Set<string>>(new Set());

    // 학생 등록 모달 상태
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAcademyName, setNewAcademyName] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [newSchool, setNewSchool] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newParentPhone, setNewParentPhone] = useState('');
    const [newGrade, setNewGrade] = useState('');
    const [newTargetUniversity, setNewTargetUniversity] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [addError, setAddError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadDayProgress();
        }
    }, [selectedLevel, user]);

    const loadDashboardData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const academyId = user.academyId; // Multi-tenant scoping
            const [statsData, studentsData, wrongWordsData, atRiskStudentsData] = await Promise.all([
                getDashboardStats(academyId),
                getStudentList(academyId),
                getGlobalTopWrongWords(academyId),
                getAtRiskStudents(academyId),
            ]);
            setStats(statsData);
            setStudents(studentsData);
            setTopWrongWords(wrongWordsData);
            setAtRiskIds(new Set(atRiskStudentsData.map(s => s.id)));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        setIsLoading(false);
    };

    const loadDayProgress = async () => {
        if (!user) return;
        const progress = await getDayProgressStats(selectedLevel, user.academyId);
        setDayProgress(progress);
    };

    const handleLogout = () => {
        logout();
    };

    const handleStudentClick = (studentId: string) => {
        navigate(`/admin/student/${studentId}`);
    };

    // 학생 등록 핸들러
    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        const isSuperAdmin = user?.role === 'super_admin';
        const targetAcademyId = user?.academyId;
        const targetAcademyName = newAcademyName.trim();

        // 유효성 검사
        if (isSuperAdmin && !targetAcademyName) {
            setAddError('학원명을 입력해주세요.');
            return;
        }

        if (!newStudentName.trim()) {
            setAddError('학생 이름을 입력해주세요.');
            return;
        }

        setIsAdding(true);
        setAddError(null);

        const result = await createStudent({
            academyId: targetAcademyId,
            academyName: isSuperAdmin ? targetAcademyName : undefined,
            studentName: newStudentName.trim(),
            school: newSchool.trim(),
            phone: newPhone.trim(),
            parentPhone: newParentPhone.trim(),
            grade: newGrade.trim(),
            targetUniversity: newTargetUniversity.trim(),
            password: newPassword.trim() || undefined,
        });

        if (result.success) {
            setShowAddModal(false);
            setNewAcademyName('');
            setNewStudentName('');
            setNewSchool('');
            setNewPhone('');
            setNewParentPhone('');
            setNewGrade('');
            setNewTargetUniversity('');
            setNewPassword('');
            loadDashboardData(); // 목록 새로고침
        } else {
            setAddError(result.error || '학생 등록에 실패했습니다.');
        }
        setIsAdding(false);
    };

    // 학생 삭제 핸들러
    const handleDeleteStudent = async (studentId: string, studentName: string) => {
        if (!confirm(`${studentName} 학생을 삭제하시겠습니까?`)) return;

        const result = await deleteStudent(studentId);
        if (result.success) {
            loadDashboardData(); // 목록 새로고침
        } else {
            alert(result.error || '학생 삭제에 실패했습니다.');
        }
    };

    const filteredStudents = students.filter(student =>
        student.studentName.includes(searchTerm) ||
        student.academyName.includes(searchTerm)
    );

    const formatLastLogin = (dateString: string | null) => {
        if (!dateString) return '접속 기록 없음';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return '방금 전';
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    const levelNames: Record<Level, string> = {
        middle_1: '중등 필수',
        middle_2: '중등 심화',
        high_1: '고등 필수',
        high_2: '고등 심화',
        csat: '수능 빈출',
    };

    // Only show loading if we have a user and are actually fetching
    if (isLoading && user && !stats) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">데이터 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
                            {user && (
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {user.academyName} - {user.role === 'super_admin' ? '최고 관리자' : '관리자'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            aria-label="테마 변경"
                        >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {user && (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">로그아웃</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">오늘의 학습 성실도</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats?.todayAttendance.active || 0}
                                    <span className="text-lg text-gray-400 dark:text-slate-500 font-normal ml-1">/ {stats?.todayAttendance.total || 0}</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">누적 마스터 단어</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{(stats?.totalMastery || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5 ring-2 ring-red-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">중단 위험 학생</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.atRiskCount || 0}명</p>
                                <p className="text-xs text-red-400 dark:text-red-500/80 mt-1">3일 이상 미접속</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">평균 퀴즈 점수</p>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.averageScore || 0}점</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Day Progress Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Day별 학습 진행률</h2>
                            <div className="flex gap-2">
                                {(['middle_1', 'middle_2', 'high_1', 'high_2', 'csat'] as Level[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLevel === level
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {levelNames[level].split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dayProgress}>
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                                        tickFormatter={(value) => `D${value}`}
                                        axisLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                                        tickFormatter={(value) => `${value}%`}
                                        domain={[0, 100]}
                                        axisLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                            borderColor: isDark ? '#334155' : '#e2e8f0',
                                            borderRadius: '12px',
                                            color: isDark ? '#f1f5f9' : '#1e293b'
                                        }}
                                        itemStyle={{ color: isDark ? '#cbd5e1' : '#475569' }}
                                        formatter={(value) => [`${value ?? 0}%`, '완료율']}
                                        labelFormatter={(label) => `Day ${label}`}
                                    />
                                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                        {dayProgress.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.percentage >= 70 ? '#10b981' : entry.percentage >= 40 ? '#f59e0b' : '#ef4444'}
                                                fillOpacity={isDark ? 0.8 : 1}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Critical Words Top 10 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            학원 전체 오답 Top 10
                        </h2>
                        <div className="space-y-4">
                            {topWrongWords.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-slate-500 py-10">데이터가 없습니다.</p>
                            ) : (
                                topWrongWords.map((word, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{word.word}</p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">{word.meaning}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md">
                                            {word.wrongCount}회
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Student List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">학생 목록</h2>
                            <div className="flex items-center gap-4 flex-1 justify-end min-w-[300px]">
                                <div className="relative flex-1 max-w-xs">
                                    <input
                                        type="text"
                                        placeholder="이름 또는 학원명 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 whitespace-nowrap"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    학생 등록
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">학원/이름</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">현재 진도</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">완료 Day</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">평균 점수</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">최근 접속</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                            {searchTerm ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${atRiskIds.has(student.id) ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900 dark:text-white">{student.studentName}</p>
                                                            {atRiskIds.has(student.id) && (
                                                                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold rounded uppercase">At Risk</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-slate-400">{student.academyName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                                                    Day {student.currentDay}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-slate-300">
                                                {student.completedDays}/{student.goalDuration || 30}
                                                {student.goalDuration && (
                                                    <span className="ml-1 text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded">
                                                        목표
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-medium ${student.averageScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                                                    student.averageScore >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {student.averageScore}점
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                                <span className={atRiskIds.has(student.id) ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                                                    {formatLastLogin(student.lastLoginAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleStudentClick(student.id)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id, student.studentName)}
                                                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">학생 등록</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setAddError(null);
                                    setNewAcademyName('');
                                    setNewStudentName('');
                                    setNewSchool('');
                                    setNewPhone('');
                                    setNewParentPhone('');
                                    setNewGrade('');
                                    setNewTargetUniversity('');
                                    setNewPassword('');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddStudent} className="space-y-6">
                            {user?.role === 'super_admin' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                        학원명
                                    </label>
                                    <input
                                        type="text"
                                        value={newAcademyName}
                                        onChange={(e) => setNewAcademyName(e.target.value)}
                                        placeholder="예: 서울학원"
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                        disabled={isAdding}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학생 이름
                                </label>
                                <input
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="예: 김철수"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                    disabled={isAdding}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    비밀번호
                                </label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="로그인 비밀번호 (선택사항)"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all font-mono"
                                    disabled={isAdding}
                                    autoComplete="new-password"
                                />
                                <p className="text-xs text-gray-400 mt-1">입력하지 않으면 비밀번호 없이 로그인할 수 있습니다.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                        학교
                                    </label>
                                    <input
                                        type="text"
                                        value={newSchool}
                                        onChange={(e) => setNewSchool(e.target.value)}
                                        placeholder="예: 서울고"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                        disabled={isAdding}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                        학년
                                    </label>
                                    <input
                                        type="text"
                                        value={newGrade}
                                        onChange={(e) => setNewGrade(e.target.value)}
                                        placeholder="예: 고1"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                        disabled={isAdding}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    전화번호
                                </label>
                                <input
                                    type="text"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="010-0000-0000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                    disabled={isAdding}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학부모 연락처
                                </label>
                                <input
                                    type="text"
                                    value={newParentPhone}
                                    onChange={(e) => setNewParentPhone(e.target.value)}
                                    placeholder="010-0000-0000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                    disabled={isAdding}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    목표 대학
                                </label>
                                <input
                                    type="text"
                                    value={newTargetUniversity}
                                    onChange={(e) => setNewTargetUniversity(e.target.value)}
                                    placeholder="예: 서울대학교"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-500 transition-all"
                                    disabled={isAdding}
                                />
                            </div>

                            {addError && (
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                                    {addError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setAddError(null);
                                    }}
                                    className="flex-1 px-4 py-3.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                                    disabled={isAdding}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                >
                                    {isAdding ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
