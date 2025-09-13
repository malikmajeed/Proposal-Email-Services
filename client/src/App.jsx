import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './components/HomePage';
import ProposalForm from './components/forms/ProposalForm';
import Login from './components/Login';
import useAuth from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('home');
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'create-proposal':
        return <ProposalForm onBack={() => setCurrentView('home')} />;
      case 'send-proposal':
        return <div className="p-8 text-center">Send Proposal - Coming Soon</div>;
      case 'send-invoice':
        return <div className="p-8 text-center">Send Invoice - Coming Soon</div>;
      default:
        return <HomePage onNavigate={setCurrentView} onLogout={logout} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {renderView()}
      </div>
    </QueryClientProvider>
  );
}

export default App;