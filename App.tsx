import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { LandingPage } from '@/pages/LandingPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Loader2 } from 'lucide-react';

type Page = 'landing' | 'signin' | 'signup' | 'dashboard';

function AppContent() {
  const { user, loading, signOut, refreshProfile } = useAuth();
  const [page, setPage] = useState<Page>('landing');

  useEffect(() => {
    if (!loading) {
      if (user && (page === 'signin' || page === 'signup')) {
        setPage('dashboard');
      }
      if (!user && page === 'dashboard') {
        setPage('landing');
      }
    }
  }, [user, loading, page]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      refreshProfile();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setPage('landing');
  };

  if (page === 'dashboard' && user) {
    return <DashboardPage onSignOut={handleSignOut} />;
  }

  if (page === 'signin') {
    return <SignInPage onNavigate={setPage} />;
  }

  if (page === 'signup') {
    return <SignUpPage onNavigate={setPage} />;
  }

  return <LandingPage onNavigate={setPage} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
