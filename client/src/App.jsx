import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProposalGenerator from './pages/ProposalGenerator';
import InvoiceEmails from './pages/InvoiceEmails';
import ProposalEmails from './pages/ProposalEmails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proposal-generator" element={<ProposalGenerator />} />
            <Route path="/invoice-emails" element={<InvoiceEmails />} />
            <Route path="/proposal-emails" element={<ProposalEmails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;