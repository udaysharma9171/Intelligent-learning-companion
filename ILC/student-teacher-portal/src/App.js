import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPortal from './components/auth/AuthPortal';
import StudentDashboard from './components/dashboard/StudentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import './styles/globals.css';

function AppContent() {
  const { user } = useAuth();

  // Render different dashboards based on user type
  if (!user || !user.isAuthenticated) {
    return <AuthPortal />;
  }

  // Route to appropriate dashboard
  switch (user.userType) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    default:
      return <AuthPortal />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;