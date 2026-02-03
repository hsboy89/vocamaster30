import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores';
import { useDarkMode } from '../../../shared/hooks';

import {
    getAcademyList,
    getSuperAdminStats,
    createAcademy,
    updateAcademy,
    deleteAcademy,
    createAcademyAdmin,
    AcademyListItem,
    SuperAdminStats,
} from '../../../shared/services/superAdmin';

export function SuperAdminDashboard() {
    const { logout, isAuthenticated } = useAuthStore();
    const { isDark, toggle: toggleDarkMode } = useDarkMode();

    const [stats, setStats] = useState<SuperAdminStats | null>(null);
    const [academies, setAcademies] = useState<AcademyListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Default to false for background mode
    const [searchTerm, setSearchTerm] = useState('');

    // 학원 등록 모달
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAcademyCode, setNewAcademyCode] = useState('');
    const [newAcademyName, setNewAcademyName] = useState('');
    const [addError, setAddError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // 학원 수정 모달
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAcademyId, setEditAcademyId] = useState<string | null>(null);
    const [editAcademyCode, setEditAcademyCode] = useState('');
    const [editAcademyName, setEditAcademyName] = useState('');
    const [editAcademyStatus, setEditAcademyStatus] = useState<'active' | 'suspended' | 'trial'>('active');
    const [editError, setEditError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // 관리자 등록 모달
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [selectedAcademyId, setSelectedAcademyId] = useState<string | null>(null);
    const [selectedAcademyName, setSelectedAcademyName] = useState<string>('');
    const [newAdminId, setNewAdminId] = useState('');
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [adminError, setAdminError] = useState<string | null>(null);
    const [isAddingAdmin, setIsAddingAdmin] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [statsData, academyData] = await Promise.all([
            getSuperAdminStats(),
            getAcademyList(),
        ]);
        setStats(statsData);
        setAcademies(academyData);
        setIsLoading(false);
    };

    const handleLogout = () => {
        logout();
    };

    const handleAddAcademy = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Academy Validation
        if (!newAcademyCode.trim()) {
            setAddError('아이디를 확인해주세요.');
            return;
        }
        if (!newAcademyName.trim()) {
            setAddError('아이디를 확인해주세요.');
            return;
        }

        // 2. Admin Validation
        if (!newAdminPassword.trim()) {
            setAddError('비밀번호를 입력해주세요.');
            return;
        }
        if (newAdminPassword.length < 4) {
            setAddError('비밀번호는 4자 이상이어야 합니다.');
            return;
        }

        setIsAdding(true);
        setAddError(null);

        try {
            // 3. Create Academy
            const academyResult = await createAcademy({
                academyCode: newAcademyCode.trim(),
                name: newAcademyName.trim(),
            });

            if (!academyResult.success || !academyResult.academy) {
                throw new Error(academyResult.error || '학원 등록에 실패했습니다.');
            }

            // 4. Create Initial Admin
            const newAcademyId = academyResult.academy.id;
            const adminResult = await createAcademyAdmin({
                academyId: newAcademyId,
                adminId: newAcademyCode.trim(), // Use Academy Code as Admin ID
                studentName: '관리자', // Default admin name
                password: newAdminPassword.trim(),
            });

            if (!adminResult.success) {
                // Academy was created but Admin failed. 
                // Ideally we should rollback (delete academy), but for now just warn.
                // Or maybe try to delete?
                // For simplicity, let's treat it as a partial success/error.
                throw new Error(`학원은 등록되었으나 관리자 생성 중 오류가 발생했습니다: ${adminResult.error}`);
            }

            // Success
            setShowAddModal(false);
            setNewAcademyCode('');
            setNewAcademyName('');
            setNewAdminId('');
            setNewAdminName('');
            setNewAdminPassword('');
            loadData();
            alert('학원과 초기 관리자가 성공적으로 등록되었습니다.');

        } catch (error) {
            const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
            setAddError(message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteAcademy = async (academyId: string, academyName: string) => {
        if (!confirm(`"${academyName}" 학원을 삭제하시겠습니까?\n\n주의: 해당 학원의 모든 학생 데이터가 삭제됩니다.`)) {
            return;
        }

        const result = await deleteAcademy(academyId);
        if (result.success) {
            loadData();
        } else {
            alert(result.error || '학원 삭제에 실패했습니다.');
        }
    };

    const openEditModal = (academy: AcademyListItem) => {
        setEditAcademyId(academy.id);
        setEditAcademyCode(academy.academyCode);
        setEditAcademyName(academy.name);
        setEditAcademyStatus(academy.status);
        setEditError(null);
        setShowEditModal(true);
    };

    const handleEditAcademy = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editAcademyId) return;

        if (!editAcademyName.trim()) {
            setEditError('학원명을 입력해주세요.');
            return;
        }

        setIsEditing(true);
        setEditError(null);

        const result = await updateAcademy(editAcademyId, {
            name: editAcademyName.trim(),
            status: editAcademyStatus,
        });

        if (result.success) {
            setShowEditModal(false);
            setEditAcademyId(null);
            loadData();
        } else {
            setEditError(result.error || '학원 수정에 실패했습니다.');
        }
        setIsEditing(false);
    };

    const openAdminModal = (academyId: string, academyName: string) => {
        setSelectedAcademyId(academyId);
        setSelectedAcademyName(academyName);
        setShowAdminModal(true);
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAcademyId) return;

        if (!newAdminId.trim()) {
            setAdminError('관리자 ID를 입력해주세요.');
            return;
        }
        if (!newAdminName.trim()) {
            setAdminError('관리자 이름을 입력해주세요.');
            return;
        }
        if (!newAdminPassword.trim()) {
            setAdminError('비밀번호를 입력해주세요.');
            return;
        }
        if (newAdminPassword.length < 4) {
            setAdminError('비밀번호는 4자 이상이어야 합니다.');
            return;
        }

        setIsAddingAdmin(true);
        setAdminError(null);

        const result = await createAcademyAdmin({
            academyId: selectedAcademyId,
            adminId: newAdminId.trim(),
            studentName: newAdminName.trim(),
            password: newAdminPassword.trim(),
        });

        if (result.success) {
            setShowAdminModal(false);
            setNewAdminId('');
            setNewAdminName('');
            setNewAdminPassword('');
            setSelectedAcademyId(null);
            alert('관리자 계정이 생성되었습니다.');
        } else {
            setAdminError(result.error || '관리자 생성에 실패했습니다.');
        }
        setIsAddingAdmin(false);
    };

    const filteredAcademies = academies.filter(academy =>
        academy.name.includes(searchTerm) ||
        academy.academyCode.includes(searchTerm)
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const statusLabels: Record<string, { text: string; color: string }> = {
        active: { text: '활성', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
        suspended: { text: '정지', color: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' },
        trial: { text: '체험', color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' },
    };

    if (isLoading && isAuthenticated && !stats) {
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">슈퍼 관리자</h1>
                            {isAuthenticated && (
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    학원 통합 관리 시스템
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
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

                        {isAuthenticated && (
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
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">전체 학원</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalAcademies || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">활성 학원</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.activeAcademies || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">전체 학생</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalStudents || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">학원 관리자</p>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.totalAdmins || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academy List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">학원 목록</h2>
                            <div className="flex items-center gap-4 flex-1 justify-end min-w-[300px]">
                                <div className="relative flex-1 max-w-xs">
                                    <input
                                        type="text"
                                        placeholder="학원명 또는 코드 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/20 whitespace-nowrap"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    학원 등록
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">학원 코드</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">학원명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">상태</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">학생 수</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">등록일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {filteredAcademies.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                            {searchTerm ? '검색 결과가 없습니다.' : '등록된 학원이 없습니다.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAcademies.map((academy) => (
                                        <tr key={academy.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <code className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-sm font-mono text-gray-800 dark:text-slate-300">
                                                    {academy.academyCode}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {academy.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[academy.status]?.color}`}>
                                                    {statusLabels[academy.status]?.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-slate-300">
                                                {academy.studentCount}명
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                                {formatDate(academy.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => openEditModal(academy)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => openAdminModal(academy.id, academy.name)}
                                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-sm"
                                                    >
                                                        관리자 추가
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAcademy(academy.id, academy.name)}
                                                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
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

            {/* Add Academy Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">학원 등록</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setAddError(null);
                                    setNewAcademyCode('');
                                    setNewAcademyName('');
                                    setNewAdminId('');
                                    setNewAdminName('');
                                    setNewAdminPassword('');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddAcademy} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학원 코드
                                </label>
                                <input
                                    type="text"
                                    value={newAcademyCode}
                                    onChange={(e) => setNewAcademyCode(e.target.value)}
                                    placeholder="예: seoulST (영문, 숫자)"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isAdding}
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">학생들이 로그인할 때 사용하는 코드</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학원명
                                </label>
                                <input
                                    type="text"
                                    value={newAcademyName}
                                    onChange={(e) => setNewAcademyName(e.target.value)}
                                    placeholder="예: 서울영어학원"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isAdding}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">관리자 비밀번호 설정</h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                            초기 비밀번호
                                        </label>
                                        <input
                                            type="password"
                                            value={newAdminPassword}
                                            onChange={(e) => setNewAdminPassword(e.target.value)}
                                            placeholder="4자 이상 입력"
                                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                            disabled={isAdding}
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">생성된 관리자 계정의 ID는 학원 코드와 동일하게 설정됩니다.</p>
                                    </div>
                                </div>
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
                                        setNewAcademyCode('');
                                        setNewAcademyName('');
                                        setNewAdminId('');
                                        setNewAdminName('');
                                        setNewAdminPassword('');
                                    }}
                                    className="flex-1 px-4 py-3.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                                    disabled={isAdding}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-600 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                >
                                    {isAdding ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Academy Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">학원 수정</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditError(null);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleEditAcademy} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학원 코드
                                </label>
                                <input
                                    type="text"
                                    value={editAcademyCode}
                                    disabled
                                    className="w-full px-4 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-500 dark:text-slate-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">학원 코드는 변경할 수 없습니다</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    학원명
                                </label>
                                <input
                                    type="text"
                                    value={editAcademyName}
                                    onChange={(e) => setEditAcademyName(e.target.value)}
                                    placeholder="예: 서울영어학원"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    상태
                                </label>
                                <select
                                    value={editAcademyStatus}
                                    onChange={(e) => setEditAcademyStatus(e.target.value as 'active' | 'suspended' | 'trial')}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    disabled={isEditing}
                                >
                                    <option value="active">활성</option>
                                    <option value="trial">체험</option>
                                    <option value="suspended">정지</option>
                                </select>
                            </div>

                            {editError && (
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                                    {editError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditError(null);
                                    }}
                                    className="flex-1 px-4 py-3.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                                    disabled={isEditing}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isEditing}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                >
                                    {isEditing ? '수정 중...' : '수정하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 등록</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{selectedAcademyName}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAdminModal(false);
                                    setAdminError(null);
                                    setNewAdminId('');
                                    setNewAdminName('');
                                    setNewAdminPassword('');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    관리자 ID
                                </label>
                                <input
                                    type="text"
                                    value={newAdminId}
                                    onChange={(e) => setNewAdminId(e.target.value)}
                                    placeholder="예: admin01"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isAddingAdmin}
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">로그인 시 사용하는 ID</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    관리자 이름
                                </label>
                                <input
                                    type="text"
                                    value={newAdminName}
                                    onChange={(e) => setNewAdminName(e.target.value)}
                                    placeholder="예: 김관리"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isAddingAdmin}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    value={newAdminPassword}
                                    onChange={(e) => setNewAdminPassword(e.target.value)}
                                    placeholder="4자 이상 입력"
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:placeholder-slate-500"
                                    disabled={isAddingAdmin}
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">관리자 로그인 시 사용하는 비밀번호</p>
                            </div>

                            {adminError && (
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                                    {adminError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAdminModal(false);
                                        setAdminError(null);
                                    }}
                                    className="flex-1 px-4 py-3.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                                    disabled={isAddingAdmin}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAddingAdmin}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-600 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                >
                                    {isAddingAdmin ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SuperAdminDashboard;
