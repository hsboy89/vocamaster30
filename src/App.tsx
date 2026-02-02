import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Level, Word, QuizType } from './types';
import { Header, LoginPage, ProtectedRoute } from './components';
import { HomePage, StudyPage, QuizPage, AdminDashboard, StudentDetailPage, SuperAdminDashboard } from './pages';
import { useAuthStore } from './stores';
import './index.css';

type StudentView = 'home' | 'study' | 'quiz';

interface QuizState {
  words: Word[];
  quizType: QuizType;
}

// Student App Component (contains the original app logic)
function StudentApp() {
  const [currentLevel, setCurrentLevel] = useState<Level>('middle');
  const [currentView, setCurrentView] = useState<StudentView>('home');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const { user, logout } = useAuthStore();

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
        />
      )}

      {/* Page Content */}
      {currentView === 'home' && (
        <HomePage
          level={currentLevel}
          onDaySelect={handleDaySelect}
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
    </div>
  );
}

// Root Router Component
function AppRouter() {
  const { isAuthenticated, user } = useAuthStore();

  // Helper to check user roles
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'academy_admin' || user?.role === 'super_admin' || user?.role === 'admin';

  // Get redirect path based on role
  const getRedirectPath = () => {
    if (isSuperAdmin) return '/super-admin';
    if (isAdmin) return '/admin';
    return '/student';
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={getRedirectPath()} replace />
            : <LoginPage />
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentApp />
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['academy_admin', 'super_admin', 'admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/student/:studentId"
        element={
          <ProtectedRoute allowedRoles={['academy_admin', 'super_admin', 'admin']}>
            <StudentDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="*"
        element={
          isAuthenticated
            ? <Navigate to={getRedirectPath()} replace />
            : <Navigate to="/login" replace />
        }
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
