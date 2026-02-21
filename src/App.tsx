import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Shared Types & Components
import { Level, Word, QuizType, Category } from './shared/types';
import { Header, LoginPage, ProtectedRoute } from './shared/components';
import { AdminLoginLayout } from './shared/components/layout/AdminLoginLayout';
import { StudentLoginModal } from './shared/components/auth/StudentLoginModal';
import { ErrorBoundary } from './shared/components/common/ErrorBoundary';
import { useAuthStore } from './stores';
// Apps
import { HomePage, StudyPage, QuizPage, PromotionTestPage } from './apps/student/pages';
import { AdminDashboard, StudentDetailPage } from './apps/admin/pages';
import { SuperAdminDashboard } from './apps/super-admin/pages';
import './index.css';

type StudentView = 'home' | 'study' | 'quiz' | 'promotion-test';

interface QuizState {
  words: Word[];
  quizType: QuizType;
}

/**
 * 라우트 세션 가드 — URL과 세션 역할이 맞지 않으면 자동 로그아웃
 * 예: super_admin 세션으로 /student 접속 시 → 자동 로그아웃
 */
function useRouteSessionGuard() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const path = location.pathname;
    const role = user.role;

    // 학생 페이지에 관리자 세션이 남아있으면 강제 로그아웃
    if (path.startsWith('/student') && role !== 'student') {
      console.warn(`🚫 Route guard: "${role}" session on student page → auto logout`);
      logout();
      return;
    }

    // 관리자 페이지에 학생 세션이 남아있으면 강제 로그아웃
    if (path.startsWith('/admin') && role === 'student') {
      console.warn(`🚫 Route guard: "${role}" session on admin page → auto logout`);
      logout();
      return;
    }

    // 수퍼관리자 페이지에 학생/관리자 세션이 남아있으면 강제 로그아웃
    if (path.startsWith('/super-admin') && role !== 'super_admin') {
      console.warn(`🚫 Route guard: "${role}" session on super-admin page → auto logout`);
      logout();
      return;
    }
  }, [location.pathname, user?.role]);
}

// Student App Component
function StudentApp() {
  const [currentLevel, setCurrentLevel] = useState<Level>('middle_1');
  const [currentView, setCurrentView] = useState<StudentView>('home');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const isGuest = !user;

  // Sync local quiz results when user logs in (학생만)
  useEffect(() => {
    if (user && user.role === 'student') {
      import('./shared/services/storage').then(({ syncLocalQuizResultsToCloud }) => {
        syncLocalQuizResultsToCloud();
      });
    }
  }, [user?.id]);

  const handleLevelChange = (level: Level) => {
    setCurrentLevel(level);
    setCurrentView('home');
    setSelectedDay(null);
    setSelectedCategory(null);
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setSelectedCategory(null);
    setCurrentView('study');
  };



  const handleBack = () => {
    setCurrentView('home');
    setSelectedDay(null);
    setSelectedCategory(null);
    setQuizState(null);
  };

  const handleQuizStart = (words: Word[], quizType: QuizType) => {
    setQuizState({ words, quizType });
    setCurrentView('quiz');
  };

  const handleLogout = () => {
    logout();
  };

  // Promotion Test Handlers
  const handlePromotionTest = () => {
    setCurrentView('promotion-test');
  };

  const handlePromotionPass = () => {
    // 다음 레벨로 이동
    const levelOrder = ['middle_1', 'middle_2', 'high_1', 'high_2', 'csat'] as const;
    const currentIndex = levelOrder.indexOf(currentLevel);
    if (currentIndex < levelOrder.length - 1) {
      setCurrentLevel(levelOrder[currentIndex + 1]);
    }
    setCurrentView('home');
  };

  const handlePromotionFail = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - always visible on home */}
      {currentView === 'home' && (
        <Header
          currentLevel={currentLevel}
          onLevelChange={handleLevelChange}
          userName={user?.studentName}
          academyName={user?.academyName}
          onLogout={handleLogout}
          onLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* Page Content */}
      {currentView === 'home' && (
        <HomePage
          level={currentLevel}
          onDaySelect={handleDaySelect}
          isGuest={isGuest}
          onLockedClick={() => setIsLoginModalOpen(true)}
          onPromotionTest={handlePromotionTest}
        />
      )}

      {currentView === 'study' && selectedDay !== null && (
        <StudyPage
          level={currentLevel}
          day={selectedDay}
          category={selectedCategory}
          onBack={handleBack}
          onQuizStart={handleQuizStart}
        />
      )}

      {currentView === 'quiz' && selectedDay !== null && quizState && (
        <QuizPage
          level={currentLevel}
          day={selectedDay}
          words={quizState.words}
          initialQuizType={quizState.quizType}
          onBack={handleBack}
        />
      )}

      {currentView === 'promotion-test' && (
        <PromotionTestPage
          level={currentLevel}
          onBack={handleBack}
          onPass={handlePromotionPass}
          onFail={handlePromotionFail}
        />
      )}

      {/* Guest Login Modal */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

// Root Router Component
function AppRouter() {
  // 모든 라우트에서 세션 역할 충돌 방지
  useRouteSessionGuard();

  return (
    <Routes>
      {/* Redirect root to student */}
      <Route path="/" element={<Navigate to="/student" replace />} />

      {/* Login Route (Still available for direct access if needed, redirects if logged in) */}
      <Route
        path="/login"
        element={
          <LoginPage hideAdminTab={true} />
        }
      />

      {/* Student Routes - Open to everyone (Guest Mode enabled) */}
      <Route
        path="/student/*"
        element={<StudentApp />}
      />

      {/* Super Admin Routes - Blurred Login Overlay */}
      <Route
        path="/super-admin"
        element={
          <AdminLoginLayout>
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          </AdminLoginLayout>
        }
      />

      {/* Admin Routes - Blurred Login Overlay */}
      <Route
        path="/admin/*"
        element={
          <AdminLoginLayout useSimplifiedAdminLogin={true}>
            <Routes>
              <Route index element={
                <ProtectedRoute allowedRoles={['academy_admin', 'super_admin', 'admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="student/:studentId" element={
                <ProtectedRoute allowedRoles={['academy_admin', 'super_admin', 'admin']}>
                  <StudentDetailPage />
                </ProtectedRoute>
              } />
            </Routes>
          </AdminLoginLayout>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/student" replace />}
      />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    console.warn('🚀 App: Mounted');
    return () => console.warn('👋 App: Unmounted');
  }, []);
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

