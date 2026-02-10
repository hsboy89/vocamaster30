
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentDetail, StudentDetail, updateStudent } from '../../../shared/services/admin';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDarkMode } from '../../../shared/hooks';

export function StudentDetailPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { isDark, toggle: toggleDarkMode } = useDarkMode();
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 비밀번호 변경 상태
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (studentId) {
            loadStudentDetail(studentId);
        }
    }, [studentId]);

    const loadStudentDetail = async (id: string) => {
        setIsLoading(true);
        const data = await getStudentDetail(id);
        setStudent(data);
        setIsLoading(false);
    };

    const handleUpdatePassword = async () => {
        if (!student || !newPassword.trim()) return;

        if (!confirm('비밀번호를 변경하시겠습니까?')) return;

        const result = await updateStudent(student.user.id, {
            password: newPassword.trim()
        });

        if (result.success) {
            alert('비밀번호가 변경되었습니다.');
            setIsEditingPassword(false);
            setNewPassword('');
        } else {
            alert(result.error || '비밀번호 변경에 실패했습니다.');
        }
    };

    const handleShare = async () => {
        if (!student) return;

        const averageScore = student.recentQuizzes.length > 0
            ? (student.recentQuizzes.reduce((a, b) => a + b.score, 0) / student.recentQuizzes.length).toFixed(1)
            : 0;

        const shareData = {
            title: `${student.user.studentName} 학생 학습 리포트`,
            text: `[VocaMaster] ${student.user.studentName} 학생의 최근 학습 현황입니다.\n- 평균 점수: ${averageScore}점\n- 완료 Day: ${student.progressByLevel.reduce((sum, p) => sum + p.completedDays, 0)}일`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                alert('학습 리포트 내용이 복사되었습니다. 학부모님께 메시지로 전달해주세요.');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const levelNames: Record<string, string> = {
        middle: '중등 필수',
        high: '고등 기초',
        advanced: '수능 심화',
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400 font-medium">학생 정보 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-sm px-4">
                    <div className="mb-6 text-6xl">🔍</div>
                    <p className="text-gray-900 dark:text-white text-xl font-bold mb-2">학생을 찾을 수 없습니다</p>
                    <p className="text-gray-500 dark:text-slate-400 mb-8">존재하지 않거나 삭제된 학생의 정보입니다.</p>
                    <button
                        onClick={handleBack}
                        className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                    >
                        대시보드로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const totalCompleted = student.progressByLevel.reduce((sum, p) => sum + p.completedDays, 0);
    const totalDays = student.progressByLevel.reduce((sum, p) => sum + p.totalDays, 0);
    const overallProgress = Math.round((totalCompleted / totalDays) * 100);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            aria-label="뒤로 가기"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                                {student.user.studentName.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{student.user.studentName}</h1>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{student.user.academyName}</p>
                            </div>
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
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overall Progress */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">전체 학습 진행률</h2>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-slate-400">완료율</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
                                </div>
                                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${overallProgress}% ` }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {student.progressByLevel.map((progress) => (
                                    <div key={progress.level} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-center border border-transparent dark:border-white/5">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 font-medium">{levelNames[progress.level]}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {progress.completedDays}
                                            <span className="text-sm text-gray-400 dark:text-slate-500 font-normal ml-1">/ {progress.totalDays}</span>
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold tracking-wider mt-1">Days 완료</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quiz History Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">퀴즈 성적 추이</h2>
                            {student.recentQuizzes.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={student.recentQuizzes.slice().reverse()}>
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                                                tickFormatter={(value) => `D${value} `}
                                                axisLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                                                domain={[0, 100]}
                                                tickFormatter={(value) => `${value} 점`}
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
                                                formatter={(value) => [`${value ?? 0} 점`, '점수']}
                                                labelFormatter={(label) => `Day ${label} `}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 gap-2">
                                    <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="font-medium">아직 퀴즈 기록이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Quizzes Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">최근 퀴즈 결과</h2>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-500 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11.29 16.29L8.7 13.7C8.31 13.31 8.31 12.68 8.7 12.29C9.09 11.9 9.72 11.9 10.11 12.29L12 14.17L16.88 9.29C17.27 8.9 17.9 8.9 18.29 9.29C18.68 9.68 18.68 10.31 18.29 10.7L12.7 16.29C12.32 16.68 11.69 16.68 11.29 16.29Z" />
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z" opacity="0.3" />
                                        <path d="M19.07 10.59l-5-5c-0.38-0.38-1.02-0.38-1.41 0l-5 5c-0.39 0.39-0.39 1.02 0 1.41 0.39 0.39 1.02 0.39 1.41 0L12 9.41l2.93 2.93c0.39 0.39 1.02 0.39 1.41 0 0.39-0.38 0.39-1.02 0-1.75z" fill="none" />
                                        {/* Kakao-like icon simply represented or share icon */}
                                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                                    </svg>
                                    학부모 공유
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Day</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">레벨</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">유형</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">점수</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">일시</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {student.recentQuizzes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
                                                    아직 퀴즈 기록이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            student.recentQuizzes.map((quiz, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Day {quiz.day}</td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-slate-400 font-medium">{levelNames[quiz.level]}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline - flex px - 2.5 py - 1 text - [10px] font - bold rounded - md uppercase tracking - wider ${quiz.quizType === 'choice'
                                                            ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                            : quiz.quizType === 'spelling'
                                                                ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'
                                                                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                            } `}>
                                                            {quiz.quizType === 'choice' ? '객관식' : quiz.quizType === 'spelling' ? '철자' : '매칭'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font - bold text - base ${quiz.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                                                            quiz.score >= 60 ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'
                                                            } `}>
                                                            {quiz.score}
                                                            <span className="text-xs ml-0.5 opacity-70">점</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-slate-500">
                                                        {new Date(quiz.completedAt).toLocaleDateString('ko-KR')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Top Wrong Words */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                취약 단어 Top 5
                            </h2>
                            {student.topWrongWords.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3 opacity-20">🛡️</div>
                                    <p className="text-gray-400 dark:text-slate-500 text-sm">오답 기록이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {student.topWrongWords.map((wordItem, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all">
                                            <span className={`w - 8 h - 8 flex items - center justify - center rounded - xl text - xs font - bold ${index === 0 ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                                                index === 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' :
                                                    'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-slate-400'
                                                } `}>
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{wordItem.word}</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{wordItem.meaning}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm text-red-500 dark:text-red-400 font-bold">{wordItem.wrongCount}</span>
                                                <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold">회</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Student Info */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                학생 상세 정보
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">학원명</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{student.user.academyName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">이름</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{student.user.studentName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">학교 / 학년</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {student.user.school || '-'} {student.user.grade ? `(${student.user.grade})` : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">전화번호</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{student.user.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">학부모 연락처</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">{student.user.parentPhone || '-'}</span>
                                        {student.user.parentPhone && (
                                            <a
                                                href={`sms:${student.user.parentPhone}`}
                                                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                                                title="문자 보내기"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">목표 대학</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{student.user.targetUniversity || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">목표 학습 기간</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {student.user.goalDuration ? `${student.user.goalDuration}일` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">가입일</span>
                                    <span className="font-bold text-gray-900 dark:text-white lowercase">
                                        {student.user.createdAt
                                            ? new Date(student.user.createdAt).toLocaleDateString('ko-KR')
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">최근 접속</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400 lowercase">
                                        {student.user.lastLoginAt
                                            ? new Date(student.user.lastLoginAt).toLocaleDateString('ko-KR')
                                            : '-'}
                                    </span>
                                </div>

                                {/* Password Reset Section */}
                                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10">
                                    {!isEditingPassword ? (
                                        <button
                                            onClick={() => setIsEditingPassword(true)}
                                            className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                            비밀번호 변경
                                        </button>
                                    ) : (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="새 비밀번호 입력"
                                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsEditingPassword(false);
                                                        setNewPassword('');
                                                    }}
                                                    className="flex-1 py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white font-bold bg-gray-100 dark:bg-white/5 rounded-lg transition-colors"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={handleUpdatePassword}
                                                    disabled={!newPassword.trim()}
                                                    className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors disabled:opacity-50"
                                                >
                                                    변경 저장
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentDetailPage;
