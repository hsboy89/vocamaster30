import { useState } from 'react';
import { Level, Word, QuizType } from './types';
import { Header, PasswordLock } from './components';
import { HomePage, StudyPage, QuizPage } from './pages';
import './index.css';

type View = 'home' | 'study' | 'quiz';

interface QuizState {
  words: Word[];
  quizType: QuizType;
}

function App() {
  const [currentLevel, setCurrentLevel] = useState<Level>('middle');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);

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

  return (
    <PasswordLock>
      <div className="min-h-screen bg-gray-50">
        {/* Header - always visible */}
        {currentView === 'home' && (
          <Header currentLevel={currentLevel} onLevelChange={handleLevelChange} />
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
    </PasswordLock>
  );
}

export default App;
