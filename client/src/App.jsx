import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './components/HomePage';
import ProposalForm from './components/forms/ProposalForm';

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

  const renderView = () => {
    switch (currentView) {
      case 'create-proposal':
        return <ProposalForm onBack={() => setCurrentView('home')} />;
      case 'send-proposal':
        return <div className="p-8 text-center">Send Proposal - Coming Soon</div>;
      case 'send-invoice':
        return <div className="p-8 text-center">Send Invoice - Coming Soon</div>;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {renderView()}
      </div>
    </QueryClientProvider>
  );
}

export default App;