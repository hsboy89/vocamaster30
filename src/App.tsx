import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Shared Types & Components
import { Level, Word, QuizType } from './shared/types';
import { Header, LoginPage, ProtectedRoute } from './shared/components';
import { AdminLoginLayout } from './shared/components/layout/AdminLoginLayout';
import { StudentLoginModal } from './shared/components/auth/StudentLoginModal';
import { useAuthStore } from './stores';
// Apps
import { HomePage, StudyPage, QuizPage } from './apps/student/pages';
import { AdminDashboard, StudentDetailPage } from './apps/admin/pages';
import { SuperAdminDashboard } from './apps/super-admin/pages';
import './index.css';

type StudentView = 'home' | 'study' | 'quiz';

interface QuizState {
  words: Word[];
  quizType: QuizType;
}

// Student App Component
function StudentApp() {
  const [currentLevel, setCurrentLevel] = useState<Level>('middle');
  const [currentView, setCurrentView] = useState<StudentView>('home');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const isGuest = !user;

  const handleLevelChange = (level: Level) => {
    setCurrentLevel(level);
    setCurrentView('home');
    setSelectedDay(null);
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setCurrentView('study');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedDay(null);
    setQuizState(null);
  };

  const handleQuizStart = (words: Word[], quizType: QuizType) => {
    setQuizState({ words, quizType });
    setCurrentView('quiz');
  };

  const handleLogout = () => {
    logout();
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
        />
      )}

      {currentView === 'study' && selectedDay !== null && (
        <StudyPage
          level={currentLevel}
          day={selectedDay}
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
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
