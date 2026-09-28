import { Onboarding } from './features/onboarding/Onboarding';
import { supabase } from './lib/supabase/client';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './app/providers/AuthProvider';
import { Login } from './features/auth/Login';
import { Dashboard } from './features/dashboard/Dashboard';
import { Settings } from './features/dashboard/Settings';
import { CompanionDashboard } from './features/dashboard/CompanionDashboard'; 
import { HistoryCalendar } from './features/calendar/HistoryCalendar';

const ProtectedRoute = ({ children, requireSetup = true }: { children: ReactNode, requireSetup?: boolean }) => {
  const { user, loading: authLoading } = useAuth();
  const [isSetup, setIsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('setup_completed')
        .eq('id', user.id)
        .single();
      
      setIsSetup(data?.setup_completed || false);
    };
    if (user) checkProfile();
  }, [user]);

  if (authLoading || (user && requireSetup && isSetup === null)) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500 animate-pulse">Loading NumPy...</div>;
  }
  
  if (!user) return <Navigate to="/login" />;
  
  // Redirect to onboarding if they haven't completed it and are trying to access a restricted route
  if (requireSetup && isSetup === false) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute requireSetup={false}>
              <Onboarding />
            </ProtectedRoute>
           } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <HistoryCalendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companion" 
          element={
            <ProtectedRoute>
              <CompanionDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}