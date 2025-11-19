import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Registration } from './views/Registration';
import { Verification } from './views/Verification';
import { AppView, Student } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from local storage on mount to persist data
  useEffect(() => {
    const saved = localStorage.getItem('secureid_students');
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load students', e);
      }
    }
  }, []);

  const handleRegister = (newStudent: Student) => {
    setStudents((prev) => {
      const updated = [...prev, newStudent];
      localStorage.setItem('secureid_students', JSON.stringify(updated));
      return updated;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard students={students} />;
      case AppView.REGISTER:
        return <Registration onRegister={handleRegister} />;
      case AppView.VERIFY:
        return <Verification students={students} />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
