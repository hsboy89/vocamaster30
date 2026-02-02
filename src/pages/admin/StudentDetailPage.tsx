import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentDetail, StudentDetail } from '../../services/admin';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function StudentDetailPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">학생 정보 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">학생 정보를 찾을 수 없습니다.</p>
                    <button onClick={handleBack} className="text-blue-600 hover:underline">
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        대시보드로 돌아가기
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                            {student.user.studentName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{student.user.studentName}</h1>
                            <p className="text-gray-500">{student.user.academyName}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overall Progress */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">전체 학습 진행률</h2>
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">완료율</span>
                                    <span className="text-sm font-medium text-gray-900">{overallProgress}%</span>
                                </div>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {student.progressByLevel.map((progress) => (
                                    <div key={progress.level} className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-500 mb-1">{levelNames[progress.level]}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {progress.completedDays}/{progress.totalDays}
                                        </p>
                                        <p className="text-xs text-gray-400">Days 완료</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quiz History Chart */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">퀴즈 성적 추이</h2>
                            {student.recentQuizzes.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={student.recentQuizzes.slice().reverse()}>
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) => `D${value}`}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                domain={[0, 100]}
                                                tickFormatter={(value) => `${value}점`}
                                            />
                                            <Tooltip
                                                formatter={(value) => [`${value ?? 0}점`, '점수']}
                                                labelFormatter={(label) => `Day ${label}`}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    아직 퀴즈 기록이 없습니다.
                                </div>
                            )}
                        </div>

                        {/* Recent Quizzes Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">최근 퀴즈 결과</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">레벨</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">퀴즈 유형</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">점수</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">일시</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {student.recentQuizzes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                    아직 퀴즈 기록이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            student.recentQuizzes.map((quiz, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">Day {quiz.day}</td>
                                                    <td className="px-6 py-4 text-gray-600">{levelNames[quiz.level]}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${quiz.quizType === 'choice'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : quiz.quizType === 'spelling'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {quiz.quizType === 'choice' ? '객관식' : quiz.quizType === 'spelling' ? '철자' : '매칭'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-medium ${quiz.score >= 80 ? 'text-emerald-600' :
                                                            quiz.score >= 60 ? 'text-orange-600' : 'text-red-600'
                                                            }`}>
                                                            {quiz.score}점
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
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
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">자주 틀리는 단어 Top 5</h2>
                            {student.topWrongWords.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">오답 기록이 없습니다.</p>
                            ) : (
                                <div className="space-y-3">
                                    {student.topWrongWords.map((wordItem, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-red-100 text-red-600' :
                                                index === 1 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-gray-200 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{wordItem.word}</p>
                                                <p className="text-sm text-gray-500 truncate">{wordItem.meaning}</p>
                                            </div>
                                            <span className="text-sm text-red-500 font-medium">{wordItem.wrongCount}회</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Student Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">학생 정보</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">학원명</span>
                                    <span className="font-medium text-gray-900">{student.user.academyName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">이름</span>
                                    <span className="font-medium text-gray-900">{student.user.studentName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">가입일</span>
                                    <span className="font-medium text-gray-900">
                                        {student.user.createdAt
                                            ? new Date(student.user.createdAt).toLocaleDateString('ko-KR')
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">최근 접속</span>
                                    <span className="font-medium text-gray-900">
                                        {student.user.lastLoginAt
                                            ? new Date(student.user.lastLoginAt).toLocaleDateString('ko-KR')
                                            : '-'}
                                    </span>
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
