import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
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
} from '../../services/admin';
import { Level } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [students, setStudents] = useState<StudentListItem[]>([]);
    const [dayProgress, setDayProgress] = useState<DayProgress[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<Level>('middle');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [topWrongWords, setTopWrongWords] = useState<WrongWordStat[]>([]);
    const [atRiskIds, setAtRiskIds] = useState<Set<string>>(new Set());

    // 학생 등록 모달 상태
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAcademyName, setNewAcademyName] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [addError, setAddError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        loadDayProgress();
    }, [selectedLevel]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [statsData, studentsData, wrongWordsData, atRiskStudentsData] = await Promise.all([
                getDashboardStats(),
                getStudentList(),
                getGlobalTopWrongWords(),
                getAtRiskStudents(),
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
        const progress = await getDayProgressStats(selectedLevel);
        setDayProgress(progress);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleStudentClick = (studentId: string) => {
        navigate(`/admin/student/${studentId}`);
    };

    // 학생 등록 핸들러
    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAcademyName.trim() || !newStudentName.trim()) {
            setAddError('학원명과 학생 이름을 입력해주세요.');
            return;
        }

        setIsAdding(true);
        setAddError(null);

        const result = await createStudent({
            academyName: newAcademyName.trim(),
            studentName: newStudentName.trim(),
        });

        if (result.success) {
            setShowAddModal(false);
            setNewAcademyName('');
            setNewStudentName('');
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
        middle: '중등 필수',
        high: '고등 기초',
        advanced: '수능 심화',
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
                            <p className="text-sm text-gray-500">{user?.academyName} - {user?.studentName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        로그아웃
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">오늘의 학습 성실도</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats?.todayAttendance.active || 0}
                                    <span className="text-lg text-gray-400 font-normal ml-1">/ {stats?.todayAttendance.total || 0}</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">누적 마스터 단어</p>
                                <p className="text-3xl font-bold text-emerald-600">{(stats?.totalMastery || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ring-2 ring-red-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">중단 위험 학생</p>
                                <p className="text-3xl font-bold text-red-600">{stats?.atRiskCount || 0}명</p>
                                <p className="text-xs text-red-400 mt-1">3일 이상 미접속</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">평균 퀴즈 점수</p>
                                <p className="text-3xl font-bold text-orange-600">{stats?.averageScore || 0}점</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Day Progress Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Day별 학습 진행률</h2>
                            <div className="flex gap-2">
                                {(['middle', 'high', 'advanced'] as Level[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === level
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `D${value}`}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `${value}%`}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value ?? 0}%`, '완료율']}
                                        labelFormatter={(label) => `Day ${label}`}
                                    />
                                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                        {dayProgress.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.percentage >= 70 ? '#10b981' : entry.percentage >= 40 ? '#f59e0b' : '#ef4444'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Critical Words Top 10 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            학원 전체 오답 Top 10
                        </h2>
                        <div className="space-y-4">
                            {topWrongWords.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">데이터가 없습니다.</p>
                            ) : (
                                topWrongWords.map((word, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{word.word}</p>
                                                <p className="text-xs text-gray-500">{word.meaning}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                            {word.wrongCount}회
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">학생 목록</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="이름 또는 학원명 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학원/이름</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재 진도</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">완료 Day</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 점수</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근 접속</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${atRiskIds.has(student.id) ? 'bg-red-50/50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{student.studentName}</p>
                                                            {atRiskIds.has(student.id) && (
                                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">At Risk</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{student.academyName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Day {student.currentDay}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{student.completedDays}/30</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-medium ${student.averageScore >= 80 ? 'text-emerald-600' :
                                                    student.averageScore >= 60 ? 'text-orange-600' : 'text-red-600'
                                                    }`}>
                                                    {student.averageScore}점
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className={atRiskIds.has(student.id) ? 'text-red-600 font-medium' : ''}>
                                                    {formatLastLogin(student.lastLoginAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleStudentClick(student.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id, student.studentName)}
                                                        className="text-red-500 hover:text-red-700 font-medium text-sm"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">학생 등록</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setAddError(null);
                                    setNewAcademyName('');
                                    setNewStudentName('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    학원명
                                </label>
                                <input
                                    type="text"
                                    value={newAcademyName}
                                    onChange={(e) => setNewAcademyName(e.target.value)}
                                    placeholder="예: 서울학원"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isAdding}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    학생 이름
                                </label>
                                <input
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="예: 김철수"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isAdding}
                                />
                            </div>

                            {addError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {addError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setAddError(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                    disabled={isAdding}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
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

